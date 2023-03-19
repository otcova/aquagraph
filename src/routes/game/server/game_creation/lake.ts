import { createNoise2D } from "simplex-noise";
import alea from "alea";
import type { Vec2 } from "../../../utils";

export function createRandomBlob(seed: number): Vec2[] {
    const random = alea(seed);
    const noise = createNoise2D(random);

    const vertsCount = 8;
    const angleStep = 2 * Math.PI / vertsCount;

    let radius = 80 + 200 * random.next();
    if (radius < 100 && random.next() > 0.5) radius += 120;

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

    return smoothSubdividePolygon(verts, 4);
}


export function smoothSubdividePolygon(points: Vec2[], numSubdivisions: number): Vec2[] {
    const smoothPolyghon: Vec2[]  = [];
    const step = 1 / numSubdivisions;

    for (let i = 0; i < points.length; ++i) {
        const p0 = points[i - 1] ?? points[points.length - 1];
        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];
        const p3 = points[(i + 2) % points.length];
        smoothPolyghon.push(p1);

        for (let t = step; t < 1 - Number.EPSILON; t += step) {
            // Catmull–Rom spline
            smoothPolyghon.push([
                p1[0] + 0.5 * t * (p2[0] - p0[0] + t * (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0] + t * (3 * (p1[0] - p2[0]) + p3[0] - p0[0]))),
                p1[1] + 0.5 * t * (p2[1] - p0[1] + t * (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1] + t * (3 * (p1[1] - p2[1]) + p3[1] - p0[1])))
            ]);
        }
    }

    return smoothPolyghon;
}
