import { BitmapText } from "pixi.js";
import type { Painter } from "..";
import type { Vec2 } from "../../../../utils";

export class TextInput {
	position: Vec2 = [0, 0];
	length: number = 4;
	placeHolder?: string;
	
	private text: BitmapText;
	
	constructor(painter: Painter) {
		this.text = new BitmapText("Otcova", {
			align: "center",
			fontSize: 20,
		});
		
		painter.layers.ui.addChild(this.text);
	}
	
	
}