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
        allowedBy: [
            'ConstructionYard'
        ],
    },
    Barracks: {
        constructable: true,
        sprite: 'Module',
        cellPositions: [
            [0, 0],
            [1, 0],
            [0, -1],
            [1, -1],
        ],
        constructable_units: [
            'Tank',
        ],
        allowedBy: [
            'PowerPlant'
        ],
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
    static getCellPositions(unitName: string): PIXI.Point[] {
        return DATA[unitName].cellPositions.map((position) => {
            return new PIXI.Point(position[0], position[1]);
        });
    }

    static getConstructableBuildings(): string[] {
        return Object.keys(DATA).filter((buildingKey) => {
            return DATA[buildingKey].constructable;
        });
    }

    static getSpriteKey(unitName: string): string {
        return DATA[unitName].sprite;
    }

    static getSpriteLayer(unitName: string): number {
        return DATA[unitName].sprite_layer;
    }

    static getConstructableUnits(unitName: string): string[] {
        return DATA[unitName].constructable_units;
    }
}
