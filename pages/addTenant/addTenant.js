// pages/addTenant/addTenant.js
import { addTenantAsync } from '../../storage/storage.js';

Page({
  data: {
    name: '',
    room_number: '',
    rent: ''
  },

  onNameInput(e) {
    this.setData({ name: e.detail.value });
  },

  onRoomNumberInput(e) {
    this.setData({ room_number: e.detail.value });
  },

  onRentInput(e) {
    this.setData({ rent: e.detail.value });
  },

  /**
   * 提交租户信息
   */
  async submitTenant(e) {
    const { name, room_number, rent } = this.data;

    // 表单验证
    if (!name.trim() || !room_number.trim() || !rent.trim()) {
      wx.showToast({
        title: '请填写所有字段',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 构建租户对象
    const newTenant = {
      name: name.trim(),
      room_number: room_number.trim(),
      rent: parseFloat(rent)
    };

    try {
      await addTenantAsync(newTenant);
      wx.showToast({
        title: '租户已添加',
        icon: 'success',
        duration: 2000
      });
      // 清空表单
      this.setData({
        name: '',
        room_number: '',
        rent: ''
      });
      // 返回上一页
      wx.navigateBack();
    } catch (error) {
      wx.showToast({
        title: error.message || '添加租户失败',
        icon: 'none',
        duration: 2000
      });
    }
  }
});
