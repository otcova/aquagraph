import type { Box } from "../..";
import { Group } from "../drawing_element";
import type { PainterCanvas } from "../painter";


export class BoxPainter {
    image: Group;

    constructor(canvas: PainterCanvas, box: Box) {
        this.image = new Group();
        canvas.addElement(8, this.image.element);

        this.image.content(box.skin.image);

        this.update(box);
    }

    update(box: Box) {
        this.image.position(...box.position);
        this.image.angle(box.angle);
    }
}

