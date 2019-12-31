//index.js
//获取应用实例

// 引入 发送请求路径
import { request } from '../../request/index.js'


Page({
  data: {
    // 轮播图数据
    swiperList: [],
    // 获取分类
    cateList: [],
    //楼层数据
    floorList: []
  },
  //事件处理函数
  bindViewTap: function () {

  },
  //页面开始加载 就会触发
  onLoad: function (options) {
    // wx.request({
    //   url: 'https://api.zbztb.cn/api/public/v1/home/swiperdata',
    //   success:(res)=> {
    //     console.log(res)//获取到轮播图数据
    //     //将我们的swiperList存入数据
    //     this.setData({
    //       swiperList:res.data.message
    //     })
    //   },
    // })

    //使用自己封装的代码
    //获取轮播图
    this.getSwiperList();
    //获取商品分类导航
    this.getCateList();
    //获取楼层数据
    this.getFloorList();
  },

  //获取轮播图数据
  getSwiperList() {
    request({
      url: '/home/swiperdata'
    }).then(res => {
      // console.log(res)
      this.setData({
        swiperList: res
      })
    })

  },
  // 获取分类导航数据
  getCateList() {
    request({
      url: '/home/catitems'
    }).then(res => {
      // console.log(res)
      this.setData({
        cateList: res
      })
    })
  },
  //获取楼层数据
  getFloorList() {
    request({
      url: '/home/floordata'
    }).then(res => {
      // console.log(res)
      this.setData({
        floorList: res
      })
    })
  }
  ,
  getUserInfo: function (e) {

  }
})
