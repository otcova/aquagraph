import type { EntityId, Game, User } from "..";
import type { PlayerInput } from "../client/player";
import type { Minigame } from "../minigames";
import { Lobby } from "../minigames/lobby";
import type { PlayerAction } from "../simulator/entities/player";


export class Host {
    private minigame: Minigame;
    
    constructor() {
        this.minigame = new Lobby();
    }

    getGame(): Game {
        return this.minigame.getGame();
    }
    
    newPlayer(user: User): HostConnection {
        return new LocalHostConnection(this.minigame, user);
    }
}

export interface HostConnection {
    getGame(): Game;
    playerInput(input: PlayerInput): void;
}

class LocalHostConnection implements HostConnection {
    private playerId: EntityId;
    
    constructor(private minigame: Minigame, user: User) {
        this.playerId = this.minigame.spawnPlayer(user);
    }
    
    getGame(): Game {
        return this.minigame.getGame();
    }
    
    playerInput(input: PlayerInput): void {
        this.minigame.playerInput(this.playerId, input);
    }
}