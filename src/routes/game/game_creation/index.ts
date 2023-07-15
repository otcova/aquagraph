import type { Box, Game, Lake, Player } from "..";
import { playerSkinColors } from "../skins/player";
import { createRandomBlob } from "./lake";


export function gameFrameExample(): Game {
    const players: Player[] = [/*{
        user: { name: "A" },
        skin: { index: 0, color: playerSkinColors[0] },
        swimming: false,
        position: [0, 0],
        velocity: [0, 0],
        angle: -0.5,
        angularVelocity: 0,
    }, {
        user: { name: "B" },
        skin: { index: 0, color: playerSkinColors[3] },
        swimming: false,
        position: [-150, -1],
        velocity: [0, 0],
        angle: 0,
        angularVelocity: 0,
    }, {
        user: { name: "C" },
        skin: { index: 1, color: playerSkinColors[2] },
        swimming: false,
        position: [-300, -300],
        velocity: [0, 0],
        angle: 2,
        angularVelocity: 0,
    }, {
        user: { name: "D" },
        skin: { index: 2, color: playerSkinColors[1] },
        swimming: false,
        position: [300, 400],
        velocity: [0, 0],
        angle: -1,
        angularVelocity: 0,
    }*/];

    const boxes: Box[] = [{
        skin: { index: 1 },
        position: [-50, 20],
        angle: -0.3,
        lamp: [0, 0],
    }, {
        skin: { index: 1 },
        position: [40, -50],
        angle: 1.2,
    }, {
        skin: { index: 0 },
        position: [35, 10],
        angle: 0.1,
    }];

    const lakes: Lake[] = [{
        position: [30, 20],
        vertices: createRandomBlob(0),
    }, {
        position: [-30, 20],
        vertices: createRandomBlob(1),
    }, {
        position: [30, -30],
        vertices: createRandomBlob(2),
    }, {
        position: [-40, -20],
        vertices: createRandomBlob(3),
    }];

    return {
        camera: {
            topLeft: [-70, -50],
            bottomRight: [70, 50],
        },
        entities: {
            players: new Map(players.map((v, i) => [i, v])),
            boxes: new Map(boxes.map((v, i) => [i, v])),
            lakes: new Map(lakes.map((v, i) => [i, v])),
        },
        effects: [],
    };
}

