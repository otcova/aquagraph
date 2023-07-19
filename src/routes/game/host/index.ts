import type { EntityId, Game, User } from "..";
import type { PlayerInput } from "../client/player";
import type { Minigame } from "../minigames";
import { Lobby } from "../minigames/lobby";


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

    newLaggedPlayer(user: User): LaggedHostConnection {
        return new LaggedHostConnection(this.minigame, user);
    }
}

export interface HostConnection {
    destroy(): void;
    getGame(): Game | undefined;
    playerInput(input: PlayerInput): void;
}

class LocalHostConnection implements HostConnection {
    private playerId: EntityId;

    constructor(private minigame: Minigame, user: User) {
        this.playerId = this.minigame.spawnPlayer(user);
    }

    destroy() { }

    getGame(): Game {
        return this.minigame.getGame();
    }

    playerInput(input: PlayerInput): void {
        this.minigame.playerInput(this.playerId, input);
    }
}

class LaggedHostConnection implements HostConnection {
    private playerId: EntityId;
    
    private delay: number = 10; // equivalent to 20ms of ping
    private loopId: number;
    
    private minigame: Minigame;
    
    constructor(private minigameServer: Minigame, user: User) {
        this.minigame = new Lobby();
        
        this.playerId = this.minigameServer.spawnPlayer(user);
        this.loopId = window.setInterval(() => {
            const newGameState = JSON.parse(JSON.stringify(this.minigameServer.getGame(), replacer), reviver);
            setTimeout(() => {
                this.minigame.syncState(newGameState);
            }, this.delay)
        }, 1000 / 60);
    }

    destroy() {
        clearInterval(this.loopId);
    }

    getGame(): Game {
        return this.minigame.getGame();
    }

    playerInput(input: PlayerInput): void {
        setTimeout(() => this.minigameServer.playerInput(this.playerId, input), this.delay);
    }
}

function replacer(key: string, value: any) {
    if (value instanceof Map) {
        return {
            _dataType_: 'Map',
            data: [...value],
        };
    } else if (value instanceof Float32Array) {
        return {
            _dataType_: 'Float32Array',
            data: [...value],
        };
    } else {
        return value;
    }
}
function reviver(key: string, value: any): any {
    if (typeof value === 'object' && value !== null) {
        if (value._dataType_ === 'Map') {
            return new Map(value.data);
        } else if (value._dataType_ === 'Float32Array') {
            return new Float32Array(value.data);
        }
    }
    return value;
}