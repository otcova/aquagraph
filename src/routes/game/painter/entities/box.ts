import type { Box } from "../..";
import { Group } from "../drawing_element";


export class BoxPainter {
    image: Group;

    constructor(box: Box) {
        this.image = new Group();
        this.image.content(box.skin.image);

        this.update(box);
    }

    update(box: Box) {
        this.image.position(...box.position);
        this.image.angle(box.angle);
    }
}

