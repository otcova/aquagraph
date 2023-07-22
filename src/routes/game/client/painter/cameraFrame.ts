import { normalGroup } from "@pixi/lights";
import { Graphics } from "pixi.js";
import type { Painter } from ".";
import type { FrameBox } from "../..";
import type { GameDif } from "../../dif";
import { createFrameBoxes } from "../../game_creation";

export class CameraFrame {
    private frame: Graphics;
    private topFrame: Graphics;
    private topFrameNormal: Graphics;

    private decoration?: FrameBox[];

    constructor(painter: Painter) {
        this.frame = new Graphics();
        this.topFrame = new Graphics();
        this.topFrameNormal = new Graphics();

        painter.layers.frame.addChild(this.frame);
        painter.layers.topFrame.addChild(this.topFrame);
        painter.layers.topFrame.addChild(this.topFrameNormal);

        this.topFrameNormal.parentGroup = normalGroup;
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

            if (!this.decoration) {
                const margin = 3;
                const width = 2 * (hx + margin);
                const height = 2 * (hy + margin);

                const config = {
                    minMargin: 4,
                    maxMargin: 10,
                    minOffset: 0,
                    maxOffset: 2,
                    minSize: 2,
                    maxSize: 10,
                    long: 1,
                };

                this.decoration = [
                    ...createFrameBoxes([width, height], config),
                    ...createFrameBoxes([width + 10, height + 10], config),
                ];
            }

            this.topFrame.clear();
            this.topFrameNormal.clear();
            this.topFrame.beginFill(0x3D2211);
            this.topFrameNormal.beginFill(0x8080ff);
            for (const box of this.decoration) {
                this.topFrame.drawRoundedRect(
                    box.position[0] - box.size[0] / 2,
                    box.position[1] - box.size[1] / 2,
                    ...box.size, .9); // bottom
                this.topFrameNormal.drawRoundedRect(
                    box.position[0] - box.size[0] / 2,
                    box.position[1] - box.size[1] / 2,
                    ...box.size, .9); // bottom
            }
        }
    }
}