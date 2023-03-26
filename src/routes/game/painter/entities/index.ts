import type { Container } from "pixi.js";
import type { EntityId } from "../..";
import type { GameDif } from "../../dif";
import { BoxPainter } from "./box";
import { LakePainter } from "./lake";
import { PlayerPainter } from "./player";

export class EntitiesPainter {
    players = new Map<EntityId, PlayerPainter>();
    boxes = new Map<EntityId, BoxPainter>();
    lakes = new Map<EntityId, LakePainter>();

    constructor(private container: Container) { }

    updateGame(gameDif: GameDif) {
        // Create Lakes Painters
        for (const [id, newLake] of gameDif.entities.lakes.added) {
            const painter = new LakePainter(this.container, newLake);
            this.lakes.set(id, painter);
        }

        // Create Players Painters
        for (const [id, newPlayer] of gameDif.entities.players.added) {
            const painter = new PlayerPainter(this.container, newPlayer);
            this.players.set(id, painter);
        }

        // Create Boxes Painters
        for (const [id, newBox] of gameDif.entities.boxes.added) {
            const painter = new BoxPainter(this.container, newBox);
            this.boxes.set(id, painter);
        }

        // Delete entities
        for (const entityType of ["players", "boxes", "lakes"] as const) {
            for (const id of gameDif.entities[entityType].removed) {
                this[entityType].get(id)?.delete();
                this[entityType].delete(id);
            }
        }
    }

    animate() {
        for (const entityType of ["lakes"] as const) {
            for (const entity of this[entityType].values()) {
                entity.animate();
            }
        }
    }
}
