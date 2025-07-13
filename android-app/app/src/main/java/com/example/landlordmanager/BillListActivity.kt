package com.example.landlordmanager

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView

class BillListActivity : AppCompatActivity() {
    private lateinit var repository: DataRepository
    private lateinit var adapter: BillListAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_bill_list)

        repository = DataRepository(this)
        adapter = BillListAdapter(emptyList()) { bill, room ->
            val intent = Intent(this, BillDetailActivity::class.java)
            intent.putExtra("room", room)
            intent.putExtra("month", bill.month)
            startActivity(intent)
        }

        val recycler = findViewById<RecyclerView>(R.id.recycler_bills)
        recycler.layoutManager = LinearLayoutManager(this)
        recycler.adapter = adapter
    }

    override fun onResume() {
        super.onResume()
        val allBills = repository.getTenants().flatMap { tenant ->
            repository.getBills(tenant.roomNumber).map { bill -> tenant.roomNumber to bill }
        }
        adapter.updateData(allBills)
    }
}
