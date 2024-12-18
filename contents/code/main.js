// utils
var shouldHideTiled = false;

function shouldHideTitle(window) {
	if (shouldHideTiled && window.tile !== null) {
		return true;
	}
	var area = workspace.clientArea(KWin.MaximizeArea, window);
	return window.width >= area.width && window.height >= area.height;
}

// management code
var blacklist = []; // initialized in init()
const managed = [];

function tryManage(window) {
	if (blacklist.includes(window.resourceClass)) {
		return;
	}
	if (window.noBorder) {
		return; // if the border is already disabled, something else is managing it - don't mess with that
	}
	managed.push(window.internalId);
}
function isManaged(window) {
	return managed.includes(window.internalId);
}

// listeners
function windowAdded(window) {
	tryManage(window);
	if (isManaged(window)) {
		if (shouldHideTitle(window)) {
			window.noBorder = true;
		}
		function statusChanged() {
			window.noBorder = shouldHideTitle(window);
		}
		// always connect all signals even if the related option is disabled
		// to support config hot reloading if KWin supports that
		window.maximizedChanged.connect(statusChanged);
		window.tileChanged.connect(statusChanged);
	}
}
workspace.windowAdded.connect(windowAdded);

workspace.windowRemoved.connect((window) => {
	if (isManaged(window)) {
		managed.splice(managed.indexOf(window.internalId), 1);
	}
});

function screenEdgeActivated() {
	for (window of workspace.windowList()) {
		if (window.active) {
			if (isManaged(window) && shouldHideTitle(window)) {
				window.noBorder = !window.noBorder;
			}
			return;
		}
	}
}

// magic code to register a screen edge listener that the user can then configure in screen edges settings
// it's just done this way, there isn't really an explanation in the docs
var registeredBorders = [];
function initScreenEdges() {
	for (var i in registeredBorders) {
		unregisterScreenEdge(registeredBorders[i]);
	}
	registeredBorders = [];
	var borders = readConfig("BorderActivate", "").toString().split(",");
	for (var i in borders) {
		var border = parseInt(borders[i]);
		if (isFinite(border)) {
			registeredBorders.push(border);
			registerScreenEdge(border, screenEdgeActivated);
		}
	}
}

// init
function init() {
	blacklist = readConfig("blacklist", "yakuake").split(",").filter((name) => name.length != 0);
	shouldHideTiled = readConfig("shouldHideTiled", false);
	initScreenEdges();
}
options.configChanged.connect(init);
init();

// not part of init() bc it is called when config changed
for (window of workspace.windowList()) {
	windowAdded(window);
}
