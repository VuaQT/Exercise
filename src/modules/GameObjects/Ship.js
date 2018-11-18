/**
 * Created by CPU11630_LOCAL on 11/16/2018.
 */

var Ship = cc.Sprite.extend({
    speed : CS.SHIP.SPEED,
    bulletSpeed : CS.SHIP.BULLETSPEED,
    HP : CS.SHIP.HP,
    state : CS.SHIP.STATE.PLAYING,
    appearPosition : cc.p(300,300),
    zOrder:1000,
    active:true,
    bornSprite:null,
    canBeAttack:true,
    ctor:function(){
        this._super("#SpaceFlier_sm_1.png");
        this.tag = this.zOrder;
        this.x = this.appearPosition.x;
        this.y = this.appearPosition.y;
        this.initBornSprite();
        //this.born();

        this.schedule(this.shoot, 1 / 3);

    },
    update: function(dt){
        this.updateMove(dt);
        if(this.HP <=0){
            this.active = false;
            this.destroy();
        }
    },
    updateMove:function(dt){
        if(CS.KEYS[cc.KEY.up] && this.y < winsize.height){
            this.y += dt* this.speed;
        }
        if(CS.KEYS[cc.KEY.down] && this.y >0){
            this.y -= dt* this.speed;
        }
        if(CS.KEYS[cc.KEY.right] && this.x < winsize.width){
            this.x += dt* this.speed;
        }
        if(CS.KEYS[cc.KEY.left] && this.x > 0){
            this.x -= dt* this.speed;
        }
    },
    shoot:function(){
        var bullet = Bullet.getOrCreateBullet(this.bulletSpeed);
        bullet.x = this.x + this.width/2 + 10;
        bullet.y  = this.y;

    },
    destroy: function () {
        CS.ISLIVING = false
    },
    hurt:function(){
        if(this.canBeAttack){
            this.HP --;
        }
    },
    collideRect : function(){
        return cc.rect(this.x-this.width/2, this.y-this.height/2, this.width, this.height);
    },
    initBornSprite:function () {
        this.bornSprite = new cc.Sprite("#SpaceFlier_lg_1.png");
        this.bornSprite.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
        this.bornSprite.x = this.width / 2;
        this.bornSprite.y = this.height / 2;
        this.bornSprite.visible = false;
        this.addChild(this.bornSprite, 3000, 99999);
    },
    born:function () {
        this.canBeAttack = false;
        this.bornSprite.scale = 5;
        this.bornSprite.runAction(cc.scaleTo(0.5, 1, 1));
        this.bornSprite.visible = true;
        var blinks = cc.blink(3, 9);
        var makeBeAttack = cc.callFunc(function (t) {
            t.canBeAttack = true;
            t.visible = true;
            t.bornSprite.visible = false;
        }.bind(this));
        this.runAction(cc.sequence(cc.delayTime(0.5), blinks, makeBeAttack));

        this.HP = 3;
        this.active = true;
    }
});