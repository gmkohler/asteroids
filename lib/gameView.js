(function() {

  if (typeof window.Asteroids === "undefined") {
    var Asteroids = window.Asteroids = {};
  }

  var gameView = window.Asteroids.gameView = function (game, ctx) {
    this.game = game;
    this.ctx = ctx;
    this.isPlaying = false;
  };

  window.Asteroids.gameView.prototype = {
    start: function () {
      window.addEventListener('keyup', this.onEnter.bind(this));
      window.addEventListener('keyup', this.keyUpBindings.bind(this));
      this.bindKeyHandlers();
    },

    startGame: function () {
      this.isPlaying = true;
      this.game.resetCallback = this.resetGame.bind(this);
      this.game.updateScore();
      this.game.updateLives();
      this.game.levelUp();
      this.playIntervalID = setInterval(function () {
        this.game.step();
        this.game.draw(this.ctx);
      }.bind(this), 20);
    },

    resetGame: function () {
      this.isPlaying = false;
      this.ctx.clearRect(
        0,
        0,
        (window.innerWidth + window.Asteroids.Asteroid.RADII[0]),
        (window.innerHeight + window.Asteroids.Asteroid.RADII[0])
      );
      clearInterval(this.playIntervalID);
      $("#start-screen").css('display', 'block');
      $("#game-canvas").css('display', 'none');
      $("#game-info").css('display', 'none');
    },

    onEnter: function (e) {
      if (!this.isPlaying && e.keyCode === 13) {
        $("#start-screen").css('display', 'none');
        $("#game-canvas").css('display', 'block');
        $("#game-info").css('display', 'block');
        this.startGame();
      }
    },

    keyUpBindings: function (e) {
      if (this.isPlaying) {
        switch (e.keyCode) {
          case 37:
            this.game.ship.stopRotate();
            break;
          case 39:
            this.game.ship.stopRotate();
            break;
          case 38:
            this.game.ship.stopPower();
            break;
          case 40:
            this.game.ship.stopPower();
            break;
        }
      }
    },

    bindKeyHandlers: function () {
      var space = function () {
        if (this.isPlaying) { this.game.ship.fireBullet(); }
        return false;
      };
      var left = function () {
        if (this.isPlaying) { this.game.ship.rotateDir = 1; }
        return false;
      };
      var right = function () {
        if (this.isPlaying) { this.game.ship.rotateDir = -1; }
        return false;
      };
      var up = function () {
        if (this.isPlaying) { this.game.ship.powerDir = 1; }
        return false;
      };
      var down = function () {
        if (this.isPlaying) { this.game.ship.powerDir = -1; }
        return false;
      };

      window.key('space', space.bind(this))
      window.key('left', left.bind(this))
      window.key('right', right.bind(this))
      window.key('up', up.bind(this))
      window.key('down', down.bind(this))
    }

  };

})();
