import type { EntityId, Game, User } from "..";
import type { PlayerInput } from "../client/player";
import { gameFrameExample } from "../game_creation";
import { Simulator } from "../simulator";
import { randomPlayerSpawn } from "./utils";

export class Minigame {
	protected simulator: Simulator;
	private player_count = 0;
	
	constructor(game?: Game) {
		if (!game) game = gameFrameExample();
		this.simulator = new Simulator(game);
	}
	
	syncState(game: Game): void {
		this.simulator.updateGame(game);
	}
	
	getGame(): Game {
        this.simulator.simulate();
        return this.simulator.game;
    }
	
	spawnPlayer(user: User): EntityId {
		const id = ++this.player_count;
		const player = randomPlayerSpawn(this.simulator.game, user);
		this.simulator.entities.addPlayer(id, player);
		return id;
	}
	
	playerInput(playerId: EntityId, input: PlayerInput) {
		const player = this.simulator.entities.players.get(playerId);
		if (!player) throw Error("Player Not found");
		player.handleInput(input);
	}
}