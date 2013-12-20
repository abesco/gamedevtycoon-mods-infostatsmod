/*
* Name:                 InfoStatsMod
* Class:                InfoStatsModAbescoUG_Config 
* Description:          Class for configuration
* Copyright:            © 2013 Francesco Abbattista
* Url:                  http://www.abesco.de/
*/


var InfoStatsModAbescoUG_Config = function() {
    this.idContainer                = 'InfoStatsModContainer';
    this.idContextMenuTopArea       = 'InfoStatsModTop';
    this.idMainModalWindowNamespace = 'InfoStatsMod';
    this.idMainModalWindowOverlay   = 'InfoStatsModGameDetailsModalWindowOverlay';
    this.idMainModalWindowOverlayContainer = 'InfoStatsModGameDetailsModalWindowOverlayContainer';
    this.idDataStorage              = 'InfoStatsModAbescoUG';
    this.idReleaseGamesConfigContainer  = 'InfoStatsModReleasedGamesConfigContainer';

    this.dataStorage                = GDT.getDataStore(this.idDataStorage);
    
    this.saveReleasedGamesConfig    = function(dataListColumns) {
        this.dataStorage.settings.releasedGamesConfig = {dataListColumns: dataListColumns};
    };
    
    this.loadReleasedGamesConfig    = function(){
        if(this.dataStorage.settings.releasedGamesConfig == null){
            return null;
        }
        
        return this.dataStorage.settings.releasedGamesConfig.dataListColumns;
    };
    
};
