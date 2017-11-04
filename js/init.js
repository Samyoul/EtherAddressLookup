import EtherAddressLookup from '../js/DomManipulator.js';

window.addEventListener("load", function() {
    let objBrowser = chrome ? chrome : browser;
    let objEtherAddressLookup = new EtherAddressLookup(objBrowser);

    //Send message from the extension to here.
    objBrowser.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            let objEtherAddressLookup = new EtherAddressLookup();
            if(typeof request.func !== "undefined") {
                if(typeof objEtherAddressLookup[request.func] == "function") {
                    objEtherAddressLookup[request.func]();
                    sendResponse({status: "ok"});
                    return true;
                }
            }
            sendResponse({status: "fail"});
        }
    );
});