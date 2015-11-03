(function() {

  if (typeof window.Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Asteroids = window.Asteroids;

  var Bullet = window.Asteroids.Bullet = function (game, ship) {
    var vel = this._newVel(ship);
    var velNorm = window.Asteroids.Util.norm(vel);
    var args = {
      game: game,
      vel: this._newVel(ship),
      pos: this._newPos(ship, velNorm),
      radius: Bullet.RADIUS,
      color: Bullet.COLOR
    };

    window.Asteroids.movingObject.call(this, args);
  };

  Bullet.COLOR = "#FF6600";
  Bullet.RADIUS = 6;
  Bullet.SPEED = 15;
  Bullet.DENSITY = 1;

  window.Asteroids.Util.inherits(
    Bullet,
    window.Asteroids.movingObject
  );

  Bullet.prototype._newPos = function (ship, velNorm) {
    var centerPos = ship.pos;

    var pastCenter = [
      centerPos[0] + ship.dir[0] * (Asteroids.Ship.RADIUS + velNorm),
      centerPos[1] + ship.dir[1] * (Asteroids.Ship.RADIUS + velNorm)
    ];

    return pastCenter;
  };
  // Bullet.prototype.draw = function () {
  //   var img = new Image();
  //   img.src = 'assets/bullet.png';
  //   ctx.drawImage(
  //     img,         // source image object
  //     Asteroid.SPRITE_SIZE * this.spriteFrame,           // source x
  //     Asteroid.SPRITE_SIZE * (this.spriteFrame % Asteroid.SPRITE_GRID_SIZE),           // source y
  //     Asteroid.SPRITE_SIZE,         // source width
  //     Asteroid.SPRITE_SIZE,         // source height
  //     this.pos[0] - this.radius, // destination x
  //     this.pos[1] - this.radius, // destination y
  //     2 * this.radius,         // desitnation width
  //     2 * this.radius          // destination height
  //   );
  //
  //   var pastCenter = [
  //     centerPos[0] + ship.dir[0] * (Asteroids.Ship.RADIUS + velNorm),
  //     centerPos[1] + ship.dir[1] * (Asteroids.Ship.RADIUS + velNorm)
  //   ];
  //
  //   return pastCenter;
  // };

  Bullet.prototype._newVel = function (ship) {
    var exitVel = [ship.dir[0] * Bullet.SPEED, ship.dir[1] * Bullet.SPEED];
    var relativeVel = [ship.vel[0] + exitVel[0], ship.vel[1] + exitVel[1]];
    return relativeVel;
  };

  Bullet.prototype.collideWith = function (object) {
      if (object instanceof window.Asteroids.Ship &&
            object.isAlive && Math.floor(object.transparency) === 1) {
        object.explode();
        this.game.remove(this);
      } else if (object instanceof window.Asteroids.Asteroid) {
        this.game.remove(object);
        this.game.remove(this);
      }
  };

  Bullet.prototype.isWrappable = false;

})();
