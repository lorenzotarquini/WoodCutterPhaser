//Now i config my game
var config = {
    type: Phaser.AUTO,

    physics: { //type of physics
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scale: {
        parent: 'gamearea',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600,
    },
    scene: { //functions i'll use
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config); //init game


var point = 0;
var scoreText;
var lastKey;

function preload (){ //loading all i need
  this.load.image('sky', 'assets/stage/sky.png');
  this.load.image('ground', 'assets/stage/platform.png');
  this.load.image('score', 'assets/stage/score.png');
  this.load.spritesheet('dude','assets/player/walk_jump.png',{ frameWidth: 48, frameHeight: 48 });
}

function create (){

  this.add.image(400, 300, 'sky'); //paste image as bg

  platforms = this.physics.add.staticGroup(); //making group of grounds

  platforms.create(400, 568, 'ground').setScale(2).refreshBody();  //floor

  platforms.create(600, 400, 'ground'); //3 up floors
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');

  player = this.physics.add.sprite(100, 450, 'dude'); //adding my player
  player.setFrame(6);

  player.setBounce(0.2); //when it lands after jumping it will bounce ever so slightly
  player.setCollideWorldBounds(true); //area limit


  // SPRITE ANIMATIONS
  this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
  });

  this.anims.create({
      key: 'stopRight',
      frames: [ { key: 'dude', frame: 6 } ],
      frameRate: 20
  });

  this.anims.create({
      key: 'stopLeft',
      frames: [ { key: 'dude', frame: 5 } ],
      frameRate: 20
  });

  this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 6, end: 11}),
      frameRate: 10,
      repeat: -1
  });

  this.anims.create({
      key: 'jumpRight',
      frames: this.anims.generateFrameNumbers('dude', { start: 18, end: 23}),
      frameRate: 10,
      repeat: -1
  });

  this.anims.create({
      key: 'jumpLeft',
      frames: this.anims.generateFrameNumbers('dude', { start: 12, end: 17}),
      frameRate: 10,
      repeat: -1
  });

  //18-23

  //

  this.physics.add.collider(player, platforms); //SPRITE HAS TO COLLIDE WITH STAGES

  this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  this.key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  this.key_SPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  this.key_S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

  //MAKING SCORES

  score = this.physics.add.group({
    key: 'score',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });

  score.children.iterate(function (child) {

    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

  });
  this.physics.add.collider(score, platforms);  //SCORE HAS TO COLLIDE WITH STAGES
  this.physics.add.overlap(player, score, collectScore, null, this); //AND WITH PLAYER, BUT WHEN IT HAPPENS CALL COLLECTSCORE FUNCTION

  scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' }); //WHEN SCORE COLLIDE SPRITE DO THIS

}

function collectScore (player, score){
    score.disableBody(true, true);

    point += 10;
    scoreText.setText('Score: ' + point);
}

function update (){

  if (this.key_A.isDown){

    lastKey = 'a';

    player.setVelocityX(-160);
    player.anims.play('left', true);

  }else if (this.key_D.isDown){

    lastKey = 'd'

    player.setVelocityX(160);

    player.anims.play('right', true);
  }else if (lastKey == 'd'){

    player.setVelocityX(0);

    player.anims.play('stopRight');
  }else if (lastKey == 'a'){

    player.setVelocityX(0);

    player.anims.play('stopLeft');
  }

  if (this.key_SPACE.isDown && player.body.touching.down){
    player.setVelocityY(-330);
  }

  if ((this.key_SPACE.isDown && !player.body.touching.down && this.key_A.isDown)||(this.key_SPACE.isDown && !player.body.touching.down && lastKey == 'a'))
    player.anims.play('jumpLeft');
  else if ((this.key_SPACE.isDown && !player.body.touching.down && lastKey == 'd')||(this.key_SPACE.isDown && !player.body.touching.down && this.key_D.isDown))
    player.anims.play('jumpRight');



}
