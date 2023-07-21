import { Layer, Stage } from "@pixi/layers";
import { AmbientLight, diffuseGroup, lightGroup, normalGroup } from "@pixi/lights";
import { Application, Container, Graphics } from "pixi.js";
import type { Game } from "../..";
import { type Vec2 } from "../../../utils";
import { GameDif } from "../../dif";
import { Background } from "./background";
import { EntitiesPainter } from "./entities";
import type { HostConnection } from "../../host";
import { AppContainers } from "./containers";

export class Painter {
    private host: HostConnection;
    private previousGameDrawn?: Game;
    private app: Application;
    private background: Background;
    private pastTime?: number;
    private containers: AppContainers;

    private entities: EntitiesPainter;
    private screenFrame: ScreenFrame;
    private camera: Camera;

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

        const diffuseLayer = new Layer(diffuseGroup);
        const normalLayer = new Layer(normalGroup);
        const lightLayer = new Layer(lightGroup);

        this.app.stage.addChild(
            diffuseLayer,
            normalLayer,
            lightLayer,
            new AmbientLight(0xffffff, .2),
        );

        this.containers = new AppContainers();
        diffuseLayer.addChild(...this.containers.listAll());

        this.background = new Background(this.containers);
        this.camera = new Camera(this.app);
        this.entities = new EntitiesPainter(this.containers);
        this.screenFrame = new ScreenFrame(this.containers);

        container.appendChild(this.app.view as HTMLCanvasElement);
        this.app.ticker.add(this.update.bind(this));
    }

    private update() {
        const now = performance.now() / 1000;

        if (this.pastTime) {
            const stepTime = now - this.pastTime;

            const currentGame = this.host.getGame();
            if (currentGame && this.previousGameDrawn != currentGame) {
                const gameDif = new GameDif(this.previousGameDrawn, currentGame);
                this.previousGameDrawn = currentGame;

                this.camera.update(gameDif);
                this.background.update(gameDif);
                this.screenFrame.update(gameDif);
                this.entities.updateGame(gameDif);
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
        const margin = 0;

        const width = this.bottomRight[0] - this.topLeft[0] + margin * 2;
        const height = this.bottomRight[1] - this.topLeft[1] + margin * 2;

        const frameWidth = this.app.screen.width;
        const frameHeight = this.app.screen.height;

        const scale = Math.min(frameWidth / width, frameHeight / height);

        const offsetX = (frameWidth / scale - width) / 2 - this.topLeft[0] + margin;
        const offsetY = (frameHeight / scale - height) / 2 - this.topLeft[1] + margin;

        this.app.stage.position.set(offsetX * scale, offsetY * scale);
        this.app.stage.scale.set(scale, scale);
    }
}


class ScreenFrame {
    private frame: Graphics;

    constructor(appContainers: AppContainers) {
        this.frame = new Graphics();
        appContainers.screenFrame.addChild(this.frame);
    }

    update(gameDif: GameDif) {
        const camera = gameDif.camera;
        if (camera) {
            const size = 10000;
            
            this.frame.clear();
            this.frame.beginFill(0xFFFFFF);
            this.frame.drawRect(camera.topLeft[0] - size, camera.topLeft[1], size, size); // left
            this.frame.drawRect(camera.bottomRight[0], camera.topLeft[1], size, size); // right
            this.frame.drawRect(camera.topLeft[0] - 100, camera.topLeft[1] - size, size, size); // top
            this.frame.drawRect(camera.topLeft[0], camera.bottomRight[1], size, size); // bottom
        }
    }
}