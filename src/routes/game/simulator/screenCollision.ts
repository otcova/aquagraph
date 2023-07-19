import Box2D from "box2dweb";
import { CATEGORY_BIT } from "./box2d_utils";
import { UserData } from "./contact_listener";
import type { Camera } from "..";

const size = 100;

export class ScreenCollision {
	private bodies: Box2D.Dynamics.b2Body[] = [];

	constructor(private world: Box2D.Dynamics.b2World) {

		for (let i = 0; i < 4; ++i) {
			const bodyDef = new Box2D.Dynamics.b2BodyDef();
			bodyDef.userData = new UserData("screen");

			const body = world.CreateBody(bodyDef);
			body.CreateFixture(newScreenFixture());
			this.bodies.push(body);
		}
	}

	update(camera: Camera) {
		this.bodies[0].GetPosition().Set(camera.topLeft[0] - size, 0); // left
		this.bodies[1].GetPosition().Set(camera.bottomRight[0] + size, 0); // right
		this.bodies[2].GetPosition().Set(0, camera.topLeft[1] - size); // top
		this.bodies[3].GetPosition().Set(0, camera.bottomRight[1] + size); // bottom
	}
	
	destroy() {
		for (const body of this.bodies) this.world.DestroyBody(body);
	}
}

function newScreenFixture(): Box2D.Dynamics.b2FixtureDef {
	const shape = new Box2D.Collision.Shapes.b2PolygonShape()
	shape.SetAsBox(size, size);
	
	const fixtureDef = new Box2D.Dynamics.b2FixtureDef();
	fixtureDef.shape = shape;
	fixtureDef.density = 0;
	fixtureDef.isSensor = true;

	fixtureDef.filter.categoryBits = CATEGORY_BIT.SCREEN;
	fixtureDef.filter.maskBits = CATEGORY_BIT.PLAYER;
	return fixtureDef;
}