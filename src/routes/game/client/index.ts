import type { User } from "..";
import { type Minigame } from "../minigames";
import { Lobby } from "../minigames/lobby";
import { Painter } from "./painter";
import { PlayerIn } from "./playerInput";


export class Client {
    painter: Painter;
    player: PlayerIn;

    minigame: Minigame;

    constructor(canvasContainer: HTMLElement, user: User) {
        this.painter = new Painter(canvasContainer);
        this.minigame = new Lobby(user, this.painter.ui);
        
        this.painter.start(this.minigame);
        this.player = new PlayerIn(this.minigame);
    }

    destroy() {
        this.minigame.destroy();
        this.painter.destroy();
        this.player.destroy();
    }
}

