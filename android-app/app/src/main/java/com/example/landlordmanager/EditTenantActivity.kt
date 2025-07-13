package com.example.landlordmanager

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity

class EditTenantActivity : AppCompatActivity() {

    private lateinit var repository: DataRepository
    private var originalRoom: String = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_edit_tenant)

        repository = DataRepository(this)
        originalRoom = intent.getStringExtra("room") ?: ""
        val tenant = repository.getTenants().find { it.roomNumber == originalRoom }

        val name = findViewById<EditText>(R.id.edit_name)
        val room = findViewById<EditText>(R.id.edit_room)
        val rent = findViewById<EditText>(R.id.edit_rent)

        tenant?.let {
            name.setText(it.name)
            room.setText(it.roomNumber)
            rent.setText(it.rent.toString())
        }

        findViewById<Button>(R.id.button_save).setOnClickListener {
            val updated = Tenant(
                name.text.toString(),
                room.text.toString(),
                rent.text.toString().toDoubleOrNull() ?: 0.0
            )
            repository.updateTenant(originalRoom, updated)
            finish()
        }
    }
}
