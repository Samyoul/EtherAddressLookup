// TODO minify this after adding modal CSS
// Native Javascript for Bootstrap 4 v2.0.19 | © dnp_theme | MIT-License
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD support:
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // CommonJS-like:
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        var bsn = factory();
        root.Modal = bsn.Modal;
        root.Popover = bsn.Popover;
    }
}(this, function () {

    /* Native Javascript for Bootstrap 4 | Internal Utility Functions
     ----------------------------------------------------------------*/
    "use strict";

    // globals
    var globalObject = typeof global !== 'undefined' ? global : this||window,
        HTML = document.documentElement, DOC = document, body = 'body', // allow the library to be used in <head>

        // function toggle attributes
        dataToggle    = 'data-toggle',
        dataDismiss   = 'data-dismiss',

        // components
        stringModal     = 'Modal',
        stringPopover   = 'Popover',

        // options DATA API
        databackdrop      = 'data-backdrop',
        dataKeyboard      = 'data-keyboard',
        dataTarget        = 'data-target',
        dataTitle         = 'data-title',
        dataDismissible   = 'data-dismissible',
        dataTrigger       = 'data-trigger',
        dataAnimation     = 'data-animation',
        dataContainer     = 'data-container',
        dataPlacement     = 'data-placement',
        dataDelay         = 'data-delay',

        // option keys
        backdrop = 'backdrop', keyboard = 'keyboard', delay = 'delay',
        content = 'content', target = 'target',
        interval = 'interval', pause = 'pause', animation = 'animation',
        placement = 'placement', container = 'container',

        // box model
        offsetTop    = 'offsetTop',      offsetBottom   = 'offsetBottom',
        offsetLeft   = 'offsetLeft',
        scrollTop    = 'scrollTop',      scrollLeft     = 'scrollLeft',
        clientWidth  = 'clientWidth',    clientHeight   = 'clientHeight',
        offsetWidth  = 'offsetWidth',    offsetHeight   = 'offsetHeight',
        innerWidth   = 'innerWidth',     innerHeight    = 'innerHeight',
        scrollHeight = 'scrollHeight',   height         = 'height',

        // aria
        ariaHidden   = 'aria-hidden',

        // event names
        clickEvent    = 'click',
        hoverEvent    = 'hover',
        keydownEvent  = 'keydown',
        resizeEvent   = 'resize',
        // originalEvents
        showEvent     = 'show',
        shownEvent    = 'shown',
        hideEvent     = 'hide',
        hiddenEvent   = 'hidden',

        // other
        getAttribute            = 'getAttribute',
        setAttribute            = 'setAttribute',
        hasAttribute            = 'hasAttribute',
        getElementsByTagName    = 'getElementsByTagName',
        preventDefault          = 'preventDefault',
        getBoundingClientRect   = 'getBoundingClientRect',
        querySelectorAll        = 'querySelectorAll',
        getElementsByCLASSNAME  = 'getElementsByClassName',

        indexOf      = 'indexOf',
        parentNode   = 'parentNode',
        length       = 'length',
        toLowerCase  = 'toLowerCase',
        Transition   = 'Transition',
        Webkit       = 'Webkit',
        style        = 'style',

        active     = 'active',
        showClass  = 'show',
        collapsing = 'collapsing',
        disabled   = 'disabled',
        loading    = 'loading',
        left       = 'left',
        right      = 'right',
        top        = 'top',
        bottom     = 'bottom',

        // tooltip / popover
        mouseHover = ('onmouseleave' in document) ? [ 'mouseenter', 'mouseleave'] : [ 'mouseover', 'mouseout' ],
        tipPositions = /\b(top|bottom|left|right)+/,

        // modal
        modalOverlay = 0,
        fixedTop = 'fixed-top',
        fixedBottom = 'fixed-bottom',

        // transitionEnd since 2.0.4
        supportTransitions = Webkit+Transition in HTML[style] || Transition[toLowerCase]() in HTML[style],
        transitionEndEvent = Webkit+Transition in HTML[style] ? Webkit[toLowerCase]()+Transition+'End' : Transition[toLowerCase]()+'end',

        // set new focus element since 2.0.3
        setFocus = function(element){
            element.focus ? element.focus() : element.setActive();
        },

        // class manipulation, since 2.0.0 requires polyfill.js
        addClass = function(element,classNAME) {
            element.classList.add(classNAME);
        },
        removeClass = function(element,classNAME) {
            element.classList.remove(classNAME);
        },
        hasClass = function(element,classNAME){ // since 2.0.0
            return element.classList.contains(classNAME);
        },

        // selection methods
        getElementsByClassName = function(element,classNAME) { // returns Array
            return [].slice.call(element[getElementsByCLASSNAME]( classNAME ));
        },
        queryElement = function (selector, parent) {
            var lookUp = parent ? parent : document;
            return typeof selector === 'object' ? selector : lookUp.querySelector(selector);
        },
        getClosest = function (element, selector) { //element is the element and selector is for the closest parent element to find
            // source http://gomakethings.com/climbing-up-and-down-the-dom-tree-with-vanilla-javascript/
            var firstChar = selector.charAt(0);
            for ( ; element && element !== document; element = element[parentNode] ) {// Get closest match
                if ( firstChar === '.' ) {// If selector is a class
                    if ( queryElement(selector,element[parentNode]) !== null && hasClass(element,selector.replace('.','')) ) { return element; }
                } else if ( firstChar === '#' ) { // If selector is an ID
                    if ( element.id === selector.substr(1) ) { return element; }
                }
            }
            return false;
        },

        // event attach jQuery style / trigger  since 1.2.0
        on = function (element, event, handler) {
            element.addEventListener(event, handler, false);
        },
        off = function(element, event, handler) {
            element.removeEventListener(event, handler, false);
        },
        one = function (element, event, handler) { // one since 2.0.4
            on(element, event, function handlerWrapper(e){
                handler(e);
                off(element, event, handlerWrapper);
            });
        },
        emulateTransitionEnd = function(element,handler){ // emulateTransitionEnd since 2.0.4
            if (supportTransitions) { one(element, transitionEndEvent, function(e){ handler(e); }); }
            else { handler(); }
        },
        bootstrapCustomEvent = function (eventName, componentName, related) {
            var OriginalCustomEvent = new CustomEvent( eventName + '.bs.' + componentName);
            OriginalCustomEvent.relatedTarget = related;
            this.dispatchEvent(OriginalCustomEvent);
        },

        // Init DATA API
        initializeDataAPI = function( component, constructor, collection ){
            for (var i=0; i < collection[length]; i++) {
                new constructor(collection[i]);
            }
        },

        // tooltip / popover stuff
        getScroll = function() { // also Affix and ScrollSpy uses it
            return {
                y : globalObject.pageYOffset || HTML[scrollTop],
                x : globalObject.pageXOffset || HTML[scrollLeft]
            }
        },
        styleTip = function(link,element,position,parent) { // both popovers and tooltips (target,tooltip,placement,elementToAppendTo)
            var elementDimensions = { w : element[offsetWidth], h: element[offsetHeight] },
                windowWidth = (HTML[clientWidth] || DOC[body][clientWidth]),
                windowHeight = (HTML[clientHeight] || DOC[body][clientHeight]),
                rect = link[getBoundingClientRect](),
                scroll = parent === DOC[body] ? getScroll() : { x: parent[offsetLeft] + parent[scrollLeft], y: parent[offsetTop] + parent[scrollTop] },
                linkDimensions = { w: rect[right] - rect[left], h: rect[bottom] - rect[top] },
                arrow = queryElement('.arrow',element),
                arrowWidth = arrow[offsetWidth], isPopover = hasClass(element,'popover'),
                topPosition, leftPosition, arrowTop, arrowLeft,

                halfTopExceed = rect[top] + linkDimensions.h/2 - elementDimensions.h/2 < 0,
                halfLeftExceed = rect[left] + linkDimensions.w/2 - elementDimensions.w/2 < 0,
                halfRightExceed = rect[left] + elementDimensions.w/2 + linkDimensions.w/2 >= windowWidth,
                halfBottomExceed = rect[top] + elementDimensions.h/2 + linkDimensions.h/2 >= windowHeight,
                topExceed = rect[top] - elementDimensions.h < 0,
                leftExceed = rect[left] - elementDimensions.w < 0,
                bottomExceed = rect[top] + elementDimensions.h + linkDimensions.h >= windowHeight,
                rightExceed = rect[left] + elementDimensions.w + linkDimensions.w >= windowWidth;

            // recompute position
            position = (position === left || position === right) && leftExceed && rightExceed ? top : position; // first, when both left and right limits are exceeded, we fall back to top|bottom
            position = position === top && topExceed ? bottom : position;
            position = position === bottom && bottomExceed ? top : position;
            position = position === left && leftExceed ? right : position;
            position = position === right && rightExceed ? left : position;

            // apply styling to tooltip or popover
            if ( position === left || position === right ) { // secondary|side positions
                if ( position === left ) { // LEFT
                    leftPosition = rect[left] + scroll.x - elementDimensions.w;
                } else if ( position === right ) { // RIGHT
                    leftPosition = rect[left] + scroll.x + linkDimensions.w;
                }

                // adjust top and arrow
                if (halfTopExceed) {
                    topPosition = rect[top] + scroll.y;
                    arrowTop = linkDimensions.h/2 - arrowWidth/2;
                } else if (halfBottomExceed) {
                    topPosition = rect[top] + scroll.y - elementDimensions.h + linkDimensions.h;
                    arrowTop = elementDimensions.h - linkDimensions.h/2 - arrowWidth/2;
                } else {
                    topPosition = rect[top] + scroll.y - elementDimensions.h/2 + linkDimensions.h/2;
                    arrowTop = elementDimensions.h/2 - arrowWidth/2;
                }
            } else if ( position === top || position === bottom ) { // primary|vertical positions
                if ( position === top) { // TOP
                    topPosition =  rect[top] + scroll.y - elementDimensions.h;
                } else if ( position === bottom ) { // BOTTOM
                    topPosition = rect[top] + scroll.y + linkDimensions.h;
                }
                // adjust left | right and also the arrow
                if (halfLeftExceed) {
                    leftPosition = 0;
                    arrowLeft = rect[left] + linkDimensions.w/2 - arrowWidth/2;
                } else if (halfRightExceed) {
                    leftPosition = windowWidth - elementDimensions.w*1.01;
                    arrowLeft = elementDimensions.w - ( windowWidth - rect[left] ) + linkDimensions.w/2 - arrowWidth/2;
                } else {
                    leftPosition = rect[left] + scroll.x - elementDimensions.w/2 + linkDimensions.w/2;
                    arrowLeft = elementDimensions.w/2 - arrowWidth/2;
                }
            }

            // fixing some CSS bug with Bootstrap 4 alpha
            topPosition = position === top && isPopover ? topPosition - arrowWidth : topPosition;
            leftPosition = position === left && isPopover ? leftPosition - arrowWidth : leftPosition;

            // apply style to tooltip/popover and it's arrow
            element[style][top] = topPosition + 'px';
            element[style][left] = leftPosition + 'px';

            arrowTop && (arrow[style][top] = arrowTop + 'px');
            arrowLeft && (arrow[style][left] = arrowLeft + 'px');

            element.className[indexOf](position) === -1 && (element.className = element.className.replace(tipPositions,position));
        };



    /* Native Javascript for Bootstrap 4 | Modal
     -------------------------------------------*/

    // MODAL DEFINITION
    // ===============
    var Modal = function(element, options) { // element can be the modal/triggering button

        // the modal (both JavaScript / DATA API init) / triggering button element (DATA API)
        element = queryElement(element);

        // determine modal, triggering element
        var btnCheck = element[getAttribute](dataTarget)||element[getAttribute]('href'),
            checkModal = queryElement( btnCheck ),
            modal = hasClass(element,'modal') ? element : checkModal,

            // strings
            component = 'ext-etheraddresslookup-modal',
            staticString = 'static',
            paddingLeft = 'paddingLeft',
            paddingRight = 'paddingRight',
            modalBackdropString = 'ext-etheraddresslookup-modal-backdrop';

        if ( hasClass(element,'modal') ) { element = null; } // modal is now independent of it's triggering element

        if ( !modal ) { return; } // invalidate

        // set options
        options = options || {};

        this[keyboard] = options[keyboard] === false || modal[getAttribute](dataKeyboard) === 'false' ? false : true;
        this[backdrop] = options[backdrop] === staticString || modal[getAttribute](databackdrop) === staticString ? staticString : true;
        this[backdrop] = options[backdrop] === false || modal[getAttribute](databackdrop) === 'false' ? false : this[backdrop];
        this[content]  = options[content]; // JavaScript only

        // bind, constants, event targets and other vars
        var self = this, relatedTarget = null,
            bodyIsOverflowing, modalIsOverflowing, scrollbarWidth, overlay,

            // also find fixed-top / fixed-bottom items
            fixedItems = getElementsByClassName(HTML,fixedTop).concat(getElementsByClassName(HTML,fixedBottom)),

            // private methods
            getWindowWidth = function() {
                var htmlRect = HTML[getBoundingClientRect]();
                return globalObject[innerWidth] || (htmlRect[right] - Math.abs(htmlRect[left]));
            },
            setScrollbar = function () {
                var bodyStyle = globalObject.getComputedStyle(DOC[body]),
                    bodyPad = parseInt((bodyStyle[paddingRight]), 10), itemPad;
                if (bodyIsOverflowing) {
                    DOC[body][style][paddingRight] = (bodyPad + scrollbarWidth) + 'px';
                    if (fixedItems[length]){
                        for (var i = 0; i < fixedItems[length]; i++) {
                            itemPad = globalObject.getComputedStyle(fixedItems[i])[paddingRight];
                            fixedItems[i][style][paddingRight] = ( parseInt(itemPad) + scrollbarWidth) + 'px';
                        }
                    }
                }
            },
            resetScrollbar = function () {
                DOC[body][style][paddingRight] = '';
                if (fixedItems[length]){
                    for (var i = 0; i < fixedItems[length]; i++) {
                        fixedItems[i][style][paddingRight] = '';
                    }
                }
            },
            measureScrollbar = function () { // thx walsh
                var scrollDiv = document.createElement('div'), scrollBarWidth;
                scrollDiv.className = component+'-scrollbar-measure'; // this is here to stay
                DOC[body].appendChild(scrollDiv);
                scrollBarWidth = scrollDiv[offsetWidth] - scrollDiv[clientWidth];
                DOC[body].removeChild(scrollDiv);
                return scrollBarWidth;
            },
            checkScrollbar = function () {
                bodyIsOverflowing = DOC[body][clientWidth] < getWindowWidth();
                modalIsOverflowing = modal[scrollHeight] > HTML[clientHeight];
                scrollbarWidth = measureScrollbar();
            },
            adjustDialog = function () {
                modal[style][paddingLeft] = !bodyIsOverflowing && modalIsOverflowing ? scrollbarWidth + 'px' : '';
                modal[style][paddingRight] = bodyIsOverflowing && !modalIsOverflowing ? scrollbarWidth + 'px' : '';
            },
            resetAdjustments = function () {
                modal[style][paddingLeft] = '';
                modal[style][paddingRight] = '';
            },
            createOverlay = function() {
                modalOverlay = 1;

                var newOverlay = document.createElement('div');
                overlay = queryElement('.'+modalBackdropString);

                if ( overlay === null ) {
                    newOverlay[setAttribute]('class',modalBackdropString+' fade');
                    overlay = newOverlay;
                    DOC[body].appendChild(overlay);
                }
            },
            removeOverlay = function() {
                overlay = queryElement('.'+modalBackdropString);
                if ( overlay && overlay !== null && typeof overlay === 'object' ) {
                    modalOverlay = 0;
                    DOC[body].removeChild(overlay); overlay = null;
                }
                bootstrapCustomEvent.call(modal, hiddenEvent, component);
            },
            keydownHandlerToggle = function() {
                if (hasClass(modal,showClass)) {
                    on(document, keydownEvent, keyHandler);
                } else {
                    off(document, keydownEvent, keyHandler);
                }
            },
            resizeHandlerToggle = function() {
                if (hasClass(modal,showClass)) {
                    on(globalObject, resizeEvent, self.update);
                } else {
                    off(globalObject, resizeEvent, self.update);
                }
            },
            dismissHandlerToggle = function() {
                if (hasClass(modal,showClass)) {
                    on(modal, clickEvent, dismissHandler);
                } else {
                    off(modal, clickEvent, dismissHandler);
                }
            },
            // triggers
            triggerShow = function() {
                setFocus(modal);
                bootstrapCustomEvent.call(modal, shownEvent, component, relatedTarget);
            },
            triggerHide = function() {
                modal[style].display = '';
                element && (setFocus(element));

                setTimeout(function(){
                    if (!getElementsByClassName(document,component+' '+showClass)[0]) {
                        resetAdjustments();
                        resetScrollbar();
                        removeClass(DOC[body],component+'-open');
                        overlay && hasClass(overlay,'fade') ? (removeClass(overlay,showClass), emulateTransitionEnd(overlay,removeOverlay))
                            : removeOverlay();

                        resizeHandlerToggle();
                        dismissHandlerToggle();
                        keydownHandlerToggle();
                    }
                }, 50);
            },
            // handlers
            clickHandler = function(e) {
                var clickTarget = e[target];
                clickTarget = clickTarget[hasAttribute](dataTarget) || clickTarget[hasAttribute]('href') ? clickTarget : clickTarget[parentNode];
                if ( clickTarget === element && !hasClass(modal,showClass) ) {
                    modal.modalTrigger = element;
                    relatedTarget = element;
                    self.show();
                    e[preventDefault]();
                }
            },
            keyHandler = function(e) {
                if (self[keyboard] && e.which == 27 && hasClass(modal,showClass)) {
                    self.hide();
                }
            },
            dismissHandler = function(e) {
                var clickTarget = e[target];
                if ( hasClass(modal,showClass) && (clickTarget[parentNode][getAttribute](dataDismiss) === component
                    || clickTarget[getAttribute](dataDismiss) === component
                    || (clickTarget === modal && self[backdrop] !== staticString) ) ) {
                    self.hide(); relatedTarget = null;
                    e[preventDefault]();
                }
            };

        // public methods
        this.toggle = function() {
            if ( hasClass(modal,showClass) ) {this.hide();} else {this.show();}
        };
        this.show = function() {
            bootstrapCustomEvent.call(modal, showEvent, component, relatedTarget);

            // we elegantly hide any opened modal
            var currentOpen = getElementsByClassName(document,component+' '+showClass)[0];
            currentOpen && currentOpen !== modal && currentOpen.modalTrigger[stringModal].hide();

            if ( this[backdrop] ) {
                !modalOverlay && createOverlay();
            }

            if ( overlay && modalOverlay && !hasClass(overlay,showClass)) {
                overlay[offsetWidth]; // force reflow to enable trasition
                addClass(overlay, showClass);
            }

            setTimeout( function() {
                modal[style].display = 'block';

                checkScrollbar();
                setScrollbar();
                adjustDialog();

                addClass(DOC[body],component+'-open');
                addClass(modal,showClass);
                modal[setAttribute](ariaHidden, false);

                resizeHandlerToggle();
                dismissHandlerToggle();
                keydownHandlerToggle();

                hasClass(modal,'fade') ? emulateTransitionEnd(modal, triggerShow) : triggerShow();
            }, supportTransitions ? 150 : 0);
        };
        this.hide = function() {
            bootstrapCustomEvent.call(modal, hideEvent, component);
            overlay = queryElement('.'+modalBackdropString);

            removeClass(modal,showClass);
            modal[setAttribute](ariaHidden, true);

            setTimeout(function(){
                hasClass(modal,'fade') ? emulateTransitionEnd(modal, triggerHide) : triggerHide();
            }, supportTransitions ? 150 : 0);
        };
        this.setContent = function( content ) {
            queryElement('.'+component+'-content',modal).innerHTML = content;
        };
        this.update = function() {
            if (hasClass(modal,showClass)) {
                checkScrollbar();
                setScrollbar();
                adjustDialog();
            }
        };

        // init
        // prevent adding event handlers over and over
        // modal is independent of a triggering element
        if ( !!element && !(stringModal in element) ) {
            on(element, clickEvent, clickHandler);
        }
        if ( !!this[content] ) { this.setContent( this[content] ); }
        !!element && (element[stringModal] = this);
    };

    // DATA API
    initializeDataAPI(stringModal, Modal, DOC[querySelectorAll]('['+dataToggle+'="modal"]'));

    /* Native Javascript for Bootstrap 4 | Popover
     ----------------------------------------------*/

    // POPOVER DEFINITION
    // ==================
    var Popover = function( element, options ) {

        // initialization element
        element = queryElement(element);

        // DATA API
        var triggerData = element[getAttribute](dataTrigger), // click / hover / focus
            animationData = element[getAttribute](dataAnimation), // true / false
            placementData = element[getAttribute](dataPlacement),
            dismissibleData = element[getAttribute](dataDismissible),
            delayData = element[getAttribute](dataDelay),
            containerData = element[getAttribute](dataContainer),

            // internal strings
            component = 'ext-etheraddresslookup-popover',
            template = 'template',
            trigger = 'trigger',
            classString = 'class',
            div = 'div',
            fade = 'fade',
            content = 'content',
            dataContent = 'data-content',
            dismissible = 'dismissible',
            closeBtn = '<button type="button" class="close">×</button>',

            // maybe the element is inside a modal
            modal = getClosest(element,'.modal'),

            // maybe the element is inside a fixed navbar
            navbarFixedTop = getClosest(element,'.'+fixedTop),
            navbarFixedBottom = getClosest(element,'.'+fixedBottom);

        // set options
        options = options || {};
        this[template] = options[template] ? options[template] : null; // JavaScript only
        this[trigger] = options[trigger] ? options[trigger] : triggerData || hoverEvent;
        this[animation] = options[animation] && options[animation] !== fade ? options[animation] : animationData || fade;
        this[placement] = options[placement] ? options[placement] : placementData || top;
        this[delay] = parseInt(options[delay] || delayData) || 200;
        this[dismissible] = options[dismissible] || dismissibleData === 'true' ? true : false;
        this[container] = queryElement(options[container]) ? queryElement(options[container])
            : queryElement(containerData) ? queryElement(containerData)
            : navbarFixedTop ? navbarFixedTop
            : navbarFixedBottom ? navbarFixedBottom
            : modal ? modal : DOC[body];

        // bind, content
        var self = this,
            titleString = element[getAttribute](dataTitle) || null,
            contentString = element[getAttribute](dataContent) || null;

        if ( !contentString && !this[template] ) return; // invalidate

        // constants, vars
        var popover = null, timer = 0, placementSetting = this[placement],

            // handlers
            dismissibleHandler = function(e) {
                if (popover !== null && e[target] === queryElement('.close',popover)) {
                    self.hide();
                }
            },

            // private methods
            removePopover = function() {
                self[container].removeChild(popover);
                timer = null; popover = null;
            },
            createPopover = function() {
                titleString = element[getAttribute](dataTitle); // check content again
                contentString = element[getAttribute](dataContent);

                popover = document.createElement(div);

                // popover arrow
                var popoverArrow = document.createElement(div);
                popoverArrow[setAttribute](classString,'arrow');
                popover.appendChild(popoverArrow);

                if ( contentString !== null && self[template] === null ) { //create the popover from data attributes

                    popover[setAttribute]('role','tooltip');

                    if (titleString !== null) {
                        var popoverTitle = document.createElement('h3');
                        popoverTitle[setAttribute](classString,component+'-header');

                        popoverTitle.innerHTML = self[dismissible] ? titleString + closeBtn : titleString;
                        popover.appendChild(popoverTitle);
                    }

                    //set popover content
                    var popoverContent = document.createElement(div);
                    popoverContent[setAttribute](classString,component+'-body');
                    popoverContent.innerHTML = self[dismissible] && titleString === null ? contentString + closeBtn : contentString;
                    popover.appendChild(popoverContent);

                } else {  // or create the popover from template
                    var popoverTemplate = document.createElement(div);
                    popoverTemplate.innerHTML = self[template];
                    popover.innerHTML = popoverTemplate.firstChild.innerHTML;
                }

                //append to the container
                self[container].appendChild(popover);
                popover[style].display = 'block';
                popover[setAttribute](classString, component+ ' bs-' + component+'-'+placementSetting + ' ' + self[animation]);
            },
            showPopover = function () {
                !hasClass(popover,showClass) && ( addClass(popover,showClass) );
            },
            updatePopover = function() {
                styleTip(element,popover,placementSetting,self[container]);
            },

            // event toggle
            dismissHandlerToggle = function(type){
                if (/^(click|focus)$/.test(self[trigger])) {
                    !self[dismissible] && type( element, 'blur', self.hide );
                }
                self[dismissible] && type( document, clickEvent, dismissibleHandler );
                type( globalObject, resizeEvent, self.hide );
            },

            // triggers
            showTrigger = function() {
                dismissHandlerToggle(on);
                bootstrapCustomEvent.call(element, shownEvent, component);
            },
            hideTrigger = function() {
                dismissHandlerToggle(off);
                removePopover();
                bootstrapCustomEvent.call(element, hiddenEvent, component);
            };

        // public methods / handlers
        this.toggle = function() {
            if (popover === null) { self.show(); }
            else { self.hide(); }
        };
        this.show = function() {
            clearTimeout(timer);
            timer = setTimeout( function() {
                if (popover === null) {
                    placementSetting = self[placement]; // we reset placement in all cases
                    createPopover();
                    updatePopover();
                    showPopover();
                    bootstrapCustomEvent.call(element, showEvent, component);
                    !!self[animation] ? emulateTransitionEnd(popover, showTrigger) : showTrigger();
                }
            }, 20 );
        };
        this.hide = function() {
            clearTimeout(timer);
            timer = setTimeout( function() {
                if (popover && popover !== null && hasClass(popover,showClass)) {
                    bootstrapCustomEvent.call(element, hideEvent, component);
                    removeClass(popover,showClass);
                    !!self[animation] ? emulateTransitionEnd(popover, hideTrigger) : hideTrigger();
                }
            }, self[delay] );
        };

        // init
        if ( !(stringPopover in element) ) { // prevent adding event handlers twice
            if (self[trigger] === hoverEvent) {
                on( element, mouseHover[0], self.show );
                if (!self[dismissible]) { on( element, mouseHover[1], self.hide ); }
            } else if (/^(click|focus)$/.test(self[trigger])) {
                on( element, self[trigger], self.toggle );
            }
        }
        element[stringPopover] = self;
    };

    // POPOVER DATA API
    // ================
    initializeDataAPI(stringPopover, Popover, DOC[querySelectorAll]('['+dataToggle+'="popover"]'));

    return {
        Modal: Modal,
        Popover: Popover
    };
}));