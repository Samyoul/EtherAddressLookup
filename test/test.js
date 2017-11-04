var assert = require('assert');
var chai = require('chai');
var chrome = require('sinon-chrome');
var jsdom = require('node-jsdom');
var EtherAddressLookup = require('../js/DomManipulator.js');

describe('Ether Address Lookup', function() {

    before(function () {
        global.chrome = chrome;
        global.document = jsdom.jsdom('<!DOCTYPE html><html><head></head><body></body></html>');
        global.window = document.parentWindow;
        global.navigator = {userAgent: 'node.js'};
    });

    describe('DOM Manipulator', function() {

        before(function(done){
            this.timeout(3000);
            this.etherAddressLookup = new EtherAddressLookup(chrome);
            setTimeout(done, 2500);
        });

        it('should return -1 when the value is not present', function() {
            assert.equal(-1, [1,2,3].indexOf(4));
        });

        it('should return true when Ethereum address is given', function () {
            this.etherAddressLookup.isPatternMatched("This is a test 0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8 ether address.");
        })

    });

});