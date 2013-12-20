/**
 * Author:      Matt Hinchliffe <www.maketea.co.uk>
 * Modified:    16/04/2012
 * Description: Simple jQuery modal window
 * Example:
 * <div id="modal-wrapper">
 *     <div id="modal-content" />
 *     <span id="modal-close" />
 * </div>
 * <div id="modal-overlay" />
 */
 
 /* Licensed under the terms of CC 3.0 */
 /* http://creativecommons.org/licenses/by-sa/3.0/ */
 
 (function( $, undefined ) {

    'use strict';

    function ModalWindow( target, options ) {

        this.opts = $.extend({}, {
            onopen: undefined,
            onhide: undefined,
            onupdate: undefined,
            fixed: false,
            overlay: true,
            blur: true,
            escape: true,
            width: 640,
            maxWidth: '95%',
            height: 480,
            maxHeight: '95%',
            namespace: 'statsMod-modal',
            zIndex: null,
            id: null
        }, options);

        this.target = target;

        this.isOpen = false;
        this.isInitialized = false;

        return this;
    }

    /**
     * Instantiate
     * @description Create the structure on first run
     */
    ModalWindow.prototype._init = function() {

        this.doc = $(document);

        this.wrapper = $('<div class="statsMod-modal-wrapper">').css({
            position: this.opts.fixed ? 'fixed' : 'absolute',
            width: this.opts.width,
            maxWidth: this.opts.maxWidth,
            height: this.opts.height,
            maxHeight: this.opts.maxHeight,
            zIndex: this.opts.zIndex ? this.opts.zIndex : 0, 
            display: 'none'
        });

        if (this.opts.id) {
            this.wrapper.attr('id', this.opts.id);
        }
        
        this.close = $('<span class="statsMod-modal-close" data-' + this.opts.namespace + '-close>Close</span>').appendTo(this.wrapper);
        this.content = $('<div class="statsMod-modal-content">').appendTo(this.wrapper);

        this.wrapper.appendTo(this.target);

        // Define overlay to prevent errors
        this.overlay = false;

        if ( this.opts.overlay ) {
            this.overlay = $('<div class="statsMod-modal-overlay"' + (this.opts.blur ? 'data-' + this.opts.namespace + '-close' : '') + '>')
                .css({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    display: 'none'
                })
                .appendTo(this.target);
        }

        // Context appropriate metrics and events
        this.isBody = (this.target === document.body);
        this.context = this.isBody ? $(window) : $(this.target).css('position', 'relative');

        this.isInitialized = true;
    };

    /**
     * Align
     * @description Centre modal window and size overlay to fit
     */
    ModalWindow.prototype.align = function() {

        var height = this.wrapper.outerHeight(),
            width = this.wrapper.outerWidth(),
            maxHeight = this.context.outerHeight(),
            maxWidth = this.context.outerWidth(),
            top = this.opts.fixed ? 0 : this.context.scrollTop();

        this.wrapper.css({
            top: height < maxHeight ? ( (maxHeight - height ) / 2 ) + top : top,
            left: width < maxWidth ? (maxWidth - width) / 2 : 0
        });

        if ( this.opts.overlay ) {
            this.overlay.css('height', this.isBody ? this.doc.height() : maxHeight );
        }
    };

    ModalWindow.prototype.openJQ = function( element, callback) {
        this.open(element.html());   
    };
    
    /**
     * Open
     * @description Open the modal window
     * @param {object} content
     * @param {function} callback
     */
    ModalWindow.prototype.open = function( content, callback ) {

        if ( ! this.isInitialized) {
            this._init();
        }

        var self = this;

        if ( this.isBody ) {
            this.context.on('resize.' + this.opts.namespace, function() {
                self.align();
            });

            this.doc.on('keyup.' + this.opts.namespace, function( e ) {
                if ( e.keyCode === 27 ) {
                    self.hide();
                }
            });
        }

        this.doc.on('click.modalWindow', '[data-' + this.opts.namespace + '-close]', function( e ) {
            e.preventDefault();
            self.hide();
        });

        // Fade in
        this.wrapper
            .add(this.overlay)
            .stop()
            .fadeIn();
            
        this.isOpen = true;

        // Add content to window
        if ( content ) {
            this.update(content);
        }

        
        // Callbacks
        if ( this.opts.onopen ) {
            this.opts.onopen.call(this);
        }
        if ( callback ) {
            callback.call(this);
        }
    };

    /**
     * Update
     * @description Update the modal window contents
     * @param {object|string} content
     * @param {function} callback
     */
    ModalWindow.prototype.update = function( content, callback ) {

        this.content.html(content);

        if ( this.isOpen ) {
            this.align();
        }

        // Callbacks
        if ( this.opts.onupdate ) {
            this.opts.onupdate.call(this);
        }
        if ( callback )
        {
            callback.call(this);
        }
    };

    /**
     * Resize
     * @description Resizes the modal window content area
     * @param {numeric|string} width
     * @param {numeric|string} height
     */
    ModalWindow.prototype.resize = function( width, height ) {
        this.wrapper.css({
            width: width,
            height: height
        });

        this.align();
    };

    /**
     * Hide
     * @description Hide the modal window
     * @param {function} callback
     */
    ModalWindow.prototype.hide = function( callback ) {

        // Unbind events
        this.doc.off('.' + this.opts.namespace);

        this.wrapper
            .add(this.overlay)
            .stop()
            .fadeOut();

        this.isOpen = false;

        // Callbacks
        if ( this.opts.onhide ) {
            this.opts.onhide.call(this);
        }
        if ( callback ) {
            callback.call(this);
        }
    };

    // jQuery plugin wrapper
    $.fn.modalWindow = function( options, namespace ) {
        return this.each(function() {
            var name = namespace ? 'statsMod-modal_' + namespace : 'statsMod-modal';
            if ( ! $.data(this, name) ) {
                $.data(this, name, new ModalWindow(this, options) );
            }
        });
    };

    // AMD and CommonJS module compatibility
    if ( typeof define === 'function' && define.amd ){
        define(function() {
            return ModalWindow;
        });
    }
    else if ( typeof module !== 'undefined' && module.exports ) {
        module.exports = ModalWindow;
    }

})(jQuery);