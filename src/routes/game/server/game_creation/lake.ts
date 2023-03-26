import { createNoise2D } from "simplex-noise";
import alea from "alea";
import type { Vec2 } from "../../../utils";

export function createRandomBlob(seed: number): Float32Array {
    const random = alea(seed);
    const noise = createNoise2D(random);

    const vertsCount = 8;
    const angleStep = 2 * Math.PI / vertsCount;

    let radius = 80 + 200 * random.next();
    if (radius < 100 && random.next() > 0.5) radius += 120;

    const noiseScale = radius * 0.6;
    const noiseSize = radius / 300;

    const verts = new Float32Array(2 * vertsCount);

    let angle = 0;

    for (let i = 0; i < verts.length; i += 2) {
        const x = Math.cos(angle);
        const y = Math.sin(angle);

        const r = radius + noiseScale * noise(x * noiseSize, y * noiseSize);

        verts[i] = r * x;
        verts[i + 1] = r * y;

        angle += angleStep;
    }

    return smoothSubdividePolygon(verts, 4);
}

export function smoothSubdividePolygon(vertices: Float32Array, numSubdivisions: number): Float32Array {
    const smoothPolyghon = new Float32Array(vertices.length * numSubdivisions);
    const step = 1 / numSubdivisions;

    let smoothIndex = 0;

    for (let i = 0; i < vertices.length * 2; i += 2) {
        const i0 = i == 0 ? vertices.length - 2 : i - 2;
        const i1 = i;
        const i2 = (i + 2) % vertices.length;
        const i3 = (i + 4) % vertices.length;

        const ax = vertices[i0], ay = vertices[i0 + 1];
        const bx = vertices[i1], by = vertices[i1 + 1];
        const cx = vertices[i2], cy = vertices[i2 + 1];
        const dx = vertices[i3], dy = vertices[i3 + 1];

        smoothPolyghon[smoothIndex++] = bx;
        smoothPolyghon[smoothIndex++] = by;

        for (let t = step; t < 1 - Number.EPSILON; t += step) {
            // Catmull–Rom spline
            smoothPolyghon[smoothIndex++] =
                bx + 0.5 * t * (cx - ax + t * (2 * ax - 5 * bx + 4 * cx - dx + t * (3 * (bx - cx) + dx - ax)));
            smoothPolyghon[smoothIndex++] =
                by + 0.5 * t * (cy - ay + t * (2 * ay - 5 * by + 4 * cy - dy + t * (3 * (by - cy) + dy - ay)));
        }
    }

    return smoothPolyghon;
}

