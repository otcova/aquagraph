import { Layer, Stage } from "@pixi/layers";
import { AmbientLight, diffuseGroup, lightGroup, normalGroup } from "@pixi/lights";
import { Application, Container } from "pixi.js";
import type { Game } from "../..";
import type { Vec2 } from "../../../utils";
import { GameDif } from "../../dif";
import { Background } from "./background";
import { EntitiesPainter } from "./entities";
import { createLayers } from "./layers";
import type { HostConnection } from "../../host";

export class Painter {
    private host: HostConnection;
    private previousGameDrawn?: Game;
    private app: Application;
    private entities: EntitiesPainter;
    private camera: Camera;
    private background: Background;
    private pastTime?: number;

    constructor(server: HostConnection, container: HTMLElement) {
        this.host = server;

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
            ...createLayers(),
            new AmbientLight(0xffffff, 0.1),
        );

        this.background = new Background(this.app.stage);
        this.camera = new Camera(this.app);
        this.entities = new EntitiesPainter(this.camera.container);

        container.appendChild(this.app.view as HTMLCanvasElement);
        this.app.ticker.add(this.update.bind(this));
    }

    private update() {
        const now = performance.now() / 1000;

        if (this.pastTime) {
            const stepTime = now - this.pastTime;

            const currentGame = this.host.getGame();
            if (this.previousGameDrawn != currentGame) {
                const gameDif = new GameDif(this.previousGameDrawn, currentGame);
                this.previousGameDrawn = currentGame;

                this.camera.update(gameDif);
                this.entities.updateGame(gameDif);
                for (const effect of gameDif.effects) console.log(effect);
            }


            this.entities.animate(stepTime);
        }

        this.pastTime = now;
    }

    destroy() {
        this.app.destroy(true);
    }
}

class Camera {
    private topLeft!: Vec2;
    private bottomRight!: Vec2;
    container: Container;

    constructor(private app: Application) {
        this.app.renderer.on("resize", this.updateTransform.bind(this));

        this.container = new Container();
        this.app.stage.addChild(this.container);
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

        this.container.position.set(offsetX * scale, offsetY * scale);
        this.container.scale.set(scale, scale);
    }
}
