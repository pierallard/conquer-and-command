const DATA = {
    ConstructionYard: {
        constructable: false,
        cellPositions: [
            [0, 0],
            [1, 0],
            [0, -1],
            [1, -1],
        ],
        constructable_units: [
            'Harvester',
        ],
    },
    PowerPlant: {
        constructable: true,
        sprite: 'Factory2',
        sprite_layer: 0,
        cellPositions: [
            [0, 0],
            [1, 0],
            [0, -1],
            [1, -1],
        ],
        constructable_units: [],
        requireds: [
            'ConstructionYard',
        ],
        construction_time: 2,
    },
    Barracks: {
        constructable: true,
        sprite: 'Module',
        sprite_layer: 0,
        cellPositions: [
            [0, 0],
            [1, 0],
            [0, -1],
            [1, -1],
        ],
        constructable_units: [
            'Tank',
        ],
        requireds: [
            'PowerPlant',
        ],
        construction_time: 2,
    },
};


/**
 Buildings:
 - construction yard    : MinerAni
 - power plant          : Factory2
 - barracks             : Module
 - tiberium refinery    : Factory3
 - comm center          : Silo
 - concrete barrier     : Wall
 - repair facility      : TradPlat
 - guard tower          : Turret
 - helipad              : Starport
 - weapons factory      : ConstructionYard
 - silo                 : Storage1
 - advanced guard tower : Artilery2
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
        return DATA[buildingName].constructable_units;
    }

    static getRequiredBuildings(buildingName: string): string[] {
        return DATA[buildingName].requireds;
    }

    static getConstructionTime(buildingName: string) {
        return DATA[buildingName].construction_time;
    }
}
