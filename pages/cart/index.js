/**
 * 1- 获取用户的收货地址功能
 *     1- 绑定点击事件
 *     2- 调用小程序的内置api  获取用户的收货地址 wx.chooseAddress
 * 2-获取用户对小程序 所授予获取地址的权限状态 scope
 *      1- 假设用户点击获取收货地址的提示框  确定 authSetting.scope.address: true
 *      scope 值 true
 *      2- 假设用户点击获取收货地址的提示框 取消 authSetting.scope.address: false
 *          1- 诱导用用户自己打开 授权设置页面  当用户授权重新给予 获取地址授权限的时候
 *          2- 获取收货地址
 *      3- 假设用户没有调用 收货地址   是undefined 
 *      4- 把获取到的收货地址 存入本地存储中
 * 3- 页面加载完毕 
 *      0- onLoad 使用onShow
 *      1- 获取本地存储中的数据
 *      2- 把数据设置给data中的变量
 * 
 * 4- 全选
 *      1- onShow 获取缓存中的购物车
 *      2- 根据购物车中的商品进行计算  
 * 5- 全选反选
 */

import {
  getSetting,
  chooseAddress,
  openSetting,
  showToast
} from '../../utils/asyncWx.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
    // 总价格
    totalPrice: 0,
    //总数量
    totalNum: 0
  },
  onShow() {
    // 1-  获取本地存储中的数据
    const address = wx.getStorageSync('address');
    // 1 - 获取缓存中的数据
    const cart = wx.getStorageSync('cart') || [];

    this.setData({
      address
    });
    this.setCart(cart);
  },
  //点击获取收货地址
  async handleBtn() {
    try {
      const res1 = await getSetting();
      const scopeAdress = res1.authSetting['scope.address'];
      //判断权限状态
      if (scopeAdress === false) {
        //现在诱导用户 打开授权页面
        await openSetting();
      }
      //调用获取地址的api
      const address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      //存到缓存中
      wx.setStorageSync('address', address)
    } catch (error) {

    }

  },
  //商品的选中
  handleItemChange(e) {
    console.log(e)
    // 获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id;
    // console.log(goods_id)
    //获取购物车数组
    let {
      cart
    } = this.data;
    //找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    //选中状态取反
    cart[index].checked = !cart[index].checked;
    // 把购物车数据重新设置回data中和缓存中
    this.setCart(cart);
  },
  //设置购物车状态 重新机选底部工具栏 全选 总价 购买数量
  setCart(cart) {
    let allChecked = true;
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num
      } else {
        allChecked = false;
      }
    });
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      allChecked,
      totalNum,
      totalPrice
    });
    wx.setStorageSync("cart", cart);
  },
  //商品全选
  handleItemALlChecked() {
    let {
      cart,
      allchecked
    } = this.data;
    allchecked = !allchecked
    cart.forEach(v => v.checked = allchecked);
    this.setCart(cart);
  },
  //商品数量
  handleItemNumEdit(e) {
    // console.log(e)
    const {
      operation,
      id
    } = e.currentTarget.dataset;
    console.log(operation, id)
    let {
      cart
    } = this.data;
    const index = cart.findIndex(v => v.goods_id === id);

    if (cart[index].num === 1 && operation === -1) {
      wx.showModal({
        title: '提示',
        content: '您是否要删除',
        success: (res) => {
          if (res.confirm) {
            cart.splice(index, 1)
            this.setCart(cart)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      cart[index].num += operation
      this.setCart(cart);
    }
  },
  //商品结算
  async handlePay() {
    const {
      address,
      totalNum
    } = this.data;
    if (!address.userName) {
      await showToast({
        title: '您还没有选择收货地址'
      });
      return;
    }
    //判断用户有没有选购商品
    if (totalNum === 0) {
      await showToast({
        title: '您还没有选购商品'
      });
      return;
    }
    //跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    })
  }
})