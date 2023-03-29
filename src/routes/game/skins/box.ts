import { Graphics, type Container } from "pixi.js";
import { rectHitbox, squareHitbox } from "./hitbox_utils";

export type BoxSkin = { index: number };
export type BoxGraphics = { body: Container };

const boxSkins = [{
    hitbox: squareHitbox(0, 0, 145),
    createGraphics: (): BoxGraphics => {
        const body = new Graphics();
        body.beginFill(0x280b0b);
        body.drawRect(10, 10, 125, 125);
        body.endFill();
        
        body.beginFill(0x784421);
        body.drawRoundedRect(0, 0, 65, 65, 9);
        body.drawRoundedRect(0, 80, 145, 65, 9);
        body.drawRoundedRect(80, 0, 65, 145, 9);
        body.endFill();
        return { body };
    },
}, {
    hitbox: rectHitbox(0, 0, 275, 145),
    createGraphics: (): BoxGraphics => {
        const body = new Graphics();
        body.beginFill(0x280b0b);
        body.drawRect(10, 10, 245, 125);
        body.endFill();
        
        body.beginFill(0x784421);
        body.drawRoundedRect(0, 0, 65, 65, 9);
        body.drawRoundedRect(80, 0, 145, 65, 9);
        body.drawRoundedRect(0, 80, 145, 65, 9);

        body.drawRoundedRect(160, 80, 145, 65, 9);
        body.drawRoundedRect(240, 0, 65, 145, 9);
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
