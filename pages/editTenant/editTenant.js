// pages/editTenant/editTenant.js
import { getTenantByRoomNumberAsync, updateTenantAsync, deleteTenantAsync } from '../../storage/storage.js';

Page({
  data: {
    original_room_number: '',
    name: '',
    room_number: '',
    rent: ''
  },

  onLoad(options) {
    const roomNumber = options.room_number;
    if (!roomNumber) {
      wx.showToast({
        title: '房间号未指定',
        icon: 'none',
        duration: 2000
      });
      wx.navigateBack();
      return;
    }
    this.setData({ original_room_number: roomNumber });
    this.loadTenant(roomNumber);
  },

  /**
   * 加载租户信息
   */
  async loadTenant(roomNumber) {
    try {
      const tenant = await getTenantByRoomNumberAsync(roomNumber);
      if (tenant) {
        this.setData({
          name: tenant.name,
          room_number: tenant.room_number,
          rent: tenant.rent.toString()
        });
      } else {
        wx.showToast({
          title: '租户不存在',
          icon: 'none',
          duration: 2000
        });
        wx.navigateBack();
      }
    } catch (error) {
      console.error('加载租户信息失败:', error);
      wx.showToast({
        title: '加载租户信息失败',
        icon: 'none',
        duration: 2000
      });
      wx.navigateBack();
    }
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
   * 提交编辑后的租户信息
   */
  async submitEditTenant(e) {
    const { original_room_number, name, room_number, rent } = this.data;

    // 表单验证
    if (!name.trim() || !room_number.trim() || !rent.trim()) {
      wx.showToast({
        title: '请填写所有字段',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 构建更新后的租户对象
    const updatedTenant = {
      name: name.trim(),
      room_number: room_number.trim(),
      rent: parseFloat(rent)
    };

    try {
      await updateTenantAsync(original_room_number, updatedTenant);
      wx.showToast({
        title: '租户信息已更新',
        icon: 'success',
        duration: 2000
      });
      // 返回上一页
      wx.navigateBack();
    } catch (error) {
      wx.showToast({
        title: error.message || '更新租户失败',
        icon: 'none',
        duration: 2000
      });
    }
  },

  /**
   * 删除租户
   */
  async deleteTenant() {
    const { original_room_number } = this.data;
    wx.showModal({
      title: '确认删除',
      content: '您确定要删除此租户吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await deleteTenantAsync(original_room_number);
            wx.showToast({
              title: '租户已删除',
              icon: 'success',
              duration: 2000
            });
            wx.navigateBack();
          } catch (error) {
            wx.showToast({
              title: error.message || '删除租户失败',
              icon: 'none',
              duration: 2000
            });
          }
        }
      }
    });
  }
});
