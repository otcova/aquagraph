import { Graphics } from "pixi.js";
import type { PlayerModule } from ".";
import type { Painter } from "../..";
import type { Player } from "../../..";

export class Bomb implements PlayerModule {

	private graphics = new Graphics();

	constructor(private painter: Painter) {
		painter.layers.bottomPlayer.addChild(this.graphics);

		this.draw();
	}

	private draw() {
		this.graphics.clear();
		this.graphics.beginFill(0x0);
		this.graphics.drawCircle(0, 0, 5);
	}

	update(player: Player) {
		this.graphics.position.set(...player.position);
	}

	destroy() {
		this.graphics.destroy();
	}
}