import { defineTweak, type TweakDef, type TweakId } from './tweak';

const TWEAK_PATH_REGEX = /tweaks\/([^/]+)\/([^/]+)\.ts$/;

/**
 *
 * @param modules eager glob result keyed by module path, e.g. `./tweaks/<group>/<id>.ts` or `<repo>/src/lib/data/tweaks/<group>/<id>.ts`
 */
export function buildTweakRegistry(modules: Record<string, { default: unknown }>): Map<TweakId, TweakDef> {
  const allTweaks: Map<TweakId, TweakDef> = new Map();
  for (const [path, mod] of Object.entries(modules)) {
    const match = TWEAK_PATH_REGEX.exec(path.replaceAll('\\', '/'));
    if (match === null) throw new Error(`Tweak path does not match tweaks/<group>/<id>.ts: ${path}`);
    const [, group, id] = match;
    const tweak = mod.default as ReturnType<typeof defineTweak> | undefined;
    if (!tweak?.defineTweak) {
      throw new Error(`Malformed tweak in ${path}`);
    }
    if (allTweaks.has(id)) throw new Error(`Duplicate tweak ID: ${id}`);
    allTweaks.set(id, { ...tweak, id, group });
  }
  return allTweaks;
}
