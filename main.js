require('extend');
var Role = require('role');


module.exports.loop = function () {
    
    //for(var name in Game.rooms) {
    //    console.log('Room "'+name+'" has '+Game.rooms[name].energyAvailable+' energy');
    //}
    
    //console.log(`CPU bucket:${Game.cpu.bucket} tickLimit:${Game.cpu.tickLimit}`)

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    Role.tick();

}
