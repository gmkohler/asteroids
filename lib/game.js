(function() {

  if (typeof window.Asteroids === "undefined") {
    var Asteroids = window.Asteroids = {};
  }

  var Game = window.Asteroids.Game = function (NUM_LIVES) {
    this.DIM_X = window.innerWidth;
    this.DIM_Y = window.innerHeight;
    this.NUM_LIVES = NUM_LIVES;
    this.NUM_ASTEROIDS = 1;
    this.ship = new window.Asteroids.Ship(this, this.randomPosition());
    this.asteroids = [];
    this.bullets = [];
    debugger;
    this.ASTEROID_RANK = (this.DIM_X * this.DIM_Y > 1200000) ? 1 : 2;
    this.lives = 3;
    this.score = 0;
    this.level = 0;
  };

  window.Asteroids.Game.prototype = {
    randomPosition: function () {
      return [this.DIM_X * Math.random(), this.DIM_Y * Math.random()];
    },

    randomBoundary: function () {
      return [this.randomVertBoundary.bind(this),
                this.randomHorizBoundary.bind(this)][Math.floor(Math.random() * 2)]();
    },

    randomVertBoundary: function () {
      return [this.DIM_X * [0, 1][Math.floor(Math.random() * 2)],
               this.DIM_Y * Math.random()];
    },

    randomHorizBoundary: function () {
      return [this.DIM_X * Math.random(),
               this.DIM_Y * [0, 1][Math.floor(Math.random() * 2)]];
    },

    levelUp: function () {
      this.level += 1;
      this.updateLevel();
      $("#level-modal").css('display', 'block')

      setTimeout(function () {
        $("#level-modal").css('display', 'none')
        this.populateAsteroids();
        this.addLives();
      }.bind(this), 1500)
    },

    populateAsteroids: function () {
      for (var j = 0; j < this.NUM_ASTEROIDS; j++) {
        var that = this;
        setTimeout(function () {that.asteroids.push(
          new window.Asteroids.Asteroid(
            that,
            that.randomBoundary(),
            this.ASTEROID_RANK
          )
        )}.bind(this), (j + 1) * 1000);
      }
      this.NUM_ASTEROIDS += 1

      if (this.NUM_ASTEROIDS > 4 && this.ASTEROID_RANK > 0) {
        this.ASTEROID_RANK -= 1;
        this.NUM_ASTEROIDS = 2;
      }

    },

    addLives: function () {
      this.lives += this.NUM_LIVES;
      this.updateLives();
    },

    addAsteroids: function (newAsteroids) {
      newAsteroids.forEach(function(asteroid){
        this.asteroids.push(asteroid);
      }.bind(this));
    },

    addBullet: function (bullet) {
      this.bullets.push(bullet);
    },


    allObjects: function () {
      var all = this.asteroids.concat(this.bullets).concat(this.ship);
      return all;
    },

    draw: function (ctx) {
      ctx.clearRect(
        0,
        0,
        (this.DIM_X + window.Asteroids.Asteroid.RADII[0]),
        (this.DIM_Y + window.Asteroids.Asteroid.RADII[0])
      );

      this.allObjects().forEach ( function (obj) {
        obj.draw(ctx);
      });

    },

    moveObjects: function () {
      var that = this;
      this.allObjects().forEach(function (obj) {
        obj.move();
        if (obj.isWrappable) {
          obj.pos = that.wrap(obj.pos);
        } else {
          if (that.isOutOfBounds(obj.pos)) {
            that.remove(obj);
          }
        }
      });
    },

    isOutOfBounds: function (pos) {
      var inXBound = (0 < pos[0] && pos[0] < this.DIM_X);
      var inYBound = (0 < pos[1] && pos[1] < this.DIM_Y);
      if (!(inXBound && inYBound)) {
         return true;
      } else {
         return false;
      }
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

    remove: function (object) {
      if (object instanceof window.Asteroids.Asteroid){
        var idx = this.asteroids.indexOf(object);
        this.asteroids.splice(idx, 1);
        this.score += (1 + object.rank);
        this.updateScore();
        if (this.asteroids.length === 0) {this.levelUp();}
      } else if (object instanceof window.Asteroids.Bullet){
          // debugger;
          var jdx = this.bullets.indexOf(object);
          this.bullets.splice(jdx, 1);
      }
    },

    updateScore: function () {
      $("#score").text("Score: " + this.score);
    },

    updateLives: function () {
      $("#lives").text("Lives: " + this.lives);
    },
    updateLevel: function () {
      $("#level-display").text("Level" + this.level);
    },

    step: function () {
      this.moveObjects();
      this.checkCollisions();
    }


  };


})();
