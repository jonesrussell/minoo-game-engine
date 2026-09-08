import { Application, Assets, Container, Graphics, Rectangle, Sprite, Text, Texture } from 'pixi.js';
import { validateAnyScene, type AnyScene } from './scene.ts';

export interface BrowserManifestAsset {
  id: string;
  url: string;
  mediaType: 'image/png';
  sha256: string;
  source: string;
  rights: string;
}

export interface BrowserManifest { version: 1; assets: BrowserManifestAsset[] }
export interface BrowserLabel { text: string; x: number; y: number; fontSize: number; rotation?: number; color?: number }
export interface BrowserSceneRendererOptions {
  host: HTMLElement;
  scene: AnyScene;
  manifest: unknown;
  onSelect: (id: string) => void;
  reducedMotion: boolean;
  backgroundId: string;
  labels?: BrowserLabel[];
  /** Optional presentation only. Does not change object coordinates or hit areas. */
  objectLighting?: { tint: number; shadow: boolean };
}
export interface BrowserTarget { id: string; x: number; y: number; width: number; height: number }
export interface SceneRenderer {
  setSearchCursor(point: { x: number; y: number } | null): void;
  inspectAt(point: { x: number; y: number }): boolean;
  setView(view: { foundIds: readonly string[]; hintedObjectId: string | null }): void;
  setPaused(paused: boolean): void;
  setReducedMotion(reducedMotion: boolean): void;
  advanceTime(ms: number): void;
  getTargets(): BrowserTarget[];
  dispose(): void;
}

const LOGICAL_WIDTH = 1920;
const LOGICAL_HEIGHT = 1080;
const BORDER = 8;

function invalid(message: string): Error { return new Error(`Browser renderer: ${message}`); }

function checkedManifest(value: unknown): BrowserManifest {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw invalid('manifest must be an object');
  const manifest = value as { version?: unknown; assets?: unknown };
  if (manifest.version !== 1 || !Array.isArray(manifest.assets) || manifest.assets.length === 0) throw invalid('manifest must declare version 1 and assets');
  const assets = manifest.assets.map((asset, index) => {
    if (!asset || typeof asset !== 'object' || Array.isArray(asset)) throw invalid(`manifest asset ${index} must be an object`);
    const item = asset as Record<string, unknown>;
    for (const field of ['id', 'url', 'sha256', 'source', 'rights']) if (typeof item[field] !== 'string' || !item[field]) throw invalid(`manifest asset ${index} requires non-empty ${field}`);
    if (item.mediaType !== 'image/png') throw invalid(`manifest asset ${index} must use image/png`);
    return item as unknown as BrowserManifestAsset;
  });
  const ids = new Set<string>();
  for (const asset of assets) { if (ids.has(asset.id)) throw invalid(`manifest asset ID ${asset.id} is duplicated`); ids.add(asset.id); }
  return { version: 1, assets };
}

