import { BitmapFont, BitmapText, Container, FederatedMouseEvent, Graphics, Rectangle, Sprite } from "pixi.js";
import type { Painter } from "..";
import type { Vec2 } from "../../../utils";
import { font } from "../textures";

export class UITextInput {
	private active = false;
	private bitmapText?: BitmapText;
	private graphics = new Graphics();
	private container = new Container();
	private placeholder = "";
	text = "";
	toUpperCase = false;
	private hx = 9;
	private hy = 2;
	destroyed = false;

	onEnter?: () => void;

	constructor(private painter: Painter) {
		this.onPointerLeave();

		this.painter.layers.ui.addChild(this.container);
		this.container.addChild(this.graphics);

		this.graphics.eventMode = "static";
		this.graphics.cursor = "text";

		this.focus = this.focus.bind(this);
		this.onPointerEnter = this.onPointerEnter.bind(this);
		this.onPointerLeave = this.onPointerLeave.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.onMouseDown = this.onMouseDown.bind(this);

		this.graphics.on('pointerdown', this.focus);
		this.graphics.on('pointerenter', this.onPointerEnter);
		this.graphics.on('pointerleave', this.onPointerLeave);
		document.addEventListener("keypress", this.onKeyPress);
		document.addEventListener("keydown", this.onKeyDown);
		document.addEventListener("mousedown", this.onMouseDown);

		this.updateText("");
	}

	hide() {
		this.container.visible = false;
		this.active = false;
		this.onPointerLeave();
	}

	show() {
		this.container.visible = true;
	}

	focus(event?: FederatedMouseEvent) {
		event?.nativeEvent.preventDefault();

		this.active = true;
		this.graphics.clear();
		this.graphics.beginFill(0x4a3726);
		this.graphics.drawRoundedRect(-this.hx, -this.hy, this.hx * 2, this.hy * 2, 0.5);

		this.graphics.lineStyle(0.1, 0xffffff)
			.moveTo(-this.hx, this.hy)
			.lineTo(this.hx, this.hy);
	}

	private onPointerEnter() {
		if (!this.active) {
			this.graphics.clear();
			this.graphics.beginFill(0x4a3726);
			this.graphics.drawRoundedRect(-this.hx, -this.hy, this.hx * 2, this.hy * 2, 0.5);
		}
	}

	private onPointerLeave() {
		if (!this.active) {
			this.graphics.clear();
			this.graphics.beginFill(0x37291c);
			this.graphics.drawRoundedRect(-this.hx, -this.hy, this.hx * 2, this.hy * 2, 0.5);
		}
	}

	private onMouseDown() {
		this.active = false;
		this.onPointerLeave();
	}

	private onKeyDown(event: KeyboardEvent) {
		if (this.active) {
			if (["Enter", "Tab", "Escape"].includes(event.key)) {
				this.active = false;
				this.onPointerLeave();
				if (event.key == "Enter") this.onEnter?.();
			} else if (event.key == "Backspace") {
				if (event.ctrlKey) {
					this.updateText("");
				} else {
					let text = this.text ?? "";
					this.updateText(text.slice(0, -1));
				}
			}
		}
	}

	setPlaceHolder(placeholder: string) {
		this.placeholder = placeholder;
		if (this.text == "") this.updateText("");
	}

	private onKeyPress(event: KeyboardEvent) {
		if (this.active && !event.ctrlKey && !event.altKey) {
			if (event.key.match(/[a-zA-Z0-9àèìòùáéíóú'¡!¿?]/)) {
				let text = this.text ?? "";
				const key = this.toUpperCase ? event.key.toUpperCase() : event.key;
				this.updateText(text + key);
			}
		}
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
			this.bitmapText.text = text || this.placeholder;
		}

		this.bitmapText.alpha = text ? 1 : 0.2;

		while (this.hx * 2 < this.bitmapText.width + 1) {
			this.bitmapText.text = this.bitmapText.text.slice(0, -1);
		}

		if (text) this.text = this.bitmapText.text;
		else this.text = text;
		
		this.bitmapText.position.set(-this.bitmapText.width / 2, -this.hy * 0.7);

	}

	destroy() {
		if (!this.destroyed) {
			this.destroyed = true;
			this.bitmapText?.destroy();
			this.graphics.destroy();
			this.container.destroy();

			document.removeEventListener("keypress", this.onKeyPress);
			document.removeEventListener("keydown", this.onKeyDown);
			document.removeEventListener("mousedown", this.onMouseDown);
		}
	}
}