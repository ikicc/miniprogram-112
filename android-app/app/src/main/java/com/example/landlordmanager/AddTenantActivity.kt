package com.example.landlordmanager

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity

class AddTenantActivity : AppCompatActivity() {

    private lateinit var repository: DataRepository

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_add_tenant)

        repository = DataRepository(this)

        val name = findViewById<EditText>(R.id.edit_name)
        val room = findViewById<EditText>(R.id.edit_room)
        val rent = findViewById<EditText>(R.id.edit_rent)

        findViewById<Button>(R.id.button_save).setOnClickListener {
            val tenant = Tenant(
                name.text.toString(),
                room.text.toString(),
                rent.text.toString().toDoubleOrNull() ?: 0.0
            )
            repository.addTenant(tenant)
            finish()
        }
    }
}
