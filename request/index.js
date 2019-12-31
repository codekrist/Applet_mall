//同时发送异步代码的次数
let ajaxTime =0

export const request = (parmas) => {
  ajaxTime++;
  //显示加载中
  wx.showLoading({
    title: '加载中',
    mask: true
  })
  //定义公共的url
  const baseURL = "https://api.zbztb.cn/api/public/v1"
  return new Promise((reslove, reject) => {
    wx.request({
      ...parmas,
      url: baseURL + parmas.url,
      success: (res) => {
        reslove(res.data.message)
      },
      fail: (err) => {
        reject(err)
      },
      complete: () => {
        ajaxTime--;
        //关闭等待图标
        wx.hideLoading()
      }

    })
  })
}

