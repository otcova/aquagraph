import type { Player } from "../..";
import { random } from "../../../utils";
import { Group } from "../drawing_element";
import type { EntityPainter } from "../painter";


export class PlayerPainter implements EntityPainter<Player> {
    image: Group;
    eye: Animated;

    constructor(player: Player) {
        this.image = new Group();

        this.image.content(player.skin.image);
        const eyeElement = this.image.element.getElementsByClassName("eye")[0] as SVGElement;
        this.eye = new Animated(eyeElement, 1);

        this.update(player);
    }

    update(player: Player) {
        this.image.position(...player.position);
        this.image.angle(player.angle);
    }

    frame() {
        this.eye.transform(`translate(${random(-2, 2)}, ${random(-2, 2)}) rotate(${random(-20, 20)})`);
    }
}

class Animated {
    element: SVGElement;
    updateCooldown: number = 0;
    pastUpdateInstance: number = 0;

    constructor(element: SVGElement, updateSecondsCooldown: number) {
        this.element = element;
        this.updateCooldown = updateSecondsCooldown;

        this.element.setAttribute("style", `transition: all ${this.updateCooldown}s linear;`);
    }

    transform(transform: string) {
        const now = performance.now() / 1000;
        if (now - this.pastUpdateInstance > this.updateCooldown) {
            this.pastUpdateInstance = now;
            this.element.setAttribute("transform", transform);
        }
    }
}
