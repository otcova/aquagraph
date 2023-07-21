import type { EntityId } from "../../..";
import type { GameDif } from "../../../dif";
import type { AppContainers } from "../containers";
import { BoxPainter } from "./box";
import { LakePainter } from "./lake";
import { PlayerPainter } from "./player";

export class EntitiesPainter {
    players = new Map<EntityId, PlayerPainter>();
    boxes = new Map<EntityId, BoxPainter>();
    lakes = new Map<EntityId, LakePainter>();

    constructor(private container: AppContainers) { }

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

        // Update Players
        for (const [id, updatedPlayer] of gameDif.entities.players.updated) {
            this.players.get(id)?.update(updatedPlayer);
        }

        // Create Boxes Painters
        for (const [id, newBox] of gameDif.entities.boxes.added) {
            const painter = new BoxPainter(this.container, newBox);
            this.boxes.set(id, painter);
        }
        
        // Delete entities
        for (const entityType of ["players", "boxes", "lakes"] as const) {
            for (const id of gameDif.entities[entityType].removed) {
                this[entityType].get(id)?.destroy();
                this[entityType].delete(id);
            }
        }
    }

    animate(stepTime: number) {
        for (const entityType of ["players", "lakes"] as const) {
            for (const entity of this[entityType].values()) {
                entity.animate(stepTime);
            }
        }
    }
}
