# tweaks

To define a new tweak, it must be in a directory `{groupName}/{tweakId}.ts`.
It must default export the result of calling `defineTweak`.
tweakId must be unique even across groups.

## Creating patches

Check out https://gtnh-tweaks.ctry.dev/compute-patch

## Breaking Changes

Do not cause breaking changes!
Changing the id is a breaking change, so don't rename files.
Changing tweak config ids is also a breaking change.
Everything else should be fine.
