
/*export async function joinLobby(lobbyName: string) {
    const lobby = await joinLobby(serverUrl, lobbyName);
    return new HostConnection(lobby);
}*/

/** For testing */
/*export function joinLocalLobby(host: Host) {

    return new HostConnection();
}*/

interface Channel {
    send(data: any): void;
    onReceive?: (message: any) => void;
    onDisconnect?: () => void;
    close(): void;
}

export class Player {
    private game: Game;

    constructor(private dataChannel: Channel) {

    }

    getGame(): Game {
        return this.game;
    }

    playerAction(action: PlayerAction): void {

    }

    disconnect(): void {
        this.dataChannel.close();
    }
}
