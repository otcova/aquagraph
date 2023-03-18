import { createNoise2D } from "simplex-noise";
import alea from "alea";
import type { Vec2 } from "../../../utils";

export function createRandomBlob(seed: number): Vec2[] {
    const random = alea(seed);
    const noise = createNoise2D(random);

    const vertsCount = 8;
    const angleStep = 2 * Math.PI / vertsCount;

    const radius = 80 + 200 * random.next();

    const noiseScale = radius * 0.6;
    const noiseSize = radius / 300;

    const verts: Vec2[] = new Array(vertsCount);

    let angle = 0;

    for (let i = 0; i < vertsCount; ++i) {
        const x = Math.cos(angle);
        const y = Math.sin(angle);

        const r = radius + noiseScale * noise(x * noiseSize, y * noiseSize);

        verts[i] = [r * x, r * y];

        angle += angleStep;
    }

    return verts;
}
