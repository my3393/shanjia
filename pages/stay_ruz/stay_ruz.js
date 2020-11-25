// packageA/pages/stay_ruz/stay_ruz.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.getAudit();
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

  },
  commany_ruz(){
    wx.navigateTo({
      url: '../company_ruz/commpany_ruz',
    })
  },
  person_ruz(){
    wx.navigateTo({
      url: '../person_ruz/person_ruz',
    })
  },
  getAudit() {
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    let data = {
      enterpriseType:1
    }

    app.res.req('/sqapply/enterpriseinfo', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        if (res.data == null) {
          that.setData({

            audit: 3
          })
        } else {
          that.setData({
           
            audit: res.data.auditStatus
          })
        }
        that.setData({
          load: false
        })
        
        wx.hideLoading()

      } else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {
        wx.redirectTo({
          url: '../login/login',
        })
      } 
    })
  },
})