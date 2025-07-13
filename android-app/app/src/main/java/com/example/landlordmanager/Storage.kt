import android.content.Context
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

object Storage {
    private const val PREFS_NAME = "landlord_storage"
    private const val KEY_TENANTS = "tenants"
    private const val KEY_BILLS = "bills"
    private val gson = Gson()

    fun getTenants(context: Context): MutableList<Tenant> {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val json = prefs.getString(KEY_TENANTS, null) ?: return mutableListOf()
        val type = object : TypeToken<MutableList<Tenant>>() {}.type
        return gson.fromJson(json, type)
    }

    fun saveTenants(context: Context, tenants: List<Tenant>) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        prefs.edit().putString(KEY_TENANTS, gson.toJson(tenants)).apply()
    }

    private fun getBillsMap(context: Context): MutableMap<String, MutableList<Bill>> {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val json = prefs.getString(KEY_BILLS, null) ?: return mutableMapOf()
        val type = object : TypeToken<MutableMap<String, MutableList<Bill>>>() {}.type
        return gson.fromJson(json, type)
    }

    private fun saveBillsMap(context: Context, bills: MutableMap<String, MutableList<Bill>>) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        prefs.edit().putString(KEY_BILLS, gson.toJson(bills)).apply()
    }

    fun addBill(context: Context, roomNumber: String, bill: Bill) {
        val bills = getBillsMap(context)
        val list = bills.getOrPut(roomNumber) { mutableListOf() }
        list.removeAll { it.month == bill.month }
        list.add(bill)
        saveBillsMap(context, bills)
    }

    fun getBill(context: Context, roomNumber: String, month: String): Bill? {
        return getBillsMap(context)[roomNumber]?.find { it.month == month }
    }

    fun getBillsGroupedByMonth(context: Context): Map<String, List<Pair<String, Bill>>> {
        val bills = getBillsMap(context)
        val result = mutableMapOf<String, MutableList<Pair<String, Bill>>>()
        bills.forEach { (room, list) ->
            list.forEach { bill ->
                result.getOrPut(bill.month) { mutableListOf() }.add(room to bill)
            }
        }
        return result
    }
}
