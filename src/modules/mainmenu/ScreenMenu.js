/**
 * Created by GSN on 7/6/2015.
 */

var ScreenMenu = cc.Layer.extend({
    _itemMenu:null,
    _beginPos:0,
    isMouseDown:false,

    ctor:function() {
        this._super();
        var size = cc.director.getVisibleSize();

        var yBtn = 7*size.height/12;

        var btnNewGame = gv.commonButton(200, 64, cc.winSize.width/4, yBtn,"New Game");
        this.addChild(btnNewGame);
        btnNewGame.addClickEventListener(this.onSelectNewGame.bind(this));

        var btnSetting = gv.commonButton(200, 64, cc.winSize.width/2, yBtn,"Setting");
        this.addChild(btnSetting);
//        btnSetting.addClickEventListener(this.onSelectSetting.bind(this));

        var btnAbout = gv.commonButton(200, 64, 3*cc.winSize.width/4, yBtn,"About");
        this.addChild(btnAbout);
//        btnAbout.addClickEventListener(this.onSelectAbout.bind(this));

    },
    onEnter:function(){
        this._super();
    },
    onSelectNewGame:function(sender)
    {
        fr.view(ScreenNewGame);
    },
//    onSelectSetting:function(sender)
//    {
//        fr.view(ScreenSetting);
//    },
//    onSelectAbout:function(sender)
//    {
//        fr.view(ScreenAbout);
//    }

});