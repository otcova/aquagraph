import { BitmapFont, BitmapText, Container, Graphics } from "pixi.js";
import type { Painter } from "..";
import type { Vec2 } from "../../../../utils";
import { font } from "../textures";

export class UIText {
	private bitmapText?: BitmapText;
	private container = new Container();
	private hx = 9;
	private hy = 2;
	
	constructor(private painter: Painter) {
		this.painter.layers.ui.addChild(this.container);
	}
	
	hide() {
		this.container.visible = false;
	}
	
	show() {
		this.container.visible = true;
	}

	async setPosition(position: Vec2) {
		this.container.position.set(position[0], position[1]);
	}

	async updateText(text: string) {
		const bitmapFont: BitmapFont = await font;
		
		if (!this.bitmapText) {
			this.bitmapText = new BitmapText(text, {
				align: "center",
				fontSize: this.hy * 1.2,
				fontName: bitmapFont.font,
			});
			this.bitmapText.tint = 0xffffff;
			
			this.container.addChild(this.bitmapText);
		} else {
			this.bitmapText.text = text;
		}
		
		while (this.hx * 2 < this.bitmapText.width) {
			this.bitmapText.text = this.bitmapText.text.slice(0, -1);
		}
		
		this.bitmapText.position.set(-this.bitmapText.width / 2, -this.hy * 0.7);
	}

	destroy() {
		this.bitmapText?.destroy();
		this.container.destroy();
	}
}