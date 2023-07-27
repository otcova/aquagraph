import alea from "alea";
import { createNoise2D, type NoiseFunction2D } from "simplex-noise";
import type { NextRandom as RandomFn } from "../../utils";

export function createRandomBlob(seed: number): Float32Array {
    return createBlob(randomBlobConfig(alea(seed)));
}

export interface BlobConfig {
    noise: NoiseFunction2D,
    radius: number,
    angleStep: number,
    noiseSize: number,
    noiseScale: number,
    vertsCount: number,
}

export function randomBlobConfig(rnd: RandomFn): BlobConfig {
    const noise = createNoise2D(rnd);
    const vertsCount = 8;

    let radius = 8 + 20 * rnd();
    if (radius < 10 && rnd() > 0.5) radius += 12;

    return {
        noise,
        radius,
        angleStep: 2 * Math.PI / vertsCount,
        noiseSize: radius / 30,
        noiseScale: radius * 0.6,
        vertsCount,
    };
}

export function createBlob(config: BlobConfig): Float32Array {
    const verts = new Float32Array(2 * config.vertsCount);

    let angle = 0;

    for (let i = 0; i < verts.length; i += 2) {
        const x = Math.cos(angle);
        const y = Math.sin(angle);

        const r = config.radius + config.noiseScale * config.noise(x * config.noiseSize, y * config.noiseSize);

        verts[i] = r * x;
        verts[i + 1] = r * y;

        angle += config.angleStep;
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

