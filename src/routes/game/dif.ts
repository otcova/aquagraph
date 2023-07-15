import type { Box, Effect, EntityId, Game, Lake, Player } from ".";
import type { Vec2 } from "../utils";

export class GameDif {
    camera: {
        topLeft: Vec2,
        bottomRight: Vec2,
    } | undefined;

    entities: {
        players: MapDif<EntityId, Player>,
        boxes: MapDif<EntityId, Box>,
        lakes: MapDif<EntityId, Lake>,
    };
    
    // All the new effects
    effects: Effect[] = [];

    constructor();
    constructor(past: Game | undefined, current: Game);
    constructor(past?: Game, current?: Game) {
        if (!current) {
            this.entities = {
                players: new MapDif(),
                boxes: new MapDif(),
                lakes: new MapDif(),
            };
        } else {
            this.effects = current.effects;
            
            this.entities = {
                players: new MapDif(past?.entities.players, current.entities.players),
                boxes: new MapDif(past?.entities.boxes, current.entities.boxes),
                lakes: new MapDif(past?.entities.lakes, current.entities.lakes),
            };

            if (JSON.stringify(past?.camera) != JSON.stringify(current.camera)) {
                this.camera = current.camera;
            }
        }
    }
}

export class MapDif<Key, Value> {
    removed: Key[] = [];
    updated: [Key, Value][] = [];
    added: [Key, Value][] = [];

    constructor();
    constructor(past: Map<Key, Value> | undefined, current: Map<Key, Value>);
    constructor(past?: Map<Key, Value>, current?: Map<Key, Value>) {
        if (!current) return;

        if (past) {
            for (const [key, value] of current) {
                if (past.has(key)) {
                    if (JSON.stringify(past.get(key)) != JSON.stringify(value)) {
                        this.updated.push([key, value]);
                    }
                } else {
                    this.added.push([key, value]);
                }
            }

            for (const key of past.keys()) {
                if (!current.has(key)) {
                    this.removed.push(key);
                }
            }
        } else {
            this.added = Array.from(current);
        }
    }
}

