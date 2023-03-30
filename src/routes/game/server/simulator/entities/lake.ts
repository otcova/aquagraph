import Box2D from "box2dweb";
import type { Lake } from "../../..";
import { COLLISION_MASK, shapeFromVertices } from "../box2d_utils";

export const LAKE_BODY_ID = "lake";

export class LakeSimulator {
    body: Box2D.Dynamics.b2Body;

    constructor(private world: Box2D.Dynamics.b2World, private lake: Lake) {
        const bodyDef = new Box2D.Dynamics.b2BodyDef();
        bodyDef.position.Set(...lake.position);
        bodyDef.userData = LAKE_BODY_ID;
        this.body = world.CreateBody(bodyDef);

        const fixtureDef = new Box2D.Dynamics.b2FixtureDef();
        fixtureDef.shape = shapeFromVertices(lake.vertices);
        fixtureDef.density = 0;
        fixtureDef.isSensor = true;

        // TODO! Need to see more docs about this
        fixtureDef.filter.categoryBits = COLLISION_MASK.LAKE;

        this.body.CreateFixture(fixtureDef);
    }

    delete() {
        this.world.DestroyBody(this.body);
    }

    recordState(): Lake {
        return this.lake;
    }
}
