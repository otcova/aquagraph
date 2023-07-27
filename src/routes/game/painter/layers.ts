import { Container } from "pixi.js";

export class AppLayers {
    background = new Container();
    lake = new Container();

    bottomParticles = new Container();
    player = new Container();
    box = new Container();
    topParticles = new Container();

    frame = new Container();
    topFrame = new Container();
    
    ui = new Container();

    // Layers that are relative to the camera position.
    listCameraLayers(): Container[] {
        return [
            this.background,
            this.lake,

            this.bottomParticles,
            this.player,
            this.box,
            this.topParticles,
        ];
    }

    // Layers that are not relative to the camera position.
    listFrameLayers(): Container[] {
        return [
            this.frame,
            this.topFrame,
            
            this.ui,
        ];
    }

    destroy() {
        for (const container of this.listCameraLayers()) container.destroy();
        for (const container of this.listFrameLayers()) container.destroy();
    }
}