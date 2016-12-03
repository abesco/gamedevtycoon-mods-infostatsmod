/*
* Name:                 InfoStatsMod
* Class:                InfoStatsModAbescoUG_Core
* Description:          Core Class for the InfoStatsMod
* Copyright:            © 2013, 2014 Francesco Abbattista
* Url:                  http://www.abesco.de/
*/

var InfoStatsModAbescoUG_Core = function() {
    var self = this;

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

    var _showContextMenuOrigFunc = UI._showContextMenu;

    self.showCurrentGameDetails = function(game){
        self.ReleasedGames.showGameDetailAsWindow(game,true);
    };

    // Setup the module and make it available in-game
    this.setup = function() {

        // Embed custom css
        self.embedCustomCSS();

        // Container for an overlay: -->
        self.DocumentBody.append('<div id="InfoStatsModContainerModalOverlay" class="ow-overlay ow-closed"></div>');

        // Container for a modal window: -->
        self.DocumentBody.append('<div id="InfoStatsModContainer" class="windowBorder tallWindow" style="overflow:auto;display:none;"> <div id="InfoStatsModTop" class="windowTitle smallerWindowTitle">Information and Statistics</div>');
        self.DocumentBody = $('#'+self.Config.idContainer);
        self.DocumentBody.append('<div id="StatsModContainerLabel1" style="text-align:center;margin-left:50px;width: 450px">Main</div>');
        self.DocumentBody.append('<div id="statsmodshowreleasedgames" class="selectorButton whiteButton" onclick="UI.selectInfoStatsModItemClickHandler(this)" style="display:inline-block;position: relative;margin-left:50px;width: 202px;" >Release Details</div>');
        self.DocumentBody.append('<div id="statsmodshowplatforms" class="selectorButton whiteButton" onclick="UI.selectInfoStatsModItemClickHandler(this)" style="display:inline-block;position: relative;margin-left:50px;width: 202px;" >Platform Details</div>');


        self.DocumentBody.append('<div id="StatsModContainerLabel2" style="text-align:center;margin-left:50px;width: 450px">Settings</div>');

        self.DocumentBody.append('<div id="statsmodconfig" class="selectorButton whiteButton" onclick="UI.selectInfoStatsModItemClickHandler(this)" style="display:inline-block;position: relative;margin-left:50px;width: 202px;" >Config</div>');
        self.DocumentBody.append('<div id="statsmodresetsettings" class="selectorButton whiteButton" onclick="UI.selectInfoStatsModItemClickHandler(this)" style="display:inline-block;position: relative;margin-left:50px;width: 202px;" >Reset Configs</div>');

        // --> Disable on releases
        // --> self.DocumentBody.append('<div id="" class="selectorButton whiteButton" onclick="UI.selectInfoStatsModItemClickHandler(this)" style="display:inline-block;position: relative;margin-left:50px;width: 202px;" >Sales Analysis</div>');

        self.DocumentBody.append('<div id="StatsModContainerLabel3" style="text-align:center;margin-left:50px;width: 450px">Miscellaneous</div>');
        self.DocumentBody.append('<div id="statsmodtogglefooter" class="selectorButton whiteButton" onclick="UI.selectInfoStatsModItemClickHandler(this)" style="display:inline-block;position: relative;margin-left:50px;width: 202px;" >Toggle Footer</div>');
        self.DocumentBody.append('<div id="statsmodnotifications" class="selectorButton whiteButton" onclick="UI.selectInfoStatsModItemClickHandler(this)" style="display:inline-block;position: relative;margin-left:50px;width: 202px;" >Notifications</div>');
        self.DocumentBody.append('<div id="statsmodtogglepause" class="selectorButton whiteButton" onclick="UI.selectInfoStatsModItemClickHandler(this)" style="display:inline-block;position: relative;margin-left:50px;width: 202px;" >Toggle Pause</div>');

        // self.DocumentBody.append('<div id="statsmodx1" class="selectorButton whiteButton" onclick="UI.selectInfoStatsModItemClickHandler(this)" style="display:inline-block;position: relative;margin-left:50px;width: 202px;" >Toggle Pause</div>');

        // self.DocumentBody.append('<div id="statsmodtestquality" class="selectorButton whiteButton" onclick="UI.selectInfoStatsModItemClickHandler(this)" style="display:inline-block;position: relative;margin-left:50px;width: 202px;" >Quality Test</div>');

        self.DocumentBody.append('<div id="StatsModContainerLabel5" style="text-align:center;margin-left:50px;width: 450px"><br><br>InfoStatsMod Expansion <font size="-1"><sup><i>version '+InfoStatsModAbescoUG.VERSION+'</i></sup></font><br><font size="-2">(c) 2014 Francesco Abbattista</font></div>');

        self.DocumentBody.append('<div id="infostatmod-common-dialog" title="InfoStatsMod">');
        self.DocumentBody.append('</div>');


        self.Footer.setup();
        self.Footer.setContent("<div style='text-align:center'>InfoStatsMod Expansion <font size='-1'><sup><i>version "+InfoStatsModAbescoUG.VERSION+"</i></sup></font></div>");
        self.Footer.show();

        $( "#infostatsmod-common-dialog" ).dialog();
        $( "#infostatsmod-common-dialog" ).hide();

        // Attach events of interest
        // GDT.on(GDT.eventKeys.ui.dialogOpen, dialogOpen);
        // GDT.on(GDT.eventKeys.ui.dialogClose, dialogClose);
        // GDT.on(GDT.eventKeys.ui.contextMenuShowing, contextMenuShowing);
        // GDT.on(GDT.eventKeys.ui.beforeShowingNotification, contextMenuBeforeShow);
        GDT.on(GDT.eventKeys.gameplay.weekProceeded, self.weekProceeded);

        (function() {
            var proxied = UI.salesContainerClick;
            UI.salesContainerClick = function(event, id) {
                proxied.apply(this, arguments);

                if (self.Utils.gameExists(id)) {
                    // this is a game
                    var game = self.Utils.getGame(id);
                    self.showCurrentGameDetails(game);
                }
            };

        })();

        (function() {
            var proxied = UI.addSalesCard;
                UI.addSalesCard = function (a, b, c, d, e, f, g, h, i, j, k, l) {
                    console.log("addSalesCard");
                    proxied.apply( this, arguments );

                    $('#gameSalesContainer').find('.gameSalesCard').css({ cursor: 'pointer' });

                    var game = self.Utils.getGame(a);
                    var config = self.Config.loadNotifications();
                    var showReleaseDetailAvailableNotifications  = config != null ? config.showReleaseDetailAvailableNotifications : null;

                    if(showReleaseDetailAvailableNotifications){
                        if (self.Utils.isDefined(game)) {
                            GameManager.company.notifications.push(self.Notifications.getReleaseDetailsAvailNotification(game));
                        }
                    }
                };
        })();
        (function() {
            var proxied = UI.updateSalesCard;
                UI.updateSalesCard = function (a, b, c, d, e, f, g, h, i) {
                    console.log("updateSalesCard");
                    proxied.apply( this, arguments );
                };
        })();
        (function() {
            var proxied = UI.removeSalesCard;
                UI.removeSalesCard = function (a,b) {
                    console.log("removeSalesCard");
                    proxied.apply( this, arguments );
                };
        })();
    };

    // Event handler for week proceeded. This is triggered whenever a week has passed
    this.weekProceeded = function(e) {
        try {


            var config = self.Config.loadNotifications();
            var showBestGameNotifications = config != null ? config.showBestGameNotifications : null;
            var showReleaseDetailAvailableNotifications  = config != null ? config.showReleaseDetailAvailableNotifications : null;

            if (showBestGameNotifications == null){
                showBestGameNotifications = true;
            }

            if (showReleaseDetailAvailableNotifications == null){
                showReleaseDetailAvailableNotifications = true;
            }

            var bestGame = self.getBestGame();
            var lastGame = GameManager.company.gameLog.last();

            /*
            if ( self.AvailGameNotify != null){
                if ( self.AvailGameNotify.salesCashLog != null && self.AvailGameNotify.salesCashLog.length > 0){
                    if ( showReleaseDetailAvailableNotifications ) {
                        GameManager.company.notifications.push(self.Notifications.getReleaseDetailsAvailNotification());
                    }

                    self.AvailGameNotify = null;
                }
            }
            */

            /*
            if ( GameManager.company.currentGame && GameManager.company.currentGame.salesCashLog != null && GameManager.company.currentGame.salesCashLog.length > 0 ){
                self.AvailGameNotify = GameManager.company.currentGame;
            }
            */

            if (self.Utils.isDefined(bestGame) && self.Utils.isDefined(bestGame.game)){
                // We have a best game, check if it's different than our last best game

                if (!self.Utils.isDefined(self.LastBestGame) || (self.Utils.isDefined(self.LastBestGame) && self.LastBestGame.game != bestGame.game) && bestGame.game == lastGame){
                    // Now we know it's a released and reviewed game since getBestGame already filters it!
                    var profitOld = self.Utils.isDefined(self.LastBestGame) ? self.LastBestGame.revenue - self.LastBestGame.costs : 0;
                    var profitNew = bestGame.revenue - bestGame.costs;
                    var anotherRecord = self.Utils.isDefined(self.LastBestGame) && self.LastBestGame.game.id == bestGame.game.id && profitNew > profitOld;

                    self.LastBestGame = bestGame;

                    // If we want to show Best Game Notification, we do it here by pushing a notification into pipeline
                    if (showBestGameNotifications) {
                        // We need to check if this game has been already nominated as best game
                        if (!anotherRecord) {
                            GameManager.company.notifications.push(self.Notifications.getBestGameNotification());
                        }
                        else {
                            GameManager.company.notifications.push(self.Notifications.getBestGameBreaksRecordsNotification());
                        }
                    }
                }

            }

            // Update the footer overlay
            self.Footer.updateContent(e.company);

        }
        catch(e) {

        }
        finally {

        }

    };

    // Function to embed custom css by dynamically changing the <HEAD></HEAD> block
    self.embedCustomCSS = function(){
        var $ = document; // shortcut
        var cssId = 'StatsModCSSAbescoUG';
        if (!$.getElementById(cssId))
        {
            var css = ['modal', 'datalist', 'flot', 'charts', 'footer', 'image-picker', 'modal'];
            var head  = $.getElementsByTagName('head')[0];
            var dirPath = path.join(
                path.dirname(process.execPath),
                './mods/InfoStatsMod/libs/'
            );

            for(var i = 0; i < css.length; i++){
                var link  = $.createElement('link');
                link.id   = cssId;
                link.rel  = 'stylesheet';
                link.type = 'text/css';
                link.href = path.join(dirPath, css[i] + '.css');
                link.media = 'all';
                head.appendChild(link);
            }
        }
    }

    // Returns a jQuery wrapped div element containing a detailed analysis of a game
    self.getGameDetailElement = function (game) {
        var releaseDate         = GameManager.company.getDate(game.releaseWeek);
        var gameTitle           = game.title;
        var gameId              = game.id;
        var gameTopic           = self.Utils.getDetailedTopicName(game);
        var gameGenre           = game.getGenreDisplayName();

        var gameCosts           = UI.getShortNumberString(game.costs);
        var gameAudience        = GameManager.company.researchCompleted.indexOf(Research.TargetAudience) != -1 ? General.getAudienceLabel(game.targetAudience) : "";
        var gameReleaseWeek     = game.releaseWeek > GameManager.company.currentWeek ? "Coming soon..." : releaseDate.year + "-" + releaseDate.month + "-" + releaseDate.week;
        var gameRevenue         = game.revenue > 0 ? UI.getShortNumberString(game.revenue) : 0;
        var gameProfit          = UI.getShortNumberString(game.revenue - game.costs);
        var isLoss              = (game.revenue - game.costs) < 0;
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
        var $ratingTotal    = $(document.createElement('h5')).css('text-align','center').append(self.Utils.getRatingStarsAsDivElement(averageScore, true, 1));

        $div.css('border','1px solid #cccccc').css('-webkit-box-shadow','0 0 5px#888').css('box-shadow','0 0 5px #888');

        $title.text(gameTitle);
        $genre.text(gameGenre);

        // Acquire the platforms
        $divPlatforms.append(self.Utils.getGamePlatformImagesAsDivElement(game));

        // Acquire every rating obtained by magazines, acquire engine specs
        var $tableMagazines     = self.getMagazineReviewsAsTableElement(game);

        var $tableEngineSpecs   = self.ReleasedGames.getEngineSpecsDataListContainerElement(game);
        var $tableSales         = self.getGameSalesDetailsAsTableElement(game);

        // Pre-Create the details div (header, platforms, info & rating area)
        $div.append($title).append($genre).append($ratingTotal).append($divPlatforms);

        // Create TABS in Details Window Div
        $div.append(self.getGameDetailsTabs());

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


        var weeklySalesObj =  self.getGameSalesWeeklyAsDivElement(game);
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

    self.getGameDetailsTabs = function() {
        var filePath = path.join(
            path.dirname(process.execPath),
            './mods/InfoStatsMod/html/gamedetails-tabs.html'
        );
        return fs.readFileSync(filePath, 'utf8');
    }

    self.getMagazineReviewsAsTableElement = function(game) {
        var averageScore = game.reviews.average(function (a) { return a.score });

        // Show every rating obtained by magazines
        var $tableMagazines     = $(document.createElement('table')).attr('width','100%');
        var $tableBodyMagazines = $(document.createElement('tbody'));

        var $tableRowHeader     = $(document.createElement('tr'));
        var $tableCellHeader    = $(document.createElement('td')).attr('colspan', '3');

        $tableRowHeader.append($tableCellHeader);
        $tableBodyMagazines.append($tableRowHeader);

        $tableBodyMagazines.append('<tr><td colspan="4">Reviews<hr></td></tr>');

        for (var i = 0; i < game.reviews.length; i++)
        {
           var $tableRowMagazines   = $(document.createElement('tr'));
           var $tableCell1Magazines = $(document.createElement('td')).attr('valign','top').attr('width', '90');
           var $tableCell2Magazines = $(document.createElement('td')).attr('valign','top').attr('width', '100');
           var $tableCell3Magazines = $(document.createElement('td')).attr('valign','top').attr('width', '10');
           var $tableCell4Magazines = $(document.createElement('td'));

           $tableCell1Magazines.text(game.reviews[i].reviewerName);
           $tableCell2Magazines.append(self.Utils.getRatingStarsAsDivElement(game.reviews[i].score, false, 0.6));
           $tableCell3Magazines.text(game.reviews[i].score);
           $tableCell4Magazines.text(game.reviews[i].message);

           $tableRowMagazines.append($tableCell1Magazines).append($tableCell2Magazines).append($tableCell3Magazines).append($tableCell4Magazines);
           $tableBodyMagazines.append($tableRowMagazines);
        }
        $tableBodyMagazines.append('<tr><td colspan="4"><br><br>Details<hr></td></tr>');
        {
           var $tableRowMagazines   = $(document.createElement('tr'));
           var $tableCell1Magazines = $(document.createElement('td')).attr('valign','top').attr('width', '90');
           var $tableCell2Magazines = $(document.createElement('td')).attr('valign','top').attr('width', '100');
           var $tableCell3Magazines = $(document.createElement('td')).attr('valign','top').attr('width', '10');
           var $tableCell4Magazines = $(document.createElement('td'));

           $tableCell1Magazines.append('Game Quality');
           $tableCell2Magazines.append('');
           $tableCell3Magazines.append('' + (isNaN(self.Utils.getGameQuality(game).quality) ? 0 : self.Utils.getGameQuality(game).quality));
           $tableCell4Magazines.append('Overall calculated game quality (max. 1.4)');

           $tableRowMagazines.append($tableCell1Magazines).append($tableCell2Magazines).append($tableCell3Magazines).append($tableCell4Magazines);
           $tableBodyMagazines.append($tableRowMagazines);
        }

        $tableMagazines.append($tableBodyMagazines);

        return $tableMagazines;
    };

    self.getGameSalesDetailsAsTableElement = function(game) {
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

    self.getGameSalesWeeklyAsDivElement = function (game) {
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
            zIndex: 9100
        }).appendTo("body");


        return [$divPlaceholder, data];

    };

    self.showConfig = function() {
        var configContainer = $(document.createElement('div'));
        var releasedGames   = self.getConfigReleasedGames();
        var platformDetails = self.getConfigPlatformsDetails();
        var saveButton      = self.getConfigSaveButton();
        var status          = $(document.createElement('div'));

        status.attr('id', self.Config.idConfigStatusContainer);
        status.css({width:'100%',textAlign:'center'});

        configContainer.append(releasedGames, '<br><br>',platformDetails, '<br><hr><br>', saveButton, '<br><br>', status);

        var html = configContainer.html();

        self.ModalWindowApi.open(html);
        self.ModalWindowApi.resize(640, 480);
    };

    self.getConfigSaveButton = function() {
        var saveButton = $(document.createElement('div'));
        saveButton.text('Save').addClass('selectorButton').addClass('whiteButton').css({height:'24px',width:'80px', margin:'0px', lineHeight:'24px', fontSize:'12pt'});
        saveButton.attr('onClick','javascript:UI.saveInfoStatsModConfig(this)');

        return saveButton;
    };

    self.getConfigReleasedGames = function() {
        var div  = $(document.createElement('div'));
        var cols = self.ReleasedGames.getDataListColumns();

        div.attr('id',self.Config.idReleaseGamesConfigContainer);
        div.append('<h5>Released Games</h5><hr>');
        div.append('<font size="-2">Column visibility</font><br><br>');

        var colspan      = Math.ceil(cols.length / 6);
        var totalwidth   = 120 * colspan;
        var colTable     = self.Utils.getNewTableElement({width:totalwidth+'px'},'').attr({border:0, cellpadding:0, cellspacing:0});
        var colBody      = self.Utils.getNewTableBodyElement(null, '');
        var colRow       = self.Utils.getNewTableRowElement(null, '');

        for(var j = 0; j < colspan; j++){
            var colCell = self.Utils.getNewTableCellElement(null, '').attr({valign:'top', align:'left'});

            for(var i = j * 6; i < j * 6 + 6; i++){
                var v = cols[i];
                if (v == null){
                    continue;
                }

                var checkboxtable       = self.Utils.getNewTableElement({width:'100%'}).attr({border:0, cellpadding:0, cellspacing:0});
                var checkboxtablebody   = self.Utils.getNewTableBodyElement(null, '');
                var checkboxrow         = self.Utils.getNewTableRowElement();
                var checkboxcell        = self.Utils.getNewTableCellElement(null, '').attr({valign:'top', align:'left'});
                var checkbox            = $(document.createElement('input'));

                checkbox.css({width:'16px'}).attr({type:'checkbox', name:v.name, value:v.name, checked:v.visible});

                checkbox.appendTo(checkboxcell);
                checkboxcell.appendTo(checkboxrow);
                checkboxcell.append(v.name).append('<br>');
                checkboxrow.appendTo(checkboxtablebody);
                checkboxtablebody.appendTo(checkboxtable);
                checkboxtable.appendTo(colCell);

                if (v.name == 'Id'){
                    checkbox.attr('disabled','true');
                }


            }

            colCell.appendTo(colRow);
        }

        colRow.appendTo(colBody);
        colBody.appendTo(colTable);
        colTable.appendTo(div);

       return div;
    };

    self.getConfigPlatformsDetails = function() {
        var config     = self.Config.loadPlatformsConfig();
        var showImages = config != null ? config.showPlatformImages : null;
        var imageSize  = config != null ? config.platformImageSize : null;
        var imageCols  = config != null ? config.platformImageColumnCount : null;

        if (showImages == null){
            showImages = true;
        }
        if (imageSize == null){
            imageSize = 'small';
        }
        if (imageCols == null){
            imageCols = 1;
        }

        var div  = $(document.createElement('div'));

        div.attr('id',self.Config.idPlatformDetailsConfigContainer);
        div.append('<h5>Platform Details</h5><hr>');

        var colTable     = self.Utils.getNewTableElement({width:'360px'},'').attr({border:0, cellpadding:0, cellspacing:0});
        var colBody      = self.Utils.getNewTableBodyElement(null, '');
        var colRow1      = self.Utils.getNewTableRowElement(null, '');
        var colRow2      = self.Utils.getNewTableRowElement(null, '');
        var colRow3      = self.Utils.getNewTableRowElement(null, '');

        var colCellShowImages      = self.Utils.getNewTableCellElement(null, '').attr({ valign:'top', align:'left'});
        {
                var checkboxtable       = self.Utils.getNewTableElement({width:'100%'}).attr({border:0, cellpadding:0, cellspacing:0});
                var checkboxtablebody   = self.Utils.getNewTableBodyElement(null, '');
                var checkboxrow         = self.Utils.getNewTableRowElement();
                var checkboxcell1       = self.Utils.getNewTableCellElement(null, '').attr({width:'100px', valign:'middle', align:'left'});
                var checkboxcell2       = self.Utils.getNewTableCellElement(null, '').attr({valign:'middle', align:'left'});
                var checkbox            = $(document.createElement('input'));

                checkboxcell1.append('Show Images');

                checkbox.css({width:'16px'}).attr({type:'checkbox', name:'infostatsmod-platforms-config-showimages', value:'1', checked:showImages});
                checkbox.appendTo(checkboxcell2);

                checkboxcell1.appendTo(checkboxrow);
                checkboxcell2.appendTo(checkboxrow);
                checkboxrow.appendTo(checkboxtablebody);
                checkboxtablebody.appendTo(checkboxtable);
                checkboxtable.appendTo(colCellShowImages);

        }

        var colCellImageSize      = self.Utils.getNewTableCellElement(null, '').attr({valign:'middle', align:'left'});
        {
                var selecttable       = self.Utils.getNewTableElement({width:'100%'}).attr({border:0, cellpadding:0, cellspacing:0});
                var selecttablebody   = self.Utils.getNewTableBodyElement(null, '');
                var selectrow         = self.Utils.getNewTableRowElement();
                var selectcell1       = self.Utils.getNewTableCellElement(null, '').attr({width:'100px', valign:'middle', align:'left'});
                var selectcell2       = self.Utils.getNewTableCellElement(null, '').attr({valign:'middle', align:'left'});
                var select            = $(document.createElement('select'));

                selectcell1.append('Image size: ');

                select.attr({size:1, name:'infostatsmod-platforms-config-imagesize', width:100}).attr('class', '');
                select.append('<option name="" value="small"'+(imageSize=='small'?' selected':'')+'>small</option>');
                select.append('<option name="" value="medium"'+(imageSize=='medium'?' selected':'')+'>medium</option>');
                select.append('<option name="" value="large"'+(imageSize=='large'?' selected':'')+'>large</option>');

                select.appendTo(selectcell2);

                selectcell1.appendTo(selectrow);
                selectcell2.appendTo(selectrow);
                selectrow.appendTo(selecttablebody);
                selecttablebody.appendTo(selecttable);
                selecttable.appendTo(colCellImageSize);


        }

        var colCellImageCols      = self.Utils.getNewTableCellElement(null, '').attr({valign:'middle', align:'left'});
        {
                var selecttable       = self.Utils.getNewTableElement({width:'100%'}).attr({border:0, cellpadding:0, cellspacing:0});
                var selecttablebody   = self.Utils.getNewTableBodyElement(null, '');
                var selectrow         = self.Utils.getNewTableRowElement();
                var selectcell1       = self.Utils.getNewTableCellElement(null, '').attr({width:'100px', valign:'middle', align:'left'});
                var selectcell2       = self.Utils.getNewTableCellElement(null, '').attr({valign:'middle', align:'left'});
                var select            = $(document.createElement('select'));

                selectcell1.append('Columns: ');

                select.attr({size:1, name:'infostatsmod-platforms-config-imagecols', width:100}).attr('class', '');
                select.append('<option name="" value="1"'+(imageCols=='1'?' selected':'')+'>1</option>');
                select.append('<option name="" value="2"'+(imageCols=='2'?' selected':'')+'>2</option>');
                select.append('<option name="" value="3"'+(imageCols=='3'?' selected':'')+'>3</option>');

                select.appendTo(selectcell2);

                selectcell1.appendTo(selectrow);
                selectcell2.appendTo(selectrow);
                selectrow.appendTo(selecttablebody);
                selecttablebody.appendTo(selecttable);
                selecttable.appendTo(colCellImageCols);

        }

        colCellShowImages.appendTo(colRow1);
        colCellImageSize.appendTo(colRow2);
        colCellImageCols.appendTo(colRow3);

        colRow1.appendTo(colBody);
        colRow2.appendTo(colBody);
        colRow3.appendTo(colBody);

        colBody.appendTo(colTable);
        colTable.appendTo(div);

        return div;
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
        return self.getTotalRevenues() - self.getTotalCosts();
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

    this.getGamesWithHighestScore = function () {

        var games = GameManager.company.gameLog;
        if (games == null || games.length < 1){
            return 0;
        }


        var values   = [];
        var value    = null;
        for (var i = 0; i < games.length; i++) {

            var avgScore1 = games[i].reviews.average(function (a) { return a.score; });
            var avgScore2 = value!= null ? value.reviews.average(function (a) { return a.score; }) : 0;

            if (avgScore1 >= avgScore2) {
                value = games[i];
                values.push(games[i]);
            }
        }


        return values;
    };

    this.getBestGame = function() {
        var games   = self.getGamesWithHighestScore();
        if ( games == null || games.length < 1){
            return null;
        }


        var value   = null;
        var revenue = 0;
        var costs   = 0;
        var profit  = 0;
        var maxprofit = 0;
        var specialScore = 0;

        for (var i = 0; i < games.length; i++) {
            revenue = games[i].revenue;
            costs   = games[i].costs;
            profit  = revenue - costs;

            var specScore = games[i].reviews.average(function (a) { return a.score; }) * profit;

            if (value == null || specScore > specialScore) {
                value = games[i];
                maxprofit = profit;
            }
        }

        var canBestGameBeShown = self.Utils.hasGameBeenReviewed(value);

        return { game: canBestGameBeShown ? value : self.LastBestGame, profit: maxprofit };
    };

    // Quick implementation for StatsMod ModalWindow Open and Close Events
    this.ModalWindowApi.opts.onopen = function(e){

    };

    this.ModalWindowApi.opts.onhide = function(e){
        Sound.click();
        $modalWindowObj.find('.statsMod-modal-content').first().children().remove();

        var $match = $('body').find('#'+self.Config.idMainModalWindowOverlay);
        if ($match && $match.length > 0){
            $match.remove();
        }

        $match = $('body').find('#'+self.Config.idMainModalWindowOverlayContainer);
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
            self.DocumentBody.animate({
                scrollTop: $('#'+self.Config.idContextMenuTopArea).offset().top
            }, 2000);


            // Calling the original context menu
            self.ContextMenu(b, c, d, h);
    };

    // Attach to and extend by overriding it, the main context menu
    UI._showContextMenu = infoStatsModContextMenu;

    UI.selectInfoStatsModItemClickHandler = function (a) {
            Sound.click();
            switch (a.id) {
                case "statsmodshowreleasedgames":
                    self.ReleasedGames.showReleasedGames();
                    break;
                case "statsmodshowplatforms":
                    self.Platforms.showPlatforms();
                    break;

                case "statsmodconfig":
                    self.showConfig();
                    break;

                case "statsmodnotifications":
                    self.Notifications.showNotifications();
                    break;

                case "statsmodshowsalesanalysis":
                    self.Analysis.showSalesAnalysis();
                    break;
                case "":
                    GameManager.togglePause();
                    break;
                case "statsmodtogglepause":
                    GameManager.togglePause();
                    break;
                case "statsmodresetsettings":
                     self.Config.resetStorage();
                    break;
                case "statsmodtogglefooter":
                    self.Footer.toggleVisibilty();

                case "statsmodtestquality":
                    var q = self.Utils.getGameQuality(GameManager.company.gameLog.last());
                    console.log(q);
                break;
                default:
                    return;
            }
        };

    UI.saveInfoStatsModConfig = function (a) {
        Sound.click();
        try{
            {
                var cols    = self.ReleasedGames.getDataListColumns();
                var target  = $('#'+self.Config.idReleaseGamesConfigContainer);
                var checkboxes = target.find('input[type=checkbox]');

                checkboxes.each(function(){
                    var name    = $(this).attr('name');
                    var visible = $(this).is(':checked');

                    $.each(cols, function(i, v){
                        if (v.name == name){
                            v.visible = visible;
                        }
                    });
                });

                self.Config.saveReleasedGamesConfig(cols);
            }
            {
                var target          = $('#'+self.Config.idPlatformDetailsConfigContainer);
                var checkboxes      = target.find('input[type=checkbox]');
                var selects         = target.find('select');
                var optShowImages   = false;
                var optImageSize    = 'small';
                var optImageCols    = 1;

                selects.each(function(){
                    var name      = $(this).attr('name');
                    var selected  = $(this).is(':selected');

                    switch(name){
                        case 'infostatsmod-platforms-config-imagesize':
                            optImageSize = $(this).val();
                        break;
                        case 'infostatsmod-platforms-config-imagecols':
                            optImageCols = $(this).val();
                        break;
                    }
                });

                checkboxes.each(function(){
                    var name      = $(this).attr('name');
                    var checked   = $(this).is(':checked');

                    switch(name){
                        case 'infostatsmod-platforms-config-showimages':
                            optShowImages = checked;
                        break;
                    }
                });

                self.Config.savePlatformsConfig(optShowImages, optImageSize, optImageCols);
            }
            $('#'+self.Config.idConfigStatusContainer).hide().text('Save successful').css({color:'green'}).fadeIn().delay(100).fadeOut();
        }
        catch(ex){
            $('#'+self.Config.idConfigStatusContainer).hide().text('Error! '+ex.message).css({color:'red'}).fadeIn().delay(100).fadeOut();
        }
    };
};
