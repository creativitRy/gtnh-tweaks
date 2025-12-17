import { defineTweak } from '$lib/tweak';

// noinspection JSUnusedGlobalSymbols
export default defineTweak({
  name: 'Detailed Item Tooltips',
  description:
    'Adds detailed tooltips to itmes on hover, such as burn time, registry name, etc. Some are only visible after pressing F3+H.',
  icon: { kind: 'emoji', value: '💡' },
  supportedVersions: () => true,
  followsStargateRules: true,
  onDownload: async (config, downloadCtx) => {
    await downloadCtx.patchFile(
      '.minecraft/config/neiintegration.cfg',
      `Index: .minecraft/config/neiintegration.cfg
===================================================================
--- .minecraft/config/neiintegration.cfg
+++ .minecraft/config/neiintegration.cfg
@@ -22,27 +22,27 @@
 
 
 tooltips {
     # Show the burn time of items when used as furnace fuel.
-    B:"Burn Time"=false
+    B:"Burn Time"=true
 
     # If burn times are enabled, they will only be shown in advanced (F3+H) tooltips. Effect stacks with Shift if enabled.
     B:"Burn Time Advanced"=false
 
     # If burn times are enabled, they will only be shown if the Shift key is held. Effect stacks with Advanced if enabled.
     B:"Burn Time Shift"=false
 
     # Show some fluid info on fluid-related items.
-    B:"Fluid Registry Info"=false
+    B:"Fluid Registry Info"=true
 
     # If fluid registry info is enabled, it will only be shown in advanced (F3+H) tooltips. Effect stacks with Shift if enabled.
-    B:"Fluid Registry Info Advanced"=false
+    B:"Fluid Registry Info Advanced"=true
 
     # If fluid registry info is enabled, it will only be shown if the Shift key is held. Effect stacks with Advanced if enabled.
     B:"Fluid Registry Info Shift"=false
 
     # Show the internal name (example: 'minecraft:stone') of items.
-    B:"Internal Name"=false
+    B:"Internal Name"=true
 
     # If internal names are enabled, they will only be shown in advanced (F3+H) tooltips. Effect stacks with Shift if enabled.
     B:"Internal Name Advanced"=false
 
@@ -58,12 +58,12 @@
     # If maximum stack sizes are enabled, they will only be shown if the Shift key is held. Effect stacks with Advanced if enabled.
     B:"Maximum Stack Size Shift"=false
 
     # Show the Ore Dictionary names of items.
-    B:"Ore Dictionary Names"=false
+    B:"Ore Dictionary Names"=true
 
     # If Ore Dictionary names are enabled, they will only be shown in advanced (F3+H) tooltips. Effect stacks with Shift if enabled.
-    B:"Ore Dictionary Names Advanced"=false
+    B:"Ore Dictionary Names Advanced"=true
 
     # If Ore Dictionary names are enabled, they will only be shown if the Shift key is held. Effect stacks with Advanced if enabled.
     B:"Ore Dictionary Names Shift"=false
 
`,
    );
  },
});
