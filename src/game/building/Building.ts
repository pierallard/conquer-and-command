export interface Building {
    getCellPositions(): PIXI.Point[];
    build(unit: string): void;
    getBuildMethods(): Object;
}
