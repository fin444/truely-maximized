# Truely Maximized

A Kwin script that truely maximizes your screen space by hiding the title bars of your windows when they are maximized.

Plasma 6 version: https://www.pling.com/p/2136524/

Plasma 5 version: https://www.pling.com/p/2018573/

Based on (but not forked from) [bahamondev/hide-titles](https://github.com/bahamondev/hide-titles)

## Features

* Dynamically hides/shows window titles based on maximization
* Automatically filters out potential breakages (e.g. GTK applications)
* Configurable blacklist for windows and monitors
* Optional screen edge listener to toggle it off/on in case you need the title bar for a moment
* Optionally also hide window titles for tiled windows

![usage demonstration](https://images.pling.com/img/00/00/71/36/84/2018573/video.gif)

## Development

* `make build` - Build the `.kwinscript` file
* `make clean` - Remove the `.kwinscript` file
* `make install` - Install the script, you must disable and re-enable it to activate fully
* `make uninstall` - Uninstall the script
* `make debug` - See `print()` outputs (shows all kwin scripts on your system, some systems won't log print statements for some reason)
