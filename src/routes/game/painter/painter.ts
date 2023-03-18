import type { Game } from "..";
import type { EntityId } from "../";
import { GameDif } from "../dif";
import type { GameServer } from "../server";
import type { DrawingElement } from "./drawing_element";
import { BoxPainter } from "./entities/box";
import { LakePainter } from "./entities/lake";
import { PlayerPainter } from "./entities/player";

export const svgNamespaceURI = "http://www.w3.org/2000/svg";

export interface EntityPainter<E> {
    image: DrawingElement;
    update(entity: E): void;
}

interface PainterEntities {
    players: Map<EntityId, PlayerPainter>;
    boxes: Map<EntityId, BoxPainter>;
    lakes: Map<EntityId, LakePainter>;
}

export class Painter {
    loop = true;
    svg: SVGSVGElement;
    svgLayer: SVGGElement;

    entities: PainterEntities;

    server: GameServer;
    pastGameDrawed?: Game;

    constructor(server: GameServer, svg: SVGSVGElement) {
        this.svg = svg;
        this.server = server;
        this.frame = this.frame.bind(this);
        this.entities = {
            players: new Map(),
            lakes: new Map(),
            boxes: new Map(),
        };

        this.svgLayer = document.createElementNS(svgNamespaceURI, "g");
        this.svg.appendChild(this.svgLayer);

        this.setup();
    }

    private setup() {
        requestAnimationFrame(this.frame);
    }

    private frame() {
        if (this.pastGameDrawed != this.server.game) {
            const gameDif = new GameDif(this.pastGameDrawed, this.server.game);
            this.pastGameDrawed = this.server.game;

            this.updateCamera(gameDif);
            this.updateEntities(gameDif);
        }


        for (const player of this.entities.players.values()) {
            player.frame();
        }

        if (this.loop) requestAnimationFrame(this.frame);
    }

    private updateCamera(gameDif: GameDif) {
        if (gameDif.camera) {
            const width = gameDif.camera.bottomRight[0] - gameDif.camera.topLeft[0];
            const height = gameDif.camera.bottomRight[1] - gameDif.camera.topLeft[1];

            const frameWidth = this.svg.clientWidth;
            const frameHeight = this.svg.clientHeight;

            const scale = Math.min(frameWidth / width, frameHeight / height);

            const offsetX = (frameWidth / scale - width) / 2 - gameDif.camera.topLeft[0];
            const offsetY = (frameHeight / scale - height) / 2 - gameDif.camera.topLeft[1];

            this.svgLayer.setAttribute("transform",
                `scale(${scale}) translate(${offsetX} ${offsetY})`
            );
        }
    }

    private updateEntities(gameDif: GameDif) {
        // Players
        for (const [id, newPlayer] of gameDif.entities.players.added) {
            const painter = new PlayerPainter(newPlayer);
            this.entities.players.set(id, painter);
            this.setupEntity(painter);
        }

        for (const [id, updatedPlayer] of gameDif.entities.players.updated) {
            this.entities.players.get(id)?.update(updatedPlayer);
        }

        // Boxes
        for (const [id, newBox] of gameDif.entities.boxes.added) {
            const painter = new BoxPainter(newBox);
            this.entities.boxes.set(id, painter);
            this.setupEntity(painter);
        }

        for (const [id, updatedBox] of gameDif.entities.lakes.updated) {
            this.entities.lakes.get(id)?.update(updatedBox);
        }

        // Lakes
        for (const [id, newLake] of gameDif.entities.lakes.added) {
            const lake = new LakePainter(newLake);
            this.entities.lakes.set(id, lake);
            this.setupEntity(lake);
        }

        for (const [id, updatedLake] of gameDif.entities.lakes.updated) {
            this.entities.lakes.get(id)?.update(updatedLake);
        }

        // Remove entities
        for (const type of ["players", "boxes", "lakes"] as const) {
            for (const id of gameDif.entities[type].removed) {
                const entity = this.entities.players.get(id);
                if (entity) this.deleteEntity(entity);
            }
        }
    }

    private setupEntity<E>(entity: EntityPainter<E>) {
        this.svgLayer.appendChild(entity.image.element);
    }
    private deleteEntity<E>(entity: EntityPainter<E>) {
        entity.image.element.remove();
    }

    stop() {
        this.loop = true;
    }
}
