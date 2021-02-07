let routes = {}

require('fs').readdirSync(__dirname).forEach(function(file) {
   	if (!file.match('.js')) {
   		routes[file] = require('./' + file);
   	}
});

module.exports = routes