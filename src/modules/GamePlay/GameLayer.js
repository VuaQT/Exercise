

STATE_PLAYING = 0;
STATE_GAMEOVER = 1;
MAX_CONTAINT_WIDTH = 40;
MAX_CONTAINT_HEIGHT = 40;

var g_sharedGameLayer;

var GameLayer = cc.Layer.extend({
    _time:null,
    _ship:null,
    _levelManager:null,
    _tmpScore:0,
    _isBackSkyReload:false,
    _isBackTileReload:false,
    lbScore:null,
    _state:STATE_PLAYING

    ctor:function(){
        this._super();
        this.init();
    },
    init:function () {
        this._state = STATE_PLAYING;

        winSize = cc.director.getWinSize();
//        this._levelManager = new LevelManager(this);

        // ship
        this._ship = new Ship(); // ******************************************************
        this._texTransparentBatch.addChild(this._ship, this._ship.zOrder, MW.UNIT_TAG.PLAYER);


        this.addTouchListener();
        this.addKeyboardListener();

        // schedule
        this.scheduleUpdate();

        g_sharedGameLayer = this;

        this.initBackground();

        return true;
    },
    addTouchListener:function(touches){

    },
    addKeyboardListener:function(){
        //Add code here

         cc.eventManager.addListener({
                        event: cc.EventListener.KEYBOARD,
                        onKeyPressed: function (key, event) {
                            cc.log("hehe")
                            MW.KEYS[key] = true;
                        },
                        onKeyReleased: function (key, event) {
                            MW.KEYS[key] = false;
                        }
                    }, this);
    },
    scoreCounter:function () {
//        if (this._state == STATE_PLAYING) {
//            this._time++;
//            this._levelManager.loadLevelResource(this._time);
//        }
    },


    update:function (dt) {
        //this._testNode.update(dt);
        if (this._state == STATE_PLAYING) {
            this.checkIsCollide();
            this.removeInactiveUnit(dt);
            this.checkIsReborn();
            this.updateUI();
            this._movingBackground(dt);
        }
    },
    checkIsCollide:function () {
        var selChild, bulletChild;
        // check collide
        var i, locShip =this._ship;
        for (i = 0; i < MW.CONTAINER.ENEMIES.length; i++) {
            selChild = MW.CONTAINER.ENEMIES[i];
            if (!selChild.active)
                continue;

            for (var j = 0; j < MW.CONTAINER.PLAYER_BULLETS.length; j++) {
                bulletChild = MW.CONTAINER.PLAYER_BULLETS[j];
                if (bulletChild.active && this.collide(selChild, bulletChild)) {
                    bulletChild.hurt();
                    selChild.hurt();
                }
            }
            if (this.collide(selChild, locShip)) {
                if (locShip.active) {
                    selChild.hurt();
                    locShip.hurt();
                }
            }
        }

        for (i = 0; i < MW.CONTAINER.ENEMY_BULLETS.length; i++) {
            selChild = MW.CONTAINER.ENEMY_BULLETS[i];
            if (selChild.active && this.collide(selChild, locShip)) {
                if (locShip.active) {
                    selChild.hurt();
                    locShip.hurt();
                }
            }
        }
    },
    removeInactiveUnit:function (dt) {
        var i, selChild, children = this._texOpaqueBatch.children;
        for (i in children) {
            selChild = children[i];
            if (selChild && selChild.active)
                selChild.update(dt);
        }

        children = this._sparkBatch.children;
        for (i in children) {
            selChild = children[i];
            if (selChild && selChild.active)
                selChild.update(dt);
        }

        children = this._texTransparentBatch.children;
        for (i in children) {
            selChild = children[i];
            if (selChild && selChild.active)
                selChild.update(dt);
        }
    },
    checkIsReborn:function () {
        var locShip = this._ship;
        if (MW.LIFE > 0 && !locShip.active) {
            locShip.born();
        } else if (MW.LIFE <= 0 && !locShip.active) {
            this._state = STATE_GAMEOVER;
            // XXX: needed for JS bindings.
            this._ship = null;
            this.runAction(cc.sequence(
                cc.delayTime(0.2),
                cc.callFunc(this.onGameOver, this)
            ));
        }
    },
    updateUI:function () {
        if (this._tmpScore < MW.SCORE) {
            this._tmpScore += 1;
        }
        this._lbLife.setString(MW.LIFE + '');
        this.lbScore.setString("Score: " + this._tmpScore);
    },
    collide:function (a, b) {
	    var ax = a.x, ay = a.y, bx = b.x, by = b.y;
        if (Math.abs(ax - bx) > MAX_CONTAINT_WIDTH || Math.abs(ay - by) > MAX_CONTAINT_HEIGHT)
            return false;

        var aRect = a.collideRect(ax, ay);
        var bRect = b.collideRect(bx, by);
        return cc.rectIntersectsRect(aRect, bRect);
    },
    initBackground:function () {
        this._backSky = BackSky.getOrCreate();
        this._backSkyHeight = this._backSky.height;

        this.moveTileMap();
        this.schedule(this.moveTileMap, 5);
    },
    moveTileMap:function () {
        var backTileMap = BackTileMap.getOrCreate();
        var ran = Math.random();
        backTileMap.x = ran * 320;
	    backTileMap.y = winSize.height;
        var move = cc.moveBy(ran * 2 + 10, cc.p(0, -winSize.height-backTileMap.height));
        var fun = cc.callFunc(function(){
            backTileMap.destroy();
        },this);
        backTileMap.runAction(cc.sequence(move,fun));
    },

    _movingBackground:function(dt){
        var movingDist = 16 * dt;       // background's moving rate is 16 pixel per second

        var locSkyHeight = this._backSkyHeight, locBackSky = this._backSky;
        var currPosY = locBackSky.y - movingDist;
        var locBackSkyRe = this._backSkyRe;

        if(locSkyHeight + currPosY <= winSize.height){
             if(locBackSkyRe != null)
                throw "The memory is leaking at moving background";
            locBackSkyRe = this._backSky;
            this._backSkyRe = this._backSky;

            //create a new background
            this._backSky = BackSky.getOrCreate();
            locBackSky = this._backSky;
            locBackSky.y = currPosY + locSkyHeight - 5;
        } else
            locBackSky.y = currPosY;

        if(locBackSkyRe){
            //locBackSkyRe
            currPosY = locBackSkyRe.y - movingDist;
            if(currPosY + locSkyHeight < 0){
                locBackSkyRe.destroy();
                this._backSkyRe = null;
            } else
                locBackSkyRe.y = currPosY;
        }
    },

    onGameOver:function () {
        cc.audioEngine.stopMusic();
        cc.audioEngine.stopAllEffects();
        var scene = new cc.Scene();
        scene.addChild(new GameOver());
	    cc.director.runScene(new cc.TransitionFade(1.2, scene));
    }
});

GameLayer.scene = function () {
    var scene = new cc.Scene();
    var layer = new GameLayer();
    scene.addChild(layer, 1);
    return scene;
};

GameLayer.prototype.addEnemy = function (enemy, z, tag) {
    this._texTransparentBatch.addChild(enemy, z, tag);
};

GameLayer.prototype.addExplosions = function (explosion) {
    this._explosions.addChild(explosion);
};

GameLayer.prototype.addBulletHits = function (hit, zOrder) {
    this._texOpaqueBatch.addChild(hit, zOrder);
};

GameLayer.prototype.addSpark = function (spark) {
    this._sparkBatch.addChild(spark);
};

GameLayer.prototype.addBullet = function (bullet, zOrder, mode) {
    this._texOpaqueBatch.addChild(bullet, zOrder, mode);
};
