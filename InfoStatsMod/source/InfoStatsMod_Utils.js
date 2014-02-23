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
      
    this.printObjectMemberNamesAsAlert = function(o) {
          var out = '';
          for (var p in o) {
            out += p + ', ';
            // out += p +'\n';
          }
          alert(out);
      };
     
    this.printObjectMemberNamesInCommonDialog = function(o) {
          var out = '';
          for (var p in o) {
            out += p + ', ';
            // out += p +'\n';
          }
          $( "#infostatsmod-common-dialog" ).text(out);
          $( "#infostatsmod-common-dialog" ).show();
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
            
            namesDiv.css({backgroundColor:'#333333', border:'1px solid #000000', color:'#ffffff', opacity:'0.75'});
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
    
    this.toTitleCase = function(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };    
    
    this.isPlatformLicensed = function(platform) {
        var company = GameManager.company;
        var licensedPlatforms = company.licencedPlatforms;
        
        if ( licensedPlatforms == null || licensedPlatforms.length < 1) { return false; }
        
        for(var i = 0; i < licensedPlatforms.length; i++){
            if ( platform.id == licensedPlatforms[i].id ){
                return true;
            }
        }
        return false;
        
    };
    
    this.isPlatformReleased = function(platform) {
        var curWeek         = parseInt(Math.floor(GameManager.company.currentWeek));
        var publishWeek     = parseInt(Math.floor(Platforms.getPublishDate(platform)));
      
        return curWeek >= publishWeek;
    };
    
    this.isPlatformAvailable = function(platform) {
        var curWeek         = parseInt(Math.floor(GameManager.company.currentWeek));
        var retireWeek      = parseInt(Math.floor(Platforms.getRetireDate(platform)));
        var publishWeek     = parseInt(Math.floor(Platforms.getPublishDate(platform)));

        // alert("curWeek = " + curWeek + " - retireWeek = " + retireWeek + " - weekpublishWeekRetirePlatform = " + publishWeek);
        
        return curWeek >= publishWeek && curWeek <= retireWeek;
    };
    
    this.isPlatformDiscontinued = function(platform) {
        var curWeek         = parseInt(Math.floor(GameManager.company.currentWeek));
        var retireWeek      = parseInt(Math.floor(Platforms.getRetireDate(platform)));
        var publishWeek     = parseInt(Math.floor(Platforms.getPublishDate(platform)));
        
        return curWeek >= retireWeek;        
    };
    
    this.getRealGameReleaseAsIsoDate = function(game) {
        function preFillNumberWithZeros(a) {
            return 10 > a ? "0" + a : a
        };

        var releaseDate     = GameManager.company.getDate(game.releaseWeek);
        var releaseYear     = releaseDate.year + 1979;
        var releaseMonth    = releaseDate.month;
        var releaseWeek     = releaseDate.week;
        var releaseDay      = (releaseWeek * 7) - 6;
        // var releaseDateStr  = _utils.formatMoney(releaseDay,0,"","") + ". " + monthNames[releaseMonth] + " " + releaseYear;
        var releaseDateObj  = new Date(releaseYear, releaseMonth, releaseDay);
        return releaseDateObj.getUTCFullYear() + "-" + preFillNumberWithZeros(releaseDateObj.getUTCMonth() + 1) + "-" + preFillNumberWithZeros(releaseDateObj.getUTCDate()); 
    };
    
    this.getRealDateAsIsoDate = function(week) {
        function preFillNumberWithZeros(a) {
            return 10 > a ? "0" + a : a
        };
        
        week = parseInt(Math.floor(week));
                    
        var releaseDate     = GameManager.company.getDate(week);
        var releaseYear     = releaseDate.year + 1979;
        var releaseMonth    = releaseDate.month;
        var releaseWeek     = releaseDate.week;
        var releaseDay      = (releaseWeek * 7) - 6;
        // var releaseDateStr  = _utils.formatMoney(releaseDay,0,"","") + ". " + monthNames[releaseMonth] + " " + releaseYear;
        var releaseDateObj  = new Date(releaseYear, releaseMonth, releaseDay);
        return releaseDateObj.getUTCFullYear() + "-" + preFillNumberWithZeros(releaseDateObj.getUTCMonth() + 1) + "-" + preFillNumberWithZeros(releaseDateObj.getUTCDate()); 
    };      

    this.getRealDateAsDate = function(week) {
        week = parseInt(Math.floor(week));
        
        var releaseDate     = GameManager.company.getDate(week);
        
        var releaseYear     = releaseDate.year + 1979;
        var releaseMonth    = releaseDate.month;
        var releaseWeek     = releaseDate.week;
        var releaseDay      = (releaseWeek * 7) - 6;
        
        // var releaseDateStr  = _utils.formatMoney(releaseDay,0,"","") + ". " + monthNames[releaseMonth] + " " + releaseYear;
        return new Date(releaseYear, releaseMonth, releaseDay);
        
    };       
    
    this.getRealDateAsDateString = function(week) {
        week = parseInt(Math.floor(week));
        
        var releaseDate = m.getRealDateAsDate(week);
        var monthName   = m.getMonthName(releaseDate);
        var dayName     = m.getDayName(releaseDate);
        var year        = releaseDate.getFullYear();
        var day         = releaseDate.getDate();
        
        return dayName + " " + day + ". " + monthName + " " + year;
        
    };      
    
    this.getMonthName = function(date) {
        var m = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        return m[date.getMonth()];
    }

    this.getDayName = function(date) {
        var d = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        return d[date.getDay()];
    }
    
    this.getGuid = function() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
                     .toString(16)
                     .substring(1);
        };

        function guid() {
          return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                 s4() + '-' + s4() + s4() + s4();
        }
        
        return guid();
    };
    
    this.isDefined = function(obj){
       return typeof obj != 'undefined' && obj != null;
    };
    
    this.hasGameSales = function(game){
       
      return m.isDefined(game) && m.isDefined(game.salesCashLog) && game.salesCashLog.length > 0;  
    };
    
    this.hasGameBeenReviewed = function(game){
      return m.isDefined(game) && game.reviewMessageDisplayed;
    };
    
    this.getGame = function(id){
        var gmc = GameManager.company;
        for(var i = 0; i < gmc.gameLog.length; i++){
            if (gmc.gameLog[i].id == id){
                return gmc.gameLog[i];
            }
        }                    
        return;
    };

    this.gameExists = function(id) {
        return this.isDefined(this.getGame(id));
    };

    /**
     * @public
     * @function getGameQuality
     * @description Returns the game quality factor
     * @param {Game} game The game for which you want to acquire the game quality factor
     * @returns {float} A number indicating the game quality
    */             
    this.getGameQuality = function (g) {
        if (!this.isDefined(g)) {
            return {quality: 0, optimalRatio: 0, tdRatio: 0};
        }

        var pi = GameManager.company.gameLog.indexOf(g);
        var p  = pi > 0 ? pi - 1 : pi ? GameManager.company.gameLog[pi - 1] : null;
        

        var data = {
            // This is the optimal techdesign ratio according to: http://gamedevtycoon.wikia.com/wiki/Raw_Data_for_Review_Algorithm/1.4.3
            tdRatios: [ 1.8, 0.4, 0.6, 1.6, 1.6, 0.5],
            // Misc Multipliers for calculating 
            // scores for different games sizes
            // M1, M2, Optimal Team Size
            sizes:[ [1, 1, 1],   // Small
                    [2, 1.2, 3], // Medium
                    [3, 1.4, 5], // Large
                    [6, 1.6, 6]  // AAA
                  ],
            tdFactor: 0,
            sizeIndex: -1
        };
        
        var game = {
            topic:                      g.topic,
            genre:                      g.genre,
            secondGenre:                g.secondGenre,
            genreIndex:                 GameGenre.getAll().indexOf(g.genre),
            secondGenreIndex:           GameGenre.getAll().indexOf(g.secondGenre),
            platformGenreWeightings:    g.topic.genreWeightings,
            audienceWeightings:         g.topic.audienceWeightings,
            tdRatio:                    data.tdRatios[this.secondGenreIndex],
            sequel:                     g.flags.sequel,
            extensionPack:              g.flags.isExtensionPack,
            mmo:                        g.flags.mmo
        };
        
        var prev = {
            topic:                      p != null ? p.topic : null,
            genre:                      p != null ? p.genre : null,
            secondGenre:                p != null ? p.secondGenre : null,
            genreIndex:                 p != null ? GameGenre.getAll().indexOf(p.genre) : null,
            secondGenreIndex:           p != null ? GameGenre.getAll().indexOf(p.secondGenre) : null,
            platformGenreWeightings:    p != null ? p.topic != null ? p.topic.genreWeightings : null : null,
            audienceWeightings:         p != null ? p.topic != null ? p.topic.audienceWeightings : null : null,
            tdRatio:                    p != null ? data.tdRatios[this.secondGenreIndex] : null,
            sequel:                     p != null ? p.flags != null ? p.flags.sequel : null : null,
            extensionPack:              p != null ? p.flags != null ? pp.flags.isExtensionPack : null : null,
            mmo:                        p != null ? p.flags != null ? pp.flags.mmo : null : null,
            exists:                     p != null
        };

        var result = {
            ratio: 0,
            tdRatio: 0,
            quality: 1,
            same: false
        };

        switch(g.gameSize){
            case 'small':
                data.sizeIndex = 0;
            break;
            case 'medium':
                data.sizeIndex = 1;
            break;
            case 'large':
                data.sizeIndex = 2;
            break;
            case 'aaa':
                data.sizeIndex = 3;
            break;
        }
        
        data.tdFactor = (g.designPoints + g.technologyPoints) / (data.sizes[data.sizeIndex][1] * 2)
        
        // Get the optimal ratio
        result.ratio = game.tdRatio;
        
        if (game.secondGenreIndex != 6) {
            result.ratio = (result.ratio * 2 / 3) + (data.tdRatios[game.secondGenreIndex] / 3);
        }
        
        result.tdRatio   = (g.technologyPoints / g.designPoints).toFixed(1);
        result.ratio     = result.ratio.toFixed(1);
        
        if (g.technologyPoints + g.designPoints >= 30 && g.designPoints != 0) {
            var tf = (g.designPoints * result.ratio - g.technologyPoints) / Math.max(g.designPoints, g.technologyPoints);
            
            if (tf <= 0.25 && tf >= -0.25) {
                result.quality += 0.1;
            }
            else if (tf >  0.5  || tf <  -0.5)  {
                result.quality -= 0.1;
            }
        }
        
        // Assuming that optimal (slider) values have been applied 
        // NOTE: This must be changed to 
        result.quality += 0.2;
        result.same = false;   
        
        // The following calculations are only valid if there are more than 1 game released (basically for 99,9% of the game :P)
        if(prev != null){
            // If this game has the same topic/genre/genre2 combination, -0.4 penalty
            if (game.topic == prev.topic && 
                game.genreIndex == prev.genreIndex && 
                game.secondGenreIndex == prev.secondGenreIndex && 
                !game.sequel && !game.extensionPack) {
                
                    result.quality -= 0.4;
                    result.same = true;
            }
            // Provide calculations for MMO and for Topic/Genre/SecondGenre combination < 1. Subtract 0.15 from quality
            if (game.mmo && (game.platformGenreWeightings[game.genreIndex + 1] < 1 || 
                (prev.secondGenreIndex != 6 && prev.platformGenreWeightings[prev.secondGenreIndex + 1] < 1))) {
                result.quality -= 0.15;
            }
        }
        
        // Process game sequel
        // Note:
        // If it is not a sequel or expansion within a time range of 40 weeks then -0.4
        // If it is not a sequel on the same engine then -0.1
        if (game.sequel) {
            result.quality += 0.2;
        }

        return {quality: result.quality, optimalRatio: result.ratio, tdRatio: result.tdRatio};
    };    
}