export enum ROTATION {
    RIGHT = 0,
    TOP_RIGHT,
    TOP,
    TOP_LEFT,
    LEFT,
    BOTTOM_LEFT,
    BOTTOM,
    BOTTOM_RIGHT,
}

export class Rotation {
    static getRotation(vector: PIXI.Point): ROTATION {
        if (null === vector) {
            return ROTATION.TOP_LEFT;
        }

        const angle = Math.atan2(vector.y, vector.x);
        if (angle > Math.PI / 8 * 7) {
            return ROTATION.LEFT;
        }
        if (angle > Math.PI / 8 * 5) {
            return ROTATION.BOTTOM_LEFT;
        }
        if (angle > Math.PI / 8 * 3) {
            return ROTATION.BOTTOM;
        }
        if (angle > Math.PI / 8) {
            return ROTATION.BOTTOM_RIGHT;
        }
        if (angle > Math.PI / 8 * -1) {
            return ROTATION.RIGHT;
        }
        if (angle > Math.PI / 8 * -3) {
            return ROTATION.TOP_RIGHT;
        }
        if (angle > Math.PI / 8 * -5) {
            return ROTATION.TOP;
        }
        if (angle > Math.PI / 8 * -7) {
            return ROTATION.TOP_LEFT;
        }

        return ROTATION.LEFT;
    }
}
