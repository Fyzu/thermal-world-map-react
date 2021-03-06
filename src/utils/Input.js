/* @flow */
export function handleInput(e: SyntheticInputEvent): void {

    const names: Array<string> = e.target.name.split('.');
    const value: boolean | string = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    const state = {
        [names[0]]: this.state[names[0]]
    };

    if (names.length === 1) {
        state[names[0]] = value;
    } else if (names.length === 2) {
        state[names[0]][names[1]] = value;
    } else if (names.length === 2) {
        state[names[0]][names[1]][names[2]] = value;
    } else if (names.length === 3) {
        state[names[0]][names[1]][names[2]][names[3]] = value;
    }

    this.setState(state);
}