let avater = '';
let iv = '';
let encryptedData = '';
const app = getApp();
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    detail_id: '',
    userid: '',
    mine: '',
    store_refund: '',
    storeId: '',
    det: '',

  },
  onLoad(options) {
   // console.log(options)
    let that = this;
   
    // 查看是否授权
    wx.getSetting({
      success(res) {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          
          wx.login({
            success: function(res) {
              wx.getUserInfo({
                success: function(res) {
                  console.log(res)
                  iv = res.iv
                  encryptedData = res.encryptedData
                  avater = JSON.parse(res.rawData)
                  wx.setStorage({
                    key: 'avater',
                    data: avater,
                  })

                }
              })
              wx.setStorage({
                key: 'code',
                data: res.code,
              })
             
            }
          });
        }
      }
    })
  },
  bindGetUserInfo(e) {
    console.log(e)
    var that = this;
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 800) {
      console.log('阻断')
      return;
    }
    wx.showLoading({
      title: '登录中',
    })
    wx.getSetting({
      success(res) {
       
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称

          wx.login({
            success: function(res) {
              wx.getUserInfo({
                success: function(res) {
                  console.log(res)
                  iv = res.iv
                  encryptedData = res.encryptedData
                  avater = JSON.parse(res.rawData)
                  wx.setStorage({
                    key: 'avater',
                    data: avater,
                  })

                }
              })
              wx.setStorage({
                key: 'code',
                data: res.code,
              })
              if (res.code) {

                setTimeout(function() {
                  wx.request({
                    url: "https://gnssq.xcx.api.xingtu-group.cn/api-gnssqxcx/login/xcxlogin",
                    data: {
                      code: res.code,
                      encryptedData: encryptedData,
                      iv: iv
                    },
                    method: 'POST',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    dataType: 'json',
                    success: function(res) {
                      console.log(res.data);

                      if (res.data.status == 1000) {
                        wx.hideLoading()
                        wx.setStorage({
                          key: 'token',
                          data: res.data.data.token,
                        })
                        wx.setStorage({
                          key: 'sessionkey',
                          data: res.data.data.sessionKey,
                        })
                        wx.setStorage({
                          key: 'userinfo',
                          data: res.data.data,
                        })
                        if (that.data.userid) {
                          wx.setStorage({
                            key: 'bangId',
                            data: that.data.userid,
                          })
                        }

                        if (res.data.data.phone == null || res.data.data.phone == '') {
                          console.log('未绑定手机号')
                          wx.redirectTo({
                            url: '../bindphone/login',
                          })

                          // wx.redirectTo({
                          //   url: '../good_detail/good_detail?id=' + that.data.detail_id
                          // })

                        } else if (wx.getStorageSync('urls')) {
                          console.log('-----url----')

                          wx.switchTab({
                            url: wx.getStorageSync('urls'),
                          })


                          wx.removeStorageSync('urls')
                        } else if (wx.getStorageSync('url')) {
                          console.log('-----url----')
                        
                            wx.redirectTo({
                              url: wx.getStorageSync('url'),
                            })
                          
                          
                          wx.removeStorageSync('url')
                        } else {
                         
                          wx.switchTab({
                            url: '../e_mine/mine'
                          })
                        }

                      } else {
                        wx.showToast({
                          title: res.data.msg,

                        })
                        
                      }
                    }
                  })
                }, 800)
              }
            }
          });
        } else {
          that.gettoken();

        }
      }
    })
    this.setData({
      tapTime: nowTime
    });
  },
  gettoken: function(e) {
    var that = this;

    wx.request({
      url: "https://gnssq.xcx.api.xingtu-group.cn/api-gnssqxcx/login/defaultlogin",
      data: {

      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function(res) {
        console.log(res.data.data)
        if (res.data.status === 1000) {
          wx.setStorage({
            key: 'token',
            data: res.data.data.token,
          })
          wx.setStorage({
            key: 'userinfo',
            data: res.data.data,
          })
          wx.switchTab({
            url: '../e_home/home'
          })
          console.log(111)
        } else if (res.data.status === 103) {
          wx.redirectTo({
            url: '/pages/login/login',
          })

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })

  },
  //绑定
  Bang() {
    let that = this;
    let data = {
      id: wx.getStorageSync('bangId')
    }

    app.res.req("app-web/user/sharebinduser", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        // wx.showToast({
        //   title: '绑定成功',
        // })
        console.log('----绑定成功---')
        wx.removeStorageSync('bandId')
      } else if (res.status == 1028) {

      } else if (res.status == 1030) {
        wx.removeStorageSync('bandId')
        console.log('----已经绑定----')
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
})