import Box2D from "box2dweb";
import type { Camera } from "..";
import { CATEGORY_BIT } from "./box2d_utils";
import { UserData } from "./contact_listener";

const size = 100;

export class FrameCollision {
	private bodies: Box2D.Dynamics.b2Body[] = [];

	constructor(private world: Box2D.Dynamics.b2World) {

		for (let i = 0; i < 4; ++i) {
			const bodyDef = new Box2D.Dynamics.b2BodyDef();
			bodyDef.userData = new UserData("screen");

			const body = world.CreateBody(bodyDef);
			body.CreateFixture(newFrameFixture());
			this.bodies.push(body);
		}
	}

	update(camera: Camera) {
		const width = camera.size[0] / 2;
		const height = camera.size[1] / 2;
		
		this.bodies[0].GetPosition().Set(camera.position[0] - width - size, camera.position[1]); // left
		this.bodies[1].GetPosition().Set(camera.position[0] + width + size, camera.position[1]); // right
		this.bodies[2].GetPosition().Set(camera.position[0], camera.position[1] - height - size); // top
		this.bodies[3].GetPosition().Set(camera.position[0], camera.position[1] + height + size); // bottom
	}
	
	destroy() {
		for (const body of this.bodies) this.world.DestroyBody(body);
	}
}

function newFrameFixture(): Box2D.Dynamics.b2FixtureDef {
	const shape = new Box2D.Collision.Shapes.b2PolygonShape()
	shape.SetAsBox(size, size);
	
	const fixtureDef = new Box2D.Dynamics.b2FixtureDef();
	fixtureDef.shape = shape;
	fixtureDef.density = 0;
	fixtureDef.isSensor = true;

	fixtureDef.filter.categoryBits = CATEGORY_BIT.NONE;
	fixtureDef.filter.maskBits = CATEGORY_BIT.PLAYER;
	return fixtureDef;
}