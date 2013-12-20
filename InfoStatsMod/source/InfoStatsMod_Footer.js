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
};