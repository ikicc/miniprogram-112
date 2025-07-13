package com.example.landlordmanager

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity

class AddBillActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_add_bill)

        val roomNumber = intent.getStringExtra("room_number") ?: return finish()

        val editMonth = findViewById<EditText>(R.id.edit_month)
        val editWaterUsage = findViewById<EditText>(R.id.edit_water_usage)
        val editWaterAmount = findViewById<EditText>(R.id.edit_water_amount)
        val editEleUsage = findViewById<EditText>(R.id.edit_electricity_usage)
        val editEleAmount = findViewById<EditText>(R.id.edit_electricity_amount)
        val buttonSave = findViewById<Button>(R.id.button_save_bill)

        buttonSave.setOnClickListener {
            val month = editMonth.text.toString()
            val waterUsage = editWaterUsage.text.toString().toDoubleOrNull() ?: 0.0
            val waterAmount = editWaterAmount.text.toString().toDoubleOrNull() ?: 0.0
            val eleUsage = editEleUsage.text.toString().toDoubleOrNull() ?: 0.0
            val eleAmount = editEleAmount.text.toString().toDoubleOrNull() ?: 0.0

            val bill = Bill(waterUsage, waterAmount, eleUsage, eleAmount, month)
            Storage.addBill(this, roomNumber, bill)
            finish()
        }
    }
}
