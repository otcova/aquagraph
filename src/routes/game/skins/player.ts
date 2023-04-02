import { Container, Graphics, Rectangle } from "pixi.js";
import type { Vec2 } from "../../utils";

export type PlayerSkin = { index: number, color: number };
export type PlayerGraphics = { body: Container, eye: Container };


function eyeGraphics(): Container {
    const eye = new Graphics();
    eye.beginFill(0x000000);
    eye.drawRect(0, -5.5, 11, 11);
    eye.endFill();

    return eye;
}

const playerHitboxes: Vec2[][] = [
    [[0, -18], [18, 0], [0, 18], [-18, 0]],//.map(([x,y])=>[x/2,y/2]),
    [[15, -20], [15, 20], [-20, 0]],
    [[16, 0], [-5, 21], [-15.5, 10.5], [-5, 0], [-15.5, -10.5], [-5, -21]],
];

export const playerSkinColors = [
    0x55ff55,
    0xff9955,
    0xffe680,
    0xd35f8d,
];

export function playerHitbox(skin: PlayerSkin): Vec2[] {
    return playerHitboxes[skin.index];
}

export function playerGraphics(skin: PlayerSkin) {
    const hitbox = playerHitbox(skin);
    const body = new Graphics();
    body.beginFill(skin.color);
    body.moveTo(...hitbox[0]);
    for (let i = 1; i < hitbox.length; ++i) {
        body.lineTo(...hitbox[i]);
    }
    return { body, eye: eyeGraphics() };
}
