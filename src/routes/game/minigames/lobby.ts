import { Minigame } from ".";
import type { Game } from "..";
import { GameDif } from "../dif";

export class Lobby extends Minigame {
	constructor(game?: Game) {
		super(game);
		this.simulator.beforeStep = this.update.bind(this);
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