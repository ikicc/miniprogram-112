package com.example.landlordmanager

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.button.MaterialButton

class MainActivity : AppCompatActivity() {

    private lateinit var repository: DataRepository
    private lateinit var adapter: TenantAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        repository = DataRepository(this)
        adapter = TenantAdapter(repository.getTenants()) { tenant ->
            val intent = Intent(this, EditTenantActivity::class.java)
            intent.putExtra("room", tenant.roomNumber)
            startActivity(intent)
        }

        val recycler = findViewById<RecyclerView>(R.id.recycler_tenants)
        recycler.layoutManager = LinearLayoutManager(this)
        recycler.adapter = adapter

        findViewById<MaterialButton>(R.id.button_add_tenant).setOnClickListener {
            startActivity(Intent(this, AddTenantActivity::class.java))
        }

        findViewById<MaterialButton>(R.id.button_bill_list).setOnClickListener {
            startActivity(Intent(this, BillListActivity::class.java))
        }
    }

    override fun onResume() {
        super.onResume()
        adapter.updateData(repository.getTenants())
    }
}
