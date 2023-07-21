import { normalGroup } from "@pixi/lights";
import type { Box } from "../../..";
import { boxGraphics, type BoxGraphics } from "../../../skins/box";
import { type AppContainers } from "../containers";

export class BoxPainter {
    graphics: BoxGraphics;

    constructor(container: AppContainers, box: Box) {
        this.graphics = boxGraphics(box.skin);

        this.graphics.diffuse.position.set(...box.position);
        this.graphics.diffuse.rotation = box.angle;
        container.box.addChild(this.graphics.diffuse);
        
        this.graphics.normal.parentGroup = normalGroup;
        this.graphics.diffuse.addChild(this.graphics.normal);
    }

    destroy() {
        this.graphics.diffuse.destroy();
    }
}

