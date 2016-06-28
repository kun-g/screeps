function repairAI (creep) {
    var targets = creep.room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return structure.hits < structure.hitsMax;
        }
    })
    .sort((a,b) => { return a.hits - b.hits; });

    if(targets.length) {
        if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0]);
        }
        return true;
    } else {
        return false;
    }
}

function buildAI (creep) {
    var target = creep.findNearest(FIND_CONSTRUCTION_SITES);
    if (target == null) {
        return false;
    }
    if(creep.build(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    }

    return true;
}

function harvestAI (creep) {
    var target = creep.findNearest(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN) &&
            structure.energy < structure.energyCapacity;
        }
    });
    if (target == null) {
        return false;
    } 

    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    }

    return true;
}

function upgradeAI (creep) {
    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
    }
}

// Worker
var Role = {
    
    config: {
    },

    findJobs: function () {
    },
    
    runner: {
    },

    tick: function () {

        //this.autoRespawn({role: 'worker', count: 10})

        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.carry.energy < creep.carryCapacity && creep.memory.state == 'Loading') {
                var source = creep.findNearest(FIND_SOURCES);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            } else {
                creep.memory.state = 'Working';

                if (harvestAI(creep)) {
                } else if (buildAI(creep)) {
                } else if (repairAI(creep)) {
                } else {
                    upgradeAI(creep);
                }

                if (creep.carry.energy == 0) {
                    creep.memory.state = 'Loading';
                }
            }
        }
    },

    autoRespawn: function ({role, count}) {
        var roles = _.filter(Game.creeps, (creep) => creep.memory.role == role);

        if(roles.length < count) {
            var newName = Game.spawns.Spawn1.createCreep([WORK, WORK, CARRY, CARRY, MOVE], undefined, {role: role});
            console.log('Spawning new ' + role +': ' + newName);
        }
    }

}
module.exports = Role;
