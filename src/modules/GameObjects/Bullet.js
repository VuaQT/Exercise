/**
 * Created by CPU11630_LOCAL on 11/16/2018.
 */

var Bullet = cc.Sprite.extend({
    active:true,
    xVelovity:200,
    yVelocity:0,
    power:1,
    HP:1,
    zOrder:1000,
    ctor:function(bulletSpeed, type){
        this._super();
        this.xVelocity = bulletSpeed;
    },
    update:function(dt){
        var x = this.x;
        var y = this.y;
        this.x = x - this.xVelocity*dt;
        this.y = y - this.yVelocity*dt;
    },
    destroy:function(){
        this.active = false;
        this.visible = false;
    },
    hurt: function () {
        this.HP --;
    },
    collideRect:function(x,y){
        return cc.rect(x-2,y-2,4,4);
    }
});

Bullet.getOrCreateBullet = function (bulletSpeed, type) {
    var temp = null;
    if (type == CS.TYPE.ENEMY_BULLET) {
        for (var j = 0; j < CS.POOL.ENEMY_BULLETS.length; j++) {
            temp = CS.POOL.ENEMY_BULLETS[j];
            if (temp.active == false) {
                temp.visible = true;
                temp.HP = 1;
                temp.active = true;
                return temp;
            }
        }
    }
    else if (type == CS.TYPE.SHIP_BULLET) {
        for (var j = 0; j < CS.POOL.SHIP_BULLETS.length; j++) {
            temp = CS.POOL.SHIP_BULLETS[j];
            if (temp.active == false) {
                temp.visible = true;
                temp.HP = 1;
                temp.active = true;
                return temp;
            }
        }
    }
    temp = Bullet.create(bulletSpeed,type);
    return temp;
}
Bullet.create = function(bulletSpeed, type){
    var bullet = new Bullet(bulletSpeed,type);
    g_sharedGameLayer.addBullet(bullet, this.zOrder, type);
    if(type == CS.TYPE.ENEMY_BULLET){
        CS.POOL.ENEMY_BULLETS.push(bullet);
    }   else if(type == CS.TYPE.SHIP_BULLET){
        CS.POOL.SHIP_BULLETS.push(bullet);
    }
    return bullet;
}