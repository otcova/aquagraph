
import type { Game } from "..";
export * as createGameServer from "./game_creation";

/**
 * Comunicates with all the other players to fetch the frames
 * and send the player input.
 * Every player will have it's own GameServer.
*/
export interface GameServer {
    game: Game;
    destroy(): void;
}

