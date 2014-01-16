/*
* Name:                 InfoStatsMod
* Class:                InfoStatsModAbescoUG_Platforms   
* Description:          Class for handling and displaying "Platform" info & stats
* Copyright:            © 2013, 2014 Francesco Abbattista
* Url:                  http://www.abesco.de/
*/

var InfoStatsModAbescoUG_Platforms = function(infoStatsModCore) {
    var self   = this;
    var core   = infoStatsModCore;

    // Returns the platforms that have been released so far                
    self.getReleasedPlatforms = function(){
        var ret         = [];
        var platforms   = Platforms.allPlatforms;
        
        for(var i = 0; i < platforms.length; i++){
            
            if (core.Utils.isPlatformReleased(platforms[i])){
                ret.push(platforms[i]);
            }
        }
        
        return ret;
    };

    // Returns are currently unlicensed platforms
    self.getUnlicensedPlatforms = function() {
        var ret         = [];
        var platforms   = Platforms.allPlatforms;
        
        for(var i = 0; i < platforms.length; i++){
                            
            if (core.Utils.isPlatformAvailable(platforms[i]) && !core.Utils.isPlatformLicensed(platforms[i])){
                ret.push(platforms[i]);
            }
        }
        
        return ret;            
    };

    // Returns all platforms licensed so far
    self.getLicensedPlatforms = function() {
        var ret         = [];
        var platforms   = Platforms.allPlatforms;
        
        for(var i = 0; i < platforms.length; i++){
                            
            if (core.Utils.isPlatformLicensed(platforms[i])){
                ret.push(platforms[i]);
            }
        }
        
        return ret;             
    };

    // Returns all discontinued platforms
    self.getDiscontinuedPlatforms = function() {
        var ret         = [];
        var platforms   = Platforms.allPlatforms;
        
        for(var i = 0; i < platforms.length; i++){
                           
            if ( core.Utils.isPlatformDiscontinued(platforms[i])){
                ret.push(platforms[i]);
            }
        }
        
        return ret;             
    };        

    // Display platforms window
    self.showPlatforms = function() {
        var config = core.Config.loadPlatformsConfig();
        var showImages = config != null ? config.showPlatformImages : null;
        var imageSize  = config != null ? config.platformImageSize : null;
        var imageCols  = config != null ? config.platformImageColumnCount : null;
        
        if (showImages == null){
            showImages = true;
        }
        if (imageSize == null){
            imageSize = 'small';
        }
        if (imageCols == null){
            imageCols = 1;
        }
                    
        var doc                 = $(document);
        var docWidth            = doc.width();
        var docHeight           = doc.height();
        var modalWindowWidth    = parseInt(docWidth  * 0.9);
        var modalWindowHeight   = parseInt(docHeight * 0.9);
        var wrapperHeight       = modalWindowHeight - 10;
        var tableHeight         = wrapperHeight     - 120;
        var wrapperWidth        = modalWindowWidth  - 10;
        var wrapperHeight       = modalWindowHeight - 200;
        var tableWidth          = wrapperWidth      - 60;
                                                   
        var platforms = Platforms.allPlatforms;
        var company   = GameManager.company;
        
        var curDate  = company.getCurrentDate();
        var divWidth = docWidth >= 1550 ? 840 : tableWidth;
        
        var licensedPlatforms       = self.getLicensedPlatforms();
        var unlicensedPlatforms     = self.getUnlicensedPlatforms();
        var discontinuedPlatforms   = self.getDiscontinuedPlatforms();
        var releasedPlatforms       = self.getReleasedPlatforms();

            
        var html = '';
        
            html += 'Game Time: ' + curDate.year + "/" + curDate.month + "/" + curDate.week;
            html += '<br>';
                            
            
            
            html += '<div id="infostatsmod-platforms-group-tabs">';
            html += '<ul>';
            html += '<li><a href="#infostatsmod-platforms-group-tabs-1">Licensed Platforms</a></li>';
            html += ' <li><a href="#infostatsmod-platforms-group-tabs-2">Unlicensed Platforms</a></li>';
            html += '<li><a href="#infostatsmod-platforms-group-tabs-3">Discontinued Platforms</a></li>';
            html += '<li><a href="#infostatsmod-platforms-group-tabs-4">Released Platforms</a></li>';
            html += '</ul>';
            
            html += '<div id="infostatsmod-platforms-group-tabs-1">';

                html += '<div class="picker">';
                html += '<select class="image-picker show-html">';
                html += '<optgroup label="">';
                
                for(var i = 0; i < licensedPlatforms.length; i++){
                    var image     = Platforms.getPlatformImage(licensedPlatforms[i], company.currentWeek);
                    var labelStr  = licensedPlatforms[i].name;// + ' - Costs: ' + UI.getShortNumberString(licensedPlatforms[i].licencePrize);
                    
                    if(showImages){
                        html += '<option data-img-src="'+image+'" data-img-label="'+labelStr+'" value="'+i+'">'+labelStr+'</option>';
                    }
                    else {
                        html += '<option data-img-src="" data-img-label="'+labelStr+'" value="'+i+'">'+labelStr+'</option>';
                    }
                    
                    
                }
                
                html += '</optgroup>';
                html += '</select>';
                html += '</div>';
            
            html += '</div>';
            
            html += '<div id="infostatsmod-platforms-group-tabs-2">';

                html += '<div class="picker">';
                html += '<select class="image-picker show-html">';
                html += '<optgroup label="">';
                
                for(var i = 0; i < unlicensedPlatforms.length; i++){
                    var image     = Platforms.getPlatformImage(unlicensedPlatforms[i], company.currentWeek);
                    var labelStr  = unlicensedPlatforms[i].name;// + ' - Costs: ' + UI.getShortNumberString(unlicensedPlatforms[i].licencePrize);

                    if(showImages){
                        html += '<option data-img-src="'+image+'" data-img-label="'+labelStr+'" value="'+i+'">'+labelStr+'</option>';
                    }
                    else {
                        html += '<option data-img-src="" data-img-label="'+labelStr+'" value="'+i+'">'+labelStr+'</option>';
                    }                        
                    
                }
                
                html += '</optgroup>';
                html += '</select>';
                html += '</div>';
            
            html += '</div>';
            
            html += '<div id="infostatsmod-platforms-group-tabs-3">';

                html += '<div class="picker">';
                html += '<select class="image-picker show-html">';
                html += '<optgroup label="">';
                
                for(var i = 0; i < discontinuedPlatforms.length; i++){
                    var image     = Platforms.getPlatformImage(discontinuedPlatforms[i], company.currentWeek);
                    var labelStr  = discontinuedPlatforms[i].name;// + ' - Costs: ' + UI.getShortNumberString(discontinuedPlatforms[i].licencePrize);

                    if(showImages){
                        html += '<option data-img-src="'+image+'" data-img-label="'+labelStr+'" value="'+i+'">'+labelStr+'</option>';
                    }
                    else {
                        html += '<option data-img-src="" data-img-label="'+labelStr+'" value="'+i+'">'+labelStr+'</option>';
                    }                          
                    
                }
                
                html += '</optgroup>';
                html += '</select>';
                html += '</div>';
            
            html += '</div>';
                            
            html += '<div id="infostatsmod-platforms-group-tabs-4">';

                html += '<div class="picker">';
                html += '<select class="image-picker show-html">';
                html += '<optgroup label="">';
                
                for(var i = 0; i < releasedPlatforms.length; i++){
                    var image     = Platforms.getPlatformImage(releasedPlatforms[i], company.currentWeek);
                    var labelStr  = releasedPlatforms[i].name;// + ' - Costs: ' + UI.getShortNumberString(releasedPlatforms[i].licencePrize);
                    

                    if(showImages){
                        html += '<option data-img-src="'+image+'" data-img-label="'+labelStr+'" value="'+i+'">'+labelStr+'</option>';
                    }
                    else {
                        html += '<option data-img-src="" data-img-label="'+labelStr+'" value="'+i+'">'+labelStr+'</option>';
                    }                          
                    
                }
                
                html += '</optgroup>';
                html += '</select>';
                html += '</div>';
            
            html += '</div>';
                            
            html += '</div>';


    //                html += '<option>';
    //                html += 'Name: '            + platforms[i].name;
    //                html += '</option>';
    //                html += '<option>';
    //                html += 'Company: '         + platforms[i].company;
    //                html += '</option>';
    //                html += '<option>';
    //                html += 'Units sold: '      + platforms[i].unitsSold;
    //                html += '</option>';
    //                html += '<option>';
    //                html += 'License price: '   + platforms[i].licencePrize;
    //                html += '</option>';
    //                html += '<option>';
    //                html += 'Published: '       + platforms[i].published;
    //                html += '</option>';
    //                html += '<option>';
    //                html += 'Retire Date: '     + platforms[i].platformRetireDate;
    //                html += '</option>';
    //                html += '<option>';
    //                html += 'Development Costs: ' + platforms[i].developmentCosts;
    //                html += '</option>';
    //                html += '<option>';
    //                html += 'Tech Level: '      + platforms[i].techLevel;
    //                html += '</option>';
    //                html += '<option>';
    //                html += 'Version: '         + platforms[i].version;
    //                html += '</option>';
    //                html += '<option>';
    //                html += 'Available: '         + isAvailable;
    //                html += '</option>';
    //                html += '<option>';
    //                html += 'Licensed: '         + isLicensed;
    //                html += '</option>';
    //                
    //                html += '<option>';
    //                html += '-----------------------------------------------';
    //                html += '</option>';
                         
        core.ModalWindowApi.open("<h5>Under development</h5><br>"+html);

        $(".image-picker").imagepicker({
          hide_select : false,
          show_label  : true
        })
        
        
        if (showImages){
            var thumbnailsWidth     = 0;
            
            switch(imageSize)
            {
                case 'small':
                    thumbnailsWidth     = 120 * imageCols;
                                
                    $('.thumbnails').css({width:thumbnailsWidth+'px', height:wrapperHeight+'px'});
                    $('.thumbnail').css({width:'75px', height:'120px'});
                    $('.image_picker_image').attr({width:'75', height:'75'});
                break;

                case 'medium':
                    thumbnailsWidth     = 160 * imageCols;

                    $('.thumbnails').css({width:thumbnailsWidth+'px', height:wrapperHeight+'px'});
                    $('.thumbnail').css({width:'100px', height:'140px'});
                    $('.image_picker_image').attr({width:'100', height:'100'});
                break;

                case 'large':
                    thumbnailsWidth     = 260 * imageCols;

                    $('.thumbnails').css({width:thumbnailsWidth+'px', height:wrapperHeight+'px'});
                    $('.thumbnail').css({width:'200px', height:'240px'});
                    $('.image_picker_image').attr({width:'200', height:'200'});
                break;
                
            } 
            
            $('.thumbnail').each(function(v){
                $(this).css({textAlign:'center'});
            });                
        }
        else {
            var thumbnailsWidth     = 220 * imageCols;
            
            $('.thumbnails').css({width:thumbnailsWidth+'px', height:wrapperHeight+'px'});
            $('.thumbnail').css({width:'160px', height:'20px'});
            $('.thumbnail').each(function(v){
                var txt = $(this).text();
                $(this).text(txt);
                $(this).css({fontWeight:'bold'});
                $(this).click(function(e){
                    alert("hj");
                });
            });
            
            $('.image_picker_image').attr({width:'0', height:'0'});
        }
        
        
        // $('.thumbnails').css({paddingLeft:'40px', border:'1px solid yellow'});
        
        $("#infostatsmod-platforms-group-tabs").tabs();
        

        if (docWidth >= 1550){
        }
        else {
            
        }
        
        core.ModalWindowApi.resize("90%", '90%');
        $('#StatsModModalWindowWrapper').height(wrapperHeight);
    };

    return self;
};      