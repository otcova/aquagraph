import type { User } from "..";
import { type Minigame } from "../minigames";
import { LobbyHost } from "../minigames/lobby";
import { RaceMinigameHost } from "../minigames/race";
import { Painter } from "./painter";
import { PlayerIn } from "./playerInput";


export class Client {
    painter: Painter;
    player: PlayerIn;
    
    minigame: Minigame;

    constructor(canvasContainer: HTMLElement, user: User) {
        this.minigame = new LobbyHost(user);
        this.painter = new Painter(this.minigame, canvasContainer);
        this.player = new PlayerIn(this.minigame);
    }

    destroy() {
        this.minigame.destroy();
        this.painter.destroy();
        this.player.destroy();
    }
}

