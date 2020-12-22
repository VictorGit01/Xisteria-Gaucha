package com.xisteriagaucha;

import com.facebook.react.ReactActivity;

// Eu coloquei aqui!
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
//

// Adicionei recentemente:
import android.content.Intent;
// 

// Eu adicionei para a biblioteca de imersão para manter a cor da barra de navegação do android:
import com.rnimmersive.RNImmersiveModule;
// 

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "VirtualRequest";
  }

  // Eu coloquei aqui!
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
  return new ReactActivityDelegate(this, getMainComponentName()) {
  @Override
  protected ReactRootView createRootView() {
  return new RNGestureHandlerEnabledRootView(MainActivity.this);
  }
  };
  }
  //

  // Eu Coloquei aqui!
  @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
    }
  //

  // Eu adicionei para a biblioteca de imersão para manter a cor da barra de navegação do android:
  @Override
  public void onWindowFocusChanged(boolean hasFocus) {
    super.onWindowFocusChanged(hasFocus);

    if (hasFocus && RNImmersiveModule.getInstance() != null) {
      RNImmersiveModule.getInstance().emitImmersiveStateChangeEvent();
    }
  }
  // 
}
