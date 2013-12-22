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
    
    this.resetStorage = function() {
        this.dataStorage.data.releasedGamesConfig   = null;    
        this.dataStorage.data.platformsConfig       = null;    
    };
    
    this.saveReleasedGamesConfig    = function(dataListColumns) {
        this.dataStorage.data.releasedGamesConfig = {dataListColumns: dataListColumns};
    };
    
    this.loadReleasedGamesConfig    = function(){
        if(this.dataStorage.data.releasedGamesConfig == null){
            return null;
        }
        
        return this.dataStorage.data.releasedGamesConfig.dataListColumns;
    };
    
    this.savePlatformsConfig    = function(showPlatformImages, platformImageSize, platformImageColumnCount) {
        this.dataStorage.data.platformsConfig = {showPlatformImages: showPlatformImages, platformImageSize: platformImageSize, platformImageColumnCount: platformImageColumnCount};
    };
    
    this.loadPlatformsConfig    = function(){
        if(this.dataStorage.data.platformsConfig == null){
            return null;
        }
        
        return this.dataStorage.data.platformsConfig;
    };
    
    this.saveNotifications = function(showBestGameNotifications, showReleaseDetailAvailableNotifications) {
        this.dataStorage.data.notifications = {showBestGameNotifications: showBestGameNotifications, showReleaseDetailAvailableNotifications: showReleaseDetailAvailableNotifications};
    };
    
    this.loadNotifications    = function(){
        if(this.dataStorage.data.notifications == null){
            return null;
        }
        
        return this.dataStorage.data.notifications;
    };
        
};
