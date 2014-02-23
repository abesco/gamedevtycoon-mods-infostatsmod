###InfoStatsMod Expansion Module - Version specific release branch###
*************************************************************************************************

**Provides detailed information and statistics to games released, provides charts and analysis **
**to game sales and financial themes.**

- Launch: 			December 09th, 2013
- Last Update:  February 23rd, 2014

#####ChangeLog Version 0.4.2#####

**Last Update:  February 23rd, 2014**

- Fixed errors in conjunction with the GameQuality calculation
- Fixed calculation of "Best Game Ever"
- Fixed annoying "Best Game Ever" notifications showing every week
- Fixed error when releasing a custom platform
- Fixed error when clicking on sales card of custom console
- Fixed erroneous height of engine specs list on lower resolutions


#####ChangeLog Version 0.4.1#####

**Last Update:  January 16th, 2014**

- Completely revised modal windows. Now works well with lower resolutions, too.
- Fixed problems when using the module with UltimateLib
- Implemented notification for when a game release analysis is available (can be configured)
- New feature allows to click on the game sales card to obtain detailed information about the game 

#####ChangeLog Version 0.4.0#####

**Last Update:  January 11th, 2014**

- Completely renewed bootstrap for js loading
- Added prototypes for String.format, endsWith, startsWith (.NET Style) through InfoStatsMod_Prototypes.js
- Footer profit is displayed in green or red depending if + or -
- New start text for text footer
- Revised mod menu
- Unified configuration
- Save success or fail displayed on screen
- New file structure for libs
- New released games column "Audience" for target audience
- New released games column "Q" for game quality
- Fixed Rank display (-1) for ranks lower than 0 and higher than 100. Now set to 0. Thanks to @Hexatan for the hint.

#####ChangeLog Version 0.3.2#####

**Last Update:  January 05th, 2014**

- Added new internal functions to "Utils" for providing more reliable "BestGameEver" calculation
- Added new notification when "BestGameEver" get's even better (previous record broken)
- Reviewed and optimized "WeekProceeded" event#
- Image folder now included (was missing previously)

