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

        client.joinGame(host.newPlayer({ name: "A" }));
        client.joinGameB(host.newPlayer({ name: "B" }));

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
        font-family: "Montserrat";
        overflow: hidden;
    }

    @font-face {
        font-family: "Montserrat";
        src: url("$lib/assets/Montserrat.ttf");
    }
</style>
