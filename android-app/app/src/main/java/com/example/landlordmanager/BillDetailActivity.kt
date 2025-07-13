package com.example.landlordmanager

import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class BillDetailActivity : AppCompatActivity() {
    private lateinit var repository: DataRepository

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_bill_detail)

        repository = DataRepository(this)
        val room = intent.getStringExtra("room") ?: return
        val month = intent.getStringExtra("month") ?: return

        val bill = repository.getBills(room).find { it.month == month }
        val text = findViewById<TextView>(R.id.text_bill_detail)
        text.text = bill?.let {
            "Room $room\nMonth: ${it.month}\nWater: ${it.waterCurrent}\nElectricity: ${it.electricityCurrent}"
        } ?: "No data"
    }
}
