package com.example.landlordmanager

data class Bill(
    var month: String,
    var waterCurrent: Double,
    var waterPrevious: Double,
    var waterAmount: Double,
    var electricityCurrent: Double,
    var electricityPrevious: Double,
    var electricityAmount: Double
)
