import type { Painter } from "..";
import type { Vec2 } from "../../../utils";
import { UIButton } from "./button";
import { UIText } from "./text";
import { UITextInput } from "./textInput";

type UIComponent = UITextInput | UIButton | UIText;

export class UI {

	transition = false;
	components: UIComponent[] = [];

	constructor(public painter: Painter) {}

	createTextInput(pos?: Vec2): UITextInput {
		const input = new UITextInput(this.painter);
		if (pos) input.setPosition(pos);
		this.components.push(input);
		return input;
	}

	createButton(pos?: Vec2, text?: string): UIButton {
		const button = new UIButton(this.painter);
		if (pos) button.setPosition(pos);
		if (text) button.updateText(text);
		this.components.push(button);
		return button;
	}

	createText(pos?: Vec2, text?: string): UIText {
		const uiText = new UIText(this.painter);
		if (pos) uiText.setPosition(pos);
		if (text) uiText.updateText(text);
		this.components.push(uiText);
		return uiText;
	}

	// Disables ui components (like buttons)
	startTransition() {
		this.transition = true;
		this.painter.layers.ui.eventMode = "none";
		for (const comp of this.components) {
			comp.destroyed = true;
		}
	}

	destroy() {
		for (const comp of this.components) {
			comp.destroyed = false;
			comp.destroy();
		}
	}
}