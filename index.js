import 'pixi'
import 'p2'
import 'phaser'

// Define motion constants
const ROTATION_SPEED = 180; // degrees/second
const ACCELERATION = 200; // pixels/second/second
const MAX_SPEED = 250; // pixels/second

const gameState = {
	preload() {
		game.load.image('bg', 'resources/nebula_blue.png')
		game.load.image('ship', 'resources/door_new.png')
		game.load.audio('shipSound', 'resources/ship_sound.mp3')
	},
	create() {
		//  We're going to be using physics, so enable the Arcade Physics system
		game.physics.startSystem(Phaser.Physics.ARCADE)

		//  A simple background for our game
		game.add.sprite(0, 0, 'bg')

		// The player and its settings
		const doorShip = game.add.sprite(game.world.width / 2, game.world.height / 2, 'ship')	
		const cursors = game.input.keyboard.createCursorKeys()
		const shipSound = game.add.audio('shipSound')

		doorShip.anchor.setTo(0.5, 0.5)
		doorShip.angle = -90; // Point the ship up
		//  We need to enable physics on the player
		game.physics.enable(doorShip, Phaser.Physics.ARCADE)
		// Set maximum velocity
		doorShip.body.maxVelocity.setTo(MAX_SPEED, MAX_SPEED) // x, y

		cursors.up.onDown = new Phaser.Signal()
		cursors.up.onDown.add(function() {	
			shipSound.play()
		})

		cursors.up.onUp = new Phaser.Signal()
		cursors.up.onUp.add(function() {
			shipSound.stop()
		})
	
		this.doorShip = doorShip
		this.shipSound = shipSound
		this.cursors = cursors
		this.game = game
	},
	update() {
		// Keep the ship on the screen
		if (this.doorShip.x > this.game.width) this.doorShip.x = 0;
		if (this.doorShip.x < 0) this.doorShip.x = this.game.width;
		if (this.doorShip.y > this.game.height) this.doorShip.y = 0;
		if (this.doorShip.y < 0) this.doorShip.y = this.game.height;

		if (this.cursors.left.isDown) {
			// If the LEFT key is down, rotate left
			this.doorShip.body.angularVelocity = -ROTATION_SPEED;
		} else if (this.cursors.right.isDown) {
			// If the RIGHT key is down, rotate right
			this.doorShip.body.angularVelocity = ROTATION_SPEED;
		} else {
			// Stop rotating
			this.doorShip.body.angularVelocity = 0;
		}

		if (this.cursors.up.isDown) {
			// If the UP key is down, thrust
			// Calculate acceleration vector based on this.angle and this.ACCELERATION
			this.doorShip.body.acceleration.x = Math.cos(this.doorShip.rotation) * ACCELERATION;
			this.doorShip.body.acceleration.y = Math.sin(this.doorShip.rotation) * ACCELERATION;
			// Show the frame from the spritesheet with the engine on
			// this.doorShip.frame = 1;
		} else {
			// Otherwise, stop thrusting
			this.doorShip.body.acceleration.setTo(0, 0)
			// Show the frame from the spritesheet with the engine off
			// this.doorShip.frame = 0;
		}
	}
}

const game = new Phaser.Game(800, 600, Phaser.AUTO, '', gameState)
