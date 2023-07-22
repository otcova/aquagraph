import { normalGroup } from "@pixi/lights";
import { Graphics } from "pixi.js";
import type { Painter } from ".";
import type { GameDif } from "../../dif";

export class CameraFrame {
    private frame = new Graphics();
    private frameNormal = new Graphics();

    constructor(painter: Painter) {
        painter.layers.frame.addChild(this.frame);
        painter.layers.frame.addChild(this.frameNormal);

        this.frameNormal.parentGroup = normalGroup;
    }

    update(gameDif: GameDif) {
        const camera = gameDif.camera;
        if (camera) {
            const size = 500;

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
        }
    }
}