import {
  request
} from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';


/**
 * 1- 发送请求 获取数据
 */
/**
 * 1- 点击轮播图预览大图
 *    1- 轮播图绑定点击事件
 *    2- 调用小程序api  previewImage
 */
Page({
  data: {
    goodsObj: {},

  },
  /**
   * 生命周期函数--监听页面加载
   */
  //全局商品对象
  goodsInfo: {},
  onLoad: function(options) {
    const {
      goods_id
    } = options;
    //调用 获取商品详情数据方法
    this.getGoodsDetail(goods_id)
  },

  //获取商品详情数据
  async getGoodsDetail(goods_id) {

    const goodsObj = await request({

      url: '/goods/detail',
      data: {
        goods_id
      }
    });
    this.goodsInfo = goodsObj;
    console.log(goodsObj)
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        // goods_introduce: goodsObj.goods_introduce,
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics: goodsObj.pics,
      }
    })
  },
  // 点击轮播图放大预览
  handlepreviewImage(e) {
    // console.log('handlepreviewImage')
    //1 - 先构造要预览的图片数组
    const urls = this.goodsInfo.pics.map(v => v.pics_mid);
    //2-接收传递过来的图片url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls,
    })
  },
  //点击加入购物车
  handleCartAdd() {
    // console.log('handleCartAdd')
    //1- 获取缓存中的购物车  数组
    let cart = wx.getStorageSync("cart") || [];
    // 2- 判断 商品对象是否存在于购物车
    let index = cart.findIndex(v => v.goods_id === this.goodsInfo.goods_id);
    if (index === -1) {
      // 不存在 第一次添加
      this.goodsInfo.num = 1;
      this.goodsInfo.checked = true;
      cart.push(this.goodsInfo)
    } else {
      // 4- 已经存在购物车数据 执行num++
      cart[index].num++;
    }
    //5- 把购物车重新添加回缓存中
    wx.setStorageSync('cart', cart);
    //6- 单处提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true,
    })
  }
})