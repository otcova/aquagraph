import { normalGroup } from "@pixi/lights";
import { DRAW_MODES, Mesh, MeshGeometry, MeshMaterial, Texture, utils } from "pixi.js";
import { quadOut } from "svelte/easing";
import type { Painter } from "..";
import type { Lake } from "../..";
import { smoothSubdividePolygon } from "../../game_creation/lake";

export class LakePainter {
    mesh: Mesh;
    shadows: Mesh[] = [];
    normalShadows: Mesh[] = [];
    geometry: MeshGeometry;

    constructor(painter: Painter, lake: Lake) {
        const vertices = smoothSubdividePolygon(lake.vertices, 8);
        const indices = new Int16Array(utils.earcut(vertices));
        this.geometry = new MeshGeometry(vertices, undefined, indices);
        
        for (let i = 0; i < 3; ++i) {
            const mesh = new Mesh(
                this.geometry,
                new MeshMaterial(Texture.WHITE),
                undefined,
                DRAW_MODES.TRIANGLES,
            );
            mesh.tint = 0x008080;
            mesh.position.set(...lake.position);
            
            painter.layers.lake.addChild(mesh);

            this.shadows.push(mesh);
        }
        
        this.mesh = new Mesh(
            this.geometry,
            new MeshMaterial(Texture.WHITE),
            undefined,
            DRAW_MODES.TRIANGLES,
        );
        this.mesh.tint = 0x008080;
        this.mesh.position.set(...lake.position);
        painter.layers.lake.addChild(this.mesh);
        

        for (let i = 0; i < 3; ++i) {
            const mesh = new Mesh(
                this.geometry,
                new MeshMaterial(Texture.WHITE),
                undefined,
                DRAW_MODES.TRIANGLES,
            );
            mesh.tint = 0x8080ff;
            mesh.parentGroup = normalGroup;
            
            this.mesh.addChild(mesh);

            this.normalShadows.push(mesh);
        }
    }

    animate() {
        const duration = 6;
        const seconds = performance.now() / 1000;
        const values = new Array(this.shadows.length);

        for (let i = 0; i < values.length; ++i) {
            const offset = duration * i / values.length;
            values[i] = ((seconds + offset) % duration) / duration;
        }

        values.sort().reverse();

        for (let i = 0; i < values.length; ++i) {
            const t = values[i];
            const scale = 1 + quadOut(t) * 0.1;
            this.shadows[i].scale.set(scale, scale);
            this.normalShadows[i].scale.set(scale, scale);

            const color = Math.round(0x80 * 0.9 * (1 - t));
            this.shadows[i].tint = (color << 8) + color;
            this.shadows[i].alpha = quadOut(1 - t);
            this.normalShadows[i].alpha = Math.min(1, quadOut(1 - t) * 2);
        }
    }

    destroy() {
        this.mesh.destroy();
        for (const mesh of this.shadows) mesh.destroy();
        for (const mesh of this.normalShadows) mesh.destroy();
        this.geometry.destroy();
    }
}
