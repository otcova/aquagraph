import Box2D from "box2dweb";
import type { DashEffect, DeathEffect, Player, User } from "../../..";
import { playerHitbox } from "../../../skins/player";
import type { PlayerSkin } from "../../../skins/player";
import { CATEGORY_BIT, shapeFromVertices } from "../../box2d_utils";
import { UserData, type ContactType } from "../../contact_listener";
import type { Vec2 } from "../../../../utils";
import type { PlayerInput } from "../../../playerInput";

export class PlayingPlayer {
    private body: Box2D.Dynamics.b2Body;
    private skin: PlayerSkin;
    private user: User;
    private swimming: boolean;
    private dashPower: number;

    private move: Vec2 = [0, 0];
    private dashingDelay = 0;
    private dashingDirection?: Vec2;
    private dashEffects: DashEffect[];
    private deathEffects: DeathEffect[];
    private effectCounter = 0;

    private alive = true;

    constructor(private world: Box2D.Dynamics.b2World, player: Player) {
        this.skin = player.user.skin;
        this.user = player.user;
        this.swimming = player.swimming;
        this.dashPower = player.dashPower;
        this.dashEffects = player.dashEffects;
        this.deathEffects = player.deathEffects;
        
        for (const effect of [...this.dashEffects, ...this.deathEffects]) {
            if (effect.counter > this.effectCounter) this.effectCounter = effect.counter + 10; 
        }

        const bodyDef = new Box2D.Dynamics.b2BodyDef();
        bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
        bodyDef.position.Set(...player.position);
        bodyDef.linearVelocity.Set(...player.velocity);
        bodyDef.angle = player.angle;
        bodyDef.angularVelocity = player.angularVelocity;
        bodyDef.angularDamping = 0.8;
        bodyDef.linearDamping = 0.;
        bodyDef.allowSleep = false;
        bodyDef.userData = new UserData("player", {
            beginContactType: this.onContactBegin.bind(this),
            endContactType: this.onContactEnd.bind(this),
        });
        this.body = world.CreateBody(bodyDef);

        const hitbox = playerHitbox(player.user.skin);
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

    destroy() {
        this.world.DestroyBody(this.body);
    }

    // returns true if alive
    step(timeStep: number): boolean {
        this.dashEffects = this.dashEffects.filter(effect => {
            effect.timeLeft -= timeStep;
            return effect.timeLeft > 0;
        });
        this.deathEffects = this.deathEffects.filter(effect => {
            effect.timeLeft -= timeStep;
            return effect.timeLeft > 0;
        });

        if (this.dashingDirection && this.dashingDelay <= 0) {
            const pos = this.body.GetWorldCenter();
            const dashDir = this.body.GetLinearVelocity().Copy();
            
            
            const dashForce = 200;

            const f = new Box2D.Common.Math.b2Vec2(
                this.dashingDirection[0],
                this.dashingDirection[1],
            );
            
            f.Normalize();
            f.Multiply(dashForce);
            if (dashDir.y > 0 && this.dashingDirection[1] < 0) f.y -= dashDir.y * 3;
            
            this.body.ApplyImpulse(f, pos);

            dashDir.Add(f);
            dashDir.Normalize();
                
            this.dashEffects.push({
                counter: ++this.effectCounter,
                position: [pos.x, pos.y],
                direction: [dashDir.x, dashDir.y],
                timeLeft: 1,
            });

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

        return this.alive;
    }

    update(player: Player) {
        this.user = player.user;
        this.swimming = player.swimming;
        this.dashPower = player.dashPower;
        this.dashEffects = player.dashEffects;
        this.deathEffects = player.deathEffects;
        this.move = player.move;
        this.alive = player.state == "playing";

        this.body.SetPosition(new Box2D.Common.Math.b2Vec2(...player.position));
        this.body.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(...player.velocity));
        this.body.SetAngle(player.angle);
        this.body.SetAngularVelocity(player.angularVelocity);
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
            state: this.alive ? "playing" : "death",
            swimming: this.swimming,
            position: [position.x, position.y],
            velocity: [velocity.x, velocity.y],
            angle: this.body.GetAngle(),
            angularVelocity: this.body.GetAngularVelocity(),
            user: this.user,
            dashPower: this.dashPower,
            dashEffects: this.dashEffects,
            deathEffects: this.deathEffects,
            move: this.move,
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
            if (this.dashPower > 0 && !this.swimming && (
                (this.move[0] != input.move[0] && input.move[0] != 0) ||
                (this.move[1] != input.move[1] && input.move[1] != 0))) {
                // Dash

                this.dashingDirection = input.move;
                --this.dashPower;

                // If only one direction is pressed, wait a bit to dash diagonaly
                if (input.move[0] == 0 || input.move[1] == 0) {
                    this.dashingDelay = 0.100; // 100ms
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
        } else if (type == "screen" || type == "frameBox") {
            this.alive = false;
            const pos = this.body.GetWorldCenter();
            const dir = this.body.GetLinearVelocity();
            
            this.deathEffects.push({
                counter: ++this.effectCounter,
                position: [pos.x, pos.y],
                angle: Math.atan2(-dir.y, -dir.x),
                force: Math.hypot(dir.y, dir.x),
                timeLeft: 1,
            });
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

