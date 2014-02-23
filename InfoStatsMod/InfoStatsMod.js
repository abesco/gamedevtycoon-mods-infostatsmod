(function () {
    var path    = './mods/InfoStatsMod/';
    var jslibs = ['Prototypes', 'Config', 'Utils', 'Footer', 'ReleasedGames', 'Analysis', 'Platforms', 'Notifications'];

    var ready = function () {
        var readyEx = function () {
            console.log("InfoStatsMod loaded.");
            InfoStatsModAbescoUG.init();
        };

        var errorEx = function () {
        };

        var jsfiles = [path + 'libs/charts.js',
                       path + 'libs/datalist.js', 
                       path + 'libs/modal.js', 
                       path + 'libs/footer.js', 
                       path + 'libs/image-picker.js', 
                       path + 'libs/flot.js', 
                       path + 'source/source.js'];

        $.each(jslibs, function(key, value){
            var jsfile = './mods/InfoStatsMod/source/InfoStatsMod_' + value + '.js';
            jsfiles.push(jsfile);
        });
        
        GDT.loadJs(jsfiles, readyEx, errorEx);
    };

    var error = function () {
    };

    GDT.loadJs(['mods/InfoStatsMod/source/InfoStatsMod_Core.js'], ready, error);
})();