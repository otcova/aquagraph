import type { Game, User } from "..";
import type { PlayerAction } from "../client/player";
import { gameFrameExample } from "../game_creation";
import { Simulator } from "../simulator";
import { Player } from "./player";

export class Host {

    private simulator: Simulator;
    private clients: Channel[] = [];

    constructor() {
        const game = gameFrameExample();
        this.simulator = new Simulator(game);
    }

    getGame() {
        this.simulator.simulate();
        return this.simulator.game;
    }

    disconnect(): void {
        for (const client of this.clients) {
            client.close();
        }
    }

    /// The current game state is sent to the clients
    private syncClientsGame() {
        for (const client of this.clients) {
            client.send(this.simulator.game);
        }
    }

    connectClient(clientChannel: Channel) {
        this.clients.push(clientChannel);
    }
}

class ClientHandle {
    channel: Channel;
}

interface Channel {
    send(data: any): void;
    onReceive?: (message: any) => void;
    onDisconnect?: () => void;
    close(): void;
}

