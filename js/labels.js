class Labels extends Storage {

    /**
     *
     * @return {Promise}
     */
    retrieve(){
        return this.get('labels');
    }

    /**
     *
     * @param {String} _name
     * @param {String} _colour
     */
    create(_name, _colour){
        return this.retrieve().then(function (labels) {
            console.log(labels);
            labels[_name] = _colour;
            this.update(labels);
        }.bind(this));
    }

    /**
     *
     * @param {String} _name
     */
    deleteLabel(_name){
        this.retrieve().then(function (labels) {
            delete labels[_name];
            this.update(labels);
        }.bind(this));
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

var labels = new Labels();
var label_form = document.getElementById('ext-etheraddresslookup-new-label-form');

label_form.addEventListener('submit', function(element){
    element.preventDefault();

    var name = document.getElementById('ext-etheraddresslookup-label-name');
    var colour = document.getElementById('ext-etheraddresslookup-label-colour');

    console.log(name.value);
    console.log(colour.value);

    labels.create(name.value, colour.value).then(function(){
        labels.retrieve().then((labels) => {console.log('updated labels from storage'); console.log(labels)})
    });

});