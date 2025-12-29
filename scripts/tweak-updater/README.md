# Tweak Updater

This CLI looks through all existing tweaks and attempts to update them to the latest gtnh version.
For any script with an array of compatible version numbers, if the given version is not in the array,
then it will attempt to update it.

To do so, first, it will automatically check if the patch is applicable to the given version.
If so, it will then prompt you a link to the history of all required changed files and then ask you if it's compatible.

To run:

```sh
bun run main.ts
```
