# Collection.js <sup>v0.1.0</sup>

Multi-purpose advanced collection class with event handling and validation.

# Why Collection?

Cross-browser development is a nightmare for js programmers sometimes. These days we must rely on the browser to use functions like ```filter```, ```reduce```, ```some```, ```find``` or such, and if the browser simply doesn't support them, we must alternatives like [underscore](http://underscorejs.org/) or create some functions that adjusts to our needs.

With Collection.js you have a event-handled, sortable, iterable, replicable and easy-to-use class.

You have available all the Array's prototype functions with some enhacements, so you can simply replace code like:

```js
var arr = ['This', 'Is', 'A', 'Test', 'From', 'GitHub'];

var reduced = arr.reduce(function (m, v) {
    return m + v.length;
}, 0);

var mapped = arr.map(function (v) {
    return v.length;
});

var foundGitHub = arr.indexOf('GitHub');

console.log("Result of diagnose:");
console.log('Number of letters:    ' + reduced);
console.log('Letters per word:     ' + mapped.join(', '));
console.log('GitHub is at:         ' + foundGitHub);
```

to:

```js
var arr = new Collection(['This', 'Is', 'A', 'Test', 'From', 'GitHub']);

var reduced = arr.reduce(function (m, v) {
    return m + v.length;
}, 0);

var mapped = arr.map(function (v) {
    return v.length;
});

var foundGitHub = arr.indexOf('GitHub');

console.log("Result of diagnose:");
console.log('Number of letters:    ' + reduced);
console.log('Letters per word:     ' + mapped.join(', '));
console.log('GitHub is at:         ' + foundGitHub);
```

The only difference between an Array and a Collection is that the property ```length``` isn't available in the Collection; in a Collection, that property is called ```count```.
