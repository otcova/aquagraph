import { Container, Sprite } from "pixi.js";
import type { PlayerModule } from ".";
import type { Painter } from "../..";
import type { Player } from "../../..";
import { loadTexture } from "../../textures";

import arrowURL from "$lib/assets/bow/arrow.webp?url";
import bowURL from "$lib/assets/bow/bow.webp?url";
import bowCharge0URL from "$lib/assets/bow/bowCharge0.webp?url";
import bowCharge1URL from "$lib/assets/bow/bowCharge1.webp?url";

const bowImage = loadTexture(bowURL);
const bowChargesImage = [loadTexture(bowCharge0URL), loadTexture(bowCharge1URL)];
const arrowImage = loadTexture(arrowURL);

const bowTextureScale = 0.035;
const bowOffset = 3;

export class Bow implements PlayerModule {

	private container = new Container
	private bow?: Sprite;
	private arrow?: Sprite;
	private charges?: Sprite[];

	constructor(private painter: Painter) {
		this.painter.layers.bottomPlayer.addChild(this.container);

		this.setupArrow();
		this.setupBow();
		this.setupCharges();
	}

	private async setupArrow() {
		if (!this.arrow) {
			const texture = await arrowImage;
			if (this.arrow || this.container.destroyed) return;

			this.arrow = new Sprite(texture);
			this.container.addChild(this.arrow);

			this.arrow.scale.set(bowTextureScale);
			this.arrow.position.set(
				bowOffset + 80 * bowTextureScale - this.arrow.width / 2,
				-this.arrow.height / 2
			);
		}
	}

	private async setupBow() {
		if (!this.bow) {
			const texture = await bowImage;
			if (this.bow || this.container.destroyed) return;

			this.bow = new Sprite(texture);
			this.container.addChild(this.bow);

			this.bow.scale.set(bowTextureScale);
			this.bow.position.set(bowOffset - this.bow.width / 2, -this.bow.height / 2);
		}
	}

	private async setupCharges() {
		if (!this.charges) {
			const textures = await Promise.all(bowChargesImage);
			if (this.charges || this.container.destroyed) return;

			this.charges = textures.map(tex => {
				const sprite = new Sprite(tex)
				this.container.addChild(sprite);
				sprite.scale.set(bowTextureScale);
				sprite.alpha = 0;
				sprite.position.set(
					bowOffset - 18 * bowTextureScale - sprite.width / 2,
					-sprite.height / 2
				);
				return sprite;
			});
		}
	}

	update(player: Player) {
		this.container.visible = player.state == "playing";
		this.container.rotation = player.angle;
		this.container.position.set(...player.position);
	}

	destroy() {
		this.container.destroy();
		this.bow?.destroy();
		this.arrow?.destroy();
		if (this.charges) {
			for (const charge of this.charges) charge.destroy();
		}
	}
}