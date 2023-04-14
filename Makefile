clean:
	@rm -f truely-maximized.kwinscript

build: clean
	@zip truely-maximized.kwinscript -r contents LICENSE metadata.json

uninstall:
	@-plasmapkg2 -t kwinscript -r truely-maximized

install: uninstall build
	@plasmapkg2 -t kwinscript -i truely-maximized.kwinscript
	@rm -f truely-maximized.kwinscript

debug:
	journalctl -g "js: " -f
