import Box2D from "box2dweb";
import type { Camera, FrameBox } from "../..";
import { CATEGORY_BIT } from "../box2d_utils";
import { UserData } from "../contact_listener";

export class FrameBoxSimulator {
    body: Box2D.Dynamics.b2Body;
    fixture: Box2D.Dynamics.b2Fixture;

    constructor(private world: Box2D.Dynamics.b2World, private box: FrameBox) {
        const bodyDef = new Box2D.Dynamics.b2BodyDef();
        bodyDef.userData = new UserData("frameBox");
        this.body = world.CreateBody(bodyDef);
        
        const fixtureDef = new Box2D.Dynamics.b2FixtureDef();
        fixtureDef.shape = this.createShape(1);
        fixtureDef.density = 0;
        fixtureDef.filter.categoryBits = CATEGORY_BIT.NONE;
        fixtureDef.filter.maskBits = CATEGORY_BIT.PLAYER;
        fixtureDef.isSensor = true;

        this.fixture = this.body.CreateFixture(fixtureDef);
    }

    update(camera: Camera) {
        const scale = camera.size[0] / 100;
        this.fixture.GetShape().Set(this.createShape(scale));
        this.body.SetPosition(new Box2D.Common.Math.b2Vec2(
            scale * this.box.position[0] + camera.position[0],
            scale * this.box.position[1] + camera.position[1],
        ));
    }
    
    private createShape(scale: number) {
        const shape = new Box2D.Collision.Shapes.b2PolygonShape();
        shape.SetAsBox(scale * this.box.size[0] / 2, scale * this.box.size[1] / 2);
        return shape;
    }

    destroy() {
        this.world.DestroyBody(this.body);
    }

    recordState(): FrameBox {
        return this.box;
    }
}