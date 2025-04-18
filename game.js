const gameState = {
  score: 0,
};

class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: "StartScene" });
  }

  create() {
    this.add.text(95, 250, "Click to Start!", {
      fontSize: "30px",
      fill: "#000000",
    });
    this.input.on("pointerdown", () => {
      this.scene.stop("StarScene");
      this.scene.start("GameScene");
    });
  }
}

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.load.image(
      "bug1",
      "https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/bug_1.png"
    );
    this.load.image(
      "bug2",
      "https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/bug_2.png"
    );
    this.load.image(
      "bug3",
      "https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/bug_3.png"
    );
    this.load.image(
      "platform",
      "https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/platform.png"
    );
    this.load.image(
      "codey",
      "https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/codey.png"
    );
  }

  create() {
    gameState.player = this.physics.add.sprite(225, 450, "codey").setScale(0.5);

    const platforms = this.physics.add.staticGroup();

    platforms.create(225, 490, "platform").setScale(1, 0.3).refreshBody();

    gameState.scoreText = this.add.text(195, 485, "Score: 0", {
      fontSize: "15px",
      fill: "#000000",
    });

    gameState.player.setCollideWorldBounds(true);

    this.physics.add.collider(gameState.player, platforms);

    gameState.cursors = this.input.keyboard.createCursorKeys();

    const bugs = this.physics.add.group();

    const bugGen = () => {
      const xCoord = Math.random() * 640;
      const bug = Math.floor(Math.random() * 3);
      if (bug == 0) {
        bugs.create(xCoord, 10, "bug1");
      } else if (bug == 1) {
        bugs.create(xCoord, 10, "bug2");
      } else {
        bugs.create(xCoord, 10, "bug3");
      }
    };

    const bugGenLoop = this.time.addEvent({
      delay: 100,
      callback: bugGen,
      callbackScope: this,
      loop: true,
    });

    this.physics.add.collider(bugs, platforms, (bug) => {
      bug.destroy();
      gameState.score += 10;
      gameState.scoreText.setText(`Score: ${gameState.score}`);
    });

    this.physics.add.collider(gameState.player, bugs, () => {
      bugGenLoop.destroy();
      this.physics.pause();
      this.add.text(180, 250, "Game Over", {
        fontSize: "15px",
        fill: "#000000",
      });
      this.add.text(152, 270, "Click to Restart", {
        fontSize: "15px",
        fill: "#000000",
      });

      this.input.on("pointerup", () => {
        gameState.score = 0;
        this.scene.restart();
      });
    });
  }

  update() {
    if (gameState.cursors.left.isDown) {
      gameState.player.setVelocityX(-160);
    } else if (gameState.cursors.right.isDown) {
      gameState.player.setVelocityX(160);
    } else {
      gameState.player.setVelocityX(0);
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 450,
  height: 500,
  backgroundColor: "b9eaff",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
      enableBody: true,
    },
  },
  scene: [StartScene, GameScene],
};

const game = new Phaser.Game(config);
