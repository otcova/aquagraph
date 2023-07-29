import type { Box, Camera, EntityId, FrameBox, Game, Lake, Player } from ".";

export class GameDif {
    camera: Camera | undefined;

    entities: {
        players: MapDif<EntityId, Player>,
        boxes: MapDif<EntityId, Box>,
        lakes: MapDif<EntityId, Lake>,
        frameBoxes: MapDif<EntityId, FrameBox>,
    };

    light?: number;
    time?: number;

    constructor();
    constructor(past: Game | undefined, current: Game);
    constructor(past?: Game, current?: Game) {
        if (!current) {
            this.entities = {
                players: new MapDif(),
                boxes: new MapDif(),
                lakes: new MapDif(),
                frameBoxes: new MapDif(),
            };
        } else {
            this.entities = {
                players: new MapDif(past?.entities.players, current.entities.players),
                boxes: new MapDif(past?.entities.boxes, current.entities.boxes),
                lakes: new MapDif(past?.entities.lakes, current.entities.lakes),
                frameBoxes: new MapDif(past?.entities.frameBoxes, current.entities.frameBoxes),
            };

            if (past?.time != current.time) this.time = current.time;
            if (past?.light != current.light) this.light = current.light;

            if (JSON.stringify(past?.camera) != JSON.stringify(current.camera)) {
                this.camera = current.camera;
            }
        }
    }

    apply(game: Game): Game {
        const newGame: Game = {
            camera: this.camera ?? game.camera,
            entities: {
                players: MapDif.apply(this.entities.players, game.entities.players),
                boxes: MapDif.apply(this.entities.boxes, game.entities.boxes),
                lakes: MapDif.apply(this.entities.lakes, game.entities.lakes),
                frameBoxes: MapDif.apply(this.entities.frameBoxes, game.entities.frameBoxes),
            },
            time: this.time ?? game.time,
            light: this.light ?? game.light,
        };

        return newGame;
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

    static apply<Key, Value>(self: MapDif<Key, Value>, map: Map<Key, Value>): Map<Key, Value> {
        const newMap = new Map(map);
        for (const key of self.removed) newMap.delete(key);
        for (const [key, value] of self.updated) newMap.set(key, value);
        for (const [key, value] of self.added) newMap.set(key, value);
        return newMap;
    }
}

