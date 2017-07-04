# Linux command line bluetoothctl wrapper for nodejs
Powerful command line utility bluetoothctl for discovery, connect, disconnect, scan, pair, etc.. 
If you want to connect bluetooth speakers , mouse, keyboard etc.. you can use this module. 

## Requirements
- Linux command line.
- Bluetooth controller.
- `bluetoothctl` package installed (comes with `bluez` package).

## Features:
- **agent(agentId)** : set agent
    - 0 = "DisplayOnly"
    - 1 = "DisplayYesNo"
    - 2 = "KeyboardDisplay
    - 3 = "KeyboardOnly"
    - 4 = "NoInputNoOutput"
    - 5 = "off"
    - 6 = "on"
- **power(bool)** : set power on or off
- **checkBluetoothController()** : checks if bluetooth controler exists or not
- **getPairedDevices()** : checks already paired devices. 
- **getDevicesFromController()** : checks already scanned devices.
- **disconnect(macID)** : disconnect from macID
- **info(macID)** : checks features of device with given macID
- **pair(macID)** : pairs with given macID
- **trust(macID)** : trust with given macID
- **block(macID)** : block given macID
- **unblock(macID)** : unblock given macID
- **untrust(macID)** : untrust with given macID
- **connect(macID)** : connect given macID
- **disconnect(macID)** : disconnect with given macID
- **remove(macID)** : remove given macID
- **scan(bool)** : starts or stops scanning of bluetooth devices. while scan is set true, current audio playback might get crackling.. so stop scan after you found what you are searching.
- **pairable(bool)** : sets your bluetooth controller as pairable
- **discoverable(bool)** : sets bluetooth controller as discoverable.
- **isScanning** : checks if bluetoothctl is already scanning. returns true/false
- **isBluetoothReady** : checks if our bluetooth controller ready.returns true/false
- **isBluetoothControlExists** : checks if we have a bluetooth hardware or not. 
- **devices** : returns the scanned and found devices as array. example output at below..
- **controllers** : returns the found bluetooth hardware devices. 

## Events
- **Controller** : event fires when bluetooth controller detected from system.
- **DeviceSignalLevel** : event fires when a discoverable bluetooth device's signal level detected.
- **Device** : event fires when a new device found or a device sends its features.
- **Connected** : event fires when a new device connected value has change (connected "yes" or "no") and return the device.
- **ConnectError** : event fires when a connection error is detected (Failed to connect: org.bluez.Error.Failed).
- **Paired** : event fires when a device is paired.
- **NewDevice** : event fires when a new device is detected.
- **RemoveDevice** : event fires when a device is removed.
- **ConnectSuccessful** : event fires when a device has been connected successfully.
- **AttemptingConnect** : event fires when a device is a attempting to connect.

## Installation
Execute: ```npm install https://github.com/jajasuperman/bluetoothctl/tarball/master```
 
## Basic usage
```javascript
 var blue = require("bluetoothctl");
 blue.Bluetooth()
 
 
 blue.on(blue.bluetoothEvents.Controller, function(controllers){
 console.log('Controllers:' + JSON.stringify(controllers,null,2))
 });
 
 
 blue.on(blue.bluetoothEvents.DeviceSignalLevel, function(devices,mac,signal){
     console.log('signal level of:' + mac + ' - ' + signal)
 
 });
 
 blue.on(blue.bluetoothEvents.Device, function (devices) {
     console.log('devices:' + JSON.stringify(devices,null,2))
 })
 
 var hasBluetooth=blue.checkBluetoothController();
 console.log('system has bluetooth controller:' + hasBluetooth)
 
 if(hasBluetooth) {
     console.log('isBluetooth Ready:' + blue.isBluetoothReady)
     blue.scan(true)
     setTimeout(function(){
         console.log('stopping scan')
         blue.scan(false)
         blue.info('00:0C:8A:8C:D3:71')
     },20000)
 }
```

## Sample output of controller:
```javascript
Controllers:[
  {
    "mac": "B8:27:EB:2E:66:7B",
    "name": "raspberrypi"
  }
]
```

 
## Sample output of devices:
```javascript 
devices:[
  {
    "mac": "00:0C:8A:8C:D3:71",
    "name": "Bose Mini SoundLink",
    "signal": 0,
    "paired": "yes",
    "trusted": "yes",
    "icon": "audio-card",
    "class": "0x240428",
    "blocked": "no",
    "connected": "no",
    "trycount": 1
  }
]
```
