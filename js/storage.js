class Storage {

    constructor(scope = chrome.storage.sync)
    {
        this.scope = scope;
    }

    /**
     * @name get
     * @desc Gets one or more items from storage.
     * @param {String | Array} key
     * @return {Promise}
     */
    get(key)
    {
        return new Promise(function(resolve, reject){
            this.scope.get(key, function(items) {
                if(chrome.runtime.lastError){
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(items);
                }
            });
        }.bind(this));
    }

    /**
     * @name set
     * @desc Sets multiple items.
     * @param {Object} dataObject
     */
    set(dataObject)
    {
        this.scope.set(dataObject, function() {
            if(chrome.runtime.lastError){
                console.log(chrome.runtime.lastError);
            }
        })
    }

    /**
     * @name remove
     * @desc Removes one or more items from storage.
     * @param {String | Array} key
     */
    remove(key)
    {
        this.scope.remove(key, function() {
            if(chrome.runtime.lastError){
                console.log(chrome.runtime.lastError);
            }
        })
    }

    /**
     * @name clear
     * @desc Removes all items from storage.
     */
    clear()
    {
        this.scope.clear(function() {
            if(chrome.runtime.lastError){
                console.log(chrome.runtime.lastError);
            }
        })
    }

    /**
     *
     * @return {Promise}
     */
    getLabels(_address)
    {
        return this.get(_address);
    }

    addLabel(_address, name, colour)
    {
        //TODO logic check for duplicate, just overwrite colour if name is same
        return this.get(_address).then(function(address){
            return new Promise(function (resolve) {
                // Have we handled this address before, if not create object
                if(!(_address in address)){
                    address[_address]={};
                }

                // Have we added any labels before, if not add an labels array
                if(!("labels" in address[_address])){
                    address[_address]["labels"] = [];
                }

                // Add a new label. We use array to save byte space in storage.
                address[_address]["labels"].push([name, colour]);

                resolve(address);
            });
        })
        .then(function (address) {
            this.set(address);
        }.bind(this));
    }

    removeLabel()
    {

    }

    clearLabel()
    {

    }
}

var storage = new Storage();

//storage.clear();
storage.get(null).then((labels) => {console.log('get null');console.log(labels)});
storage.addLabel('0x123', "Joe Bloggs", "eaeaea")
    .then(function(){storage.addLabel('0x123', "smelly", "808080")}.bind(storage));
storage.addLabel('0x321', "a big boat", "adadad");
storage.addLabel('0x321', "Jupiter", "efefef");
storage.get(null).then((labels) => {console.log('get null');console.log(labels)});
