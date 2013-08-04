'use strict';

var assert = require('assert');
var should = require('should');
var util = require('util');
require('../src/predicates');
require('../src/immutableArray');

require('./immutableArrayData');
var data = immutableArrayData();

describe('immutable', function(){

  describe('#immutableArray', function(){
    it('should ensure each instance of an immutableArray is unique', function(){
      var hydrogen = immutableArray(data.numbers);
      var oxygen = immutableArray(data.letters);
      assert(hydrogen.first() !== oxygen.first());
    });

    describe('#prototype', function(){
      it('should not be null or undefined', function(){
        assert(immutableArray.prototype != null);
        assert(immutableArray.prototype != undefined);
      });
    });

    describe('#constructor', function(){
      it('should be empty when created without a provided array', function(){
        var lockedArray = immutableArray();
        assert(lockedArray != null);
        data.checkArrayIsEmpty(lockedArray);
      });

      it('should have an immutable copy of the array it was created with', function(){
        var lockedArray = immutableArray(data.array);
        var length = lockedArray.length;
        assert(length === data.array.length);
      });

      it('should return an empty array when given null', function(){
        var testArray = null;
        var lockedArray = immutableArray(testArray);
        data.checkArrayIsEmpty(lockedArray);
      });

      it('should return an empty array when given undefined', function(){
        var testArray;
        var lockedArray = immutableArray(testArray);
        data.checkArrayIsEmpty(lockedArray);
      });

      it('should be able to be created using an immutableArray', function(){
        var lockedArray = data.createAggregatedLockedArray();
        var otherArray = immutableArray(lockedArray);
        assert(otherArray != null);
        assert(otherArray.length == lockedArray.length);

        var hasSame = otherArray.every(function(element, index) {
          return element === lockedArray.itemAtIndex(index);
        });
        assert(hasSame);
      });

      it('should create a unique immutableArray when created using immutableArray', function(){
        var lockedArray = immutableArray(data.array);
        var otherArray = immutableArray(lockedArray);
        assert(lockedArray !== otherArray);

        var mutable = otherArray.mutableCopy();
        mutable.concat(data.numbers);
        assert(otherArray.length === lockedArray.length);
      });
    });
    
    describe('#length', function(){
      it('should return 0 when created without a provided array', function(){
        var lockedArray = immutableArray();
        var length = lockedArray.length;
        assert(length === 0);
      });

      it('should return the number of items in the provided array', function(){
        var lockedArray = immutableArray(data.array);
        var length = lockedArray.length;
        assert(length === data.array.length);
      });
    });

    describe('#itemAtIndex', function(){
      it('should return undefined when given an index less than 0', function(){
        var lockedArray = immutableArray(data.array);
        var item = lockedArray.itemAtIndex(-1);
        assert(item === undefined);
      });

      it('should return undefined when given an index that is past the end of the array', function(){
        var lockedArray = immutableArray(data.array);
        var item = lockedArray.itemAtIndex(data.array.length);
        assert(item === undefined);
      });

      it('should return the first item in the array when given 0', function(){
        var lockedArray = immutableArray(data.array);
        data.checkItemAtIndexEqualsItemInArrayAtIndex(lockedArray, 0);
      });

      it('should return the correct item when given a valid index', function(){
        var lockedArray = immutableArray(data.array);
        data.checkItemAtIndexEqualsItemInArrayAtIndex(lockedArray, 1);
      });

      it('should return the last item in the array when given the last index', function(){
        var lockedArray = immutableArray(data.array);
        var index = data.array.length - 1;
        data.checkItemAtIndexEqualsItemInArrayAtIndex(lockedArray, index);
      });
    });

    describe('#isEmpty', function(){
      it('should return true if the array is empty', function(){
        var lockedArray = immutableArray();
        var result = lockedArray.isEmpty();
        assert(result);
      });

      it('should return false if the array is not empty', function(){
        var lockedArray = immutableArray(data.array);
        var result = lockedArray.isEmpty();
        assert(result == false);
      });
    });

    describe('#isNotEmpty', function(){
      it('should return false if the array is empty', function(){
        var lockedArray = immutableArray();
        var result = lockedArray.isNotEmpty();
        assert(result == false);
      });

      it('should return false if the array is not empty', function(){
        var lockedArray = immutableArray(data.array);
        var result = lockedArray.isNotEmpty();
        assert(result);
      });
    });

    describe('#forEach', function(){
      it('should throw an error when given a null action', function(){
        (function(){
          var action = null;
          var lockedArray = immutableArray(data.array);
          lockedArray.forEach(action);
        }).should.throw();
      });

      it('should throw an error when given an undefined action', function(){
        (function(){
          var action;
          var lockedArray = immutableArray(data.array);
          lockedArray.forEach(action);
        }).should.throw();
      });

      it('should perform the action given to it', function(done){
        var lockedArray = immutableArray(data.array);
        var counter = 0;
        var action = function() { if (counter++ >= data.array.length - 1) done(); };
        lockedArray.forEach(action);
        // Test will timeout if action isn't called the expected number of times
      });

      it('should not allow me to alter the original array', function(){
        var lockedArray = immutableArray(data.array);
        var expectedLength = data.array.length;

        var action = function(element, index, theArray) {
          assert(theArray === undefined);
        };

        lockedArray.forEach(action);
        
        var length = lockedArray.length;
        assert(length === expectedLength);
      });
    });

    describe('#every', function(){
      it('should throw an error if action is null', function(){
      });

      it('should return false if the test does not return true for all items', function(){
        var myArray = [12, 5, 8, 130, 44];
        var lockedArray = immutableArray(myArray);
        var result = lockedArray.every(data.isBigEnough);
        assert(result === false);
      });

      it('should return true if the test returns true for all items', function(){
        var myArray = [12, 54, 18, 130, 44];
        var lockedArray = immutableArray(myArray);
        var result = lockedArray.every(data.isBigEnough);
        assert(result);
      });
    });

    describe('#some', function(){
      it('should return false if the test did not pass for any of the items', function(){
        var myArray = [2, 5, 8, 1, 4];
        var lockedArray = immutableArray(myArray);
        var result = lockedArray.some(data.isBigEnough);
        assert(result === false);
      });

      it('should return true if the test passed for any of the items', function(){
        var myArray = [12, 5, 8, 1, 4];
        var lockedArray = immutableArray(myArray);
        var result = lockedArray.some(data.isBigEnough);
        assert(result);
      });
    });

    describe('#contains', function(){
      var target;

      beforeEach(function(){
        target = 'b';
      });

      it('should return false if the array is empty', function(){
        var emptyArray = immutableArray();
        var result = emptyArray.contains(target);
        assert(result == false);
      });

      it('should return false if the given target is null', function(){
        target = null;
        data.checkDoesNotContain(target);
      });

      it('should return false if the given target is undefined', function(){
        target = undefined;
        data.checkDoesNotContain(target);
      });

      it('should return true if the array does contain the given target', function(){
        var lockedArray = immutableArray(data.array);
        var result = lockedArray.contains(target);
        assert(result);
      });

      it('should return false if the array does not contain the given target', function(){
        var lockedArray = immutableArray(data.array);
        target = 'z';
        var result = lockedArray.contains(target);
        assert(result == false);
      });
    });

    describe('#first', function(){
      it('should return undefined if the array is empty', function(){
        var lockedArray = immutableArray();
        var first = lockedArray.first();
        assert(first == undefined);
      });

      it('should return the first item in the array', function(){
        var lockedArray = immutableArray(data.array);
        var first = lockedArray.first();
        var expectedItem = data.array[0];
        assert(first === expectedItem);
      });
    });

    describe('#last', function(){
      it('should return undefined if the array is empty', function(){
        var lockedArray = immutableArray();
        var last = lockedArray.last();
        assert(last == undefined);
      });
    
      it('should return the last item in the array', function(){
        var lockedArray = immutableArray(data.array);
        var last = lockedArray.last();
        var expectedItem = data.array[data.array.length - 1];
        assert(last === expectedItem);
      });
    });

    describe('#mutableCopy', function(){
      it('should return undefined if the array is empty', function(){
        var lockedArray = immutableArray();
        var mutableCopy = lockedArray.mutableCopy();
        assert(mutableCopy == undefined);
      });

      it('should return a mutable copy of the immutable array', function(){
        var lockedArray = immutableArray(data.array);
        var mutableCopy = lockedArray.mutableCopy();
        mutableCopy.push('aaa');
        assert(mutableCopy.length > data.array.length);
      });

      it('should not change the original array', function(){
        var lockedArray = immutableArray(data.array);
        var mutableCopy = lockedArray.mutableCopy();
        mutableCopy.push('bbb');
        assert(lockedArray.length == data.array.length);
      });
    });

    describe('#isImmutable', function(){
      it('should return false when given null', function(){
        var result = immutableArray.isImmutable(null);
        assert(result == false);
      });

      it('should return false when given undefined', function(){
        var result = immutableArray.isImmutable();
        assert(result == false);
      });

      it('should return false when given an array', function(){
        var result = immutableArray.isImmutable(data.array);
        assert(result == false);
      });

      it('should return false when given an object', function(){
        var obj = Object.create(null);
        var result = immutableArray.isImmutable(obj);
        assert(result == false);
      });

      it('should return true when given an immutableArray using prototype', function(){
        var lockedArray = immutableArray(data.array);
        var result = immutableArray.isImmutable(lockedArray);
        assert(result);
      });

      it('should return true when given an immutableArray using instance', function(){
        var lockedArray = immutableArray(data.array);
        var result = lockedArray.isImmutable();
        assert(result);
      });
    });

    describe('#concat', function(){
      it('should return the original immutableArray if given array is undefined', function(){
        var lockedArray = immutableArray(data.numbers);
        var combinedArray = lockedArray.concat();
        assert(combinedArray.length == lockedArray.length);
      });

      it('should return the original immutableArray if given array is null', function(){
        var lockedArray = immutableArray(data.numbers);
        var combinedArray = lockedArray.concat(null);
        assert(combinedArray.length == lockedArray.length);
      });

      it('should return an immutableArray that contains the items from the other array', function(){
        var lockedArray = immutableArray(data.numbers);
        var combinedArray = lockedArray.concat(data.letters);
        assert(combinedArray.length == lockedArray.length + data.letters.length);
      });
    });
  });
});