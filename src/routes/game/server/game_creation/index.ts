import type { GameServer } from "..";
import type { Box, Game, Lake, Player } from "../..";
import { boxSkin } from "./box";
import { createRandomBlob } from "./lake";
import { defaultPlayer, playerSkin } from "./player";

function emptyGame(): Game {
    return {
        camera: {
            topLeft: [-500, -300],
            bottomRight: [500, 300],
        },
        entities: {
            players: new Map(),
            boxes: new Map(),
            lakes: new Map(),
        },
    };
}

export function lobby(): GameServer {
    const game = emptyGame();
    game.entities.players.set(1, defaultPlayer());
    return { game };
}

/**
 * Return an offline and static GameServer that will show a single frame
*/
export function staticFrame(): GameServer {
    const players: Player[] = [{
        user: { name: "A" },
        skin: playerSkin(0, 0),
        position: [0, 0],
        velocity: [0, 0],
        angle: -0.5,
        angular_velocity: 0,
    }, {
        user: { name: "B" },
        skin: playerSkin(0, 3),
        position: [-150, -100],
        velocity: [0, 0],
        angle: 0,
        angular_velocity: 0,
    }, {
        user: { name: "C" },
        skin: playerSkin(1, 2),
        position: [-250, -400],
        velocity: [0, 0],
        angle: 2,
        angular_velocity: 0,
    }, {
        user: { name: "D" },
        skin: playerSkin(2, 1),
        position: [300, 400],
        velocity: [0, 0],
        angle: -1,
        angular_velocity: 0,
    }];

    const boxes: Box[] = [{
        skin: boxSkin(1, { lamp: true }),
        position: [-500, 200],
        angle: -0.3,
    }, {
        skin: boxSkin(1),
        position: [400, -500],
        angle: 1.2,
    }, {
        skin: boxSkin(0),
        position: [350, 100],
        angle: 0.1,
    }];

    const lakes: Lake[] = [{
        position: [300, 200],
        polygon: createRandomBlob(0),
    }, {
        position: [-300, 200],
        polygon: createRandomBlob(1),
    }, {
        position: [300, -300],
        polygon: createRandomBlob(2),
    }, {
        position: [-400, -200],
        polygon: createRandomBlob(3),
    }];

    return {
        game: {
            camera: {
                topLeft: [-700, -500],
                bottomRight: [700, 500],
            },
            entities: {
                players: new Map(players.map((v, i) => [i, v])),
                boxes: new Map(boxes.map((v, i) => [i, v])),
                lakes: new Map(lakes.map((v, i) => [i, v])),
            },
        }
    };
}

