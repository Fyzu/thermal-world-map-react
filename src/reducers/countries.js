/* @flow */
import { COUNTRY_EDIT } from "../constants/Countries";
import { Country, CountryEditAction } from "types/Countries";
import countryCode from "data/country_code";
import mapData from "data/data";

const initialState = (): Array<Country> => Object.keys(countryCode).map(iso2 => {
    const data = mapData.find(({ country }) => country === iso2);

    return {
        id: iso2,
        name: countryCode[iso2],
        value: (data && data["count_dtime"]) || 0
    }
});

export default (state: Array<Country> = initialState(), action: CountryEditAction) => {
    switch (action.type) {
        case COUNTRY_EDIT:
            const country: Country = action.payload;
            const index = state.findIndex(({ id }) => id === country.id);

            state[index] = country;

            return [...state];
        default:
            return state;
    }
}