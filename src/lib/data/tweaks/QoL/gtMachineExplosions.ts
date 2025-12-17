import { defineTweak } from '$lib/tweak';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'Tweak GregTech Machine Explosions',
  description:
    'GregTech machines can explode based on various conditions. Control those conditions using this tweak.\n' +
    "To follow Stargate rules, only use this tweak as an alternative to rollbacks and don't abuse it!",
  icon: { kind: 'emoji', value: '💣' },
  supportedVersions: () => true,
  followsStargateRules: true,
  configs: {
    tweak: {
      type: 'select',
      label: 'Tweak',
      default: 'Disabled Entirely',
      options: ['Enabled For Bad Weather Only', 'Disabled Entirely'],
    },
  },
  onDownload: async (config, downloadCtx) => {
    if (config.tweak === 'Disabled Entirely') {
      await downloadCtx.patchFile(
        '.minecraft/config/GregTech/GregTech.cfg',
        `Index: .minecraft/config/GregTech/GregTech.cfg
===================================================================
--- .minecraft/config/GregTech/GregTech.cfg
+++ .minecraft/config/GregTech/GregTech.cfg
@@ -138,9 +138,9 @@
         # if true, end ores yield twice as much as normal ores. [default: true]
         B:endOreYieldMultiplier=true
 
         # if true, drops the content of the machine inventory before exploding. [default: false]
-        B:explosionItemDrop=false
+        B:explosionItemDrop=true
 
         # The chance of success to start a fire from the flint and steel. [range: -2147483648 ~ 2147483647, default: 30]
         I:flintChance=30
 
@@ -375,9 +375,9 @@
         # If true and if the machine tint is activated, the guis will have a uniform metallic tint no matter what color is applied to the machines. [default: false]
         B:machineMetalGUI=false
 
         # If true, explodes if the machine is dismantled without a wrench. [default: true]
-        B:machineNonWrenchExplosions=true
+        B:machineNonWrenchExplosions=false
 
         # If true, will randomly explode if it is raining. [default: true]
         B:machineRainExplosions=true
 
`,
      );
    } else {
      await downloadCtx.patchFile(
        '.minecraft/config/GregTech/GregTech.cfg',
        `Index: .minecraft/config/GregTech/GregTech.cfg
===================================================================
--- .minecraft/config/GregTech/GregTech.cfg
+++ .minecraft/config/GregTech/GregTech.cfg
@@ -363,9 +363,9 @@
         # This will let machines such as drills and pumps chunkload their work area. [default: true]
         B:enableChunkloaders=true
 
         # If true, machines can explode. [default: true]
-        B:machineExplosions=true
+        B:machineExplosions=false
 
         # If true, machine will randomly explode if there is fire on adjacent blocks. [default: true]
         B:machineFireExplosions=true
 
`,
      );
    }
  },
});
