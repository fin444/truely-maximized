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

## Contributing

PRs are welcome! Also feel free to contact me via email [fin444_dev@proton.me](mailto:fin444_dev@proton.me)

### Setup

Just clone the repo. `make` commands have been set up to do all the things.

* `make build` - Build the `.kwinscript` file
* `make clean` - Remove the `.kwinscript` file
* `make install` - Install the script to your Plasma
* `make uninstall` - Uninstall the script from your Plasma
* `make debug` - See `print()` outputs (shows all kwin scripts on your system)
