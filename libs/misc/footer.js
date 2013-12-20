/*
Constant Footer v 1.0.0
http://www.enhance-js.com/
http://www.stevefenton.co.uk/
*/
var Fenton = Fenton || {};

Fenton.footer = (function () {
    var elements = [];
    var opacity = 0.8;
    var showClose = false;
    
    var prependElement = function (parent,child) {
        parent.insertBefore(child, parent.childNodes[0]);
    }
    
    var addCloseButton = function (parent) {
        var closeButton = document.createElement('div');
        closeButton.id = parent.id + '_close';
        closeButton.style.styleFloat = 'right';
        closeButton.style.cssFloat = 'right';
        closeButton.style.cursor = 'pointer';
        closeButton.innerHTML = '[x]';
        closeButton.onclick = function () { parent.style.display = 'none'; };
        prependElement(parent, closeButton);
    }
    
    return {
        addElement: function (id) {
            if (document.getElementById(id)) {
                elements.push(document.getElementById(id));
            }
            return this;
        },
        setOpacity: function (value) {
            opacity = value;
            return this;
        },
        showCloseButton: function () {
            showClose = true;
            return this;
        },
        run: function () {
            var i;
            for (i = 0; i < elements.length; i++) {
                elements[i].style.display = 'block';
                elements[i].style.position = 'fixed';
                elements[i].style.bottom = '0px';
                elements[i].style.left = '0px';
                elements[i].style.width = '100%';
                elements[i].style.zoom = '1';
                elements[i].style.opacity = opacity;
                
                var ieOpacity = opacity * 100;
                elements[i].style.filter = 'alpha(opacity=' + ieOpacity + ')';
                elements[i].style['-ms-filter'] = 'progid:DXImageTransform.Microsoft.Alpha(Opacity=' + ieOpacity + ')';
                
                if (showClose) {
                    addCloseButton(elements[i]);
                }
                
                document.body.style.paddingBottom = elements[i].offsetHeight + 'px';
            }
            return this;
        }
    }
}());
