// pages/store_detail/store_detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show2:false,
    modal:false,
    cart_num:'0',
    cart:[],
    button: [{
      text: "取消",
      type: 'gray'
    }, {
      text: "确定",
      type: 'red'
    }],
    money:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id : options.id
    })
      
      
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
    let that = this
     //获取本地用户信息
     this.getDetail()
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        console.log(res)
        that.setData({
          user: res.data
        })
      },
    })
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
    var that = this; 
    return {
      title: '我是' + that.data.user.userName ,
      path: '/pages/store_detail/store_detail?userid=' + that.data.user.loginId + '&id=' + that.data.id ,

    }
  }, 
  //yul
  yul(e){
    wx.previewImage({
      current:e.currentTarget.id,
      urls:this.data.detail.productDetailImgOss
    })
  },
  //购物车弹窗
  cart(){
    if(this.data.cart_num == 0){
      wx.showToast({
        title: '你还没有添加商品哦',
        icon:'none'
      })
    }else{
      this.setData({
        show2: !this.data.show2,
      })
    }
   
    
  },
  showPopup2() {
    this.setData({ show2: true });
  },
  onClose2() {
    this.setData({ show2: false });
  },
  hide() {
    this.setData({
      modal: false
    })
  },
  handleClick(e) {
    let index = e.detail.index;
    if(index == 1){
      this.cleancart()
    }
   
    this.hide()
  },
  //提交订单
  submit(e){
    if(this.data.cart == ''){
      wx.showToast({
        title: '您还没有选择商品哦！',
        icon:'none'
      })
    } else if (this.data.sendFee > 0){
      wx.showToast({
        title: '你还差'+ this.data.sendFee + '元才能配送哦！',
        icon: 'none'
      })

    }else{
      wx.navigateTo({
        url: '../union/order_sure/order_sure?storeid=' + this.data.detail.storeId ,
      })
    }
   
  },
  c_cart(e){
    this.setData({
      modal:true
    })
 },
 //加入购物车
 addCount(e) {
  let that = this;

  let data = {
    productId:that.data.id
  }

  app.res.req('/sqshopcart/add', data, (res) => {
  
    if (res.status == 1000) {
      that.getcart()
    }else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {
        
      wx.redirectTo({
        url: '/pages/login/login',
      })
      var url = '/pages/store_detail/store_detail?id=' + that.data.id
      wx.setStorageSync('url', url)
    } else if (res.status == 1024) {
      wx.showToast({
        title: '请先重新登录绑定手机号',
        icon: 'none'
      })
      setTimeout(()=>{
        wx.navigateTo({
          url: '/pages/login/login',
        })
        var url = '/packageA/pages/store_detail/store_detail?id=' + that.data.id
        wx.setStorageSync('url', url)
      },1500)
    }else{
      wx.showToast({
        title: res.data,
        icon: 'none'
      })
    }
  })
},
  //购物车加
  addCount_num(e){
    let that = this;

    let data = {
      productId: e.currentTarget.id
    }

    app.res.req('/sqshopcart/addbuycount', data, (res) => {

      if (res.status == 1000) {
        that.getcart()
      } else {
        wx.showToast({
          title: res.data,
          icon: 'none'
        })
      }
    })
  },
   //购物车列表
   getcart() {
    let that = this;

    let data = {
      storeId: that.data.detail.storeId
    }

    app.res.req('/sqshopcart/list', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
       
        var z_price = 0;
         if(res.data == ''){
           that.setData({
             cart_num: 0,
             show2: false
           })
         }else{
           var cart_num = 0;
           for (var i in res.data) {
             //购物车价格
             if (res.data[i].promotionType == 0) {
               z_price = z_price + res.data[i].salePrice * res.data[i].buyCount
             } else {
               z_price = z_price + res.data[i].activityPrice * res.data[i].buyCount
             }
             //购物车数量

             cart_num = Number(cart_num) + Number(res.data[i].buyCount)
             that.setData({
               cart_num,

             })
         }
         
        }
      
        that.setData({
          cart: res.data,
          z_price: z_price.toFixed(2),
         
        })
        setTimeout(()=>{
          that.setData({ sendFee: (that.data.store.sendFee - z_price).toFixed(2)})
        },2000)
      } else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {
        
        // wx.redirectTo({
        //   url: '/pages/login/login',
        // })
        // var url = '/pages/store_home/store_home?id=' + that.data.detail.storeId 
        // wx.setStorageSync('url', url)
      }else if(res.status == 1024){

      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
   //购物车减
   minusCount_num(e) {
    let that = this;

    let data = {
      productId: e.currentTarget.id
    }

    app.res.req('/sqshopcart/delbuycount', data, (res) => {

      if (res.status == 1000) {
        that.getcart()
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
   //清空购物车
   cleancart(e) {
    let that = this;

    let data = {
      storeId:that.data.detail.storeId
    }

    app.res.req('/sqshopcart/cleancart', data, (res) => {

      if (res.status == 1000) {
        
        that.getcart()
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //店铺详情
  getstore() {
    let that = this;

    let data = {
     storeId:that.data.detail.storeId
    }

    app.res.req('/sqproduct/storedetail', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          store:res.data
        })
        
        wx.setNavigationBarTitle({
          title:res.data.storeName
        })
       
      } else if (res.status == 1004 || res.status == 1005 || res.status == 1018 || res.status == 1024) {
        wx.showToast({
          title: '请重新登录',
          icon: 'none'
        })
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/login/login',
          })
        
            var url = '/pages/store_home/store_home?id=' + storeid
        
         
          wx.setStorageSync('url', url)
        }, 1500)
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  getDetail() {
    let that = this;
    let data = {
      productId: that.data.id
    }

    app.res.req("/sqproduct/productdetail", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        if (res.data.promotionType == 0) {
          res.data.money = (res.data.memberDeductionRatio * res.data.salePrice).toFixed(2)
        } else {
          res.data.money = (res.data.memberDeductionRatio * res.data.activityPrice).toFixed(2)
        
        }
       
       
        that.setData({
          detail: res.data
        })
        that.getstore()
        this.getcart()
      
      }else if (res.status == 1004 || res.status == 1005 || res.status == 1018) {
        
        wx.redirectTo({
          url: '/pages/login/login',
        })
        var url = '/pages/store_detail/store_detail?id=' + that.data.id
        wx.setStorageSync('url', url)
      } else{
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
   //计算距离
   formSubmit(e) {
    var _this = this;
    //调用距离计算接口
    qqmapsdk.calculateDistance({
      //mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
      //from参数不填默认当前地址
      //获取表单提交的经纬度并设置from和to参数（示例为string格式）
      from: '', //若起点有数据则采用起点坐标，若为空默认当前地址
      // to: e.detail.value.dest, //终点坐标

      to: [{
        latitude: _this.data.store.latitude,
        longitude: _this.data.store.longitude
      }],
      success: function (res) {//成功后的回调
        // console.log(res);
        var res = res.result;
        var dis = [];
        for (var i = 0; i < res.elements.length; i++) {
          dis.push(res.elements[i].distance); //将返回数据存入dis数组，
        }
        if (dis < 1000) {
          dis = dis + "m"
        } else if (dis > 1000) {
          dis = (Math.round(dis / 100) / 10).toFixed(1) + "km"

        }
        console.log(dis)
        _this.setData({ //设置并更新distance数据
          distance: dis
        });

      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },
})