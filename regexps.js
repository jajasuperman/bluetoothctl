exports.regexdevice = /(\[[A-Z]{3,5}\])?\s?Device\s([0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2})\s(?!RSSI)(?!Class)(?!Icon)(?!not available)(?!UUIDs:)(?!Connected)(?!Paired)(?![0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2})(?!\s)(.+)/gm;
exports.regexcontroller = /\[[A-Z]{3,5}\]?\s?Controller\s([0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2})\s(?!Discovering)(.+) /gm;
exports.regexsignal = /\[[A-Z]{3,5}\]?\s?Device\s([0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2})\sRSSI:\s-(.+)/gm;
exports.regexinfo = /Device ([0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2})\r?\n?\t?Name: (.+)\r?\n?\t?Alias: (.+)\r?\n?\t?Class: (.+)\r?\n?\t?Icon: (.+)\r?\n?\t?Paired: (.+)\r?\n?\t?Trusted: (.+)\r?\n?\t?Blocked: (.+)\r?\n?\t?Connected: (.+)\r?\n?\t?/gmi;

exports.regexconnected = /\[[A-Z]{3,5}\]?\s?Device\s([0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2})\sConnected:\s([a-z]{2,3})/gm;
exports.regextrusted = /\[[A-Z]{3,5}\]?\s?Device\s([0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2})\sTrusted:\s([a-z]{2,3})/gm;
exports.regexpaired = /\[[A-Z]{3,5}\]?\s?Device\s([0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2})\sPaired:\s([a-z]{2,3})/gm;
exports.regexblocked = /\[[A-Z]{3,5}\]?\s?Device\s([0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2})\sBlocked:\s([a-z]{2,3})/gm;
exports.regexNotAvailable = /Device\s([0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2})\snot\savailable/gm;
exports.regexAttemptingConnect = /Attempting\sto\sconnect\sto\s([0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2})/gm;

exports.regexscanon1 = 'Discovery started';
exports.regexscanon2 = 'Failed to start discovery: org.bluez.Error.InProgress';
exports.regexscanon3 = 'Discovering: yes';

exports.regexscanoff1 = 'Discovery stopped';
exports.regexscanoff2 = 'Discovering: no';
exports.regexscanoff3 = 'Failed to stop discovery: org.bluez.Error.Failed';

exports.failToConnect = 'Failed to connect: org.bluez.Error.Failed';
exports.failToPair = 'Failed to pair: org.bluez.Error.AuthenticationFailed';

exports.regexAuthorizeService = '[agent] Authorize service';
exports.regexConfirmPasskey = '[agent] Confirm passkey';

exports.connectSuccess = 'Connection successful';

exports.regestr =  /Device ([0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2}[\.:-][0-9A-F]{1,2})\r?\n?\t?Name: (.+)\r?\n?\t?Alias: (.+)\r?\n?\t?Class: (.+)\r?\n?\t?Icon: (.+)\r?\n?\t?Paired: (.+)\r?\n?\t?Trusted: (.+)\r?\n?\t?Blocked: (.+)\r?\n?\t?Connected: (.+)\r?\n?\t?/gmi;