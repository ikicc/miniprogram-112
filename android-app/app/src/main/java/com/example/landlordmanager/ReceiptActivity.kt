package com.example.landlordmanager

import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class ReceiptActivity : AppCompatActivity() {
    private lateinit var repository: DataRepository

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_receipt)

        repository = DataRepository(this)
        val room = intent.getStringExtra("room") ?: return
        val bills = repository.getBills(room)
        val latest = bills.maxByOrNull { it.month }

        val text = findViewById<TextView>(R.id.text_receipt)
        text.text = latest?.let {
            "Receipt for Room $room\nMonth: ${it.month}\nWater: ${it.waterCurrent}\nElectricity: ${it.electricityCurrent}"
        } ?: "No receipt"
    }
}
