import { Graphics, type Container } from "pixi.js";
import { rectHitbox, squareHitbox } from "./hitbox_utils";

export type BoxSkin = { index: number };
export type BoxGraphics = { diffuse: Container, normal: Container };

const boxSkins = [{
    hitbox: squareHitbox(0, 0, 14.5),
    createGraphics: (): BoxGraphics => {
        const diffuse = new Graphics();
        diffuse.beginFill(0x280b0b);
        diffuse.drawRect(1, 1, 12.5, 12.5);
        diffuse.endFill();
        
        diffuse.beginFill(0x784421);
        diffuse.drawRoundedRect(0, 0, 6.5, 6.5, .9);
        diffuse.drawRoundedRect(0, 8, 14.5, 6.5, .9);
        diffuse.drawRoundedRect(8, 0, 6.5, 14.5, .9);
        diffuse.endFill();
        
        const normal = new Graphics();
        normal.beginFill(0x8080ff);
        normal.drawRect(1, 1, 12.5, 12.5);
        normal.endFill();
        
        normal.beginFill(0x8080ff);
        normal.drawRoundedRect(0, 0, 6.5, 6.5, .9);
        normal.drawRoundedRect(0, 8, 14.5, 6.5, .9);
        normal.drawRoundedRect(8, 0, 6.5, 14.5, .9);
        normal.endFill();
        
        return { diffuse, normal };
    },
}, {
    hitbox: rectHitbox(0, 0, 30.5, 14.5),
    createGraphics: (): BoxGraphics => {
        const diffuse = new Graphics();
        diffuse.beginFill(0x280b0b);
        diffuse.drawRect(1, 1, 24.5, 12.5);
        diffuse.endFill();
        
        diffuse.beginFill(0x784421);
        diffuse.drawRoundedRect(0, 0, 6.5, 6.5, .9);
        diffuse.drawRoundedRect(8, 0, 14.5, 6.5, .9);
        diffuse.drawRoundedRect(0, 8, 14.5, 6.5, .9);

        diffuse.drawRoundedRect(16, 8, 14.5, 6.5, .9);
        diffuse.drawRoundedRect(24, 0, 6.5, 14.5, .9);
        diffuse.endFill();
        
        const normal = new Graphics();
        normal.beginFill(0x8080ff);
        normal.drawRect(1, 1, 24.5, 12.5);
        normal.endFill();
        
        normal.beginFill(0x8080ff);
        normal.drawRoundedRect(0, 0, 6.5, 6.5, .9);
        normal.drawRoundedRect(8, 0, 14.5, 6.5, .9);
        normal.drawRoundedRect(0, 8, 14.5, 6.5, .9);

        normal.drawRoundedRect(16, 8, 14.5, 6.5, .9);
        normal.drawRoundedRect(24, 0, 6.5, 14.5, .9);
        normal.endFill();
        return { diffuse, normal };
    },
}];

const boxSkinGraphicsCache = new Map<string, BoxGraphics>();

export function boxHitbox(skin: BoxSkin) {
    return boxSkins[skin.index].hitbox;
}

export function boxGraphics(skin: BoxSkin) {
    return boxSkins[skin.index].createGraphics();
}
