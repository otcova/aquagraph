import type { EntityId, Game, User } from "..";
import type { PlayerInput } from "../client/player";

export interface Minigame {
	syncState(game: Game): void;
	getGame(): Game;
	spawnPlayer(user: User): EntityId;
	playerInput(playerId: EntityId, input: PlayerInput): void;
}