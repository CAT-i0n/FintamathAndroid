package com.fintamath.widget.mathview

import android.content.Context
import android.content.res.TypedArray
import android.widget.LinearLayout
import android.view.LayoutInflater
import android.view.View
import com.fintamath.R

internal class MathSolutionAlternativesView constructor(
    context: Context,
    attrs: TypedArray
) : LinearLayout(context) {

    private val mathTextViewLayout: Int
    private val delimiterLayout: Int

    private var onTouchListener: OnTouchListener? = null

    private val textViews = mutableListOf<MathTextView>()
    private val delimiters = mutableListOf<View>()

    init {
        orientation = VERTICAL

        mathTextViewLayout =
            attrs.getResourceId(R.styleable.MathSolutionView_alternativeMathTextViewLayout, 0)
        delimiterLayout =
            attrs.getResourceId(R.styleable.MathSolutionView_alternativeDelimiterLayout, 0)

        addTextView()
    }

    fun setTexts(texts: List<String>) {
        for (i in textViews.size until texts.size) {
            addDelimiter()
            addTextView()
        }

        textViews[0].text = texts[0]

        val distinctTexts = texts.distinct()

        for (i in 1 until distinctTexts.size) {
            textViews[i].text = distinctTexts[i]
            textViews[i].visibility = VISIBLE
            delimiters[i - 1].visibility = VISIBLE
        }

        for (i in distinctTexts.size until textViews.size) {
            textViews[i].visibility = GONE
            textViews[i].clear()
            delimiters[i - 1].visibility = GONE
        }
    }

    override fun setOnTouchListener(listener: OnTouchListener) {
        onTouchListener = listener

        for (text in textViews) {
            text.setOnTouchListener(onTouchListener)
        }

        super.setOnTouchListener(onTouchListener)
    }

    private fun addTextView() {
        val textView = inflate(context, mathTextViewLayout, null) as MathTextView
        textView.setOnTouchListener(onTouchListener)
        textViews.add(textView)
        addView(textView)
    }

    private fun addDelimiter() {
        val delimiter = inflate(context, delimiterLayout, null)
        delimiter.visibility = GONE
        delimiter.setOnTouchListener(onTouchListener)
        delimiters.add(delimiter)
        addView(delimiter)
    }
}
