import type Box2D from "box2dweb";
import type { Player } from "../../..";
import { PlayingPlayer } from "./playingPlayer";
import type { PlayerInput } from "../../../playerInput";

export class PlayerSimulator {

	private playingPlayer?: PlayingPlayer;
	private pastPlayer: Player;

	constructor(private world: Box2D.Dynamics.b2World, player: Player) {
		this.pastPlayer = player;
		this.playingPlayer = new PlayingPlayer(this.world, player);
	}

	update(player: Player) {
		if (player.state == "playing") {
			if (!this.playingPlayer) {
				this.playingPlayer = new PlayingPlayer(this.world, player);
			} else {
				this.playingPlayer.update(player);
			}
		} else if (player.state == "death") {
			this.playingPlayer?.destroy();
			this.playingPlayer = undefined;
		}
		this.pastPlayer = player;
	}

	handleInput(input: PlayerInput) {
		this.playingPlayer?.handleInput(input);
	}

	step(timeStep: number) {
		if (this.playingPlayer) {
			const alive = this.playingPlayer?.step(timeStep);
			if (!alive) {
				this.pastPlayer = this.playingPlayer.recordState();
				this.playingPlayer?.destroy();
				this.playingPlayer = undefined;
			}
		}
	}

	destroy() {
		this.playingPlayer?.destroy();
	}

	recordState(): Player {
		return this.playingPlayer?.recordState() || this.pastPlayer;
	}
}
