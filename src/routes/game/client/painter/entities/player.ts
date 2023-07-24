import { PointLight, normalGroup } from "@pixi/lights";
import { Emitter, type EmitterConfigV3 } from "@pixi/particle-emitter";
import { Container, Texture } from "pixi.js";
import type { Painter } from "..";
import type { DashEffect, Player } from "../../..";
import type { Vec2 } from "../../../../utils";
import { playerGraphics, type PlayerGraphics } from "../../../skins/player";

class DashEmitter {
    private emitters: Emitter[];

    constructor(player: Player, dash: DashEffect, particlesContainer: Container) {
        this.emitters = dashParticlesConfig(player, dash.dir).map(config =>
            new Emitter(particlesContainer, config)
        );
    }

    /// deltaTime in seconds
    /// returns false if is inactive
    update(player: Player, deltaTime: number): boolean {
        let active = false;
        for (const emitter of this.emitters) {
            if (emitter.emit || emitter.particleCount > 0) {
                emitter.spawnPos.set(...player.position);
                emitter.update(deltaTime);
                active = true;
            } else emitter.destroy();
        }
        return active;
    }
}

export class PlayerPainter {
    private graphics: PlayerGraphics;
    private light: PointLight;
    private waterEmitter: Emitter;
    private dashEmitters: DashEmitter[] = [];
    private dashCounter = -Infinity;

    constructor(private painter: Painter, private player: Player) {
        this.graphics = playerGraphics(player.skin);

        painter.layers.player.addChild(this.graphics.body);
        this.graphics.body.addChild(this.graphics.eye);

        this.graphics.body.addChild(this.graphics.normalBody);
        this.graphics.normalBody.parentGroup = normalGroup;

        this.light = new PointLight(player.skin.color, 0);
        this.graphics.body.addChild(this.light);

        this.waterEmitter = new Emitter(painter.layers.bottomParticles, waterParticles);
        this.update(player);
        this.updateLight(painter.sceneLight.brightness);
    }

    update(player: Player) {
        this.player = player;
        
        this.graphics.body.position.set(...this.player.position);
        this.graphics.body.rotation = this.player.angle;
        this.graphics.body.visible = player.state == "playing";

        this.waterEmitter.spawnPos.set(...this.player.position);

        let newDashCounter = this.dashCounter;
        for (const dash of player.dashEffects) {
            if (this.dashCounter < dash.counter) {
                newDashCounter = Math.max(newDashCounter, dash.counter);
                this.dashEmitters.push(new DashEmitter(player, dash, this.painter.layers.topParticles));
            }
        }
        this.dashCounter = newDashCounter;
    }
    
    updateLight(light: number) {
        this.light.brightness = 0.6 * (1 - light);
    }

    /// deltaTime in seconds
    animate(deltaTime: number) {
        this.waterEmitter.emit = this.player.swimming && this.graphics.body.visible;
        this.waterEmitter.update(deltaTime);

        this.dashEmitters = this.dashEmitters.filter(dash => dash.update(this.player, deltaTime));
    }

    destroy() { }
}

const waterParticles: EmitterConfigV3 = {
    lifetime: {
        min: 1,
        max: 3
    },
    frequency: 1 / 70,
    spawnChance: .2,
    maxParticles: 100,
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
                            value: .1,
                            time: 0
                        },
                        {
                            value: 0.03,
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
                            value: 2,
                            time: 0
                        },
                        {
                            value: .1,
                            time: 1
                        }
                    ],
                },
            }
        },
        {
            type: 'rotationStatic',
            config: {
                min: 0,
                max: 360,
            }
        },
        {
            type: 'spawnShape',
            config: {
                type: 'torus',
                data: {
                    x: 0,
                    y: 0,
                    radius: 1
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
} as EmitterConfigV3;

function dashParticlesConfig(player: Player, dir: Vec2): EmitterConfigV3[] {
    const angle = Math.atan2(-dir[1], -dir[0]) * 180 / Math.PI;
    const playerColor = player.skin.color.toString(16);

    let color = {
        list: [
            {
                value: playerColor == "2fcbff" ? "3fcbff" : "2fcbff",
                time: 0
            },
            {
                value: playerColor,
                time: 1
            }
        ],
    };

    return [{
        lifetime: {
            min: 0.5,
            max: 1.5
        },
        frequency: 0.0005,
        spawnChance: 1,
        maxParticles: 100,
        emitterLifetime: 0.01,
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
                                value: 0.7,
                                time: 0
                            },
                            {
                                value: 0.6,
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
                                value: .1,
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
                type: 'color',
                config: {
                    color,
                }
            },
            {
                type: 'moveSpeed',
                config: {
                    speed: {
                        list: [
                            {
                                value: 50,
                                time: 0
                            },
                            {
                                value: 0,
                                time: 1
                            }
                        ],
                    },
                    minMult: 0.,
                    maxMult: 1,
                }
            },
            {
                type: 'rotationStatic',
                config: {
                    min: angle - 80,
                    max: angle + 80,
                }
            },
            {
                type: 'spawnShape',
                config: {
                    type: 'torus',
                    data: {
                        x: 0,
                        y: 0,
                        radius: 1
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
    }, {
        lifetime: {
            min: 0.5,
            max: 2
        },
        frequency: 0.02,
        spawnChance: 1,
        maxParticles: 100,
        emitterLifetime: 0.2,
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
                                value: 0.7,
                                time: 0
                            },
                            {
                                value: 0.6,
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
                                value: .1,
                                time: 0
                            },
                            {
                                value: 0.0,
                                time: 1
                            }
                        ],
                    },
                }
            },
            {
                type: 'color',
                config: {
                    color,
                }
            },
            {
                type: 'moveSpeed',
                config: {
                    speed: {
                        list: [
                            {
                                value: 10,
                                time: 0
                            },
                            {
                                value: 0,
                                time: 1
                            }
                        ],
                    },
                    minMult: 0.5,
                    maxMult: 1,
                }
            },
            {
                type: 'rotationStatic',
                config: {
                    min: angle - 80,
                    max: angle + 80,
                }
            },
            {
                type: 'spawnShape',
                config: {
                    type: 'torus',
                    data: {
                        x: 0,
                        y: 0,
                        radius: 1
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
    }];
}