package com.surveysparrow.expo_spotchecks

import android.content.Context
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

// Same store as the legacy SDK (default SharedPreferences), so stored UUIDs survive the upgrade.
class StorageModule : Module() {
  private val prefs
    get() = appContext.reactContext?.let {
      it.getSharedPreferences("${it.packageName}_preferences", Context.MODE_PRIVATE)
    }

  override fun definition() = ModuleDefinition {
    Name("SpotchecksStorage")

    Function("getString") { key: String ->
      prefs?.getString(key, null)
    }

    Function("putString") { key: String, value: String ->
      prefs?.edit()?.putString(key, value)?.apply()
    }
  }
}
