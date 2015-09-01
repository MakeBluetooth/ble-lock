# BLE Lock

## Arduino

![](images/BluetoothLock.png)

The Arduino sketch requires the [BLEPeripheral](https://github.com/sandeepmistry/arduino-BLEPeripheral) library.

## Cordova

The project from git contains only the Cordova code. The BLE plugin and iOS or Android platform needs to be installed into the project before running.

    $ cd cordova
    $ cordova plugin add com.megster.cordova.ble
    $ cordova plugin add org.apache.cordova.console

### Android

    $ cordova platform add android
    $ cordova run android --device

### iOS

    $ cordova platform add ios
    $ open platforms/ios/BLE\ Lock.xcodeproj

Plug in your iPhone.
Choose the target device in Xcode.
Build and deploy through Xcode.

#### Making changes

You can modify the application by editing the files in `$PROJECT_HOME/cordova/www`.

Make sure you run `cordova prepare` before redeploying the app through Xcode.
