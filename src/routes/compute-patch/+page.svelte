<script lang="ts">
  import { createPatch } from 'diff';

  let prevText = '';
  let newText = '';
  let filePath = '.minecraft/config/filename.txt';
  let computedText = '';

  function computePatch(prevText: string, newText: string): string {
    return createPatch(filePath, prevText, newText);
  }
</script>

<div class="layout">
  <div class="panel">
    <p>Prev</p>
    <textarea bind:value={prevText}></textarea>
  </div>
  <div class="panel">
    <p>New</p>
    <textarea bind:value={newText}></textarea>
  </div>
  <div class="panel">
    <p>Computed</p>
    <label for="file-path-input">File path:</label>
    <input id="file-path-input" bind:value={filePath} />
    <button on:click={() => (computedText = computePatch(prevText, newText))}>Compute</button>
    <button
      on:click={() => {
        navigator.clipboard.writeText(computedText).then(() => alert('Copied successfully'));
      }}
    >
      Copy
    </button>
    <textarea readonly bind:value={computedText}></textarea>
  </div>
</div>

<style lang="scss">
  .layout {
    height: 100vh;
    display: flex;
    flex-direction: row;
  }

  .panel {
    flex: 0 0 calc(100% / 3);
    min-width: 0; // prevents textarea overflow in flex children
    height: 100%;
    display: flex;
    flex-direction: column;

    padding: 12px;
    box-sizing: border-box;

    border-right: 1px solid #ddd;

    &:last-child {
      border-right: 0;
    }

    p {
      margin: 0 0 8px;
      font-weight: 600;
    }

    button {
      margin-right: 8px;
    }

    textarea {
      flex: 1 1 auto;
      width: 100%;
      min-height: 0;
      box-sizing: border-box;

      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 6px;

      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
      line-height: 1.35;

      resize: none;
    }
  }
</style>
