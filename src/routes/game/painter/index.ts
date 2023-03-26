import { Layer, Stage } from "@pixi/layers";
import { AmbientLight, diffuseGroup, lightGroup, normalGroup } from "@pixi/lights";
import { Application } from "pixi.js";
import type { Game } from "..";
import type { Vec2 } from "../../utils";
import { GameDif } from "../dif";
import type { GameServer } from "../server";
import { EntitiesPainter } from "./entities";

export class Painter {
    private server: GameServer;
    private app: Application;
    private previousGameDrawn?: Game;
    private entities: EntitiesPainter;
    private camera: Camera;

    constructor(server: GameServer, container: HTMLElement) {
        this.server = server;

        this.app = new Application({
            resizeTo: container,
            backgroundColor: 0x000000,
            resolution: Math.max(2, window.devicePixelRatio || 2),
            antialias: true,
            autoDensity: true,
        });

        this.app.stage = new Stage();
        this.app.stage.addChild(
            new Layer(diffuseGroup),
            new Layer(normalGroup),
            new Layer(lightGroup),
            new AmbientLight(0xffffff, 0.2),
        );

        this.camera = new Camera(this.app);
        this.entities = new EntitiesPainter(this.app.stage);

        container.appendChild(this.app.view as HTMLCanvasElement);
        this.app.ticker.add(this.update.bind(this));
    }

    private update() {
        if (this.previousGameDrawn != this.server.game) {
            const gameDif = new GameDif(this.previousGameDrawn, this.server.game);
            this.previousGameDrawn = this.server.game;

            this.camera.update(gameDif);
            this.entities.updateGame(gameDif);
        }

        this.entities.animate();
    }
}

class Camera {
    private topLeft!: Vec2;
    private bottomRight!: Vec2;

    constructor(private app: Application) {
        this.app.renderer.on("resize", this.updateTransform.bind(this));
    }

    update(gameDif: GameDif) {
        const camera = gameDif.camera;
        if (camera) {
            this.topLeft = camera.topLeft;
            this.bottomRight = camera.bottomRight;
            this.updateTransform();
        }
    }

    private updateTransform() {
        const width = this.bottomRight[0] - this.topLeft[0];
        const height = this.bottomRight[1] - this.topLeft[1];

        const frameWidth = this.app.screen.width;
        const frameHeight = this.app.screen.height;

        const scale = Math.min(frameWidth / width, frameHeight / height);

        const offsetX = (frameWidth / scale - width) / 2 - this.topLeft[0];
        const offsetY = (frameHeight / scale - height) / 2 - this.topLeft[1];

        this.app.stage.position.set(offsetX * scale, offsetY * scale);
        this.app.stage.scale.set(scale, scale);
    }
}
