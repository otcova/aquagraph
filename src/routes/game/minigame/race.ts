import { createNoise2D } from "simplex-noise";
import type { MinigameManager, MinigameTemplate } from ".";
import type { Camera, Game, Player, User } from "..";
import { easeInOutQuad, type Vec2 } from "../../utils";
import { GameDif } from "../dif";
import { createBoxes, createFrameBoxes, createLakes } from "../game_creation";
import { randomPlayerSpawn } from "./utils";
import alea, { } from "alea";

const cameraRatio = 1.8;
const initialCameraSize: Vec2 = [140 * cameraRatio, 140];

export class Race implements MinigameTemplate {
	cameraDir: Vec2 = [0, 0];
	random: () => number;
	noise: (x: number, channel: number) => number;

	constructor(private manager: MinigameManager, seed: number) {
		const randGen = alea(seed);
		this.random = randGen.next;
		const noise = createNoise2D(randGen);
		this.noise = (x: number, channel: number) => noise(x, channel * 500);

		this.start();
	}

	private start() {
		const speed = 30;
		const angle = this.random() * Math.PI * 2;
		this.cameraDir = [speed * Math.cos(angle), speed * Math.sin(angle)];
	}

	static initialGame(seed: number): Game {
		const rnd = alea(seed).next;
		const camera: Camera = {
			position: [0, 0],
			size: initialCameraSize,
		};

		const frameBoxes = createFrameBoxes(rnd, [100, 100 / cameraRatio]);
		const boxes = createBoxes(rnd, initialCameraSize, 5 + rnd() * 5);
		const lakes = createLakes(rnd, initialCameraSize, 20);

		return {
			camera,
			entities: {
				players: new Map(),
				boxes: new Map(boxes.map((v, i) => [i, v])),
				lakes: new Map(lakes.map((v, i) => [i, v])),
				frameBoxes: new Map(frameBoxes.map((v, i) => [i, v])),
			},
			time: 0,
			light: 0.2 + rnd() * 0.4,
		};
	}

	spawnPlayer(user: User): Player {
		return randomPlayerSpawn(this.manager.getGame(), user);
	}

	update(deltaTime: number): void {
		const simulator = this.manager.getSimulator();
		const game = simulator.game;
		const dif = new GameDif();


		const w = initialCameraSize[0] / 3;
		const h = w * cameraRatio;

		const startMove = 20;
		const maxSpeed = 30;
		const speed = Math.max(0, Math.min(maxSpeed, game.time - startMove)) / 1000;

		const zoomStart = 5;
		const zoomTime = 50;
		const startSize = initialCameraSize[1];
		const minSize = 60;
		const t = (game.time - zoomStart) / zoomTime;
		const cameraSize = (1 - easeInOutQuad(t)) * (startSize - minSize) + minSize;

		dif.camera = {
			position: [
				this.noise(game.time * speed, 0) * w / 2,
				this.noise(game.time * speed, 1) * h / 2,
			],
			size: [
				cameraSize * cameraRatio,
				cameraSize,
			]
		}

		simulator.updateGameDif(dif);
	}

	destroy(): void {

	}

}
