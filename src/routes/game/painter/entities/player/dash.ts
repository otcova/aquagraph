import { type EmitterConfigV3 } from "@pixi/particle-emitter";
import { Texture } from "pixi.js";
import type { DashEffect, Player } from "../../..";


export function dashParticlesConfig(player: Player, dash: DashEffect): EmitterConfigV3[] {
	const angle = Math.atan2(-dash.direction[1], -dash.direction[0]) * 180 / Math.PI;
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
			x: dash.position[0],
			y: dash.position[1]
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
			x: dash.position[0],
			y: dash.position[1]
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