const DATA = {
    Harvester: {
        life: 100,
        shoot_distance: Math.sqrt(2),
        sprites: ['Builder2', 'Builder2'],
        sprite_layer: 6,
        options: {
            max_loading: 50,
            unload_time: 1,
            load_time: 1,
        },
        slowness: 0.4,
        shoot: 0.5,
        allowed_by: ['WeaponsFactory', 'TiberiumRefinery'],
    },
    Tank: {
        life: 500,
        shoot_distance: 4,
        sprites: ['Tank11', 'Tank12'],
        sprite_layer: 6,
        slowness: 0.25,
        shoot: 0.5,
        allowed_by: ['Barracks'],
    },
    MCV: {
        life: 1000,
        shoot_distance: -1,
        sprites: ['Transprt', 'Transprt'],
        sprite_layer: 6,
        slowness: 0.8,
        allowed_by: ['WeaponsFactory', 'AdvancedCommandCenter'],
    }
};

export class UnitProperties {
    static getSprite(unitName: string, playerId: number): string {
        return DATA[unitName].sprites[playerId];
    }

    static getOption(unitName: string, optionName: string): any {
        return DATA[unitName].options[optionName];
    }

    static getShootDistance(unitName: string): number {
        return DATA[unitName].shoot_distance;
    }

    static getLife(unitName: string): number {
        return DATA[unitName].life;
    }

    static getShootTime(unitName: string): number {
        return DATA[unitName].shoot;
    }

    static getSlownessTime(unitName: string): number {
        return DATA[unitName].slowness;
    }

    static getAllowedBuildings(unitName: string): string[] {
        return DATA[unitName].allowed_by;
    }

    static getConstructableUnits(): string[] {
        return Object.keys(DATA);
    }

    static getSpriteLayer(buildingName: string): number {
        return DATA[buildingName].sprite_layer;
    }
}
