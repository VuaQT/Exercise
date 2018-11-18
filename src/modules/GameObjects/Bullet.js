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
    ctor:function(bulletSpeed){
        this._super("#laserbeam_blue.png");
        this.xVelocity = bulletSpeed;
    },
    update:function(dt){
        var x = this.x;
        var y = this.y;
        this.x = x + this.xVelocity*dt;
        this.y = y +  this.yVelocity*dt;

        if (x < -this.width || x > winsize.width + this.width || y < -this.height || y > winsize.height + this.height || this.HP <= 0) {
            this.active = false;
            this.destroy();
        }
    },
    destroy:function(){
        this.active = false;
        this.visible = false;
    },
    hurt: function () {
        this.HP --;
    },
    collideRect:function(){
        return cc.rect(this.x-this.width/2+2,this.y-2,this.width-4,4);
    }
});

Bullet.getOrCreateBullet = function (bulletSpeed) {
    var temp = null;
    for (var j = 0; j < CS.POOL.SHIP_BULLETS.length; j++) {
        temp = CS.POOL.SHIP_BULLETS[j];
        if (temp.active == false) {
            temp.visible = true;
            temp.HP = 1;
            temp.active = true;
            return temp;
        }
    }

    temp = Bullet.create(bulletSpeed);
    return temp;
}
Bullet.create = function(bulletSpeed){
    var bullet = new Bullet(bulletSpeed);
    cc.log("create new bullet to gamelayer");
    g_sharedGameLayer.addBullet(bullet, this.zOrder);
    CS.POOL.SHIP_BULLETS.push(bullet);

    return bullet;
}