const DATA = {
    Harvester: {
        allowed_by: ['WeaponsFactory', 'TiberiumRefinery'],
        construction_time: 2,
        life: 100,
        options: {
            load_time: 1,
            max_loading: 50,
            unload_time: 1,
        },
        price: 100,
        shoot: 0.5,
        shoot_distance: Math.sqrt(2),
        slowness: 0.4,
        sprite_layer: 6,
        sprites: ['Builder2', 'Builder2'],
    },
    MCV: {
        allowed_by: ['WeaponsFactory', 'AdvancedCommandCenter'],
        construction_time: 2,
        life: 1000,
        price: 100,
        shoot_distance: -1,
        slowness: 0.8,
        sprite_layer: 6,
        sprites: ['Transprt', 'Transprt'],
    },
    MediumTank: {
        allowed_by: ['WeaponsFactory'],
        construction_time: 2,
        life: 500,
        price: 200,
        shoot: 0.5,
        shoot_distance: 4,
        slowness: 0.35,
        sprite_layer: 6,
        sprites: ['Tank11', 'Tank12'],
    },
    MinigunInfantry: {
        allowed_by: ['Barracks'],
        construction_time: 1,
        life: 100,
        price: 50,
        shoot: 0.5,
        shoot_distance: 3,
        slowness: 0.25,
        sprite_layer: 6,
        sprites: ['Scout2', 'Scout2'],
    }
};

/**
 * Minigun infantry:  Scout2
 * Grenadier:         Tank5
 * Rocket soldier:    Tank3
 * Engineer Infantry: Tank10
 * Commando Infantry: Miner
 * APC:               Tank13
 * Chinook:           Copter2a
 * ORCA:              Copter
 * Humm-vee:          Tank7
 * Medium Tank:       Tank11
 * Rocket Launcher:   TankB2
 * MCV:               Transprt
 * Mammooth Tank:     Artil3
 * Harvester:         Builder2
 */

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

    static getRequiredBuildings(unitName: string): string[] {
        return DATA[unitName].allowed_by;
    }

    static getConstructableUnits(): string[] {
        return Object.keys(DATA);
    }

    static getSpriteLayer(unitName: string): number {
        return DATA[unitName].sprite_layer;
    }

    static getConstructionTime(unitName: string): number {
        return DATA[unitName].construction_time;
    }

    static getPrice(unitName: string): number {
        return DATA[unitName].price;
    }
}
