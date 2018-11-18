
var BackSky = cc.Sprite.extend({
    active:true,
    ctor:function () {
        this._super(res.bg_front_spacedust);
        var rect = cc.rect(0, 1, this.width, this.height-2);
        this.setTextureRect(rect);
        this.anchorX = 0;
        this.anchorY = 0;
    },
    destroy:function () {
        this.visible = false;
        this.active = false;
    }
});

BackSky.create = function () {
    var background = new BackSky();
    g_sharedGameLayer.addChild(background, 1);
    CS.POOL.BACKSKYS.push(background);
    return background;
};

BackSky.getOrCreate = function () {
    var selChild = null;
    for (var j = 0; j < CS.POOL.BACKSKYS.length; j++) {
        selChild = CS.POOL.BACKSKYS[j];
        if (selChild.active == false) {
            selChild.visible = true;
            selChild.active = true;
            return selChild;
        }
    }
    selChild = BackSky.create();
    return selChild;
};



var BackTileMapLvl1 = [
    res.bg_galaxy,
    res.bg_planetsunrise,
    res.bg_spacialanomaly,
    res.bg_spacialanomaly2,
];

var BackTileMap = cc.Sprite.extend({
    active:true,
    ctor:function (frameName) {
        this._super(frameName);
        this.anchorX = 0.5;
        this.anchorY = 0;
    },
    destroy:function () {
        this.visible = false;
        this.active = false;
    }
});

BackTileMap.create = function (frameName) {
    var backTileMap = new BackTileMap(frameName);
    g_sharedGameLayer.addChild(backTileMap, 5);
    CS.POOL.BACKTILEMAPS.push(backTileMap);
    return backTileMap;
};

BackTileMap.getOrCreate = function () {
    var selChild = null;
    for (var j = 0; j < CS.POOL.BACKTILEMAPS.length; j++) {
        selChild = CS.POOL.BACKTILEMAPS[j];
        if (selChild.active == false) {
            selChild.visible = true;
            selChild.active = true;
            return selChild;
        }
    }
    selChild = BackTileMap.create(BackTileMapLvl1[0|Math.random()*4]);
    return selChild;
};

