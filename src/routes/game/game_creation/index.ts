import type { Box, Camera, FrameBox, Game, Lake, Player } from "..";
import { randomRange, type NextRandom, type Vec2 } from "../../utils";
import { createRandomBlob, type BlobConfig, randomBlobConfig, createBlob } from "./lake";

// export function gameFrameExample(): Game {
//     const camera: Camera = {
//         position: [0, 0],
//         size: [120 * 1.8, 120],
//     };

//     const boxes: Box[] = [{
//         skin: { index: 1 },
//         position: [-50, 20],
//         angle: -0.3,
//         lamps: [[0, 4]],
//     }, {
//         skin: { index: 1 },
//         position: [40, -50],
//         angle: 1.2,
//         lamps: [[14, 14]],
//     }, {
//         skin: { index: 0 },
//         position: [35, 10],
//         angle: 0.1,
//     }];

//     const lakes: Lake[] = [{
//         position: [30, 20],
//         vertices: createRandomBlob(0),
//     }, {
//         position: [-30, 20],
//         vertices: createRandomBlob(1),
//     }, {
//         position: [30, -30],
//         vertices: createRandomBlob(2),
//     }, {
//         position: [-40, -20],
//         vertices: createRandomBlob(3),
//     }];

//     const frameBoxes = createFrameBoxes([100, 100 * camera.size[1] / camera.size[0]]);

//     return {
//         camera,
//         entities: {
//             players: new Map(),
//             boxes: new Map(boxes.map((v, i) => [i, v])),
//             lakes: new Map(lakes.map((v, i) => [i, v])),
//             frameBoxes: new Map(frameBoxes.map((v, i) => [i, v])),
//         },
//         time: 0,
//         light: 0.4,
//     };
// }

export function createLakes(rnd: NextRandom, area: Vec2, amount: number): Lake[] {
    const maxTries = 50;
    
    const lakes: Lake[] = [];
    const blobs: [Vec2, BlobConfig][] = [];
    
    TRY_POS: for (let i = 0; i < maxTries; ++i) {
        const position: Vec2 = [
            (rnd() - 0.5) * area[0],
            (rnd() - 0.5) * area[1],
        ];
        const blob = randomBlobConfig(rnd);
        const blobR = blob.radius + blob.noiseScale;
        
        for (const [p, b] of blobs) {
            const x = p[0] - position[0];
            const y = p[1] - position[1];

            if (x * x + y * y < (b.radius + b.noiseScale + blobR) ** 2) {
                continue TRY_POS;
            }
        }
        
        blobs.push([position, blob]);
        lakes.push({
            position,
            vertices: createBlob(blob),
        });
        if (lakes.length >= amount) break;
        i = 0;
    }
    
    return lakes;
}

export function createBoxes(rnd: NextRandom, area: Vec2, amount: number): Box[] {
    const maxTries = 20;
    const boxes: Box[] = [];
    const sqBoxMinDist = 50 ** 2;

    TRY_POS: for (let i = 0; i < maxTries; ++i) {

        const position: Vec2 = [
            (rnd() - 0.5) * area[0],
            (rnd() - 0.5) * area[1],
        ];


        for (const box of boxes) {
            const x = box.position[0] - position[0];
            const y = box.position[1] - position[1];

            if (x * x + y * y < sqBoxMinDist) {
                continue TRY_POS;
            }
        }


        boxes.push({
            angle: rnd() * Math.PI * 2,
            position,
            skin: { index: Math.floor(rnd() * 2) },
            lamps: [],
        });
        if (boxes.length >= amount) break;
        i = 0;
    }

    return boxes;
}

export function createFrameBoxes(rnd: NextRandom, frameSize: Vec2): FrameBox[] {
    const boxes: FrameBox[] = [];

    const hx = frameSize[0] / 2;
    const hy = frameSize[1] / 2;

    createFrameBoxesLine(rnd, [-hx, hy], [1, 0], frameSize[0], boxes);
    createFrameBoxesLine(rnd, [hx, hy], [0, -1], frameSize[1], boxes);
    createFrameBoxesLine(rnd, [hx, -hy], [-1, 0], frameSize[0], boxes);
    createFrameBoxesLine(rnd, [-hx, -hy], [0, 1], frameSize[1], boxes);

    return boxes;
}


/// dir is a unitary vector
function createFrameBoxesLine(rnd: NextRandom, start: Vec2, dir: Vec2, len: number, list: FrameBox[]) {
    let i = 0;

    const minSize = 9;
    const maxSize = 15;
    const minOffset = 0.1;
    const maxOffset = 0.8;
    const minMargin = 0.5;
    const maxMargin = 3;
    const long = 10;

    while (i < len) {
        const margin = randomRange(minMargin, maxMargin, rnd);
        const boxSize = randomRange(minSize, maxSize, rnd);

        const offset = (long + boxSize * randomRange(minOffset, maxOffset, rnd)) / 2;

        i += boxSize / 2;

        list.push({
            position: [start[0] + dir[0] * i - dir[1] * offset, start[1] + dir[1] * i + dir[0] * offset],
            color: 0x432612,
            size: [boxSize + Math.abs(dir[1]) * long, boxSize + Math.abs(dir[0]) * long],
        });

        i += boxSize / 2 + margin;
    }
}

