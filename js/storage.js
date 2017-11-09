class storage {

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
}

var storageTest = new storage();

storageTest.clear();
storageTest.get('labels').then((label) => {console.log(label)});
storageTest.set({labels: {'0x123123':['hello','there'], '0x321321':['I', 'am', 'a boat']}});
storageTest.get('labels').then((label) => {console.log(label)});
