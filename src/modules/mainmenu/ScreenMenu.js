/**
 * Created by GSN on 7/6/2015.
 */

var ScreenMenu = cc.Layer.extend({
    _itemMenu:null,
    _beginPos:0,
    isMouseDown:false,
    lbScore:null,
    ctor:function() {
        this._super();
        var size = cc.director.getVisibleSize();
        winsize = cc.winSize;
        var yBtn = 7*size.height/12;

        var btnNewGame = gv.commonButton(200, 64, cc.winSize.width/2, yBtn,"New Game");
        this.addChild(btnNewGame);
        btnNewGame.addClickEventListener(this.onSelectNewGame.bind(this));

        this.lbScore = new cc.LabelBMFont("Your score : " + CS.SCORE, res.arial_fnt);
        this.lbScore.attr({
            anchorX: 0,
            anchorY: 0,
            x: cc.winSize.width/2 - 100,
            y: cc.winSize.height/2-100,
            color : cc.color(255,0,0)
        });
        this.lbScore.textAlign = cc.TEXT_ALIGNMENT_RIGHT;
        this.addChild(this.lbScore);
        //this.lbScore.visible = !CS.ISLIVING;
    },
    onEnter:function(){
        this._super();
    },
    onSelectNewGame:function(sender)
    {
        fr.view(ScreenNewGame);
    },

});