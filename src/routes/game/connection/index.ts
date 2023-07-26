import type { Game, User } from "..";
import { GameDif } from "../dif";
import type { PlayerInput } from "../playerInput";
import { Simulator } from "../simulator";
import { NetworkDataChannel, NetworkGuest, NetworkHost } from "./network";

export type PlayerInputHandle = (input: PlayerInput) => void;

export class HostConnection {

	private guestsGame: Game;
	private guestsCount = 0;
	private guests: Map<number, NetworkDataChannel> = new Map();
	private reportIntervalId: number = 0;
	private net?: NetworkHost;

	simulator: Simulator;
	handleNewPlayer?(id: number, user: User): PlayerInputHandle;

	constructor(game: Game) {
		this.guestsGame = game;
		this.simulator = new Simulator(game);
	}

	async openParty(): Promise<string> {
		if (!this.net) {
			const net = await NetworkHost.createParty();
			if (!this.net) {
				this.net = net;
				this.net.handleGuest = this.handleGuest.bind(this);

				if (!this.reportIntervalId) {
					const reportRate = 30;
					this.reportIntervalId = window.setInterval(this.reportState.bind(this), 1000 / reportRate);
				}
			} else {
				net.destroy();
			}
		}

		return this.net.getPartyId() ?? "ERROR";
	}

	getPartyId(): string | undefined {
		return this.net?.getPartyId();
	}

	private async handleGuest(guest: NetworkDataChannel) {
		if (!this.handleNewPlayer) throw Error("No handelNewPlayer");

		const firstMessage = await guest.nextMessage() as FirstGuestMessage;

		const guestId = ++this.guestsCount;
		const playerInputHandle = this.handleNewPlayer(guestId, firstMessage.user);

		guest.handleMessages((rawMessage) => {
			const message = rawMessage as GuestMessage;
			playerInputHandle(message.input);
		});

		guest.onClose = () => {
			const dif = new GameDif();
			dif.entities.players.removed.push(guestId);
			this.simulator.updateGameDif(dif);
		};

		guest.send({ game: this.guestsGame, id: guestId } as FirstHostMessage);
		this.guests.set(guestId, guest);
	}

	private reportState() {
		const game = this.getGame();
		const gameDif = new GameDif(this.guestsGame, game);
		this.guestsGame = game;
		for (const guest of this.guests.values()) {
			guest.send({ gameDif } as HostMessage);
		}
	}

	getGame(): Game {
		this.simulator.simulate();
		return this.simulator.game;
	}

	destroy() {
		for (const guest of this.guests.values()) guest.destroy();
		this.net?.destroy();
		clearInterval(this.reportIntervalId);
	}
}

export class GuestConnection {

	private game: Game;
	simulator: Simulator;
	onClose?: () => void;

	private constructor(public net: NetworkGuest, firstMessage: FirstHostMessage) {
		this.game = firstMessage.game;
		this.simulator = new Simulator(this.game);

		net.handleMessages(this.handleMessage.bind(this));
		net.onClose = () => this.onClose?.();
	}

	static async joinParty(partyId: string, user: User): Promise<GuestConnection> {
		const net = await NetworkGuest.joinParty(partyId);
		net.send({ user } as FirstGuestMessage);
		const firstMessage = await net.nextMessage() as FirstHostMessage;
		return new GuestConnection(net, firstMessage);
	}

	private handleMessage(rawMessage: any) {
		const message = rawMessage as HostMessage;
		if (message.gameDif) {
			const gameDif = Object.assign(Object.create(GameDif.prototype), message.gameDif);
			this.game = gameDif.apply(this.game);
			this.simulator.updateGame(this.game);
		} else if (message.game) {
			this.game = message.game;
			this.simulator = new Simulator(this.game);
			// TODO! this.painter.startTransition();
		}
	}

	destroy(): void {
		this.net.destroy();
	}

	getGame(): Game {
		this.simulator.simulate();
		return this.simulator.game;
	}

	sendPlayerInput(input: PlayerInput): void {
		this.net.send({ input } as GuestMessage);
	}
}

interface FirstHostMessage {
	game: Game;
	id: number;
}

// Message send by the host
interface HostMessage {
	gameDif?: GameDif;
	game?: Game;
}

// Message send by the guest
interface GuestMessage {
	input: PlayerInput;
}

// Message send by the guest
interface FirstGuestMessage {
	user: User;
}