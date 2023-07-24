import { type EmitterConfigV3 } from "@pixi/particle-emitter";
import { Texture } from "pixi.js";
import type { DeathEffect, Player } from "../../../..";


export function deathParticlesConfig(player: Player, death: DeathEffect): EmitterConfigV3[] {
	const playerColor = player.skin.color.toString(16);
	const angle = death.angle * 180 / Math.PI;
	
	let color = {
		list: [
			{
				value: playerColor,
				time: 0
			},
			{
				value: playerColor == "2fcbff" ? "3fcbff" : "2fcbff",
				time: 1
			},
		],
	};

	return [{
		lifetime: {
			min: 0.5,
			max: 1.,
		},
		frequency: 0.0001,
		spawnChance: 1,
		maxParticles: 80,
		emitterLifetime: 0.05,
		pos: {
			x: death.position[0],
			y: death.position[1]
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
								value: 100,
								time: 0
							},
							{
								value: 50,
								time: 1
							}
						],
					},
					minMult: 0.2,
					maxMult: 0.5,
				}
			},
			{
				type: "rotation",
				config: {
					 minStart: 0,
					 maxStart: 360,
					 minSpeed: 100,
					 maxSpeed: 400,
					 accel: 20
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
			min: 1.,
			max: 2.
		},
		frequency: 0.001,
		spawnChance: 1,
		maxParticles: 20,
		emitterLifetime: 0.05,
		pos: {
			x: death.position[0],
			y: death.position[1]
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
								value: 120,
								time: 0
							},
							{
								value: 80,
								time: 1
							}
						],
					},
					minMult: 0.5,
					maxMult: Math.max(0.2, (death.force-20) / 80),
				}
			},
			{
				type: "rotation",
				config: {
					 minStart: 0,
					 maxStart: 360,
					 minSpeed: 100,
					 maxSpeed: 400,
					 accel: 20
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
			max: 2.
		},
		frequency: 0.2 / death.force,
		spawnChance: 1,
		maxParticles: 80,
		emitterLifetime: 0.1,
		pos: {
			x: death.position[0],
			y: death.position[1]
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
								value: death.force * 2,
								time: 0
							},
							{
								value: death.force,
								time: 1
							}
						],
					},
					minMult: 0.,
					maxMult: Math.max(0.2, (death.force-50) / 20),
				}
			},
			{
				type: "rotation",
				config: {
					 minStart: angle - 10,
					 maxStart: angle + 10,
					 minSpeed: 100,
					 maxSpeed: 400,
					 accel: 20
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