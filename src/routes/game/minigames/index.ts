import type { Game, Player, User } from "..";
import type { PlayerInput } from "../client/playerInput";
import { GuestConnection, HostConnection, type PlayerInputHandle } from "../connection";
import type { Simulator } from "../simulator";
import { randomPlayerSpawn } from "./utils";

export interface Minigame {
	getGame(): Game;
	destroy(): void;
	handlePlayerInput(input: PlayerInput): void;
}

export class MinigameHost implements Minigame {
	
	host?: HostConnection;
	guest?: GuestConnection;
	
	handlePlayerInput!: PlayerInputHandle;

	constructor(game: Game, protected user: User) {
		this.setupHost(game);
	}
	
	protected setupHost(game: Game) {
		if (this.host) return;
		
		this.host = new HostConnection(game);
		this.host.simulator.beforeStep = this.update.bind(this);
		this.handlePlayerInput = this.handleNewPlayer(0, this.user);
	}

	protected handleNewPlayer(id: number, user: User): PlayerInputHandle {
		if (!this.host) throw Error("Only a host can add a player");
		
		const player = this.spawnPlayer(user);
		const simulator = this.host.simulator;
		simulator.entities.addPlayer(id, player);

		return (input: PlayerInput) => {
			const player = simulator.entities.players.get(id);
			if (!player) throw Error("Player Not found");
			player.handleInput(input);
		};
	}
	
	protected getSimulator(): Simulator {
		if (this.host) return this.host.simulator;
		if (this.guest) return this.guest.simulator;
		throw Error("Not a Host or a Guest");
	}
	
	getGame(): Game {
		if (this.host) return this.host.getGame();
		if (this.guest) return this.guest.getGame();
		throw Error("Not a Host or a Guest");
	}

	protected spawnPlayer(user: User): Player {
		return randomPlayerSpawn(this.getGame(), user);
	}

	update(deltaTime: number) { }
	
	destroy() {}
}
