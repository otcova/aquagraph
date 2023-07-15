<script lang="ts">
    import { onMount } from "svelte";

    let canvasContainer: HTMLElement;

    onMount(async () => {
        const clientModule = import("./game/client");
        const hostModule = import("./game/host");

        const { Client } = await clientModule;
        const client = new Client(canvasContainer);

        const { Host } = await hostModule;
        const host = new Host();
        client.joinGame(host);

        return () => {
            client.destroy();
            host.destroy();
        };
    });
</script>

<div id="canvas-container" bind:this={canvasContainer} />

<style>
    #canvas-container {
        width: 100vw;
        height: 100vh;
    }
</style>
