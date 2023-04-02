import type { Vec2 } from "../utils";
import type { BoxSkin } from "./skins/box";
import type { PlayerSkin } from "./skins/player";

/**
 * An instant/fame of a game
*/
export interface Game {
    camera: {
        topLeft: Vec2,
        bottomRight: Vec2,
    },
    entities: GameEntities,
}

export interface GameEntities {
    players: Map<EntityId, Player>,
    boxes: Map<EntityId, Box>,
    lakes: Map<EntityId, Lake>,
};

export type EntityId = number;

export interface Player {
    user: User,
    position: Vec2,
    swimming: boolean,
    velocity: Vec2,
    angle: number,
    angularVelocity: number,
    skin: PlayerSkin,
}

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

