import {
  request
} from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
//用户上滑页面滚动条触底 加载数据
/**
 * 1- 滚动条触底事件 
 * 2- 判断有没有下一页数据
 *  1- 获取到总页码 23总条数
 *     总页数 = Math.ceil(总页数 / 页容量pagesize)
 *     总页数 = Math.ceil (23 / 10 ) = 3 
 *  2- 获取当前页码
 *  3- 判断 当前页码是否大于总页数 表示没有下一页数据
 * 
 * 3- 没有下一页数据 弹出提示
 * 4- 有下一页数据  加载下一页数据
 *    1- 当前的页码++
 *    2- 重新发送请求
 *    3- 数据请求回来 要对data中的数组进行拼接 
 */
/**
 *  下拉刷新页面
 * 1- 触发下拉刷新事件 
 * 2- 重置 数据  数组
 * 3- 重置页码 设置为 1
 * 4- 重新发送请求
 * 5- 数据回来 还在刷新 需要手动的关闭等待效果
 * 
 */
/**
 * 
 */
Page({

  data: {
    tabs: [{
        id: 0,
        value: '综合',
        isActive: true
      }, {
        id: 1,
        value: '销量',
        isActive: false
      },
      {
        id: 2,
        value: '价格',
        isActive: false
      }
    ],
    goodsList: []
  },
  //接口要的参数
  QueryParams: {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10
  },

  // 总页数
  totalPages: 1,
  onLoad: function(options) {
    console.log(options) //{cid: "5"}
    this.QueryParams.cid = options.cid;

    //调用下面方法啊
    this.getGoodsList();
  },
  //获取商品列表数据
  async getGoodsList() {
    const res = await request({
      url: '/goods/search',
      data: this.QueryParams
    });
    console.log(res)

    //获取总条数
    const total = res.total;
    //计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    // console.log(this.totalPages) //3 
    this.setData({
      goodsList: [...this.data.goodsList, ...res.goods]
    })
    //关闭下拉刷新的窗口
    wx.stopPullDownRefresh()
  },

  //标题的点击事件 是从子组件传递过来的
  handletabsItemChange(e) {
    // console.log(e)
    /**
     * 1-获取被点击的索引
     */
    const {
      index
    } = e.detail;
    //修改原数组
    let {
      tabs
    } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    //赋值到data中
    this.setData({
      tabs
    })
  },
  //页面上滑 滚动条触底事件
  onReachBottom() {

    //  1- 判断还没有下一页数据

    if (this.QueryParams.pagenum >= this.totalPages) {
      // console.log('没有下一页数据')
      wx.showToast({
        title: '已经到底了'
      })
    } else {
      // console.log('还有下一页数据')
      this.QueryParams.pagenum++;
      this.getGoodsList()
    }
  },
  //下拉刷新事件
  onPullDownRefresh() {
    // console.log('onPullDownRefresh')
    //1- 重置数组
    this.setData({
        goodsList: []
      }),
      //2- 重置页码
      this.QueryParams.pagenum = 1;
    //3- 重新发送请求
    this.getGoodsList()
  }
})