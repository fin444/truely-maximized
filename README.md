# Truely Maximized

A Kwin script that truely maximizes your screen space by hiding the title bars of your windows when they are maximized.

Based on (but not forked from) [bahamondev/hide-titles](https://github.com/bahamondev/hide-titles)

## Features

* Dynamically hides/shows window titles based on maximization
* Automatically filters out potential breakages (e.g. GTK applications)
* Configurable blacklist
* Optional screen edge listener to toggle it off/on in case you need the title bar for a moment

## Contributing

PRs are welcome! Also feel free to contact me via email [fin444_dev@proton.me](mailto:fin444_dev@proton.me)

### Setup

Just clone the repo. `make` commands have been set up to do all the things.

* `make build` - Build the `.kwinscript` file
* `make clean` - Remove the `.kwinscript` file
* `make install` - Install the script to your Plasma
* `make uninstall` - Uninstall the script from your Plasma
* `make debug` - See `print()` outputs (unfortunately shows all kwin scripts on your system and does not update in real time)
