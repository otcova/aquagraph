import Alea from "alea";
import type { MinigameManager, MinigameTemplate } from ".";
import type { Camera, Game, Player, User } from "..";
import { randomRange, type Vec2 } from "../../utils";
import { GameDif } from "../dif";
import { createFrameBoxes } from "../game_creation";
import { createRandomBlob } from "../game_creation/lake";
import type { UIButton } from "../painter/ui/button";
import type { UIText } from "../painter/ui/text";
import type { UITextInput } from "../painter/ui/textInput";
import { randomSkin } from "../skins/player";

export class Lobby implements MinigameTemplate {

	private ui: {
		nameInput: UITextInput;
		partyIdInput: UITextInput;
		partyIdText: UIText;
		joinPublicLobbyButton: UIButton;

		playButton: UIButton;
		joinLobbyButton: UIButton;
		connectButton: UIButton;
		createLobbyButton: UIButton;
		exitButton: UIButton;
	};

	constructor(private manager: MinigameManager) {
		const ui = manager.painter.ui;

		this.ui = {
			nameInput: ui.createTextInput([-20, -10]),
			partyIdInput: ui.createTextInput([-20, -2]),
			partyIdText: ui.createText([-20, -2]),

			joinPublicLobbyButton: ui.createButton([-20, -2], "Join Public Lobby"),
			playButton: ui.createButton([-20, 4], "Play"),
			joinLobbyButton: ui.createButton([-20, 4], "Join Lobby"),
			connectButton: ui.createButton([-20, 4], "Connect"),
			createLobbyButton: ui.createButton([-20, 10], "Create Lobby"),
			exitButton: ui.createButton([-20, 10], "Exit"),
		};
		this.ui.nameInput.setPlaceHolder("Name");

		this.ui.partyIdInput.setPlaceHolder("Party ID?");
		this.ui.partyIdInput.toUpperCase = true;
		this.ui.partyIdInput.onEnter = () => this.setConnecting();

		this.ui.joinPublicLobbyButton.onClick = () => this.setJoinPublicLobby();
		this.ui.playButton.onClick = () => this.manager.changeMinigame("race");
		this.ui.joinLobbyButton.onClick = () => this.setJoinLobby();
		this.ui.connectButton.onClick = () => this.setConnecting();
		this.ui.createLobbyButton.onClick = () => this.setCreatingLobby();
		this.ui.exitButton.onClick = () => this.setMainScreen();

		this.setMainScreen();
	}

	static initialGame(seed: number = Math.random()): Game {
		const rnd = Alea(seed).next;

		const camera: Camera = {
			position: [0, 0],
			size: [110 * 1.8, 110],
		};
		const frameBoxes = createFrameBoxes(rnd, [100, 100 * camera.size[1] / camera.size[0]]);

		frameBoxes.push({
			color: 0x432612,
			position: [-20, 0],
			size: [20, 28],
		});

		const game: Game = {
			camera,
			entities: {
				players: new Map(),
				boxes: new Map([[0, {
					angle: 0.4,
					position: [60, -10],
					skin: { index: 1 },
					lamps: [[5, 13]],
				}]]),
				lakes: new Map([[0, {
					position: [30, -20],
					vertices: createRandomBlob(5),
				}], [1, {
					position: [50, 30],
					vertices: createRandomBlob(4),
				}]]),
				frameBoxes: new Map(frameBoxes.map((v, i) => [i, v])),
			},
			time: 0,
			light: 0.5,
		};

		return game;
	}

	private applyUI(effect: (ui: UIButton | UIText | UITextInput) => void) {
		for (const uiName in this.ui) {
			effect(this.ui[uiName as keyof typeof this.ui]);
		}
	}

	private setMainScreen() {
		this.applyUI(ui => ui.hide());

		this.ui.nameInput.show();
		this.ui.joinLobbyButton.show();
		this.ui.joinPublicLobbyButton.show();
		this.ui.createLobbyButton.show();

		this.manager.setupHost(Lobby.initialGame());
	}

	private setLobbyHost() {
		if (!this.manager.host) return this.setMainScreen();
		const id = this.manager.host.getPartyId();
		if (!id) this.setMainScreen();

		this.applyUI(ui => ui.hide());

		this.ui.nameInput.show();
		this.ui.partyIdText.show();
		this.ui.playButton.show();
		this.ui.exitButton.show();

		this.ui.partyIdText.updateText("Party ID:  " + id);
	}

	private async setCreatingLobby() {
		this.ui.partyIdInput.hide();
		this.ui.joinLobbyButton.hide();
		this.ui.joinPublicLobbyButton.hide();
		this.ui.createLobbyButton.hide();
		this.ui.connectButton.hide();

		this.ui.nameInput.show();
		this.ui.exitButton.show();
		this.ui.partyIdText.show();

		this.ui.partyIdText.updateText("Party ID:  ...");

		try {
			if (!this.manager.host) this.manager.setupHost(Lobby.initialGame());
			if (!this.manager.host) return this.setMainScreen();

			await this.manager.host.openParty();
			this.setLobbyHost();
		} catch (_) {
			this.setMainScreen();
		}
	}

	private setJoinLobby() {
		this.applyUI(ui => ui.hide());

		this.ui.nameInput.show();
		this.ui.connectButton.show();
		this.ui.exitButton.show();
		this.ui.partyIdInput.show();
		setTimeout(() => this.ui.partyIdInput.focus());
	}

	private setJoinPublicLobby() {
		this.applyUI(ui => ui.hide());

		this.ui.nameInput.show();
		this.ui.exitButton.show();
		this.ui.partyIdText.show();

		this.ui.partyIdText.updateText(":(");
	}

	private async setConnecting() {
		if (!this.ui.partyIdInput.text) return;

		this.applyUI(ui => ui.hide());

		this.ui.nameInput.show();
		this.ui.partyIdText.show();
		this.ui.partyIdText.updateText("Connecting ...");

		try {
			await this.manager.setupGuest(this.ui.partyIdInput.text);
			this.setLobbyGuest();

		} catch (_) {
			this.setJoinLobby();
		}
	}

	private setLobbyGuest() {
		if (!this.manager.guest) return this.setMainScreen();
		const id = this.manager.guest.getPartyId();

		this.applyUI(ui => ui.hide());

		this.ui.nameInput.show();
		this.ui.exitButton.show();
		this.ui.partyIdText.show();

		this.ui.partyIdText.updateText("Party ID:  " + id);
	}

	spawnPlayer(user: User): Player {
		return {
			user,
			state: "playing",
			skin: randomSkin(),
			swimming: false,
			position: this.newSpawnPos(),
			velocity: [0, 0],
			angle: Math.random() * Math.PI * 2,
			angularVelocity: 0,
			dashPower: 1,
			dashEffects: [],
			deathEffects: [],
			move: [0, 0],
		} as Player;
	}

	update(deltaTime: number) {
		const simulator = this.manager.getSimulator();
		const dif = new GameDif();
		const game = simulator.game;

		// Respawn everyone
		for (const [id, player] of game.entities.players) {
			if (player.state == "death") {
				player.position = this.newSpawnPos();
				player.velocity = [0, 0];
				player.angularVelocity = 0;
				player.move = [0, 0];
				player.state = "playing";
				dif.entities.players.updated.push([id, player]);
			}
		}

		simulator.updateGameDif(dif);
	}

	private newSpawnPos(): Vec2 {
		const radious = 10;
		return [30 + randomRange(-radious, radious), -20 + randomRange(-radious, radious)];
	}

	destroy() {
		this.applyUI(ui => ui.destroy());
	}
};