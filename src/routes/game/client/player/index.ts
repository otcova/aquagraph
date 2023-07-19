import type { Vec2 } from "../../../utils";
import type { HostConnection } from "../../host";
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

export class Player {
    private pastDirection: Vec2 = [0, 0];

    constructor(private host: HostConnection, private controls = deafultControls()) {
        this.updateMovement = this.updateMovement.bind(this);

        addEventListener("keydown", this.updateMovement);
        addEventListener("keyup", this.updateMovement);
    }

    destroy() {
        removeEventListener("keydown", this.updateMovement);
        removeEventListener("keyup", this.updateMovement);
        this.host.destroy();
    }

    private updateMovement() {
        const direction: Vec2 = [0, 0];
        if (keyboard.has(this.controls.move[0])) direction[1] -= 1;
        if (keyboard.has(this.controls.move[1])) direction[0] -= 1;
        if (keyboard.has(this.controls.move[2])) direction[1] += 1;
        if (keyboard.has(this.controls.move[3])) direction[0] += 1;

        if (direction[0] != this.pastDirection[0] ||
            direction[1] != this.pastDirection[1]) {
            this.pastDirection = direction;
            this.host.playerInput({
                move: direction,
            });
        }
    }
}
