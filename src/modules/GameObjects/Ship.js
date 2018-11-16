/**
 * Created by CPU11630_LOCAL on 11/16/2018.
 */

var Ship = cc.Sprite.extend({
    speed : CS.SHIP.SPEED,
    bulletSpeed : CS.SHIP.BULLETSPEED,
    HP : CS.SHIP.HP,
    state : CS.SHIP.STATE.PLAYING,
    appearPosition : cc.p(winsize.width/3,winSize.height/2),
    active:true,
    bornSprite:null,
    canBeAttack:true,
    ctor:function(){
        this.super("");
        this.x = this.appearPosition.x;
        this.y = this.appearPosition.y;
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

    },
    destroy: function () {
        CS.LIFE --;
    },
    hurt:function(){
        if(this.canBeAttack){
            this.HP --;
        }
    },
    collideRect : function(x,y){
        return cc.Rect(x-this.width/2, y-this.height/2);
    },
    initBornSprite:function () {
        this.bornSprite = new cc.Sprite("#");
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