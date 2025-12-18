export const gtnhVersionIds = {
  v2_8_3: '2.8.3',
  v2_8_2: '2.8.2',
  v2_8_1: '2.8.1',
  v2_8_0: '2.8.0',
};

export const GTNH_VERSIONS = [
  { id: gtnhVersionIds.v2_8_3, date: '2025-12-12', gitCommit: 'e7c5b9805dd2cedb7c56bf2b55d9eb44fc6224d0' },
  { id: gtnhVersionIds.v2_8_2, date: '2025-12-07', gitCommit: 'ef9f08003e5f0348321489bd49474cb305f5698b' },
  { id: gtnhVersionIds.v2_8_1, date: '2025-10-20', gitCommit: 'cda79d034fee2063811fe4c1a46320ad44fc8f02' },
  { id: gtnhVersionIds.v2_8_0, date: '2025-09-27', gitCommit: 'c3ba07ccba1b772777f6fc57e53bb70c8547adb7' },
];

export const GTNH_VERSIONS_LOOKUP = new Map(GTNH_VERSIONS.map(v => [v.id, v]));
