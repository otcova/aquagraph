<script lang="ts">
    import { onMount } from "svelte";
    import type { GameServer } from "../server";
    import { Painter } from "./painter";

    export let server: GameServer;

    let width: number, height: number;
    let svg: SVGSVGElement;

    onMount(() => {
        const painter = new Painter(server, svg);
        return () => painter.stop();
    });
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height}/>

<svg width={width} height={height} bind:this={svg}></svg>

