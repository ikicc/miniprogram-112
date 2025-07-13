package com.example.landlordmanager

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

class BillListAdapter(
    private var items: List<Pair<String, Bill>>,
    private val onClick: (Bill, String) -> Unit
) : RecyclerView.Adapter<BillListAdapter.VH>() {

    class VH(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val text: TextView = itemView.findViewById(android.R.id.text1)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): VH {
        val view = LayoutInflater.from(parent.context)
            .inflate(android.R.layout.simple_list_item_1, parent, false)
        return VH(view)
    }

    override fun onBindViewHolder(holder: VH, position: Int) {
        val (room, bill) = items[position]
        holder.text.text = "${bill.month} - Room $room"
        holder.itemView.setOnClickListener { onClick(bill, room) }
    }

    override fun getItemCount(): Int = items.size

    fun updateData(newItems: List<Pair<String, Bill>>) {
        items = newItems
        notifyDataSetChanged()
    }
}
