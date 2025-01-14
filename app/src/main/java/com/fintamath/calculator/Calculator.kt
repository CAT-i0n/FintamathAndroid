package com.fintamath.calculator

import androidx.annotation.Keep

@Keep
internal class Calculator(
    private val calculationCallback: (result: List<String>) -> Unit
) {

    external fun calculate(str: String)

    external fun stopCurrentCalculations()

    private fun onCalculated(str: String) {
        calculationCallback.invoke(listOf(*str.split("\n").toTypedArray()))
    }

    companion object {
        init {
            System.loadLibrary("fintamath_android")
        }
    }
}
