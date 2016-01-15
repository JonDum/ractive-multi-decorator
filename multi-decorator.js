/*
  usage:
    <element decorator="multi:{ localdecorator: [ {{ dynamicArg1 }}, arg2, arg3 ], globaldecorator: {{singleArg}}, anotherdecorator: true } " >
*/

(function() {

    'use strict';

    function multi (node, args) {
        var decorators = {};

        Object.keys(args).forEach(function(name) {
            if (typeof this.decorators[name] === 'function') {
                decorators[name] = {decorator: this.decorators[name].apply(this, [node].concat(args[name])), args: args[name]};
            }
        }.bind(this));

        return {
            update: function(args) {
                Object.keys(args).forEach(function(name) {
                    if (decorators[name] && decorators[name].decorator && decorators[name].decorator.update && !equalObjects(args[name], decorators[name].args)) {
                        decorators[name].args = args[name];
                        decorators[name].decorator.update.apply(this, [].concat(args[name]));
                    }
                }.bind(this));
            },
            teardown: function() {
                Object.keys(args).forEach(function(name) {
                    if (decorators[name] && decorators[name].decorator) {
                        decorators[name].teardown.apply(this);
                    }
                }.bind(this));
            }
        }
    };

    // since ractive will call the multi.update for any update on any of the decorator's arguments,
    // we want to avoid calling update on the decorators that don't need to be updated,
    // so we compare their last arguments with the new ones, so if they weren't updated, the decorator.update() won't be called
    function equalObjects () {
        var args = Array.prototype.slice.call(arguments, 0);
        var result;

        // 1 or 0 arguments, then i don't know, it's not equal to nothing i guess
        if (args.length < 2) {
            return false;
        }

        var argI, argJ, caught;

        for (var i = 0; i < args.length - 1; i++) {
            caught = false;
            try {
                argI = JSON.stringify(args[i]);
                argJ = JSON.stringify(args[i + 1]);
            } catch (e) {
                // if any of the arguments could not be stringified
                // it's probably a circular object, so we check for reference equality
                // if they don't point to the same thing, we assume they are NOT equal,
                caught = true;
                result = args[i] == args[i + 1];
            }
            if (!caught) {
                result = argI == argJ;
            }
            if (!result) {
                return result;
            }
        }
        return result;
    };
    

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


