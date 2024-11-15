// pages/receipt/receipt.js
import { getTenantByRoomNumberAsync, getBillAsync } from '../../storage/storage.js';

Page({
  data: {
    tenant: {},
    bill: {},
    totalAmount: '0.00',
    selectedMonth: '',
    receiptImagePath: '' // 保存生成的图片路径
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
    this.loadReceiptData(roomNumber);
  },

  /**
   * 加载收据数据
   */
  async loadReceiptData(roomNumber) {
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

      const selectedMonth = this.getSelectedMonth(roomNumber);
      if (!selectedMonth) {
        wx.showToast({
          title: '未找到对应月份的账单',
          icon: 'none',
          duration: 2000
        });
        wx.navigateBack();
        return;
      }

      const bill = await getBillAsync(roomNumber, selectedMonth);
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
        selectedMonth // 添加所选月份
      });

      // 调试日志
      console.log('Tenant:', tenant);
      console.log('Bill:', bill);
      console.log('Total Amount:', totalAmount);
      console.log('Selected Month:', selectedMonth);
    } catch (error) {
      console.error('加载收据数据失败:', error);
      wx.showToast({
        title: '加载收据失败',
        icon: 'none',
        duration: 2000
      });
      wx.navigateBack();
    }
  },

  /**
   * 获取账单所属月份
   * 获取最新的账单月份
   */
  getSelectedMonth(roomNumber) {
    const bills = wx.getStorageSync('bills') || {};
    if (!bills[roomNumber]) return null;
    const months = Object.keys(bills[roomNumber]);
    if (months.length === 0) return null;
    // 按照月份排序，获取最新的月份
    months.sort();
    return months[months.length - 1];
  },

  /**
   * 导出收据
   */
  exportReceipt() {
    wx.showLoading({
      title: '正在生成图片...',
    });

    // 获取 receiptContent 的高度
    const query = wx.createSelectorQuery();
    query.select('#receiptContent').boundingClientRect();
    query.exec((res) => {
      const contentHeight = res[0].height; // 获取内容高度

      const wxml2canvas = this.selectComponent('#wxml2canvas');
      wxml2canvas.draw({
        selector: '#receiptContent',
        width: 750,
        height: contentHeight, // 使用实际高度
        destWidth: 750 * 2,
        destHeight: contentHeight * 2,
        finish: (url) => {
          wx.hideLoading();
          this.setData({
            receiptImagePath: url
          });
          // 显示操作菜单
          this.showActionSheet(url);
        },
        error: (err) => {
          wx.hideLoading();
          console.error('生成图片失败:', err);
          wx.showToast({
            title: '生成图片失败',
            icon: 'none',
            duration: 2000
          });
        }
      });
    });
  },

  /**
   * 显示操作菜单
   */
  showActionSheet(imagePath) {
    wx.showActionSheet({
      itemList: ['保存到相册', '分享图片'],
      success: (res) => {
        if (res.tapIndex === 0) {
          // 保存到相册
          wx.saveImageToPhotosAlbum({
            filePath: imagePath,
            success: () => {
              wx.showToast({
                title: '已保存到相册',
                icon: 'success',
                duration: 2000
              });
            },
            fail: (err) => {
              console.error('保存到相册失败:', err);
              if (err.errMsg.includes('auth deny') || err.errMsg.includes('auth denied')) {
                wx.showModal({
                  title: '提示',
                  content: '需要您授权保存相册功能',
                  showCancel: false,
                  success: (modalRes) => {
                    wx.openSetting();
                  }
                });
              } else {
                wx.showToast({
                  title: '保存失败',
                  icon: 'none',
                  duration: 2000
                });
              }
            }
          });
        } else if (res.tapIndex === 1) {
          // 分享图片
          this.shareImage(imagePath);
        }
      },
      fail: (err) => {
        console.error('操作取消:', err);
      }
    });
  },

  /**
   * 分享图片
   */
  shareImage(imagePath) {
    wx.showLoading({
      title: '正在准备分享...',
    });

    // 预览图片，然后长按分享（兼容性较好）
    wx.previewImage({
      urls: [imagePath],
      current: imagePath,
      success: () => {
        wx.hideLoading();
        wx.showToast({
          title: '长按图片可分享',
          icon: 'none',
          duration: 2000
        });
      },
      fail: (err) => {
        wx.hideLoading();
        console.error('预览图片失败:', err);
        wx.showToast({
          title: '分享失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  }
});
