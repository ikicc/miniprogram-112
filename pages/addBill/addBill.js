// pages/addBill/addBill.js
import { getAllBillsAsync, getBillAsync, saveBillAsync } from '../../storage/storage.js';
import { getTenantsAsync } from '../../storage/storage.js';

Page({
  data: {
    selectedMonth: '',
    selectedRoomNumber: '',
    water: {
      current: '',
      previous: '',
      usage: '',
      amount: ''
    },
    electricity: {
      current: '',
      previous: '',
      usage: '',
      amount: ''
    },
    tenants: [],
    // 定义单价
    waterPricePerUnit: 4,       // 每单位水费价格，单位：元
    electricityPricePerUnit: 1  // 每单位电费价格，单位：元
  },

  onLoad(options) {
    // 获取传递过来的房间号
    const roomNumber = options.room_number;
    if (roomNumber) {
      this.setData({ selectedRoomNumber: roomNumber });
      this.loadTenants();
    } else {
      wx.showToast({
        title: '房间号未指定',
        icon: 'none',
        duration: 2000
      });
      wx.navigateBack();
    }
  },

  /**
   * 加载所有租户，确认房间号有效
   */
  async loadTenants() {
    try {
      const tenants = await getTenantsAsync();
      this.setData({ tenants });

      // 验证传递的房间号是否存在
      const exists = tenants.some(t => String(t.room_number) === String(this.data.selectedRoomNumber));
      if (!exists) {
        wx.showToast({
          title: '指定的房间号不存在',
          icon: 'none',
          duration: 2000
        });
        wx.navigateBack();
      }
    } catch (error) {
      console.error('加载租户失败:', error);
      wx.showToast({
        title: '加载租户失败',
        icon: 'none',
        duration: 2000
      });
    }
  },

  /**
   * 选择月份
   */
  onMonthChange(e) {
    const selectedMonth = e.detail.value.slice(0, 7); // 获取YYYY-MM
    this.setData({ selectedMonth });

    // 清除之前的输入和计算结果
    this.setData({
      'water.current': '',
      'water.usage': '',
      'water.amount': '',
      'electricity.current': '',
      'electricity.usage': '',
      'electricity.amount': ''
    });

    // 自动填充上月表数
    this.populatePreviousReadings(selectedMonth);
  },

  /**
   * 自动填充上月表数
   */
  async populatePreviousReadings(selectedMonth) {
    if (!this.data.selectedRoomNumber || !selectedMonth) {
      return;
    }

    const [year, month] = selectedMonth.split('-').map(Number);
    let previousMonth = month - 1;
    let previousYear = year;
    if (previousMonth === 0) {
      previousMonth = 12;
      previousYear -= 1;
    }
    const previousMonthStr = `${previousYear}-${previousMonth.toString().padStart(2, '0')}`;

    try {
      const previousBill = await getBillAsync(this.data.selectedRoomNumber, previousMonthStr);
      if (previousBill) {
        this.setData({
          'water.previous': previousBill.water.current !== undefined ? previousBill.water.current.toString() : '0',
          'electricity.previous': previousBill.electricity.current !== undefined ? previousBill.electricity.current.toString() : '0'
        });
      } else {
        // 如果没有上月账单，设置为0
        this.setData({
          'water.previous': '0',
          'electricity.previous': '0'
        });
      }
    } catch (error) {
      console.error('获取上月账单失败:', error);
      wx.showToast({
        title: '获取上月账单失败',
        icon: 'none',
        duration: 2000
      });
      // 设置为0
      this.setData({
        'water.previous': '0',
        'electricity.previous': '0'
      });
    }
  },

  /**
   * 水费输入处理 - 本月表数
   */
  onWaterCurrentInput(e) {
    const current = e.detail.value;
    this.setData({
      'water.current': current
    });
    this.calculateWater();
  },

  /**
   * 电费输入处理 - 本月表数
   */
  onElectricityCurrentInput(e) {
    const current = e.detail.value;
    this.setData({
      'electricity.current': current
    });
    this.calculateElectricity();
  },

  /**
   * 水费输入处理 - 金额
   */
  onWaterAmountInput(e) {
    const amount = e.detail.value;
    this.setData({
      'water.amount': amount
    });
  },

  /**
   * 电费输入处理 - 金额
   */
  onElectricityAmountInput(e) {
    const amount = e.detail.value;
    this.setData({
      'electricity.amount': amount
    });
  },

  /**
   * 计算水费用量和金额
   */
  calculateWater() {
    const current = parseFloat(this.data.water.current);
    const previous = parseFloat(this.data.water.previous);
    let usage = null;

    if (!isNaN(current) && !isNaN(previous)) {
      usage = current - previous;
      if (usage < 0) {
        wx.showToast({
          title: '本月水表数不能小于上月水表数',
          icon: 'none',
          duration: 2000
        });
        this.setData({
          'water.usage': '',
          'water.amount': ''
        });
        return;
      }
      const calculatedAmount = usage * this.data.waterPricePerUnit;
      this.setData({
        'water.usage': usage.toFixed(2),
        'water.amount': calculatedAmount.toFixed(2) // 自动计算金额
      });
    } else {
      // 无效输入
      this.setData({
        'water.usage': '',
        'water.amount': ''
      });
    }
  },

  /**
   * 计算电费用量和金额
   */
  calculateElectricity() {
    const current = parseFloat(this.data.electricity.current);
    const previous = parseFloat(this.data.electricity.previous);
    let usage = null;

    if (!isNaN(current) && !isNaN(previous)) {
      usage = current - previous;
      if (usage < 0) {
        wx.showToast({
          title: '本月电表数不能小于上月电表数',
          icon: 'none',
          duration: 2000
        });
        this.setData({
          'electricity.usage': '',
          'electricity.amount': ''
        });
        return;
      }
      const calculatedAmount = usage * this.data.electricityPricePerUnit;
      this.setData({
        'electricity.usage': usage.toFixed(2),
        'electricity.amount': calculatedAmount.toFixed(2) // 自动计算金额
      });
    } else {
      // 无效输入
      this.setData({
        'electricity.usage': '',
        'electricity.amount': ''
      });
    }
  },

  /**
   * 提交账单
   */
  async submitBill() {
    const { selectedMonth, selectedRoomNumber, water, electricity } = this.data;

    if (!selectedMonth) {
      wx.showToast({
        title: '请选择月份',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    if (!selectedRoomNumber) {
      wx.showToast({
        title: '房间号未指定',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 验证输入
    if (!water.current || isNaN(water.current)) {
      wx.showToast({
        title: '请输入有效的本月水表数',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    if (!electricity.current || isNaN(electricity.current)) {
      wx.showToast({
        title: '请输入有效的本月电表数',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    if (!water.amount || isNaN(water.amount)) {
      wx.showToast({
        title: '请输入有效的水费金额',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    if (!electricity.amount || isNaN(electricity.amount)) {
      wx.showToast({
        title: '请输入有效的电费金额',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // Optional: Validate that usage has been calculated
    if (this.data.water.usage === '') {
      wx.showToast({
        title: '请确认水用量已计算',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    if (this.data.electricity.usage === '') {
      wx.showToast({
        title: '请确认电用量已计算',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 构建账单数据
    const billData = {
      water: {
        current: parseFloat(water.current),
        previous: parseFloat(water.previous) || 0,
        usage: parseFloat(water.usage) || 0,
        amount: parseFloat(water.amount)
      },
      electricity: {
        current: parseFloat(electricity.current),
        previous: parseFloat(electricity.previous) || 0,
        usage: parseFloat(electricity.usage) || 0,
        amount: parseFloat(electricity.amount)
      }
    };

    try {
      await saveBillAsync(selectedRoomNumber, selectedMonth, billData);
      wx.showToast({
        title: '账单已保存',
        icon: 'success',
        duration: 2000
      });
      wx.navigateBack();
    } catch (error) {
      console.error('保存账单失败:', error);
      wx.showToast({
        title: error.message || '保存账单失败',
        icon: 'none',
        duration: 2000
      });
    }
  }
});
