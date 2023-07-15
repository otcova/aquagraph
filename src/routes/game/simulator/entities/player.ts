import Box2D from "box2dweb";
import type { Player, User } from "../..";
import { playerHitbox, type PlayerSkin } from "../../skins/player";
import { CATEGORY_BIT, shapeFromVertices } from "../box2d_utils";
import { UserData, type ContactType } from "../contact_listener";

export class PlayerSimulator {
    private body: Box2D.Dynamics.b2Body;
    private skin: PlayerSkin;
    private user: User;
    private swimming = false;

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
        bodyDef.userData = new UserData("player", {
            beginContactType: this.onContactBegin.bind(this),
            endContactType: this.onContactEnd.bind(this),
        });
        this.body = world.CreateBody(bodyDef);

        const fixtureDef = new Box2D.Dynamics.b2FixtureDef();
        fixtureDef.shape = shapeFromVertices(playerHitbox(player.skin).flat());
        fixtureDef.density = .5;
        fixtureDef.friction = 0.2;
        fixtureDef.restitution = 0.6;
        fixtureDef.filter.categoryBits = CATEGORY_BIT.PLAYER;

        this.body.CreateFixture(fixtureDef);

    }

    delete() {
        this.world.DestroyBody(this.body);
    }

    step() {
        if (this.swimming) {
            const gravity = this.world.GetGravity();
            const f = new Box2D.Common.Math.b2Vec2(gravity.x, gravity.y);
            f.Multiply(-this.body.GetMass());
            this.body.ApplyForce(f, this.body.GetWorldCenter());
        }
    }

    recordState(): Player {
        const position = this.body.GetPosition();
        const velocity = this.body.GetLinearVelocity();
        return {
            swimming: this.swimming,
            position: [position.x, position.y],
            velocity: [velocity.x, velocity.y],
            angle: this.body.GetAngle(),
            angularVelocity: this.body.GetAngularVelocity(),
            skin: this.skin,
            user: this.user,
        };
    }

    private onContactBegin(type: ContactType) {
        if (type == "box") {
            // this.restoreDash()
        } else if (type == "lake") {
            this.swimming = true;
            const waterFriction = 1;
            this.body.SetLinearDamping(waterFriction);
        }
    }

    private onContactEnd(type: ContactType) {
        if (type == "lake") {
            this.swimming = false;
            const airFriction = 0;
            this.body.SetLinearDamping(airFriction);
        }
    }
}

