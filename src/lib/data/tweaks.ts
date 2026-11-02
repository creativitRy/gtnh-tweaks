import { buildTweakRegistry } from '@gtnh-tweaks/core';

export const ALL_TWEAKS = buildTweakRegistry(
  import.meta.glob<{ default: unknown }>('./tweaks/*/*.ts', { eager: true }),
);
