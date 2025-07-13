import android.content.Context
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

object Storage {
    private const val PREFS_NAME = "landlord_storage"
    private const val KEY_TENANTS = "tenants"
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
}
