import {_DEBUG_FAST_CONSTRUCT} from "../game_state/Play";

const DATA = {
    AdvancedGuardTower: {
        cellPositions: [
            [0, 0],
        ],
        constructable: true,
        constructable_units: [],
        construction_time: 66,
        life: 300,
        options: {
            shoot_air_power: 60,
            shoot_cooldown: 40,
            shoot_distance: 6,
            shoot_power: 60,
        },
        power: -20,
        price: 1000,
        requireds: [
            'CommunicationCenter',
        ],
        sight: 4,
        sprite_layer: 5,
        sprites: ['Artilery2', 'Artilery2'],
    },
    AdvancedPowerPlant: {
        cellPositions: [
            [0, 0],
            [1, 0],
            [0, -1],
            [1, -1],
        ],
        constructable: true,
        constructable_units: [],
        construction_time: 47,
        life: 300,
        power: 200,
        price: 700,
        requireds: [
            'PowerPlant',
        ],
        sight: 2,
        sprite_layer: 0,
        sprites: ['Generator', 'Generator'],
    },
    Barracks: {
        cellPositions: [
            [0, 0],
            [1, 0],
            [0, -1],
            [1, -1],
        ],
        constructable: true,
        constructable_units: [
            'MinigunInfantry', 'Grenadier', 'RocketSoldier', 'Engineer',
        ],
        construction_time: 20,
        life: 400,
        power: -20,
        price: 300,
        requireds: [
            'PowerPlant',
        ],
        sight: 3,
        sprite_layer: 0,
        sprites: ['Module', 'Module'],
    },
    CommunicationCenter: {
        cellPositions: [
            [0, 0],
            [1, 0],
        ],
        constructable: true,
        constructable_units: [],
        construction_time: 66,
        life: 500,
        power: -40,
        price: 1000,
        requireds: [
            'TiberiumRefinery',
        ],
        sight: 10,
        sprite_layer: 0,
        sprites: ['Silo', 'Silo'],
    },
    ConcreteBarrier: {
        cellPositions: [[0, 0]],
        constructable: true,
        constructable_units: [],
        construction_time: 7,
        life: 100,
        price: 100,
        requireds: ['ConstructionYard'],
        sight: 0,
        sprite_layer: 0,
        sprites: ['Wall', 'Wall'],
    },
    ConstructionYard: {
        cellPositions: [
            [0, 0],
            [1, 0],
        ],
        constructable: false,
        constructable_units: [],
        life: 400,
        power: -20,
        sight: 3,
        sprites: ['MinerAnip1', 'MinerAnip2'],
    },
    GuardTower: {
        cellPositions: [
            [0, 0],
            [1, 0],
        ],
        constructable: true,
        constructable_units: [],
        construction_time: 33,
        life: 200,
        options: {
            shoot_cooldown: 50,
            shoot_distance: 4,
            shoot_power: 25,
        },
        power: -10,
        price: 500,
        requireds: [
            'Barracks',
        ],
        sight: 2,
        sprite_layer: 5,
        sprites: ['Turret', 'Turret'],
    },
    Helipad: {
        cellPositions: [
            [0, 0],
            [1, 0],
            [0, -1],
            [1, -1],
            [0, -2],
            [1, -2],
        ],
        constructable: true,
        constructable_units: ['Chinook', 'Orca'],
        construction_time: 100,
        life: 400,
        power: -10,
        price: 1500,
        requireds: [
            'Barracks',
        ],
        sight: 3,
        sprite_layer: 16,
        sprites: ['Starport', 'Starport'],
    },
    PowerPlant: {
        cellPositions: [
            [0, 0],
            [1, 0],
            [0, -1],
            [1, -1],
        ],
        constructable: true,
        constructable_units: [],
        construction_time: 20,
        life: 200,
        power: 100,
        price: 300,
        requireds: [
            'ConstructionYard',
        ],
        sight: 2,
        sprite_layer: 0,
        sprites: ['Factory2p1', 'Factory2p2'],
    },
    TiberiumRefinery: {
        cellPositions: [
            [0, 0],
            [1, 0],
            [0, -1],
            [1, -1],
        ],
        constructable: true,
        constructable_units: [
            'Harvester',
        ],
        construction_time: 73,
        life: 450,
        power: -40,
        price: 2000,
        requireds: [
            'PowerPlant',
        ],
        sight: 4,
        sprite_layer: 0,
        sprites: ['Factory3', 'Factory3'],
    },
    TiberiumSource: {
        cellPositions: [
            [0, 0],
        ],
        constructable: false,
    },
    WeaponsFactory: {
        cellPositions: [
            [0, 0],
            [1, 0],
            [0, -1],
            [1, -1],
        ],
        constructable: true,
        constructable_units: [
            'HummVee', 'MediumTank', 'RocketLauncher', 'MCV', 'MamoothTank', 'Harvester',
        ],
        construction_time: 133,
        life: 200,
        power: -30,
        price: 2000,
        requireds: [
            'TiberiumRefinery',
        ],
        sight: 3,
        sprite_layer: 0,
        sprites: ['Base', 'Base'],
    }
};

/**
 * Buildings:
 * - construction yard    : MinerAni
 * - power plant          : Factory2
 * - advanced power plant : Generator
 * - barracks             : Module
 * - tiberium refinery    : Factory3
 * - comm center          : Silo
 * - concrete barrier     : Wall
 * - repair facility      : TradPlat
 * - guard tower          : Turret
 * - helipad              : Starport
 * - weapons factory      : Base
 * - silo                 : Storage1
 * - advanced guard tower : Artilery2
 */
export class BuildingProperties {
    static getCellPositions(buildingName: string): PIXI.Point[] {
        return DATA[buildingName].cellPositions.map((position) => {
            return new PIXI.Point(position[0], position[1]);
        });
    }

    static getConstructableBuildings(): string[] {
        return Object.keys(DATA).filter((buildingKey) => {
            return DATA[buildingKey].constructable;
        });
    }

    static getSpriteKey(buildingName: string, playerId: number): string {
        return DATA[buildingName].sprites[playerId];
    }

    static getSpriteLayer(buildingName: string): number {
        return DATA[buildingName].sprite_layer;
    }

    static getConstructableUnits(buildingName: string): string[] {
        return DATA[buildingName] ? DATA[buildingName].constructable_units || [] : [];
    }

    static getRequiredBuildings(buildingName: string): string[] {
        return DATA[buildingName].requireds;
    }

    static getConstructionTime(buildingName: string): number {
        if (_DEBUG_FAST_CONSTRUCT) {
            return DATA[buildingName].construction_time / 100;
        }
        return DATA[buildingName].construction_time / 6;
    }

    static getPrice(buildingName: string): number {
        return DATA[buildingName].price;
    }

    static getLife(buildingName: string): number {
        return DATA[buildingName].life;
    }

    static getOption(buildingName: string, optionName: string): any {
        return DATA[buildingName].options[optionName];
    }

    static getPower(buildingName: string): number {
        return DATA[buildingName] ? (DATA[buildingName].power || 0) : 0;
    }

    static getSight(buildingName: string): number {
        return DATA[buildingName].sight || 0;
    }
}
