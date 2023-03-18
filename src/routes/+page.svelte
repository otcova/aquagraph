<script lang="ts">
    import Painter from "./game/painter/index.svelte";
    import { createGameServer } from "./game/server";

    const server = createGameServer.staticFrame();
</script>

<Painter {server} />
