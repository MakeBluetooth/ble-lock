# BLE Lock

## Arduino

![](images/BluetoothLock.png)

The Arduino sketches require the [https://github.com/sandeepmistry/arduino-BLEPeripheral](BLEPeripheral) library.

## Cordova

### Setup

 * Cordova 4.3.0
 * Xcode 6.2 for iOS development
 * Android SDK for Android

Install NodeJS with `brew install` or download from http://nodejs.org.

Install Cordova using NPM, which comes with NodeJS.

    $ npm install -g cordova

See the [Cordova Documentation](http://cordova.apache.org/docs/en/4.0.0/guide_platforms_index.md.html#Platform%20Guides) for more information.

### Building

The project from git contains only the Cordova code. The BLE plugin and iOS or Android platform needs to be installed into the project before running.

    $ cd cordova
    $ cordova plugin add com.megster.cordova.ble
    $ cordova plugin add org.apache.cordova.console

#### Android

    $ cordova platform add android
    $ cordova run android --device

#### iOS

    $ cordova platform add ios
    $ open platforms/ios/BLE\ Lock.xcodeproj

Plug in your iPhone.
Choose the target device in Xcode.
![](images/XcodeChoosePhone.png)
Build and deploy through Xcode.

##### Making changes

You can modify the application by editing the files in `$PROJECT_HOME/cordova/www`.

Make sure you run `cordova prepare` before redeploying the app through Xcode.
