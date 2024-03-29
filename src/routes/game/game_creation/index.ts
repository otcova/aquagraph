import type { Box, FrameBox, Lake } from "..";
import { randomRange, type NextRandom, type Vec2 } from "../../utils";
import { createBlob, randomBlobConfig, type BlobConfig } from "./lake";

export function createLakes(rnd: NextRandom, area: Vec2, amount: number): Lake[] {
    const maxTries = 50;

    const lakes: Lake[] = [];
    const blobs: [Vec2, BlobConfig][] = [];

    const hx = area[0] / 2, hy = area[1] / 2;

    TRY_POS: for (let i = 0; i < maxTries; ++i) {
        let position: Vec2 = [
            (rnd() - 0.5) * area[0],
            (rnd() - 0.5) * area[1],
        ];

        const blob = randomBlobConfig(rnd);
        const blobR = blob.radius + blob.noiseScale;

        if (blobs.length) {
            for (let i = 0; i < 10; ++i) {
                let [neightborPos, neightborBlob] = blobs[Math.floor(rnd() * blobs.length)];
                const angle = rnd() * Math.PI * 2;
                const d = neightborBlob.radius + neightborBlob.noiseScale + blobR;
                position = [
                    neightborPos[0] + d * Math.cos(angle),
                    neightborPos[1] + d * Math.sin(angle),
                ];

                if (-hx <= position[0] && position[0] <= hx && -hy <= position[1] && position[1] < hy) break;
            }
        }

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

        const skinIndex = Math.floor(rnd() * 2);
        const lamps: Vec2[] = [];

        if (rnd() < 0.5) {
            lamps.push([6, 6]);
        }

        boxes.push({
            angle: rnd() * Math.PI * 2,
            position,
            skin: { index: skinIndex },
            lamps,
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

