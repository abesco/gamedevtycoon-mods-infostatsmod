/*
* Name:                 InfoStatsMod
* Class:                InfoStatsModAbescoUG_Config 
* Description:          Class for configuration
* Copyright:            © 2013, 2014 Francesco Abbattista
* Url:                  http://www.abesco.de/
*/

var InfoStatsModAbescoUG_Config = function() {
    
    // Ids for the various elements used
    this.idContainer                        = 'InfoStatsModContainer';
    this.idContextMenuTopArea               = 'InfoStatsModTop';
    this.idMainModalWindowNamespace         = 'InfoStatsMod';
    this.idMainModalWindowOverlay           = 'InfoStatsModGameDetailsModalWindowOverlay';
    this.idMainModalWindowOverlayContainer  = 'InfoStatsModGameDetailsModalWindowOverlayContainer';
    this.idDataStorage                      = 'InfoStatsModAbescoUG';
    this.idReleaseGamesConfigContainer      = 'InfoStatsModReleasedGamesConfigContainer';
    this.idPlatformDetailsConfigContainer   = 'InfoStatsModPlatformDetailsConfigContainer';
    this.idConfigStatusContainer            = 'InfoStatsModConfigStatusContainer';

    // The main data storage object to hold our settings
    this.dataStorage                        = GDT.getDataStore(this.idDataStorage);
    
    // Resets the settings in the storage class
    this.resetStorage = function() {
        this.dataStorage.data.releasedGamesConfig   = null;    
        this.dataStorage.data.platformsConfig       = null;    
    };
    
    // Saves the settings related to the released games analysis
    this.saveReleasedGamesConfig = function(dataListColumns) {
        this.dataStorage.data.releasedGamesConfig = {dataListColumns: dataListColumns};
    };
    
    // Load the settings related to the released games analysis
    this.loadReleasedGamesConfig = function(){
        if(this.dataStorage.data.releasedGamesConfig == null){
            return null;
        }
        
        return this.dataStorage.data.releasedGamesConfig.dataListColumns;
    };
    
    // Saves the settings related to the platforms analysis
    this.savePlatformsConfig = function(showPlatformImages, platformImageSize, platformImageColumnCount) {
        this.dataStorage.data.platformsConfig = {showPlatformImages: showPlatformImages, platformImageSize: platformImageSize, platformImageColumnCount: platformImageColumnCount};
    };
    
    // Load the settings related to the platforms analysis
    this.loadPlatformsConfig = function(){
        if(this.dataStorage.data.platformsConfig == null){
            return null;
        }
        
        return this.dataStorage.data.platformsConfig;
    };
    
    // Saves the settings related to the notifications
    this.saveNotifications = function(showBestGameNotifications, showReleaseDetailAvailableNotifications) {
        this.dataStorage.data.notifications = {showBestGameNotifications: showBestGameNotifications, showReleaseDetailAvailableNotifications: showReleaseDetailAvailableNotifications};
    };
    
    // Loads the settings related to the notifications
    this.loadNotifications    = function(){
        if(this.dataStorage.data.notifications == null){
            return null;
        }
        
        return this.dataStorage.data.notifications;
    };
};
