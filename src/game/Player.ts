export class Player
{
    private tankKey: string;

    constructor(tankKey: string) {
        this.tankKey = tankKey;
    }

    getTankKey(): string {
        return this.tankKey;
    }
}
