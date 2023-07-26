<script lang="ts">
    import { onMount } from "svelte";

    let canvasContainer: HTMLElement;

    onMount(async () => {
        const clientModule = import("./game/minigame");
        
        const { MinigameManager } = await clientModule;
        const client = new MinigameManager(canvasContainer, { name: "A" });
        
        return () => {
            client.destroy();
        };
    });
</script>

<div id="canvas-container" bind:this={canvasContainer} />

<style>
    #canvas-container {
        width: 100vw;
        height: 100vh;
    }
    
    :global(body) {
        margin: 0;
        background: #000;
        color: #fff;
        overflow: hidden;
    }
</style>
