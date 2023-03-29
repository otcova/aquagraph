import Box2D from "box2dweb";
import type { Player, User } from "../../..";
import { playerHitbox, type PlayerSkin } from "../../../skins/player";
import { shapeFromVertices } from "../box2d_utils";

export class PlayerSimulator {
    private body: Box2D.Dynamics.b2Body;
    private skin: PlayerSkin;
    private user: User;

    constructor(private world: Box2D.Dynamics.b2World, player: Player) {
        this.skin = player.skin;
        this.user = player.user;

        const bodyDef = new Box2D.Dynamics.b2BodyDef();
        bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
        bodyDef.position.Set(...player.position);
        bodyDef.linearVelocity.Set(...player.velocity);
        bodyDef.angle = player.angle;
        bodyDef.angularVelocity = player.angularVelocity;
        bodyDef.angularDamping = 1;
        bodyDef.linearDamping = 0;
        bodyDef.allowSleep = false;
        this.body = world.CreateBody(bodyDef);

        const fixtureDef = new Box2D.Dynamics.b2FixtureDef();
        fixtureDef.shape = shapeFromVertices(playerHitbox(player.skin));
        fixtureDef.density = .5;
        fixtureDef.friction = 0.2;
        fixtureDef.restitution = 0.6;

        this.body.CreateFixture(fixtureDef);
    }

    delete() {
        this.world.DestroyBody(this.body);
    }

    step() {
    }

    recordState(): Player {
        const position = this.body.GetPosition();
        const velocity = this.body.GetLinearVelocity();
        return {
            position: [position.x, position.y],
            velocity: [velocity.x, velocity.y],
            angle: this.body.GetAngle(),
            angularVelocity: this.body.GetAngularVelocity(),
            skin: this.skin,
            user: this.user,
        };
    }
}

