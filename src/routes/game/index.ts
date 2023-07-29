import type { Vec2 } from "../utils";
import type { BoxSkin } from "./skins/box";
import type { PlayerSkin } from "./skins/player";

export interface Game {
    time: number,
    camera: Camera,
    entities: GameEntities,
    light: number,
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
    coins: Map<EntityId, Coin>,
};

export type EntityId = number;

export interface Player {
    user: User,
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
    direction: Vec2,
    counter: number,
    timeLeft: number,
}

export interface DeathEffect {
    position: Vec2,
    angle: number,
    force: number,
    counter: number,
    timeLeft: number,
}

export interface User {
    name: string,
    skin: PlayerSkin,
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

export interface Coin {
    position: Vec2,
    type: PowerUp,
}

export enum PowerUp {
    BOW = 0,
    BOMB,
    LENGTH,
}

export interface Lake {
    position: Vec2,
    vertices: Float32Array,
}