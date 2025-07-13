package com.example.landlordmanager

import android.os.Bundle
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import android.view.ViewGroup
import android.content.Intent

class BillListActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_bill_list)

        val container = findViewById<LinearLayout>(R.id.container_bills)
        val billsByMonth = Storage.getBillsGroupedByMonth(this)

        val sortedMonths = billsByMonth.keys.sortedDescending()
        for (month in sortedMonths) {
            val header = TextView(this)
            header.text = month
            header.textSize = 18f
            container.addView(header)

            val list = billsByMonth[month] ?: continue
            list.forEach { (room, bill) ->
                val item = TextView(this)
                val tenant = Storage.getTenants(this).find { it.roomNumber == room }
                val rent = tenant?.rent ?: 0.0
                val total = rent + bill.waterAmount + bill.electricityAmount
                item.text = "Room $room - $month - Total: $total"
                item.setPadding(0, 0, 0, 8)
                item.setOnClickListener {
                    val intent = Intent(this, ReceiptActivity::class.java)
                    intent.putExtra("room_number", room)
                    intent.putExtra("month", month)
                    startActivity(intent)
                }
                container.addView(item, ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT))
            }
        }
    }
}
