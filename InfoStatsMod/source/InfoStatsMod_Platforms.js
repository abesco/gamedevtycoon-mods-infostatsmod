/*
* Name:                 InfoStatsMod
* Class:                InfoStatsModAbescoUG_GameSystems   
* Description:          Class for handling and displaying "Game Systems" info & stats
* Copyright:            © 2013 Francesco Abbattista
* Url:                  http://www.abesco.de/
*/


var InfoStatsModAbescoUG_Platforms = function(infoStatsModCore) {
        var m      = this;
        var core   = infoStatsModCore;
                
        m.getReleasedPlatforms = function(){
            var ret         = [];
            var platforms   = Platforms.allPlatforms;
            
            for(var i = 0; i < platforms.length; i++){
                
                if (core.Utils.isPlatformReleased(platforms[i])){
                    ret.push(platforms[i]);
                }
            }
            
            return ret;
        };
        
        m.getUnlicensedPlatforms = function() {
            var ret         = [];
            var platforms   = Platforms.allPlatforms;
            
            for(var i = 0; i < platforms.length; i++){
                                
                if (core.Utils.isPlatformAvailable(platforms[i]) && !core.Utils.isPlatformLicensed(platforms[i])){
                    ret.push(platforms[i]);
                }
            }
            
            return ret;            
        };
        
        m.getLicensedPlatforms = function() {
            var ret         = [];
            var platforms   = Platforms.allPlatforms;
            
            for(var i = 0; i < platforms.length; i++){
                                
                if (core.Utils.isPlatformLicensed(platforms[i])){
                    ret.push(platforms[i]);
                }
            }
            
            return ret;             
        };
        
        m.getDiscontinuedPlatforms = function() {
            var ret         = [];
            var platforms   = Platforms.allPlatforms;
            
            for(var i = 0; i < platforms.length; i++){
                               
                if ( core.Utils.isPlatformDiscontinued(platforms[i])){
                    ret.push(platforms[i]);
                }
            }
            
            return ret;             
        };        
        
        
        // Shows the released game view
        m.showPlatforms = function() {
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
            
            var licensedPlatforms       = m.getLicensedPlatforms();
            var unlicensedPlatforms     = m.getUnlicensedPlatforms();
            var discontinuedPlatforms   = m.getDiscontinuedPlatforms();
            var releasedPlatforms       = m.getReleasedPlatforms();

                
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
                });
                
                $('.image_picker_image').attr({width:'0', height:'0'});
            }
            
            
            // $('.thumbnails').css({paddingLeft:'40px', border:'1px solid yellow'});
            
            $("#infostatsmod-platforms-group-tabs").tabs();
            
        
            if(GameManager.company.gameLog.length > 0)
            {
                

                
                if (docWidth >= 1550){
                }
                else {
                    
                }
                
                core.ModalWindowApi.resize("90%", '90%');
                $('#StatsModModalWindowWrapper').height(wrapperHeight);
            }
            else {
                core.ModalWindowApi.resize("640px","100px");
            }
            
        };
        
        // Shows the config for this feature
        m.showConfig = function() {
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
            
            var div  = $(document.createElement('div'));

            var colTable     = core.Utils.getNewTableElement({width:'360px'},'').attr({border:0, cellpadding:0, cellspacing:0});
            var colBody      = core.Utils.getNewTableBodyElement(null, '');
            var colRow1      = core.Utils.getNewTableRowElement(null, '');
            var colRow2      = core.Utils.getNewTableRowElement(null, '');
            var colRow3      = core.Utils.getNewTableRowElement(null, '');
            
            var colCellShowImages      = core.Utils.getNewTableCellElement(null, '').attr({ valign:'top', align:'left'});
            {
                    var checkboxtable       = core.Utils.getNewTableElement({width:'100%'}).attr({border:0, cellpadding:0, cellspacing:0});
                    var checkboxtablebody   = core.Utils.getNewTableBodyElement(null, '');
                    var checkboxrow         = core.Utils.getNewTableRowElement();
                    var checkboxcell1       = core.Utils.getNewTableCellElement(null, '').attr({width:'100px', valign:'middle', align:'left'});
                    var checkboxcell2       = core.Utils.getNewTableCellElement(null, '').attr({valign:'middle', align:'left'});
                    var checkbox            = $(document.createElement('input'));
                    
                    checkboxcell1.append('Show Images');

                    checkbox.css({width:'16px'}).attr({type:'checkbox', name:'infostatsmod-platforms-config-showimages', value:'1', checked:showImages});
                    checkbox.appendTo(checkboxcell2);
                    
                    checkboxcell1.appendTo(checkboxrow);
                    checkboxcell2.appendTo(checkboxrow);
                    checkboxrow.appendTo(checkboxtablebody);
                    checkboxtablebody.appendTo(checkboxtable);
                    checkboxtable.appendTo(colCellShowImages);          
                    
            }

            var colCellImageSize      = core.Utils.getNewTableCellElement(null, '').attr({valign:'middle', align:'left'});
            {
                    var selecttable       = core.Utils.getNewTableElement({width:'100%'}).attr({border:0, cellpadding:0, cellspacing:0});
                    var selecttablebody   = core.Utils.getNewTableBodyElement(null, '');
                    var selectrow         = core.Utils.getNewTableRowElement();
                    var selectcell1       = core.Utils.getNewTableCellElement(null, '').attr({width:'100px', valign:'middle', align:'left'});
                    var selectcell2       = core.Utils.getNewTableCellElement(null, '').attr({valign:'middle', align:'left'});
                    var select            = $(document.createElement('select'));
                    
                    selectcell1.append('Image size: ');                      

                    select.attr({size:1, name:'infostatsmod-platforms-config-imagesize', class:'', width:100});
                    select.append('<option name="" value="small"'+(imageSize=='small'?' selected':'')+'>small</option>');
                    select.append('<option name="" value="medium"'+(imageSize=='medium'?' selected':'')+'>medium</option>');
                    select.append('<option name="" value="large"'+(imageSize=='large'?' selected':'')+'>large</option>');
                    
                    select.appendTo(selectcell2);      
                    
                    selectcell1.appendTo(selectrow);
                    selectcell2.appendTo(selectrow);
                    selectrow.appendTo(selecttablebody);
                    selecttablebody.appendTo(selecttable);
                    selecttable.appendTo(colCellImageSize);
                    
                    
            }

            var colCellImageCols      = core.Utils.getNewTableCellElement(null, '').attr({valign:'middle', align:'left'});
            {
                    var selecttable       = core.Utils.getNewTableElement({width:'100%'}).attr({border:0, cellpadding:0, cellspacing:0});
                    var selecttablebody   = core.Utils.getNewTableBodyElement(null, '');
                    var selectrow         = core.Utils.getNewTableRowElement();
                    var selectcell1       = core.Utils.getNewTableCellElement(null, '').attr({width:'100px', valign:'middle', align:'left'});
                    var selectcell2       = core.Utils.getNewTableCellElement(null, '').attr({valign:'middle', align:'left'});
                    var select            = $(document.createElement('select'));
                    
                    selectcell1.append('Columns: '); 
                    
                    select.attr({size:1, name:'infostatsmod-platforms-config-imagecols', class:'', width:100});
                    select.append('<option name="" value="1"'+(imageCols=='1'?' selected':'')+'>1</option>');
                    select.append('<option name="" value="2"'+(imageCols=='2'?' selected':'')+'>2</option>');
                    select.append('<option name="" value="3"'+(imageCols=='3'?' selected':'')+'>3</option>');

                    select.appendTo(selectcell2);      
                    
                    selectcell1.appendTo(selectrow);
                    selectcell2.appendTo(selectrow);
                    selectrow.appendTo(selecttablebody);
                    selecttablebody.appendTo(selecttable);
                    selecttable.appendTo(colCellImageCols);      
                    
            }
            
            colCellShowImages.appendTo(colRow1);  
            colCellImageSize.appendTo(colRow2);  
            colCellImageCols.appendTo(colRow3);
            
            colRow1.appendTo(colBody);
            colRow2.appendTo(colBody);
            colRow3.appendTo(colBody);
            
            colBody.appendTo(colTable);
            colTable.appendTo(div);
                        
            
            var saveButton = $(document.createElement('div'));
            saveButton.text('Save').addClass('selectorButton').addClass('whiteButton').css({height:'24px',width:'80px', margin:'0px', lineHeight:'24px', fontSize:'12pt'});
            
            div.append('<hr>')
            saveButton.appendTo(div);
            
            var saveButtonOnClick = '';
            //' $("#'+core.Config.idReleaseGamesConfigContainer+'").find("input[type=checkbox]").filter(":checked").each(function(i,v){alert(v.name + " = " + v.value);});';
             
            saveButton.attr('onClick','javascript:UI.saveInfoStatsModPlatformsConfig(this)');
            
            core.ModalWindowApi.open(div.html());
            core.ModalWindowApi.resize(640, 480);
        };

        UI.saveInfoStatsModPlatformsConfig = function (a) {
            Sound.click();

            var target  = $(a).parent();
            var checkboxes = target.find('input[type=checkbox]');
            var selects    = target.find('select');
            var optShowImages = false;
            var optImageSize  = 'small';
            var optImageCols  = 1;
            
            selects.each(function(){
                var name      = $(this).attr('name');    
                var selected  = $(this).is(':selected');
            
                switch(name){
                    case 'infostatsmod-platforms-config-imagesize':
                        optImageSize = $(this).val();
                    break;
                    case 'infostatsmod-platforms-config-imagecols':
                        optImageCols = $(this).val();
                    break;
                }
            });

            checkboxes.each(function(){
                var name      = $(this).attr('name');    
                var checked   = $(this).is(':checked');
            
                switch(name){
                    case 'infostatsmod-platforms-config-showimages':
                        optShowImages = checked;
                    break;
                }
            });
                        
            core.Config.savePlatformsConfig(optShowImages, optImageSize, optImageCols);
            
            // --> core.Config.saveReleasedGamesConfig(cols);
        };    
        
        return m;
};      