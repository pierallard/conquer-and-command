export interface State {
    getNextStep(): State;
    run(): void;
}
