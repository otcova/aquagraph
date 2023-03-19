import type { Player, Skin } from "../..";

export function defaultPlayer(): Player {
    return {
        angular_velocity: 0,
        skin: playerSkins.get(0, 0),
        user: { name: "Default Player Name" },
        angle: 0,
        position: [0, 0],
        velocity: [0, 0],
    };
}



const skinShapes: Skin[] = [{
    hitbox: [[[0, -18], [18, 0], [0, 18], [-18, 0]]],
    image:
        `<path fill="$body" d="M0,-18 18,0 0,18 -18,0" />` +
        `<rect class="eye" x="0" y="-5.5" width="11" height="11" fill="#000" />`,
}, {
    hitbox: [[[15, -20], [15, 20], [-20, 0]]],
    image:
        `<polygon fill="$body" points="15,-20 15,20 -20,0" />` +
        `<rect class="eye" x="0" y="-5.5" width="11" height="11" fill="#000" />`,
}, {
    hitbox: [[[16, 0], [-5, 21], [-15.5, 10.5], [-5, 0], [-15.5, -10.5], [-5, -21]]],
    image:
        `<path fill="$body" d="M 16,0 -5,21 -15.5,10.5 -5,0 -15.5,-10.5 -5,-21" />` +
        `<rect class="eye" x="0" y="-5.5" width="11" height="11" fill="#000" />`,
}];

/* Skins to consider

`<path fill="$body" d="M18,0 -10,20 -18,18 -10,0 -18,-18 -10,-20" />`

*/

const skinColors = [
    "#55ff55",
    "#ff9955",
    "#ffe680",
    "#d35f8d",
];

export function playerSkin(shapeIndex: number, colorIndex: number): Skin {
    return {
        hitbox: skinShapes[shapeIndex].hitbox,
        image: skinShapes[shapeIndex].image.replaceAll("$body", skinColors[colorIndex]),
    };
}
