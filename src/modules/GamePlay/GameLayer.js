
var g_sharedGameLayer;

var GameLayer = cc.Layer.extend({
    _ship : null,
    _Sprite : null,
    _backSky:null,
    _backSkyHeight:0,
    _backSkyRe:null,
    _isBackSkyReload:false,
    lbScore : null,
    lbHP : null,
    ctor:function(){
        this._super();
        cc.spriteFrameCache.addSpriteFrames(res.Sprites_plist);

        /**
         * Created by CPU11630_LOCAL on 11/16/2018.
         */
        CS.SHIP = {
            SPEED : 250,
            BULLETSPEED : 1000,
            HP : 5,
        }
        CS.ISLIVING = true
        CS.KEYS = []
        CS.LIFE = 3
        CS.POOL = {
            ASTEROID:[],
            SHIP_BULLETS:[],
            BACKSKYS :[],
            BACKTILEMAPS : [],
        }
        CS.ACTIVE_ASTEROIDS = 0
        CS.MAX_ASTEROIDS = 7
        CS.SCORE = 0;

        var temp = cc.textureCache.addImage(res.Sprites_prv_ccz);
        this._Sprite = new cc.SpriteBatchNode(temp);
        this.addChild(this._Sprite, 100, "objects can collide");
        this._ship = new Ship();
        this._Sprite.addChild(this._ship,this._ship.zOrder, "shiptag");
        this.addKeyboardListener();
        this.scheduleUpdate();

        g_sharedGameLayer = this;
        this.initBackground();
        this.lbScore = new cc.LabelBMFont("Score: 0", res.arial_fnt);
        this.lbScore.attr({
            anchorX: 1,
            anchorY: 0,
            x: winsize.width - 50,
            y: winsize.height - 50,
            color : cc.color(255, 0, 0)
        });
        this.lbScore.textAlign = cc.TEXT_ALIGNMENT_RIGHT;
        this.addChild(this.lbScore, 10000);

        this.lbHP = new cc.LabelBMFont("HP: 0", res.arial_fnt);
        this.lbHP.attr({
            anchorX: 0,
            anchorY: 0,
            x: 100,
            y: winsize.height - 50,
            color : cc.color(255, 0, 0)
        });
        this.lbHP.textAlign = cc.TEXT_ALIGNMENT_RIGHT;
        this.addChild(this.lbHP, 10000);

    },
    update:function(dt){ // dt ~~ delta
        var i, selChild, children = this._Sprite.children;
        for (i in children) {
            selChild = children[i];
            if (selChild && selChild.active)
                selChild.update(dt);
        }
        if(CS.ACTIVE_ASTEROIDS<CS.MAX_ASTEROIDS){
            var asteroid = Asteroid.getOrCreateAsteroid();
            asteroid.x = winsize.width + asteroid.width;
            asteroid.y = Math.random()*winsize.height;
            var offset = cc.p(-2*asteroid.width, asteroid.y + Math.random()*winsize.height);
            var action = cc.moveTo(1000/asteroid.speed, offset);
            asteroid.runAction(action);
        }
        var i, curship = this._ship;
        var curAsteroid = null;
        for(i=0;i<CS.POOL.ASTEROID.length;i++){
            curAsteroid = CS.POOL.ASTEROID[i];
            if(! curAsteroid.active) continue;
            if(curship.active && this.collide(curship,curAsteroid)){
                curship.hurt();
                curAsteroid.hurt();
            }
            for(var j = 0;j<CS.POOL.SHIP_BULLETS.length;j++){
                var curBullet = CS.POOL.SHIP_BULLETS[j];
                if(!curBullet.active) continue;
                if(this.collide(curBullet,curAsteroid)){
                    curAsteroid.hurt();
                    curBullet.hurt();
                    CS.SCORE ++;
                }
            }
        };
        this._movingBackground(dt);
        this.lbScore.setString("Score: " + CS.SCORE);
        this.lbHP.setString("HP: " + this._ship.HP);
        if(this._ship.HP <=0){
            fr.view(ScreenMenu);
        }
    },
    collide:function (a, b) {
        var aRect = a.collideRect();
        var bRect = b.collideRect();
        return cc.rectIntersectsRect(aRect, bRect);
    },
    addKeyboardListener:function(){
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (key, event) {
                CS.KEYS[key] = true;
            },
            onKeyReleased: function (key, event) {
                CS.KEYS[key] = false;
            }
        }, this);
    },
    initBackground:function () {
        this._backSky = BackSky.getOrCreate();
        this._backSkyHeight = this._backSky.width;

        this.moveTileMap();
        this.schedule(this.moveTileMap, 5);
    },
    moveTileMap:function () {
        var backTileMap = BackTileMap.getOrCreate();
        var ran = Math.random();
        backTileMap.y = ran * winsize.height;
        backTileMap.x = winsize.width + backTileMap.width;
        var move = cc.moveBy(ran * 20 + 20, cc.p(-winsize.width-backTileMap.width,0));
        var fun = cc.callFunc(function(){
            backTileMap.destroy();
        },this);
        backTileMap.runAction(cc.sequence(move,fun));
    },

    _movingBackground:function(dt){
        var movingDist = 16 * dt;       // background's moving rate is 16 pixel per second

        var locSkyHeight = this._backSkyHeight, locBackSky = this._backSky;
        var currPosX = locBackSky.x - movingDist;
        var locBackSkyRe = this._backSkyRe;

        if(locSkyHeight + currPosX <= winsize.width){
            if(locBackSkyRe != null)
                throw "The memory is leaking at moving background";
            locBackSkyRe = this._backSky;
            this._backSkyRe = this._backSky;

            //create a new background
            this._backSky = BackSky.getOrCreate();
            locBackSky = this._backSky;
            locBackSky.x = currPosX + locSkyHeight - 5;
        } else
            locBackSky.x = currPosX;

        if(locBackSkyRe){
            //locBackSkyRe
            currPosX = locBackSkyRe.x - movingDist;
            if(currPosX + locSkyHeight < 0){
                locBackSkyRe.destroy();
                this._backSkyRe = null;
            } else
                locBackSkyRe.x = currPosX;
        }
    },
});

GameLayer.scene = function () {
    var scene = new cc.Scene();
    var layer = new GameLayer();
    scene.addChild(layer, 1);
    return scene;
};

GameLayer.prototype.addEnemy = function (enemy, z, tag) {
    this._Sprite.addChild(enemy, z, tag);
};
//
//GameLayer.prototype.addExplosions = function (explosion) {
//    this._explosions.addChild(explosion);
//};
//
//GameLayer.prototype.addBulletHits = function (hit, zOrder) {
//    this._texOpaqueBatch.addChild(hit, zOrder);
//};
//
//GameLayer.prototype.addSpark = function (spark) {
//    this._sparkBatch.addChild(spark);
//};

GameLayer.prototype.addBullet = function (bullet, zOrder) {
    this._Sprite.addChild(bullet,1000, "shiptag");
};
