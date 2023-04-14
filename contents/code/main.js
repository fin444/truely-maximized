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
workspace.clientAdded.connect((client) => {
	tryManage(client);
	if (isManaged(client) && isMaximized(client)) {
		client.noBorder = true;
	}
});

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

// init
for (client of workspace.clientList()) {
	tryManage(client);
}
