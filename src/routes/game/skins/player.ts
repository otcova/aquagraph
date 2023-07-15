import { Container, Graphics, Rectangle } from "pixi.js";
import type { Vec2 } from "../../utils";

export type PlayerSkin = { index: number, color: number };
export type PlayerGraphics = { body: Container, eye: Container };


function eyeGraphics(): Container {
    const eye = new Graphics();
    eye.beginFill(0x000000);
    eye.drawRect(0, -.55, 1.1, 1.1);
    eye.endFill();

    return eye;
}

const playerHitboxes: Vec2[][][] = [
    [[[0, -1.8], [1.8, 0], [0, 1.8], [-1.8, 0]]],
    [[[1.5, -2], [1.5, 2], [-2, 0]]],
    [[[1.6, 0], [-.5, 2.1], [-1.55, 1.05], [-.5, 0]], [[1.6, 0], [-.5, 0], [-1.55, -1.05], [-.5, -2.1]]],
];

export const playerSkinColors = [
    0x55ff55,
    0xff9955,
    0xffe680,
    0xd35f8d,
];

export function randomSkin(): PlayerSkin {
    return {
        color: playerSkinColors[Math.floor(Math.random() * playerSkinColors.length)],
        index: Math.floor(Math.random() * playerHitboxes.length),
    };
}

export function playerHitbox(skin: PlayerSkin): Vec2[][] {
    return playerHitboxes[skin.index];
}

export function playerGraphics(skin: PlayerSkin) {
    const hitbox = playerHitbox(skin);
    const body = new Graphics();
    body.beginFill(skin.color);
    for (const convexPoly of hitbox) {
        body.moveTo(...convexPoly[0]);
        for (let i = 1; i < convexPoly.length; ++i) {
            body.lineTo(...convexPoly[i]);
        }
    }
    return { body, eye: eyeGraphics() };
}
