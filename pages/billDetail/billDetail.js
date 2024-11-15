// pages/billDetail/billDetail.js
import { getTenantByRoomNumberAsync, getBillAsync } from '../../storage/storage.js';

Page({
  data: {
    tenant: {},
    bill: {},
    totalAmount: '0.00',
    month: ''
  },

  onLoad(options) {
    const roomNumber = options.room_number;
    const month = options.month;
    if (!roomNumber || !month) {
      wx.showToast({
        title: '参数缺失',
        icon: 'none',
        duration: 2000
      });
      wx.navigateBack();
      return;
    }
    this.loadBillData(roomNumber, month);
  },

  async loadBillData(roomNumber, month) {
    try {
      const tenant = await getTenantByRoomNumberAsync(roomNumber);
      if (!tenant) {
        wx.showToast({
          title: '租户信息未找到',
          icon: 'none',
          duration: 2000
        });
        wx.navigateBack();
        return;
      }

      const bill = await getBillAsync(roomNumber, month);
      if (!bill) {
        wx.showToast({
          title: '账单信息未找到',
          icon: 'none',
          duration: 2000
        });
        wx.navigateBack();
        return;
      }

      // 确保金额字段为数字并保留两位小数
      const rent = parseFloat(tenant.rent) || 0;
      const waterAmount = parseFloat(bill.water.amount) || 0;
      const electricityAmount = parseFloat(bill.electricity.amount) || 0;
      const totalAmount = (rent + waterAmount + electricityAmount).toFixed(2);

      // 更新金额字段，保留两位小数
      tenant.rent = rent.toFixed(2);
      bill.water.amount = waterAmount.toFixed(2);
      bill.electricity.amount = electricityAmount.toFixed(2);

      this.setData({
        tenant,
        bill,
        totalAmount,
        month
      });

      // 调试日志
      console.log('Tenant:', tenant);
      console.log('Bill:', bill);
      console.log('Total Amount:', totalAmount);
    } catch (error) {
      console.error('加载账单数据失败:', error);
      wx.showToast({
        title: '加载账单失败',
        icon: 'none',
        duration: 2000
      });
      wx.navigateBack();
    }
  }
});
