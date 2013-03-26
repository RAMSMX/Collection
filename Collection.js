/**
 *  Collection.js
 *  -------------
 *  (c) 2013 Juan Lorenzo Hernandez Cruz
 *  Collection.js is freely distributable under the terms of the BSD license
 *
 *  Multi-purpose advanced collection class with event handling and validation.
 */
(function () {
    // Internal use only
    var me = this,
        evtSplitter = /\s+/g,
        op = Object.prototype,
        toString = op.toString,
        slice = Array.prototype.slice;

    /**
     * Safe reference to Object's 'hasOwnProprety' method.
     *
     * @param {Object} obj The object wherein the search will
     * be performed
     * @param {String} prop The property to be searched
     * @returns {Boolean} True if the object contains the
     * specified property, false otherwise
     */
    function has(obj, prop) {
        return op.hasOwnProperty.call(obj, prop);
    }

    /**
     * Safely convert objects to strings.
     * Useful for the keys of the collection.
     *
     * @param {Object} obj The object to stringify
     * @returns {String} The result string
     */
    function str(obj) {
        if (isFunction(obj.toString)) return obj.toString();
        return obj + '';
    }

    /**
     * Returns an object or a value depending on the
     * given boolean value.
     *
     * @param {Boolean} cond The boolean that will
     * determine the type of response
     * @param {Number} index One of the elements
     * of the response
     * @param {String} key Another element of the
     * response
     * @param {Mixed} value If 'cond' is falsy, this
     * value will be returned, otherwise, this will
     * be another of the elements of the response
     * @returns {Mixed} Depending on 'cond', 'value'
     * can be returned, or an object containing
     * 'index', 'key' and 'value' as properties
     */
    function compose(cond, index, key, value) {
        return !cond ? value : {
            key: key,
            value: value,
            index: index
        };
    }

    /**
     * Returns the index of a element within an array.
     *
     * @param {Mixed} el The element to be searched
     * @param {Array} obj The array wherein the search
     * will be performed
     * @param {Boolean} deep (optional) Determines if a
     * deep comparision will be performed
     * @returns {Number} The position of the index, if found,
     * -1 otherwise
     */
    function indexOf(el, obj, deep) {
        for (var i = 0; i < obj.length; i++) {
            if (obj[i] === el || (deep && deepCompare(obj[i], el))) return i;
        }
        return -1;
    }

    /**
     * Recursively find the value of the given property
     * inside an object.
     *
     * @param {Object} object The object wherein the search
     * will be performed
     * @param {String} property A string containing the name
     * of the desired property. To descend thru its children,
     * the name of the keys must be separated with a dot
     * @returns {Mixed} The value of the given property
     */
    function result(object, proprety) {
        var i = property.indexOf('.');
        if (i > -1) return result(object[property.substring(0, i)], property.substring(i + 1));
        return object[property];
    }

    /**
     * Verify that the given object is an array.
     *
     * @param {Mixed} obj The object to test
     * @returns {Boolean} Returns true if the object
     * is a primitive Array, otherwise, false
     */
    function isArray(obj) {
        return toString.call(obj) === '[object Array]';
    }

    /**
     * Verify that the given object is a primitive object.
     *
     * @param {Mixed} obj The object to test
     * @returns {Boolean} Returns true if the object
     * is a primitive Object, otherwise, false
     */
    function isObject(obj) {
        return toString.call(obj) === '[object Object]';
    }

    /**
     * Verify that the given object is a function.
     *
     * @param {Mixed} obj The object to test
     * @returns {Boolean} Returns true if the object
     * is a Function, otherwise, false
     */
    function isFunction(obj) {
        return toString.call(obj) === '[object Function]';
    }

    /**
     * Verify that the given object is a number, and it's not NaN.
     *
     * @param {Mixed} obj The object to test
     * @returns {Boolean} Returns true if the object
     * is a primitive Number and is not NaN, otherwise, false
     */
    function isNumber(obj) {
        return toString.call(obj) === '[object Number]' && !isNaN(obj);
    }

    /**
     * Verify that the given object is a string.
     *
     * @param {Mixed} obj The object to test
     * @returns {Boolean} Returns true if the object
     * is a primitive Number and is not NaN, otherwise, false
     */
    function isString(obj) {
        return toString.call(obj) === '[object String]';
    }

    /**
     * Verify that the given object is a boolean value.
     *
     * @param {Mixed} obj The object to test
     * @returns {Boolean} Returns true if the object
     * is a primitive Boolean, otherwise, false
     */
    function isBoolean(obj) {
        return obj === true || obj === false;
    }

    /**
     * Verify that the given object is an instance of the
     * class Collection.
     *
     * @param {Mixed} obj The object to test
     * @returns {Boolean} Returns true if the object
     * is an instance of the class Collection, otherwise, false
     */
    function isCollection(obj) {
        return obj instanceof Collection;
    }

    /**
     * Verify that the given object's values can be iterated.
     *
     * @param {Mixed} obj The object to test
     * @returns {Boolean} Returns true if the object
     * belongs to an iterable class, otherwise, false
     */
    function isIterable(obj) {
        return isObject(obj) || isArray(obj) || isCollection(obj);
    }

    /**
     * Iterate thru the elements of an object.
     *
     * @param {Mixed} list The object to test
     * @param {Function} fn The function to be invoked
     * for each element of the object.
     * @param {Mixed} scope (optional) The context applied to the
     * function when it's executed.
     */
    function each(list, fn, scope) {
        if (isArray(list)) {
            for (var i = 0; i < list.length; i++)
                if (i in list && fn.call(scope, list[i], i, list) === false)
                    break;
        } else if (isCollection(list))
            list.each(fn, scope);
        else {
            for (var i in list)
                if (has(list, i) && fn.call(scope, list[i], i, list) === false)
                    break;
        }
    }

    /**
     * Primitive objects and arrays are passed by reference.
     * This function allows to perform a deep cloning for
     * multiple objects.
     *
     * @param {Mixed} obj The object to be cloned
     * @returns {Mixed} The clone
     */
    function clone(obj) {
        var copy = obj;
        if (isArray(obj)) {
            copy = [];
            for (var i = 0; i < obj.length; i++)
                if (i in obj)
                    copy.push(clone(obj[i]));
        } else if (isObject(obj)) {
            copy = {};
            for (var k in obj)
                if (has(obj, k))
                    copy[k] = clone(obj[k]);
        }
        return copy;
    }

    /**
     * Objects like Arrays, Dates or an Object itself can't be
     * compared using '==' nor '===' unless they're passed by
     * reference. This function can determine if the passed objects
     * are equal even if they don't have the same reference.
     * Further comparisions might be needed.
     *
     * @param {Mixed} first The first object of the comparision
     * @param {Mixed} second The second object of the comparision
     * @returns {Boolean} True if the elements are equal, false
     * otherwise.
     */
    function deepCompare(first, second) {
        if (isArray(first)) {
            if (!isArray(second) || first.length !== second.length)
                return false;
            for (var i = 0; i < first.length; i++)
                if (!deepCompare(first[i], second[i]))
                    return false;
            return true;
        } else if (isCollection(first))
            return first.equals(second, true);
        else if (isObject(first)) {
            if (!isObject(second) || first.constructor !== second.constructor)
                return false;
            for (var i in first)
                if (has(first, i))
                    if (!has(second, i) || !deepCompare(first[i], second[i]))
                        return false;
            for (var i in second)
                if (has(second, i))
                    if (!has(first, i) || !deepCompare(first[i], second[i]))
                        return false;
            return true;
        } else if (toString.call(first) === '[object Date]') {
            if (toString.call(second) !== '[object Date]' || +first !== +second)
                return false;
            return true;
        } else if (toString.call(first) === '[object RegExp]') {
            if (toString.call(second) !== '[object RegExp]' ||
                first.source !== second.source ||
                first.global !== second.global ||
                first.multiline !== second.multiline ||
                first.ignoreCase !== second.ignoreCase) return false;
            return true;
        } else if (first !== first)
            return second !== second;
        return first === second;
    }

    /**
     * Copies a set of elements into the Collection.
     *
     * @param {Collection} dest The destination Collection
     * @param {Array} objs The objects to be copied
     * @returns {Collection} The Collection already containing
     * the new values
     */
    function copyCollection(dest, objs) {
        for (var i = 0; i < objs.length; i++)
            if (isArray(objs[i])) {
                for (var j = 0; j < objs[i].length; j++)
                    if (j in objs[i])
                        dest.push(objs[i][j]);
            } else if (isCollection(objs[i]))
                objs[i].each(function (v, k) {
                    if (dest.containsKey(k)) {
                        if (dest.override)
                            dest.replace(k, v);
                        else
                            dest.push(v);
                    }
                    else
                        dest.add(k, v);
                });
            else if (isObject(objs[i])) {
                for (var k in objs[i])
                    if (has(objs[i], k))
                        dest.add(k, objs[i][k]);
            }
            else
                dest.add(objs[i]);
        return dest;
    }

    /**
     * Makes the index to be within the range of the item
     * count of the collection.
     *
     * @param {Collection} collection The collection to be used
     * for the calculations of the range
     * @param {Number} index The index to be generalized
     * @returns {Number} The generalized index
     */
    function generalizeIndex(collection, index) {
        if (index < 0) {
            index = collection.count + index;
            if (index < 0)
                index = 0;
        } else if (index > collection.count)
            index = collection.count;
        console.log("generalized index: " + index);
        return index;
    }

    /**
     *    Class Collection
     *  ********************
     *
     * A multi-purpose class with event handling.
     *
     * @param {Mixed} items (optional) An iterable list to use
     * as start value
     */
    var eventsMap = [
        'Add',
        'Sort',
        'Move',
        'Clear',
        'Remove',
        'Reverse',
        'Replace',
        'Invalid',
        'BeforeAdd',
        'BeforeSort',
        'BeforeMove',
        'BeforeClear',
        'BeforeRemove',
        'BeforeReplace',
        'BeforeReverse'
    ];
    function Collection(items) {
        if (arguments.length === 0)
            items = [];
        else if (!isIterable(items))
            throw new Error('The object "' + items + '" is not iterable.');
        this._values = [];
        this._keys = [];
        this.count = 0;
        this.validator = false;
        this.override = false;
        this.listening = true;
        each(items, function (v, k) {
            this._values.push(v);
            this._keys.push(str(k));
            this.count++;
        }, this);
        // Initializing the events
        this.events = {};
        for (var i = 0; i < eventsMap.length; i++)
            this.events[eventsMap[i].toLowerCase()] = [];
    }

    // Current version of the file.
    Collection.VERSION = '0.1.0';
    // Apply some static properties to the class
    Collection.clone = clone;
    Collection.isArray = isArray;
    Collection.isObject = isObject;
    Collection.isIterable  = isIterable;
    Collection.isCollection = isCollection;
    // Start adding methods to the prototype
    var cp = Collection.prototype;

    //   Event methods
    //  ===============

    /**
     * Add a listener to a specific event
     *
     * @param {Mixed} event A string containing the names of the
     * events separated by spaces, or an object with a map
     * of name-function as key-value pairs.
     * Currently accepted events are, in order of execution:
     *
     *     * invalid
     *     * beforereplace
     *     * replace
     *     + beforeadd
     *     + add
     *     + beforeremove
     *     + remove
     *     + beforeclear
     *     + clear
     *     + beforereverse
     *     + reverse
     *     + beforesort
     *     + sort
     *     + beforemove
     *     + move
     *
     * @param {Function} callback (optional) The function to be invoked
     * @param {Mixed} scope (optional) The context in which the
     * function will be invoked
     * @returns {Collection} A reference to the class itself
     */
    cp.on = function (event, callback, scope) {
        if (isObject(event)) {
            for (var e in event)
                if (has(event, e))
                    this.on(e.toLowerCase(), event[e].fn || event[e].callback, event[e].scope);
        } else {
            event = event.split(evtSplitter);
            for (var i = 0; i < event.length; i++) {
                event[i] = event[i].toLowerCase();
                if (!this.events[event[i]])
                    throw new Error('The event "' + event[i] + '" is not defined.');
                this.events[event[i]].push({
                    fn: callback,
                    scope: scope
                });
            }
        }
        return this;
    };

    /**
     * Remove a listener to a specific event/callback/scope
     *
     * @param {String} event A string containing the names of the
     * events separated by spaces.
     * Currently accepted events are, in order of execution:
     *
     *     * invalid
     *     * beforereplace
     *     * replace
     *     + beforeadd
     *     + add
     *     + beforeremove
     *     + remove
     *     + beforeclear
     *     + clear
     *     + beforereverse
     *     + reverse
     *     + beforesort
     *     + sort
     *     + beforemove
     *     + move
     *
     * @param {Function} callback (optional) The function to be invoked
     * @param {Mixed} scope (optional) The context in which the
     * function will be invoked
     * @returns {Collection} A reference to the class itself
     */
    cp.un = cp.off = function (event, callback, scope) {
        event = event ? event.split(evtSplitter) : eventsMap;
        for (var i = 0; i < event.length; i++) {
            var evt = event[i].toLowerCase();
            if (!this.events[evt])
                throw new Error('The event "' + evt + '" is not defined.');
            for (var j = 0; j < this.events[evt].length; j++)
                if ((!callback || callback === this.events[evt][j].fn) && (!scope || scope === this.events[evt][j].scope)) {
                    this.events[evt].splice(j, 1);
                    j--;
                }
        }
        return this;
    };

    /**
     * Triggers one event; passes the rest of the arguments to
     * the triggered functions.
     *
     * @param {String} event The name of the event that will
     * be triggered.
     * Currently accepted events are, in order of execution:
     *
     *     * invalid
     *     * beforereplace
     *     * replace
     *     + beforeadd
     *     + add
     *     + beforeremove
     *     + remove
     *     + beforeclear
     *     + clear
     *     + beforereverse
     *     + reverse
     *     + beforesort
     *     + sort
     *     + beforemove
     *     + move
     */
    cp.trigger = function (event) {
        if (!this.listening) return true;
        var args = slice.call(arguments, 1);
        event = event.toLowerCase();
        if (!this.events[event])
            throw new Error('The event "' + event + '" is not defined.');
        for (var i = 0; i < this.events[event].length; i++)
            if (this.events[event][i].fn.apply(this.events[event][i].scope, args) === false)
                return false;
        return true;
    };

    /**
     + Stops triggering events.
     *
     * @returns {Collection} A reference to the class itself
     */
    cp.stopListening = function () {
        this.listening = false;
        return this;
    };

    /**
     + Resumes triggering events.
     *
     * @returns {Collection} A reference to the class itself
     */
    cp.startListening = function () {
        this.listening = true;
        return this;
    };

    // Event shortcuts.
    // this.on('add', fn, scope) -> this.onAdd(fn, scope)
    // this.on('remove', fn, scope) -> this.onRemove(fn, scope)
    // and so on...
    each(eventsMap, function (e) {
        cp['on' + e] = function (fn, scope) {
            this.on(e, fn, scope);
        };
    });

    //   Iteration methods
    //  ===================

    /**
     * Start/Continue with the iteration forwards.
     *
     * @param {Boolean} detail (optional) If true, the function
     * will return an object containing three properties:
     * 'index', 'key' and 'value'.
     * Otherwise it will just return the value, or undefined
     * if there're no items remaining in the collection
     * @returns {Mixed} The next item of the iteration
     */
    cp.next = function (detail) {
        if (this._index === undefined) this._index = -1;
        else if (this._index >= this.count) return undefined;
        return compose(detail, ++this._index, this._keys[this._index], this._values[this._index]);
    };

    /**
     * Start/Continue with the iteration backwards.
     *
     * @param {Boolean} detail (optional) If true, the function
     * will return an object containing three properties:
     * 'index', 'key' and 'value'.
     * Otherwise it will just return the value, or undefined
     * if there're no items remaining in the collection
     * @returns {Mixed} The next item of the iteration
     */
    cp.previous = function (detail) {
        if (this._index === undefined) this._index = this.count;
        else if (this._index < 0) return undefined;
        return compose(detail, --this._index, this._keys[this._index], this._values[this._index]);
    };

    /**
     * Calculates if the iteration can continue,
     * or has reached the end.
     *
     * @returns {Boolean} True if there're items remaining,
     * false otherwise
     */
    cp.hasNext = function () {
        return (this._index >> 0 < this.count);
    };

    /**
     * Retrieves the key at the current position of the iteration.
     * Returns 'undefined' when called in an invalid position of
     * the iteration index.
     *
     * @returns {Mixed} The value of the key, or undefined if no key
     * available
     */
    cp.key = function () {
        return this._keys[this._index];
    };

    /**
     * Retrieves the value at the current position of the iteration.
     * Returns 'undefined' when called in an invalid position of
     * the iteration index.
     *
     * @returns {Mixed} The value of the collection, or undefined
     * if no value available
     */
    cp.value = function () {
        return this._values[this._index];
    };

    /**
     * Retrieves the current position of the iteration index.
     * Returns 'undefined' when called in an invalid position of
     * the iteration index.
     *
     * @returns {Mixed} The value of the index, or undefined if no value
     * available
     */
    cp.index = function () {
        return this._index;
    };

    /**
     * Restarts the iteration index.
     */
    cp.restart = function () {
        delete this._index;
    };

    //   Insertion methods
    //  ===================

    /**
     * Adds an element to the collection at a specified position.
     *
     * @param {Mixed} index The position where the item will
     * be inserted
     * @param {Mixed} key (optional) The key to be used for the new
     * element
     * @param {Mixed} value The value to be inserted
     * @returns {Collection} A reference to the collection itself
     */
    cp.insert = function (index, key, value) {
        index = generalizeIndex(this, index);
        if (arguments.length === 2) {
            value = key;
            key = this.findInsertionKey();
        } else if (indexOf(str(key), this._keys) !== -1) {
            if (!this.override)
                return this;
            this.replace(key, value);
            return this.move(value, index);
        }
        key = str(key);
        if (this.validator && this.validator(value, key, index) === false) {
            this.trigger('invalid', value, key, index);
            return this
        }
        if (!this.trigger('beforeadd', value, key, index))
            return this;
        this.count++;
        this._values.splice(index, 0, value);
        this._keys.splice(index, 0, key);
        this.trigger('add', value, key, index);
        return this;
    };

    /**
     * Adds an element at the end of the collection.
     *
     * @param {Mixed} key (optional) The key to be used for the new
     * element
     * @param {Mixed} value The value to be inserted
     * @returns {Collection} A reference to the collection itself
     */
    cp.add = function (key, value) {
        return this.insert.apply(this, [this.count].concat(slice.call(arguments)));
    };

    /**
     * Adds the arguments at the end of the collection.
     * Triggers a 'beforeadd' and an 'add' event for each
     * argument.
     *
     * @returns {Number} The new length of the collection
     */
    cp.push = function () {
        for (var i = 0; i < arguments.length; i++)
            this.insert.apply(this, [this.count, this.findInsertionKey(), arguments[i]]);
        return this.count;
    };

    /**
     * Adds the arguments at the beginning of the collection.
     * Triggers a 'beforeadd' and an 'add' event for each
     * argument.
     *
     * @returns {Number} The new length of the collection
     */
    cp.unshift = function () {
        for (var i = arguments.length - 1; i >= 0; i--)
            this.insert.apply(this, [0, this.findInsertionKey(), arguments[i]]);
        return this.count;
    };

    /**
     * Replaces an element of the collection.
     *
     * @param {String} key The key associated to the element
     * to replace
     * @param {Mixed} value The value to be set
     * @returns {Collection} A reference to the collection itself
     */
    cp.replace = function (key, value) {
        var last, i;
        key = str(key);
        for (i = 0; i < this.count; i++) {
            if (this._keys[i] !== key)
                continue;
            last = this._values[i];
            if (this.validator && this.validator(value, key, i) === false) {
                this.trigger('invalid', value, key, i);
                return this;
            }
            if (!this.trigger('beforereplace', key, last, value, i))
                break;
            this._values[i] = value;
            this.trigger('replace', key, last, value, i);
            break;
        }
        return this;
    };

    /**
     * Concatenates the arguments to the collection.
     * Triggers 'beforeadd' and 'add' events for each
     * argument.
     *
     * @returns {Collection} Returns a collection containing
     * the new elements
     */
    cp.concat = function () {
        return copyCollection(this.clone(), slice.call(arguments));
    };

    /**
     * Adds all the elements of the given collections
     * to the current one.
     *
     * @returns {Collection} A reference to the class itself
     */
    cp.merge = function () {
        return copyCollection(this, slice.call(arguments));
    }

    //   Getters
    //  =========

    /**
     * Returns an element of the collection.
     *
     * @param {Mixed} keyIndex If keyIndex is an integer, it returns
     * the element stored at the position. Otherwise, it returns the
     * item whose key corresponds to keyIndex
     * @param {Boolean} detail (optional) If true, the function
     * will return an object containing three properties:
     * 'index', 'key' and 'value'.
     * Otherwise it will just return the value
     * @returns {Mixed} The element found within the collection
     */
    cp.item = cp.get = function (keyIndex, detail) {
        return isNumber(keyIndex) ? this.getAt(keyIndex, detail) : this.getByKey(keyIndex, detail);
    };

    /**
     * Returns an element of the collection.
     *
     * @param {Number} index The index desired
     * @param {Boolean} detail (optional) If true, the function
     * will return an object containing three properties:
     * 'index', 'key' and 'value'.
     * Otherwise it will just return the value
     * @returns {Mixed} The element found within the collection
     */
    cp.itemAt = cp.getAt = function (index, detail) {
        return compose(detail && index < this.count, index, this._keys[index], this._values[index]);
    };

    /**
     * Returns an element of the collection.
     *
     * @param {Mixed} key The key to be searched
     * @param {Boolean} detail (optional) If true, the function
     * will return an object containing three properties:
     * 'index', 'key' and 'value'.
     * Otherwise it will just return the value
     * @returns {Mixed} The element found within the collection
     */
    cp.itemByKey = cp.getByKey = function (key, detail) {
        var i = indexOf(str(key), this._keys);
        return compose(detail && i > -1, i, this._keys[i], this._values[i]);
    };

    /**
     * Returns the current element count.
     *
     * @returns {Number} The number of elements
     * within the collection
     */
    cp.getCount = function () {
        return this.count;
    };

    /**
     * Iterates thru the elements of the collection to find a
     * value that passes the given function.
     *
     * @param {Function} fn The function to be invoked
     * for each element of the collection
     * @param {Mixed} scope (optional) The context in which the
     * function will be invoked
     * @param {Boolean} detail (optional) If true, the function
     * will return an object containing three properties:
     * 'index', 'key' and 'value'.
     * Otherwise it will just return the value
     * @returns {Collection} A reference to the collection itself
     */
    cp.find = function (fn, scope, detail) {
        var i, res;
        for (i = 0; i < this.count; i++) {
            if (fn.call(scope || this, this._values[i], this._keys[i], i, this) !== true)
                continue;
            res = compose(detail, i, this._keys[i], this._values[i]);
            break;
        }
        return res;
    };

    /**
     * Iterates thru the elements of the collection to find a
     * value that passes the given function, and returns it's index.
     *
     * @param {Function} fn The function to be invoked
     * for each element of the collection
     * @param {Mixed} scope (optional) The context in which the
     * function will be invoked
     * @returns {Number} The index of the found element
     */
    cp.findIndex = function (fn, scope, detail) {
        var found = this.find(fn, scope, true);
        if (!found)
            return -1;
        return found.index;
    };

    /**
     * Verify if a given value is already contained
     * within the collection.
     *
     * @param {Mixed} value The value to be searched
     * @param {Boolean} deep (optional) Determines if a
     * deep comparision will be performed
     * @returns {Boolean} True if the specified value
     * is contained within the collection
     */
    cp.includes = cp.contains = function (value, deep) {
        return indexOf(value, this._values, deep) !== -1;
    };

    /**
     * Verify if a given key is already contained
     * within the collection.
     *
     * @param {Mixed} key The key to be searched
     * @returns {Boolean} True if an element of the
     * collection is already associated with the key
     */
    cp.containsKey = function (key) {
        return indexOf(str(key), this._keys) !== -1;
    };

    /**
     * Returns an array containing the stored values of the
     * collection.
     *
     * @returns {Array} The current values of the collection
     */
    cp.values = function () {
        return [].concat(this._values);
    };

    /**
     * Returns an array containing the stored keys of the
     * collection.
     *
     * @returns {Array} The current keys of the collection
     */
    cp.keys = function () {
        return [].concat(this._keys);
    };

    /**
     * Returns the first element of the collection.
     *
     * @param {Boolean} detail (optional) If true, the function
     * will return an object containing three properties:
     * 'index', 'key' and 'value'.
     * Otherwise it will just return the value
     * @returns {Mixed} The first element of the collection
     */
    cp.head = cp.first = function (detail) {
        return compose(detail && this.count, 0, this._keys[0], this._values[0]);
    };

    /**
     * Returns the last element of the collection.
     *
     * @param {Boolean} detail (optional) If true, the function
     * will return an object containing three properties:
     * 'index', 'key' and 'value'.
     * Otherwise it will just return the value
     * @returns {Mixed} The last element of the collection
     */
    cp.tail = cp.last = function (detail) {
        var c = this.count - 1;
        return compose(detail && (c + 1), c, this._keys[c], this._values[c]);
    };
    /**
     * Returns a slice of the collection.
     *
     * @param {Number} from (optional) The start index of the slice
     * @param {Number} to (optional) The end index of the slice
     * @returns {Collection} The slice corresponding to
     * the given indexes
     */
    cp.getRange = cp.range = cp.slice = function (from, to) {
        from = generalizeIndex(this, from);
        to = generalizeIndex(this, to);
        var ret = new Collection();
        for (var i = from; i < to; i++)
            ret.add(this._keys[i], this._values[i]);
        return ret;
    };

    //   Deletion methods
    //  ==================

    /**
     * Removes all the elements of the collection.
     * NOTE: this function doesn't trigger a 'remove' event
     * for each element.
     *
     * @returns {Boolean} True if the elements were succesfully
     * removed, false otherwise
     */
    cp.removeAll = cp.clear = function () {
        if (!this.trigger('beforeclear', this))
            return false;
        this.count = 0;
        this._values = [];
        this._keys = [];
        this.trigger('clear', this);
        return true;
    };

    /**
     * Removes the specified element from the collection.
     *
     * @param {Mixed} item The value to be removed from
     * the collection
     * @param {Boolean} deep (optional) True to perform a
     * deep comparision to the object
     * @returns {Boolean} True if the element was succesfully
     * removed, false otherwise
     */
    cp.remove = function (item, deep) {
        for (var i = 0; i < this.count; i++)
            if (item === this._values[i] || (deep && deepCompare(item, this._values[i])))
                return this.removeAt(i);
        return false;
    };

    /**
     * Removes from the collection an element at the specified
     * position.
     *
     * @param {Number} index The position to remove from
     * the collection
     * @returns {Boolean} True if the element was succesfully
     * removed, false otherwise
     */
    cp.removeAt = function (index) {
        var k = this._keys[index], v = this._values[index];
        if (index < 0 || index >= this.count ||
            !this.trigger('beforeremove', v, k, index) ||
            (this.count === 1 && !this.trigger('beforeclear', this)))
            return false;
        this.count--;
        this._keys.splice(index, 1);
        this._values.splice(index, 1);
        this.trigger('remove', v, k, index);
        if (!this.count)
            this.trigger('clear', this);
        return true;
    };

    /**
     * Removes from the collection the element that corresponds
     * to the specified key.
     *
     * @param {String} key The key to remove from the collection
     * @returns {Boolean} True if the element was succesfully
     * removed, false otherwise
     */
    cp.removeByKey = function (key) {
        return this.removeAt(indexOf(str(key), this._keys));
    };

    /**
     * Removes an amount of elements from a start index.
     *
     * @param {Number} from The start index
     * @param {Number} count (optional) The number of elements
     * to removed
     * @returns {Number} Returns the number of elements
     * that were successfully removed
     */
    cp.removeCount = function (from, count) {
        var removed = 0;
        from = generalizeIndex(this, from);
        if (!isNumber(count))
            count = this.count;
        if (from + count > this.count)
            count = this.count - from;
        while (count > 0) {
            if (!this.removeAt(from))
                from++;
            else
                removed++;
            count--;
        }
        return removed;
    };

    /**
     * Removes a range of elements.
     *
     * @param {Number} from The start index
     * @param {Number} to (optional) The final index
     * @returns {Number} Returns the number of elements
     * that were successfully removed
     */
    cp.removeRange = function (from, to) {
        return this.removeCount(from, to - from);
    };

    /**
     * Removes the last element of the collection, and returns it.
     *
     * @param {Boolean} detail (optional) If true, the function
     * will return an object containing three properties:
     * 'index', 'key' and 'value'.
     * Otherwise it will just return the value, or undefined
     * if there're no items remaining in the collection
     * @returns {Mixed} The next last item of the collection
     * or undefined if no element was removed
     */
    cp.pop = function (detail) {
        var r, i = this.count - 1,
            k = this._keys[i],
            v = this._values[i];
        if (i < 0 || !this.trigger('beforeremove', v, k, i) ||
            (this.count === 1 && !this.trigger('beforeclear', this)))
            return undefined;
        this.count--;
        r = compose(detail, i, this._keys.pop(), this._values.pop());
        this.trigger('remove', v, k, i);
        if (!this.count)
            this.trigger('clear', this);
        return r;
    };

    /**
     * Removes the first element of the collection, and returns it.
     *
     * @param {Boolean} detail (optional) If true, the function
     * will return an object containing three properties:
     * 'index', 'key' and 'value'.
     * Otherwise it will just return the value, or undefined
     * if there're no items remaining in the collection
     * @returns {Mixed} The next last item of the collection
     * or undefined if no element was removed
     */
    cp.shift = function (detail) {
        var r, i = 0,
            k = this._keys[i],
            v = this._values[i];
        if (this.count === 0 || !this.trigger('beforeremove', v, k, i) ||
            (this.count === 1 && !this.trigger('beforeclear', this)))
            return undefined;
        this.count--;
        r = compose(detail, i, this._keys.shift(), this._values.shift());
        this.trigger('remove', v, k, i);
        if (!this.count)
            this.trigger('clear', this);
        return r;
    };

    /**
     * Removes some elements starting from a specified
     * position, and adds some new ones.
     *
     * @param {Number} start The index to start removing
     * and adding elements from the collection
     * @param {Number} count The number of elements that
     * will be removed from the collection
     * @returns {Collection} The removed elements
     */
    cp.splice = function (start, count) {
        var r, oStart = start,
            removed = new Collection(),
            insert = slice.call(arguments, 2);
        start = generalizeIndex(this, start);
        if (!isNumber(count))
            count = this.count - start;
        while (count > 0) {
            r = this.getAt(start, true);
            if (this.removeAt(start))
                removed.add(r.key, r.value);
            else
                start++;
            count--;
        }
        for (var i = insert.length - 1; i >= 0; i--)
            this.insert(oStart, this.findInsertionKey(), insert[i]);
        return removed;
    };

    //   Utils
    //  =======

    /**
     * Iterates thru the elements of the collection.
     *
     * @param {Function} fn The function to be invoked
     * for each element of the collection
     * @param {Mixed} scope (optional) The context in which the
     * function will be invoked
     * @returns {Collection} A reference to the collection itself
     */
    cp.forEach = cp.each = function (fn, scope) {
        for (var i = 0; i < this.count; i++)
            if (fn.call(scope || this, this._values[i], this._keys[i], i, this) === false)
                break;
        return this;
    };

    /**
     * Returns the index of the given value.
     *
     * @param {Mixed} value The value to be searched
     * @param {Boolean} deep (optional) Determines if a
     * deep comparision will be performed
     * @returns {Number} The position of the specifiied
     * value within the collection, -1 if not found
     */
    cp.indexOf = function (value, deep) {
        return indexOf(value, this._values, deep);
    };

    /**
     * Returns the last index of the given value.
     *
     * @param {Mixed} value The value to be searched
     * @param {Boolean} deep (optional) Determines if a
     * deep comparision will be performed
     * @returns {Number} The position of the specifiied
     * value within the collection, -1 if not found
     */
    cp.lastIndexOf = function (value, deep) {
        for (var i = this.count - 1; i >= 0; i--)
            if (this._values[i] === value ||
                (deep && deepCompare(this._values[i], value)))
                return i;
        return -1;
    };

    /**
     * Returns the index of the given key.
     *
     * @param {Mixed} key The key to be searched
     * @returns {Number} The position of the specified
     * key within the collection, -1 if not found
     */
    cp.indexOfKey = function (key) {
        return indexOf(str(key), this._keys);
    };

    /**
     * Returns the last index of the given key.
     *
     * @param {Mixed} key The key to be searched
     * @returns {Number} The position of the specified
     * key within the collection, -1 if not found
     */
    cp.lastIndexOfKey = function (key) {
        for (var i = this.count - 1; i >= 0; i--)
            if (this._keys[i] === key)
                return i;
        return -1;
    };

    /**
     * Useful to determine the next value of the current
     * set of keys.
     *
     * @returns {Number} The next numeric key
     */
    cp.findInsertionKey = function () {
        var max = -1;
        for (var i = 0; i < this.count; i++)
            if (max < this._keys[i])
                max = this._keys[i] >> 0;
        return str(max + 1);
    };

    /**
     * Creates a clone of the current collection.
     *
     * @param deep (optional) {Boolean} True to create a
     * deep clone of the collection. This operation will
     * take longer than a shallow clone.
     * @returns {Collection} The clone of the current
     * collection
     */
    cp.clone = function (deep) {
        var copy = new Collection();
        if (deep)
            this.each(function (v, k) {
                copy.add(k, clone(v));
            });
        else {
            copy._values = [].concat(this._values);
            copy._keys = [].concat(this._keys);
            copy.count = this.count;
        }
        return copy;
    };

    /**
     * Reverse the order of the collection.
     *
     * @returns {Collection} A reference to the collection itself
     */
    cp.reverse = function () {
        if (!this.trigger('beforereverse', this))
            return this;
        this._keys.reverse();
        this._values.reverse();
        this.trigger('reverse', this);
        return this;
    };

    /**
     * Creates a new collection mapping the values of
     * the current one.
     *
     * @param {Function} fn The function to be invoked
     * for each element of the collection
     * @param {Mixed} scope (optional) The context in which the
     * function will be invoked
     * @returns {Collection} A reference to the mapped collection
     */
    cp.map = function (fn, scope) {
        var mapped = new Collection();
        for (var i = 0; i < this.count; i++)
            mapped.add(this._keys[i],
                       fn.call(scope || this, this._values[i], this._keys[i], i, this));
        return mapped;
    };

    /**
     * Reduces the content of the collection to a single value.
     *
     * @param {Function} fn The function to be invoked
     * for each element of the collection
     * @param {Mixed} start (optional) The start value for the reduce
     * process; if no start value is provided, the first element of
     * the collection will be used as start value
     * @param {Mixed} scope (optional) The context in which the
     * function will be invoked
     * @returns {Mixed} The result of the reduce
     */
    cp.reduce = function (fn, start, scope) {
        var acc, i = 0;
        if (arguments.length === 1) {
            if (this.count === 0)
                throw new Error('Reduce of empty Collection with no initial value.');
            i = 1;
            acc = this._values[0];
        } else
            acc = start;
        for (; i < this.count; i++)
            acc = fn.call(scope || this, acc, this._values[i], this._keys[i], i, this);
        return acc;
    };

    /**
     * Reduces the content of the collection to a single value,
     * iterating from right to left.
     *
     * @param {Function} fn The function to be invoked
     * for each element of the collection
     * @param {Mixed} start (optional) The start value for the reduce
     * process; if no start value is provided, the first element of
     * the collection will be used as start value
     * @param {Mixed} scope (optional) The context in which the
     * function will be invoked
     * @returns {Mixed} The result of the reduce
     */
    cp.reduceRight = function (fn, start, scope) {
        var acc, i = this.count - 1;
        if (arguments.length === 1) {
            if (this.count === 0)
                throw new Error('Reduce of empty Collection with no initial value.');
            i = this.count - 2;
            acc = this._values[i + 1];
        } else
            acc = start;
        for (; i >= 0; i--)
            acc = fn.call(scope || this, acc, this._values[i], this._keys[i], i, this);
        return acc;
    };

    /**
     * Joins the whole set of values using a specified glue.
     *
     * @param {String} glue (optional) The string used when
     * joining the values of the collection; if the value isn't
     * provided, a comma will be used
     */
    cp.join = function (glue) {
        return this._values.join(glue);
    };

    /**
     * Determines if every element of the collection
     * passes the given function.
     *
     * @param {String} fn The function to test every
     * element of the collection
     * @param {Mixed} scope (optional) The context in which the
     * function will be invoked
     * @returns {Boolean} True if all the elements of the
     * collection passed the test, false otherwise
     */
    cp.all = cp.every = function (fn, scope) {
        for (var i = 0; i < this.count; i++)
            if (fn.call(scope || this, this._values[i], this._keys[i], i, this) === false)
                return false;
        return true;
    };

    /**
     * Determines if any of the elements of the collection
     * passes the given function.
     *
     * @param {String} fn The function to test the elements
     * of the collection
     * @param {Mixed} scope (optional) The context in which the
     * function will be invoked
     * @returns {Boolean} True if any elements of the
     * collection passed the test, false otherwise
     */
    cp.any = cp.some = function (fn, scope) {
        for (var i = 0; i < this.count; i++)
            if (fn.call(scope || this, this._values[i], this._keys[i], i, this))
                return true;
        return false;
    };

    /**
     * Filters the elements of the collection.
     *
     * @param {String} fn The function to test the elements
     * of the collection
     * @param {Mixed} scope (optional) The context in which the
     * function will be invoked
     * @returns {Collection} The collection containing
     * the filtered values
     */
    cp.filter = function (fn, scope) {
        var filtered = new Collection();
        for (var i = 0; i < this.count; i++)
            if (fn.call(scope || this, this._values[i], this._keys[i], i, this))
                filtered.add(this._keys[i], this._values[i]);
        return filtered;
    };

    /**
     * Moves the specified value to a new position.
     *
     * @param {Mixed} value The value to be moved
     * @param {Number} newIndex The new position for
     * the value
     * @param {Boolean} deep (optional) Determines if a
     * deep comparision will be performed
     * @returns {Boolean} True if the record was successfully
     * moved, false otherwise
     */
    cp.move = function (value, newIndex, deep) {
        var old = indexOf(value, this._values, deep);
        return old !== -1 ? this.moveIndex(old, newIndex) : false;
    };

    /**
     * Moves the value corresponding to the given key to
     * a new position.
     *
     * @param {String} key The key to be searched
     * @param {Number} newIndex The new position for
     * the value
     * @returns {Boolean} True if the record was successfully
     * moved, false otherwise
     */
    cp.moveByKey = function (key, newIndex) {
        var old = indexOf(key, this._keys);
        return old !== -1 ? this.moveIndex(old, newIndex) : false;
    };

    /**
     * Moves the value contained at one position to another.
     *
     * @param {Number} oldIndex The position corresponing
     * to the element that will be moved
     * @param {Number} newIndex The new position for
     * the value
     * @returns {Boolean} True if the record was successfully
     * moved, false otherwise
     */
    cp.moveIndex = function (oldIndex, newIndex) {
        if (this.count <= 1)
            return false;
        oldIndex = generalizeIndex(this, oldIndex);
        newIndex = generalizeIndex(this, newIndex);
        if (oldIndex === this.count)
            oldIndex--;
        if (newIndex === this.count)
            newIndex--;
        var old = this.getAt(oldIndex, true);
        if (!this.trigger('beforemove', old.value, old.key, old.index, newIndex))
            return false;
        this._values.splice(oldIndex, 1);
        this._keys.splice(oldIndex, 1);
        this._values.splice((newIndex + 1) === this.count ? newIndex - 1: newIndex, 0, old.value);
        this._keys.splice((newIndex + 1) === this.count ? newIndex - 1 : newIndex, 0, old.key);
        this.trigger('move', old.value, old.key, newIndex, old.index);
        return true;
    };

    /**
     * Swaps the values contained in the two provided
     * positions.
     *
     * @param {Number} first The position corresponing
     * to the first element
     * @param {Number} second The position corresponing
     * to the second element
     * @returns {Boolean} True if the records wwre successfully
     * moved, false otherwise
     */
    cp.swap = function (first, second) {
        return this.moveIndex(first, second) && this.moveIndex(second - 1, first);
    };

    /**
     * Determines the 'max' element of the collection.
     * If a function is provided, it will be used to
     * calculate the 'value' of each element, and compare
     * them using the new value; if no function is provided,
     * the raw values will be used.
     *
     * @param {Function} fn (optional) The function to calculate the
     * comparision value for each element of the collection
     * @param {Mixed} scope (optional) The context in which the
     * function will be invoked
     * @param {Boolean} detail (optional) If true, the function
     * will return an object containing three properties:
     * 'index', 'key' and 'value'.
     * Otherwise it will just return the value, or undefined
     * if there're no items remaining in the collection
     * @returns {Mixed} The 'maximum' value of the collection
     */
    cp.max = function (fn, scope, detail) {
        var c, mx;
        if (!this.count)
            return undefined;
        for (var i = 0; i < this.count; i++) {
            if (fn)
                c = fn.call(scope || this, this._values[i], this._keys[i], i, this);
            else if (isNumber(this._values[i]) || isString(this._values[i]))
                c = this._values[i];
            else
                throw new Error('You must provide a comparator.');
            if (!mx || c > mx.computed)
                mx = {
                    computed: c,
                    real: compose(detail, i, this._keys[i], this._values[i])
                };
        }
        return mx.real;
    };

    /**
     * Determines the 'min' element of the collection.
     * If a function is provided, it will be used to
     * calculate the 'value' of each element, and compare
     * them using the new value; if no function is provided,
     * the raw value will be used.
     *
     * @param {Function} fn (optional) The function to calculate the
     * comparision value for each element of the collection
     * @param {Mixed} scope (optional) The context in which the
     * function will be invoked
     * @param {Boolean} detail (optional) If true, the function
     * will return an object containing three properties:
     * 'index', 'key' and 'value'.
     * Otherwise it will just return the value, or undefined
     * if there're no items remaining in the collection
     * @returns {Mixed} The 'minimum' value of the collection
     */
    cp.min = function (fn, scope, detail) {
        var c, mx;
        if (!this.count)
            return undefined;
        for (var i = 0; i < this.count; i++) {
            if (fn)
                c = fn.call(scope || this, this._values[i], this._keys[i], i, this);
            else
                c = this._values[i];
            if (!mx || c < mx.computed)
                mx = {
                    computed: c,
                    real: compose(detail, i, this._keys[i], this._values[i])
                };
        }
        return mx.real;
    };

    /**
     * Determines the average of the elements of the collection.
     * If a function is provided, it will be used to
     * calculate the 'value' of each element, and compare
     * them using the new value; if no function is provided
     * and the values of the collection are numeric, the
     * raw values will be used, on the other hand, if the values
     * are strings or arrays, the length of each one will be used.
     *
     * @param {Function} fn (optional) The function to calculate the
     * comparision value for each element of the collection
     * @param {Mixed} scope (optional) The context in which the
     * function will be invoked
     * @returns {Mixed} The 'minimum' value of the collection
     */
    cp.avg = function (fn, scope) {
        var c, avg = 0;
        for (var i = 0; i < this.count; i++) {
            if (fn)
                c = fn.call(scope || this, this._values[i], this._keys[i], i, this);
            else if (isNumber(this._values[i]))
                c = this._values[i];
            else if (isString(this._values[i]) || isArray(this._values[i]))
                c = this._values[i].length;
            else
                throw new Error('You must provide a comparator.');
            avg += c;
        }
        return avg / this.count;
    };

    /**
     * Sort the elements of the collection using
     * a user-defined function.
     *
     * @param {String} fn The function to test the elements
     * of the collection
     * @param {Mixed} scope (optional) The context in which the
     * function will be invoked
     * @returns {Collection} A reference to the class itself
     */
    cp.sortBy = function (fn, scope) {
        var tmp = [], me = this;
        if (!this.trigger('beforesort'))
            return this;
        this.stopListening();
        for (var i = 0; i < this.count; i++)
            tmp.push({
                index: i,
                key: this._keys[i],
                value: this._values[i]
            });
        tmp.sort(function (l, r) {
            var compared = fn.call(scope || me, l, r);
            if (compared === true)
                compared = 1;
            else if (compared === false)
                compared = -1;
            return compared >> 0;
        });
        this.clear();
        for (var i = 0; i < tmp.length; i++)
            this.add(tmp[i].key, tmp[i].value);
        this.startListening();
        this.trigger('sort', this);
        return this;
    };

    /**
     * Sort the elements of the collection using
     * a simple comparision for the values.
     *
     * @returns {Collection} The collection containing
     * the filtered values
     */
    cp.sort = function () {
        return this.sortBy(function (l, r) {
            if (l.value > r.value)
                return 1;
            else if (r.value > l.value)
                return -1;
            return 0;
        });
    };

    /**
     * Asynchronously sort the elements of the collection
     * using a simple comparision for the values if no
     * user-defined function provided.
     * Since this function makes the collection to stop
     * listening to all events, it's HIGHLY recommended
     * that you make sure to avoid updating the collection
     * during this process. Any data update will be overriden
     * once the sort is finished.
     *
     * @param {Object} config (optional) The configuration
     * object; it can contain the next properties:
     *  - fn: the function to be used to compare the elements
     *  - scope: the scope to be applied to the compare function
     *  - callback: a function to be invoked when the sort is done
     * @returns {Collection} The collection containing
     * the filtered values
     */
    cp.sortAsync = function (config) {
        var me = this;
        config || (config = {});
        if (isFunction(config))
            config = {callback: config};
        setTimeout(function () {
            if (config.fn)
                me.sortBy(config.fn, config.scope);
            else
                me.sort();
            if (config.callback)
                config.callback.call(me, me);
        }, 10);
        return this;
    };

    /**
     * Compare with another Collection.
     *
     * @param {Collection} collection The collection to
     * compare with the current one
     * @param {Boolean} deep (optional) Determines if a
     * deep comparision will be performed
     * @returns {Boolean} True if the collections contain
     * the same values, false otherwise
     */
    cp.equals = function (collection, deep) {
        if (!isCollection(collection)) return false;
        if (this.count !== collection.count) return false;
        for (var i = 0; i < this.count; i++)
            if (this._keys[i] !== collection._keys[i] ||
                !(this._values[i] === collection._values[i] ||
                (deep && deepCompare(this._values[i], collection._values[i]))))
                return false;
        return true;
    };

    // Exposing the Collection class to the global scope
    me.Collection = Collection;
}.call(this));
