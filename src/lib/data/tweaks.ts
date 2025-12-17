import { defineTweak, type TweakDef, type TweakId } from '$lib/tweak';

function getDefinedTweaks(): Map<TweakId, TweakDef> {
  const allTweaks: Map<TweakId, TweakDef> = new Map();
  const idGroupRegex = /tweaks\/([^/]+)\/([^/]+)\.ts$/;
  const modules = import.meta.glob('./tweaks/*/*.ts', { eager: true });
  for (const [path, mod] of Object.entries(modules)) {
    const tweak = (mod as { default: ReturnType<typeof defineTweak> }).default;
    if (!tweak.defineTweak) {
      throw new Error(`Malformed tweak in ${path}`);
    }
    // extract group and id from path
    const [, group, id] = idGroupRegex.exec(path)!;
    if (allTweaks.has(id)) throw new Error(`Duplicate tweak ID: ${id}`);
    allTweaks.set(id, { ...tweak, id: id, group: group });
  }
  return allTweaks;
}

export const ALL_TWEAKS = getDefinedTweaks();
