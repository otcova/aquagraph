import type { Vec2 } from "../../../utils";
import type { HostConnection } from "../../host";
import { keyboard } from "./keyboard";

export interface PlayerAction {
    move?: Vec2,
    dash?: Vec2,
}

export class Player {
    private pastDirection: Vec2 = [0, 0];

    constructor(private host: HostConnection) {
        this.updateMovement = this.updateMovement.bind(this);

        addEventListener("keydown", this.updateMovement);
        addEventListener("keyup", this.updateMovement);
    }

    destroy() {
        removeEventListener("keydown", this.updateMovement);
        removeEventListener("keyup", this.updateMovement);
        this.host.disconnect();
    }

    private updateMovement() {
        const direction: Vec2 = [0, 0];
        if (keyboard.has('w')) direction[1] -= 1;
        if (keyboard.has('a')) direction[0] -= 1;
        if (keyboard.has('s')) direction[1] += 1;
        if (keyboard.has('d')) direction[0] += 1;

        if (direction[0] != this.pastDirection[0] ||
            direction[1] != this.pastDirection[1]) {
            this.pastDirection = direction;
            this.host.playerAction({
                move: direction,
            });
        }
    }
}
