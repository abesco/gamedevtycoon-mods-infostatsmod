InfoStatsMod Expansion Module for GameDevTycoon
*************************************************************************************************************************
Provides detailed information and statistics to games released, provides charts and analysis to game sales and financial themes.
*************************************************************************************************************************
Launch:               December 09th, 2013
Last Update:          December 20th, 2013
*************************************************************************************************************************

ChangeLog Version:    0.3.0
Last Update:          December 20th, 2013
*************************************************************************************************************************
- Revised main module menu. 
- Implementation of the "Config" screen for "Released Games Analysis"
- Footer: Fixed calculation of best game (max profit was not passed correctly)
- Footer: Fixed score format (use avg) in the footer for game compliancy
- Released Games Analysis Config: Column Visibility with the option to save changes (save game relevant)
- Released Games Analysis: Game compliant number value formatting on costs
- Released Games Analysis: Datalist columns structure enhanced
- Released Games Analysis: Datalist columns are now dynamic and can be controlled within the mod
- Released Games Analysis: Games now only appear in the list when sales starts
- Released Games Analysis: Revised platform images. Now bigger size with nice label and dynamic image scale depending on platform count.
- Released Games Analysis: Fixed engine specs tech number format to max 2 decimal places
- Fixed an error encountered on startup when weekProceeded event was triggered without a best game - Thanks to SirEverard

ChangeLog Version:    0.2.0
Last Update:          December 19th, 2013
*************************************************************************************************************************

Release Notes
- This version works best on screen resolution with a width bigger than 1550 (w>=1550)
- This version has not been localized, thus it is only available in english
- This version is a development version and can differ in all of it's parts from the final version
- Big thanks and respect goes out to DzjengisKhan, LineLiar and kristof1104 for their inspiring and helpful mods: ExpansionPack for GDT by DzjengisKhan, LineLiar, CheatMod for GDT by kristof1104

- Almost complete reengineering of the code (using separate files and classes) - Still cleaning up and creating better structure
- Removed charts library in favour of the MIT licensed FLOT library to create better looking graphs and plots
- Released Games Analysis: Sales Graphical Analysis including weekly points
- Released Games Analysis: Tooltip on weekly sales points to exactly get income of a certain week (makes looking for profitable weeks easier)
- Released Games Analysis: Selected Tab remains selected when selecting different items in the data table list
- Released Games Analysis: Table sorting reviewed and fully implemented now
Footer: Game compliant number value formatting
Footer: Best game now calculated using highest score and highest profit
Sales Analysis: Remove access to feature in published version until it has reached a usable state

ChangeLog Version:    0.1.1
Last Update:          December 10th, 2013
*************************************************************************************************************************

Notes:
- This version works best on screen resolution with a width bigger than 1550 (w>=1550)
- This version has not been localized, thus it is only available in english
- This version is a development version and can differ in all of it's parts from the final version

Changelog:
- First public alpha release
- UI menu integration through "Info & Stats..." button (as seen in CheatMod by kristoff1104 - thanks!)
- Implementation of the "Release Details" view
- Release Details: Sortable table for detail information display of all releases
- Release Details: Display of selected game details upon row selection in the sortable game table
- Release Details: Tab based selection of additional information
- Release Details: Additional information - Reviews -> Display all magazines review incl. rating stars
- Release Details: Additional information - Engine Specs -> Display all used engine parts for the selected game
- Implementation of the "Sales Analysis" view
- Sales Analysis: Basic implementation of horizontal animated charts displaying the revenues of the game
- Implementation of the "Footer"
- Footer: Optionally overlay footer that displays financial information and the best game ever during the course of the game (live update on every week)
- Implementation of "Debug" functions (will be removed upon final release)
- Debug: Toggle Pause 