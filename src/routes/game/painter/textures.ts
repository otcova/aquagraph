import { BitmapFont, Texture } from "pixi.js";

export async function loadTexture(url: string): Promise<Texture> {
	const texture = await Texture.fromURL(url);
	return texture;
}

async function loadXML(url: string): Promise<Document> {
	var xhr = new XMLHttpRequest()

	xhr.open('GET', url)
	xhr.setRequestHeader('Content-Type', 'text/xml')
	xhr.send()

	return new Promise((resolve, reject) => {
		xhr.onload = () =>
			resolve(xhr.responseXML as Document);

		xhr.onerror = () =>
			reject("Error while getting XML.");
	});
}

import fontXML from "$lib/assets/fonts/font.xml?url";
import fontPNG from "$lib/assets/fonts/font.png";

export const font = new Promise<BitmapFont>(async (resolve) => {
	const [data, image] = await Promise.all([
		loadXML(fontXML),
		loadTexture(fontPNG),
	]);
	const font = BitmapFont.install(data, image, true);
	resolve(font);
});