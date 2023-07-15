import type { Game, Player, User } from "..";
import { randomSkin } from "../skins/player";

export function randomPlayerSpawn(game: Game, user: User): Player {
	return {
		user,
		skin: randomSkin(),
		swimming: false,
		position: [20* Math.random()-50, -10],
		velocity: [0, 0],
		angle: -0.5,
		angularVelocity: 0,
	};
}