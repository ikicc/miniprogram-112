package com.example.landlordmanager

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

class TenantAdapter(
    private var items: List<Tenant>,
    private val onClick: (Tenant) -> Unit
) : RecyclerView.Adapter<TenantAdapter.VH>() {

    class VH(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val name: TextView = itemView.findViewById(android.R.id.text1)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): VH {
        val view = LayoutInflater.from(parent.context)
            .inflate(android.R.layout.simple_list_item_1, parent, false)
        return VH(view)
    }

    override fun onBindViewHolder(holder: VH, position: Int) {
        val tenant = items[position]
        holder.name.text = "${tenant.roomNumber} - ${tenant.name}"
        holder.itemView.setOnClickListener { onClick(tenant) }
    }

    override fun getItemCount(): Int = items.size

    fun updateData(newItems: List<Tenant>) {
        items = newItems
        notifyDataSetChanged()
    }
}
