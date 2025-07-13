package com.example.landlordmanager

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

class TenantAdapter(private val onClick: (Tenant) -> Unit) : RecyclerView.Adapter<TenantAdapter.ViewHolder>() {
    private var tenants: List<Tenant> = listOf()

    fun setTenants(list: List<Tenant>) {
        tenants = list
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_tenant, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val tenant = tenants[position]
        holder.bind(tenant)
        holder.itemView.findViewById<Button>(R.id.button_edit).setOnClickListener { onClick(tenant) }
    }

    override fun getItemCount(): Int = tenants.size

    class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        fun bind(tenant: Tenant) {
            itemView.findViewById<TextView>(R.id.text_name).text = tenant.name
            itemView.findViewById<TextView>(R.id.text_room).text = "Room: ${tenant.roomNumber}"
            itemView.findViewById<TextView>(R.id.text_rent).text = "Rent: ${tenant.rent}"
        }
    }
}
