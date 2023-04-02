import { PointLight } from "@pixi/lights";
import { Emitter, type EmitterConfigV3 } from "@pixi/particle-emitter";
import { Container, Texture } from "pixi.js";
import type { Player } from "../..";
import type { Vec2 } from "../../../utils";
import { playerGraphics, type PlayerGraphics } from "../../skins/player";
import { group } from "../layers";


export class PlayerPainter {
    graphics: PlayerGraphics;
    //waterParticles: WaterParticle[] = [];
    emitter: Emitter;

    constructor(private container: Container, private player: Player) {
        this.graphics = playerGraphics(player.skin);
        this.graphics.body.parentGroup = group.player;
        container.addChild(this.graphics.body);

        this.graphics.body.addChild(this.graphics.eye);

        const light = new PointLight(player.skin.color, 0.7);
        this.graphics.body.addChild(light);

        const particlesContainer = new Container();
        particlesContainer.parentGroup = group.playerParticles;
        container.addChild(particlesContainer);

        this.emitter = new Emitter(particlesContainer, waterParticles());

        this.update(player);
    }

    update(player: Player) {
        this.player = player;
        this.graphics.body.position.set(...this.player.position);
        this.graphics.body.rotation = this.player.angle;
        this.emitter.spawnPos.set(...this.player.position);
    }

    animate(stepTime: number) {
        this.emitter.emit = this.player.swimming;
        this.emitter.update(stepTime);
        /*
        if (this.player.swimming) {
            const particle = new WaterParticle(this.container, this.player);
            this.waterParticles.push(particle);
        }

        for (let i = 0; i < this.waterParticles.length; ++i) {
            const deleteParticle = this.waterParticles[i].animate(stepTime);
            if (deleteParticle) this.waterParticles.splice(i--, 1);
        }*/
    }

    delete() { }
}

const waterParticles: () => EmitterConfigV3 = () => ({
    lifetime: {
        min: .01,
        max: .03
    },
    frequency: 1 / 10000,
    spawnChance: .1,
    emitterLifetime: 0.31,
    maxParticles: 1000,
    pos: {
        x: 0,
        y: 0
    },
    addAtBack: false,
    behaviors: [
        {
            type: 'alpha',
            config: {
                alpha: {
                    list: [
                        {
                            value: 0.8,
                            time: 0
                        },
                        {
                            value: 0,
                            time: 1
                        }
                    ],
                },
            }
        },
        {
            type: 'scale',
            config: {
                scale: {
                    list: [
                        {
                            value: 1,
                            time: 0
                        },
                        {
                            value: 0.3,
                            time: 1
                        }
                    ],
                },
            }
        },
        {
            type: 'color',
            config: {
                color: {
                    list: [
                        {
                            value: "3fcbff",
                            time: 0
                        },
                        {
                            value: "2fcbff",
                            time: 1
                        }
                    ],
                },
            }
        },
        {
            type: 'moveSpeed',
            config: {
                speed: {
                    list: [
                        {
                            value: 20,
                            time: 0
                        },
                        {
                            value: 1,
                            time: 1
                        }
                    ],
                    isStepped: false
                },
            }
        },
        {
            type: 'rotationStatic',
            config: {
                min: 0,
                max: 360
            }
        },
        {
            type: 'spawnShape',
            config: {
                type: 'torus',
                data: {
                    x: 0,
                    y: 0,
                    radius: 10
                }
            }
        },
        {
            type: 'textureSingle',
            config: {
                texture: Texture.WHITE,
            }
        }
    ],
});

/*
class WaterParticle {
    private startTime: number;
    private velocity: Vec2;
    private angularVelocity: number;
    private sprite: Sprite;

    constructor(container: Container, player: Player) {
        this.sprite = new Sprite(Texture.WHITE);
        this.sprite.width = 20;
        this.sprite.height = 20;
        this.sprite.position.x = player.position[0] - this.sprite.width / 2;
        this.sprite.position.y = player.position[1] - this.sprite.height / 2;
        //particle.tint = ;

        this.sprite.parentGroup = group.playerParticles;
        container.addChild(this.sprite);

        this.velocity = [
            Math.random() * 20 - 10,
            Math.random() * 20 - 10,
        ];

        this.angularVelocity = Math.random() * 100 - 50;

        this.startTime = performance.now() / 1000;
    }

    /* Returns true if it needs to be deleted /
    animate(stepTime: number): boolean {
        this.sprite.position.x += stepTime * this.velocity[0];
        this.sprite.position.y += stepTime * this.velocity[1];

        this.sprite.angle += stepTime * this.angularVelocity;

        const sizeReduction = stepTime;
        this.sprite.width -= sizeReduction;
        this.sprite.height -= sizeReduction;
        return this.sprite.width <= 0;
    }


}*/
