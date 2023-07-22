import type { Vec2 } from "../utils";
import type { BoxSkin } from "./skins/box";
import type { PlayerSkin } from "./skins/player";


export interface Game {
    camera: Camera,
    entities: GameEntities,
    time: number,
}

export interface Camera {
    position: Vec2,
    size: Vec2,
}

export interface GameEntities {
    players: Map<EntityId, Player>,
    boxes: Map<EntityId, Box>,
    lakes: Map<EntityId, Lake>,
    frameBoxes: Map<EntityId, FrameBox>,
};

export type EntityId = number;

export interface Player {
    user: User,
    skin: PlayerSkin,
    swimming: boolean,
    dashPower: number,
    state: "playing" | "death",
    
    dashEffects: DashEffect[],
    deathEffects: DeathEffect[],

    position: Vec2,
    velocity: Vec2,
    angle: number,
    angularVelocity: number,
    move: Vec2,
}

export interface DashEffect {
    position: Vec2,
    dir: Vec2,
    counter: number,
    timeLeft: number,
}

export interface DeathEffect {
    position: Vec2,
    counter: number,
    timeLeft: number,
}

export interface User {
    name: string,
}

export interface Box {
    position: Vec2,
    angle: number,
    skin: BoxSkin,
    lamps?: Vec2[],
}

export interface FrameBox {
    position: Vec2,
    size: Vec2,
    color: number,
}

export interface Lake {
    position: Vec2,
    vertices: Float32Array,
}

