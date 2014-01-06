(function () {
    var ready = function () {
        var readyEx = function () {
        };
        
        var errorEx = function () {
        };
    
        var jsfiles = ['mods/InfoStatsMod/libs/charts/charts.js',
                       'mods/InfoStatsMod/libs/data-list/jquery.datalist.js', 
                       'mods/InfoStatsMod/libs/modal/modal.js', 
                       'mods/InfoStatsMod/libs/misc/footer.js', 
                       'mods/InfoStatsMod/libs/image-picker/image-picker.js', 
                       'mods/InfoStatsMod/libs/flot/jquery.flot.min.js', 
                       'mods/InfoStatsMod/source/source.js'];

        var jslibs = ['Config', 'Utils', 'Footer', 'ReleasedGames', 'Analysis', 'Platforms', 'Notifications']
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