export async function createSceneRenderer(options: BrowserSceneRendererOptions): Promise<SceneRenderer> {
  if (!(options.host instanceof HTMLElement)) throw invalid('host must be an HTMLElement');
  const validation = validateAnyScene(options.scene);
  if (!validation.ok) throw invalid(`scene validation failed: ${validation.errors.map(error => error.message).join(' ')}`);
  const scene = validation.scene;
  const manifest = checkedManifest(options.manifest);
  const assetsById = new Map(manifest.assets.map(asset => [asset.id, asset]));
  const objects = scene.objects.map(object => ({ id: object.id, x: object.x, y: object.y, width: object.width, height: object.height }));
  if (!assetsById.has(options.backgroundId)) throw invalid(`background asset ${options.backgroundId} is missing`);
  for (const object of objects) if (!assetsById.has(object.id)) throw invalid(`object asset ${object.id} is missing`);

  const urls = [...new Set([options.backgroundId, ...objects.map(object => object.id)].map(id => assetsById.get(id)!.url))];
  let textures: Texture[] = [];
  let app: Application | undefined;
  let disposed = false;
  try {
    const loaded = await Promise.allSettled(urls.map(url => Assets.load<Texture>(url)));
    const failure = loaded.find(result => result.status === 'rejected');
    if (failure?.status === 'rejected') throw invalid(`required artwork failed to load: ${String(failure.reason)}`);
    textures = loaded.map(result => (result as PromiseFulfilledResult<Texture>).value);
    if (disposed) throw invalid('renderer was disposed during loading');
    const textureByUrl = new Map(urls.map((url, index) => [url, textures[index]]));
    app = new Application();
    await app.init({ width: Math.max(1, options.host.clientWidth), height: Math.max(1, options.host.clientHeight), backgroundColor: 0x101820, antialias: true, autoStart: false, preserveDrawingBuffer: true });
    if (disposed) throw invalid('renderer was disposed during initialization');
    const root = new Container();
    const background = Sprite.from(textureByUrl.get(assetsById.get(options.backgroundId)!.url)!);
    const backgroundScale = Math.min(scene.width / background.width, scene.height / background.height);
    background.scale.set(backgroundScale); background.x = (scene.width-background.width)/2; background.y = (scene.height-background.height)/2; root.addChild(background);
    const sprites = new Map<string, Sprite>();
    const hints = new Map<string, Graphics>();
    for (const object of objects) {
      const sprite = Sprite.from(textureByUrl.get(assetsById.get(object.id)!.url)!);
      sprite.x = object.x; sprite.y = object.y; sprite.width = object.width; sprite.height = object.height;
      if (options.objectLighting) {
        sprite.tint = options.objectLighting.tint;
        if (options.objectLighting.shadow) {
          const shadow = new Sprite(sprite.texture);
          shadow.position.set(object.x + 4, object.y + 6);
          shadow.width = object.width; shadow.height = object.height;
          shadow.tint = 0x131714; shadow.alpha = 0.24; shadow.eventMode = 'none';
          root.addChild(shadow);
        }
      }
      sprite.eventMode = 'static'; sprite.cursor = 'pointer';
      // Pixi hitArea is in texture-local coordinates, before sprite scaling.
      sprite.hitArea = new Rectangle(-BORDER / sprite.scale.x, -BORDER / sprite.scale.y, sprite.texture.width + BORDER * 2 / sprite.scale.x, sprite.texture.height + BORDER * 2 / sprite.scale.y);
      sprite.on('pointertap', () => { if (!paused && !disposed) options.onSelect(object.id); });
      root.addChild(sprite); sprites.set(object.id, sprite);
      const hint = new Graphics(); hint.rect(object.x - BORDER, object.y - BORDER, object.width + BORDER * 2, object.height + BORDER * 2).stroke({ width: 4, color: 0xffdc5c, alpha: 0.95 }); hint.visible = false; root.addChild(hint); hints.set(object.id, hint);
    }
    for (const label of options.labels ?? []) { const text = new Text({ text: label.text, style: { fill: label.color ?? 0xeee4cd, fontFamily: 'Georgia', fontWeight: 'bold', fontSize: label.fontSize } }); text.x = label.x; text.y = label.y; text.rotation = label.rotation ?? 0; root.addChild(text); }
    const searchCursor = new Graphics();
    searchCursor.circle(0, 0, 24).stroke({width: 8, color: 0x171b1b});
    searchCursor.circle(0, 0, 24).stroke({width: 4, color: 0xffdc5c});
    searchCursor.moveTo(-36, 0).lineTo(-14, 0).moveTo(14, 0).lineTo(36, 0).moveTo(0, -36).lineTo(0, -14).moveTo(0, 14).lineTo(0, 36).stroke({width:4,color:0xffdc5c});
    searchCursor.eventMode = 'none'; searchCursor.visible = false; root.addChild(searchCursor);
    app.stage.addChild(root); options.host.appendChild(app.canvas);
    let scale = 1; let offsetX = 0; let offsetY = 0; let paused = false; let reducedMotion = options.reducedMotion; let elapsed = 0; let hidden = document.visibilityState === 'hidden';
    const resize = () => { if (!app || disposed) return; const width = Math.max(1, options.host.clientWidth); const height = Math.max(1, options.host.clientHeight); app.renderer.resize(width, height); scale = Math.min(width / scene.width, height / scene.height); offsetX = (width - scene.width * scale) / 2; offsetY = (height - scene.height * scale) / 2; root.x = offsetX; root.y = offsetY; root.scale.set(scale); app.render(); };
    const observer = new ResizeObserver(resize); observer.observe(options.host); resize();
    const visibility = () => { hidden = document.visibilityState === 'hidden'; if (hidden) app?.ticker.stop(); else if (!paused && !disposed) app?.ticker.start(); };
    document.addEventListener('visibilitychange', visibility);
    const frame = (ticker: { deltaMS: number }) => { if (!paused && !hidden) elapsed += ticker.deltaMS; for (const hint of hints.values()) hint.alpha = reducedMotion ? 1 : 0.8 + Math.sin(elapsed / 300) * 0.2; };
    app.ticker.add(frame); if (!hidden) app.ticker.start();
    const renderer: SceneRenderer = {
      setSearchCursor(point) { if (disposed) return; searchCursor.visible = !!point; if (point) searchCursor.position.set(point.x, point.y); app?.render(); },
      inspectAt(point) {
        if (disposed || paused || hidden || !Number.isFinite(point.x) || !Number.isFinite(point.y)) return false;
        // Match pointer overlap/border policy; never snap the search cursor to a target.
        const object = [...objects].reverse().find(o => point.x >= o.x-BORDER && point.x <= o.x+o.width+BORDER && point.y >= o.y-BORDER && point.y <= o.y+o.height+BORDER);
        if (!object) return false;
        options.onSelect(object.id); return true;
      },
      setView(view) { if (disposed) return; const found = new Set(view.foundIds); for (const [id, sprite] of sprites) sprite.alpha = found.has(id) ? 0.45 : 1; for (const [id, hint] of hints) hint.visible = view.hintedObjectId === id; app?.render(); },
      setPaused(value) { if (disposed || paused === value) return; paused = value; if (paused) app?.ticker.stop(); else if (!hidden) app?.ticker.start(); },
      setReducedMotion(value) { if (!disposed) { reducedMotion = value; if (reducedMotion) root.alpha = 1; } },
      advanceTime(ms) { if (!disposed && Number.isFinite(ms) && ms >= 0) { frame({deltaMS:ms}); app?.render(); } },
      getTargets() { const bounds = options.host.getBoundingClientRect(); return objects.map(object => ({ ...object, x: bounds.left + offsetX + object.x * scale, y: bounds.top + offsetY + object.y * scale, width: object.width * scale, height: object.height * scale })); },
      dispose() { if (disposed) return; disposed = true; observer.disconnect(); document.removeEventListener('visibilitychange', visibility); app?.ticker.stop(); app?.ticker.remove(frame); app?.destroy(true); for (const url of urls) void Assets.unload(url).catch(() => undefined); textures = []; },
    };
    return renderer;
  } catch (error) {
    if (app) app.destroy(true);
    for (const url of urls) await Assets.unload(url).catch(() => undefined);
    throw error;
  }
}
