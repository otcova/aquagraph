import { Graphics, type Container } from "pixi.js";
import { rectHitbox, squareHitbox } from "./hitbox_utils";

export type BoxSkin = { index: number };
export type BoxGraphics = { body: Container };

const boxSkins = [{
    hitbox: squareHitbox(0, 0, 14.5),
    createGraphics: (): BoxGraphics => {
        const body = new Graphics();
        body.beginFill(0x280b0b);
        body.drawRect(1, 1, 12.5, 12.5);
        body.endFill();
        
        body.beginFill(0x784421);
        body.drawRoundedRect(0, 0, 6.5, 6.5, .9);
        body.drawRoundedRect(0, 8, 14.5, 6.5, .9);
        body.drawRoundedRect(8, 0, 6.5, 14.5, .9);
        body.endFill();
        return { body };
    },
}, {
    hitbox: rectHitbox(0, 0, 30.5, 14.5),
    createGraphics: (): BoxGraphics => {
        const body = new Graphics();
        body.beginFill(0x280b0b);
        body.drawRect(1, 1, 24.5, 12.5);
        body.endFill();
        
        body.beginFill(0x784421);
        body.drawRoundedRect(0, 0, 6.5, 6.5, .9);
        body.drawRoundedRect(8, 0, 14.5, 6.5, .9);
        body.drawRoundedRect(0, 8, 14.5, 6.5, .9);

        body.drawRoundedRect(16, 8, 14.5, 6.5, .9);
        body.drawRoundedRect(24, 0, 6.5, 14.5, .9);
        body.endFill();
        return { body };
    },
}];

const boxSkinGraphicsCache = new Map<string, BoxGraphics>();

export function boxHitbox(skin: BoxSkin) {
    return boxSkins[skin.index].hitbox;
}

export function boxGraphics(skin: BoxSkin) {
    return boxSkins[skin.index].createGraphics();
}
