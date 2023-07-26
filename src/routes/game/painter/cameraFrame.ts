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
                painter.layers.topFrame.addChild(sprite);
                this.blur.push(sprite);
            }
        });
    }

    update(gameDif: GameDif) {
        const camera = gameDif.camera;
        if (camera) {
            const size = 1000;

            const hx = 50;
            const hy = hx * camera.size[1] / camera.size[0];

            this.frame.clear();
            this.frame.beginFill(0x654321);
            this.frame.drawRect(-hx - size, -size + hy, size, size); // left
            this.frame.drawRect(hx, -hy, size, size); // right
            this.frame.drawRect(-hx, -hy - size, size, size); // top
            this.frame.drawRect(hx - size, hy, size, size); // bottom

            this.frameNormal.clear();
            this.frameNormal.beginFill(0x8080ff);
            this.frameNormal.drawRect(-hx - size, -size + hy, size, size); // left
            this.frameNormal.drawRect(hx, -hy, size, size); // right
            this.frameNormal.drawRect(-hx, -hy - size, size, size); // top
            this.frameNormal.drawRect(hx - size, hy, size, size); // bottom

            blurTexture.then(texture => {
                const long = 1000;
                const short = 40;
                const margin = -5;
                const w = hx + margin;
                const h = hy + margin;

                this.blur[0].position.set(-short - w, -long / 2); // left
                this.blur[0].scale.set(short / texture.width, long / texture.height);

                this.blur[1].position.set(w, -long / 2); // right
                this.blur[1].scale.set(short / texture.width, long / texture.height);

                this.blur[2].position.set(-long / 2, -short - h); // top
                this.blur[2].scale.set(long / texture.width, short / texture.height);

                this.blur[3].position.set(-long / 2, h); // bottom
                this.blur[3].scale.set(long / texture.width, short / texture.height);
            });
        }
    }
}