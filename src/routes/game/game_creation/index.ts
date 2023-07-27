import type { Box, Camera, FrameBox, Game, Lake, Player } from "..";
import { randomRange, type Vec2 } from "../../utils";
import { createRandomBlob } from "./lake";

export function gameFrameExample(): Game {
    const camera: Camera = {
        position: [0, 0],
        size: [120 * 1.8, 120],
    };
    
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
        lamps: [[0, 4]],
    }, {
        skin: { index: 1 },
        position: [40, -50],
        angle: 1.2,
        lamps: [[14, 14]],
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

    const frameBoxes = createFrameBoxes([100, 100 * camera.size[1] / camera.size[0]]);

    return {
        camera,
        entities: {
            players: new Map(players.map((v, i) => [i, v])),
            boxes: new Map(boxes.map((v, i) => [i, v])),
            lakes: new Map(lakes.map((v, i) => [i, v])),
            frameBoxes: new Map(frameBoxes.map((v, i) => [i, v])),
        },
        time: 0,
        light: 0.4,
    };
}

const defaultConfig = {
    minSize: 9,
    maxSize: 15,
    minOffset: 0.1,
    maxOffset: 0.8,
    minMargin: 0.5,
    maxMargin: 3,
    long: 10,
};


export function createFrameBoxes(frameSize: Vec2, config = defaultConfig): FrameBox[] {
    const boxes: FrameBox[] = [];

    const hx = frameSize[0] / 2;
    const hy = frameSize[1] / 2;

    createFrameBoxesLine([-hx, hy], [1, 0], frameSize[0], boxes, config);
    createFrameBoxesLine([hx, hy], [0, -1], frameSize[1], boxes, config);
    createFrameBoxesLine([hx, -hy], [-1, 0], frameSize[0], boxes, config);
    createFrameBoxesLine([-hx, -hy], [0, 1], frameSize[1], boxes, config);
    
    return boxes;
}


/// dir is a unitary vector
function createFrameBoxesLine(start: Vec2, dir: Vec2, len: number, list: FrameBox[], config: typeof defaultConfig) {
    let i = 0;
    
    while (i < len) {
        const margin = randomRange(config.minMargin, config.maxMargin);
        const boxSize = randomRange(config.minSize, config.maxSize);
        
        const offset = (config.long + boxSize * randomRange(config.minOffset, config.maxOffset)) / 2;
        
        i += boxSize / 2;
        
        list.push({
            position: [start[0] + dir[0] * i - dir[1] * offset, start[1] + dir[1] * i + dir[0] * offset],
            color: 0x432612,
            size: [boxSize + Math.abs(dir[1]) * config.long, boxSize + Math.abs(dir[0]) * config.long],
        });
        
        i += boxSize / 2 + margin;
    }
}

