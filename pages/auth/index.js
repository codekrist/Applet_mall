import {
  request
} from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
import {
  login
} from '../../utils/asyncWx.js';
Page({

  //获取用户信息
  async handleGetUserInfo(e) {
    // console.log(e)
    //获取用户信息
    const { encryptedData, iv, rawData, signature } = e.detail;

    //获取小程序登录成功之后的code
    const code = await login();
    // console.log(code)
    const loginParams = { encryptedData, iv, rawData, signature, code };
    //发送请求 获取用户的token
    const token = await request({ url: "/users/wxlogin", data: loginParams, method: "POST" });
    // console.log(token)
    wx.setStorageSync("token", token);
    wx.navigateBack({
      delta: 1,
    })
  }
})