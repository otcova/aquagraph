import type { MinigameManager, MinigameTemplate } from ".";
import type { Game, Player, User } from "..";
import type { Vec2 } from "../../utils";
import { GameDif } from "../dif";
import { gameFrameExample } from "../game_creation";
import { randomPlayerSpawn } from "./utils";
import alea, {} from "alea";

export class Race implements MinigameTemplate {
	cameraDir: Vec2 = [0, 0];
	random: () => number;
	
	constructor(private manager: MinigameManager, seed: number) {
		this.random = alea(seed).next;
		setTimeout(() => this.start(), 1000);
	}
	
	private start() {
		const speed = 30;
		const angle = this.random() * Math.PI * 2;
		this.cameraDir = [speed * Math.cos(angle), speed * Math.sin(angle)];
	}
	
	static initialGame(): Game {
		return gameFrameExample();
	}
	
	spawnPlayer(user: User): Player {
		return randomPlayerSpawn(this.manager.getGame(), user);
	}
	
	update(deltaTime: number): void {
		const simulator = this.manager.getSimulator();
		const game = simulator.game;
		const dif = new GameDif();
		
		dif.camera = {
			position: [
				game.camera.position[0] + deltaTime * this.cameraDir[0],
				game.camera.position[1] + deltaTime * this.cameraDir[1],
			],
			size: game.camera.size,
		}
		
		simulator.updateGameDif(dif);
	}
	
	destroy(): void {
		
	}
	
}
