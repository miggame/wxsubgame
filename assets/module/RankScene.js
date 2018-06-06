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
        rankScrollView: { displayName: 'rankScrollView', default: null, type: cc.Node },
        rankItemPre: { displayName: 'rankItemPre', default: null, type: cc.Prefab },
        content: { displayName: 'content', default: null, type: cc.Node },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        wx.onMessage(data => {
            console.log('接收主域发来的消息');
            console.log(data);
            if (data.message === 'submitScore') {
                this._submitScore(data.score);
            } else if (data.message === 'friendsRank') {
                this.rankScrollView.active = true;
                this._getFriendsRank();
            } else if (data.message === 'groupsRank') {
                console.log('111');
                this._getGroupsFriendData(data.shareTicket);
            } else if (data.message === 'close') {
                this.content.destroyAllChildren();
                this.rankScrollView.active = false;
            }
        });
    },

    start() {

    },

    // update (dt) {},

    _submitScore(score) {
        wx.getUserCloudStorage({
            //以key/value形式存储
            keyList: ['x2'],
            success: function (getres) {
                console.log(getres);
                if (getres.KVDataList.length !== 0) {
                    if (getres.KVDataList[0].value > score) {
                        return;
                    }
                }
                //对用户托管数进行写数据操作
                wx.setUserCloudStorage({
                    KVDataList: [{ key: 'x2', value: "" + score }],
                    success: function (res) {
                        console.log(res);
                    },
                    fail: function () {
                        console.log('fail');
                    },
                    complete: function () {
                        console.log('setUserCloudStorage', "ok");
                    }
                });
            },
            fail: function () {
                console.log('getUserCloudStorage', 'fail');
            },
            complete: function () {
                console.log('getUserCloudStorage', 'ok');
            }
        });
    },

    _getFriendsRank() {
        this.content.destroyAllChildren();
        wx.getUserInfo({
            openIdList: ['selfOpenId'],
            success: function (userRes) {
                // success
                console.log('success', userRes);
                let userData = userRes.data[0];
                //取出所有好友数据
                wx.getFriendCloudStorage({
                    keyList: ['x2'],
                    success: function (res) {
                        console.log('getFriendCloudStorage', res);
                        let data = res.data;
                        console.log('data.legnth', data.length);
                        data.sort((a, b) => {
                            if (a.KVDataList.length === 0 && b.KVDataList.length === 0) {
                                return 0;
                            }
                            if (a.KVDataList.length === 0) {
                                return 1;
                            }
                            if (b.KVDataList.length === 0) {
                                return -1;
                            }
                            return b.KVDataList[0].value - a.KVDataList[0].value;
                        });
                        for (let i = 0; i < data.length; ++i) {
                            let playerInfo = data[i];
                            console.log(playerInfo);
                            console.log(this.content);

                            let rankItem = cc.instantiate(this.rankItemPre);
                            rankItem.getComponent('RankItem').init(i, playerInfo);
                            this.content.addChild(rankItem);
                        }
                    }.bind(this),
                    fail: function (res) {
                        console.log('getFriendCloudStorage fail', res);
                    }
                });
            }.bind(this),

            fail: function () {
                // fail
                console.log('fail');
            },
            complete: function () {
                // complete
                console.log('complete');
            }
        });
    },

    _getGroupsFriendData(shareTicket) {
        this.content.destroyAllChildren();
        console.log('hhhhh');
        wx.getUserInfo({
            openIdList: ['selfOpenId'],
            success: function (userRes) {
                // success
                console.log('success', userRes.data);
                let userData = userRes.data[0];
                //取出所有好友数据
                wx.getGroupCloudStorage({
                    shareTicket: shareTicket,
                    keyList: ['x2'],
                    success: res => {
                        console.log("getGroupCloudStorage success", res);
                        let data = res.data;
                        data.sort((a, b) => {
                            if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                                return 0;
                            }
                            if (a.KVDataList.length == 0) {
                                return 1;
                            }
                            if (b.KVDataList.length == 0) {
                                return -1;
                            }
                            return b.KVDataList[0].value - a.KVDataList[0].value;
                        });
                        for (let i = 0; i < data.length; ++i) {
                            let playerInfo = data[i];
                            let item = cc.instantiate(this.rankItemPre);
                            item.getComponent('RankItem').init(i, playerInfo);
                            this.content.addChild(item);
                        }
                    },
                    fail: res => {
                        console.log('getFriendCloudStorage fail', res);
                    }
                })

            },
            fail: function () {
                // fail
                console.log('failfail');
            },
            complete: function () {
                // complete
            }
        });
    },

    onBtnClickToClose() {
        console.log('closeclose');
        wx.postMessage({
            message: 'close',
        });
    }
});
