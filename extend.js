// extend basic classes
//
// Creep
Creep.prototype.findNearest = function (type, opts) {
    var result = this.room.find(type, opts);
    result.sort((a, b) => { return this.pos.getRangeTo(a) - this.pos.getRangeTo(b); });
    return result[0];
}

// Room


// extend basic classes
//
// Creep
Creep.prototype.findNearest = function (type, opts) {
    var result = this.room.find(type, opts);
    result.sort((a, b) => { return this.pos.getRangeTo(a) - this.pos.getRangeTo(b); });
    return result[0];
}

// Room
function countObstacle(roomObject) {
    var x = roomObject.pos.x,
        y = roomObject.pos.y;
    var res = roomObject.room.lookAtArea(y - 1, x - 1, y + 1, x + 1, true);
    var count = res.filter((e) => {
        return e.type == 'terrain' && e.terrain == 'wall';
    }).length;

    return count;
}

Room.prototype.findSource = function () {
    if (this.memory.sources == null) {
        var sources = this.find(FIND_SOURCES);
        this.memory.sources = sources.map((e) => {
            return {
                id: e.id,
                slotTotal: 9-countObstacle(e),
                slotTaken: 0
            };
        });
    }
    return this.memory.sources.filter((e) => { return e.slotTaken < e.slotTotal; })
                              .map((e) => { return Game.getObjectById(e.id); });
};

Room.prototype.holdSource = function (source) {
    var res = this.memory.sources.filter((e) => { return e.id == source.id; });
    if (res[0] && res[0].slotTaken > 0) {
        res[0].slotTaken -= 1;
    }
};

Room.prototype.releaseSource = function () {
    var res = this.memory.sources.filter((e) => { return e.id == source.id; });
    if (res[0] && res[0].slotTaken < res[0].slotTotal) {
        res[0].slotTaken += 1;
    }
};

//console.log(`CPU bucket:${Game.cpu.bucket} tickLimit:${Game.cpu.tickLimit}`)
//console.log(`GCL level:${Game.gcl.level} progress:${Game.gcl.progress} total:${Game.gcl.progressTotal}`)
