const DATA = {
    Barracks: {
        cellPositions: [
            [0, 0],
            [1, 0],
            [0, -1],
            [1, -1],
        ],
        constructable: true,
        constructable_units: [
            'Tank',
        ],
        construction_time: 2,
        price: 150,
        requireds: [
            'PowerPlant',
        ],
        sprite: 'Module',
        sprite_layer: 0,
    },
    ConcreteBarrier: {
        cellPositions: [[0, 0]],
        constructable: true,
        constructable_units: [],
        construction_time: 0.5,
        price: 50,
        requireds: ['ConstructionYard'],
        sprite: 'Wall',
        sprite_layer: 0,
    },
    ConstructionYard: {
        cellPositions: [
            [0, 0],
            [1, 0],
            [0, -1],
            [1, -1],
        ],
        constructable: false,
        constructable_units: [
            'Harvester',
        ],
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
        construction_time: 2,
        price: 100,
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
        constructable_units: [],
        construction_time: 2,
        price: 100,
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
};

/**
 * Buildings:
 * - construction yard    : MinerAni
 * - power plant          : Factory2
 * - barracks             : Module
 * - tiberium refinery    : Factory3
 * - comm center          : Silo
 * - concrete barrier     : Wall
 * - repair facility      : TradPlat
 * - guard tower          : Turret
 * - helipad              : Starport
 * - weapons factory      : ConstructionYard
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
        return DATA[buildingName].construction_time;
    }

    static getPrice(buildingName: string): number {
        return DATA[buildingName].price;
    }
}
