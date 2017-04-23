import { COUNTRY_EDIT } from "../constants/Countries";
import { CountryEditAction, Country } from "types/Countries";
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

export type Action = CountryEditAction;

export default (state: Array<Country> = initialState(), action: Action) => {
    switch (action.type) {
        case COUNTRY_EDIT:


            return [...state];
        default:
            return state;
    }
}