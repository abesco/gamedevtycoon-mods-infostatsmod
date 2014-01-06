/*

GameDevTycoon Expansion Module
**********************************************************************************************************************************************************
Name:                 InfoStatsMod
Description:          Provides detailed information and statistics to games released, provides charts and analysis to game sales and financial themes.
Copyright:            © 2013 Francesco Abbattista
Url:                  http://www.abesco.de/
Notes:                Originally inspired and partially based on techniques from the expansion modules: Expansion Pack and CheatMod.
Credits:              Big thanks and respect goes out to DzjengisKhan, LineLiar and kristof1104.
                      ExpansionPack for GDT by DzjengisKhan, LineLiar
                      CheatMod      for GDT by kristof1104
**********************************************************************************************************************************************************
Version:              0.3.1
Launch:               December 09th, 2013
Last Update:          December 22th, 2013
**********************************************************************************************************************************************************

Using the following additional scripts:
**********************************************************************************************************************************************************
jquery.datalist.js    Name:       DataList
                      Version:    1.0
                      Copyright:  © 2013 Francesco Abbattista, © 2010 Benjamin LÃ©ouzon
                      License:    MIT (http://www.opensource.org/licenses/mit-license.php)
**********************************************************************************************************************************************************
charts.js             Name:       Charts
                      Version:    1.1.2
                      Copyright:  © 2008 Steve Fenton
                      License:    <unknown> probably MIT (http://www.opensource.org/licenses/mit-license.php) - "Feel free to use this jQuery Plugin"                          
**********************************************************************************************************************************************************
jquery.flot.min.js    Name:       Flot (Attractive JavaScript plotting for jQuery)
                      Version:    0.8.0
                      Copyright:  © 2013 IOLA and Ole Laursen
                      License:    Licensed under the MIT (filamentgroup.com/examples/mit-license.txt)
**********************************************************************************************************************************************************
modal.js              Name:       Simple jQuery modal window
                      Version:    <unknown>
                      Copyright:  Matt Hinchliffe <www.maketea.co.uk>
                      License:    Licensed under the terms of CC 3.0 (http://creativecommons.org/licenses/by-sa/3.0/)
**********************************************************************************************************************************************************
image-picker.js       Name:       Image Picker
                      Version:    0.1.7
                      Copyright:  Rodrigo Vera https://github.com/rvera/image-picker
                      License:    MIT License, https://github.com/rvera/image-picker/blob/master/LICENSE
**********************************************************************************************************************************************************
footer.js             Name:       Constant Footer
                      Version:    1.0.0
                      Copyright:  © 2008 Steve Fenton, Modifications for this module © 2013 Francesco Abbattista
                      License:    <unknown> probably MIT (http://www.opensource.org/licenses/mit-license.php) - "Feel free to use this jQuery Plugin"                          
**********************************************************************************************************************************************************

*/

var InfoStatsModAbescoUG = {};
(function () {
    try {
        InfoStatsModAbescoUG.VERSION = '0.3.3a';
        
        // Include all required script files at runtime
        // Note: I feel this is a better approach instead of including these files
        //       within the .json files (I sometimes got some inclusion errors and alike)
        var jslibs = ['Config', 'Utils', 'Footer', 'ReleasedGames', 'Analysis', 'Platforms', 'Notifications', 'Core']
        $.each(jslibs, function(key, value){
            var $jsdiv = $('body').find('#InfoStatsModResources');
            if ($jsdiv == null){
                $jsdiv = $(document.createElement('div'));
                $jsdiv.attr('id','InfoStatsModResources');
                $('body').append($jsdiv);
            }
            
            var jsfile = './mods/InfoStatsMod/source/InfoStatsMod_' + value + '.js';
            var $jstag = $(document.createElement('script'));
                $jstag.attr('src',jsfile).appendTo($jstag);
            
        });
        
        // Prepare the module
        var instance            = InfoStatsModAbescoUG;
        this.Core               = new InfoStatsModAbescoUG_Core();
        
        // Setup the module and start
        this.Core.setup();
        

                
    }
    catch(e){
        alert('An exception occured in the InfoStatsMod Expansion!\r\n\r\n'+e.message);
    }
    finally {
        
    }
})();
