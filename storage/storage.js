// storage/storage.js

const STORAGE_KEYS = {
  TENANTS: 'tenants',
  BILLS: 'bills'
};

/**
 * 获取所有租户（异步）
 * @returns {Promise<Array>}
 */
export const getTenantsAsync = () => {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: STORAGE_KEYS.TENANTS,
      success: (res) => {
        console.log('获取的租户信息:', res.data);
        resolve(res.data);
      },
      fail: (err) => {
        console.warn('获取租户信息失败，返回空数组:', err);
        resolve([]); // 返回空数组
      }
    });
  });
};

/**
 * 添加新的租户（异步）
 * @param {Object} tenant - 租户对象，包含 name, room_number 和 rent
 * @returns {Promise<void>}
 */
export const addTenantAsync = (tenant) => {
  return new Promise(async (resolve, reject) => {
    try {
      const tenants = await getTenantsAsync();
      // 检查房间号是否已存在
      const exists = tenants.some(t => String(t.room_number) === String(tenant.room_number));
      if (exists) {
        reject(new Error('房间号已存在'));
        return;
      }
      // 确保租金为数字
      tenant.rent = parseFloat(tenant.rent) || 0;
      tenants.push(tenant);
      wx.setStorage({
        key: STORAGE_KEYS.TENANTS,
        data: tenants,
        success: () => {
          console.log('已添加租户:', tenant);
          resolve();
        },
        fail: (err) => {
          console.error('添加租户失败:', err);
          reject(err);
        }
      });
    } catch (error) {
      console.error('添加租户时发生错误:', error);
      reject(error);
    }
  });
};

/**
 * 更新租户信息（异步）
 * @param {String} original_room_number - 原始房间号
 * @param {Object} updatedTenant - 更新后的租户对象，包含 name, room_number 和 rent
 * @returns {Promise<void>}
 */
export const updateTenantAsync = (original_room_number, updatedTenant) => {
  return new Promise(async (resolve, reject) => {
    try {
      const tenants = await getTenantsAsync();
      const index = tenants.findIndex(t => String(t.room_number) === String(original_room_number));
      if (index === -1) {
        reject(new Error('原始租户信息未找到'));
        return;
      }

      // 检查新房间号是否已存在（如果有变更）
      if (String(original_room_number) !== String(updatedTenant.room_number)) {
        const exists = tenants.some(t => String(t.room_number) === String(updatedTenant.room_number));
        if (exists) {
          reject(new Error('新房间号已存在'));
          return;
        }
      }

      // 确保租金为数字
      updatedTenant.rent = parseFloat(updatedTenant.rent) || 0;

      // 更新租户信息
      tenants[index] = updatedTenant;

      // 保存更新后的租户列表
      wx.setStorage({
        key: STORAGE_KEYS.TENANTS,
        data: tenants,
        success: () => {
          console.log('已更新租户信息:', updatedTenant);
          resolve();
        },
        fail: (err) => {
          console.error('更新租户信息失败:', err);
          reject(err);
        }
      });
    } catch (error) {
      console.error('更新租户信息时发生错误:', error);
      reject(error);
    }
  });
};

/**
 * 删除租户（异步）
 * @param {String} room_number - 房间号
 * @returns {Promise<void>}
 */
export const deleteTenantAsync = (room_number) => {
  return new Promise(async (resolve, reject) => {
    try {
      let tenants = await getTenantsAsync();
      const index = tenants.findIndex(t => String(t.room_number) === String(room_number));
      if (index === -1) {
        reject(new Error('租户未找到'));
        return;
      }
      tenants.splice(index, 1); // 移除租户
      wx.setStorage({
        key: STORAGE_KEYS.TENANTS,
        data: tenants,
        success: () => {
          console.log('已删除租户:', room_number);
          resolve();
        },
        fail: (err) => {
          console.error('删除租户失败:', err);
          reject(err);
        }
      });
    } catch (error) {
      console.error('删除租户时发生错误:', error);
      reject(error);
    }
  });
};

