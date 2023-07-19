import { Container } from "pixi.js";
import { group } from "../layers";
import { upgradeConfig, Emitter } from "@pixi/particle-emitter";

export class DashPainter {
	emitter: Emitter;

	constructor(container: Container) {
		const config = upgradeConfig({
			"alpha": {
				"start": 1,
				"end": 1
			},
			"scale": {
				"start": 1,
				"end": 0.01,
				"minimumScaleMultiplier": 1
			},
			"color": {
				"start": "#ffd83d",
				"end": "#ffffff"
			},
			"speed": {
				"start": 50,
				"end": 50,
				"minimumSpeedMultiplier": 1
			},
			"acceleration": {
				"x": 100,
				"y": 0
			},
			"maxSpeed": 0,
			"startRotation": {
				"min": 0,
				"max": 360
			},
			"noRotation": true,
			"rotationSpeed": {
				"min": 0,
				"max": 0
			},
			"lifetime": {
				"min": 1,
				"max": 2
			},
			"blendMode": "normal",
			"frequency": 0.05,
			"emitterLifetime": -1,
			"maxParticles": 500,
			"pos": {
				"x": 0,
				"y": 0
			},
			"addAtBack": false,
			"spawnType": "point"
		}, []);
		
		const particlesContainer = new Container();
        particlesContainer.parentGroup = group.playerParticles;
        container.addChild(particlesContainer);
		
		this.emitter = new Emitter(particlesContainer, config);
	}

	delete() { }
}
