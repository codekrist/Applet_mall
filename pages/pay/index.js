import {
  getSetting,
  chooseAddress,
  openSetting,
  showToast
} from '../../utils/asyncWx.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
import {request} from '../../request/index.js';
Page({
  data: {
    address: {},
    cart: [],

    // 总价格
    totalPrice: 0,
    //总数量
    totalNum: 0
  },
  onShow() {
    // 1-  获取本地存储中的数据
    const address = wx.getStorageSync('address');
    // 1 - 获取缓存中的数据
    let cart = wx.getStorageSync('cart') || [];
    //  过滤购物车的数组
    cart = cart.filter(v => v.checked)
    this.setData({
      address
    });
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num
    });
    this.setData({
      cart,
      totalNum,
      totalPrice
    });
  },
  //点击支付
async  handlePrderPay() {
    //判断缓存有么有token
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index',
      });
      return;
    }
    //1创建订单
    //1.1 准备请求头参数
    const header = {
      Authorization: token
    }
    //1.2 准备请求体参数
    const order_price = this.data.totalPrice;
    //1.3 收货地址
    const consignee_addr = this.data.address.all;
    const cart = this.data.cart;
    //1.4 
    let goods = [];
    cart.forEach(v => goods.push({
      goods_id: v.goods_id,
      goods_number: v.num,
      goods_price: v.goods_price
    }))
  const orderParmas = { order_price, consignee_addr, goods}
    //创建订单 获取订单编号
  const res = await request({ url: '/my/order/create', methods: 'post', data: orderParmas,header});
  console.log(res)
  }
})