import Box2D from "box2dweb";
import type { Box } from "../../..";
import { boxHitbox } from "../../../skins/box";
import { shapeFromVertices } from "../box2d_utils";

export class BoxSimulator {
    body: Box2D.Dynamics.b2Body;

    constructor(private world: Box2D.Dynamics.b2World, private box: Box) {
        const bodyDef = new Box2D.Dynamics.b2BodyDef();
        bodyDef.position.Set(...box.position);
        bodyDef.angle = box.angle;
        this.body = world.CreateBody(bodyDef);
        this.body.CreateFixture2(shapeFromVertices(boxHitbox(box.skin)), 0);
    }

    delete() {
        this.world.DestroyBody(this.body);
    }

    recordState(): Box {
        return this.box;
    }
}