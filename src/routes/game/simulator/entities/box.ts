import Box2D from "box2dweb";
import type { Box } from "../..";
import { boxHitbox } from "../../skins/box";
import { CATEGORY_BIT, shapeFromVertices } from "../box2d_utils";
import { UserData } from "../contact_listener";

export class BoxSimulator {
    body: Box2D.Dynamics.b2Body;

    constructor(private world: Box2D.Dynamics.b2World, private box: Box) {
        const bodyDef = new Box2D.Dynamics.b2BodyDef();
        bodyDef.position.Set(...box.position);
        bodyDef.angle = box.angle;
        bodyDef.userData = new UserData("box");
        this.body = world.CreateBody(bodyDef);

        const fixtureDef = new Box2D.Dynamics.b2FixtureDef();
        fixtureDef.shape = shapeFromVertices(boxHitbox(box.skin).flat());
        fixtureDef.density = 0;
        fixtureDef.filter.categoryBits = CATEGORY_BIT.BOX;
        fixtureDef.filter.maskBits = CATEGORY_BIT.PLAYER;

        this.body.CreateFixture(fixtureDef);
    }

    destroy() {
        this.world.DestroyBody(this.body);
    }

    recordState(): Box {
        return this.box;
    }
}
