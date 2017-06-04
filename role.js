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

function upgradeAI (creep) {
    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
    }
}

function loadEnergy (creep) {
    if (creep.carry.energy < creep.carryCapacity) {
        var source = creep.findNearest(FIND_SOURCES);
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
        return false;
    }
    
    return true;
}

function worker(creep) {
    switch (creep.memory.state) {
        case 'Initializing': 
        case 'Loading':
            if (loadEnergy(creep)) {
                creep.memory.state = 'Unloading';
                worker(creep);
            }
        break;
        case 'Unloading':
            var target = creep.findNearest(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_CONTAINER) &&
                            structure.energy < structure.energyCapacity;
                }
            });

            if (target == null) return false;

            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            } else if (creep.carry.energy == 0) {
                creep.memory.state = 'Loading';
            }
        break;
    }
}

function builder(creep) {
    switch (creep.memory.state) {
        case 'Initializing':
        case 'Loading':
            if (loadEnergy(creep)) {
                creep.memory.state = 'Unloading';
                worker(creep);
            }
        break;
        case 'Unloading':
            var target = creep.findNearest(FIND_CONSTRUCTION_SITES);
            if (target == null) {
                return false;
            }
            var err = creep.build(target);
            
            switch (err) {
                case ERR_NOT_ENOUGH_RESOURCES: creep.memory.state = 'Loading'; break;
                case ERR_NOT_IN_RANGE: creep.moveTo(target); break;
            }
        break;
    }
}

var roleAI = {
    builder,
    farmer
}

var Role = {
    tick: function (creep) {
        if (roleAI[creep.memory.role]) {
            roleAI[creep.memory.role](creep);
        }
    }
}
module.exports = Role;