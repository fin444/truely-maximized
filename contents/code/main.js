// utils
var shouldHideTiled = false;

function shouldHideTitle(window) {
	if (monitorBlacklist.includes(window.output.name)) {
		return false;
	} else if (shouldHideTiled && window.tile !== null) {
		return true;
	} else {
		var area = workspace.clientArea(KWin.MaximizeArea, window);
		return Math.ceil(window.width) >= area.width && Math.ceil(window.height) >= area.height;
	}
}

// management code
var windowBlacklist = [];
var monitorBlacklist = [];
const managed = [];

function tryManage(window) {
	if (windowBlacklist.includes(window.resourceClass)) {
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

var lastScreenEdge = 0;
function screenEdgeActivated() {
	if (Date.now() - lastScreenEdge < 200) {
		// a bug in kwin sometimes causes a double trigger, so we enforce a 200ms cooldown
		return;
	}
	for (window of workspace.windowList()) {
		if (window.active) {
			if (isManaged(window) && shouldHideTitle(window)) {
				window.noBorder = !window.noBorder;
				lastScreenEdge = Date.now();
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
	windowBlacklist = readConfig("windowBlacklist", "yakuake").split(",").filter((name) => name.length != 0);
	monitorBlacklist = readConfig("monitorBlacklist", "").split(",").filter((name) => name.length != 0);
	shouldHideTiled = readConfig("shouldHideTiled", false);
	initScreenEdges();
}
options.configChanged.connect(init);
init();

// not part of init() bc it is called when config changed
for (window of workspace.windowList()) {
	windowAdded(window);
}
