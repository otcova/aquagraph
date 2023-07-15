import Box2D from "box2dweb";
import { CATEGORY_BIT, shapeFromVertices, shapesFromConvexVertices } from "../box2d_utils";
import { UserData } from "../contact_listener";
import type { Lake } from "../..";

export class LakeSimulator {
    body: Box2D.Dynamics.b2Body;

    constructor(private world: Box2D.Dynamics.b2World, private lake: Lake) {
        const bodyDef = new Box2D.Dynamics.b2BodyDef();
        bodyDef.position.Set(...lake.position);
        bodyDef.userData = new UserData("lake");
        this.body = world.CreateBody(bodyDef);

        for (const shape of shapesFromConvexVertices(lake.vertices)) {
            const fixtureDef = new Box2D.Dynamics.b2FixtureDef();
            fixtureDef.shape = shape;
            fixtureDef.density = 0;
            fixtureDef.isSensor = true;
            
            // TODO! Need to see more docs about this
            fixtureDef.filter.categoryBits = CATEGORY_BIT.LAKE;
            fixtureDef.filter.maskBits = CATEGORY_BIT.PLAYER;

            this.body.CreateFixture(fixtureDef);
        }
    }

    delete() {
        this.world.DestroyBody(this.body);
    }

    recordState(): Lake {
        return this.lake;
    }
}
