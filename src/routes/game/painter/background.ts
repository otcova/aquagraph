import { normalGroup } from "@pixi/lights";
import { Graphics, Sprite, Texture } from "pixi.js";
import { createNoise2D } from "simplex-noise";
import type { Painter } from ".";
import type { GameDif } from "../dif";
import type { Vec2 } from "../../utils";

export class Background {
    private normals: Graphics;
    private color: Sprite;

    constructor(painter: Painter) {
        this.normals = new Graphics();
        this.normals.parentGroup = normalGroup;
        painter.layers.background.addChild(this.normals);
        
        this.color = new Sprite(Texture.WHITE);
        this.color.tint = 0x222222;
        painter.layers.background.addChild(this.color);
    }

    update(gameDif: GameDif) {
        const camera = gameDif.camera;
        if (camera) {
            const margin = 20;

            const w = camera.size[0] + margin * 2;
            const h = camera.size[1] + margin * 2;

            this.normals.clear();
            paintNormals(this.normals, [w, h]);
            this.normals.position.set(camera.position[0] - w / 2, camera.position[1] - h / 2);
            
            this.color.position.set(camera.position[0] - w / 2, camera.position[1] - h / 2);
            this.color.scale.set(w / this.color.texture.width, h / this.color.texture.height);
        }
    }

    destroy() {
        this.color.destroy();
        this.normals.destroy();
    }
}

const noise = createNoise2D();

function paintNormals(g: Graphics, size: Vec2): Graphics {
    const space = 10;
    const width = Math.ceil(size[0] / space);
    const height = Math.ceil(size[1] / space);

    // [x, y, height, ...]
    const vertices = new Float32Array(3 * width * height);

    for (let y = 0, i = 0; y < height; ++y) {
        for (let x = 0; x < width; ++x) {
            vertices[i++] = x * space + 0.5 * space * (noise(x, y) + 1) / 2;
            vertices[i++] = y * space + 0.5 * space * (noise(x, y) + 1) / 2;
            vertices[i++] = noise(x, y) > 0 ? 0.5 * space : 0;
        }
    }
    g.x = -space;
    g.y = -space;

    for (let y = 0; y < height - 1; ++y) {
        let a = 3 * y * width;
        let b = a + 3 * width;

        for (let x = 0; x < width - 1; ++x) {
            g.beginFill(triangleNormal(vertices, a, a + 3, b));
            g.moveTo(vertices[a], vertices[a + 1]);
            g.lineTo(vertices[a + 3], vertices[a + 3 + 1]);
            g.lineTo(vertices[b], vertices[b + 1]);
            g.endFill();

            g.beginFill(triangleNormal(vertices, b, a + 3, b + 3));
            g.moveTo(vertices[b], vertices[b + 1]);
            g.lineTo(vertices[a + 3], vertices[a + 3 + 1]);
            g.lineTo(vertices[b + 3], vertices[b + 3 + 1]);
            g.endFill();

            a += 3;
            b += 3;
        }
    }
    return g;
}

function triangleNormal(verts: ArrayLike<number>, a: number, b: number, c: number): number {
    const Ax = verts[b] - verts[a];
    const Ay = verts[b + 1] - verts[a + 1];
    const Az = verts[b + 2] - verts[a + 2];

    const Bx = verts[c] - verts[a];
    const By = verts[c + 1] - verts[a + 1];
    const Bz = verts[c + 2] - verts[a + 2];

    const x = Ay * Bz - Az * By;
    const y = Az * Bx - Ax * Bz;
    const z = Ax * By - Ay * Bx;

    const len = 2 * Math.hypot(x, y, z);

    const red = Math.round(0xFF * (0.5 + x / len));
    const green = Math.round(0xFF * (0.5 - y / len));
    const blue = Math.round(0xFF * (0.5 + z / len));

    return (red << 16) + (green << 8) + blue;
}
