import type { Game, Player, User } from "..";
import { GuestConnection, HostConnection, type PlayerInputHandle } from "../connection";
import { Painter } from "../painter";
import { PlayerIn, type PlayerInput } from "../playerInput";
import { Simulator } from "../simulator";
import { Lobby } from "./lobby";
import { Race } from "./race";

interface MinigameConstructor {
	new(manager: MinigameManager, seed: number): MinigameTemplate;
	initialGame(seed: number): Game;
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
			if (!this.host) throw Error("Only a host can add handle player input");
			const player = this.host.simulator.entities.players.get(id);
			if (!player) throw Error("Player Not found");
			player.handleInput(input);
		};
	}

	changeMinigame(minigameId: MinigameInstanceId | MinigameName) {
		const players = this.getGame().entities.players;

		if (typeof minigameId == "string") {
			minigameId = {
				name: minigameId,
				seed: Math.floor(Math.random() * 1000),
			};
		}

		const Minigame = minigames.get(minigameId.name);
		if (!Minigame) throw Error("Invalid minigame: " + minigameId.name);

		const game = Minigame.initialGame(minigameId.seed);
		if (this.host) this.host.changeGame(minigameId, game);
		else if (this.guest) this.guest.changeGame(game);

		this.painter.startTransition();
		this.minigame.destroy();
		this.minigame = new Minigame(this, minigameId.seed);
		
		const simulator = this.getSimulator();
		
		for (const [id, gamePlayer] of players) {
			const player = this.minigame.spawnPlayer(gamePlayer.user);
			simulator.entities.addPlayer(id, player);
		}

		simulator.beforeStep = dt => this.minigame.update(dt);
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
