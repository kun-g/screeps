var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');

// Worker
var Role = {
    
    config: {
    },

    tick: function () {

        this.autoRespawn({role: 'harvester', count: 1})
        this.autoRespawn({role: 'builder', count: 2})
        this.autoRespawn({role: 'upgrader', count: 2})
        this.autoRespawn({role: 'repairer', count: 2})

        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
            } else if(creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            } else if(creep.memory.role == 'builder') {
                roleBuilder.run(creep);
            } else if (creep.memory.role == 'repairer') {
                roleRepairer.run(creep);
            }
        }

    },

    autoRespawn: function ({role, count}) {
        var roles = _.filter(Game.creeps, (creep) => creep.memory.role == role);

        if(roles.length < count) {
            var newName = Game.spawns.Spawn1.createCreep([WORK,CARRY,MOVE], undefined, {role: role});
            console.log('Spawning new ' + role +': ' + newName);
        }
    }

}
module.exports = Role;
