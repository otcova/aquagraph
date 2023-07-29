import { utils } from "pixi.js";
import { PowerUp, type Coin, type Game, type Lake, type Player, type User } from "..";
import { pointInsideTriangle, type NextRandom, type Vec2 } from "../../utils";

export function randomPlayerSpawn(game: Game, user: User): Player {
	const maxTries = 400;
	const validAreaRatio = 0.7;

	let position = game.camera.position;
	let goodPosition = false;

	TRY_POS: for (let i = 0; i < maxTries; ++i) {
		const pos: Vec2 = [
			game.camera.position[0] + game.camera.size[0] * validAreaRatio * (Math.random() - 0.5),
			game.camera.position[1] + game.camera.size[1] * validAreaRatio * (Math.random() - 0.5),
		];

		// test boxes
		if (boxesCollision(pos, game)) continue TRY_POS;

		position = pos;

		// test lakes
		for (const lake of game.entities.lakes.values()) {
			const point: Vec2 = [
				pos[0] - lake.position[0],
				pos[1] - lake.position[1],
			];

			if (lakeCollision(point, lake)) {
				position = pos;
				goodPosition = true;
				break TRY_POS;
			}

		}
	}

	// Try to spawn at the center of a lake
	if (!goodPosition) {
		const hx = game.camera.size[0] * validAreaRatio / 2;
		const hy = game.camera.size[1] * validAreaRatio / 2;

		for (const lake of game.entities.lakes.values()) {
			const x = lake.position[0] - game.camera.position[0];
			const y = lake.position[1] - game.camera.position[1];

			// Frame collision
			if (x < -hx || hx < x || y < -hy || hy < y) continue;

			position = lake.position;

			// Boxes collision
			if (boxesCollision(lake.position, game)) continue;

			break;
		}
	}

	return {
		user,
		state: "playing",
		swimming: true,
		position,
		velocity: [0, 0],
		angle: -0.5,
		angularVelocity: 0,
		dashPower: 1,
		dashEffects: [],
		deathEffects: [],
		move: [0, 0],
	};
}

export function randomCoin(game: Game, rnd: NextRandom = Math.random): Coin | undefined {
	let coin: Coin | undefined;
	
	const maxTries = 20;
	const sqMinPlayerDistance = 5 ** 2;
	
    TRY_POS: for (let i = 0; i < maxTries; ++i) {

        const position: Vec2 = [
            (rnd() - 0.5) * 0.8*game.camera.size[0] + game.camera.position[0],
            (rnd() - 0.5) * 0.8*game.camera.size[1] + game.camera.position[1],
        ];


        if (boxesCollision(position, game)) continue;
		
		for (const player of game.entities.players.values()) {
			const x = player.position[0] - position[0];
			const y = player.position[1] - position[1];
			if (x * x + y * y < sqMinPlayerDistance) continue TRY_POS;
		}

		coin = {
			position,
			type: rnd() * PowerUp.LENGTH,
		};
        break;
    }

    return coin;
}

function boxesCollision(pos: Vec2, game: Game): boolean {
	const sqBoxMinDist = 25 ** 2;

	for (const box of game.entities.boxes.values()) {
		const x = pos[0] - box.position[0];
		const y = pos[1] - box.position[1];

		if (x * x + y * y < sqBoxMinDist) {
			return true;
		}
	}

	return false;
}

function lakeCollision(pos: Vec2, lake: Lake): boolean {
	const triangles = utils.earcut(lake.vertices);
	const shapes = new Array(triangles.length / 3);

	for (let i = 0; i < shapes.length;) {
		const i0 = triangles[i++] * 2;
		const i1 = triangles[i++] * 2;
		const i2 = triangles[i++] * 2;
		const v0: Vec2 = [lake.vertices[i0], lake.vertices[i0 + 1]];
		const v1: Vec2 = [lake.vertices[i1], lake.vertices[i1 + 1]];
		const v2: Vec2 = [lake.vertices[i2], lake.vertices[i2 + 1]];

		if (pointInsideTriangle(pos, v0, v1, v2)) {

			return true;
		}
	}

	return false;
}