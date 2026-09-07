# Ford Frenzy art library inspector (#103)

Local authoring utility for inventorying recovered Ford Frenzy source artwork.
This tool is **not** part of the Minoo game runtime, npm workspace, or shipping
bundle. It uses [Pillow](https://python-pillow.org/) as an external Python
dependency on the operator machine only.

## Purpose

Issue [#103](https://github.com/jonesrussell/minoo-game-engine/issues/103)
implements FF-ART-001 preservation checks:

- stable `ff-NNN` asset IDs aligned with `source-index.json` order
- byte size and SHA-256 for every recovered original
- raster dimensions and Pillow image mode when decodable
- duplicate detection by content hash (first record is canonical)
- PSD frame/layer metadata only when Pillow exposes it (no fabricated validation)
- graceful per-file diagnostics for unsupported formats such as Adobe Illustrator (`.ai`)
- paginated contact-sheet PNGs for human review

Originals are never modified. Contact sheets are derived review artifacts only.

## Archive layout

The inspector expects a private archive directory:

```text
archive/
  source-index.json
  originals/
    ff-001.psd
    ff-002.png
    ff-003.ai
    ...
```

### `source-index.json`

JSON array of Google Drive metadata objects in import order. Each object may
include fields such as `title`, `id`, `url`, `size`, and `mime_type`. Array
index `1` maps to `ff-001`, index `2` to `ff-002`, and so on.

The on-disk filename extension comes from the basename of `title` (for example
`Hallway.psd` → `psd`). Directory components in titles are ignored; only the
validated extension is used. Unsafe extensions fall back to `bin` with a
diagnostic entry.

### Original files

Each indexed record resolves to:

```text
originals/ff-NNN.<extension-from-title>
```

The script does not rename, convert, or rewrite source files.

## Requirements

- Python 3.10+ recommended
- Pillow installed for the operator environment (Windows setup for #103 already includes it)

No Node.js, npm, network access, or game build steps are required to run this tool.

## Usage

From the repository root:

```sh
python scripts/inspect-art-library.py --archive /path/to/archive --output /path/to/output
```

On Windows PowerShell:

```powershell
python scripts/inspect-art-library.py --archive C:\path\to\archive --output C:\path\to\output
```

Arguments:

| Flag | Description |
| --- | --- |
| `--archive DIR` | Archive root containing `source-index.json` and `originals/` |
| `--output DIR` | Writable output directory for reports (created if missing) |

Exit codes:

| Code | Meaning |
| --- | --- |
| `0` | Completed; all indexed originals found |
| `1` | Aborted (invalid index, I/O failure before per-file processing) |
| `2` | Archive path missing |
| `3` | Completed with one or more missing indexed files |
| `4` | Completed with a processing failure, including a declared-size mismatch |

Per-file inspection errors do not stop processing of other files.

## Outputs

```text
output/
  inventory.json
  contact-sheets/
    contact-sheet-001.png
    contact-sheet-002.png
    ...
```

### `inventory.json`

Private inventory for provenance and import decisions. Each entry includes:

- `id`, `filename`, `relative_path`
- copied Drive metadata under `source`
- `bytes`, `sha256`
- `dimensions` and `mode` when Pillow can decode raster pixels
- `duplicate_of` for non-canonical duplicates; canonical entries list `duplicates`
- `psd` object with `frame_count`, `layer_count`, and/or `layer_names` only when Pillow exposes them
- `diagnostics` array with actionable messages
- `status`: `ok`, `partial`, `missing`, or `failed`

The top-level `summary` reports record count, files found/missing, total bytes,
unique hashes, duplicate count, previewable count, and failure tally.

### Contact sheets

- 4 columns × 5 rows (20 thumbnails per page)
- labelled with asset ID and filename
- wide/panoramic images scaled to fit the tile while preserving aspect ratio
- checkered background behind transparent PNG previews
- unsupported or undecodable sources show a placeholder tile; vector `.ai` sources are **not** rendered as artwork

## Limitations

- Pillow reads PSD composites and only reports layer/frame data when its PSD plugin exposes it. Missing layer metadata is recorded as diagnostics, not invented structure.
- Adobe Illustrator (`.ai`), SVG, and EPS files are inventoried by hash and size but not rendered as faithful vector previews.
- Declared Drive `size` values are compared with on-disk bytes; a mismatch is a failed entry.
- Keep the imported index order frozen. New records append so existing IDs remain stable.
- This tool does not publish assets, update game manifests, or approve shipping art.

## Related docs

- [Ford Frenzy delivery plan](ford-frenzy-delivery.md)
- [FF-ART-001 experience contract](specs/ford-frenzy-experience.md)
- [Content policy](content-policy.md)
