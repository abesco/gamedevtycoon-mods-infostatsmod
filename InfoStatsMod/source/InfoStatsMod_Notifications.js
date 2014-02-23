/*
* Name:                 InfoStatsMod
* Class:                InfoStatsModAbescoUG_Notifications  
* Description:          General Notifications Class for the InfoStatsMod
* Copyright:            © 2013 Francesco Abbattista
* Url:                  http://www.abesco.de/
*/

var InfoStatsModAbescoUG_Notifications = function(infoStatsModCore){
    var m       = this;
    var core    = infoStatsModCore;
    
    this.getBestGameNotification = function() {
        var bestGame        = core.getBestGame();
        var averageScore    = bestGame.game.reviews.average(function (a) { return a.score })
        var strScore        = core.Utils.formatMoney(averageScore, 2, ',', '.');

        var msg = "Well done! Your game {0} has been your best game ever been published by your company.\n\nIt has been scored {1} with a profit of {2}.".localize().format(bestGame.game.title, strScore, UI.getShortNumberString(bestGame.profit));
        return new Notification("Company's Best Game".localize(), msg);
    };

    this.getBestGameBreaksRecordsNotification = function() {
        var bestGame        = core.getBestGame();
        var averageScore    = bestGame.game.reviews.average(function (a) { return a.score })
        var strScore        = core.Utils.formatMoney(averageScore, 2, ',', '.');

        var msg = "Amazing! Your game {0} has broken another record! Profit has now raised to {1}.".localize().format(bestGame.game.title, UI.getShortNumberString(bestGame.profit));
        return new Notification("Company's Best Game".localize(), msg);
    };
    
    this.getReleaseDetailsAvailNotification = function (game) {
        var averageScore    = game.reviews.average(function (a) { return a.score; });
        var strScore        = core.Utils.formatMoney(averageScore, 2, ',', '.');

        var msg = "Game release details and sales analysis for {0} are now available in InfoStatsMod.{1}During sales you can also click on the game's sales card to open a detailed view of the game.".localize().format(game.title,'\n\n');
        return new Notification("Release Details Available".localize(), msg);
    };
        
    this.showNotifications = function() {
        var config = core.Config.loadNotifications();
        var showBestGameNotifications = config != null ? config.showBestGameNotifications : null;
        var showReleaseDetailAvailableNotifications = config != null ? config.showReleaseDetailAvailableNotifications : null;

        if (showBestGameNotifications == null){
            showBestGameNotifications = true;
        }
        
        if (showReleaseDetailAvailableNotifications == null){
            showReleaseDetailAvailableNotifications = true;
        }
                    
        var div  = $(document.createElement('div'));

        var colTable     = core.Utils.getNewTableElement({width:'360px'},'').attr({border:0, cellpadding:0, cellspacing:0});
        var colBody      = core.Utils.getNewTableBodyElement(null, '');
        var colRow1      = core.Utils.getNewTableRowElement(null, '');
        var colRow2      = core.Utils.getNewTableRowElement(null, '');
        
        var colCellShowBestGame      = core.Utils.getNewTableCellElement(null, '').attr({valign:'top', align:'left'});
        {
                var checkboxtable       = core.Utils.getNewTableElement({width:'100%'}).attr({border:0, cellpadding:0, cellspacing:0});
                var checkboxtablebody   = core.Utils.getNewTableBodyElement(null, '');
                var checkboxrow         = core.Utils.getNewTableRowElement();
                var checkboxcell        = core.Utils.getNewTableCellElement(null, '').attr({valign:'top', align:'left'});
                var checkbox            = $(document.createElement('input'));
                
                checkbox.css({width:'16px'}).attr({type:'checkbox', name:'infostatsmod-platforms-notifications-bestgame', value:'1', checked:showBestGameNotifications});
                                             
                checkbox.appendTo(checkboxcell);
                checkboxcell.appendTo(checkboxrow);
                checkboxcell.append('Best Company Game').append('<br>');
                checkboxrow.appendTo(checkboxtablebody);
                checkboxtablebody.appendTo(checkboxtable);
                checkboxtable.appendTo(colCellShowBestGame);          
                
        }

        var colCellReleaseAvail      = core.Utils.getNewTableCellElement(null, '').attr({valign:'top', align:'left'});
        {
                var checkboxtable       = core.Utils.getNewTableElement({width:'100%'}).attr({border:0, cellpadding:0, cellspacing:0});
                var checkboxtablebody   = core.Utils.getNewTableBodyElement(null, '');
                var checkboxrow         = core.Utils.getNewTableRowElement();
                var checkboxcell        = core.Utils.getNewTableCellElement(null, '').attr({valign:'top', align:'left'});
                var checkbox            = $(document.createElement('input'));
                
                checkbox.css({width:'16px'}).attr({type:'checkbox', name:'infostatsmod-platforms-notifications-releasedetailavail', value:'1', checked:showReleaseDetailAvailableNotifications});
                                             
                checkbox.appendTo(checkboxcell);
                checkboxcell.appendTo(checkboxrow);
                checkboxcell.append('Release details available').append('<br>');
                checkboxrow.appendTo(checkboxtablebody);
                checkboxtablebody.appendTo(checkboxtable);
                checkboxtable.appendTo(colCellReleaseAvail);          
                
        }        
            
        colCellShowBestGame.appendTo(colRow1);  
        colCellReleaseAvail.appendTo(colRow1);
            
        colRow1.appendTo(colBody);
        //colRow2.appendTo(colBody);
        colBody.appendTo(colTable);
        colTable.appendTo(div);
                    
        
        var saveButton = $(document.createElement('div'));
        saveButton.text('Save').addClass('selectorButton').addClass('whiteButton').css({height:'24px',width:'80px', margin:'0px', lineHeight:'24px', fontSize:'12pt'});
        
        div.append('<hr>')
        saveButton.appendTo(div);
        
        var saveButtonOnClick = '';
        //' $("#'+core.Config.idReleaseGamesConfigContainer+'").find("input[type=checkbox]").filter(":checked").each(function(i,v){alert(v.name + " = " + v.value);});';
         
        saveButton.attr('onClick','javascript:UI.saveInfoStatsModNotifications(this)');
        
        core.ModalWindowApi.open(div.html());
        core.ModalWindowApi.resize(640, 480);
    }; 
        
    UI.saveInfoStatsModNotifications = function (a) {
            Sound.click();

            var target  = $(a).parent();
            var checkboxes = target.find('input[type=checkbox]');
            var selects    = target.find('select');
            var optBestGame  = false;
            var optReleaseDetailAvail = false;
            
            selects.each(function(){
                var name      = $(this).attr('name');    
                var selected  = $(this).is(':selected');
            
            });

            checkboxes.each(function(){
                var name      = $(this).attr('name');    
                var checked   = $(this).is(':checked');
            
                switch(name){
                    case 'infostatsmod-platforms-notifications-bestgame':
                        optBestGame = checked;
                    break;
                    case 'infostatsmod-platforms-notifications-releasedetailavail':
                        optReleaseDetailAvail = checked;
                    break;
                }
            });
                        
            core.Config.saveNotifications(optBestGame, optReleaseDetailAvail);
            
            // --> core.Config.saveReleasedGamesConfig(cols);
        };          
    
};