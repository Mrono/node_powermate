node_PowerMate
==============

Node module to parse the Griffin PowerMate.

```npm install PowerMate```

You may need to run as root on some systems

This only works in linux at the moment due to how it read the device

```javascript
var pm = new PowerMate();
pm.on('right', function() {
    console.log('Right');
}).on('left', function() {;
    console.log('Left');
}).on('downRight', function() {
    console.log('Down Right')
}).on('downLeft', function() {
    console.log('Down Left');
}).on('longPress', function() {
    console.log('Long Press!');
}).on('press', function() {
    console.log('Press!');
}).on('error', function(err) {
    console.log(err);
});
```
