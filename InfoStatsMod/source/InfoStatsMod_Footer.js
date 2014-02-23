/*
* Name:                 InfoStatsMod
* Class:                InfoStatsModAbescoUG_Footer   
* Description:          Class for handling and displaying the overlay footer
* Copyright:            © 2013 Francesco Abbattista
* Url:                  http://www.abesco.de/
*/

var InfoStatsModAbescoUG_Footer = function(infoStatsModCore) {
        var m               = this;
        var core            = infoStatsModCore;
        
        
        
        // Show the footer overlay
        this.show = function() {
            $('#InfoStatsModFooterOverlay').show();
        };

        // Hides the footer overlay
        this.hide = function() {
            $('#InfoStatsModFooterOverlay').hide();
        };
        
        // Sets the content of the footer overlay
        this.setContent = function(content){
            $('#InfoStatsModFooterOverlay').html(content);                
        };
        
        // Toggles the footer visibility
        this.toggleVisibilty = function() {
            $('#InfoStatsModFooterOverlay').toggle();
        };
        
        this.setup = function() {
            var $match = $('body').find('InfoStatsModFooterOverlay');
            if ($match != null){
                $match.remove();
            }

            var $footer = $(document.createElement('div'));
            $footer.attr('id','InfoStatsModFooterOverlay');
            $('body').append($footer);
            
            
            Fenton.footer.addElement('InfoStatsModFooterOverlay').setOpacity(0.5).run();
            
            $('#InfoStatsModFooterOverlay').css('zIndex','10000');
            $('#InfoStatsModFooterOverlay').hide();
        };
        
        
        this.updateContent = function(company){
            var curDate  = core.Utils.getRealDateAsDateString(company.currentWeek);
            var revenues = core.getTotalRevenues();
                revenues = isNaN(revenues) ? "n.a." : UI.getShortNumberString(core.getTotalRevenues());
            var costs    = core.getTotalCosts();
                costs    = isNaN(costs) ? "n.a." : UI.getShortNumberString(core.getTotalCosts());
            var profit   = core.getTotalProfit();
                profit   = isNaN(profit) ? "n.a." : UI.getShortNumberString(core.getTotalProfit());

            var bestGame = core.getBestGame();
            var isLoss   = bestGame == null ? 0 : bestGame.game.revenue - bestGame.game.costs < 0;
           
            var strContent      = '<div style="text-align:center; font-size:10pt; vertical-align:middle">';
            var averageScore    = bestGame.game.reviews.average(function(a) { return a.score; });
            var strScore        = core.Utils.formatMoney(averageScore, 2, ',', '.');
            var numScore        = new Number(averageScore);
            var gameDate        = GameManager.company.getDate(company.currentWeek);
            
            strContent += curDate + " - Game Revenues: " + (revenues == "NaN" ? "n.a." : revenues) + " - Game Costs: " + (costs == "NaN" ? "n.a." : costs) + " - Game Profits: " + (profit == "NaN" ? "n.a." : profit);
             
            var quickColorTableScore  = [];
            var quickColorTableProfit = ['FF2222','22FF22'];
             
            for (var i = 0; i < 10; i++){
                quickColorTableScore.push( (9 + i) + "" + (9 + i) + "" + i + "" + i + "00");
            }   
               
            if (bestGame != null){
                
                var colorSpan       = '<span style="color:#{0}">{1}</span>';
                var scoreColored    = colorSpan.format(quickColorTableScore[numScore.truncateDecimals(0)], strScore);
                var profitColored   = colorSpan.format(quickColorTableProfit[isLoss ? 0 : 1], UI.getShortNumberString(bestGame.profit));
                
                strContent         += " - Best Game Ever: " + bestGame.game.title + " (Score: " + scoreColored + " - Profit: " + profitColored + ")";
            }

            strContent += '</div>';
            m.setContent(strContent);

        };
                
      
        
};