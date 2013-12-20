/*
* Name:                 InfoStatsMod
* Class:                InfoStatsModAbescoUG_Utils  
* Description:          General Utilities Class for the InfoStatsMod
* Copyright:            © 2013 Francesco Abbattista
* Url:                  http://www.abesco.de/
*/

var InfoStatsModAbescoUG_Utils = function(infoStatsModCore){
    var m       = this;
    var core    = infoStatsModCore;
    
    // Formats the specified value with the desired format
    this.formatMoney = function(value, c, d, t){
        var n = value, 
            c = isNaN(c = Math.abs(c)) ? 2 : c, 
            d = d == undefined ? "." : d, 
            t = t == undefined ? "," : t, 
            s = n < 0 ? "-" : "", 
            i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
            j = (j = i.length) > 3 ? j % 3 : 0;
           return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    };
    
    // Used for debugging
    this.printObject = function(o) {
          var out = '<div id="printObjectOutput" title="Print Object Debug" style="height:400px; overflow:scroll">';
          for (var p in o) {
            // out += p + ': ' + o[p] + '<br>';
            out += p +'<br>';
          }
          out += '</div>';
          
          core.ModalWindowApi.open(out);

    };
    
    // Also used for debugging
    this.printObjectAsAlert = function(o) {
          var out = '';
          for (var p in o) {
            out += p + ': ' + o[p] + '\n';
            // out += p +'\n';
          }
          alert(out);
      };
      
    // Function for quick creating a new table row element
    this.getNewTableRowElement = function(css, content){
            var el = $(document.createElement('tr'));
            if(css != null){
                el.css(css);
            }
            if(content != null){
                el.append(content);
            }
            return el;         
    };

    // Function for quick creating a new table cell element
    this.getNewTableCellElement = function(css, content){
            var el = $(document.createElement('td'));
            if(css != null){
                el.css(css);
            }
            if(content != null){
                el.append(content);
            }
            return el;         
    };
    
    // Function for quick creating a new table element
    this.getNewTableElement = function(css, content) {
            var el = $(document.createElement('table'));
            if(css != null){
                el.css(css);
            }
            if(content != null){
                el.append(content);
            }
            return el;              
    };
    
    // Function for quick creating a new table head element
    this.getNewTableHeadElement = function(css, content) {
            var el = $(document.createElement('thead'));
            if(css != null){
                el.css(css);
            }
            if(content != null){
                el.append(content);
            }
            return el;               
    };
    
    // Function for quick creating a new table body element
    this.getNewTableBodyElement = function(css, content) {
            var el = $(document.createElement('tbody'));
            if(css != null){
                el.css(css);
            }
            if(content != null){
                el.append(content);
            }
            return el;
    };
        
    // Function for quick creating a new table header element
    this.getNewTableHeaderElement = function(css, content) {
            var el = $(document.createElement('th'));
            if(css != null){
                el.css(css);
            }
            if(content != null){
                el.append(content);
            }
            return el;    
    };

    // Creates a modal div element
    this.createModalWindowAsDivElement = function(id, width, height, callbackClosed){
        var $div = $(document.createElement('div'));
        $div.attr('id',id);
        $div.css('width', width).css('height', height);
        
        var $closeButton = $(document.createElement('a'));
        
        $closeButton.click(function(){
            $div.remove();
            if(callbackClosed){
                callbackClosed();
            }
        });
        
        $closeButton.attr('href','#');
        $closeButton.text("Close");
        $closeButton.css('right','10px').css('float','right');
        $closeButton.css('top','5px');

        $div.append($closeButton);
        
        return $div;
        
    };
    
    // Function to create and return the rating star display       
    this.getRatingStarsAsDivElement = function(score, showText, scaleTo) {
        var $div    = $(document.createElement('div'));

        var arr     = String(score).split('.');
        var ful     = parseInt(arr[0]);
        var dec     = parseInt(arr[1]);
        var scaling = 16 * scaleTo;
                   
        // Create full stars for the main score
        for(var i = 1; i < 11; i++)
        {
            var $img = $(document.createElement('img'));
            
            if ( i <= ful ) {
                $img.attr('src','./mods/InfoStatsMod/img/rating_4.png');
            }
            else if ( i == ful + 1 && dec > 0){
                if (dec >= 75){
                    $img.attr('src','./mods/InfoStatsMod/img/rating_3.png');
                }
                else if(dec >= 50 || dec == 5){
                    $img.attr('src','./mods/InfoStatsMod/img/rating_2.png');
                }
                else if(dec >= 25){
                    $img.attr('src','./mods/InfoStatsMod/img/rating_1.png');
                }
            }
            else {
                $img.attr('src','./mods/InfoStatsMod/img/rating_0.png');
            }
            
            if(scaling != 100){
                $img.attr('width',scaling);
                $img.attr('height',scaling);
            }
            
            $div.append($img);
        } 
        
        if ( showText ){
            var scoreText = m.formatMoney(score, 2, ',', '.');
            var $text = $(document.createElement('span')).text(' ('+scoreText+')'); 
            $div.append($text);
        }
        
        return $div;
    };
    
    // Function to create and return a div element containing the platform images of the specified game
    this.getGamePlatformImagesAsDivElement = function(game){
        var gamePlatformImages      = [];
        var gamePlatformCompanies   = [];
        var gamePlatformNames       = [];
        var gamePlatformCount       = game.platforms.length;
        
        // Acquire platform images
        for(var i = 0; i < gamePlatformCount; i++){
            gamePlatformImages[i]       = Platforms.getPlatformImage(game.platforms[i], game.releaseWeek);
            gamePlatformCompanies[i]    = game.platforms[i].company;
            gamePlatformNames[i]        = game.platforms[i].name;
        }   
        
        // Remove previous element if exists
        $('body').find('#InfoStatsModGamePlatformImages').remove();
        
        // Create new element
        var divPlatformImages = $(document.createElement('div'));
        divPlatformImages.attr('id', 'InfoStatsModGamePlatformImages');
        
        divPlatformImages.css('border','0px dashed #cccccc').css('border-top-width','1px');
        
        var imgTable        = m.getNewTableElement(null, '').attr({width:'100%', height:250, cellpadding:2, cellspacing:2, border:0});
        var imgTableBody    = m.getNewTableBodyElement(null, '').appendTo(imgTable);
        var imgTableRow     = m.getNewTableRowElement(null, '').appendTo(imgTableBody);
        var imgScale        = 1.0 - ((gamePlatformCount-1)*0.05);
        var imgSize         = 200 * imgScale;
        var imgTableSize    = (200 * gamePlatformCount) * imgScale;
        var imgTableCellSize= parseInt(100 / gamePlatformCount) + '%';
        
        imgTable.width(imgTableSize);
        
        for(var i = 0; i < gamePlatformCount; i++){
            var imgTableCell = m.getNewTableCellElement({textAlign:'center'}, '').attr({width: imgTableCellSize, valign:'top', align:'center'});
            var img          = $(document.createElement('img')).attr('src',gamePlatformImages[i]).attr('title', gamePlatformCompanies[i]+' '+gamePlatformNames[i]);
            var namesDiv     = $(document.createElement('div')).css({width:'100%', textAlign:'center', position:'relative', top:'-2px'});
            
            namesDiv.css({backgroundColor:'#333333', border:'1 px solid #000000', color:'#ffffff', opacity:'0.75'});
            img.css('-webkit-transform','scale('+imgScale+')');            
            img.attr({width:imgSize, height:imgSize});
                                           
            var nameElem       = $(document.createElement('h4'));
            var compNameElem   = $(document.createElement('h5'));
            
            compNameElem.text(gamePlatformCompanies[i]);
            nameElem.text(gamePlatformNames[i]);
            
            namesDiv.append(compNameElem).append(nameElem);
            
            imgTableCell.append(img).append(namesDiv);
            imgTableRow.append(imgTableCell);
           
            // $img.css({position:'absolute'});
        }
        
        divPlatformImages.append(imgTable);
        
        return divPlatformImages;
    };    
    
    this.getDetailedTopicName = function(game) {
        return game.secondGenre ? game.topic.name + "/" + game.genre.name + "-" + game.secondGenre.name : game.topic.name + "/" + game.genre.name;
    };
        
    this.getTopicName = function(game) {
        return game.topic.name;
    };

    this.getGenreName = function(game) {
        return game.secondGenre ? game.genre.name + " - " + game.secondGenre.name : game.genre.name;
    };
    
    this.toTitleCase = function(str)
    {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };    
        
}