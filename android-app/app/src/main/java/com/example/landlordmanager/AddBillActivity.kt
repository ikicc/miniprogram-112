package com.example.landlordmanager

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity

class AddBillActivity : AppCompatActivity() {
    private lateinit var repository: DataRepository
    private var roomNumber: String = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_add_bill)

        repository = DataRepository(this)
        roomNumber = intent.getStringExtra("room") ?: ""

        val month = findViewById<EditText>(R.id.edit_month)
        val waterCurrent = findViewById<EditText>(R.id.edit_water_current)
        val electricCurrent = findViewById<EditText>(R.id.edit_electric_current)

        findViewById<Button>(R.id.button_save_bill).setOnClickListener {
            val bill = Bill(
                month.text.toString(),
                waterCurrent.text.toString().toDoubleOrNull() ?: 0.0,
                0.0,
                0.0,
                electricCurrent.text.toString().toDoubleOrNull() ?: 0.0,
                0.0,
                0.0
            )
            repository.saveBill(roomNumber, bill)
            finish()
        }
    }
}
