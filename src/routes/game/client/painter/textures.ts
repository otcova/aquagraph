import { Texture } from "pixi.js";

export async function loadTexture(url: string): Promise<Texture> {
	const texture = await Texture.fromURL(url);
	return texture;
}