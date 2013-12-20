/*
* jquery.datalist
*
* Copyright (c) 2013 Francesco Abbattista
* http://www.abcesco.de/
*
* Originally inspired and based on jquery.fixheadertable
* Copyright (c) 2010 Benjamin Léouzon
* http://www.tablefixedheader.com/
*
* Licensed under MIT
* http://www.opensource.org/licenses/mit-license.php
* 
* http://docs.jquery.com/Plugins/Authoring
* jQuery authoring guidelines
*
* Launch  : November 2013
* Version : 1.0
*/

(function($) { 
    
    // The main data-list function extension declaration for jQuery
	$.fn.datalist = function(options) {
		var defaults = {  
			caption		            : '',
			showExpandButton	    : true,
			themeClass		        : 'ui',
			height		            : null,
			width		            : null, 
			minWidth	            : null,
			minWidthAuto            : false,
            minColWidth             : 25,
			colWidths	            : [],
            cellAlignments          : [],
            headAlignments          : [],
			noWrapWhiteSpaces       : true,
			addTitles	            : false,
			useAlternateRowStyle    : false,
			alternateRowStyleClass  : 'ui-state-active',
			sortable	            : false, 
			sortedColIndex	        : null,
			sortTypes	            : [],
			dateFormat	            : 'd-m-y',
			usePagination           : false,
			rowsPerPage	            : 25,
			enableColResize         : false,
			wrapIntoContainer       : true,
            onRowClick              : null,
            onRowDblClick           : null,
            onCellClick             : null,
            onCellDblClick          : null
		};
        
        // Declaring the options object and passing the defaults to it  
		var options = $.extend(defaults, options); 
		
        // Internal utilities class
        var Utils = function(){
            // Returns the computed style for the specified document with the given property
            this.getComputedStyle = function(element, property) {
                if (element.currentStyle) {
                    
                    var y = x.currentStyle[property];
                    
                } else if (window.getComputedStyle) {
                    
                    var y = document.defaultView.getComputedStyle(element, null).getPropertyValue(property);
                }
                
                return y;
            };
            
            // Returns the scrollbar with
            this.getScrollbarWidth = function () {
                        
                var inner = $('<p/>').addClass('t_fixed_header_scroll_inner');
                var outer = $('<div/>').addClass('t_fixed_header_scroll_outer');
                
                outer.append(inner);
                
                $(document.body).append(outer);
                
                var w1 = inner[0].offsetWidth;  
                
                outer.css('overflow', 'scroll');
                
                var w2 = inner[0].offsetWidth;  
                
                if (w1 == w2) w2 = outer[0].clientWidth;  
                
                outer.remove();
                
                return (w1 - w2);            
            }
            
            // Parses the specified date using the format defined
            this.parseDate = function(format, date) {
            
            var tsp = {m : 1, d : 1, y : 1970, h : 0, i : 0, s : 0}, k, hl, dM;
            
            if(date && date !== null && date !== undefined){
                
                date = $.trim(date);
                
                date = date.split(/[\\\/:_;.\t\T\s-]/);
                
                format = format.split(/[\\\/:_;.\t\T\s-]/);
                
                var dfmt = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                
                var afmt = ["am", "pm", "AM", "PM"];
                
                var h12to24 = function(ampm, h){
                    
                    if (ampm === 0){ if (h == 12) { h = 0;} }
                    
                    else { if (h != 12) { h += 12; } }
                    
                    return h;
                };
                
                for (k=0, hl=format.length; k < hl; k++){
                    
                    if(format[k] == 'M') {
                        
                        dM = $.inArray(date[k],dfmt);
                        
                        if(dM !== -1 && dM < 12){date[k] = dM+1;}
                    }
                    
                    if(format[k] == 'F') {
                        
                        dM = $.inArray(date[k],dfmt);
                        
                        if(dM !== -1 && dM > 11){date[k] = dM+1-12;}
                    }
                    
                    if(format[k] == 'a') {
                        
                        dM = $.inArray(date[k],afmt);
                        
                        if(dM !== -1 && dM < 2 && date[k] == afmt[dM]){
                            
                            date[k] = dM;
                            
                            tsp.h = h12to24(date[k], tsp.h);
                        }
                    }
                    
                    if(format[k] == 'A') {
                        
                        dM = $.inArray(date[k],afmt);
                        
                        if(dM !== -1 && dM > 1 && date[k] == afmt[dM]){
                            
                            date[k] = dM-2;
                            
                            tsp.h = h12to24(date[k], tsp.h);
                        }
                    }
                    
                    if(date[k] !== undefined) {
                        
                        tsp[format[k].toLowerCase()] = parseInt(date[k],10);
                    }
                }
                
                tsp.m = parseInt(tsp.m,10)-1;
                
                var ty = tsp.y;
                
                if (ty >= 70 && ty <= 99) {tsp.y = 1900 + tsp.y;}
                
                else if (ty >=0 && ty <=69) {tsp.y= 2000 + tsp.y;}
            }
            
            return new Date(tsp.y, tsp.m, tsp.d, tsp.h, tsp.i, tsp.s,0);
        }
        
            // Verifies if we're using IE6 or 7
            this.isIE6_7 = function() {
                if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
                    var ieversion = new Number(RegExp.$1);
                     if (ieversion == 7 || ieversion == 6) {
                            return true;
                    } else {
                            return false;
                    }
                }
            }
            
            // Verifies if we're using IE8
            this.isIE8 = function() {
                if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
                    var ieversion = new Number(RegExp.$1);
                     if (ieversion == 8) {
                            return true;
                    } else {
                            return false;
                    }
                }
            }
        }
        
        // Internal builder class        
        var Builder = function(datalist){
            var m = this;
            var utils = new Utils();
            var _datalist           = datalist;
            var _table              = $(_datalist);
            var main_wrapper        = null;
            var nbcol               = $('thead th', _datalist).length;
            var _initialWidth       = $(_datalist).width();
            var _wrapper            = null;
            var _headerscontainer   = null;
            var _fillScrollbar      = null;
            var _body               = null;
            var _headers            = null;
            var _scrollWidth        = utils.getScrollbarWidth();
            var _colgroup_body      = null;
            var _nbRowsPerPage      = 10;
            var _new_nbRowsPerPage  = null;
            var _nbpages            = null;
            var _nbpagesDiv         = null;
            var _currentpage        = null;
            var _pager              = null;
            var _objectTable        = null;
            var _stripNum           = /[\$,%]/g;
            var _stripNum2          = /[\$.%]/g;
            var _resizeInfo         = null;
            var _resizeGhost        = null;            
            
            m.buildTop = function(table) {
                _fillScrollbar = $('<div class="headtable ui-state-default" style="margin-right : 0px"></div>');
                _headerscontainer = _fillScrollbar;
                _headerscontainer.insertBefore(table);
            }        
            
            m.buildColgroup = function(nbcol) {
                    
                var colgroup = $('<colgroup />');                
                
                if (options.colWidths.length == 0) {
                    var temp = null;
                    
                    for (var i = 0; i < nbcol; i++) {
                        temp = $('<col style="width : ' + (100/nbcol) + '%" />');
                        
                        colgroup.append(temp);
                        temp = null;
                    }
                } else if (options.colWidths.length == nbcol) {
                    
                    var cw = 0;
                    
                    for (var i = 0; i < nbcol; i++) {
                        temp = $('<col style="width : ' + options.colWidths[i] + 'px" />');
                        colgroup.append(temp);
                        temp = null;
                        cw += parseInt(options.colWidths[i]);
                    }
                    $(_table).css('width', cw + 'px');
                }
                return colgroup;
            }
            
            m.sortColumn = function(table, number, sens, th) {
                
                if ((options.sortTypes.length != 0) && (options.sortTypes.length == nbcol)) {
                    
                    var type = options.sortTypes[number];
                    
                    if (type == 'float') {                        
                        getSortKey = function(cell) {
                            var key = parseFloat( String(cell).replace(_stripNum, ''));
                            return isNaN(key) ? 0.00 : key;
                        }
                        
                    } else if (type == 'integer') {
                        getSortKey = function(cell) {
                            // return cell ? parseFloat(String(cell).replace(_stripNum, '')) : 0;  
                            return cell ? parseInt(String(cell).replace(_stripNum, '').replace(_stripNum2, '')) : 0;                            
                        }
                        
                    } else if (type == 'date') {
                        getSortKey = function(cell) {
                            return utils.parseDate(options.dateFormat, cell).getTime();
                        }
                    } else {
                        getSortKey = function(cell) {
                            if(!cell) { cell =""; }
                            return $.trim(String(cell).toLowerCase());
                        }
                    }
                } else {
                    getSortKey = function(cell) {
                        if(!cell) { cell =""; }
                        return $.trim(String(cell).toLowerCase());
                    }
                }
                
                _objectTable.sort(function(a, b){
                    var x = getSortKey(a[number]);
                    var y = getSortKey(b[number]);
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                })
                    
                if(sens == 'DESC'){
                    _objectTable.reverse();
                }
                
                (options.usePagination) ? m.moveToPage(table) : m.objectToTable(_objectTable, table);
                
                // Realign header
                m.alignCols(_headers);
                
                // Realign cells
                m.alignCells(table);
                
                // Reattach events
                m.attachEvents(table);
            }
            
            m.objectToTable = function(objectArray, table) {
                
                var body = $('tbody', table);
                                
                body.children().remove();
                
                if(options.useAlternateRowStyle){
                    for (var i = 0; i < objectArray.length; i++){
                        (i%2) ? (tr = $('<tr class="' + options.alternateRowStyleClass + '"></tr>')) : (tr = $('<tr></tr>'));                                    
                        
                        for (var j in objectArray[i]){
                            tr.append($('<td class="ui-widget-content"></td>').html(objectArray[i][j]));
                        }    
                        
                        body.append(tr);
                    }
                } else {
                    for (var i = 0; i < objectArray.length; i++){
                        tr = $('<tr></tr>');                
                        for (var j in objectArray[i]){
                            tr.append($('<td class="ui-widget-content"></td>').html(objectArray[i][j]));
                        }    
                        body.append(tr);
                    }
                }
            }
            
            m.tableToObject = function(table) {

                var objectArray = [];
                
                $('tr', table).each(function(i){
                    var data = {};
                    $('td', this).each(function(j){
                        data[j] = $(this).html();
                    })
                    
                    objectArray.push(data);
                });    
                return objectArray;
            }
            
            m.buildHeaders = function(table) {
                
                _headers = $('<table class="head"/>').append(_colgroup).append($('thead', table));
                
                _headerscontainer.append(_headers);    
                
                _headers.wrap('<div></div>');
                
                var tab_headers = $('th', _headers);
                
                tab_headers.addClass('ui-widget-content ui-state-default');
                                
                if(options.sortable){
                    
                    var th_div_sort = null;
                    
                    tab_headers.each(function(i){
                        
                        $(this).contents().wrapAll('<div class="ui-sort"></div>');
                        
                        th_div_sort = $('div.ui-sort', this);
                        
                        th_div_sort.click(function(){
                            
                            tab_headers.removeClass('ui-state-hover');
                            
                            $(this).parent().removeClass('ui-state-active').addClass('ui-state-hover');
                            
                            $('span.ui-icon', tab_headers).remove();
                            
                            if($(this).hasClass('sortedUp')){
                                
                                m.sortColumn(table, i, "DESC", this);
                                
                                $(this).removeClass('sortedUp').addClass('sortedDown');
                                
                                $(this).append('<span style="display : inline-block; vertical-align : middle" class="ui-icon ui-icon-triangle-1-s"></span>');
                                
                            } else {
                                
                                m.sortColumn(table, i, "ASC", this);
                                
                                $(this).removeClass('sortedDown').addClass('sortedUp');
                                
                                $(this).append('<span style="display : inline-block; vertical-align : middle" class="ui-icon ui-icon-triangle-1-n"></span>');
                            }
                            
                            _headerscontainer[0].scrollLeft = _body[0].scrollLeft;
                        })
                    });
                    
                    $('div.ui-sort', tab_headers).addClass('hover');
                }
                
                if(options.enableColResize && (options.colWidths.length == nbcol)){
                    
                    tab_headers.each(function(i){
                        
                        var resizer = $('<span class="ui-resize"></span>');
                        
                        $(this).prepend(resizer);
                        
                        resizer.mousedown(function(e){
                            
                            dragStart(i, e);
                            
                            return false;
                        })                        
                    });
                    
                    _main_wrapper.mousemove(function(e){
                        
                        if (_resizeInfo){
                            
                            dragMove(e);
                            
                            return false;
                        }
                    }).mouseup(function(){
                        
                        if (_resizeInfo){
                            
                            dragEnd();
                            
                            return false;
                        }
                        
                        return true;
                    });
                    
                    function getOffset(col){
                        
                        var ret = 0, cell = $('col', _colgroup), handler = $('th > span.ui-resize', _headers)[col], bso = _body[0].scrollLeft;
                        
                        for(var i = 0; i < col; i++){
                            
                            ret += parseInt(cell[i].style.width);
                        }
                        
                        return handler.offsetLeft + 5 + ret - bso;
                    }
                    
                    function dragStart(i, x){
                        
                        _resizeInfo = { id : i, startX : x.clientX , initTableWidth : m.getColratioWidth(), offset : getOffset(i) };
                        
                        _resizeGhost.css({ display : 'block', height : _headerscontainer.height() + _body.height() + 2 + 'px', left : _resizeInfo.offset + 'px', cursor : 'col-resize' });
                    }
                    
                    function dragMove(x){
                        
                        var diff = x.clientX - _resizeInfo.startX;
                        
                        _resizeInfo.newWidth = parseInt($('col', _colgroup)[_resizeInfo.id].style.width) + diff;
                        
                        _resizeInfo.newTableWidth = _resizeInfo.initTableWidth + diff;
                        
                        if(_resizeInfo.newWidth > parseInt(options.minColWidth)){
                        
                            _resizeGhost.css({ left :  _resizeInfo.offset + diff + 'px' });
                            
                        } else {
                            
                            _resizeInfo.newWidth = parseInt(options.minColWidth);
                        }
                    }
                    
                    function dragEnd(){
                        
                        $(_colgroup.children()[_resizeInfo.id]).css({ width : _resizeInfo.newWidth + 'px' });
                        
                        $(_colgroup_body.children()[_resizeInfo.id]).css({ width : _resizeInfo.newWidth + 'px' });
                        
                        var wrapper_width = _resizeInfo.newTableWidth;
                        
                        _headers.css({ 'width' : wrapper_width + 'px' });
                        
                        $(_table).css({ 'width'    : wrapper_width + 'px' });
                            
                        _resizeInfo = null;
                        
                        _resizeGhost.css({ display : 'none' });
                        
                        _headerscontainer[0].scrollLeft = _body[0].scrollLeft;
                    }
                }
            }
            
            m.buildBody = function(table) {
                               
                _body = $('<div class="body ui-widget-content"></div>').insertBefore(table).append(table);
                
                if(options.height != null &&  !isNaN(parseInt(options.height))) {                
                    _body.css('height', options.height + 'px');
                }
                
                _colgroup_body = _colgroup.clone();
                
                $(table).prepend(_colgroup_body);
                
                $('td', table).addClass('ui-widget-content');
                
                $(table).wrap('<div></div>');
                
                if (options.addTitles == true) {
                    $('td', table).each(function() {                        
                            $(this).attr('title', $(this).text());
                    });            
                }
                
                if (options.useAlternateRowStyle) {                    
                    $('tr:odd', table).addClass(options.alternateRowStyleClass);
                }
            }
            
            m.adaptScroll = function(table) {
                
                var scrollwidth = _scrollWidth;
                
                if(utils.isIE6_7()){                    
                    scrollwidth = 0; 
                }
                
                var width = 0;
                                        
                if (parseInt($(table).height()) > parseInt(options.height)) {                                     
                    width = scrollwidth;                    
                    overflow = 'scroll';
                    
                } else {                                     
                    width = 0;                        
                    overflow = 'auto';
                }
                
                if($.browser.msie && options.height) {                
                    width = scrollwidth;                    
                    overflow = 'scroll';
                }
                
                _fillScrollbar.css('margin-right', width);
                
                return overflow;                
            }
            
            m.restrictRows = function(table, nbrows) {
                            
                var length = _objectTable.length;
                
                var limit = 0;
                
                if(length < nbrows) {                    
                    limit = length;                
                } else {                    
                    limit = nbrows;
                }
                
                var _objectTableSliced = _objectTable.slice(0, limit);
                
                m.objectToTable(_objectTableSliced, table);    
                
                _nbpages = Math.ceil(length / nbrows);
                
                _currentpage = 1;
                
                _nbpagesDiv.html('Showing page ' + _currentpage + ' of ' + _nbpages);
                
                _body.css('overflow-y', m.adaptScroll(table));
                
                $('tr:last td', table).css('border-bottom-width', '1px');
                
                // Realign header
                m.alignCols(_headers);
                
                // Realign cells
                m.alignCells(table);
                
                // Reattach events
                m.attachEvents(table);
            }
            
            m.moveToNextPage = function(table) {
                
                _currentpage++;
                
                if(_currentpage >= (_nbpages)) {                    
                    _currentpage = (_nbpages);
                }
                    
                m.moveToPage(table);
            }
            
            m.moveToPreviousPage = function(table) {
                
                _currentpage--;
                
                if(_currentpage <= 1) {                    
                    _currentpage = 1;
                }
                
                m.moveToPage(table);
            }
            
            m.moveToPage = function(table) {
                
                var length = _objectTable.length;
                
                var start, limit = 0;
                
                start = (_currentpage - 1) * _new_nbRowsPerPage;
                
                if(length < (_currentpage * _new_nbRowsPerPage)) {                    
                    limit = length;                
                } else {                    
                    limit = (_currentpage * _new_nbRowsPerPage);
                }
                
                var _objectTableSliced = _objectTable.slice(start, limit);
                
                m.objectToTable(_objectTableSliced, table);
                
                _nbpagesDiv.html('Showing page ' + _currentpage + ' of ' + _nbpages);
                
                _body.css('overflow-y', m.adaptScroll(table));    
                
                $('tr:last td', table).css('border-bottom-width', '1px');
                
                // Realign header
                m.alignCols(_headers);
                
                // Realign cells
                m.alignCells(table);
                
                // Reattach events
                m.attachEvents(table);
            }
            
            m.buildNavButton = function(className, callbackClick, buttonClass) {
                
                var button = $('<div class="button ui-state-default ' + buttonClass + '"><span class="ui-icon ' + className + '">&nbsp;</span></div>');
                
                _pager.append(button);
                
                button.mouseover(function(){                        
                    $(this).addClass('ui-state-hover');
                        
                }).mousedown(function(){                        
                    $(this).addClass('ui-state-active');
                        
                }).mouseup(function(){                        
                    $(this).removeClass('ui-state-active');
                        
                }).mouseout(function(){                    
                    $(this).removeClass('ui-state-active');                    
                    $(this).removeClass('ui-state-hover');
                    
                }).click(callbackClick);    
            }
            
            m.buildPager = function(table) {
                
                _pager = $('<div class="pager ui-widget-header ui-corner-bottom ui-widget-content"></div>');
                
                _main_wrapper.append(_pager);
                
                m.buildNavButton('ui-icon-arrowthickstop-1-e', function(){                    
                    _currentpage = _nbpages;                    
                    m.moveToPage(table);
                }, 'ui-corner-right');
                
                m.buildNavButton('ui-icon ui-icon-arrowthick-1-e', function(){                    
                    m.moveToNextPage(table);
                }, 'noborder');
                
                m.buildNavButton('ui-icon ui-icon-arrowthick-1-w', function(){                    
                    m.moveToPreviousPage(table);
                }, 'noborder');
                
                m.buildNavButton('ui-icon-arrowthickstop-1-w', function(){                    
                    _currentpage = 1;                    
                    m.moveToPage(table);
                }, 'ui-corner-left noborder');
                
                _button_set =                 
                $('<div id="' + table.id + '_radio" style="float : left">' + 
                
                    '<input type="radio" id="' + table.id + '_show_10_rows" name="' + table.id + '_radio"/><label for="'  + table.id + '_show_10_rows">10</label>' + 
                    '<input type="radio" id="' + table.id + '_show_25_rows" name="' + table.id + '_radio"/><label for="'  + table.id + '_show_25_rows">25</label>' + 
                    '<input type="radio" id="' + table.id + '_show_50_rows" name="' + table.id + '_radio" /><label for="' + table.id + '_show_50_rows">50</label>' + 
                    '<input type="radio" id="' + table.id + '_show_100_rows" name="' + table.id + '_radio"/><label for="' + table.id + '_show_100_rows">100</label>' + 
                
                '</div>');
                                    
                _pager.append(_button_set);
                
                $('#' + table.id + '_show_10_rows', _pager).click(function(){                        
                        _new_nbRowsPerPage = _nbRowsPerPage;                        
                        m.restrictRows(table, _new_nbRowsPerPage);
                });
                
                $('#' + table.id + '_show_25_rows', _pager).click(function(){                        
                        _new_nbRowsPerPage = _nbRowsPerPage * 2.5;                        
                        m.restrictRows(table, _new_nbRowsPerPage);
                });
                
                $('#' + table.id + '_show_50_rows', _pager).click(function(){                    
                        _new_nbRowsPerPage = _nbRowsPerPage * 5;                    
                        m.restrictRows(table, _new_nbRowsPerPage);
                });
                
                $('#' + table.id + '_show_100_rows', _pager).click(function(){                    
                        _new_nbRowsPerPage = _nbRowsPerPage * 10;                    
                        m.restrictRows(table, _new_nbRowsPerPage);
                });
                
                _nbpagesDiv = $('<div class="page_infos"></div>');
                
                _pager.append(_nbpagesDiv);
                
                _new_nbRowsPerPage = _nbRowsPerPage;
                
                $('#' + table.id + '_show_' + options.rowsPerPage + '_rows', _pager).click();
                
                _button_set.buttonset();
            }
            
            m.getColratioWidth = function(){
                
                var tw = 0;
                
                for(var i = 0; i < options.colWidths.length; i++){                    
                    tw += parseInt(options.colWidths[i]);
                }
                
                return tw;
            }
            
            m.attachEvents = function(table) {
                
                // Attach events: RowClick
                if (options.onRowClick)
                {
                    $(table).find('tr').each(function() {
                        $(this).click(options.onRowClick);
                    })
                }
                
                // Attach events: RowDblClick
                if (options.onRowDblClick)
                {
                    $(table).find('tr').each(function() {
                        $(this).dblclick(options.onRowDblClick);
                    })
                }
                
                // Attach events: RowDblClick
                if (options.onCellClick)
                {
                    $(table).find('td').each(function() {
                        $(this).click(options.onCellClick);
                    })
                }
                
                if (options.onCellDblClick)
                {
                    $(table).find('td').each(function() {
                        $(this).dblclick(options.onCellDblClick);
                    })
                }
            }
            
            m.alignCells = function(table) {
                if (options.cellAlignments.length > 0)
                {
                    $(table).find('tr').each(function() {
                        var tdIndex = -1;
                        $(this).find('td').each(function() {
                           tdIndex++;
                           $(this).css('text-align', options.cellAlignments[tdIndex]); 
                        });    
                    })
                }
            };
            
            m.alignCols = function(headers) {
                if (options.headAlignments.length > 0)
                {
                    var tdIndex = -1;
                    $(headers).find('th').each(function() {
                           tdIndex++;
                           $(this).css('text-align', options.headAlignments[tdIndex]); 
                    })
                }
            };
            
            m.build = function() {
                /***********************/
                /********* MAIN ********/
                /***********************/
                
                _wrapper = $('<div/>').addClass('t_fixed_header ui-state-default default ' + options.themeClass).insertBefore(_datalist).append(_datalist);
                
                _wrapper.css('border', 'none').css('font-weight', 'normal');
                
                _main_wrapper = $('<div class="t_fixed_header_main_wrapper ui-widget ui-widget-header ' + options.themeClass + '"></div>');
                
                if (!options.noWrapWhiteSpaces) {                
                    _wrapper.addClass('t_fixed_header_wrap');
                }        
                
                m.buildTop(_datalist);
                
                m.buildHeaders(_datalist);    
                
                m.buildBody(_datalist);
                
                if(options.wrapIntoContainer){                
                    var tampon = _wrapper.wrap('<div class="ui-widget ui-widget-content ui-corner-all" style="padding : 5px; font-size : 1em;"></div>').parent();
                } else {
                    var tampon = _wrapper.wrap('<div></div>').parent();
                }
                
                if (options.width != null && !isNaN(parseInt(options.width)) && options.width > 0) {                    
                    tampon.css('width', options.width + 'px');    
                }
                
        

                var res = _wrapper.detach();
                
                var main_wrapper_child = $('<div class="t_fixed_header_main_wrapper_child"></div>');
                
                _main_wrapper.append(main_wrapper_child);
                
                main_wrapper_child.append(res);
                
                tampon.append(_main_wrapper);    
                
                if(utils.isIE6_7()){                
                    _body.css('margin-bottom', 17 + 'px');
                }
                
                if (options.caption != '') {                    
                    var caption = $('<div class="t_fixed_header_caption ui-widget-header ui-corner-top">' + options.caption + '</div>');
                    
                    _main_wrapper.prepend(caption).addClass('ui-corner-all');
                    
                    if (options.showExpandButton) {                    
                        var showhide = $('<div style="cursor : pointer; display : inline-block; vertical-align : middle; background : none; border : none;" class="ui-state-active"><span class="ui-icon ui-icon-triangle-1-n">&nbsp;</span></div>');
                        
                        caption.append(showhide);
                        
                        showhide.click(function(){                            
                            main_wrapper_child.toggle();                            
                            caption.toggleClass('toggle')                            
                            if(_pager) _pager.toggle();                            
                            $('span', showhide).toggleClass('ui-icon-triangle-1-s');
                        });
                    
                    }
                }     
                            
                if (options.sortable || options.usePagination) {                    
                    _objectTable = m.tableToObject(_datalist);
                }
                
                if (options.usePagination) {                    
                    m.buildPager(_datalist);
                }
                
                if(options.sortable && !isNaN(parseInt(options.sortedColIndex))) {                    
                    var cur_th = $('th', _headers)[options.sortedColIndex];                    
                    $(cur_th).addClass('ui-state-hover')                    
                    $('div.ui-sort', cur_th).click();
                }
                
                if(options.enableColResize && (options.colWidths.length == nbcol)){                
                    _resizeGhost = $('<div class="ui-resize-ghost ui-widget-header" style="height : ' + _main_wrapper.parent().height() + 'px"></div>');
                    _wrapper.append(_resizeGhost);
                }
                
                _body.css('overflow-y', m.adaptScroll(_datalist));
                
                if (options.minWidth != null && !isNaN(parseInt(options.minWidth)) && options.minWidth > 0) {                    
                    var minWidth = options.minWidth + 'px';                    
                } else if (options.minWidthAuto) {                    
                    if (options.colWidths.length == nbcol) {                        
                        var minWidth =  $(_datalist).width() + 'px';                        
                    } else {                        
                        var minWidth = (_initialWidth + 150) + 'px';
                    }
                }
                
   
                _headerscontainer.children().first().css('min-width', minWidth);
                
                _body.children().first().css('min-width', minWidth);
                
                _body.scroll(function(){                    
                    _headerscontainer[0].scrollLeft = _body[0].scrollLeft;
                });
                
                if (options.colWidths.length == nbcol) {                                    
                    _wrapper.removeClass('default');                    
                    $(_headers).css('width', m.getColratioWidth() + 'px');
                }
                
                _body.children().first().css('min-width', minWidth);

                if (options.minHeight != null && !isNaN(parseInt(options.minHeight)) && options.minHeight > 0) {                    
                    var minHeight = options.minHeight + 'px';            
                    _body.children().first().css('min-height', minHeight);        
                }
                                          
                // Align header
                m.alignCols(_headers);
                
                // Align cells
                m.alignCells(_datalist);
                
                // Attach events
                m.attachEvents(_datalist);
            }
            
            var _colgroup           = m.buildColgroup(nbcol);
        }
        
		return this.each(function() {
            var builder = new Builder(this);
			builder.build();
		});
	};

})(jQuery);