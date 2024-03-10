// utils
function isMaximized(client) {
    var area = workspace.clientArea(KWin.MaximizeArea, client);
    return client.width >= area.width && client.height >= area.height;
}

// management code
var blacklist = []; // initialized in init()
const managed = [];

function tryManage(client) {
	if (blacklist.includes(client.resourceClass.toString())) {
		return;
	}
	if (client.noBorder) {
		return; // If the border is already disabled, something else is managing it. We don't want to step on that.
	}
	managed.push(client.internalId);
}
function isManaged(client) {
	return managed.includes(client.internalId);
}

// listeners
function clientAdded(client) {
	tryManage(client);
	if (isManaged(client)) {
		if (isMaximized(client)) {
			client.noBorder = true;
		}
		client.maximizedChanged.connect(() => {
			client.noBorder = isMaximized(client);
		});
	}
}
workspace.windowAdded.connect(clientAdded);

workspace.windowRemoved.connect((client) => {
	if (isManaged(client)) {
		managed.splice(managed.indexOf(client.internalId), 1);
	}
});

// screen edge listener
function screenEdgeActivated() {
    for (client of workspace.windowList()) {
    	if (client.active) {
    		if (isManaged(client) && isMaximized(client)) {
    			client.noBorder = !client.noBorder;
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
	initScreenEdges();
}
options.configChanged.connect(init);
init();

for (client of workspace.windowList()) {
	clientAdded(client);
}
