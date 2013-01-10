var PowerMate = require('./PowerMate.js');

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
