package com.example.landlordmanager

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity

class AddTenantActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_add_tenant)

        val editName = findViewById<EditText>(R.id.edit_name)
        val editRoom = findViewById<EditText>(R.id.edit_room)
        val editRent = findViewById<EditText>(R.id.edit_rent)
        val buttonSave = findViewById<Button>(R.id.button_save)

        buttonSave.setOnClickListener {
            val tenant = Tenant(
                editName.text.toString(),
                editRoom.text.toString(),
                editRent.text.toString().toDoubleOrNull() ?: 0.0
            )
            val tenants = Storage.getTenants(this)
            tenants.add(tenant)
            Storage.saveTenants(this, tenants)
            finish()
        }
    }
}
