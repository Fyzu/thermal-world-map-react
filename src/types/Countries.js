export type Country = {
    id: string,
    name: string,
    value: number
};

export type CountryEditAction = {
    type: string,
    payload: Country
}