import Box2D from "box2dweb";
import type { Player, User } from "../../..";
import { playerHitbox, type PlayerSkin } from "../../../skins/player";
import { CATEGORY_BIT, shapeFromVertices } from "../box2d_utils";
import { BOX_BODY_ID } from "./box";
import { LAKE_BODY_ID } from "./lake";

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
        let insideLake = false;
        let touchingBox = false;

        type b2ContactEdge = Box2D.Dynamics.Contacts.b2ContactEdge;
        let contact: b2ContactEdge | null = this.body.GetContactList();
        while (contact) {
            const data = contact.other.GetUserData()
            if (data == BOX_BODY_ID) touchingBox = true;
            else if (data == LAKE_BODY_ID) insideLake = true;

            contact = contact.next;
        }

        if (insideLake) {
            const gravity = this.world.GetGravity();
            const f = new Box2D.Common.Math.b2Vec2(gravity.x, gravity.y);
            f.Multiply(-this.body.GetMass());
            this.body.ApplyForce(f, this.body.GetWorldCenter());

            const waterFriction = 1;
            this.body.SetLinearDamping(waterFriction);
        } else {
            const airFriction = 0;
            this.body.SetLinearDamping(airFriction);
        }

        if (insideLake || touchingBox) {
            //this.restoreDash();
        }
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

