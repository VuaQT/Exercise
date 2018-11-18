/**
 * Created by GSN on 7/9/2015.
 */


var ScreenNewGame = cc.Layer.extend({
    _itemMenu:null,
    _beginPos:0,
    isMouseDown:false,

    ctor:function() {
        this._super();
        this.loadGui();
        this.addChild(new GameLayer());
    },
    loadGui:function()
    {

    },
    onEnter:function(){
        this._super();
    }
});