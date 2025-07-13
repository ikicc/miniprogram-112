package com.example.landlordmanager

import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class ReceiptActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_receipt)
        val room = intent.getStringExtra("room_number") ?: return finish()
        val month = intent.getStringExtra("month") ?: return finish()

        val tenant = Storage.getTenants(this).find { it.roomNumber == room }
        val bill = Storage.getBill(this, room, month)
        val text = findViewById<TextView>(R.id.text_receipt)

        if (tenant != null && bill != null) {
            val total = tenant.rent + bill.waterAmount + bill.electricityAmount
            val msg = StringBuilder()
            msg.append("Tenant: ${tenant.name}\n")
            msg.append("Room: ${tenant.roomNumber}\n")
            msg.append("Month: $month\n")
            msg.append("Rent: ${tenant.rent}\n")
            msg.append("Water: ${bill.waterAmount} (${bill.waterUsage})\n")
            msg.append("Electricity: ${bill.electricityAmount} (${bill.electricityUsage})\n")
            msg.append("Total: $total")
            text.text = msg.toString()
        } else {
            text.text = "No data"
        }
    }
}
