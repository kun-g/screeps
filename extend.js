// extend basic classes
//
// Creep
Creep.prototype.findNearest = function (type, opts) {
    var result = this.room.find(type, opts);
    result.sort((a, b) => { return this.pos.getRangeTo(a) - this.pos.getRangeTo(b); });
    return result[0];
}

// Room
