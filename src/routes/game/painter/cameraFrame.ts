import { normalGroup } from "@pixi/lights";
import { Graphics, Sprite } from "pixi.js";
import type { Painter } from ".";
import type { GameDif } from "../dif";
import { loadTexture } from "./textures";
import blurTextureURL from "$lib/assets/blur.png";

const blurTexture = loadTexture(blurTextureURL);

export class CameraFrame {
    private frame = new Graphics();
    private frameNormal = new Graphics();
    private blur: Sprite[] = [];

    constructor(painter: Painter) {
        painter.layers.frame.addChild(this.frame);
        painter.layers.frame.addChild(this.frameNormal);

        this.frameNormal.parentGroup = normalGroup;

        blurTexture.then(texture => {
            for (let i = 0; i < 4; ++i) {
                const sprite = new Sprite(texture);
                sprite.visible = false;
                painter.layers.topFrame.addChild(sprite);
                this.blur.push(sprite);
            }
        });
    }

    update(gameDif: GameDif) {
        const camera = gameDif.camera;
        if (camera) {
            const size = 15;

            const hx = 50;
            const hy = hx * camera.size[1] / camera.size[0];

            const x = hx * 2 + size, y = hy * 2 + size;

            this.frame.clear();
            this.frame.beginFill(0x654321);
            this.frame.drawRect(-hx - size, -y + hy, size, y); // left
            this.frame.drawRect(hx, -hy, size, y); // right
            this.frame.drawRect(-hx, -hy - size, x, size); // top
            this.frame.drawRect(hx - x, hy, x, size); // bottom

            this.frameNormal.clear();
            this.frameNormal.beginFill(0x8080ff);
            this.frameNormal.drawRect(-hx - size, -y + hy, size, y); // left
            this.frameNormal.drawRect(hx, -hy, size, y); // right
            this.frameNormal.drawRect(-hx, -hy - size, x, size); // top
            this.frameNormal.drawRect(hx - x, hy, x, size); // bottom

            blurTexture.then(texture => {
                // const long = 1000;
                const size = 40;
                const margin = -5;
        
                const w = hx + margin;
                const h = hy + margin;
        
                const x = (hx + size) * 2  + 10, y = (hy + size) * 2 + 10;
                
                this.blur[0].visible = true;
                this.blur[0].position.set(-size - w, -y / 2); // left
                this.blur[0].scale.set(size / texture.width, y / texture.height);
                
                this.blur[1].visible = true;
                this.blur[1].position.set(w, -y / 2); // right
                this.blur[1].scale.set(size / texture.width, y / texture.height);
                
                this.blur[2].visible = true;
                this.blur[2].position.set(-x / 2, -size - h); // top
                this.blur[2].scale.set(x / texture.width, size / texture.height);
                
                this.blur[3].visible = true;
                this.blur[3].position.set(-x / 2, h); // bottom
                this.blur[3].scale.set(x / texture.width, size / texture.height);
                
                
            });
        }
    }
    
    destroy() {
        this.frame.destroy();
        this.frameNormal.destroy();
        for (const sprite of this.blur) sprite.destroy();
    }
}