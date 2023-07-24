import type { EmitterConfigV3 } from "@pixi/particle-emitter";
import { Texture } from "pixi.js";

export const waterParticles: EmitterConfigV3 = {
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