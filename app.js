// app.js
App({
  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'prod-3gjpzth70ef83e1c', // 请替换为您的云环境 ID
        traceUser: true,
      });
    }
  },
  globalData: {}
});
