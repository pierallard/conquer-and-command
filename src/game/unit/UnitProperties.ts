const DATA = {
    Harvester: {
        allowed_by: ['WeaponsFactory', 'TiberiumRefinery'],
        construction_time: 93,
        life: 600,
        options: {
            load_time: 1,
            max_loading: 50,
            unload_time: 1,
        },
        price: 1400,
        shoot_distance: -1,
        speed: 12,
        sprite_layer: 6,
        sprites: ['Builder2', 'Builder2'],
    },
    MCV: {
        allowed_by: ['WeaponsFactory', 'AdvancedCommandCenter'],
        construction_time: 213,
        life: 600,
        price: 5000,
        shoot_distance: -1,
        speed: 12,
        sprite_layer: 6,
        sprites: ['Transprt', 'Transprt'],
    },
    MediumTank: {
        allowed_by: ['WeaponsFactory'],
        construction_time: 53,
        life: 400,
        price: 800,
        shoot_cooldown: 50,
        shoot_distance: 4.75,
        shoot_power: 30,
        speed: 18,
        sprite_layer: 6,
        sprites: ['Tank11', 'Tank12'],
    },
    MinigunInfantry: {
        allowed_by: ['Barracks'],
        construction_time: 7,
        life: 50,
        price: 100,
        shoot_cooldown: 20,
        shoot_distance: 2,
        shoot_power: 15,
        speed: 8,
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
        return DATA[unitName].shoot_distance * 1.5;
    }

    static getLife(unitName: string): number {
        return DATA[unitName].life;
    }

    static getShootTime(unitName: string): number {
        return DATA[unitName].shoot_cooldown / 10;
    }

    static getSlownessTime(unitName: string): number {
        return 6 / DATA[unitName].speed;
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
