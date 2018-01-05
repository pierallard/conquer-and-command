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
            shoot_cooldown: 40,
            shoot_distance: 6,
            shoot_power: 60,
        },
        power: -20,
        price: 1000,
        requireds: [
            'CommunicationCenter',
        ],
        sprite: 'Artilery2',
        sprite_layer: 5,
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
        sprite: 'Generator',
        sprite_layer: 0,
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
            'MinigunInfantry', 'Grenadier', 'RocketSoldier', 'EngineerInfantry',
        ],
        construction_time: 20,
        life: 400,
        power: -20,
        price: 300,
        requireds: [
            'PowerPlant',
        ],
        sprite: 'Module',
        sprite_layer: 0,
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
        sprite: 'Silo',
        sprite_layer: 0,
    },
    ConcreteBarrier: {
        cellPositions: [[0, 0]],
        constructable: true,
        constructable_units: [],
        construction_time: 7,
        life: 1,
        price: 100,
        requireds: ['ConstructionYard'],
        sprite: 'Wall',
        sprite_layer: 0,
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
        sprite: 'Turret',
        sprite_layer: 5,
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
        sprite: 'Factory2',
        sprite_layer: 0,
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
        sprite: 'Factory3',
        sprite_layer: 0,
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
        sprite: 'Base',
        sprite_layer: 0,
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

    static getSpriteKey(buildingName: string): string {
        return DATA[buildingName].sprite;
    }

    static getSpriteLayer(buildingName: string): number {
        return DATA[buildingName].sprite_layer;
    }

    static getConstructableUnits(buildingName: string): string[] {
        return DATA[buildingName].constructable_units || [];
    }

    static getRequiredBuildings(buildingName: string): string[] {
        return DATA[buildingName].requireds;
    }

    static getConstructionTime(buildingName: string): number {
        if (_DEBUG_FAST_CONSTRUCT) {
            return DATA[buildingName].construction_time / 50;
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
        return DATA[buildingName].power || 0;
    }
}
