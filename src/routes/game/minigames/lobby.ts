import { MinigameHost } from ".";
import type { Camera, EntityId, Game, Player, User } from "..";
import { randomRange, type Vec2 } from "../../utils";
import { GameDif } from "../dif";
import { createFrameBoxes } from "../game_creation";
import { createRandomBlob } from "../game_creation/lake";
import { randomSkin } from "../skins/player";

export class LobbyHost extends MinigameHost {
	constructor(user: User) {
		const camera: Camera = {
			position: [0, 0],
			size: [110 * 1.8, 110],
		};
		const frameBoxes = createFrameBoxes([100, 100 * camera.size[1] / camera.size[0]]);
		
		frameBoxes.push({
			color: 0x432612,
			position: [-20, 0],
			size: [20, 30],
		});

		const game: Game = {
			camera,
			entities: {
				players: new Map(),
				boxes: new Map([[0, {
					angle: 0.4,
					position: [60, -10],
					skin: { index: 1 },
					lamps: [[5, 15]],
				}]]),
				lakes: new Map([[0, {
					position: [30, -20],
					vertices: createRandomBlob(5),
				}], [1, {
					position: [50, 30],
					vertices: createRandomBlob(4),
				}]]),
				frameBoxes: new Map(frameBoxes.map((v, i) => [i, v])),
			},
			time: 0,
			light: 0.5,
		};
		super(game, user);
	}
	
	spawnPlayer(user: User): Player {
		return {
			user,
			state: "playing",
			skin: randomSkin(),
			swimming: false,
			position: this.newSpawnPos(),
			velocity: [0, 0],
			angle: Math.random() * Math.PI * 2,
			angularVelocity: 0,
			dashPower: 1,
			dashEffects: [],
			deathEffects: [],
			move: [0, 0],
		} as Player;
	}

	update(deltaTime: number) {
		const dif = new GameDif();
		const game = this.simulator.game;

		// Respawn everyone
		for (const [id, player] of game.entities.players) {
			if (player.state == "death") {
				player.position = this.newSpawnPos();
				player.velocity = [0, 0];
				player.angularVelocity = 0;
				player.move = [0, 0];
				player.state = "playing";
				dif.entities.players.updated.push([id, player]);
			}
		}
		
		this.simulator.updateGameDif(dif);
	}

	private newSpawnPos(): Vec2 {
		const radious = 10;
		return [30 + randomRange(-radious, radious), -20 + randomRange(-radious, radious)];
	}
};