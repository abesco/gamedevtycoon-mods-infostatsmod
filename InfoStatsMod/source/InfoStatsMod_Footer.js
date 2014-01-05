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
            var revenues = UI.getShortNumberString(core.getTotalRevenues());
            var costs    = UI.getShortNumberString(core.getTotalCosts());
            var profit   = UI.getShortNumberString(core.getTotalProfit());
            var bestGame = core.getBestGame();
            
           
            var strContent      = '';
            var averageScore    = bestGame.game.reviews.average(function (a) { return a.score })
            var strScore        = core.Utils.formatMoney(averageScore, 2, ',', '.');
            
            var gameDate        = GameManager.company.getDate(company.currentWeek);
            
            strContent += curDate + " - Revenues: " + revenues + " - Costs: " + costs + " - Profit: "+ profit;
                    
            if (bestGame != null){
                strContent += " - Best Game Ever: " + bestGame.game.title + " (Score: " + strScore + " - Profit: " + UI.getShortNumberString(bestGame.profit) + ")";
            }

            
            m.setContent(strContent);

        };
                
      
        
};