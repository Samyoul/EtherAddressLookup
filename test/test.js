var assert = require('assert');
var chai = require('chai');
const chrome = require('sinon-chrome');
var EtherAddressLookup = require('../js/DomManipulator.js');

describe('Ether Address Lookup', function() {

    before(function () {
        global.chrome = chrome;
    });

    describe('DOM Manipulator', function() {

        before(function(){
           var objEtherAddressLookup = new EtherAddressLookup();
        });

        it('should return -1 when the value is not present', function() {
            assert.equal(-1, [1,2,3].indexOf(4));
        });
    });

});