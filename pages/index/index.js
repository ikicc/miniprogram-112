// pages/index/index.js
import { getTenantsAsync } from '../../storage/storage.js';

Page({
  data: {
    tenants: []
  },

  onShow() {
    this.loadTenants();
  },

  /**
   * 加载所有租户
   */
  async loadTenants() {
    try {
      const tenants = await getTenantsAsync();
      console.log('加载的租户信息:', tenants);

      // 确保租金为数字类型并格式化为字符串，保留两位小数
      const parsedTenants = tenants.map(tenant => {
        const rent = parseFloat(tenant.rent) || 0;
        return {
          ...tenant,
          rentFormatted: rent.toFixed(2)
        };
      });

      this.setData({ tenants: parsedTenants });
    } catch (error) {
      console.error('加载租户失败:', error);
      wx.showToast({
        title: '加载租户失败',
        icon: 'none',
        duration: 2000
      });
    }
  },

  // 其他函数保持不变
  navigateToAddTenant() {
    wx.navigateTo({
      url: '/pages/addTenant/addTenant'
    });
  },

  navigateToBillList() {
    wx.navigateTo({
      url: '/pages/billList/billList'
    });
  },

  editTenant(e) {
    const room_number = e.currentTarget.dataset.room;
    wx.navigateTo({
      url: `/pages/editTenant/editTenant?room_number=${room_number}`
    });
  },

  addBill(e) {
    const room_number = e.currentTarget.dataset.room;
    wx.navigateTo({
      url: `/pages/addBill/addBill?room_number=${room_number}`
    });
  },

  generateReceipt(e) {
    const room_number = e.currentTarget.dataset.room;
    wx.navigateTo({
      url: `/pages/receipt/receipt?room_number=${room_number}`
    });
  }
});
