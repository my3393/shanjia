// packageA/pages/union/order_sure/order_sure.js
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
const app = getApp();

var qqmapsdk = new QQMapWX({
  key: 'PVXBZ-SXVC3-BSV3N-YN6BC-3IV45-DGF2L' // 必填
});
let storeid;
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
     type:['商家配送','到店自提'],
     tar:0,
    address: false,
    defalutaddres: [], //默认地址
    adress: [], //选择的地址
    inpu: '',
    loading: true,
    phone:'',
    deductionIntegral: '0',
    sendType:1,
    multiArray:[],
    time:'',
    phone:'',
    remark:'',
    checked:true,
    vals:['sf','dw'],
    dk_price:0,
    zk_price:0,
    z_price:0,
    minHour: 10,
    maxHour: 20,
    minDate: new Date().getTime(),
    maxDate: new Date(2021, 10, 1).getTime(),
    currentDate: new Date().getTime(),
    show:false,
    show2:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    storeid = options.storeid
    this.setData({
      distance:options.distance
    })
    this.getstore()
   
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
    if (wx.getStorageSync('address')) {
      wx.getStorage({
        key: 'address',
        success: function (res) {
          console.log(res.data)
          that.setData({
            adress: res.data
          })
          that.getDefaultaddress()
        },
      })
    } else {
      that.getDefaultaddress()
      that.setData({
        adress: []
      })
    }
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        if(res.data.memberType == 1){
          that.setData({
            show2: true
          })
        }
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

  },
  //会员弹窗
  confirm2(){
        wx.navigateTo({
          url: '/pages/members/members',
        })
  },
  //送达时间
  onClose(){
    var aa = this.data.show
    this.setData({
      show:!aa
    })
  },
 
  confirm(e){
    this.onClose()
  
        
     var s = this.set_time(e.detail);   
     this.setData({
       time:s
     })
   
   
  },
  //查看协议
  web() {
    wx.navigateTo({
      url: '/pages/agreement_store/agreement_store?src=' + 'https://www.xingtu-group.cn/sjg_xieyi/collect_yourself.html',
    })
  },
  phone(e){
    this.setData({
      phone:e.detail.value
    })
  },
  //去店里
  go(){
    var name = this.data.store.provinceName + this.data.store.cityName + this.data.store.areaName + this.data.store.townName + this.data.store.detailAddress
    wx.openLocation({
      name:name,

      latitude: this.data.store.latitude,
      longitude: this.data.store.longitude,
      scale: 18
    })
  },
  tag(e){
    if (e.currentTarget.dataset.num == 1 && this.data.store.isInvite == 0){
       wx.showToast({
         title: '该商家暂不支持到店自取',
         icon:'none'
       })
    }else{
      this.setData({
        tar: e.currentTarget.dataset.num,
        sendType: Number(e.currentTarget.dataset.num) + 1
      })
    }
   
  },
  remark(e){
    this.setData({
      remark:e.detail.value
    })
  },
  //计算送达时间
  calculate_time(){
    var that = this;
     var date = new Date();
     var currentHours = date.getHours(); //获取当前时间 时
    var currentMinute = date.getMinutes();//获取当前时间 秒
    var temp = [];
    var start = that.data.store.startTime.substring(0, 2)
    var end = that.data.store.endTime.substring(0,2)//截取店铺结束时间前两位
    if (that.data.store.isNight == '1') {
      temp[0] = ["今天", '凌晨'];
      end = '24'
    } else {
      temp[0] = ["今天"];
    }
    var j = 0
    //判断当前时间是否在30分钟内
    if ( 30>currentMinute >0){
      j++
    }
    if(currentMinute >30){
      currentHours++
    }
  
     
  
    
  
    
     temp[1] = [];
    
     //每半小时累加
    for (let i = currentHours; i < end; i++) {
      var i1 = Number(i)+ 1;
      if (j % 2 == 0){
        temp[1].push(i + ':00' + '-' + i + ':30')
        j++
      }
      
      if(j % 2 != 0){
        temp[1].push(i + ':30' + '-' + i1 + ':00')
        j++
      }
     
      // i += 1;
    }
    this.setData({
      multiArray: temp,
    })
  },
  bindcolumnchange(e){
    var that = this
    console.log(e)
    console.log('第几列发生变化', e.detail.column)
    console.log('选择第几个', e.detail.value)
    var date = new Date();
    var currentHours = date.getHours(); //获取当前时间 时
    var currentMinute = date.getMinutes();//获取当前时间 秒
    let c = e.detail.column;
    let v = e.detail.value;
    var temp = this.data.multiArray;
    var start = that.data.store.startTime.substring(0, 2)
   
  
    if(c == 0){
      console.log(temp)
      if (temp[c][v] == '今天') {
        var j = 0
        if (that.data.store.isNight == '1') { //判断是否有凌晨
          var  end = '24'
        }else{
          var end = that.data.store.endTime.substring(0, 2)
        }
        if (30 > currentMinute > 0) {
          j++
        }
        if (currentMinute > 30) {
          currentHours++
        }
        temp[1] = [];
         
        
        //每半小时累加
        for (let i = currentHours; i < end; i++) {
          var i1 = Number(i) + 1;
          if (j % 2 == 0) {
            temp[1].push(i + ':00' + '-' + i + ':30')
            j++
          }

          if (j % 2 != 0) {
            temp[1].push(i + ':30' + '-' + i1 + ':00')
            j++
          }

          // i += 1;
        }
      }else{
        var j = 0
        start = '00'
        temp[1] = [];
        var end = that.data.store.endTime.substring(0, 2)
        //每半小时累加
        for (let i = '00'; i < end; i++) {
          var i1 = Number(i) + 1;
          if (j % 2 == 0) {
            temp[1].push(i + ':00' + '-' + i + ':30')
            j++
          }

          if (j % 2 != 0) {
            temp[1].push(i + ':30' + '-' + i1 + ':00')
            j++
          }

          // i += 1;
        }
      }
      //判断当前时间是否在30分钟内
      
    }
    this.setData({
      multiArray: temp,
    })
  },
  xuan_time(e){
    console.log(e)
    let temp = this.data.multiArray;
      this.setData({
        time: temp[0][e.detail.value[0]]  + temp[1][e.detail.value[1]]
      })
   
    
    
  },
  //选择地址
  choose() {
    var that = this;
    wx.navigateTo({
      url: '/pages/address/address?sex=' + 1,
    })
  },
  checked(e){
    this.setData({
      checked: !this.data.checked
    })
  },
  //店铺详情
  getstore() {
    let that = this;

    let data = {
      storeId: storeid
    }

    app.res.req('/sqproduct/storedetail', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          store: res.data
        },()=>{
          that.getcart();
          that.calculate_time()
        })
       
       
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //购物车列表
  getcart() {
    let that = this;

    let data = {
      storeId: storeid
    }

    app.res.req('/sqshopcart/list', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {

       
        if (res.data == '') {
          that.setData({
            cart_num: 0,
            show2: false
          })
        } else {
          var z_price = 0;
          var zk_price = 0;
          var cart_num = 0;
          var price = 0
          for (var i in res.data) {
            //购物车价格sendFee
            if(res.data[i].promotionType == 0){
              price = res.data[i].salePrice
            }else{
              price = res.data[i].activityPrice
            }
            if(that.data.user.memberType == 0){
              zk_price = zk_price + price * res.data[i].buyCount  * (1- res.data[i].defaultDeductionRatio) 
              z_price = z_price + price * res.data[i].buyCount  
            }else{
              var a = price * res.data[i].buyCount  * (1- Number(res.data[i].memberDeductionRatio))
              zk_price = zk_price +a
              z_price = z_price + price * res.data[i].buyCount   
            }
            // if (res.data[i].promotionType == 0) {
            //   z_price = z_price + res.data[i].salePrice * res.data[i].buyCount
            // } else {
            //   z_price = z_price + res.data[i].activityPrice * res.data[i].buyCount
            // }
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
          zk_price: zk_price.toFixed(2),
          dk_price:( z_price - zk_price).toFixed(2),
        })
        // that.price()
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //获取默认地址
  getDefaultaddress() {
    let that = this;
    let data = {

    }
    app.res.req('/useraddress/defaultaddress', data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
        that.setData({
          defalutaddres: [],
          defalutaddresId: '',
        })
        if (res.data != null) {
          that.setData({
            defalutaddres: res.data,
            defalutaddresId: res.data.id,
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
  // 上个页面返回刷新
  changeData: function () {

    //this.getDetail();
    //var options = { 'id': this.data.id }


  },
  //计算距离
  formSubmit(e) {
    var _this = this;
    //调用距离计算接口
    qqmapsdk.calculateDistance({
      //mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
      //from参数不填默认当前地址
      //获取表单提交的经纬度并设置from和to参数（示例为string格式）
      from: [{
        latitude: _this.data.address.latitude,
        longitude: _this.data.address.longitude
      }], //若起点有数据则采用起点坐标，若为空默认当前地址
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
  //计算价格
  price(){
    let that = this
    if (that.data.user.memberType == 0) {
      if (that.data.store.defaultDeductionRatio == 0) {
        that.setData({
          price: (that.data.z_price + that.data.store.postageFee).toFixed(2),
          member_p: 0,
        })
      } else {
        that.setData({
          price: ((that.data.z_price * (1 - that.data.store.defaultDeductionRatio)) + +that.data.store.postageFee).toFixed(2),
          member_p: (that.data.z_price * that.data.store.defaultDeductionRatio).toFixed(2),
        })
      }

    } else {
      if (that.data.store.memberDeductionRatio == 0) {
        that.setData({
          price: that.data.z_price + that.data.store.postageFee.toFixed(2),
          member_p: 0,
        })
      } else {
        that.setData({
          price: ((that.data.z_price * (1 - that.data.store.memberDeductionRatio)) + that.data.store.postageFee).toFixed(2),
          member_p: (that.data.z_price * that.data.store.memberDeductionRatio).toFixed(2),
        })
      }


    }
  },
  pay(){
    let that = this;
    if (that.data.defalutaddres != '' && that.data.adress.length == 0) {
      that.setData({
        addressId: that.data.defalutaddres.id,
      })
     
      
    } else if (that.data.defalutaddres != '' && that.data.adress.length != 0) {
      that.setData({
        addressId: that.data.adress.id,
      })
     
     
    } else if (that.data.defalutaddres == '' && that.data.adress.length != 0) {
      that.setData({
        addressId: that.data.adress.id,
      })
     
     

    } else if (that.data.defalutaddres == '' && that.data.adress.length == 0) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
      return false
    }
      that.payes()
    
  },
  payes(){
    var nowTime = new Date();
    var that = this;
     if (that.data.sendType == 2 && that.data.phone == '') {
      wx.showToast({
        title: '请填写你的手机号',
        icon: 'none'
      })
      return
    } else if (that.data.sendType == 2 && that.data.checked == false) {
      wx.showToast({
        title: '请同意到店自提用户协议',
        icon: 'none'
      })
      return
    }else{
      let data = {

        storeId: storeid,
        addressId: that.data.addressId,
        remark: that.data.remark,
        sendType: that.data.sendType,
        presetTime: that.data.time,
        presetPhone: that.data.phone


      }
      app.res.req('/sqorder/submitproduct', data, (res) => {
        console.log(res.data)
        if (res.status == 1000) {

          wx.showLoading({
            mask: true
          })

          setTimeout(function () {
            wx.hideLoading()
            that.pays();
          }, 2000)
        }else {

          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
    }
   
    if (nowTime - this.data.tapTime < 2000) {
      console.log('阻断')
      return;
    }
    console.log(that.data.time)
    // that.setData({
    //   loading:!that.data.loading
    // })
   
    this.setData({ tapTime: nowTime });
  },
  //调取支付
  pays() {
    let that = this;
    let data = {

    }
    app.res.req("/pay/xcxpay", data, (res) => {
      console.log(res.data)
      if (res.status == 1000) {
       // clearInterval(setTime)
        let data = res.data
        wx.requestPayment({
          timeStamp: res.data.sign.timeStamp,
          nonceStr: res.data.sign.nonceStr,
          package: res.data.sign.package,
          signType: 'MD5',
          paySign: res.data.sign.paySign,
          success(res) {

            wx.showToast({
              title: '支付成功',
              icon: 'none',
              duration: 1000
            })

            wx.redirectTo({
              url: '../pay_success/pay_success?id=' + that.data.price,
            })
          },
          fail(res) {
          
            wx.redirectTo({
              url: '../order_list/order_list',
            })

          }
        })

        //   interval = null;

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
  set_time(str){
    var n = parseInt(str);
    var D = new Date(n);
    var year = D.getFullYear();//四位数年份
  
    var month = D.getMonth()+1;//月份(0-11),0为一月份
    month = month<10?('0'+month):month;
  
    var day = D.getDate();//月的某一天(1-31)
    day = day<10?('0'+day):day;
  
    var hours = D.getHours();//小时(0-23)
    hours = hours<10?('0'+hours):hours;
  
    var minutes = D.getMinutes();//分钟(0-59)
    minutes = minutes<10?('0'+minutes):minutes;
  
    var seconds = D.getSeconds();//秒(0-59)
    seconds = seconds<10?('0'+seconds):seconds;
    // var week = D.getDay();//周几(0-6),0为周日
    // var weekArr = ['周日','周一','周二','周三','周四','周五','周六'];
  
    var now_time = year+'-'+month+'-'+day+' '+hours+':'+minutes;
    return now_time;
  }
})