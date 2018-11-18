
var Asteroid = cc.Sprite.extend({
    active : true,
    speed : 80,
    HP:1,
    zOrder : 1000,
    ctor:function(){
        this._super("#asteroid.png");
        this.speed += Math.random()*60;
    },
    update:function (dt) {
        var x = this.x;
        var y = this.y;
        if (x < -this.width || x > winsize.width + this.width || y < -this.height || y > winsize.height + this.height || this.HP <= 0) {
            this.active = false;
            this.destroy();
        }
    },
    destroy:function () {
        this.visible = false;
        this.active = false;
        this.stopAllActions();
        CS.ACTIVE_ASTEROIDS--;
    },
    hurt:function () {
        this.HP--;
    },
    collideRect:function () {
        var offset = 20;
        return cc.rect(this.x-this.width/2+offset, this.y-this.height/2+offset, this.width-offset*2, this.height-offset*2);
    }
});


Asteroid.getOrCreateAsteroid = function(){
    var temp = null;
    for (var j = 0; j < CS.POOL.ASTEROID.length; j++) {
        temp = CS.POOL.ASTEROID[j];

        if (temp.active == false) {
            temp.HP = 1;
            temp.active = true;
            temp.visible = true;
            CS.ACTIVE_ASTEROIDS++;
            return temp;
        }
    }
    temp = Asteroid.create();
    CS.ACTIVE_ASTEROIDS++;
    return temp;
};

Asteroid.create = function (arg) {
    var asteroid = new Asteroid();
    g_sharedGameLayer.addEnemy(asteroid, asteroid.zOrder, "asteroid");
    CS.POOL.ASTEROID.push(asteroid);
    return asteroid;
};