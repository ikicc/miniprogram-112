// pages/billList/billList.js
import { getBillsGroupedByMonthAsync, getTenantByRoomNumberAsync } from '../../storage/storage.js';

Page({
  data: {
    billsByMonth: {},
    sortedMonths: []
  },

  onLoad() {
    this.loadBills();
  },

  async loadBills() {
    try {
      const billsGrouped = await getBillsGroupedByMonthAsync();
      const months = Object.keys(billsGrouped).sort().reverse(); // 按月份倒序排列
      const billsByMonth = {};

      for (const month of months) {
        const bills = billsGrouped[month];
        const detailedBills = [];

        for (const billEntry of bills) {
          const tenant = await getTenantByRoomNumberAsync(billEntry.room_number);
          if (tenant) {
            // 计算总金额
            const rent = parseFloat(tenant.rent) || 0;
            const waterAmount = parseFloat(billEntry.bill.water.amount) || 0;
            const electricityAmount = parseFloat(billEntry.bill.electricity.amount) || 0;
            const totalAmount = (rent + waterAmount + electricityAmount).toFixed(2);

            detailedBills.push({
              tenantName: tenant.name,
              roomNumber: tenant.room_number,
              totalAmount: totalAmount,
              bill: billEntry.bill,
              month: month  // 包含月份信息
            });
          }
        }

        billsByMonth[month] = detailedBills;
      }

      this.setData({ billsByMonth, sortedMonths: months });
    } catch (error) {
      console.error('加载账单列表失败:', error);
      wx.showToast({
        title: '加载账单列表失败',
        icon: 'none',
        duration: 2000
      });
    }
  },

  viewBillDetail(e) {
    const roomNumber = e.currentTarget.dataset.room;
    const month = e.currentTarget.dataset.month;
    wx.navigateTo({
      url: `/pages/billDetail/billDetail?room_number=${roomNumber}&month=${month}`
    });
  }
});
