module.exports.loop = function () {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    Role.tick();

}

var Role = require('role');
function tick () {
    spawnTick();

    for (var name in Game.creeps) {
        Role.tick(Game.creeps[name]);
    }
}

function spawnTick () {
    var creepConfig = {
        farmer: { count: 3, body: [WORK, CARRY, MOVE] },
        builder: { count: 1, body: [WORK, CARRY, MOVE] }
    };

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        creepConfig[creep.memory.role].count -= 1;
        if (creepConfig[creep.memory.role].count == 0) delete creepConfig[creep.memory.role];
    }

    for (var role in creepConfig) {
        var { body } = creepConfig[role];
        Game.spawns.Spawn1.createCreep(body, undefined, {role: role, state: 'Initializing'});
        return ;
    }
}