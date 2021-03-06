(function() {
  if (typeof window.Asteroids === "undefined") {
    var Asteroids = window.Asteroids = {};
  }

  var Ship = window.Asteroids.Ship = function (game, pos) {
    var args = {
      game: game,
      pos: pos,
      vel: [0, 0],
      radius: Ship.RADIUS,
      color: Ship.COLOR
    };

    Ship.prototype.resetDefaults.call(this);
    window.Asteroids.movingObject.call(this, args);
    this.dir = [0, -1];
  };

  Ship.COLOR = "#FFFF00";
  Ship.D_THETA = Math.PI / 32;
  Ship.ACCEL_CONSTANT = 0.3;
  Ship.RECOIL_CONSTANTS = [0.8, 0.4, 0.27];
  Ship.MAX_LEVEL = 3;
  Ship.POINTER_COLOR = "#FF5500";
  Ship.RADIUS = 25;
  Ship.SPRITE_SIZE = 343;
  Ship.SPRITE_Y_OFFSET = 40;
  Ship.EXPLOSION_SPRITE_SIZE = 128;
  Ship.EXPLOSION_SPRITE_GRID_SIZE = 4;
  Ship.NUM_EXPLOSION_SPRITES = 16;
  Ship.TICKS_PER_FRAME = 3;
  Ship.DENSITY = 0.5;

  window.Asteroids.Util.inherits(
    window.Asteroids.Ship,
    window.Asteroids.movingObject
  );

  Ship.prototype.resetDefaults = function () {
    this.vel = [0, 0];
    this.level = 0;
    this.powerDir = 0;
    this.rotateDir = 0;
    this.isAlive = true;
    this.transparency = 0.5;
    this.tickCount = 0;
    this.spriteFrame = 0;
  };

  Ship.prototype.levelUp = function () {
    if (this.level < Ship.MAX_LEVEL) {this.level += 1;}
  }

  Ship.prototype.relocate = function () {
    this.isAlive = true;
    this.transparency = 0.5;
    this.pos = this.game.randomPosition();
    this.vel = [0, 0];
  };

  Ship.prototype.power = function (direction) {
    var impulse = [this.dir[0] * direction, this.dir[1] * direction];
    this.vel[0] += Ship.ACCEL_CONSTANT * impulse[0];
    this.vel[1] += Ship.ACCEL_CONSTANT * impulse[1];
  };

  Ship.prototype.stopPower = function () {
    this.powerDir = 0;
  };

  Ship.prototype.rotate = function (direction) {
    var theta = direction * Ship.D_THETA;
    var newDir = window.Asteroids.Util.rotateByTheta(this.dir, theta);
    var newVel = window.Asteroids.Util.rotateByTheta(this.vel, theta);
    this.dir = newDir;
    this.vel = newVel;
  };

  Ship.prototype.explode = function () {
    this.isAlive = false;
    this.vel = [0, 0];
    this.tickCount = 0;
    this.game.removeLife();
  };

  Ship.prototype.stopRotate = function () {
    this.rotateDir = 0;
  };

  Ship.prototype.fireBullet = function () {
    if (this.isAlive) {
      for (var j = 0; j <= this.level; j++) {
        setTimeout(function () {
          this.game.addBullet(new window.Asteroids.Bullet(this.game, this));
          this.recoil();
        }.bind(this), j * 100);
      }
    }
  };

  Ship.prototype.recoil = function () {
    var vB = -1 * window.Asteroids.Bullet.SPEED;
    var massRatio = window.Asteroids.Util
                    .massRatio(window.Asteroids.Bullet.RADIUS, Ship.RADIUS);

    this.vel[0] += this.dir[0] * massRatio * vB * Ship.RECOIL_CONSTANTS[this.level];
    this.vel[1] += this.dir[1] * massRatio * vB * Ship.RECOIL_CONSTANTS[this.level];
  };

  Ship.prototype.collideWith = function (object) {
    this.relocate();
    this.game.remove(object);
  };


  Ship.prototype.draw = function (ctx) {
    var img = new Image();
    if (this.isAlive) {
        img.src = 'assets/red_spaceship.png';
        this.rotate(this.rotateDir);
        this.power(this.powerDir);
        var dirTheta = window.Asteroids.Util.thetaFromDir(this.dir);
        ctx.save();



        ctx.globalAlpha = this.transparency;
        if (this.transparency < 1) {
          this.transparency += 0.01;
        };
        ctx.translate(this.pos[0], this.pos[1]);
        ctx.rotate(dirTheta + (Math.PI/2));
        ctx.drawImage(
          img,
          0,
          Ship.SPRITE_Y_OFFSET,
          Ship.SPRITE_SIZE,
          Ship.SPRITE_SIZE,
          -1* this.radius,
          -1* this.radius,
          2 * this.radius,
          2 * this.radius
        );
        ctx.restore();
   } else {
       img = new Image();
       img.src = 'assets/explosion.png';
       ctx.drawImage(
         img,         // source image object
         Ship.EXPLOSION_SPRITE_SIZE * (this.spriteFrame % Ship.EXPLOSION_SPRITE_GRID_SIZE),          // source x
         Ship.EXPLOSION_SPRITE_SIZE * Math.floor(this.spriteFrame / Ship.EXPLOSION_SPRITE_GRID_SIZE),           // source y
         Ship.EXPLOSION_SPRITE_SIZE,         // source width
         Ship.EXPLOSION_SPRITE_SIZE,         // source height
         this.pos[0] - 4 * this.radius, // destination x
         this.pos[1] - 4 * this.radius, // destination y
         (2 * this.radius) * 4,         // desitnation width
         (2 * this.radius) * 4
       );
       this.tickCount += 1;
       if (this.tickCount > Ship.TICKS_PER_FRAME) {
         this.tickCount = 0;
         this.spriteFrame += 1;
       }
       if (this.spriteFrame === Ship.NUM_EXPLOSION_SPRITES) {
         this.relocate();
         this.spriteFrame = 0;
       }

   }

  };

})();
