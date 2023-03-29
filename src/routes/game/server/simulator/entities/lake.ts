import type Box2D from "box2dweb";
import type { Lake } from "../../..";

export class LakeSimulator {
    constructor(private world: Box2D.Dynamics.b2World, private lake: Lake) {

    }

    delete() {}

    recordState(): Lake {
        return this.lake;
    }
}
