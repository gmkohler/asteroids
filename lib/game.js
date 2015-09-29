(function() {

  if (typeof window.Asteroids === "undefined") {
    var Asteroids = window.Asteroids = {};
  }

  var Game = window.Asteroids.Game = function (NUM_ASTEROIDS) {
    this.DIM_X = window.innerWidth;
    this.DIM_Y = window.innerHeight;
    this.NUM_ASTEROIDS = NUM_ASTEROIDS;
    this.ship = new window.Asteroids.Ship(this, this.randomPosition());
    this.asteroids = [];
    this.addAsteroids();
  };

  window.Asteroids.Game.prototype = {
    randomPosition: function () {
      return [this.DIM_X * Math.random(), this.DIM_Y * Math.random()];
    },

    addAsteroids: function () {
      while (this.asteroids.length < this.NUM_ASTEROIDS) {
        var that = this;
        that.asteroids.push(
          new window.Asteroids.Asteroid(
            that,
            that.randomPosition())
        );
      }
    },

    allObjects: function () {
      var all = this.asteroids.concat(this.ship);
      return all;
    },

    draw: function (ctx) {
      ctx.clearRect(
        0,
        0,
        (this.DIM_X + window.Asteroids.Asteroid.RADIUS),
        (this.DIM_X + window.Asteroids.Asteroid.RADIUS)
      );

      this.allObjects().forEach ( function (obj) {
        obj.draw(ctx);
      });

    },

    moveObjects: function () {
      this.allObjects().forEach(function (obj) {
        obj.move();
      });
    },

    wrap: function (pos) {
      return [(pos[0] + this.DIM_X) % this.DIM_X,
        (pos[1] + this.DIM_Y) % this.DIM_Y];
    },

    checkCollisions: function () {
      var allObjs = this.allObjects();
      for (var j = 0; j < allObjs.length - 1; j++) {
        for (var k = j + 1; k < allObjs.length; k++) {
          if (allObjs[j].isCollidedWith(allObjs[k])) {
            allObjs[j].collideWith(allObjs[k]);
          }
        }
      }
    },

    remove: function (asteroid) {
      var idx = this.asteroids.indexOf(asteroid);
      this.asteroids.splice(idx, 1);
    },

    step: function () {
      this.moveObjects();
      this.checkCollisions();
    }

  };


})();