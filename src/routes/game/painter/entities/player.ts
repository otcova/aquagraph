import type { Player } from "../..";
import { random } from "../../../utils";
import { Group } from "../drawing_element";
import type { EntityPainter, PainterCanvas } from "../painter";


export class PlayerPainter implements EntityPainter<Player> {
    image: Group;
    eye: SVGElement;

    constructor(canvas: PainterCanvas, player: Player) {
        this.image = new Group();
        this.image.content(player.skin.image);

        this.update(player);

        this.eye = this.image.element.getElementsByClassName("eye")[0] as SVGElement;
        this.eye.setAttribute("style", `transition: all 1000ms linear;`);

        canvas.addElement(3, this.image.element);
        canvas.setInterval(this.moveEye.bind(this), 1000);
    }

    update(player: Player) {
        this.image.position(...player.position);
        this.image.angle(player.angle);
    }

    moveEye() {
        this.eye.setAttribute("transform",
            `translate(${random(-2, 2)}, ${random(-2, 2)}) rotate(${random(-20, 20)})`
        );
    }
}
