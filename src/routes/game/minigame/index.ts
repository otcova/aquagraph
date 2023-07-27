import type { Game, Player, User } from "..";
import { GuestConnection, HostConnection, type PlayerInputHandle } from "../connection";
import { Painter } from "../painter";
import { PlayerIn, type PlayerInput } from "../playerInput";
import { Simulator } from "../simulator";
import { Lobby } from "./lobby";
import { Race } from "./race";

interface MinigameConstructor {
	new(manager: MinigameManager, seed: number): MinigameTemplate;
	initialGame(): Game;
}

export type MinigameName = "lobby" | "race";
export type MinigameInstanceId = {
	name: MinigameName,
	seed: number,
};

const minigames = new Map<MinigameName, MinigameConstructor>([
	["lobby", Lobby],
	["race", Race],
]);

export class MinigameManager {

	host?: HostConnection;
	guest?: GuestConnection;

	painter: Painter;
	playerInput: PlayerIn;

	minigame: MinigameTemplate;
	handlePlayerInput!: PlayerInputHandle;

	constructor(canvasContainer: HTMLElement, public user: User) {
		this.painter = new Painter(canvasContainer);

		this.minigame = new Lobby(this);
		this.setupHost(Lobby.initialGame());

		this.painter.start(this);
		this.playerInput = new PlayerIn(this);
	}

	setupHost(game: Game) {
		if (!this.minigame) return;
		if (this.host) {
			this.host.destroy();
			this.host = undefined;
		}
		if (this.guest) {
			this.guest.destroy();
			this.guest = undefined;
		}

		this.host = new HostConnection(game);
		this.host.handleNewPlayer = (...args) => this.handleNewPlayer(...args);

		this.host.simulator.beforeStep = dt => this.minigame.update(dt);
		this.handlePlayerInput = this.handleNewPlayer(0, this.user);

		this.painter.reset();
	}

	async setupGuest(partyId: string) {
		if (this.guest) return;

		const guest = await GuestConnection.joinParty(partyId, this.user);
		guest.onClose = () => {
			this.minigame.destroy();

			this.setupHost(Lobby.initialGame());
			this.minigame = new Lobby(this);
		};
		guest.onMinigameChange = (minigameId) => {
			this.changeMinigame(minigameId);
		};

		if (this.guest) {
			guest.destroy();
			return;
		}

		if (this.host) {
			this.host.destroy();
			this.host = undefined;
		}

		this.painter.reset();
		this.guest = guest;
		guest.simulator.beforeStep = dt => this.minigame.update(dt);
		this.handlePlayerInput = guest.sendPlayerInput.bind(guest);
	}

	protected handleNewPlayer(id: number, user: User): PlayerInputHandle {
		if (!this.host) throw Error("Only a host can add a player");

		const player = this.minigame.spawnPlayer(user);
		const simulator = this.host.simulator;
		simulator.entities.addPlayer(id, player);

		return (input: PlayerInput) => {
			const player = simulator.entities.players.get(id);
			if (!player) throw Error("Player Not found");
			player.handleInput(input);
		};
	}

	changeMinigame(minigameId: MinigameInstanceId | MinigameName) {
		if (typeof minigameId == "string") {
			minigameId = {
				name: minigameId,
				seed: Math.floor(Math.random() * 1000),
			};
		}

		const Minigame = minigames.get(minigameId.name);
		if (!Minigame) throw Error("Invalid minigame: " + minigameId.name);

		if (this.host) this.host.changeGame(minigameId, Minigame.initialGame());
		else if (this.guest) this.guest.changeGame(Minigame.initialGame());

		this.painter.startTransition();
		this.minigame.destroy();
		this.minigame = new Minigame(this, minigameId.seed);

		this.getSimulator().beforeStep = dt => this.minigame.update(dt);
	}

	getSimulator(): Simulator {
		if (this.host) return this.host.simulator;
		if (this.guest) return this.guest.simulator;
		throw Error("Not a Host or a Guest");
	}

	getGame(): Game {
		if (this.host) return this.host.getGame();
		if (this.guest) return this.guest.getGame();
		throw Error("Not a Host or a Guest");
	}

	destroy() {
		this.minigame.destroy();
		this.host?.destroy();
		this.guest?.destroy();
		this.painter.destroy();
	}
}

export interface MinigameTemplate {
	spawnPlayer(user: User): Player;
	update(deltaTime: number): void;
	destroy(): void;
}
