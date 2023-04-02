import type { Container } from "pixi.js";
import type { Box } from "../..";
import { boxGraphics, type BoxGraphics } from "../../skins/box";
import { group } from "../layers";

export class BoxPainter {
    graphics: BoxGraphics;

    constructor(container: Container, box: Box) {
        this.graphics = boxGraphics(box.skin);

        this.graphics.body.position.set(...box.position);
        this.graphics.body.rotation = box.angle;

        this.graphics.body.parentGroup = group.box;
        container.addChild(this.graphics.body);
    }

    delete() {}
}

