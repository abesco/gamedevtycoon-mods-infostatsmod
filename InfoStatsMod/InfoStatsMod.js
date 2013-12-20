(function () {
    var ready = function () {
    };

    var error = function () {
    };

    <!-- Include one of jTable styles. -->
 
    GDT.loadJs(['mods/InfoStatsMod/libs/charts/charts.js',
                'mods/InfoStatsMod/libs/data-list/jquery.datalist.js', 
                'mods/InfoStatsMod/libs/modal/modal.js', 
                'mods/InfoStatsMod/libs/misc/footer.js', 
                'mods/InfoStatsMod/libs/flot/jquery.flot.min.js', 
                'mods/InfoStatsMod/source/source.js'], ready, error);
})();