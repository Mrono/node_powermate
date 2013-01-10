node_powermate
==============

Node module to parse the Griffin PowerMate.

```npm install powermate```

You may need to run as root on some systems

This only works in linux at the moment due to how it read the device

Valid events are ```press, longPress, left, downLeft, right, downRight, error```

```javascript
var pm = new PowerMate();
pm.on('press', function() {
    console.log('Pressed');
});
```
