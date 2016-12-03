/*
* Name:                 InfoStatsMod
* Class:                InfoStatsModAbescoUG_ReleasedGames
* Description:          Class for handling and displaying "Released Games" info & stats
* Copyright:            © 2013 Francesco Abbattista
* Url:                  http://www.abesco.de/
*/


var InfoStatsModAbescoUG_ReleasedGames = function(infoStatsModCore) {
        var m      = this;
        var core   = infoStatsModCore;

        // Selected tab Index
        m.selectedTabIndex = 0;

        // Event handler for ROW Clicked
        m.tableRowClickedHandler = function() {
            // reset selections
            var par = $(this).parent().find('tr').each(function(){
                $(this).removeClass('statsmod-datalistrow-selected');
            });

            $(this).addClass('statsmod-datalistrow-selected');

            var doc     = $(document);

            if ( doc.width() >= 1550  ) {

                var cell = $(this).find('td').first();
                var id = cell.text();

                var game = GameManager.company.gameLog.first(function(c){
                    return c.id === id;
                });

                var $match = $('body').find('#StatsModGameDetailsModalWindowOverlay');
                if ($match && $match.length > 0){
                    $match.remove();
                }

                $match = $('body').find('#StatsModGameDetailsModalWindowContainer');
                if ($match && $match.length > 0){
                    $match.remove();
                }

                $match = $('#StatsModGameDetails').find('#StatsModGameDetailsModalWindowContainer');
                if ($match && $match.length > 0){
                    $match.remove();
                }

                // Show inline with one click
                var $h = core.getGameDetailElement(game);
                var $gameDetailsModalWindowInline   = $(document.createElement('div'));

                $gameDetailsModalWindowInline.attr('id', 'StatsModGameDetailsModalWindowContainer');
                $gameDetailsModalWindowInline.width(560).height(480);
                // $gameDetailsModalWindowInline.css('border','1px dashed #cccccc');
                // $gameDetailsModalWindowInline.css('-webkit-box-shadow','0 0 5px#888');
                // $gameDetailsModalWindowInline.css('box-shadow','0 0 5px #888');

                $gameDetailsModalWindowInline.append($h);
                $('#StatsModGameDetails').append($gameDetailsModalWindowInline);
                $gameDetailsModalWindowInline.stop().fadeIn('slow');

                $( "#gamedetails-tabs" ).tabs({
                    select: function(event, ui){
                        // Index of the selected tab
                        m.selectedTabIndex = ui.index; // event.options.selected;
                        $("#InfoStatsModGameSalesWeeklyFlotGraphTooltip").hide();
                    },
                    selected: m.selectedTabIndex
                });

                // Prepare the tabs widget
                var doc                 = $(document);
                var docWidth            = doc.width();
                var docHeight           = doc.height();
                var modalWindowWidth    = parseInt(docWidth * 0.9);
                var modalWindowHeight   = parseInt(docHeight * 0.9);
                var wrapperHeight       = modalWindowHeight - 10;
                var tableHeight         = wrapperHeight     - 120;
                var wrapperWidth        = modalWindowWidth  - 10;
                var tableWidth          = wrapperWidth      - 60;

                $( "#gamedetails-tabs" ).height(tableHeight - 246);
                // $( "#gamedetails-tabs" ).css('overflow','auto');

                // auto-select proper tab (i.e. the last clicked tab)
                $('#gamedetails-tabs-' + (m.selectedTabIndex+1)).click();

                // Crate the engine specs data list
                m.createEngineSpecsDataList();

            }


        };

        // Event handler for ROW DoubleClicked
        m.tableRowDblClickedHandler = function() {
            var cell = $(this).find('td').first();
            var id = cell.text();

            var game = GameManager.company.gameLog.first(function(c){
                return c.id === id;
            });


            var doc     = $(document);

            if ( doc.width() >= 1550  ) {
                // Game details on Double Click only when Resolution is less than 1550px width
                return;
            }
            else {
                m.showGameDetailAsWindow(game);
            }
        };

        m.showGameDetailAsWindow = function(game, pause){
            var doc     = $(window);

            if(pause && pause == true){
                if(!GameManager.isPaused()){
                    GameManager.togglePause();
                }
            }

            var $match = $('body').find('#StatsModGameDetailsModalWindowOverlay');
            if ($match && $match.length > 0){
                $match.remove();
            }

            $match = $('body').find('#StatsModGameDetailsModalWindowContainer');
            if ($match && $match.length > 0){
                $match.remove();
            }

            $match = $('#StatsModGameDetails').find('#StatsModGameDetailsModalWindowContainer');
            if ($match && $match.length > 0){
                $match.remove();
            }

            var docWidth            = doc.width();
            var docHeight           = doc.height();


            var modalWindowWidth    = parseInt(docWidth * 0.9);
            var modalWindowHeight   = parseInt(docHeight * 0.9);
            var wrapperHeight       = modalWindowHeight - 10;
            var tableHeight         = wrapperHeight     - 130;
            var wrapperWidth        = modalWindowWidth  - 10;
            var tableWidth          = wrapperWidth      - 60;

            var centerX = (docWidth / 2)  - 320;
            var centerY = (docHeight / 2) - (modalWindowHeight/2);

            var $h = core.getGameDetailElement(game);
            var $gameDetailsModalWindowOverlay   = $(document.createElement('div'));

            $gameDetailsModalWindowOverlay.attr('id', 'StatsModGameDetailsModalWindowOverlay');
            $gameDetailsModalWindowOverlay.width('100%').height('100%');

            var $gameDetailsModalWindowContainer = core.Utils.createModalWindowAsDivElement('StatsModGameDetailsModalWindowContainer',640,modalWindowHeight,function(){
                $gameDetailsModalWindowOverlay.hide();

                if(pause && pause == true){
                    if(GameManager.isPaused()){
                        GameManager.togglePause();
                    }
                }
            });

            $gameDetailsModalWindowOverlay.css('zIndex','9010');
            $gameDetailsModalWindowOverlay.css('background-color','black');
            $gameDetailsModalWindowOverlay.css('opacity','0.5');
            $gameDetailsModalWindowOverlay.css('position','absolute');
            $gameDetailsModalWindowOverlay.css('top',0);
            $gameDetailsModalWindowOverlay.css('left',0);

            $gameDetailsModalWindowContainer.css('zIndex','9015');
            $gameDetailsModalWindowContainer.css('border','2px solid #cccccc');
            $gameDetailsModalWindowContainer.css('-webkit-box-shadow','0 0 5px#888');
            $gameDetailsModalWindowContainer.css('box-shadow','0 0 5px #888');
            $gameDetailsModalWindowContainer.css('background-color','white');
            $gameDetailsModalWindowContainer.css('font-size','11px');

            $gameDetailsModalWindowContainer.css('top',centerY);
            $gameDetailsModalWindowContainer.css('left',centerX);
            $gameDetailsModalWindowContainer.css('position','absolute');

            $gameDetailsModalWindowContainer.append($h);

            $('body').append($gameDetailsModalWindowOverlay);
            $('body').append($gameDetailsModalWindowContainer);
            $gameDetailsModalWindowOverlay.stop().fadeIn('slow');
            $gameDetailsModalWindowContainer.stop().fadeIn('slow');

            $( "#gamedetails-tabs" ).tabs({
                select: function(event, ui){
                    // Index of the selected tab
                    m.selectedTabIndex = ui.index; // event.options.selected;
                    $("#InfoStatsModGameSalesWeeklyFlotGraphTooltip").hide();
                },
                selected: m.selectedTabIndex
            });


            $( "#gamedetails-tabs" ).height(tableHeight - 180);
            // $( "#gamedetails-tabs" ).css('overflow','auto');

            // auto-select proper tab (i.e. the last clicked tab)
            $('#gamedetails-tabs-' + (m.selectedTabIndex+1)).click();

            // Crate the engine specs data list
            m.createEngineSpecsDataList();
        };

        // Event handler for CELL Clicked
        m.tableCellClickedHandler = function() {
            var id = $(this).text();

            // --> alert("Cell Clicked: " + id);
        };

        // Event handler for CELL Double Clicked
        m.tableCellDblClickedHandler = function() {
            var id = $(this).text();

            // --> alert("Cell Double Clicked: " + id);
        };

        m.createEngineSpecsDataList = function(){
            var columns = m.getEngineSpecsDataListColumns();
            var colWidths = [];
            var colAligns = [];
            var colTypes  = [];

            $.each(columns, function(i, v){
                    if (v.visible == true){
                        colWidths.push(v.width);
                        colAligns.push(v.align);
                        colTypes.push(v.type);
                    }
            });

            var doc                 = $(document);
            var docWidth            = doc.width();
            var docHeight           = doc.height();
            var modalWindowWidth    = core.ModalWindowApi.getWidth();
            var modalWindowHeight   = docHeight * 0.8; //core.ModalWindowApi.getHeight();
            var wrapperHeight       = modalWindowHeight - 10;
            var tableHeight         = wrapperHeight     - 420;
            var wrapperWidth        = modalWindowWidth  - 10;
            var tableWidth          = wrapperWidth      - 60;

            if (docWidth >= 1550){
                tableHeight         = wrapperHeight - 400;
            }
            else {
                tableHeight         = wrapperHeight     - 380;
            }

            $('#InfoStatsModShowReleasedGamesEngineSpecsContainer').datalist({
                    caption                 : '',
                    colWidths               : colWidths,
                    height                  : tableHeight,
                    width                   : 500,
                    useAlternateRowStyle    : true,
                    alternateRowStyleClass  : 'statsmod-ui-state-active',
                    sortable                : true,
                    sortedColIndex          : null,
                    enableColResize         : false,
                    usePagination           : false,
                    rowsPerPage             : 100,
                    sortTypes               : colTypes,
                    dateFormat              : 'Y-m-d',
                    minColWidth             : 50,
                    minWidthAuto            : false,
                    minWidth                : 50,
                    minHeight               : tableHeight,
                    addTitles               : true,
                    cellAlignments          : colAligns,
                    headAlignments          : colAligns
            });

        };

        // Shows the released game view
        m.showReleasedGames = function() {
            var dataList = m.getDataListContainerElement();
            core.ModalWindowApi.open(dataList.html());

            if(GameManager.company.gameLog.length > 0)
            {

                var doc                 = $(document);
                var docWidth            = doc.width();
                var docHeight           = doc.height();
                var modalWindowWidth    = parseInt(docWidth * 0.9);
                var modalWindowHeight   = parseInt(docHeight * 0.9);
                var wrapperHeight       = modalWindowHeight - 10;
                var tableHeight         = wrapperHeight     - 120;
                var wrapperWidth        = modalWindowWidth  - 10;
                var tableWidth          = wrapperWidth      - 60;

                if (docWidth >= 1550){
                }
                else {

                }

                core.ModalWindowApi.resize("90%", '90%');

                var columns = m.getDataListColumns();
                var colWidths = [];
                var colAligns = [];
                var colTypes  = [];

                $.each(columns, function(i, v){
                                    if (v.visible == true){
                                        colWidths.push(v.width);
                                        colAligns.push(v.align);
                                        colTypes.push(v.type);
                                    }
                });

                $('#StatsModModalWindowWrapper').height(wrapperHeight);
                $('#StatsModShowReleaseGamesContainer').datalist({
                        caption                 : '',
                        colWidths               : colWidths,
                        height                  : tableHeight,
                        width                   : docWidth >= 1550 ? 840 : tableWidth,
                        useAlternateRowStyle    : true,
                        alternateRowStyleClass  : 'statsmod-ui-state-active',
                        sortable                : true,
                        sortedColIndex          : null,
                        enableColResize         : false,
                        usePagination           : true,
                        rowsPerPage             : 100,
                        sortTypes               : colTypes,
                        dateFormat              : 'Y-m-d',
                        minColWidth             : 50,
                        minWidthAuto            : false,
                        minWidth                : 50,
                        minHeight               : 450,
                        addTitles               : true,
                        cellAlignments          : colAligns,
                        headAlignments          : colAligns,
                        onRowClick              : m.tableRowClickedHandler,
                        onRowDblClick           : m.tableRowDblClickedHandler,
                        onCellClick             : m.tableCellClickedHandler,
                        onCellDblClick          : m.tableCellDblClickedHandler
                });
            }
            else {
                core.ModalWindowApi.resize("640px","100px");
            }

        };

        m.createDataListColumn = function(name, type, width, align, visible){
            return {
                    name: name,
                    visible: visible,
                    align: align,
                    width: width,
                    type: type
                   };
        };

        m.getDataListColumns = function() {
            // Check if there is data stored
            var config = core.Config.loadReleasedGamesConfig();
            if (config != null){
                return config;
            }

            return [{name:'Id', type:'string', width:0, align:'left', visible:true},
                    {name:'Title', type:'string', width:300, align:'left', visible:true},
                    {name:'Size', type:'string', width:80, align:'center', visible:true},
                    {name:'Score', type:'float', width:50, align:'right', visible:true},
                    {name:'DP', type:'integer', width:50, align:'right', visible:true},
                    {name:'TP', type:'integer', width:50, align:'right', visible:true},
                    {name:'Engine', type:'string', width:100, align:'left', visible:true},
                    {name:'Units', type:'integer', width:80, align:'right', visible:true},
                    {name:'Price', type:'integer', width:40, align:'right', visible:true},
                    {name:'Income', type:'integer', width:90, align:'right', visible:true},
                    // --> {name:'Total Income', type:'integer', width:90, align:'right', visible:true},
                    {name:'Costs', type:'integer', width:90, align:'right', visible:true},
                    {name:'Profit', type:'integer', width:90, align:'right', visible:true},
                    {name:'Profit Margin', type:'float', width:90, align:'right', visible:true},
                    // --> {name:'Total Profit', type:'integer', width:90, align:'right', visible:true},
                    {name:'Fans', type:'integer', width:90, align:'right', visible:true},
                    {name:'Hype', type:'integer', width:40, align:'right', visible:true},
                    {name:'Rank', type:'integer', width:40, align:'right', visible:true},
                    {name:'Release Date', type:'date', width:90, align:'center', visible:true},
                    {name:'Sequel', type:'string', width:300, align:'left', visible:true},
                    {name:'Topic', type:'string', width:100, align:'left', visible:true},
                    {name:'Genre', type:'string', width:100, align:'left', visible:true},
                    {name:'Audience', type:'string', width:100, align:'left', visible:true},
                    {name:'Publisher', type:'string', width:100, align:'left', visible:true},
                    {name:'Q', type:'float', width:50, align:'right', visible:true}
                   ];
        };

        m.getEngineSpecsDataListColumns = function() {
            return [{name:'Feature', type:'string', width:150, align:'left', visible:true},
                    {name:'Factor', type:'integer', width:50, align:'right', visible:true},
                    {name:'Category', type:'string', width:150, align:'left', visible:true}
                   ];
        };

        m.getDataListValueByColumn = function(game, col) {
            function preFillNumberWithZeros(a) {
                return 10 > a ? "0" + a : a
            };

            switch(col){
                case 'Id':
                return game.id;

                case 'Title':
                return game.title;

                case 'Size':
                return core.Utils.toTitleCase(game.gameSize);

                case 'Score':
                // return core.Utils.formatMoney(parseFloat(game.score), 4, ',', '.');
                return core.Utils.formatMoney(game.reviews.average(function (a) {
                            return a.score
                        }), 2,".",".");

                case 'DP':
                return game.designPoints;

                case 'TP':
                return game.technologyPoints;

                case 'Engine':
                return game.engine ? game.engine.name : '[none]';

                case 'Units':
                return core.Utils.formatMoney(parseInt(game.unitsSold), 0, '.', '.');

                case 'Price':
                return game.unitPrice;

                case 'Total Income':
                return core.Utils.formatMoney(game.totalSalesCash, 0,".",".");

                case 'Income':
                return core.Utils.formatMoney(game.revenue, 0,".",".");

                case 'Costs':
                return core.Utils.formatMoney(game.costs, 0,".",".");

                case 'Total Profit':
                return core.Utils.formatMoney(game.totalSalesCash - game.costs, 0, ".", ".");

                case 'Profit':
                return core.Utils.formatMoney(game.revenue - game.costs, 0, ".", ".");

                case 'Profit Margin':
                return ( ((game.revenue - game.costs) / game.revenue)*100 ).toFixed(2) + '%';

                case 'Hype':
                return core.Utils.formatMoney(game.hypePoints, 0, ",",".");

                case 'Publisher':
//                var sss = "Id: ";
//                    sss += game.featureLog[0].id;
//                    sss += ", Type: ";
//                    sss += game.featureLog[0].type;
//                    sss += ", MissionType: ";
//                    sss += game.featureLog[0].missionType;
//                    sss += ", LastUpdate: ";
//                    sss += game.featureLog[0].lastUpdate;
//                    sss += ", Duration: ";
//                    sss += game.featureLog[0].duration;
//
//                $.each(ProjectContracts.getAllContracts(), function (i, a) {
//                    if ( a.id == "publisherContracts"){
//                        // core.Utils.printObjectMemberNamesAsAlert(a);
//                        try{
//                            var contract = a.getContract(GameManager.company);
//                            $.each(contract, function(j,b){
//                                // alert(b.refNumber +  " -- " + game.id);
//                                // core.Utils.printObjectMemberNamesAsAlert(b);
//                            });
//                        }
//                        catch(err){
//                            alert(err.message);
//                        }
//
//                    }
//                });
                // core.Utils.printObjectMemberNamesAsAlert(GameManager.company.flags.contractspublisher);
                return '';

                return core.Utils.formatMoney(game.hypePoints, 0, ",",".");

                case 'Fans':
                return core.Utils.formatMoney(Math.floor(game.fansChangeTarget), 0, ",", ".");

                case 'Sequel':

                var sequelGameId = game.sequelTo;
                if (sequelGameId){
                    var sequelGame = GameManager.company.getGameById(game.sequelTo);
                    if (sequelGame && sequelGame.id != game.id){
                        return sequelGame.title;
                    }
                }

                return '[none]';

                case 'Rank':
                return game.topSalesRank < 0 || game.topSalesRank > 100 ? 0 : game.topSalesRank;

                case 'Release Date':
                return core.Utils.getRealDateAsIsoDate(game.releaseWeek);

                case 'Topic':
                return core.Utils.getTopicName(game);

                case 'Genre':
                return core.Utils.getGenreName(game);

                case 'Audience':
                return core.Utils.toTitleCase(game.targetAudience);

                case 'Q':
                return isNaN(core.Utils.getGameQuality(game).quality) ? 0 : core.Utils.getGameQuality(game).quality;

            }

            return '';
        };

        m.getEngineSpecsDataListValueByColumn = function(gameFeat, col) {
            function preFillNumberWithZeros(a) {
                return 10 > a ? "0" + a : a
            };

            switch(col){
                case 'Feature':
                return gameFeat.name;

                case 'Factor':
                return gameFeat.v;

                case 'Category':
                return gameFeat.categoryDisplayName;
            }

            return '';
        };

        // Function to create and return the data table section as HTML
        m.getDataListContainerElement = function() {
            var baseDiv = $(document.createElement('div'));
                baseDiv.css({width: '100%', height: '100%', textAlign:'center'});

            if (GameManager.company.gameLog.length < 1)
            {
                baseDiv.append('<h2>You have not released any games, yet!</h2>');
            }
            else
            {
                // Get datalist columns
                var cols = m.getDataListColumns();

                // Create a new table element that will be used for creating the data list widget
                var dataListTable = core.Utils.getNewTableElement({minHeight: '450px'}, '').attr({width:'100%', cellpadding:'0', cellspacing:'0'});

                // Create the first row that will contain the cell with the real container table of the data list widget
                var dataListTableContainerRow = core.Utils.getNewTableRowElement(null, '');

                // Create the cell for the real container table of the data list widget
                var dataListTableContainerCell = core.Utils.getNewTableCellElement({border:'1px solid #cccccc',webkitBoxShadow:'0 0 5px#888',boxShadow:'0 0 5px #888'},'').attr({width:'1', valign:'top'});

                // Create the real data list table container
                var dataListTableContainer = core.Utils.getNewTableElement(null, '').attr({id:'StatsModShowReleaseGamesContainer', width:'98%', height:'100%'});

                // Create the table head area
                var dataListTableContainerHead = core.Utils.getNewTableHeadElement(null, '');

                // Create the table head row
                var dataListTableContainerHeadRow = core.Utils.getNewTableRowElement(null, '');

                // Create and append column headers
                $.each(cols, function(index, value){
                    if (value.visible == true){
                        dataListTableContainerHeadRow.append(core.Utils.getNewTableHeaderElement(null, value.name));
                    }
                });

                var dataListTableContainerBody = core.Utils.getNewTableBodyElement(null, '');

                for(var i = 0; i < GameManager.company.gameLog.length; i++)
                {
                    var company = GameManager.company;
                    var game    = GameManager.company.gameLog[i];
                    var row     = core.Utils.getNewTableRowElement(null, '');

                    if (game.state == GameState.released && game.salesCashLog != null && game.salesCashLog.length > 0){
                        $.each(cols, function(index, value){
                            if (value.visible == true){
                                row.append(core.Utils.getNewTableCellElement(null, m.getDataListValueByColumn(game, value.name)));
                            }
                        });
                    }

                    row.appendTo(dataListTableContainerBody);
                }

                dataListTableContainerHead.append(dataListTableContainerHeadRow);
                dataListTableContainer.append(dataListTableContainerHead).append(dataListTableContainerBody);

                dataListTableContainer.appendTo(dataListTableContainerCell);
                dataListTableContainerRow.append(dataListTableContainerCell).appendTo(dataListTable);

                dataListTableContainerCell.append('<td valign="top" style="padding-left:6px"><div id="StatsModGameDetails" style="width:auto; height:auto; "></div></td>');

                baseDiv.append(dataListTable);
            }

            return baseDiv;
        }

        m.getEngineSpecsDataListContainerElement = function(game) {
            var baseDiv = $(document.createElement('div'));
                baseDiv.attr({id:'InfoStatsModEngineSpecsDataListContainerElement'}).css({width: '100%', height: '100%', textAlign:'center'});

            if (game == null || game.features == null || game.features.length < 1)
            {
                baseDiv.append('<h4>You have not used any engine for this game!</h4>');
            }
            else
            {
                if (game.engine == null){
                    baseDiv.append('<h4>You have not used any engine for this game!</h4>');
                }
                else {
                    baseDiv.append('<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td align="left" valign="bottom" width="30%"><h4 style="line-height:28px">'+game.engine.name+'</h4></td><td align="right" valign="bottom"><h6 style="line-height:28px">(Tech: '+core.Utils.formatMoney(game.engine.techLevel, 2, ",",".")+' - Costs: '+UI.getShortNumberString(game.engine.costs)+')&nbsp;&nbsp;&nbsp;</h6></td></tr></table>');
                }

                var gameFeats = game.features.groupBy(function(a){return a.category});

                // Get datalist columns
                var cols = m.getEngineSpecsDataListColumns();

                // Create a new table element that will be used for creating the data list widget
                var dataListTable = core.Utils.getNewTableElement({minHeight: '450px'}, '').attr({width:'100%', cellpadding:'0', cellspacing:'0'});

                // Create the first row that will contain the cell with the real container table of the data list widget
                var dataListTableContainerRow = core.Utils.getNewTableRowElement(null, '');

                // Create the cell for the real container table of the data list widget
                var dataListTableContainerCell = core.Utils.getNewTableCellElement(null,'').attr({width:'1', valign:'top'});

                // Create the real data list table container
                var dataListTableContainer = core.Utils.getNewTableElement(null, '').attr({id:'InfoStatsModShowReleasedGamesEngineSpecsContainer', width:'98%', height:'100%'});

                // Create the table head area
                var dataListTableContainerHead = core.Utils.getNewTableHeadElement(null, '');

                // Create the table head row
                var dataListTableContainerHeadRow = core.Utils.getNewTableRowElement(null, '');

                // Create and append column headers
                $.each(cols, function(index, value){
                    if (value.visible == true){
                        dataListTableContainerHeadRow.append(core.Utils.getNewTableHeaderElement(null, value.name));
                    }
                });

                var dataListTableContainerBody = core.Utils.getNewTableBodyElement(null, '');

                for(var i = 0; i < gameFeats.length; i++)
                {
                    var row     = core.Utils.getNewTableRowElement(null, '');

                    $.each(cols, function(index, value){
                        if (value.visible == true){
                            row.append(core.Utils.getNewTableCellElement(null, m.getEngineSpecsDataListValueByColumn(gameFeats[i], value.name)));
                        }
                    });

                    row.appendTo(dataListTableContainerBody);
                }

                dataListTableContainerHead.append(dataListTableContainerHeadRow);
                dataListTableContainer.append(dataListTableContainerHead).append(dataListTableContainerBody);

                dataListTableContainer.appendTo(dataListTableContainerCell);
                dataListTableContainerRow.append(dataListTableContainerCell).appendTo(dataListTable);

                baseDiv.append(dataListTable);
            }

            return baseDiv;
        }

        return m;
};
