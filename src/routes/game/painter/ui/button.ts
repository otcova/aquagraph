import { BitmapFont, BitmapText, Container, Graphics } from "pixi.js";
import type { Painter } from "..";
import type { Vec2 } from "../../../utils";
import { font } from "../textures";

export class UIButton {
	private bitmapText?: BitmapText;
	private graphics = new Graphics();
	private container = new Container();
	private hx = 9;
	private hy = 2;
	
	onClick?: (button: UIButton) => void;

	constructor(private painter: Painter) {
		this.pointerLeave();

		this.painter.layers.ui.addChild(this.container);
		this.container.addChild(this.graphics);
		
		this.graphics.eventMode = "static";
		this.graphics.cursor = "pointer";
		this.graphics.on('pointerdown', () => this.onClick?.(this));
		this.graphics.on('pointerenter', this.pointerEnter.bind(this));
		this.graphics.on('pointerleave', this.pointerLeave.bind(this));
	}
	
	hide() {
		this.container.visible = false;
	}
	
	show() {
		this.container.visible = true;
	}
	
	private pointerEnter() {
		this.graphics.clear();
		this.graphics.beginFill(0x986b3e);
		this.graphics.drawRoundedRect(-this.hx, -this.hy, this.hx * 2, this.hy * 2, 0.5);
	}
	
	private pointerLeave() {
		this.graphics.clear();
		this.graphics.beginFill(0x68492a);
		this.graphics.drawRoundedRect(-this.hx, -this.hy, this.hx * 2, this.hy * 2, 0.5);
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
		this.graphics.destroy();
		this.container.destroy();
	}
}