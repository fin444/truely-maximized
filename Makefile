clean:
	@rm -f truely-maximized.kwinscript

build: clean
	@zip truely-maximized.kwinscript -r contents LICENSE metadata.json

uninstall:
	@-kpackagetool6 -t KWin/Script -r truely-maximized

install: uninstall build
	@kpackagetool6 -t KWin/Script -i truely-maximized.kwinscript
	@rm -f truely-maximized.kwinscript

debug:
	journalctl -g "js: " -f
