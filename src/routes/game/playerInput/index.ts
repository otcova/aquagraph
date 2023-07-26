import type { Vec2 } from "../../utils";
import type { MinigameManager } from "../minigame";
import { keyboard } from "./keyboard";

export interface Controls {
    move: [string, string, string, string],
}

export function deafultControls(): Controls {
    return {
        move: ["w", "a", "s", "d"],
    };
}

export interface PlayerInput {
    move: Vec2,
}

export class PlayerIn {
    private pastDirection?: Vec2;

    constructor(private host: MinigameManager, private controls = deafultControls()) {
        this.updateMovement = this.updateMovement.bind(this);

        addEventListener("keydown", this.updateMovement);
        addEventListener("keyup", this.updateMovement);
        setTimeout(this.updateMovement);
    }

    destroy() {
        removeEventListener("keydown", this.updateMovement);
        removeEventListener("keyup", this.updateMovement);
    }

    private updateMovement(event?: KeyboardEvent) {
        if (event?.repeat) return;
         
        const direction: Vec2 = [0, 0];
        if (keyboard.has(this.controls.move[0])) direction[1] -= 1;
        if (keyboard.has(this.controls.move[1])) direction[0] -= 1;
        if (keyboard.has(this.controls.move[2])) direction[1] += 1;
        if (keyboard.has(this.controls.move[3])) direction[0] += 1;
        
        if (!this.pastDirection ||
            direction[0] != this.pastDirection[0] || direction[1] != this.pastDirection[1]) {
            this.pastDirection = direction;
            this.host.handlePlayerInput({
                move: direction,
            });
        }
    }
}
