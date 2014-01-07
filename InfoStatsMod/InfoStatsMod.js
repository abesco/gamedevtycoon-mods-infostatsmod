(function () {
    var ready = function () {
        var readyEx = function () {
            InfoStatsModAbescoUG.init();
        };
        
        var errorEx = function () {
        };
    
        var jsfiles = ['mods/InfoStatsMod/libs/charts.js',
                       'mods/InfoStatsMod/libs/datalist.js', 
                       'mods/InfoStatsMod/libs/modal.js', 
                       'mods/InfoStatsMod/libs/footer.js', 
                       'mods/InfoStatsMod/libs/image-picker.js', 
                       'mods/InfoStatsMod/libs/flot.js', 
                       'mods/InfoStatsMod/source/source.js'];

        var jslibs = ['Prototypes', 'Config', 'Utils', 'Footer', 'ReleasedGames', 'Analysis', 'Platforms', 'Notifications']
        $.each(jslibs, function(key, value){
            var jsfile = './mods/InfoStatsMod/source/InfoStatsMod_' + value + '.js';
            jsfiles.push(jsfile);
        });
        
        GDT.loadJs(jsfiles, readyEx, errorEx)
    };

    var error = function () {
    };

    <!-- Include one of jTable styles. -->
    GDT.loadJs(['mods/InfoStatsMod/source/InfoStatsMod_Core.js'], ready, error);
})();