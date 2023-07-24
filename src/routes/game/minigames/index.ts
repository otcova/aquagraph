import type { Game, Player, User } from "..";
import type { PlayerInput } from "../client/playerInput";
import { HostConnection, type PlayerInputHandle } from "../connection";
import { randomPlayerSpawn } from "./utils";

export interface Minigame {
	isHost: boolean;
	getGame(): Game;
	destroy(): void;
	handlePlayerInput(input: PlayerInput): void;
}

export class MinigameHost extends HostConnection implements Minigame {
	
	isHost = true;
	handlePlayerInput: PlayerInputHandle;
	
	constructor(game: Game, user: User) {
		super(game);
		this.simulator.beforeStep = this.update.bind(this);
		this.handlePlayerInput = this.handleNewPlayer(0, user);
	}

	protected handleNewPlayer(id: number, user: User): PlayerInputHandle {
		const player = this.spawnPlayer(user);
		this.simulator.entities.addPlayer(id, player);

		return (input: PlayerInput) => {
			const player = this.simulator.entities.players.get(id);
			if (!player) throw Error("Player Not found");
			player.handleInput(input);
		};
	}
	
	protected spawnPlayer(user: User): Player {
		return randomPlayerSpawn(this.simulator.game, user);
	}

	update(deltaTime: number) { }
}

// export class MinigameHost {
// 	private simulator: Simulator;
// 	connection?: HostConnection;

// 	constructor() {
// 	}

// 	getGame(): Game {
// 		this.simulator.simulate();
// 		return this.simulator.game;
// 	}

// 	playerInput(playerId: EntityId, input: PlayerInput) {
// 		const player = this.simulator.entities.players.get(playerId);
// 		if (!player) throw Error("Player Not found");
// 		player.handleInput(input);
// 	}
// }

// export class MinigameGuest {
// 	private simulator: Simulator;
// 	private pastReceivedFrameTime = -Infinity;

// 	constructor(private connection: GuestConnection) {
// 		this.simulator = new Simulator(connection.getGame());
// 	}

// 	getGame(): Game {
// 		const hostGame = this.connection.getGame();
// 		if (this.pastReceivedFrameTime < hostGame.time) {
// 			this.pastReceivedFrameTime = hostGame.time;
// 			this.simulator.updateGame(hostGame);
// 		} else {
// 			this.simulator.simulate();
// 		}
// 		return this.simulator.game;
// 	}
// }