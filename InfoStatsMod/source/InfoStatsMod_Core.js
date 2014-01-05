/*
* Name:                 InfoStatsMod
* Class:                InfoStatsModAbescoUG_Core   
* Description:          Core Class for the InfoStatsMod
* Copyright:            © 2013 Francesco Abbattista
* Url:                  http://www.abesco.de/
*/

var InfoStatsModAbescoUG_Core = function() {
    this.Company        = GameManager.company;
    this.ContextMenu    = UI._showContextMenu;
    this.DocumentBody   = $("body");
    
    this.Config         = new InfoStatsModAbescoUG_Config();
    this.Utils          = new InfoStatsModAbescoUG_Utils(this);
    this.ReleasedGames  = new InfoStatsModAbescoUG_ReleasedGames(this);
    this.Analysis       = new InfoStatsModAbescoUG_Analysis(this);
    this.Footer         = new InfoStatsModAbescoUG_Footer(this);
    this.Platforms      = new InfoStatsModAbescoUG_Platforms(this);
    this.Notifications  = new InfoStatsModAbescoUG_Notifications(this);
    
    this.LastBestGame      = null;
    this.AvailGameNotify   = null;
    
    // Init modal win objects
    var $modalWindowObj     = $('body').modalWindow({ zIndex: 9001, blur: false, overlay: true}, 'statsMod');
    this.ModalWindowApi     = $modalWindowObj.data('statsMod-modal_statsMod');
        
    var m = this;
    var _showContextMenuOrigFunc = UI._showContextMenu;
    
    this.setup = function() {
        // Embed custom css
        m.embedCustomCSS();
        
        // Container for an overlay: -->
        m.DocumentBody.append('<div id="InfoStatsModContainerModalOverlay" class="ow-overlay ow-closed"></div>');

        // Container for a modal window: -->
        m.DocumentBody.append('<div id="InfoStatsModContainer" class="windowBorder tallWindow" style="overflow:auto;display:none;"> <div id="InfoStatsModTop" class="windowTitle smallerWindowTitle">Information and Statistics</div>');
        m.DocumentBody = $('#'+m.Config.idContainer);
        m.DocumentBody.append('<div id="StatsModContainerLabel1" style="text-align:center;margin-left:50px;width: 450px">Released Games Analysis</div>');
        m.DocumentBody.append('<div id="statsmodshowreleasedgames" class="selectorButton whiteButton" onclick="UI.selectInfoStatsModItemClickHandler(this)" style="display:inline-block;position: relative;margin-left:50px;width: 202px;" >Release Details</div>');
        m.DocumentBody.append('<div id="statsmodconfigreleasedgames" class="selectorButton whiteButton" onclick="UI.selectInfoStatsModItemClickHandler(this)" style="display:inline-block;position: relative;margin-left:50px;width: 202px;" >Config</div>');
        
        m.DocumentBody.append('<div id="StatsModContainerLabel2" style="text-align:center;margin-left:50px;width: 450px">Platform Analysis</div>');
        m.DocumentBody.append('<div id="statsmodshowplatforms" class="selectorButton whiteButton" onclick="UI.selectInfoStatsModItemClickHandler(this)" style="display:inline-block;position: relative;margin-left:50px;width: 202px;" >Platform Details</div>');
        m.DocumentBody.append('<div id="statsmodconfigplatforms" class="selectorButton whiteButton" onclick="UI.selectInfoStatsModItemClickHandler(this)" style="display:inline-block;position: relative;margin-left:50px;width: 202px;" >Config</div>');

        // --> Disable on releases
        // --> m.DocumentBody.append('<div id="" class="selectorButton whiteButton" onclick="UI.selectInfoStatsModItemClickHandler(this)" style="display:inline-block;position: relative;margin-left:50px;width: 202px;" >Sales Analysis</div>');

        m.DocumentBody.append('<div id="StatsModContainerLabel3" style="text-align:center;margin-left:50px;width: 450px">Miscellaneous</div>');
        m.DocumentBody.append('<div id="statsmodtogglefooter" class="selectorButton whiteButton" onclick="UI.selectInfoStatsModItemClickHandler(this)" style="display:inline-block;position: relative;margin-left:50px;width: 202px;" >Toggle Footer</div>');
        m.DocumentBody.append('<div id="statsmodnotifications" class="selectorButton whiteButton" onclick="UI.selectInfoStatsModItemClickHandler(this)" style="display:inline-block;position: relative;margin-left:50px;width: 202px;" >Notifications</div>');

        m.DocumentBody.append('<div id="StatsModContainerLabel4" style="text-align:center;margin-left:50px;width: 450px">Debug</div>');
        m.DocumentBody.append('<div id="statsmodtogglepause" class="selectorButton whiteButton" onclick="UI.selectInfoStatsModItemClickHandler(this)" style="display:inline-block;position: relative;margin-left:50px;width: 202px;" >Toggle Pause</div>');
        m.DocumentBody.append('<div id="statsmodresetsettings" class="selectorButton whiteButton" onclick="UI.selectInfoStatsModItemClickHandler(this)" style="display:inline-block;position: relative;margin-left:50px;width: 202px;" >Reset Configs</div>');

        m.DocumentBody.append('<div id="StatsModContainerLabel5" style="text-align:center;margin-left:50px;width: 450px"><br><br>InfoStatsMod Version '+InfoStatsModAbescoUG.VERSION+'</div>');

        m.DocumentBody.append('<div id="infostatmod-common-dialog" title="InfoStatsMod">');
        m.DocumentBody.append('</div>');

        
        m.Footer.setup();
        m.Footer.setContent("InfoStatsMod Expansion - Version "+InfoStatsModAbescoUG.VERSION +" - Written and developed by Francesco Abbattista - (c) 2013 Francesco Abbattista");
        m.Footer.show();

        $( "#infostatsmod-common-dialog" ).dialog();
        $( "#infostatsmod-common-dialog" ).hide();

        // Attach events of interest
        // GDT.on(GDT.eventKeys.ui.dialogOpen, dialogOpen);
        // GDT.on(GDT.eventKeys.ui.dialogClose, dialogClose);
        // GDT.on(GDT.eventKeys.ui.contextMenuShowing, contextMenuShowing);
        // GDT.on(GDT.eventKeys.ui.beforeShowingNotification, contextMenuBeforeShow);
        GDT.on(GDT.eventKeys.gameplay.weekProceeded, m.weekProceeded);
          
    };    

          
     /* Event Handlers */
    this.weekProceeded = function(e) {
        try {
        
            
            var config = m.Config.loadNotifications();
            var showBestGameNotifications = config != null ? config.showBestGameNotifications : null;
            var showReleaseDetailAvailableNotifications  = config != null ? config.showReleaseDetailAvailableNotifications : null; 
            
            if (showBestGameNotifications == null){
                showBestGameNotifications = true;
            }
            
            if (showReleaseDetailAvailableNotifications == null){
                showReleaseDetailAvailableNotifications = true;
            }

            var bestGame = m.getBestGame();
            var lastGame = GameManager.company.gameLog.last();
            
            /*
            if ( m.AvailGameNotify != null){
                if ( m.AvailGameNotify.salesCashLog != null && m.AvailGameNotify.salesCashLog.length > 0){
                    if ( showReleaseDetailAvailableNotifications ) {    
                        GameManager.company.notifications.push(m.Notifications.getReleaseDetailsAvailNotification());
                    }
                
                    m.AvailGameNotify = null;
                }
            }
            */
            
            /*
            if ( GameManager.company.currentGame && GameManager.company.currentGame.salesCashLog != null && GameManager.company.currentGame.salesCashLog.length > 0 ){
                m.AvailGameNotify = GameManager.company.currentGame;
            }
            */

            if (m.Utils.isDefined(bestGame.game)){
                // We have a best game, check if it's different than our last best game

                if (!m.Utils.isDefined(m.LastBestGame) || (m.LastBestGame != bestGame.game) && bestGame.game == lastGame){
                    // Now we know it's a released and reviewed game since getBestGame already filters it!
                    var anotherRecord = m.Utils.isDefined(m.LastBestGame) && m.LastBestGame.game.id == bestGame.game.id;
                    
                    m.LastBestGame = bestGame;
                    
                    // If we want to show Best Game Notification, we do it here by pushing a notification into pipeline
                    if ( showBestGameNotifications ) {    
                        // We need to check if this game has been already nominated as best game
                        if(!anotherRecord){
                            GameManager.company.notifications.push(m.Notifications.getBestGameNotification());
                        }
                        else {
                            GameManager.company.notifications.push(m.Notifications.getBestGameBreaksRecordsNotification());
                        }
                    }
                }
                
            }

            // Update the footer overlay
            m.Footer.updateContent(e.company);
                        
        }
        catch(e) {
            
        }
        finally {
            
        }
        
    };
        
    // Function to embed custom css by dynamically changing the <HEAD></HEAD> block
    m.embedCustomCSS = function(){
        var $ = document; // shortcut
        var cssId = 'StatsModCSSAbescoUG';  
        if (!$.getElementById(cssId))
        {
            var head  = $.getElementsByTagName('head')[0];
            {
                var link  = $.createElement('link');
                link.id   = cssId;
                link.rel  = 'stylesheet';
                link.type = 'text/css';
                link.href = 'mods/InfoStatsMod/libs/modal/modal.css';
                link.media = 'all';
                head.appendChild(link);
            }
            {
                var link  = $.createElement('link');
                link.id   = cssId;
                link.rel  = 'stylesheet';
                link.type = 'text/css';
                link.href = 'mods/InfoStatsMod/libs/data-list/base.css';
                link.media = 'all';
                head.appendChild(link);
            }
            {
                var link  = $.createElement('link');
                link.id   = cssId;
                link.rel  = 'stylesheet';
                link.type = 'text/css';
                link.href = 'mods/InfoStatsMod/libs/charts/charts.css';
                link.media = 'all';
                head.appendChild(link);
            }
            {
                var link  = $.createElement('link');
                link.id   = cssId;
                link.rel  = 'stylesheet';
                link.type = 'text/css';
                link.href = 'mods/InfoStatsMod/libs/misc/footer.css';
                link.media = 'all';
                head.appendChild(link);
            }
            {
                var link  = $.createElement('link');
                link.id   = cssId;
                link.rel  = 'stylesheet';
                link.type = 'text/css';
                link.href = 'mods/InfoStatsMod/libs/image-picker/image-picker.css';
                link.media = 'all';
                head.appendChild(link);
            }            
            {
                var link  = $.createElement('link');
                link.id   = cssId;
                link.rel  = 'stylesheet';
                link.type = 'text/css';
                link.href = 'mods/InfoStatsMod/libs/flot/flot.css';
                link.media = 'all';
                head.appendChild(link);
            }
        }
    }
   
    m.getGameDetailElement = function (game) {
                       
        var releaseDate         = GameManager.company.getDate(game.releaseWeek);
        var gameTitle           = game.title;
        var gameId              = game.id;
        var gameTopic           = m.Utils.getDetailedTopicName(game);
        var gameGenre           = game.getGenreDisplayName();
        
        var gameCosts           = UI.getShortNumberString(game.costs);
        var gameAudience        = GameManager.company.researchCompleted.indexOf(Research.TargetAudience) != -1 ? General.getAudienceLabel(game.targetAudience) : "";
        var gameReleaseWeek     = game.releaseWeek > GameManager.company.currentWeek ? "Coming soon..." : releaseDate.year + "-" + releaseDate.month + "-" + releaseDate.week;                   
        var gameRevenue         = game.revenue > 0 ? UI.getShortNumberString(game.revenue) : 0;
        var gameProfit          = game.revenue - game.costs;
        var isLoss              = gameProfit < 0;
        var gameFans            = UI.getLongNumberString(Math.max(0, Math.round(game.fansChanged)));
        var gameTopSalesRank    = game.topSalesRank > 0 ? game.topSalesRank : "100+";
        var gameUnitsSold       = UI.getShortNumberString(game.unitsSold);
        var gameIsExtensionPack = game.flags.isExtensionPack;
        
        var averageScore = game.reviews.average(function (a) { return a.score });
           
        $(document).find('#statsMod-GameDetails-container').remove();
        
        var $div            = $(document.createElement('div')).attr('id','statsMod-GameDetails-container');
        var $divPlatforms   = $(document.createElement('div')).attr('id','statsMod-GameDetails-platforms');
        var $title          = $(document.createElement('h3')).css('text-align','center');
        var $genre          = $(document.createElement('h5')).css('text-align','center');
        var $ratingTotal    = $(document.createElement('h5')).css('text-align','center').append(m.Utils.getRatingStarsAsDivElement(averageScore, true, 1));
        
        $div.css('border','1px solid #cccccc').css('-webkit-box-shadow','0 0 5px#888').css('box-shadow','0 0 5px #888'); 
        
        $title.text(gameTitle);
        $genre.text(gameGenre);
        
        // Acquire the platforms
        $divPlatforms.append(m.Utils.getGamePlatformImagesAsDivElement(game));
        
        // Acquire every rating obtained by magazines, acquire engine specs
        var $tableMagazines     = m.getMagazineReviewsAsTableElement(game);
        
        var $tableEngineSpecs   = m.ReleasedGames.getEngineSpecsDataListContainerElement(game);
        var $tableSales         = m.getGameSalesDetailsAsTableElement(game);
       
        // Pre-Create the details div (header, platforms, info & rating area)
        $div.append($title).append($genre).append($ratingTotal).append($divPlatforms);

        // Create TABS in Details Window Div
        $div.append(m.getGameDetailsTabs());
        
        // Process REVIEWS TAB (tab #1)
        var $gamedetailsTab1 = $div.find('#gamedetails-tabs-1');
            $gamedetailsTab1.append($tableMagazines);
        
        // Process ENGINE SPECS TAB (tab #2)
        var $gamedetailsTab2 = $div.find('#gamedetails-tabs-2');
            $gamedetailsTab2.append($tableEngineSpecs);
        
        // Process SALES ANALYSIS TAB (tab #3)
        var $gamedetailsTab3 = $div.find('#gamedetails-tabs-3');
        var $divSalesWeekly = $(document.createElement('div'));
            $divSalesWeekly.css('width','100%');

            $gamedetailsTab3.append($tableSales).append($divSalesWeekly);
            
                      
        var weeklySalesObj =  m.getGameSalesWeeklyAsDivElement(game);
        var $divPlaceholder = weeklySalesObj[0];
        var weeklySalesData = weeklySalesObj[1];
        
        $divPlaceholder.appendTo($divSalesWeekly);
        
        var plot = $.plot($divPlaceholder,[ weeklySalesData ],
            { 
                    lines:  { show: true, fill: true },
                    points: { show: true, fillColor: 'yellow'},
                    xaxis:  { tickSize: 1, 
                              tickFormatter: function(val, axis) {
                                return parseInt(val);
                              }
                            },
                    yaxis:  { position: 'left',
                               tickFormatter: function(val, axis) {
                                    return UI.getShortNumberString(val);
                               }
                             },
                    grid:   { show: true, hoverable: true, clickable: true }

                    /*
                    lines:  { show: true, fill: true },
                    points: { show: true, fillColor: 'yellow'},
                    xaxis:  { tickSize: 1, zoomRange: [0.1, 10], panRange: [-10, 10]},
                    yaxis:  { zoomRange: [0.1, 10], panRange: [-10, 10] },
                    grid:   { show: true, hoverable: true, clickable: true },
                    zoom:   { interactive: true },
                    pan:    { interactive: true }
                    */
                
            });
                
        $divPlaceholder.bind("plothover", function (event, pos, item) {

            if (item) {
                var x = parseInt(item.datapoint[0].toFixed(2)),
                    y = UI.getShortNumberString(item.datapoint[1].toFixed(2));

                $("#InfoStatsModGameSalesWeeklyFlotGraphTooltip").html("Week " + x + " = " + y)
                    .css({top: item.pageY+5, left: item.pageX+5})
                    .fadeIn(200);
            } else {
                $("#InfoStatsModGameSalesWeeklyFlotGraphTooltip").hide();
            }
        });
                

        return $div;
    };
    
    m.getGameDetailsTabs = function() {
        var retHtml = '';
        
        $.ajax({
                url: "./mods/InfoStatsMod/html/gamedetails-tabs.html",
                async: false 
            }).done(function(data) {
                retHtml = data;
            });


        return retHtml;
    }
        
    m.getMagazineReviewsAsTableElement = function(game) {
        var averageScore = game.reviews.average(function (a) { return a.score });

        // Show every rating obtained by magazines
        var $tableMagazines     = $(document.createElement('table')).attr('width','100%');
        var $tableBodyMagazines = $(document.createElement('tbody'));

        var $tableRowHeader     = $(document.createElement('tr'));
        var $tableCellHeader    = $(document.createElement('td')).attr('colspan', '3');
           
        $tableRowHeader.append($tableCellHeader);
        $tableBodyMagazines.append($tableRowHeader);
        
        for (var i = 0; i < game.reviews.length; i++)
        {
           var $tableRowMagazines   = $(document.createElement('tr'));
           var $tableCell1Magazines = $(document.createElement('td')).attr('valign','top').attr('width', '90');
           var $tableCell2Magazines = $(document.createElement('td')).attr('valign','top').attr('width', '100');
           var $tableCell3Magazines = $(document.createElement('td')).attr('valign','top').attr('width', '10');
           var $tableCell4Magazines = $(document.createElement('td'));

           $tableCell1Magazines.text(game.reviews[i].reviewerName);
           $tableCell2Magazines.append(m.Utils.getRatingStarsAsDivElement(game.reviews[i].score, false, 0.6));
           $tableCell3Magazines.text(game.reviews[i].score);
           $tableCell4Magazines.text(game.reviews[i].message);

           $tableRowMagazines.append($tableCell1Magazines).append($tableCell2Magazines).append($tableCell3Magazines).append($tableCell4Magazines);
           $tableBodyMagazines.append($tableRowMagazines);
        }
        
        $tableMagazines.append($tableBodyMagazines);
        
        return $tableMagazines;
    };
    
    m.getGameSalesDetailsAsTableElement = function(game) {
        var $tableSales     = $(document.createElement('table')).attr('width','100%');
        var $tableBodySales = $(document.createElement('tbody'));

        var $tableRowHeader     = $(document.createElement('tr'));
        var $tableCellHeader    = $(document.createElement('td')).attr('colspan', '3');
        
        $tableRowHeader.append($tableCellHeader);
        $tableBodySales.append($tableRowHeader);
        

        var $tableRow_1        = $(document.createElement('tr'));
        var $tableRow_1_Cell_1 = $(document.createElement('td')).attr({valign:'top', width:90});
        var $tableRow_1_Cell_2 = $(document.createElement('td')).attr({valign:'top', width:90});
        var $tableRow_1_Cell_3 = $(document.createElement('td')).attr({valign:'top', width:90});
        var $tableRow_1_Cell_4 = $(document.createElement('td')).attr({valign:'top', width:90});
        var $tableRow_1_Cell_5 = $(document.createElement('td')).attr({valign:'top', width:90});
        var $tableRow_1_Cell_6 = $(document.createElement('td')).attr({valign:'top'});

        $tableRow_1_Cell_1.text('Income');
        $tableRow_1_Cell_2.text(UI.getShortNumberString(game.revenue));
        // --> $tableRow_1_Cell_3.text('Total Income');
        // --> $tableRow_1_Cell_4.text(UI.getShortNumberString(game.totalSalesCash));

        $tableRow_1.append($tableRow_1_Cell_1, $tableRow_1_Cell_2, $tableRow_1_Cell_3, $tableRow_1_Cell_4, $tableRow_1_Cell_5, $tableRow_1_Cell_6);
        
        var $tableRow_2        = $(document.createElement('tr'));
        var $tableRow_2_Cell_1 = $(document.createElement('td')).attr({valign:'top', width:90});
        var $tableRow_2_Cell_2 = $(document.createElement('td')).attr({valign:'top', width:90});
        var $tableRow_2_Cell_3 = $(document.createElement('td')).attr({valign:'top', width:90});
        var $tableRow_2_Cell_4 = $(document.createElement('td')).attr({valign:'top', width:90});
        var $tableRow_2_Cell_5 = $(document.createElement('td')).attr({valign:'top', width:90});
        var $tableRow_2_Cell_6 = $(document.createElement('td')).attr({valign:'top'})

        $tableRow_2_Cell_1.text('Costs');
        $tableRow_2_Cell_2.text(UI.getShortNumberString(game.costs));
        $tableRow_2_Cell_3.text();

        $tableRow_2.append($tableRow_2_Cell_1, $tableRow_2_Cell_2, $tableRow_2_Cell_3, $tableRow_2_Cell_4, $tableRow_2_Cell_5, $tableRow_2_Cell_6);

        var $tableRow_3        = $(document.createElement('tr'));
        var $tableRow_3_Cell_1 = $(document.createElement('td')).attr({valign:'top', width:90});
        var $tableRow_3_Cell_2 = $(document.createElement('td')).attr({valign:'top', width:90});
        var $tableRow_3_Cell_3 = $(document.createElement('td')).attr({valign:'top', width:90});
        var $tableRow_3_Cell_4 = $(document.createElement('td')).attr({valign:'top', width:90});
        var $tableRow_3_Cell_5 = $(document.createElement('td')).attr({valign:'top', width:90});
        var $tableRow_3_Cell_6 = $(document.createElement('td')).attr({valign:'top'})

        $tableRow_3_Cell_1.text('Profit');
        $tableRow_3_Cell_2.text(UI.getShortNumberString(game.revenue - game.costs));
        // --> $tableRow_3_Cell_3.text('Total Profit');
        // --> $tableRow_3_Cell_4.text(UI.getShortNumberString(game.totalSalesCash - game.costs));

        
        $tableRow_3.append($tableRow_3_Cell_1, $tableRow_3_Cell_2, $tableRow_3_Cell_3, $tableRow_3_Cell_4, $tableRow_3_Cell_5, $tableRow_3_Cell_6);
        
        $tableBodySales.append($tableRow_1).append($tableRow_2).append($tableRow_3);
        
        $tableSales.append($tableBodySales);
        
        return $tableSales;  
    };
    
    m.getGameSalesWeeklyAsDivElement = function (game) {
        var releaseWeek     = 1;
        var releaseWeekReal = game.releaseWeek;
        var log             = game.salesCashLog;
       
        var $divPlaceholder = $(document.createElement('div'));
            $divPlaceholder.attr('id', 'InfoStatsModGameSalesWeeklyFlotGraphPlaceholder');
            $divPlaceholder.css('position','relative').css('width','500px').css('height','160px');
        
        var data = [];
        
        for(var i = 0; i < log.length; i++)
        {
            data.push([releaseWeek, log[i]]);
            releaseWeek++;
        }   
      
        $('body').find('#InfoStatsModGameSalesWeeklyFlotGraphTooltip').remove();
        
        var $divTooltip = $(document.createElement('div'));
        $divTooltip.attr('id','InfoStatsModGameSalesWeeklyFlotGraphTooltip').css({
            position: "absolute",
            display: "none",
            border: "1px solid #333333",
            padding: "2px",
            "background-color": "#2222ff",
            "color": "#ffffff",
            opacity: 0.80,
            zIndex: 9100,
        }).appendTo("body");

        
        return [$divPlaceholder, data];
                
    };

    this.getTotalRevenues = function() {
        var games = GameManager.company.gameLog;
        if (games == null || games.length < 1){
            return 0;
        }
        
        var value = 0;
        for(var i = 0; i < games.length; i++){
            value += parseInt(games[i].revenue);
        }
           
        return value;           
    };
    
    this.getTotalProfit = function() {
        return m.getTotalRevenues() - m.getTotalCosts();
    };
    
    this.getTotalCosts = function() {
        var games = GameManager.company.gameLog;
        if (games == null || games.length < 1){
            return 0;
        }
        
        var value = 0;
        for(var i = 0; i < games.length; i++){
            value += parseInt(games[i].costs);
        }
           
        return value;
    };
    
    this.getGamesWithHighestScore = function() {
        var games = GameManager.company.gameLog;
        if (games == null || games.length < 1){
            return 0;
        }  
        
        var values   = [];
        var value    = null;
        for(var i = 0; i < games.length; i++){
            if(value == null || games[i].score >= value.score){
                values.push(games[i]);
            }
        }
        
        return values;       
    };
    
    this.getBestGame = function() {
        var games   = m.getGamesWithHighestScore();
        if ( games == null || games.length < 1){
            return null;
        }
        
        var value   = null;
        var revenue = 0;
        var costs   = 0;
        var profit  = 0;
        var maxprofit = 0;
        
        for(var i = 0; i < games.length; i++){
            revenue = games[i].revenue;
            costs   = games[i].costs;
            profit  = revenue - costs;
            
            if(value == null || profit > maxprofit){
                value = games[i];
                maxprofit = profit;
            }
        }
        
        var canBestGameBeShown = m.Utils.hasGameBeenReviewed(value);

        return {game: canBestGameBeShown ? value : m.LastBestGame, profit: maxprofit};
    };
    
    // Quick implementation for StatsMod ModalWindow Open and Close Events
    this.ModalWindowApi.opts.onopen = function(e){

    };
    
    this.ModalWindowApi.opts.onhide = function(e){
        Sound.click();
        $modalWindowObj.find('.statsMod-modal-content').first().children().remove();

        var $match = $('body').find('#'+m.Config.idMainModalWindowOverlay);
        if ($match && $match.length > 0){
            $match.remove();
        }
        
        $match = $('body').find('#'+m.Config.idMainModalWindowOverlayContainer);
        if ($match && $match.length > 0){
            $match.remove();
        }
    }
        
    // Declare extension for context menu                   
    var infoStatsModContextMenu = function(b, c, d, h){
        // Extending the context menu
        c.push({
                label: "Info & Stats...".localize(),
                action: function () {
                    Sound.click();
                    GameManager.resume(true);
                    
                         var div = $('#InfoStatsModContainer');
                                                  
                         div.scrollTop()
                         
                         div.gdDialog({
                            popout: !0,
                            close: !0,
                            onClose: function () {
                                GameManager.togglePause();
                            },
                            onOpen: function() {
                                GameManager.togglePause();
                            }
                        })
                }
            })

            // Scroll to top div
            m.DocumentBody.animate({
                scrollTop: $('#'+m.Config.idContextMenuTopArea).offset().top
            }, 2000);
            
           
            // Calling the original context menu
            m.ContextMenu(b, c, d, h);
    };
    
    // Attach to and extend by overriding it, the main context menu
    UI._showContextMenu = infoStatsModContextMenu;

    UI.selectInfoStatsModItemClickHandler = function (a) {
            Sound.click();
            switch (a.id) {
                case "statsmodshowreleasedgames":
                    m.ReleasedGames.showReleasedGames();
                    break;
                case "statsmodconfigreleasedgames":
                    m.ReleasedGames.showConfig();
                    break;
                case "statsmodshowplatforms":
                    m.Platforms.showPlatforms();
                    break;
                case "statsmodconfigplatforms":
                    m.Platforms.showConfig();
                    break;

                case "statsmodnotifications":
                    m.Notifications.showNotifications();
                    break;



                case "statsmodshowsalesanalysis":
                    m.Analysis.showSalesAnalysis();
                    break;
                case "":
                    GameManager.togglePause();
                    break;
                case "statsmodtogglepause":
                    GameManager.togglePause();
                    break;
                case "statsmodresetsettings":
                     m.Config.resetStorage();
                    break;
                case "statsmodtogglefooter":
                    m.Footer.toggleVisibilty();
                default:
                    return;
            }
        };  
};