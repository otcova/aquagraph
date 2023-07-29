import Box2D from "box2dweb";
import type { Coin } from "../..";
import { CATEGORY_BIT } from "../box2d_utils";
import { UserData } from "../contact_listener";

export class CoinSimulator {
    body: Box2D.Dynamics.b2Body;

    constructor(private world: Box2D.Dynamics.b2World, private coin: Coin) {
        const bodyDef = new Box2D.Dynamics.b2BodyDef();
        bodyDef.position.Set(...coin.position);
        bodyDef.userData = new UserData("coin");
        this.body = world.CreateBody(bodyDef);

        const fixtureDef = new Box2D.Dynamics.b2FixtureDef();
        fixtureDef.shape = new Box2D.Collision.Shapes.b2CircleShape(1.8);
        fixtureDef.density = 0;
        fixtureDef.isSensor = true;
        fixtureDef.filter.categoryBits = CATEGORY_BIT.NONE;
        fixtureDef.filter.maskBits = CATEGORY_BIT.PLAYER;

        this.body.CreateFixture(fixtureDef);
    }

    destroy() {
        this.world.DestroyBody(this.body);
    }

    recordState(): Coin {
        return this.coin;
    }
}
