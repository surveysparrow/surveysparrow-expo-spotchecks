package com.surveysparrow.expo_spotchecks

import android.app.Activity
import android.os.Handler
import android.os.Looper
import android.view.WindowManager
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class AdjusterModule : Module() {
  // Read and written only on the main thread.
  private var savedMode: Int? = null
  // Always posts, so save, set and restore run in call order.
  private val mainHandler = Handler(Looper.getMainLooper())

  private fun onMain(block: () -> Unit) {
    mainHandler.post(block)
  }

  override fun definition() = ModuleDefinition {
    Name("Adjuster")

    // Save only once per show, so a second pause can't save ADJUST_NOTHING over the app's mode.
    Function("saveCurrentMode") {
      val activity: Activity? = appContext.currentActivity
      onMain {
        if (savedMode == null) {
          savedMode = activity?.window?.attributes?.softInputMode
        }
      }
    }

    Function("restoreSavedMode") {
      val activity: Activity? = appContext.currentActivity
      onMain {
        savedMode?.let { mode -> activity?.window?.setSoftInputMode(mode) }
        savedMode = null
      }
    }

    Function("setAdjustNothing") {
      val activity: Activity? = appContext.currentActivity
      onMain {
        activity?.window?.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_NOTHING)
      }
    }
  }
}
