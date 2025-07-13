package com.example.landlordmanager

import android.content.Context
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

class DataRepository(private val context: Context) {
    private val prefs = context.getSharedPreferences("landlord_data", Context.MODE_PRIVATE)
    private val gson = Gson()

    private var tenants: MutableList<Tenant> = loadTenants()
    private var bills: MutableMap<String, MutableList<Bill>> = loadBills()

    private fun loadTenants(): MutableList<Tenant> {
        val json = prefs.getString("tenants", null)
        return if (json != null) {
            val type = object : TypeToken<MutableList<Tenant>>() {}.type
            gson.fromJson(json, type)
        } else {
            mutableListOf()
        }
    }

    private fun loadBills(): MutableMap<String, MutableList<Bill>> {
        val json = prefs.getString("bills", null)
        return if (json != null) {
            val type = object : TypeToken<MutableMap<String, MutableList<Bill>>>() {}.type
            gson.fromJson(json, type)
        } else {
            mutableMapOf()
        }
    }

    private fun saveTenants() {
        prefs.edit().putString("tenants", gson.toJson(tenants)).apply()
    }

    private fun saveBills() {
        prefs.edit().putString("bills", gson.toJson(bills)).apply()
    }

    fun getTenants(): List<Tenant> = tenants

    fun addTenant(tenant: Tenant) {
        tenants.add(tenant)
        saveTenants()
    }

    fun updateTenant(originalRoom: String, updated: Tenant) {
        val index = tenants.indexOfFirst { it.roomNumber == originalRoom }
        if (index >= 0) {
            tenants[index] = updated
            saveTenants()
        }
    }

    fun deleteTenant(roomNumber: String) {
        tenants.removeAll { it.roomNumber == roomNumber }
        bills.remove(roomNumber)
        saveTenants()
        saveBills()
    }

    fun saveBill(roomNumber: String, bill: Bill) {
        val list = bills.getOrPut(roomNumber) { mutableListOf() }
        list.removeAll { it.month == bill.month }
        list.add(bill)
        saveBills()
    }

    fun getBills(roomNumber: String): List<Bill> = bills[roomNumber] ?: emptyList()
}
