import type { Painter } from "..";
import type { Vec2 } from "../../../../utils";
import { UIButton } from "./button";
import { UIText } from "./text";
import { UITextInput } from "./textInput";

export class UI {
	
	constructor(public painter: Painter) {}
	
	createTextInput(pos?: Vec2): UITextInput {
		const input = new UITextInput(this.painter);
		if (pos) input.setPosition(pos);
		return input;
	}
	
	createButton(pos?: Vec2, text?: string): UIButton {
		const input = new UIButton(this.painter);
		if (pos) input.setPosition(pos);
		if (text) input.updateText(text);
		return input;
	}
	
	createText(pos?: Vec2, text?: string): UIText {
		const input = new UIText(this.painter);
		if (pos) input.setPosition(pos);
		if (text) input.updateText(text);
		return input;
	}
}