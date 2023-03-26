import type { GameServer } from "..";
import type { Box, Game, Lake, Player } from "../..";
import { playerSkinColors } from "../../skins/player";
import { createRandomBlob } from "./lake";

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

/**
 * Return an offline and static GameServer that will show a single frame
*/
export function staticFrame(): GameServer {
    const players: Player[] = [{
        user: { name: "A" },
        skin: { index: 0, color: playerSkinColors[0] },
        position: [0, 0],
        velocity: [0, 0],
        angle: -0.5,
        angular_velocity: 0,
    }, {
        user: { name: "B" },
        skin: { index: 0, color: playerSkinColors[3] },
        position: [-150, -100],
        velocity: [0, 0],
        angle: 0,
        angular_velocity: 0,
    }, {
        user: { name: "C" },
        skin: { index: 1, color: playerSkinColors[2] },
        position: [-250, -400],
        velocity: [0, 0],
        angle: 2,
        angular_velocity: 0,
    }, {
        user: { name: "D" },
        skin: { index: 2, color: playerSkinColors[1] },
        position: [300, 400],
        velocity: [0, 0],
        angle: -1,
        angular_velocity: 0,
    }];

    const boxes: Box[] = [{
        skin: { index: 1 },
        position: [-500, 200],
        angle: -0.3,
        lamp: [0, 0],
    }, {
        skin: { index: 1 },
        position: [400, -500],
        angle: 1.2,
    }, {
        skin: { index: 0 },
        position: [350, 100],
        angle: 0.1,
    }];

    const lakes: Lake[] = [{
        position: [300, 200],
        vertices: createRandomBlob(0),
    }, {
        position: [-300, 200],
        vertices: createRandomBlob(1),
    }, {
        position: [300, -300],
        vertices: createRandomBlob(2),
    }, {
        position: [-400, -200],
        vertices: createRandomBlob(3),
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

