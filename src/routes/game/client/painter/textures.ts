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



export const font = new Promise<BitmapFont>(async (resolve) => {
	const [data, image] = await Promise.all([
		loadXML("assets/fonts/font.xml"),
		loadTexture("assets/fonts/font.png"),
	]);
	const font = BitmapFont.install(data, image, true);
	resolve(font);
});