import type { Container } from "pixi.js";
import type { Player } from "../..";
import { playerGraphics, type PlayerGraphics } from "../../skins/player";


export class PlayerPainter {
    graphics: PlayerGraphics;

    constructor(container: Container, player: Player) {
        this.graphics = playerGraphics(player.skin);

        this.graphics.body.addChild(this.graphics.eye);
        container.addChild(this.graphics.body);

        this.update(player);
    }

    update(player: Player) {
        this.graphics.body.position.set(...player.position);
        this.graphics.body.rotation = player.angle;
    }

    delete() {}
}
