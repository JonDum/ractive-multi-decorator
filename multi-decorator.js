/*
  usage:
    <element decorator="multi:{ localdecorator: [ {{ dynamicArg1 }}, arg2, arg3 ], globaldecorator: {{singleArg}}, anotherdecorator: true } " >
*/

(function() {

    'use strict';

    function multi(node, args) {
        var decorators = {};

        var self = this;

        Object.keys(args).forEach(function(name) {
            if(typeof self.decorators[name] === 'function') {
                decorators[name] = self.decorators[name].apply(self, [node].concat(args[name]));
            }
        }.bind(self));

        return {
            update: function(args) {
                Object.keys(args).forEach(function(name) {
                    if(decorators[name]) {
                        decorators[name].update.apply(self, [].concat(args[name]));
                    }
                }.bind(self));
            },
            teardown: function() {
                Object.keys(args).forEach(function(name) {
                    if(decorators[name]) {
                        decorators[name].teardown.apply(self);
                    }
                }.bind(self));
            }
        };
    }

    // Common JS (i.e. browserify) environment
    if(typeof module !== 'undefined' && module.exports && typeof require === 'function') {
        module.exports = multi;
    }

    // self registers globally to ractive only if no module.exports
    // Requires Ractive to be a global in this case
    else if(Ractive) {
        Ractive.decorators.multi = multi;
    }

})();


