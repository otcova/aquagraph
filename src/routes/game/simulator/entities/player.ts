import Box2D from "box2dweb";
import type { Player, User } from "../..";
import { playerHitbox } from "../../skins/player";
import type { PlayerSkin } from "../../skins/player";
import { CATEGORY_BIT, shapeFromVertices } from "../box2d_utils";
import { UserData, type ContactType } from "../contact_listener";
import type { Vec2 } from "../../../utils";
import type { PlayerInput } from "../../client/player";

export class PlayerSimulator {
    private body: Box2D.Dynamics.b2Body;
    private skin: PlayerSkin;
    private user: User;
    private swimming = false;
    private dashPower = 1;

    private move: Vec2 = [0, 0];
    private dashingDelay = 0;
    private dashingDirection?: Vec2;

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
        bodyDef.linearDamping = 0.;
        bodyDef.allowSleep = false;
        bodyDef.userData = new UserData("player", {
            beginContactType: this.onContactBegin.bind(this),
            endContactType: this.onContactEnd.bind(this),
        });
        this.body = world.CreateBody(bodyDef);

        const hitbox = playerHitbox(player.skin);
        for (const convexPoly of hitbox) {
            const fixtureDef = new Box2D.Dynamics.b2FixtureDef();
            fixtureDef.shape = shapeFromVertices(convexPoly.flat());
            fixtureDef.density = .5;
            fixtureDef.friction = 0.2;
            fixtureDef.restitution = 0.5;
            fixtureDef.filter.categoryBits = CATEGORY_BIT.PLAYER;
            this.body.CreateFixture(fixtureDef);
        }
    }

    delete() {
        this.world.DestroyBody(this.body);
    }

    step(timeStep: number) {
        if (this.dashingDirection && this.dashingDelay <= 0) {
            const dashForce = 200 / timeStep;

            const f = new Box2D.Common.Math.b2Vec2(
                this.dashingDirection[0],
                this.dashingDirection[1],
            );
            f.Normalize();
            f.Multiply(dashForce);
            f.y *= 1.3;

            this.cancelGravity(0.2 / timeStep);
            this.body.ApplyForce(f, this.body.GetWorldCenter());
            this.dashingDirection = undefined;
        }
        else if (this.swimming) {
            this.cancelGravity();

            if (this.move) {
                let [fx, fy] = this.move;
                if (fx != 0 || fy != 0) {
                    // Rotate
                    {
                        const torque = 50;
                        const breakBoost = 20;

                        const angleVel = this.body.GetAngularVelocity();
                        const angle = this.body.GetAngle();
                        const targetAngle = Math.atan2(fy, fx);

                        const angleDiference = Math.atan2(Math.sin(targetAngle - angle), Math.cos(targetAngle - angle));

                        let finalTorque = torque * angleDiference;
                        if (angleDiference * angleVel < 0) finalTorque *= breakBoost;
                        this.body.ApplyTorque(finalTorque);
                    }

                    // Move
                    {
                        const vel = this.body.GetLinearVelocity();
                        const moveForce = 600;
                        const breakBoost = 2;

                        if (fx * vel.x < 0) fx *= breakBoost;
                        if (fy * vel.y < 0) fy *= breakBoost;

                        const f = new Box2D.Common.Math.b2Vec2(moveForce * fx, moveForce * fy);
                        
                        this.body.ApplyForce(f, this.body.GetWorldCenter());
                    }
                }
            }
        }
        this.dashingDelay -= timeStep;
    }

    private cancelGravity(multiplyer = 1) {
        const gravity = this.world.GetGravity();
        const f = new Box2D.Common.Math.b2Vec2(gravity.x, gravity.y);
        f.Multiply(-this.body.GetMass() * multiplyer);
        this.body.ApplyForce(f, this.body.GetWorldCenter());
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

    handleInput(input: PlayerInput) {
        if (this.dashingDirection) {
            const x = this.dashingDirection[0] + input.move[0];
            const y = this.dashingDirection[1] + input.move[1];

            if (x == 0 && y == 0) {
                this.dashingDelay = 0;
            } else if (x != 0 && y != 0) {
                this.dashingDirection = [x, y];
                this.dashingDelay = 0;
            }
        } else {
            if (this.dashPower > 0 && !this.swimming
                && this.move[0] == 0 && this.move[1] == 0
                && (input.move[0] != 0 || input.move[1] != 0)) {
                this.dashingDirection = input.move;
                --this.dashPower;

                // If only one direction is pressed, wait a bit to dash diagonaly
                if (input.move[0] == 0 || input.move[1] == 0) {
                    this.dashingDelay = 0.080; // 80ms
                }
            }
        }
        this.move = input.move;
    }

    private onContactBegin(type: ContactType) {
        if (type == "lake") {
            this.dashPower = 1;
            this.swimming = true;
            const waterFriction = 3;
            this.body.SetLinearDamping(waterFriction);
        }
    }

    private onContactEnd(type: ContactType) {
        if (type == "lake") {
            this.swimming = false;
            const airFriction = 0.5;
            this.body.SetLinearDamping(airFriction);
        }
    }
}

