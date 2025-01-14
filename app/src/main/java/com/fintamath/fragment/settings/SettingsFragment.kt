package com.fintamath.fragment.settings

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import androidx.fragment.app.Fragment
import com.fintamath.R

class SettingsFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?,
    ): View? {
        val fragmentView = inflater.inflate(R.layout.fragment_settings, container, false)

        val backButton: ImageButton = fragmentView.findViewById(R.id.settingsBackButton)
        backButton.setOnClickListener { executeBack() }

        return fragmentView
    }

    private fun executeBack() {
        activity?.onBackPressedDispatcher?.onBackPressed()
    }
}
