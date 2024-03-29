import { PointLight, normalGroup } from "@pixi/lights";
import { Emitter } from "@pixi/particle-emitter";
import type { Painter } from "../..";
import type { Player } from "../../..";
import { playerGraphics, type PlayerGraphics } from "../../../skins/player";
import { Bow } from "./bow";
import { dashParticlesConfig } from "./dash";
import { deathParticlesConfig } from "./death";
import { EmitterGroup } from "./emitterGroup";
import { waterParticles } from "./water";

export interface PlayerModule {
	update?(player: Player): void;
	animate?(deltaTime: number): void;
	destroy(): void;
}

export class PlayerPainter {
	private graphics: PlayerGraphics;
	private light: PointLight;
	private waterEmitter: Emitter;
	private emitterGroups: EmitterGroup[] = [];
	private effectCounter = -Infinity;
	private modules: PlayerModule[];

	constructor(private painter: Painter, private player: Player) {
		this.graphics = playerGraphics(player.user.skin);

		painter.layers.player.addChild(this.graphics.body);
		this.graphics.body.addChild(this.graphics.eye);

		this.graphics.body.addChild(this.graphics.normalBody);
		this.graphics.normalBody.parentGroup = normalGroup;

		this.light = new PointLight(player.user.skin.color, 0);
		this.graphics.body.addChild(this.light);

		this.modules = [
			//new Bomb(painter),
			new Bow(painter),
		];

		this.waterEmitter = new Emitter(painter.layers.bottomParticles, waterParticles);
		this.update(player);
	}

	update(player: Player) {
		this.player = player;

		this.graphics.body.position.set(...this.player.position);
		this.graphics.body.rotation = this.player.angle;
		this.graphics.body.visible = player.state == "playing";

		this.waterEmitter.spawnPos.set(...this.player.position);

		let newEffectCounter = this.effectCounter;
		for (const dash of player.dashEffects) {
			if (this.effectCounter < dash.counter) {
				newEffectCounter = Math.max(newEffectCounter, dash.counter);
				const config = dashParticlesConfig(player, dash);
				this.emitterGroups.push(new EmitterGroup(config, this.painter.layers.topParticles));
			}
		}
		for (const death of player.deathEffects) {
			if (this.effectCounter < death.counter) {
				newEffectCounter = Math.max(newEffectCounter, death.counter);
				const config = deathParticlesConfig(player, death);
				this.emitterGroups.push(new EmitterGroup(config, this.painter.layers.topParticles));
			}
		}
		this.effectCounter = newEffectCounter;

		for (const module of this.modules) module.update?.(player);
	}

	lightUpdate(light: number) {
		this.light.brightness = 0.6 * (1 - light);
	}

	/// deltaTime in seconds
	animate(deltaTime: number) {
		this.waterEmitter.emit = this.player.swimming && this.graphics.body.visible;
		this.waterEmitter.update(deltaTime);

		for (const module of this.modules) module.animate?.(deltaTime);

		this.emitterGroups = this.emitterGroups.filter(effect => effect.update(this.player, deltaTime));
	}

	destroy() {
		this.graphics.body.destroy();
		this.graphics.eye.destroy();
		this.graphics.normalBody.destroy();
		this.waterEmitter.destroy();
		for (const emitter of this.emitterGroups) emitter.destroy();
		for (const module of this.modules) module.destroy();
	}
}



