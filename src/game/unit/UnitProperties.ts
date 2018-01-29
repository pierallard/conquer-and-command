import {_DEBUG_FAST_CONSTRUCT} from "../game_state/Play";
import {IMAGE_FORMAT} from "../sprite/UnitSprite";

export const SHOOT_COOLDOWN_RATIO = 0.08;

const DATA = {
    Engineer: {
        allowed_by: ['Barracks'],
        construction_time: 33,
        image_format: IMAGE_FORMAT.THREE,
        life: 1,
        price: 25,
        shoot_distance: -1,
        shoot_type: 'default',
        sight: 2,
        speed: 8,
        sprite_layer: 6,
        sprites: ['Tank10p1', 'Tank10p2'],
    },
    Grenadier: {
        allowed_by: ['Barracks'],
        construction_time: 7,
        image_format: IMAGE_FORMAT.FIVE,
        life: 50,
        price: 160,
        shoot_cooldown: 50,
        shoot_distance: 3.25,
        shoot_power: 50,
        shoot_type: 'default',
        sight: 1,
        speed: 10,
        sprite_layer: 20,
        sprites: ['Tank5p1', 'Tank5p2'],
    },
    Harvester: {
        allowed_by: ['WeaponsFactory', 'TiberiumRefinery'],
        construction_time: 93,
        image_format: IMAGE_FORMAT.THREE,
        life: 600,
        options: {
            load_time: 1,
            max_loading: 500,
            unload_time: 1,
        },
        price: 1400,
        shoot_distance: -1,
        sight: 2,
        speed: 12,
        sprite_layer: 6,
        sprites: ['Builder2p1', 'Builder2p2'],
    },
    HummVee: {
        allowed_by: ['WeaponsFactory'],
        construction_time: 27,
        image_format: IMAGE_FORMAT.THREE,
        life: 150,
        price: 400,
        shoot_cooldown: 30,
        shoot_distance: 4,
        shoot_power: 15,
        shoot_type: 'default',
        sight: 2,
        speed: 30,
        sprite_layer: 6,
        sprites: ['Tank7', 'Tank7'],
    },
    MCV: {
        allowed_by: ['WeaponsFactory', 'AdvancedCommandCenter'],
        construction_time: 213,
        image_format: IMAGE_FORMAT.THREE,
        life: 600,
        price: 5000,
        shoot_distance: -1,
        sight: 2,
        speed: 12,
        sprite_layer: 6,
        sprites: ['Transprt', 'Transprt'],
    },
    MediumTank: {
        allowed_by: ['WeaponsFactory'],
        construction_time: 53,
        image_format: IMAGE_FORMAT.THREE,
        life: 400,
        price: 800,
        shoot_cooldown: 50,
        shoot_distance: 4.75,
        shoot_power: 30,
        shoot_type: 'default',
        sight: 3,
        speed: 18,
        sprite_layer: 6,
        sprites: ['Tank11', 'Tank12'],
    },
    MinigunInfantry: {
        allowed_by: ['Barracks'],
        construction_time: 7,
        image_format: IMAGE_FORMAT.THREE,
        life: 50,
        price: 100,
        shoot_cooldown: 20,
        shoot_distance: 2,
        shoot_power: 15,
        shoot_type: 'default',
        sight: 1,
        speed: 8,
        sprite_layer: 6,
        sprites: ['Scout2p1', 'Scout2p2'],
    },
    Orca: {
        allowed_by: ['Barracks', 'Helipad'],
        construction_time: 80,
        image_format: IMAGE_FORMAT.ANIMATED,
        life: 125,
        price: 1200,
        shoot_air_power: 30,
        shoot_cooldown: 60,
        shoot_distance: 4,
        shoot_power: 30,
        shoot_type: 'rocket',
        sight: 3,
        speed: 40,
        sprite_layer: 5,
        sprites: ['Copterp1', 'Copterp2'],
    },
    RocketSoldier: {
        allowed_by: ['Barracks'],
        construction_time: 17,
        image_format: IMAGE_FORMAT.NINE,
        life: 25,
        price: 300,
        shoot_air_power: 30,
        shoot_cooldown: 60,
        shoot_distance: 4,
        shoot_power: 30,
        shoot_type: 'rocket',
        sight: 2,
        speed: 6,
        sprite_layer: 14,
        sprites: ['Tank3p1', 'Tank3p2'],
    },
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
        return DATA[unitName].shoot_cooldown * SHOOT_COOLDOWN_RATIO;
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
        if (_DEBUG_FAST_CONSTRUCT) {
            return DATA[unitName].construction_time / 50;
        }
        return DATA[unitName].construction_time / 6;
    }

    static getPrice(unitName: string): number {
        return DATA[unitName].price;
    }

    static getShootPower(unitName: string): number {
        return DATA[unitName].shoot_power;
    }

    static getShootAirPower(unitName: string): number {
        return DATA[unitName].shoot_air_power ? DATA[unitName].shoot_air_power : 0;
    }

    static getImageFormat(unitName: string): IMAGE_FORMAT {
        return DATA[unitName].image_format;
    }

    static getShootType(unitName: string) {
        return DATA[unitName].shoot_type;
    }

    static getSight(buildingName: string): number {
        return DATA[buildingName].sight || 0;
    }
}
