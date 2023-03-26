<script lang="ts">
    import { onMount } from "svelte";
    import { Painter } from "./game/painter";
    import { createGameServer } from "./game/server";

    let canvasContainer: HTMLElement;

    onMount(() => {
        const server = createGameServer.staticFrame();
        const painter = new Painter(server, canvasContainer);
    });
</script>

<div id="canvas-container" bind:this={canvasContainer} />

<style>
    #canvas-container {
        width: 100vw;
        height: 100vh;
    }
</style>
