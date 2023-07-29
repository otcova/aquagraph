import { PointLight, normalGroup } from "@pixi/lights";
import Alea from "alea";
import { Graphics } from "pixi.js";
import { createNoise2D } from "simplex-noise";
import type { Painter } from "..";
import type { Coin } from "../..";
import { easeInOutQuad, type Vec2 } from "../../../utils";

const noise = createNoise2D(Alea(1));

export class CoinPainter {
	private graphics = new Graphics();
	private normalGraphics = new Graphics();
	private light = new PointLight(0xffde58, 0);
	private t = 0;

	constructor(painter: Painter, private coin: Coin) {
		this.normalGraphics.parentGroup = normalGroup;

		this.graphics.position.set(...coin.position);
		painter.layers.player.addChild(this.graphics);
		this.graphics.addChild(this.normalGraphics);
		this.graphics.addChild(this.light);
	}

	animate(dt: number) {
		this.t += dt;

		const n = Math.min(1, easeInOutQuad(this.t));
		this.graphics.scale.set(n);
		this.light.brightness = n;
		
		const [x, y] = this.coin.position;
		const t = 10 + 1 * this.t;
		this.graphics.rotation = noise(t / 100 + x, y) * Math.PI * 2;

		const noiseSize = 0.2;
		const r = 1;
		const lineWidth = 0.7 + 0.7 * noise(t / 3, 0);
		
		this.normalGraphics.clear();
		this.normalGraphics.beginFill(0x8080ff);
		this.normalGraphics.lineStyle(lineWidth, 0x8080ff);
		
		this.graphics.clear();
		this.graphics.lineStyle(lineWidth, 0xCCFF00);
		this.graphics.beginFill([
			0x803300, // BOW
			0, // BOMB
		][this.coin.type]);


		const a: Vec2 = [r + noiseSize * noise(t + x + 1, y + 1), r + noiseSize * noise(x + 1, t + y + 1)];
		const b: Vec2 = [r + noiseSize * noise(t + x + 1, y - 1), -r + noiseSize * noise(x + 1, t + y - 1)];
		const c: Vec2 = [-r + noiseSize * noise(t + x - 1, y - 1), -r + noiseSize * noise(x - 1, t + y - 1)];
		const d: Vec2 = [-r + noiseSize * noise(t + x - 1, y + 1), r + noiseSize * noise(x - 1, t + y + 1)];

		this.graphics.moveTo(...a);
		this.graphics.lineTo(...b);
		this.graphics.lineTo(...c);
		this.graphics.lineTo(...d);
		this.graphics.closePath();
		
		this.normalGraphics.moveTo(...a);
		this.normalGraphics.lineTo(...b);
		this.normalGraphics.lineTo(...c);
		this.normalGraphics.lineTo(...d);
		this.normalGraphics.closePath();
	}

	destroy() {
		this.graphics.destroy();
		this.normalGraphics.destroy();
		this.light.destroy();
	}
}
