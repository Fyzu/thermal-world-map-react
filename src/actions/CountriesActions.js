import { COUNTRY_EDIT } from "constants/Countries";
import { Country, CountryEditAction } from "types/Countries";

export const countryEdit = (country: Country): CountryEditAction => ({
    type: COUNTRY_EDIT,
    payload: country
});