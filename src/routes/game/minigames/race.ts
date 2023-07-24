import { MinigameHost } from ".";
import type { User } from "..";
import { GameDif } from "../dif";
import { gameFrameExample } from "../game_creation";

export class RaceMinigameHost extends MinigameHost {
	constructor(user: User) {
		super(gameFrameExample(), user);
	}

	update(deltaTime: number) {
		const dif = new GameDif();
		const game = this.simulator.game;

		dif.camera = {
			position: [game.camera.position[0] + deltaTime * 10, 0],
			size: game.camera.size,
		};
		this.simulator.updateGameDif(dif);
	}
};