import type { Container } from "pixi.js";
import type { DashEffect, Player } from "../../../..";
import { dashParticlesConfig } from "./dash";
import { Emitter, type EmitterConfigV3 } from "@pixi/particle-emitter";

export class EmitterGroup {
	private emitters: Emitter[];

	constructor(configs: EmitterConfigV3[], particlesContainer: Container) {
		this.emitters = configs.map(config =>
			new Emitter(particlesContainer, config)
		);
	}

	/// deltaTime in seconds
	/// returns false if is inactive
	update(player: Player, deltaTime: number): boolean {
		let active = false;
		for (const emitter of this.emitters) {
			if (emitter.emit || emitter.particleCount > 0) {
				// emitter.spawnPos.set(...player.position);
				emitter.update(deltaTime);
				active = true;
			} else emitter.destroy();
		}
		return active;
	}
}