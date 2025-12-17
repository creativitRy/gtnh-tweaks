import pkg from '$lib/../../package.json' with { type: 'json' };

export async function load() {
  return { props: { repository: pkg.repository } };
}
