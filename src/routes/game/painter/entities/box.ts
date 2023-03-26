import type { Container } from "pixi.js";
import type { Box } from "../..";
import { boxGraphics, type BoxGraphics } from "../../skins/box";

export class BoxPainter {
    graphics: BoxGraphics;

    constructor(container: Container, box: Box) {
        this.graphics = boxGraphics(box.skin);
        container.addChild(this.graphics.body);

        this.graphics.body.position.set(...box.position);
        this.graphics.body.rotation = box.angle;
    }

    delete() {}
}

