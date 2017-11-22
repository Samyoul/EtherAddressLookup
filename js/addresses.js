class Addresses extends Storage {

    /**
     *
     * @return {Promise}
     */
    retrieve(address){
        return this.get(address);
    }

    /**
     *
     * @param {String} address
     */
    create(address){
        // TODO
    }

    /**
     *
     * @param {String} address
     */
    deleteLabel(address){
        // TODO
    }

    /**
     *
     * @param {Object} object
     */
    update(object){
        this.set(object).then(function(){
            // TODO Some kind of UI Update function
            console.log('We updated.')
        });
    }

}