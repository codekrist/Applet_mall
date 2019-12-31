// pages/category/index.js

import {
  request
} from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左侧的菜单数据
    leftMenuList: [],
    // 右侧商品数据
    rightContent: [],
    //被点击的左侧菜单
    currentIndex: 0,
    //右侧内容滚动条重新点击索引回到顶部
    scrollTop: 0
  },
  //接口的返回数据
  Cates: [],
  onLoad: function (options) {
    const Cates = wx.getStorageSync('cates')
    if (!Cates) {
      this.getCates()
    } else {
      if (Date.now() - Cates.time > 1000 * 10) {
        this.getCates()
      } else {
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }


    }
  },
   async getCates() {
    
     const res = await request({ url: '/categories'});
       //把接口的数据存储到本地存储中
     this.Cates = res;
      wx.setStorageSync('cates', {
        time: Date.now(),
        data: this.Cates
      })
      //构造左侧大菜单数据
      let leftMenuList = this.Cates.map(v => v.cat_name);
      //构造右侧商品数据
      let rightContent = this.Cates[0].children;
      this.setData({
        leftMenuList,
        rightContent
      })
  },
  // 左侧菜单的点击事件
  handItemTap(e) {
    console.log(e)
    /***
     * 1- 获取点击标题身上的索引
     * 2- 给data中的ecurrentIndex赋值
     * 3- 根据不同的索引 渲染右侧的商品内容
     */
    const {
      index
    } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      //重新设置右侧内容sscroll-view距离顶部的距离
      scrollTop: 0
    })


  }
})