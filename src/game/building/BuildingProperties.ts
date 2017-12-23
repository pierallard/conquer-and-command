const DATA = {
    Base: {
        constructable: false,
        cellPositions: [
            [0, 0],
            [1, 0],
            [2, 0],
            [0, 1],
            [1, 1],
            [2, 1],
            [0, 2],
            [1, 2],
            [2, 2],
        ],
        constructable_units: [
            'Harvester',
        ],
    },
    Power: {
        constructable: true,
        sprite: 'Factory2',
        sprite_layer: 0,
        cellPositions: [
            [0, 0],
            [1, 0],
            [0, 1],
            [1, 1],
        ],
        constructable_units: [
            'Tank',
        ],
    },
};

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
