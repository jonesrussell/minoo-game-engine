#!/usr/bin/env python3
"""Local Ford Frenzy art-library inspector (issue #103).

Reads a private archive layout with source-index.json and originals/ff-NNN.ext
files. Writes inventory.json and paginated contact-sheet PNGs. Not a game
runtime dependency.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import traceback
import textwrap
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFont

SCHEMA_VERSION = 1
ID_PATTERN = re.compile(r"^ff-\d{3}$")
EXT_PATTERN = re.compile(r"^[a-z0-9]{1,10}$")
CONTACT_COLUMNS = 4
CONTACT_ROWS = 5
CONTACT_PAGE_SIZE = CONTACT_COLUMNS * CONTACT_ROWS
TILE_SIZE = 256
LABEL_HEIGHT = 44
CELL_PADDING = 10
PAGE_PADDING = 16
CHECKER_SIZE = 8
CHECKER_LIGHT = (204, 204, 204, 255)
CHECKER_DARK = (153, 153, 153, 255)
VECTOR_EXTENSIONS = frozenset({"ai", "svg", "eps"})


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def asset_id(index: int) -> str:
    return f"ff-{index:03d}"


def extension_from_title(title: Any) -> tuple[str, list[str]]:
    diagnostics: list[str] = []
    if not isinstance(title, str) or not title.strip():
        diagnostics.append('missing or invalid title; using extension "bin"')
        return "bin", diagnostics

    basename = title.replace("\\", "/").split("/")[-1].strip()
    if "." not in basename:
        diagnostics.append(f'no extension in title "{basename}"; using "bin"')
        return "bin", diagnostics

    ext = basename.rsplit(".", 1)[-1].lower()
    if not EXT_PATTERN.match(ext):
        diagnostics.append(f'unsafe extension "{ext}" in title; using "bin"')
        return "bin", diagnostics

    return ext, diagnostics


def expected_filename(entry_id: str, ext: str) -> str:
    if not ID_PATTERN.match(entry_id):
        raise ValueError(f"invalid asset id: {entry_id}")
    if not EXT_PATTERN.match(ext):
        raise ValueError(f"invalid extension: {ext}")
    return f"{entry_id}.{ext}"


def resolve_original_path(archive_dir: Path, entry_id: str, ext: str) -> Path:
    return archive_dir / "originals" / expected_filename(entry_id, ext)


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(65536), b""):
            digest.update(chunk)
    return digest.hexdigest()


def extract_psd_info(image: Image.Image, diagnostics: list[str]) -> dict[str, Any] | None:
    info: dict[str, Any] = {}

    if hasattr(image, "n_frames"):
        try:
            info["frame_count"] = int(image.n_frames)
        except Exception as exc:  # noqa: BLE001 - per-file diagnostic
            diagnostics.append(f"PSD frame count unavailable: {exc}")

    layer_names: list[str] = []
    layers = getattr(image, "layers", None)
    if layers is not None:
        try:
            for layer in layers:
                if isinstance(layer, tuple) and layer and isinstance(layer[0], str):
                    layer_names.append(layer[0])
                    continue
                if isinstance(layer, str):
                    layer_names.append(layer)
                    continue
                name = getattr(layer, "name", None)
                if name:
                    layer_names.append(str(name))
            if layer_names:
                info["layer_names"] = layer_names
                info["layer_count"] = len(layer_names)
        except Exception as exc:  # noqa: BLE001
            diagnostics.append(f"PSD layer metadata unavailable: {exc}")
    elif hasattr(image, "layer_count"):
        try:
            info["layer_count"] = int(image.layer_count)
        except Exception as exc:  # noqa: BLE001
            diagnostics.append(f"PSD layer count unavailable: {exc}")

    if not info:
        diagnostics.append(
            "PSD opened as composite only; Pillow did not expose layer structure"
        )
        return None

    return info


def inspect_image(path: Path, ext: str) -> dict[str, Any]:
    result: dict[str, Any] = {
        "dimensions": None,
        "mode": None,
        "previewable": False,
        "psd": None,
        "diagnostics": [],
    }

    if ext in VECTOR_EXTENSIONS:
        result["diagnostics"].append(
            f"{ext.upper()} vector source; Pillow does not render this format for inventory preview"
        )
        return result

    try:
        with Image.open(path) as image:
            result["mode"] = image.mode
            width, height = image.size
            result["dimensions"] = {"width": width, "height": height}

            if image.format == "PSD" or ext == "psd":
                psd_info = extract_psd_info(image, result["diagnostics"])
                if psd_info:
                    result["psd"] = psd_info

            try:
                image.load()
                preview = image.copy()
                if preview.mode not in ("RGB", "RGBA"):
                    preview = preview.convert("RGBA")
                preview.thumbnail((TILE_SIZE, TILE_SIZE), Image.Resampling.LANCZOS)
                result["preview"] = preview
                result["previewable"] = True
            except Exception as exc:  # noqa: BLE001
                result["diagnostics"].append(f"Could not decode image pixels: {exc}")
    except Exception as exc:  # noqa: BLE001
        result["diagnostics"].append(f"Pillow could not open file: {exc}")

    return result


def load_source_index(archive_dir: Path) -> list[dict[str, Any]]:
    index_path = archive_dir / "source-index.json"
    if not index_path.is_file():
        raise FileNotFoundError(f"missing source index: {index_path}")

    with index_path.open("r", encoding="utf-8") as handle:
        payload = json.load(handle)

    if not isinstance(payload, list):
        raise ValueError("source-index.json must be a JSON array")

    records: list[dict[str, Any]] = []
    for index, item in enumerate(payload, start=1):
        if not isinstance(item, dict):
            raise ValueError(f"source-index.json entry {index} must be an object")
        records.append(item)
    return records


def build_checkerboard(size: tuple[int, int]) -> Image.Image:
    tile = Image.new("RGBA", size, CHECKER_LIGHT)
    pixels = tile.load()
    for y in range(size[1]):
        for x in range(size[0]):
            if ((x // CHECKER_SIZE) + (y // CHECKER_SIZE)) % 2:
                pixels[x, y] = CHECKER_DARK
    return tile


def fit_on_checkerboard(preview: Image.Image, tile_size: tuple[int, int]) -> Image.Image:
    canvas = build_checkerboard(tile_size)
    x = (tile_size[0] - preview.width) // 2
    y = (tile_size[1] - preview.height) // 2
    if preview.mode != "RGBA":
        preview = preview.convert("RGBA")
    canvas.paste(preview, (x, y), preview)
    return canvas


def render_placeholder(tile_size: tuple[int, int], lines: list[str]) -> Image.Image:
    canvas = Image.new("RGBA", tile_size, (235, 235, 235, 255))
    draw = ImageDraw.Draw(canvas)
    draw.rectangle((0, 0, tile_size[0] - 1, tile_size[1] - 1), outline=(180, 180, 180, 255))
    text = "\n".join(lines[:4])
    draw.multiline_text((12, 12), text, fill=(60, 60, 60, 255), spacing=4)
    return canvas


def default_font(size: int = 14) -> ImageFont.ImageFont | ImageFont.FreeTypeFont:
    try:
        return ImageFont.truetype("DejaVuSans.ttf", size)
    except OSError:
        return ImageFont.load_default()


def render_contact_sheets(
    entries: list[dict[str, Any]], output_dir: Path
) -> list[str]:
    sheets_dir = output_dir / "contact-sheets"
    sheets_dir.mkdir(parents=True, exist_ok=True)

    cell_width = TILE_SIZE + CELL_PADDING
    cell_height = TILE_SIZE + LABEL_HEIGHT + CELL_PADDING
    page_width = PAGE_PADDING * 2 + CONTACT_COLUMNS * cell_width
    page_height = PAGE_PADDING * 2 + CONTACT_ROWS * cell_height
    font = default_font()

    written: list[str] = []
    for page_index in range(0, len(entries), CONTACT_PAGE_SIZE):
        page_entries = entries[page_index : page_index + CONTACT_PAGE_SIZE]
        page = Image.new("RGB", (page_width, page_height), (255, 255, 255))
        draw = ImageDraw.Draw(page)

        for slot, entry in enumerate(page_entries):
            row = slot // CONTACT_COLUMNS
            col = slot % CONTACT_COLUMNS
            origin_x = PAGE_PADDING + col * cell_width
            origin_y = PAGE_PADDING + row * cell_height

            preview = entry.get("_preview_image")
            if isinstance(preview, Image.Image):
                tile = fit_on_checkerboard(preview, (TILE_SIZE, TILE_SIZE))
            else:
                reason = "No preview"
                diagnostics = entry.get("diagnostics") or []
                if diagnostics:
                    reason = diagnostics[0]
                    if len(reason) > 72:
                        reason = reason[:69] + "..."
                tile = render_placeholder((TILE_SIZE, TILE_SIZE), [entry["id"], reason])

            page.paste(tile.convert("RGB"), (origin_x, origin_y))

            title = entry.get("source", {}).get("title") or entry["filename"]
            label = f'{entry["id"]}\n' + textwrap.shorten(title, width=32, placeholder="...")
            draw.multiline_text(
                (origin_x, origin_y + TILE_SIZE + 4),
                label,
                fill=(20, 20, 20),
                font=font,
                spacing=2,
            )

        page_number = page_index // CONTACT_PAGE_SIZE + 1
        filename = f"contact-sheet-{page_number:03d}.png"
        page_path = sheets_dir / filename
        page.save(page_path, format="PNG")
        written.append(str(page_path.relative_to(output_dir)))

    return written


def classify_status(entry: dict[str, Any]) -> str:
    if entry.get("missing"):
        return "missing"
    if entry.get("error"):
        return "failed"
    diagnostics = entry.get("diagnostics") or []
    if diagnostics and not entry.get("previewable") and entry.get("dimensions") is None:
        return "partial"
    if diagnostics:
        return "partial"
    return "ok"


def process_archive(archive_dir: Path, output_dir: Path) -> dict[str, Any]:
    records = load_source_index(archive_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    entries: list[dict[str, Any]] = []
    hash_to_canonical: dict[str, str] = {}
    summary = {
        "record_count": len(records),
        "files_found": 0,
        "files_missing": 0,
        "total_bytes": 0,
        "unique_content_hashes": 0,
        "duplicate_entries": 0,
        "failures": 0,
        "previewable_count": 0,
    }

    for index, record in enumerate(records, start=1):
        entry_id = asset_id(index)
        ext, ext_diagnostics = extension_from_title(record.get("title"))
        filename = expected_filename(entry_id, ext)
        original_path = resolve_original_path(archive_dir, entry_id, ext)

        entry: dict[str, Any] = {
            "id": entry_id,
            "filename": filename,
            "relative_path": f"originals/{filename}",
            "source": {
                "title": record.get("title"),
                "drive_id": record.get("id"),
                "url": record.get("url"),
                "mime_type": record.get("mime_type"),
                "declared_size": record.get("size"),
            },
            "bytes": None,
            "sha256": None,
            "dimensions": None,
            "mode": None,
            "duplicate_of": None,
            "duplicates": [],
            "psd": None,
            "diagnostics": list(ext_diagnostics),
            "missing": False,
            "error": None,
            "previewable": False,
            "status": "failed",
        }

        try:
            if not original_path.is_file():
                entry["missing"] = True
                entry["diagnostics"].append(f"missing file: {entry['relative_path']}")
                summary["files_missing"] += 1
            else:
                summary["files_found"] += 1
                file_bytes = original_path.stat().st_size
                entry["bytes"] = file_bytes
                if record.get("size") is not None and file_bytes != int(record["size"]):
                    raise ValueError("file size differs from source metadata")
                summary["total_bytes"] += file_bytes

                entry["sha256"] = sha256_file(original_path)
                content_hash = entry["sha256"]

                canonical_id = hash_to_canonical.get(content_hash)
                if canonical_id is None:
                    hash_to_canonical[content_hash] = entry_id
                else:
                    entry["duplicate_of"] = canonical_id
                    summary["duplicate_entries"] += 1
                    for prior in entries:
                        if prior["id"] == canonical_id:
                            prior.setdefault("duplicates", []).append(entry_id)
                            break

                inspection = inspect_image(original_path, ext)
                entry["dimensions"] = inspection["dimensions"]
                entry["mode"] = inspection["mode"]
                entry["psd"] = inspection["psd"]
                entry["previewable"] = inspection["previewable"]
                entry["diagnostics"].extend(inspection["diagnostics"])
                if inspection["previewable"]:
                    entry["_preview_image"] = inspection["preview"]
                    summary["previewable_count"] += 1

        except Exception as exc:  # noqa: BLE001 - continue other files
            entry["error"] = str(exc)
            entry["diagnostics"].append(f"processing error: {exc}")

        entry["status"] = classify_status(entry)
        entries.append(entry)

    summary["unique_content_hashes"] = len(hash_to_canonical)
    summary["failures"] = sum(
        1 for entry in entries if entry["status"] in {"missing", "failed"}
    )

    contact_sheets = render_contact_sheets(entries, output_dir)

    for entry in entries:
        entry.pop("_preview_image", None)

    inventory = {
        "schema_version": SCHEMA_VERSION,
        "generated_at": utc_now_iso(),
        "archive_dir": str(archive_dir.resolve()),
        "source_index": "source-index.json",
        "summary": summary,
        "contact_sheets": contact_sheets,
        "entries": entries,
    }

    inventory_path = output_dir / "inventory.json"
    with inventory_path.open("w", encoding="utf-8") as handle:
        json.dump(inventory, handle, indent=2)
        handle.write("\n")

    return inventory


def print_summary(inventory: dict[str, Any]) -> None:
    summary = inventory["summary"]
    print("Ford Frenzy art library inspection complete.")
    print(f"Records: {summary['record_count']}")
    print(f"Files found: {summary['files_found']}")
    print(f"Files missing: {summary['files_missing']}")
    print(f"Total bytes: {summary['total_bytes']}")
    print(f"Unique content hashes: {summary['unique_content_hashes']}")
    print(f"Duplicate entries: {summary['duplicate_entries']}")
    print(f"Previewable images: {summary['previewable_count']}")
    print(f"Failures (missing or failed entries): {summary['failures']}")
    print(f"Contact sheets: {len(inventory['contact_sheets'])}")
    print(f"Inventory: inventory.json")


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Inspect a Ford Frenzy art archive and write inventory.json plus "
            "paginated contact-sheet PNGs."
        )
    )
    parser.add_argument(
        "--archive",
        required=True,
        type=Path,
        help="Archive directory containing source-index.json and originals/",
    )
    parser.add_argument(
        "--output",
        required=True,
        type=Path,
        help="Directory for inventory.json and contact-sheets/",
    )
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or sys.argv[1:])
    archive_dir = args.archive.expanduser().resolve()
    output_dir = args.output.expanduser().resolve()

    if not archive_dir.is_dir():
        print(f"Archive directory not found: {archive_dir}", file=sys.stderr)
        return 2

    try:
        inventory = process_archive(archive_dir, output_dir)
    except Exception as exc:  # noqa: BLE001
        print(f"Inspection aborted: {exc}", file=sys.stderr)
        traceback.print_exc()
        return 1

    print_summary(inventory)
    if inventory["summary"]["files_missing"]:
        return 3
    return 4 if inventory["summary"]["failures"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
