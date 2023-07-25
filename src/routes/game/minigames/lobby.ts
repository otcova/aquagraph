import { MinigameHost } from ".";
import type { Camera, Game, Player, User } from "..";
import { randomRange, type Vec2 } from "../../utils";
import type { UI } from "../client/painter/ui";
import type { UIButton } from "../client/painter/ui/button";
import type { UIText } from "../client/painter/ui/text";
import type { UITextInput } from "../client/painter/ui/textInput";
import { GameDif } from "../dif";
import { createFrameBoxes } from "../game_creation";
import { createRandomBlob } from "../game_creation/lake";
import { randomSkin } from "../skins/player";

export class Lobby extends MinigameHost {

	private nameInput: UITextInput;
	private partyIdInput: UITextInput;
	private partyIdText: UIText;
	private joinPublicLobbyButton: UIButton;
	private joinLobbyButton: UIButton;
	private connectButton: UIButton;
	private createLobbyButton: UIButton;
	private exitLobbyButton: UIButton;

	constructor(user: User, ui: UI) {
		super(Lobby.initialGame(), user);

		this.nameInput = ui.createTextInput([-20, -10]);
		this.nameInput.setPlaceHolder("Name");

		this.partyIdInput = ui.createTextInput([-20, -2]);
		this.partyIdInput.setPlaceHolder("Party ID?");

		this.partyIdText = ui.createText([-20, 4]);

		this.joinPublicLobbyButton = ui.createButton([-20, -2], "Join Public Lobby");
		this.joinPublicLobbyButton.onClick = () => this.setJoinPublicLobby();

		this.joinLobbyButton = ui.createButton([-20, 4], "Join Lobby");
		this.joinLobbyButton.onClick = () => this.setJoinLobby();
		
		this.connectButton = ui.createButton([-20, 4], "Connect");
		this.connectButton.onClick = async () => {
			if (!this.partyIdInput.text) return;
			this.connectButton.hide();
			this.partyIdText.show();
			this.partyIdText.updateText("Connecting ...");
		};
		
		this.createLobbyButton = ui.createButton([-20, 10], "Create Lobby");
		this.createLobbyButton.onClick = () => this.setCreatingLobby();

		this.exitLobbyButton = ui.createButton([-20, 10], "Exit");
		this.exitLobbyButton.onClick = () => this.setMainScreen();

		this.setMainScreen();
	}
	
	protected static initialGame(): Game {
		const camera: Camera = {
			position: [0, 0],
			size: [110 * 1.8, 110],
		};
		const frameBoxes = createFrameBoxes([100, 100 * camera.size[1] / camera.size[0]]);

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
					lamps: [[5, 15]],
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

	private setMainScreen() {
		this.exitLobbyButton.hide();
		this.partyIdText.hide();
		this.partyIdInput.hide();
		this.connectButton.hide();

		this.joinLobbyButton.show();
		this.joinPublicLobbyButton.show();
		this.createLobbyButton.show();
	}

	private setLobbyHost() {
		if (!this.host) return this.setMainScreen();
		const id = this.host.getPartyId();
		if (!id) this.setMainScreen();
		
		this.partyIdInput.hide();
		this.joinLobbyButton.hide();
		this.joinPublicLobbyButton.hide();
		this.createLobbyButton.hide();
		this.connectButton.hide();

		this.exitLobbyButton.show();
		this.partyIdText.show();

		this.partyIdText.updateText("Party ID:  " + id);
	}

	private async setCreatingLobby() {
		this.partyIdInput.hide();
		this.joinLobbyButton.hide();
		this.joinPublicLobbyButton.hide();
		this.createLobbyButton.hide();
		this.connectButton.hide();

		this.exitLobbyButton.show();
		this.partyIdText.show();

		this.partyIdText.updateText("Party ID:  ...");
		
		if (!this.host) this.setupHost(Lobby.initialGame());
		if (!this.host) return this.setMainScreen();
		
		await this.host.openParty();
		this.setLobbyHost();
	}

	private setJoinLobby() {
		this.partyIdText.hide();
		this.joinLobbyButton.hide();
		this.joinPublicLobbyButton.hide();
		this.createLobbyButton.hide();
		
		this.connectButton.show();
		this.exitLobbyButton.show();
		this.partyIdInput.show();
	}

	private setJoinPublicLobby() {
		this.joinLobbyButton.hide();
		this.joinPublicLobbyButton.hide();
		this.createLobbyButton.hide();
		this.connectButton.hide();

		this.exitLobbyButton.show();
		this.partyIdText.show();
		
		this.partyIdText.updateText(":(");
	}

	private setLobbyGuest() {

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
		const simulator = this.getSimulator();
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
		this.nameInput.destroy();
		this.partyIdText.destroy();
		this.joinPublicLobbyButton.destroy();
		this.joinLobbyButton.destroy();
		this.createLobbyButton.destroy();
		this.exitLobbyButton.destroy();
	}
};