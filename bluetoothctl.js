var regexps = require('./regexps');

exports = module.exports = {};
exports.Bluetooth = function () {
    var self = this;

    var events = require('events');
    events.EventEmitter.call(self);
    self.__proto__ = events.EventEmitter.prototype;

    var pty = require('ptyw.js/lib/pty.js');

    var ransi = require('strip-ansi');

    var term = pty.spawn('bash', [], {
        name: 'xterm-color',
        cols: 100,
        rows: 40,
        cwd: process.env.HOME,
        env: process.env
    });

    var agents = [
                    "DisplayOnly",      // 0
                    "DisplayYesNo",     // 1
                    "KeyboardDisplay",  // 2
                    "KeyboardOnly",     // 3
                    "NoInputNoOutput",  // 4
                    "off",              // 5
                    "on"                // 6
                ];

    var bluetoothEvents = {
        Device: 'DeviceEvent',
        Controller: 'ControllerEvent',
        DeviceSignalLevel: 'DeviceSignalLevel',
        Connected: 'Connected',
        Disconnected: 'Disconnected',
        ConnectError: 'ConnectError',
        Paired: 'Paired',
        NewDevice: 'NewDevice',
        RemoveDevice: 'RemoveDevice',
        ConnectSuccessful: 'ConnectSuccessful',
        AttemptingConnect: 'AttemptingConnect'
    };

    var mydata = "";
    var devices = [];
    var controllers = [];
    var isBluetoothControlExists = false;
    var isBluetoothReady = false;
    var isScanning = false;
    var connectedMAC = "";

    Object.defineProperty(this, 'isBluetoothControlExists', {
        get: function () {
            return isBluetoothControlExists;
        },
        set: function (value) {
            isBluetoothControlExists = value;
        }
    });

    Object.defineProperty(this, 'isScanning', {
        get: function () {
            return isScanning;
        },
        set: function (value) {
            isScanning = value;
        }
    });
    Object.defineProperty(this, 'isBluetoothReady', {
        get: function () {
            return isBluetoothReady;
        },
        set: function (value) {
            isBluetoothReady = value;
        }
    });
    Object.defineProperty(this, 'devices', {
        get: function () {
            return devices;
        },
        set: function (value) {
            devices = value;
        }
    });
    Object.defineProperty(this, 'controllers', {
        get: function () {
            return controllers;
        },
        set: function (value) {
            controllers = value;
        }
    });
    Object.defineProperty(this, 'bluetoothEvents', {
        get: function () {
            return bluetoothEvents;
        },
        set: function (value) {
            bluetoothEvents = value;
        }
    });

    Object.defineProperty(this, 'term', {
        get: function () {
            return term;
        },
        set: function (value) {
            term = value;
        }
    });

    Object.defineProperty(this, 'agents', {
        get: function () {
            return agents;
        },
        set: function (value) {
            agents = value;
        }
    });

    function checkInfo(obj) {
        if (obj.devices.length > 0) {
            for (var i = 0; i < obj.devices.length; i++) {
                if (obj.devices[i].paired == '' && obj.devices[i].trycount < 4) {
                    obj.devices[i].trycount += 1;
                    obj.info(obj.devices[i].mac);
                    console.log('checking info of ' + obj.devices[i].mac);
                }
            }
        }
    }

    var os = require('os');
    if (os.platform() == 'linux') {
        term.write('type bluetoothctl\r');
    }

    term.on('data', function (data) {
        data = ransi(data).replace('[bluetooth]#', '');
        if (data.indexOf('bluetoothctl is ') !== -1 && (data.indexOf('/usr/bin/bluetoothctl') !== -1 || data.indexOf('/usr/local/bin/bluetoothctl') !== -1)) {
            isBluetoothControlExists = true;
            isBluetoothReady=true;
            console.log('bluetooth controller exists');
            term.write('bluetoothctl\r');
            //term.write('power on\r');
            checkInfo(self);
            setInterval(checkInfo, 5000, self);
        }

        checkDevice(regexps.regexdevice, data);
        checkinfo(regexps.regestr, data);
        checkSignal(regexps.regexsignal, data);
        checkController(regexps.regexcontroller, data);
        checkConnected(regexps.regexconnected, data);
        checkPaired(regexps.regexpaired, data);
        checkTrusted(regexps.regextrusted, data);
        checkBlocked(regexps.regexblocked, data);
        checkAttempt(regexps.regexAttemptingConnect, data);

        if (data.indexOf(regexps.regexscanoff1) !== -1 || data.indexOf(regexps.regexscanoff2) !== -1 || data.indexOf(regexps.regexscanoff3) !== -1) {
            isScanning = false;
        }
        if (data.indexOf(regexps.regexscanon1) !== -1 || data.indexOf(regexps.regexscanon2) !== -1 || data.indexOf(regexps.regexscanon3) !== -1) {
            isScanning = true;
        }
        if (data.indexOf(regexps.failToConnect) !== -1 || data.indexOf(regexps.failToPair) !== -1 || data.indexOf(regexps.regexNotAvailable) !== -1) self.emit(bluetoothEvents.ConnectError);

        if (data.indexOf(regexps.regexAuthorizeService) !== -1 || data.indexOf(regexps.regexConfirmPasskey) !== -1) {
            term.write('yes\r');
        }
        if (data.indexOf(regexps.connectSuccess) !== -1) self.emit(bluetoothEvents.ConnectSuccess);

    })

    function checkAttempt(regstr, data) {
        var m;
        while ((m = regstr.exec(data)) !== null) {
            if (m.index === regstr.lastIndex) {
                regstr.lastIndex++;
            }
            //m[1] - macid
            if (devices.length > 0) {
                for (var j = 0; j < devices.length; j++) {
                    if (devices[j].mac == m[1]) {
                        self.emit(bluetoothEvents.AttemptingConnect, devices[j]);
                    }
                }
            }
        }
    }

    function checkBlocked(regstr, data) {
        var m;
        while ((m = regstr.exec(data)) !== null) {
            if (m.index === regstr.lastIndex) {
                regstr.lastIndex++;
            }
            //m[1] - macid
            //m[2] - yes or no
            if (devices.length > 0) {
                for (var j = 0; j < devices.length; j++) {
                    if (devices[j].mac == m[1]) {
                        devices[j].blocked = m[2];
                        console.log(m[1] + " blocked " + m[2]);
                        self.emit(bluetoothEvents.Device, devices);
                    }
                }
            }
        }
    }

    function checkPaired(regstr, data) {
        var m;
        while ((m = regstr.exec(data)) !== null) {
            if (m.index === regstr.lastIndex) {
                regstr.lastIndex++;
            }
            //m[1] - macid
            //m[2] - yes or no
            if (devices.length > 0) {
                for (var j = 0; j < devices.length; j++) {
                    if (devices[j].mac == m[1]) {
                        devices[j].paired = m[2];
                        console.log(m[1] + " paired " + m[2]);
                        if (m[2] === "yes") self.emit(bluetoothEvents.Paired, devices[j]);
                    }
                }
            }
        }
    }

    function checkTrusted(regstr, data) {
        var m;
        while ((m = regstr.exec(data)) !== null) {
            if (m.index === regstr.lastIndex) {
                regstr.lastIndex++;
            }
            //m[1] - macid
            //m[2] - yes or no
            if (devices.length > 0) {
                for (var j = 0; j < devices.length; j++) {
                    if (devices[j].mac == m[1]) {
                        devices[j].trusted = m[2];
                        console.log(m[1] + " trusted " + m[2]);
                        self.emit(bluetoothEvents.Device, devices);

                    }
                }
            }
        }
    }

    function checkConnected(regstr, data) {
        var m;
        while ((m = regstr.exec(data)) !== null) {
            if (m.index === regstr.lastIndex) {
                regstr.lastIndex++;
            }
            //m[1] - macid
            //m[2] - yes or no
            if (devices.length > 0) {
                for (var j = 0; j < devices.length; j++) {
                    if (devices[j].mac == m[1]) {
                        console.log(m[1] + " connected " + m[2]);
                        if (devices[j].connected != m[2]) {
                            devices[j].connected = m[2];
                            if (m[2] === "yes") {
                                connectedMAC = m[1];
                                self.emit(bluetoothEvents.Connected, devices[j]);
                            }
                            else if (m[2] === "no") {
                                connectedMAC = '';
                                self.emit(bluetoothEvents.Disconnected, devices[j]);
                            }
                        }
                    }
                }
            }
        }
    }

    function checkinfo(regstr, data) {

        while ((m = regstr.exec(data)) !== null) {
            if (m.index === regstr.lastIndex) {
                regstr.lastIndex++;
            }
            //m[1] - macid
            //m[2] - device name
            //m[3] - alias
            //m[4] - Class
            //m[5] - Icon
            //m[6] - paired
            //m[7] - trusted
            //m[8] - blocked
            //m[9] - connected
            if (devices.length > 0) {
                for (var j = 0; j < devices.length; j++) {
                    if (devices[j].mac == m[1]) {
                        devices[j].name = m[3];
                        devices[j].class = m[4];
                        devices[j].icon = m[5];
                        devices[j].paired = m[6];
                        devices[j].trusted = m[7];
                        devices[j].blocked = m[8];
                        devices[j].connected = m[9];
                        self.emit(bluetoothEvents.Device, devices);
                    }
                }
            }
        }
    }

    function checkSignal(regstr, data) {
        var m;
        while ((m = regstr.exec(data)) !== null) {
            if (m.index === regstr.lastIndex) {
                regstr.lastIndex++;
            }
            //m[1] - macid
            //m[2] - signal Level
            if (devices.length > 0) {
                for (var j = 0; j < devices.length; j++) {
                    if (devices[j].mac == m[1]) {
                        devices[j].signal = parseInt(m[2]);
                        //devices[j].available = true
                        //console.log('signal level of:' + m[1] + ' is ' + m[2])
                        self.emit(bluetoothEvents.Device, devices);
                        self.emit(bluetoothEvents.DeviceSignalLevel, devices, m[1], m[2]);
                    }
                }
            }
        }
    }

    function checkController(regstr, data) {
        var m;
        while ((m = regstr.exec(data)) !== null) {
            if (m.index === regstr.lastIndex) {
                regstr.lastIndex++;
            }
            //m[1] - macid
            //m[2] - controllername
            controllers = [];
            controllers.push({mac: m[1], name: m[2]});
            term.write('power on\r');
            self.emit(bluetoothEvents.Controller, controllers);
            //console.log('controller found:' + m[1])

        }
    }

    function checkDevice(regstr, data) {
        var m;
        while ((m = regstr.exec(data)) !== null) {
            if (m.index === regstr.lastIndex) {
                regstr.lastIndex++;
            }
            //m[1] - [NEW] or [DEL] etc..
            //m[2] - macid
            //m[3] - devicename
            if (m[1] == "[DEL]") {
                //remove from list
                if (devices.length > 0) {
                    for (var j = 0; j < devices.length; j++) {
                        if (devices[j].mac == m[2]) {
                            devices.splice(j, 1);
                            console.log('deleting device ' + m[2]);
                            self.emit(bluetoothEvents.RemoveDevice, m[2]);
                        }
                    }
                }
            } else {
                var found = false;
                if (devices.length > 0) {
                    for (var j = 0; j < devices.length; j++) {
                        if (devices[j].mac == m[2])found = true;
                        if (devices[j].mac == m[2] && m[1] == "[NEW]") {
                            found = false;
                        }

                    }
                }
                if (!found) {
                    console.log('adding device ' + m[2])
                    devices.push({
                        mac: m[2],
                        name: m[3],
                        signal: 0,
                        paired: '',
                        trusted: '',
                        icon: '',
                        class: '',
                        blocked: '',
                        connected: '',
                        trycount: 0
                    });
                    self.emit(bluetoothEvents.NewDevice, devices[devices.length - 1]);
                }
            }
        }
        if ((regstr.exec(data)) !== null) self.emit(bluetoothEvents.Device, devices);

    }
}

