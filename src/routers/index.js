const route = require('express').Router();
route.use('/vehicles', require('./vehicles'));
route.use('/users', require('./users'));
route.use('/histories', require('./histories'));
route.use('/profile', require('./profile'));
route.use('/popular', require('./popularVehicle'));
route.use('/categories', require('./categories'));
route.use('/status', require('./status'));
module.exports = route;