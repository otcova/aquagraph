import { PointLight } from "@pixi/lights";
import { Emitter, type EmitterConfigV3 } from "@pixi/particle-emitter";
import { Container, Texture } from "pixi.js";
import type { Player } from "../../..";
import { playerGraphics, type PlayerGraphics } from "../../../skins/player";
import { group } from "../layers";


export class PlayerPainter {
    graphics: PlayerGraphics;
    emitter: Emitter;

    constructor(container: Container, private player: Player) {
        this.graphics = playerGraphics(player.skin);
        this.graphics.body.parentGroup = group.player;
        container.addChild(this.graphics.body);

        this.graphics.body.addChild(this.graphics.eye);

        const light = new PointLight(player.skin.color, 0.7);
        this.graphics.body.addChild(light);

        const particlesContainer = new Container();
        particlesContainer.parentGroup = group.playerParticles;
        container.addChild(particlesContainer);

        this.emitter = new Emitter(particlesContainer, waterParticles);

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
    }

    delete() { }
}

const waterParticles: EmitterConfigV3 = ({
    lifetime: {
        min: 1,
        max: 3
    },
    frequency: 1 / 70,
    spawnChance: .2,
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

