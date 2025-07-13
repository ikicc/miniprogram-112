package com.example.landlordmanager

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import android.widget.Button

class MainActivity : AppCompatActivity() {
    private lateinit var adapter: TenantAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val buttonAdd = findViewById<Button>(R.id.button_add_tenant)
        val buttonBills = findViewById<Button>(R.id.button_bill_list)
        val recyclerView = findViewById<RecyclerView>(R.id.recycler_view_tenants)

        recyclerView.layoutManager = LinearLayoutManager(this)
        adapter = TenantAdapter { tenant ->
            // TODO edit tenant or show options
        }
        recyclerView.adapter = adapter

        buttonAdd.setOnClickListener {
            startActivity(Intent(this, AddTenantActivity::class.java))
        }

        buttonBills.setOnClickListener {
            startActivity(Intent(this, BillListActivity::class.java))
        }
    }

    override fun onResume() {
        super.onResume()
        adapter.setTenants(Storage.getTenants(this))
    }
}
