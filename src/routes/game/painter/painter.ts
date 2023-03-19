import type { Game } from "..";
import type { EntityId } from "../";
import type { ArrayIndex } from "../../utils";
import { GameDif } from "../dif";
import type { GameServer } from "../server";
import { BoxPainter } from "./entities/box";
import { LakePainter } from "./entities/lake";
import { PlayerPainter } from "./entities/player";

export const svgNamespaceURI = "http://www.w3.org/2000/svg";

interface PainterEntities {
    players: Map<EntityId, PlayerPainter>;
    boxes: Map<EntityId, BoxPainter>;
    lakes: Map<EntityId, LakePainter>;
}

interface PainterElementData {
    elements: SVGElement[],
    intervals: number[],
    onAnimationFrame?: (elapsedSeconds: number) => void,
};

export class PainterCanvas {
    private layers: SVGElement[];
    private parserLayer: SVGElement;
    private entitiesData = new Map<string, PainterElementData>();
    private activeEntity!: PainterElementData;

    constructor(container: SVGElement) {
        this.layers = new Array(10);

        const parser = document.createElementNS(svgNamespaceURI, "g");
        container.appendChild(parser);
        this.parserLayer = parser;

        for (let i = 0; i < this.layers.length; ++i) {
            const layer = document.createElementNS(svgNamespaceURI, "g");
            container.appendChild(layer);
            this.layers[i] = layer;
        }
    }

    protected setActiveEntity(id: string) {
        let entity = this.entitiesData.get(id);
        if (!entity) {
            entity = {
                elements: [],
                intervals: [],
            };
            this.entitiesData.set(id, entity);
        }
        this.activeEntity = entity;
    }

    protected removeEntity(id: string) {
        const entity = this.entitiesData.get(id);
        if (entity) {
            for (const element of entity.elements) element.remove();
            for (const id of entity.intervals) clearInterval(id);
        }
    }

    addElement(layer: ArrayIndex<10>, element: string | SVGElement): SVGElement {
        if (typeof element == "string") {
            this.parserLayer.innerHTML = element;
            element = this.parserLayer.lastElementChild as SVGElement;
            this.parserLayer.innerHTML = "";
        }
        this.layers[layer].append(element);
        this.activeEntity.elements.push(element);
        return element;
    }

    setInterval(callback: () => void, ms: number): number {
        const id = setInterval(callback, ms);
        this.activeEntity.intervals.push(id);
        return id;
    }

    onAnimationFrame(callback: (elapsedSeconds: number) => void) {
        this.activeEntity.onAnimationFrame = callback;
    }

    protected animateEntities(elapsedSeconds: number) {
        for (const entity of this.entitiesData.values()) {
            entity.onAnimationFrame?.(elapsedSeconds);
        }
    }
}

export class Painter extends PainterCanvas {
    loop = true;

    svg: SVGSVGElement;
    svgCamera: SVGGElement;

    entities: PainterEntities;

    server: GameServer;
    pastGameDrawed?: Game;

    pastFrameSeconds: number;

    constructor(server: GameServer, svg: SVGSVGElement) {
        const camera = document.createElementNS(svgNamespaceURI, "g");
        svg.appendChild(camera);

        super(camera);

        this.svg = svg;
        this.svgCamera = camera;

        this.server = server;
        this.entities = {
            players: new Map(),
            lakes: new Map(),
            boxes: new Map(),
        };

        this.pastFrameSeconds = performance.now() / 1000;

        this.frame = this.frame.bind(this);
        requestAnimationFrame(this.frame);
    }

    private frame() {
        const now = performance.now() / 1000;
        const elapsedSeconds = now - this.pastFrameSeconds;
        this.pastFrameSeconds = now;

        if (this.pastGameDrawed != this.server.game) {
            const gameDif = new GameDif(this.pastGameDrawed, this.server.game);
            this.pastGameDrawed = this.server.game;

            this.updateCamera(gameDif);
            this.updateEntities(gameDif);
        }

        this.animateEntities(elapsedSeconds);

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

            this.svgCamera.setAttribute("transform",
                `scale(${scale}) translate(${offsetX} ${offsetY})`
            );
        }
    }

    private updateEntities(gameDif: GameDif) {
        // Players
        for (const [id, newPlayer] of gameDif.entities.players.added) {
            this.setActiveEntity("players" + id);

            const painter = new PlayerPainter(this, newPlayer);
            this.entities.players.set(id, painter);
        }

        for (const [id, updatedPlayer] of gameDif.entities.players.updated) {
            this.setActiveEntity("players" + id);
            this.entities.players.get(id)?.update(updatedPlayer);
        }

        // Boxes
        for (const [id, newBox] of gameDif.entities.boxes.added) {
            this.setActiveEntity("boxes" + id);

            const painter = new BoxPainter(this, newBox);
            this.entities.boxes.set(id, painter);
        }

        for (const [id, updatedBox] of gameDif.entities.boxes.updated) {
            this.setActiveEntity("boxes" + id);
            this.entities.boxes.get(id)?.update(updatedBox);
        }

        // Lakes
        for (const [id, updatedLake] of gameDif.entities.lakes.updated) {
            this.removeEntity("lakes" + id);
            gameDif.entities.lakes.added.push([id, updatedLake]);
        }
        for (const [id, newLake] of gameDif.entities.lakes.added) {
            this.setActiveEntity("lakes" + id);

            const lake = new LakePainter(this, newLake);
            this.entities.lakes.set(id, lake);
        }


        // Remove entities
        for (const type of ["players", "boxes", "lakes"] as const) {
            for (const id of gameDif.entities[type].removed) {
                this.removeEntity(type + id);
            }
        }
    }

    stop() {
        this.loop = true;
    }
}