/**
 * 获取指定房间号的租户（异步）
 * @param {String} room_number
 * @returns {Promise<Object|null>}
 */
export const getTenantByRoomNumberAsync = (room_number) => {
  return new Promise(async (resolve, reject) => {
    try {
      const tenants = await getTenantsAsync();
      const tenant = tenants.find(t => String(t.room_number) === String(room_number));
      console.log(`获取房间号 ${room_number} 的租户:`, tenant);
      resolve(tenant || null);
    } catch (error) {
      console.error('获取租户时发生错误:', error);
      reject(error);
    }
  });
};

/**
 * 获取所有账单（异步）
 * @returns {Promise<Object>}
 */
export const getAllBillsAsync = () => {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: STORAGE_KEYS.BILLS,
      success: (res) => {
        console.log('获取的所有账单:', res.data);
        resolve(res.data);
      },
      fail: (err) => {
        console.warn('获取所有账单失败，返回空对象:', err);
        resolve({}); // 返回空对象
      }
    });
  });
};

/**
 * 获取指定租户和月份的账单（异步）
 * @param {String} room_number
 * @param {String} month - 格式为 'YYYY-MM'
 * @returns {Promise<Object>}
 */
export const getBillAsync = (room_number, month) => {
  return new Promise(async (resolve, reject) => {
    try {
      const bills = await getAllBillsAsync();
      const tenantBills = bills[String(room_number)] || {};
      const monthBill = tenantBills[String(month)] || {
        water: { current: null, previous: null, usage: null, amount: 0 },
        electricity: { current: null, previous: null, usage: null, amount: 0 }
      };
      console.log(`获取账单 for room_number: ${room_number}, month: ${month}:`, monthBill);
      resolve(monthBill);
    } catch (error) {
      console.error('获取账单时发生错误:', error);
      reject(error);
    }
  });
};

/**
 * 添加或更新账单（异步）
 * @param {String} room_number
 * @param {String} month - 格式为 'YYYY-MM'
 * @param {Object} billData
 * @returns {Promise<void>}
 */
export const saveBillAsync = (room_number, month, billData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const bills = await getAllBillsAsync();
      if (!bills[String(room_number)]) {
        bills[String(room_number)] = {};
      }
      // 确保金额为数字类型
      billData.water.amount = parseFloat(billData.water.amount) || 0;
      billData.electricity.amount = parseFloat(billData.electricity.amount) || 0;
      bills[String(room_number)][String(month)] = billData;
      wx.setStorage({
        key: STORAGE_KEYS.BILLS,
        data: bills,
        success: () => {
          console.log(`已保存账单 for room_number: ${room_number}, month: ${month}:`, billData);
          resolve();
        },
        fail: (err) => {
          console.error('保存账单失败:', err);
          reject(err);
        }
      });
    } catch (error) {
      console.error('保存账单时发生错误:', error);
      reject(error);
    }
  });
};

/**
 * 测试模块加载
 */
export const testFunction = () => {
  console.log('storage.js 模块已成功加载');
};
// storage/storage.js

// ... 之前的代码 ...

/**
 * 获取所有账单，按月份分组（异步）
 * @returns {Promise<Object>}
 */
export const getBillsGroupedByMonthAsync = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const bills = await getAllBillsAsync();
      const groupedBills = {};

      Object.keys(bills).forEach(roomNumber => {
        const tenantBills = bills[roomNumber];
        Object.keys(tenantBills).forEach(month => {
          if (!groupedBills[month]) {
            groupedBills[month] = [];
          }
          groupedBills[month].push({
            room_number: roomNumber,
            bill: tenantBills[month]
          });
        });
      });

      resolve(groupedBills);
    } catch (error) {
      console.error('按月份分组账单时发生错误:', error);
      reject(error);
    }
  });
};
