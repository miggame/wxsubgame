// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        lblRank: { displayName: 'lblRank', default: null, type: cc.Label },
        spHead: { displayName: 'spHead', default: null, type: cc.Sprite },
        lblNickName: { displayName: 'lblNickName', default: null, type: cc.Label },
        lblScore: { displayName: 'lblScore', default: null, type: cc.Label },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },

    start() {

    },

    // update (dt) {},

    init(index, data) {

        let avatarUrl = data.avatarUrl;
        let nickName = data.nickname;
        let grade = data.KVDataList.length !== 0 ? data.KVDataList[0].value : 0;
        this.lblRank.string = index + 1;
        this._createHead(avatarUrl);
        this.lblNickName.string = nickName;
        this.lblScore.string = grade;
    },

    _createHead(avatarUrl) {
        console.log('hehe');
        console.log(avatarUrl);
        let image = wx.createImage();
        console.log(image);
        image.onload = () => {
            try {
                let texture = new cc.Texture2D();
                texture.initWithElement(image);
                texture.handleLoadedTexture();
                console.log('>>>><<<<');
                console.log(this.spHead);
                this.spHead.spriteFrame = new cc.SpriteFrame(texture);
            } catch (e) {
                console.log(e);
                // this.spHead.node.active = false;
            }
        }
        image.src = avatarUrl;
    }
});
