import type { HostConnection } from "../host";
import { Painter } from "./painter";
import { Player } from "./player";

export class Client {
    painter?: Painter;
    player?: Player;

    constructor(private canvasContainer: HTMLElement) {
    }

    joinGame(host: HostConnection) {
        this.painter?.destroy();
        this.painter = new Painter(host, this.canvasContainer);

        this.player?.destroy();
        this.player = new Player(host);
    }

    destroy() {
        this.painter?.destroy();
        this.player?.destroy();
    }
}
