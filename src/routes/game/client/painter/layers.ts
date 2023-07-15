import { Group, Layer } from "@pixi/layers";

export const group = {
    background: new Group(),
    lake: new Group(),
    playerParticles: new Group(),
    player: new Group(),
    box: new Group(),
};

export function createLayers(): Layer[] {
    const layers = [];

    for (const groupName in group) {
        const g = group[groupName as keyof typeof group]
        layers.push(new Layer(g));
    }

    return layers;
}
