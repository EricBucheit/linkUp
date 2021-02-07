let models = {}

require('fs').readdirSync(__dirname).forEach(function(file) {
   	if (!file.match('.js')) {
   		models[file] = require('./' + file);
   	}
});

module.exports = models