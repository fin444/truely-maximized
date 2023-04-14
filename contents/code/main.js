// utils
function isMaximized(client) {
    var area = workspace.clientArea(KWin.MaximizeArea, client);
    return client.width >= area.width && client.height >= area.height;
}

// management code
const blacklist = ["yakuake"];
const managed = [];

function tryManage(client) {
	if (blacklist.includes(client.resourceClass.toString())) {
		return;
	}
	if (client.noBorder) {
		return; // If the border is already disabled, something else is managing it. We don't want to step on that.
	}
	managed.push(client.frameId);
}
function isManaged(client) {
	return managed.includes(client.frameId);
}

// listeners
function clientAdded(client) {
	tryManage(client);
	if (isManaged(client) && isMaximized(client)) {
		client.noBorder = true;
	}
}
workspace.clientAdded.connect(clientAdded);

workspace.clientRemoved.connect((client) => {
	if (isManaged(client)) {
		managed.remove(client.frameId);
	}
});

workspace.clientMaximizeSet.connect((client, horizontalMaximized, verticalMaximized) => {
	if (isManaged(client)) {
		client.noBorder = isMaximized(client);
	}
});

// screen edge listener
function screenEdgeActivated() {
    for (client of workspace.clientList()) {
    	if (client.active) {
    		if (isManaged(client)) {
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
for (client of workspace.clientList()) {
	clientAdded(client);
}

options.configChanged.connect(initScreenEdges);
initScreenEdges();
