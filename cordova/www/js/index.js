/*global cordova, ble, deviceListScreen, unlockScreen, scrim, statusDiv, deviceList, refreshButton, disconnectButton*/

// Bluetooth Low Energy Lock (c) 2014-2015 Don Coleman

var lock = {
    serviceUUID: "D270",
    unlockUUID: "D271",
    statusUUID: "D272"
};

function stringToArrayBuffer(str) {
    // assuming 8 bit bytes
    var ret = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++) {
        ret[i] = str.charCodeAt(i);
        console.log(ret[i]);
    }
    return ret.buffer;
}

function bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

var app = {
    connectedPeripheral: null,

    // Application Constructor
    initialize: function() {
        this.bindEvents();
        deviceListScreen.hidden = true;
        unlockScreen.hidden = true;
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.forms[0].addEventListener('submit', this.unlock, false);

    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        deviceList.ontouchstart = app.connect; // assume not scrolling
        refreshButton.ontouchstart = app.scan;
        disconnectButton.onclick = app.disconnect;

        app.scan();
    },
    scan: function(e) {
        deviceList.innerHTML = ""; // clear the list
        app.showProgressIndicator("Scanning for Bluetooth Devices...");

        ble.startScan([lock.serviceUUID],
            app.onDeviceDiscovered,
            function() { alert("Listing Bluetooth Devices Failed"); }
        );

        // stop scan after 5 seconds
        setTimeout(ble.stopScan, 5000, app.onScanComplete);

    },
    connect: function (e) {
        var device = e.target.dataset.deviceId;
        app.showProgressIndicator("Requesting connection to " + device);
        ble.connect(device, app.onConnect, app.onDisconnect);
    },
    disconnect: function (e) {
        if (e) {
            e.preventDefault();
        }

        app.setStatus("Disconnecting...");
        ble.disconnect(app.connectedPeripheral.id, function() {
            app.setStatus("Disconnected");
            setTimeout(app.scan, 800);
        });
    },
    onConnect: function(peripheral) {
        app.connectedPeripheral = peripheral;
        app.showUnlockScreen();
        app.setStatus("Connected");
        ble.notify(peripheral.id, lock.serviceUUID, lock.statusUUID, app.onData);
    },
    onDisconnect: function(reason) {
        if (!reason) {
            reason = "Connection Lost";
        }
        app.setStatus(reason);

        app.hideProgressIndicator();
        app.showDeviceListPage();
    },
    onData: function(buffer) {
        var message = bytesToString(buffer);
        app.setStatus(message);
        app.hideProgressIndicator();
    },
    unlock: function(e) {
        var code = e.target.code.value;
        e.preventDefault(); // don't submit the form

        if (code === "") { return; } // don't send empty data
        app.showProgressIndicator();

        function success() {
            e.target.code.value = ""; //  clear the input
            //app.hideProgressIndicator();
        }

        function failure (reason) {
            alert("Error sending code " + reason);
            app.hideProgressIndicator();
        }

        ble.write(
            app.connectedPeripheral.id,
            lock.serviceUUID,
            lock.unlockUUID,
            stringToArrayBuffer(code),
            success, failure);

    },
    onDeviceDiscovered: function(device) {
        var listItem, rssi;

        app.showDeviceListPage();

        console.log(JSON.stringify(device));
        listItem = document.createElement('li');
        listItem.dataset.deviceId = device.id;
        if (device.rssi) {
            rssi = "RSSI: " + device.rssi + "<br/>";
        } else {
            rssi = "";
        }
        listItem.innerHTML = device.name + "<br/>" + rssi + device.id;
        deviceList.appendChild(listItem);

        var deviceListLength = deviceList.getElementsByTagName('li').length;
        app.setStatus("Found " + deviceListLength + " device" + (deviceListLength === 1 ? "." : "s."));
    },
    onScanComplete: function() { // this isn't strictly necessary
        var deviceListLength = deviceList.getElementsByTagName('li').length;
        if (deviceListLength === 0) {
            app.showDeviceListPage();
            app.setStatus("No Bluetooth Peripherals Discovered.");
        }
    },
    showProgressIndicator: function(message) {
        if (!message) { message = "Processing"; }
        scrim.firstElementChild.innerHTML = message;
        scrim.hidden = false;
        statusDiv.innerHTML = "";
    },
    hideProgressIndicator: function() {
        scrim.hidden = true;
    },
    showUnlockScreen: function() {
        unlockScreen.hidden = false;
        deviceListScreen.hidden = true;
        app.hideProgressIndicator();
        statusDiv.innerHTML = "";
    },
    showDeviceListPage: function() {
        unlockScreen.hidden = true;
        deviceListScreen.hidden = false;
        app.hideProgressIndicator();
        statusDiv.innerHTML = "";
    },
    setStatus: function(message){
        console.log(message);
        statusDiv.innerHTML = message;
    }

};
