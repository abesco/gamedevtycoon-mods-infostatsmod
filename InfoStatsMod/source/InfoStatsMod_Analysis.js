/*
* Name:                 InfoStatsMod
* Class:                InfoStatsModAbescoUG_Analysis   
* Description:          Class for handling and displaying analysis data
* Copyright:            © 2013, 2014 Francesco Abbattista
* Url:                  http://www.abesco.de/
*/

var InfoStatsModAbescoUG_Analysis = function(infoStatsModCore) {
    var self     = this;
    var core  = infoStatsModCore;

    // Shows the sales analysis window
    self.showSalesAnalysis = function(){
        
        var $wrapper = $(document.createElement('div'));
        $wrapper.css('width','100%');
        $wrapper.css('height','500px');
        $wrapper.css('border','1px solid blue');
        $wrapper.css('overflow','auto');
        
        var $element = $(document.createElement('div'));
        $element.css('width','98%');
        $element.css('height','100%');
        
        $wrapper.append($element);
        
        core.ModalWindowApi.open();

        $('.statsMod-modal-content:first').append($wrapper);
        
        if(GameManager.company.gameLog.length > 0)
        {
            core.ModalWindowApi.resize("90%","90%");
            
            var $table = self.getModalWindowContentAreaDataTableElement();
            
            $wrapper.children().first().append($table);
            $table.charts({direction:'vertical'});
                 
        }
        else {
            core.ModalWindowApi.resize("640px","100px");
        }
    };

    // Returns an array with revenue data
    self.getRevenuesDataArray = function() {
        var data = [];
        
        for(var i = 0; i < GameManager.company.gameLog.length; i++)
        {
            var game = GameManager.company.gameLog[i];
            var revenue = isNaN(game.revenue) ? 0 : game.revenue;
            
            data[i] = [revenue, game.title];
        }
        
        return data;   
    };

    // Function to create and return content area section element
    self.getModalWindowContentAreaDataTableElement = function() {
        var statsModModalWindow1html = '';
        var $element = null;
        
        if (GameManager.company.gameLog.length < 1)
        {
            $element = $(document.createElement('div'));
            $element.css('width','100%').css('height','100%').css('text-align','center');
            $element.html('<h2>You have not sold anything, yet!</h2>'); 
        }
        else 
        {
            var $caption = $(document.createElement('caption'));
            $caption.text('Revenues');

            var $table = $(document.createElement('table'));
            $table.attr('id','StatsModShowSalesAnalysisContainerRevenues');
            $table.attr('data-chart-width','400');
            $table.attr('data-chart-height','150');
            $table.addClass('column-chart');
            
            $table.attr('width','98%').attr('height','100%');
            
            var $thead      = $(document.createElement('thead'));
            var $theadrow   = $(document.createElement('tr'));

            $theadrow.html('<th>Game</th><th>Revenue</th>');
            
            $thead.append($theadrow);

            var $tfoot      = $(document.createElement('tfoot'));
            var $tfootrow   = $(document.createElement('tr'));
            
            $tfootrow.html('<td>--</td><td>0</td>');
            
            $tfoot.append($tfootrow);
            
            var $tbody      = $(document.createElement('tbody'));
            
            
            for(var i = 0; i < GameManager.company.gameLog.length; i++)
            {
                var game = GameManager.company.gameLog[i];
                var revenue = isNaN(game.revenue) ? 0 : game.revenue;
                var averageScore = game.reviews.average(function (a) {
                    return a.score;
                });
        
                var $divRatingStars     = core.Utils.getRatingStarsAsDivElement(averageScore, false, 1);
                var $tbodyrow           = $(document.createElement('tr'));
                
                var $tcell_1 = $(document.createElement('td'));
                var $tcell_2 = $(document.createElement('td'));
                
                $tcell_1.text(game.title);
                $tcell_2.text(revenue);
                
                $tcell_1.append($divRatingStars);
                
                $tbodyrow.append($tcell_1);
                $tbodyrow.append($tcell_2);
                $tbody.append($tbodyrow);
            }   

            $table.append($thead);
            $table.append($tfoot);
            $table.append($tbody);
            
            $element = $table;

        }
        return $element;
    }    
    
    // Returns sales graphics as a div element (ready-to-use)
    self.getSalesAsDivElement = function () {
       
        for(var i = 0; i < GameManager.company.gameLog.length; i++)
        {
            var game            = GameManager.company.gameLog[i];
            var revenue         = isNaN(game.revenue) ? 0 : game.revenue;
            var averageScore    = game.reviews.average(function (a) {
                return a.score;
            });
                
            var releaseWeekReal = game.releaseWeek;
            var log             = game.salesCashLog;
        }
                       
        var $divPlaceholder = $(document.createElement('div'));
            $divPlaceholder.attr('id', 'InfoStatsModGameSalesFlotGraphPlaceholder');
            $divPlaceholder.css('position','relative').css('width','500px').css('height','200px');
        
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
    
    return self; 
};