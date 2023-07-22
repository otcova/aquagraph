import { normalGroup } from "@pixi/lights";
import { Graphics } from "pixi.js";
import type { Painter } from "..";
import type { FrameBox } from "../../..";

export class FrameBoxPainter {
    graphics: Graphics;
    normalGraphics: Graphics;

    constructor(painter: Painter, box: FrameBox) {
        this.graphics = new Graphics();
        this.normalGraphics = new Graphics();
        this.normalGraphics.parentGroup = normalGroup;

        this.graphics.position.set(...box.position);
        painter.layers.frame.addChild(this.graphics);
        this.graphics.addChild(this.normalGraphics);

        this.graphics.beginFill(box.color);
        this.normalGraphics.beginFill(encodeNormal(-box.position[0], box.position[1], 40));
        const w = box.size[0];
        const h = box.size[1];
        this.graphics.drawRoundedRect(w / -2, h / -2, w, h, .9);
        this.normalGraphics.drawRoundedRect(w / -2, h / -2, w, h, .9);
    }

    destroy() {
        this.graphics.destroy();
        this.normalGraphics.destroy();
    }
}


function encodeNormal(x: number, y: number, z: number) {
    const len = Math.hypot(x, y, z);
    x = Math.max(0, Math.min(255, 128 + x / len));
    y = Math.max(0, Math.min(255, 128 + y / len));
    z = Math.max(0, Math.min(255, 128 + z / len));
    return (x << 16) | (y << 8) | z;
}