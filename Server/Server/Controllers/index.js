let controllers = {}

require('fs').readdirSync(__dirname).forEach(function(file) {
   	if (!file.match('.js')) {
   		controllers[file] = require('./' + file);
   	}
});

module.exports = {...controllers}