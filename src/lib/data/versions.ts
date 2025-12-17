import type { VersionId } from '$lib/tweak';

export namespace gtnhVersionIds {
  export const v2_8_3: VersionId = '2.8.3';
  export const v2_8_2: VersionId = '2.8.2';
  export const v2_8_1: VersionId = '2.8.1';
  export const v2_8_0: VersionId = '2.8.0';
}

export const GTNH_VERSIONS = [
  { id: gtnhVersionIds.v2_8_3, date: '2025-12-12' },
  { id: gtnhVersionIds.v2_8_2, date: '2025-12-07' },
  { id: gtnhVersionIds.v2_8_1, date: '2025-10-20' },
  { id: gtnhVersionIds.v2_8_0, date: '2025-09-27' },
];
