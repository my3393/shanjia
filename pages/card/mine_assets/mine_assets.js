// pages/mine_assets/mine_assets.js
const app = getApp();
let card = [];
let cards = [];
let detail =[];
let currentPage=1;
let receiveUserName;
let receiveUserId;
var userid = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
     tag:[
       { name: '待领取资产' },
       { name: '资产状态' },
       { name: '资产说明' },
       {name:'申领记录'},
     ],
     tar:0,
    modal: false,
    modal2: false,
    modal3: false,
    again:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.tar){
      this.setData({ tar: options.tar})
      this.applycardrecord()
    }
    if(options.userid){
      userid = options.userid
    }
     this.getdai();
     this.getnum();
    if (decodeURIComponent(options.q).split('/')[4]) {
      console.log(options.q)
      wx.setStorageSync('bangId', decodeURIComponent(options.q).split('/')[4])
      // that.Bang();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    //获取本地用户信息
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {

        that.setData({
          user: res.data
        })
      },
    })
    if (wx.getStorageSync('bangId')) {
      that.Bang();
      that.Bangs()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
     card = [];
     cards = [];
     detail =[]
     currentPage = 1;
  }, 

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      let that  = this;
      currentPage = currentPage + 1
      if(that.data.tar == 1){
        
        that.getzhuan();
      }else if(that.data.tar == 0){
        that.getdai();
      } else if (that.data.tar == 2) {
        that.applycardrecord()
      }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '我是' + that.data.user.userName,
      path: '/pages/card/mine_assets/mine_assets?userid=' + that.data.user.loginId,

    }
  },
  member(){
    wx.navigateTo({
      url: '/pages/members/members',
    })

  },
  again(e) {
   
    this.setData({
      again: e.detail.value
    })
  },
  //拨打电话
  phone(e){
    
    receiveUserId = e.currentTarget.id
    receiveUserName = e.currentTarget.dataset.name
    this.setData({
      modal3:true
    })
   
  },
  hide3() {
    this.setData({
      modal3: false
    })

  },
  click3(e){   
    if(this.data.again == '' || this.data.again == 0){
      wx.showToast({
        title: '请输入需要的张数',
        icon: 'none'
      })
     
    }else{
      this.submitapplycard()
    }
   
  },
  submitapplycard(){
    let that = this;
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      console.log('阻断')
      wx.showToast({
        title: '你的操作太快了',
        icon: 'none'
      })
      return;
    }
    let data = {
      receiveLoginId: receiveUserId,
        receiveUserName: receiveUserName,
        memberType:1,
        cardNum:that.data.again
    }
    app.res.req('/membercard/submitapplycard', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          modal3:false
        })
         wx.showToast({
           title: '申领成功',

         })

      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
    this.setData({
      tapTime: nowTime
    });
  },
  //确定还是拒绝
  confirmapplycard(e){
    let that = this;
    wx.showModal({
      cancelText: '拒绝',
      confirmText: '同意',
      confirmColor: '#f12200',
      // cancelColor: '#cccccc',
      //  title: '你还未绑定家乡',
      content: '请选择同意还是拒绝',
      success(res) {
        if (res.confirm) {
          let data = {
            id:e.currentTarget.id,
            status:1
            }
          app.res.req('/membercard/confirmapplycard', data, (res) => {
            console.log(res.data)
            if (res.status == 1000) {
              detail = []
              currentPage = 1
              that.applycardrecord()
              that.getnum()
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none'
              })
            }
          })
        } else if (res.cancel) {
          let data = {
            id: e.currentTarget.id,
            status: 2
          }
          app.res.req('/membercard/confirmapplycard', data, (res) => {
            console.log(res.data)
            if (res.status == 1000) {
              detail =[]
              currentPage = 1
              that.applycardrecord()
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none'
              })
            }
          })
        }
      }
    })
    
    
  },
  jihuo() {
    this.setData({
      modal: true,
    })
  },
  hide() {
    this.setData({
      modal: false
    })

  },
  handclick() {
    this.hide()
    if (this.data.num == 0) {
      this.setData({
        modal2: true
      })
    } else {
      this.active()
    }
    
  },
  hide2() {
    this.setData({
      modal2: false
    })

  },
  handclick2(e) {
    this.setData({
      memberType: 1
    })
    wx.navigateTo({
      url: '/pages/members/members',
    })

    this.hide2()
  },
  //转赠
  zhuanz() {
    wx.navigateTo({
      url: '../assets_expel/assets_expel',
    })
  },
  //明细
  minx() {
    wx.navigateTo({
      url: '../assets_mx/assets_mx',
    })
  },
  tag(e){
    let that = this;
    console.log(e)
    var index = e.currentTarget.dataset.index
    currentPage = 1
    if(index == 1){
      card = []
      that.getzhuan()
    }else if(index == 0){
      cards = []
      that.getdai();
    }else if(index == 3){
       detail = []
      that.applycardrecord()
    }
    this.setData({
      tar:e.currentTarget.dataset.index
    })
  },
  //张数
  getnum() {
    let that = this;
    let data = {
      memberType: 1
    }

    app.res.req('/membercard/findcardnum', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          num: res.data
        })

      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //激活会员卡
  active() {
    let that = this;
    let data = {
      memberType: 1
    }

    app.res.req('/membercard/activatecard', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.getnum();
        that.getuser();
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //领取
  lingqu(e) {
    let that = this;
    console.log(e)
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      console.log('阻断')
      return;
    }

   

    let data = {
      receiveId: e.currentTarget.id
    }

    app.res.req('/membercard/receivecard', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        if(e.currentTarget.dataset.sendtype == 1){
          wx.navigateTo({
            url: '/pages/activation/activation',
          })
        }
        that.getnum();
        currentPage = 1;
        cards = []
        that.getdai();
        wx.showToast({
          title: '领取成功',
          icon:'none',
          mask:true
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
    this.setData({
      tapTime: nowTime
    });
  },
  //申请记录
  applycardrecord(e) {
    let that = this;
    let data = {
      currentPage: currentPage
    }

    app.res.req('/membercard/applycardrecord', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        if (res.data.data == '' && currentPage != 1) {
          wx.showToast({
            title: '没有了哦',
            icon: 'none'
          })
        } else {
          detail.push(...res.data.data)
          that.setData({
            detail: detail
          })

        }

      }else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //状态
  getzhuan(e) {
    let that = this;
    let data = {
      memberType: 1,
      currentPage: currentPage
    }
    app.res.req('/membercard/sendcardrecord', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        if(res.data.data == '' && currentPage != 1){
          wx.showToast({
            title: '没有了哦',
            icon:'none'
          })
        }else{
          card.push(...res.data.data)
          that.setData({
            card: card
          })
        }

      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //待领取
  getdai(e) {
    let that = this;
    let data = {
      memberType:1,
      currentPage: currentPage
    }

    app.res.req('/membercard/receivecardrecord', data, (res) => {
      console.log(res.data.data)
      if (res.status == 1000) {
        if (res.data.data == '' && currentPage != 1) {
          wx.showToast({
            title: '没有了哦',
            icon: 'none'
          })
        } else{
          cards.push(...res.data.data)
          that.setData({
            cards: cards
          })

        }
       
      } else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {
        console.log(1)
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/login/login',
          })
          var url = '/pages/mine_assets/mine_assets?userid=' + userid
          wx.setStorageSync('url', url)
        }, 2000)
        
      } else if (res.status == 1024){
        wx.showToast({
          title: '你还没绑定手机号,要重新登录绑定手机号',
          icon:'none',
          duration:2000
        })
       setTimeout(()=>{
         wx.redirectTo({
           url: '/pages/login/login',
         })

         wx.setStorageSync('url', '../mine_assets/mine_assets')
       },2000)

      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //获取用户信息
  getuser() {
    let that = this;
    let data = {

    }

    app.res.req('/user/info', data, (res) => {
      console.log(res.data)
      wx.hideLoading()
      if (res.status == 1000) {
        wx.setStorage({
          key: 'token',
          data: res.data.token,
        })
        wx.setStorage({
          key: 'userinfo',
          data: res.data,
        })
        that.setData({
          user: res.data,

        })

      }
    })
  },
  //领取会员卡
  Bangs() {
    let that = this;

    let data = {
      shareLoginId: wx.getStorageSync('bangId')
    }

    app.res.req("/membercard/scancodereceive", data, (res) => {

      // if (res.status == 1000) {
      //   // wx.showToast({
      //   //   title: '绑定成功',
      //   // })

      //   wx.removeStorageSync('bangId')
      // } else if (res.status == 1028) {
      //   console.log('----1028----')
      // } else if (res.status == 1030) {
      //   wx.removeStorageSync('bangId')
      //   console.log('----1030----')
      // } else if (res.status == 1031) {
      //   wx.removeStorageSync('bangId')
      //   console.log('----1031----')
      // } else if (res.status == 1040) {
      //   wx.removeStorageSync('bangId')
      //   console.log('----1040----')
      // }
    })
  },
  //绑定
  Bang() {
    let that = this;

    let data = {
      id: wx.getStorageSync('bangId')
    }

    app.res.req("/user/sharebinduser", data, (res) => {

      if (res.status == 1000) {
        // wx.showToast({
        //   title: '绑定成功',
        // })

        wx.removeStorageSync('bangId')
      } else if (res.status == 1028) {
        console.log('----1028----')
      } else if (res.status == 1030) {
        wx.removeStorageSync('bangId')
        console.log('----1030----')
      } else if (res.status == 1031) {
        wx.removeStorageSync('bangId')
        console.log('----1031----')
      } else if (res.status == 1040) {
        wx.removeStorageSync('bangId')
        console.log('----1040----')
      }
    })
  },
})