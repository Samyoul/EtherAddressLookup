class Labels extends Storage {

    /**
     *
     * @return {Promise}
     */
    retrieve()
    {
        return this.get(parent.labels.labels).then((labels) => {
            return new Promise(function(resolve){

                // Do we have a labels attribute, if not set them up
                if(!(parent.labels.labels in labels)){
                    labels = this.initialise(labels);
                }
                resolve(labels)

            }.bind(this))
        });
    }

    /**
     *
     * @param {String} _name
     * @param {String} _colour
     */
    create(_name, _colour)
    {
        return this.retrieve().then(function (labels) {
            // Assign a name and a colour, if we've got the name already just update the colour
            labels[parent.labels.labels].push([_name, _colour]);
            this.update(labels);
        }.bind(this));
    }

    /**
     *
     * @param _index
     * @return {Promise}
     */
    remove(_index)
    {
        return this.retrieve().then(function (labels) {
            delete labels[parent.labels.labels][_index];
            this.update(labels);
        }.bind(this));
    }

    /**
     *
     * @param {Object} object
     */
    update(object)
    {
        this.set(object).then(function(){
            // TODO Some kind of UI Update function
            console.log('We updated.')
        });
    }

    /**
     *
     * @param {Object} object
     * @return {Object}
     */
    initialise(object)
    {
        object[parent.labels.labels]=[];
        object[parent.labels.labels].push(['Tip Jar', '17a2b8']);
        object[parent.labels.labels].push(['Developer', '6634b8']);
        object[parent.labels.labels].push(['SCAM !!!', 'dc3545']);
        return object;
    }

}

var labels = new Labels();
var storage = new Storage();
var label_form = document.getElementById('ext-etheraddresslookup-new-label-form');
var existing_labels = document.getElementById('ext-etheraddresslookup-current-labels');

function labelTemplate(id, name, colour) {
    return `<span class='ext-etheraddresslookup-label' data-ext-etheraddresslookup-id="${id}" style="color:white;background-color:#${colour};">${name}</span><br/>`;
}

storage.remove('labels');

label_form.addEventListener('submit', function(element){
    element.preventDefault();

    var name = document.getElementById('ext-etheraddresslookup-label-name');
    var colour = document.getElementById('ext-etheraddresslookup-label-colour');

    console.log(name.value);
    console.log(colour.value);

    labels.create(name.value, colour.value)
        .then(function(){
            labels.retrieve()
                .then(function(labels){console.log('updated labels from storage', labels)})
                .then(function(){storage.get(null).then((data) => {console.log('all the storage', data)})})
        }).then(function () {
            labels.remove(name.value)
                .then(function(){storage.get(null).then((data) => {console.log('all the storage', data)})})
        });

});

window.addEventListener('load', function() {
    labels.retrieve().then(function(labels){

        var HTMLLabels = '';
        for (var index in labels.labels){
            if (labels.labels.hasOwnProperty(index)){
                HTMLLabels += labelTemplate(index, labels.labels[index][0], labels.labels[index][1]);
            }
        }

        existing_labels.innerHTML = HTMLLabels;
    });
});