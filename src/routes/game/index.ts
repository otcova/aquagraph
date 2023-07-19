import type { Vec2 } from "../utils";
import type { BoxSkin } from "./skins/box";
import type { PlayerSkin } from "./skins/player";

/**
 * An instant/fame of a game
*/
export interface Game {
    camera: Camera,
    entities: GameEntities,
    time: number,
}

export interface Camera {
    topLeft: Vec2,
    bottomRight: Vec2,
}

export interface GameEntities {
    players: Map<EntityId, Player>,
    boxes: Map<EntityId, Box>,
    lakes: Map<EntityId, Lake>,
};

export type EntityId = number;

export interface Player {
    user: User,
    skin: PlayerSkin,
    dashEffects: DashEffect[],
    swimming: boolean,
    dashPower: number,

    position: Vec2,
    velocity: Vec2,
    angle: number,
    angularVelocity: number,
    move: Vec2,
}

export interface DashEffect {
    pos: Vec2,
    dir: Vec2,
    counter: number,
    timeLeft: number,
}

// export interface DeathFrameEffect {
//     pos: Vec2,
//     endTime: number,
// }

export interface User {
    name: string,
}

export interface Box {
    position: Vec2,
    angle: number,
    skin: BoxSkin,
    lamp?: Vec2,
}

export interface Lake {
    position: Vec2,
    vertices: Float32Array,
}

