import type { HostConnection } from "../host";
import { Painter } from "./painter";
import { Player } from "./player";

export class Client {
    painter?: Painter;
    player?: Player;
    playerB?: Player;

    constructor(private canvasContainer: HTMLElement) {
    }

    joinGame(host: HostConnection) {
        this.painter?.destroy();
        this.painter = new Painter(host, this.canvasContainer);

        this.player?.destroy();
        this.player = new Player(host);
    }
    
    joinGameB(host: HostConnection) {
        this.playerB?.destroy();
        this.playerB = new Player(host, {move: ["arrowup", "arrowleft", "arrowdown", "arrowright"]});
    }

    destroy() {
        this.painter?.destroy();
        this.player?.destroy();
        this.playerB?.destroy();
    }
}
