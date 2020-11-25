// pages/mine/mine.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modal:false,
    modal5:false,
    isshow: true,
    statusBarHeight: 0,
    titleBarHeight: 0,
    love:'0',
    isZhi:true,
    mp4:true,
    button5: [{
      text: "再看看",
      type: 'gray'
    }, {
      text: "去开通",
      type:'red'
    }],
    button4: [{
      text: "取消",
      type: 'gray'
    }, {
      text: "去绑定",
      type: 'red'
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    this.setData({
      navH: app.globalData.navHeight
    })
    if (options.userid) {
      wx.setStorageSync('BangId', options.userid)
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
    this.getcode()
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        console.log(res)
        if (res.data.phone == null) {

        } else if (res.data.phone == '') {

        } else {
          var phone = that.plusXing(res.data.phone, 3, 4)
          that.setData({
            phone: phone
          })
        }
        if(res.data.id){
          if (res.data.phone == '' || res.data.phone == null) {
            wx.showModal({
              cancelText: '先逛逛',
              confirmText: '去绑定',
              confirmColor: '#f12200',
              cancelColor: '#cccccc',
              //  title: '你还未绑定家乡',
              content: '你还没绑定手机号。',
              success(res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: '/pages/bindphone/login',
                  })
                } else if (res.cancel) {

                }
              }
            })
          }
        }
        // if (res.data.phone == null || res.data.phone == ''){

        //   wx.redirectTo({
        //     url: '../bindphone/login?mine=' + 1
        //   })
        // }
        that.setData({
          user: res.data
        })
        console.log(that.data.user)
      },

    })
    that.getbanner();
    that.getnum();
    that.getnums();
    if (wx.getStorageSync('BangId')) {

      that.Bang();

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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    wx.showLoading({
      title: '刷新中',
    })
    that.getuser();
    setTimeout(function () {
      // wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      
    }, 1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '我是' + that.data.user.userName,
      path: '/pages/e_mine/mine?userid=' + that.data.user.loginId,

    }
  },
  huiyuan(){
     wx.showModal({
       cancelColor: 'cancelColor',
       confirmColor:'#f12200',
       content:'需要会员才能使用', 
       confirmText:"去开通",
       success(res){
         if(res.confirm){
           wx.navigateTo({
             url: '/pages/members/members',
           })
         }
       }

     })
  },
  //卡号激活
  kahji(){
     wx.navigateTo({
       url: '/pages/activation/activation',
     })
  },
  //商家入驻
  tap_sj(){
     wx.navigateTo({
       url: '/pages/union/shop_open/shop_open',
     })
  },
  tap_din(){
    wx.navigateTo({
      url: '/pages/union/order_list/order_list',
    })
  },
  //卡号领取
  kah(){
    wx.navigateTo({
      url: '../z_kahao/index',
    })
  },
  hide() {
    this.setData({
      modal: false
    })

  },
  handclick(e) {
    
      wx.navigateTo({
        url: '/pages/card/mine_assets/mine_assets',
      })
  
    this.hide()
  },
  //我的资产
  zic(){
    wx.navigateTo({
      url: '/pages/card/mine_assets/mine_assets',
    })
  },
  hide5() {
    this.setData({
      modal5: false
    })
  },
  zhizu(){
    this.setData({
      modal5: true
    })
  },
  handleClick5(e) {
    let index = e.detail.index;
    if(index == 1){
       wx.navigateTo({
         url: '../members/members',
       })
    }
    this.hide5()
  },
   //商品反馈
  feedback(){
    wx.navigateTo({
      url: '../feedbacklist/feedbacklist',
    })
  },
  //合伙人操作指南
  zhin(){
    wx.navigateTo({
      url: '../mp4/mp4',
    })
  },
  zhiru(){
    this.setData({
      isZhi: !this.data.isZhi
    })
    wx.navigateTo({
      url: '../zhin/zhin?code=' + this.data.code,
    })
  },
  xiaochu(){
    this.setData({
      isZhi: !this.data.isZhi
    })
  },
  //共享联盟
  union(){
    if (this.data.user.id == null || this.data.user.id == '') {
      wx.navigateTo({
        url: '../login/login?mine=' + 20,
      })
    } else {
      wx.navigateTo({
        url: '/pages/mine/union/union',
      })
    }
  },
  //分销收益
  wallet_detail(){
     wx.navigateTo({
       url: '../wallet_detail/wallet_detail',
     })
  },
  //大爱榜单
  love_help(){
    if (this.data.user.bindProvinceId == null || this.data.user.bindProvinceId == '') {
      wx.showModal({
        title: '提示',
        content: '大爱榜单需要绑定你的家乡哦',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../person/person',
            })
          } else if (res.cancel) {
            wx.navigateTo({
              url: '../person/person',
            })
          }
        }
      })
    }else{
      wx.navigateTo({
        url: '../love_help/love_help',
      })
    }

  },
  downloadFile: function (e) {
    console.log(e);
    let type = e.currentTarget.dataset.type;
    let url = e.currentTarget.dataset.url;
    // switch (type) {
    //   case "pdf":
    //     url += 'pdf';
    //     break;
    //   case "word":
    //     url += 'docx';
    //     break;
    //   case "excel":
    //     url += 'xlsx';
    //     break;
    //   default:
    //     url += 'pptx';
    //     break;
    // }
    wx.downloadFile({
      url: url,
      success: function (res) {
        console.log(res)
        var Path = res.tempFilePath              //返回的文件临时地址，用于后面打开本地预览所用
        wx.openDocument({
          filePath: Path,
          success: function (res) {
            console.log('打开文档成功')
          }
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })

  },
  //banner跳转
  banner(e) {
    console.log(e)
    if (e.currentTarget.dataset.xcxurl == '') {

    } else if (e.currentTarget.dataset.xcx.id == '') {
      wx.navigateTo({
        url: e.currentTarget.dataset.xcx.page,
      })
    } else {
      wx.navigateTo({
        url: e.currentTarget.dataset.xcx.page + e.currentTarget.dataset.xcx.id,
      })
    }
  },
  //意见
  option(){
    wx.navigateTo({
      url: '../mine_opinion/mine_opinion',
    })
  },
  //修改信息
  person(){
    console.log(111)
    wx.navigateTo({
      url: '/pages/person/person/person',
    })
  },
  //我的艺呗
  integral(){
     wx.navigateTo({
       url: '/pages/mine/mine_yb/mine_yb',
     })
  },
  //大学生认证
  college(){
     console.log(this.data.user.id == null)
    if (this.data.user.id == null || this.data.user.id == '') {
      wx.navigateTo({
        url: '../login/login?mine=' + 16,
      })
    } else{
      wx.navigateTo({
        url: '../college/college',
      })
    }

  },
  //实名认证
  certification(){
    if (this.data.user.id == null || this.data.user.id == '') {
      wx.navigateTo({
        url: '../login/login?mine=' + 18,
      })
    }else{
      wx.navigateTo({
        url: '../certification/certification',
      })
    }

  },
  //我的收藏
  collection(){
    if (this.data.user.id == null || this.data.user.id == '') {
      wx.navigateTo({
        url: '../login/login?mine=' + 15,
      })
    } else{
      wx.navigateTo({
        url: '../mine_collection/mine_collection',
      })
    }

  },
  //会员
  member(){
    if (this.data.user.id == null || this.data.user.id == '') {
      wx.navigateTo({
        url: '../login/login?mine=' + 13,
      })
    } else{
      wx.navigateTo({
        url: '../members/members',
      })
    }

  },
  //退款
  order_refund_list(){
    wx.navigateTo({
      url: '../order_refund_list/order_refund_list',
    })
  },
  //查看订单
  all(e){
   
      wx.navigateTo({
        url: '../login/login',

      })
      wx.setStorageSync('urls', '/pages/e_mine/mine')
    

  },
  //资助申请
  mine_fund(){
    if (this.data.user.id == null || this.data.user.id == '') {
      wx.navigateTo({
        url: '../login/login?mine=' + 14,
      })
    } else{
      wx.navigateTo({
        url: '../mine_fund/mine_fund',
      })
    }

  },
  //联系客服
  phone(){
    wx.showModal({
      title: '24小时全国免费咨询服务热线',
      content: '400-8292-878',
      confirmText:'立即拨打',
      success(res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '400-8292-878',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  //我的钱包
  wallet(){
    if (this.data.user.id == null || this.data.user.id == '') {
      wx.navigateTo({
        url: '../login/login',
      })
    } else{
      wx.navigateTo({
        url: '/pages/mine/mine_wallet/mine_wallet',
      })
    }

  },
  imgsrcs: function (e) {
    var that = this;
    console.log(e)
    // wx.showToast({
    //   title: '长按保存图片，扫码关注公众号',
    //   icon: 'none',
    //   duration: 3000
    // })
    //图片预览
    wx.previewImage({
      // current: 'https://xt-ylsj.oss-cn-shenzhen.aliyuncs.com/gns/gns_qrcode.jpg', // 当前显示图片的http链接
      urls: ['https://www.xingtu-group.cn/xcx_img/gzh1.jpg'],// 需要预览的图片http链接列表

    })
  },
 
  //登录
  login(){
     wx.navigateTo({
       url: '/pages/login/login',
     })
     wx.setStorageSync('urls', '/pages/e_mine/mine')
  },
  //收货地址
   address(){
     if (this.data.user.id == null || this.data.user.id == '') {
       wx.navigateTo({
         url: '../login/login?mine=' + 17,
       })
     } else{
       wx.navigateTo({
         url: '../address/address',
       })
     }

   },
   //信息大码
  plusXing(str, frontLen, endLen) {
    var len = str.length - frontLen - endLen;
    var xing = '';
    for (var i = 0; i < len; i++) {
      xing += '*';
    }
    return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
  },
  //轮播
  getbanner() {
    let that = this;
    let data = {
         type:4
    }
    app.res.req('/banner/banner', data, (res) => {

      if (res.status == 1000) {
        for (var i in res.data) {
          if (res.data[i].xcxUrl != '') {
            res.data[i].xcx = JSON.parse(res.data[i].xcxUrl)
          }

        }

        that.setData({
          banner: res.data,

        })
        //that.Detail();
       

      } else if (res.status == 1004 || res.status == 1005) {
        wx.redirectTo({
          url: '../login/login',
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  Detail() {
    let that = this;
    let data = {

    }

    app.res.req('/user/donationinfo', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {

        that.setData({
          love: res.data.totalMoney
        })
        setTimeout(function () {
          that.getuser();
        }, 200)
        

      }else if(res.status == 1002){
        setTimeout(function () {
          that.getuser();
        }, 200)
      } else if (res.status == 1024) {

      }  else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //二维码
  getcode() {
    let that = this;
    let data = {

    }

    app.res.req('/qrcode/xcx', data, (res) => {
     
      if (res.status == 1000) {
        var base64 = res.data.replace(/[\r\n]/g, "")
        var array = wx.base64ToArrayBuffer(base64)
        const fsm = wx.getFileSystemManager();
        const FILE_BASE_NAME = 'mine_base64';
        const filePath = wx.env.USER_DATA_PATH + '/' + FILE_BASE_NAME + '.png';
        fsm.writeFile({
          filePath,
          data: array,
          encoding: 'binary',
          success() {
            console.log(filePath)
            that.setData({
              errormsg: '',
              code: filePath //结果图片
            })
          },
          fail() {

          },
        });
      
         
      
      } else if (res.status == 1005) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/login/login',
          })
          wx.setStorageSync('urls', '/pages/e_mine/mine')
        })
      } else if (res.status == 1018) {

      } else if (res.status == 1024) {
         
      }  else {
        // wx.showToast({
        //   title: res.msg,
        //   icon: 'none'
        // })
      }
    })
  },
  //去绑定手机号
  getPhoneNumber: function (e) {
    var that = this;
    console.log(e)
    wx.request({
      url: app.data.urlmall + "/login/xcxbindphone",
      data: {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        sessionKey: wx.getStorageSync('sessionkey')
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        token: wx.getStorageSync('token')
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data)
        if (res.data.status === 1000) {
          wx.setStorage({
            key: 'token',
            data: res.data.data.token,
          })
          wx.setStorage({
            key: 'userinfo',
            data: res.data.data,
          })
              that.setData({
                user: res.data.data
              })
        } else if (res.data.status === 1002) {
          wx.showToast({
            title: '绑定失败',
            icon: 'none'
          })
        

        }
      }
    })
  },
  shouj(){
     wx.navigateTo({
       url: '../bindphone/login',
     })

  },
  ewm: function (e) {
    var that = this;
    console.log(e)
    wx.previewImage({
      urls: [this.data.code],
    })
    // wx.navigateTo({
    //   url: '../zhin/zhin?code=' + this.data.code,
    // })
    
    //图片预览
   
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
        that.getuser()
      }
    })
  },
  //领取提示
  getnums() {
    let that = this;
    let data = {
      memberType: 1
    }

    app.res.req('/membercard/unclaimedcardnum', data, (res) => {
      console.log(res.data)
      if (res.status == 1000 ) {
        if(res.data != 0 ){
          if (!res.data.index){
            that.setData({
              modal: true
            })
          }
         
        }
        if (res.data > 0) {
          wx.showTabBarRedDot({
            index: 2,
          })

        } else {
          wx.hideTabBarRedDot({
            index: 2,
          })
        }
        that.setData({
          nums: res.data
        })

      }else if(res.status == 1024){
        
      } else {
        // wx.showToast({
        //   title: res.msg,
        //   icon: 'none'
        // })
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
          user:res.data
        })
      }
    })
  },
  ylsj(e) {
    //娱乐世界
    wx.showToast({
      title: '艺呗抵扣' + e.currentTarget.id + '%',
      icon:'none'
    })
    setTimeout(()=>{
      wx.navigateToMiniProgram({
        appId: 'wxf556b39ee9c934b4',
        path: 'pages/my_idol/my_idol',
        extraData: {

        },
        envVersion: 'release',
        success(res) {
          // 打开成功
        }
      })
    },1500)
   

  },
  yslm(e) {
    //艺赛联盟
    wx.showToast({
      title: '艺呗抵扣' + e.currentTarget.id + '%',
      icon: 'none'
    })
    setTimeout(()=>{
      wx.navigateToMiniProgram({
        appId: 'wx4cef4fe6585f5bfd',
        path: 'pages/e_home/e_home',
        extraData: {

        },
        envVersion: 'release',
        success(res) {
          // 打开成功
        }
      })
    },1500)
    

  },
  wypt(e) {
    wx.showToast({
      title: '艺呗抵扣' + e.currentTarget.id + '%',
      icon: 'none'
    })
    //艺赛联盟
   setTimeout(()=>{
     wx.navigateToMiniProgram({
       appId: 'wx4cef4fe6585f5bfd',
       path: 'pages/e_home/e_home',
       extraData: {

       },
       envVersion: 'release',
       success(res) {
         // 打开成功
       }
     })
   },1500)

  },
  //文艺商学
  wysx(e){
    if(e.currentTarget.id == 0){
      wx.navigateTo({
        url: '../community/community',
      })
    }else{
      wx.showToast({
        title: '暂未开放',
        icon: 'none'
      })
    }
  
  },
   //绑定
  Bang() {
    let that = this;

    let data = {
      id: wx.getStorageSync('BangId')
    }

    app.res.req("/user/sharebinduser", data, (res) => {

      if (res.status == 1000) {
        // wx.showToast({
        //   title: '绑定成功',
        // })

        wx.removeStorageSync('BangId')
      } else if (res.status == 1028) {
        console.log('----1028----')
      } else if (res.status == 1030) {
        wx.removeStorageSync('BangId')
        console.log('----1030----')
      } else if (res.status == 1031) {
        wx.removeStorageSync('BangId')
        console.log('----1031----')
      } else if (res.status == 1040) {
        wx.removeStorageSync('BangId')
        console.log('----1040----')
      }
    })
  },
})