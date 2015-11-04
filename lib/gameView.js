(function() {

  if (typeof window.Asteroids === "undefined") {
    var Asteroids = window.Asteroids = {};
  }

  var gameView = window.Asteroids.gameView = function (game, ctx) {
    this.game = game;
    this.ctx = ctx;
  };

  window.Asteroids.gameView.prototype = {
    start: function () {
      window.addEventListener('keyup', this.onEnter);
    },

    playGame: function () {
      gv.game.step();
      gv.game.draw(this.ctx);
    },

    startGame: function () {
      window.removeEventListener('keyup', this.onEnter)
      window.addEventListener('keyup', this.keyUpBindings.bind(this));
      this.bindKeyHandlers();
      this.game.resetCallback = this.resetGame.bind(this);
      this.game.updateScore();
      this.game.updateLives();
      this.game.levelUp();
      this.intervalID = setInterval(this.playGame, 20);
    },

    resetGame: function () {
      clearInterval(this.intervalID);
      window.removeEventListener('keyup', this.keyUpBindings.bind(this));
      window.addEventListener('keyup', this.onEnter);
      $("#start-screen").css('display', 'block');
      $("#game-canvas").css('display', 'none');
      $("#game-info").css('display', 'none');
    },

    onEnter: function (e) {
      if (e.keyCode === 13) {
        $("#start-screen").css('display', 'none');
        $("#game-canvas").css('display', 'block');
        $("#game-info").css('display', 'block');
        this.gv.startGame();
      }
    },

    keyUpBindings: function (e) {
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
    },

    bindKeyHandlers: function () {
      var up = function () {
        this.game.ship.powerDir = 1;
        return false;
      };
      var down = function () {
        this.game.ship.powerDir = -1;
        return false;
      };
      var left = function () {
        this.game.ship.rotateDir = 1;
        return false;
      };
      var right = function () {
        this.game.ship.rotateDir = -1;
        return false;
      };

      var space = function () {
        this.game.ship.fireBullet();
        return false;
      };

      window.key('up', up.bind(this));
      window.key('down', down.bind(this));
      window.key('left', left.bind(this));
      window.key('right', right.bind(this));
      window.key('space', space.bind(this));
    }
  };

})();
