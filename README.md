
#ractive-multi-decorator

Credits go to [akhoury](http://github.com/akhoury) at [ramp](http://ramp.com) and [martypdx](http://github.com/martypdx) for the idea and implementation. (original thread [ractive/issues#399](https://github.com/ractivejs/ractive/issues/399))

### Install

```
npm install ractive-multi-decorator --save
```

### Usage

Add the decorator to your Ractive instance:

```
var ractive = new Ractive({
    ...
    decorators: {
        multi: require('ractive-multi-decorator')
    },
    ...
});
```

Then use it like so:


```
<div 
    id="myelement"
    decorator="multi:{ 
        localdecorator: [ {{ dynamicArg1 }}, arg2, arg3 ], 
        globaldecorator: {{singleArg}}, 
        anotherdecorator: true 
    }"
></div>
```

If you do not use a module system, ractive-multi-decorator expects `Ractive` to be a global and auto-adds itself to all ractive instances.