exports.agent = function (index) {
    if(index < 0 || index > 6) {index = 0;}
    this.term.write('agent ' + this.agents[index] + '\r');
}

exports.defaultAgent = function () {
    this.term.write('default-agent\r');
}

exports.power = function (start) {
    this.term.write('power ' + (start ? 'on' : 'off') + '\r');
}

exports.scan = function (startScan) {
    this.term.write('scan ' + (startScan ? 'on' : 'off') + '\r');
}

exports.pairable = function (canpairable) {
    this.term.write('pairable ' + (canpairable ? 'on' : 'off') + '\r');
}

exports.discoverable = function (candiscoverable) {
    this.term.write('discoverable ' + (candiscoverable ? 'on' : 'off') + '\r');
}

exports.pair = function (macID) {
    this.term.write('pair ' + macID + '\r');
}

exports.trust = function (macID) {
    this.term.write('trust ' + macID + '\r');
}

exports.untrust = function (macID) {
    this.term.write('untrust ' + macID + '\r');
}

exports.block = function (macID) {
    this.term.write('block ' + macID + '\r');
}

exports.unblock = function (macID) {
    this.term.write('unblock ' + macID + '\r');
}

exports.connect = function (macID) {
    this.term.write('connect ' + macID + '\r');
}

exports.disconnect = function (macID) {
    this.term.write('disconnect ' + macID + '\r');
}

exports.remove = function (macID) {
    this.term.write('remove ' + macID + '\r');
}

exports.systemAlias = function (alias) {
  this.term.write('system-alias ' + alias + '\r')
}

exports.info = function (macID) {
    this.term.write('info ' + macID + '\r');
}

exports.getPairedDevices = function () {
    this.devices = [];
    this.term.write('paired-devices\r');
}

exports.getDevicesFromController = function () {
    this.devices = [];
    this.term.write('devices\r');
}

exports.checkBluetoothController=function(){
    try{
        var execSync = require("child_process").execSync;
        return !!execSync("type bluetoothctl", {encoding: "utf8"});
    }
    catch(e){
        return false;
    }
}