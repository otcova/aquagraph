import { Layer, Stage } from "@pixi/layers";
import { AmbientLight, diffuseGroup, lightGroup, normalGroup } from "@pixi/lights";
import { Application, Container } from "pixi.js";
import type { Camera, Game } from "../..";
import { GameDif } from "../../dif";
import type { HostConnection } from "../../host";
import { Background } from "./background";
import { CameraFrame } from "./cameraFrame";
import { EntitiesPainter } from "./entities";
import { AppLayers } from "./layers";

export class Painter {
    private host: HostConnection;
    private previousGameDrawn?: Game;
    private background: Background;
    private pastTime?: number;

    private entities: EntitiesPainter;
    private cameraFrame: CameraFrame;
    private camera: CameraContainer;

    diffuseLayer: Layer;
    app: Application;
    ambientLightBrightness = 0.4;
    layers = new AppLayers();

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

        this.diffuseLayer = new Layer(diffuseGroup);
        const normalLayer = new Layer(normalGroup);
        const lightLayer = new Layer(lightGroup);

        this.app.stage.addChild(
            this.diffuseLayer,
            normalLayer,
            lightLayer,
            new AmbientLight(0xffffff, this.ambientLightBrightness),
        );
        

        this.background = new Background(this);
        this.camera = new CameraContainer(this);
        this.entities = new EntitiesPainter(this);
        this.cameraFrame = new CameraFrame(this);
        
        this.camera.container.addChild(...this.layers.listCameraLayers());
        this.diffuseLayer.addChild(...this.layers.listFrameLayers());
        

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
                this.cameraFrame.update(gameDif);
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

class CameraContainer {
    private camera?: Camera;
    container = new Container();

    constructor(private painter: Painter) {
        painter.diffuseLayer.addChild(this.container);
        this.painter.app.renderer.on("resize", this.update.bind(this));
    }

    update(gameDif?: GameDif) {
        if (gameDif && gameDif.camera) this.camera = gameDif.camera;
        if (this.camera) {

            const margin = 1;
            
            const frameWidth = this.painter.app.screen.width;
            const frameHeight = this.painter.app.screen.height;
            
            const uiWidth = 100 + margin * 2;
            const uiHeight = 100 * this.camera.size[1] / this.camera.size[0] + margin * 2;
            const uiScale = Math.min(frameWidth / uiWidth, frameHeight / uiHeight);
            
            this.painter.app.stage.position.set(frameWidth / 2, frameHeight / 2);
            this.painter.app.stage.scale.set(uiScale);

            const scale = 100 / this.camera.size[0];
            this.container.position.set(-this.camera.position[0] * scale, -this.camera.position[1] * scale);
            this.container.scale.set(scale);

            
        }
    }
}
