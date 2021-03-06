/* @flow */
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Card, CardHeader, CardText, RaisedButton, TextField } from "material-ui";
import { GeoJSON, Map } from "react-leaflet";
import chroma from "chroma-js";
import type { FeatureGroup } from "leaflet";

import * as countriesActions from "actions/CountriesActions";
import { Country } from "types/Countries";
import { handleInput } from "utils/Input";
import geoData from "data/countries.geo.json";

import "leaflet/dist/leaflet.css";
import "./styles.pcss";

type Props = {
    +countries: Array <Country>,
    +actions: {
        countryEdit: (country: Country) => void
    }
};

type State = {
    showInfo: boolean,
    enableEdit: boolean,

    selectedCountry: Country,

    nameError: ?string,
    valueError: ?string
}

// $FlowFixMe
@connect(({ countries }) => ({
    countries
}), dispatch => ({
    actions: bindActionCreators(countriesActions, dispatch)
}))
class ThermalWorldMap extends Component<void, Props, State> {

    props: Props;
    state: State;

    refs: {
        geoMap: GeoJSON
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            showInfo: false,
            enableEdit: false,

            selectedCountry: null,

            nameError: null,
            valueError: null
        };

        this.handleInput = handleInput.bind(this);
    }

    componentWillReceiveProps() {
        this.updateLayers();
    }

    handleInput: (event: SyntheticInputEvent) => void;

    colorScale = (value: number): string => {
        const values = this.props.countries.map(item => item.value);
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);

        return chroma.scale(['#ffd900', '#ff1b00']).domain([minValue, maxValue])(value).hex();
    };

    showInfo = (country: Country): void => {
        this.setState({
            showInfo: true,
            enableEdit: false,
            selectedCountry: { ...country },
            nameError: null,
            valueError: null,
        }, this.updateLayers);
    };

    clickMap = ({ originalEvent: { target } }: { originalEvent: { target: HTMLInputElement } }) => {
        if (target.tagName === "DIV") {
            this.setState({
                showInfo: false,
                enableEdit: false,
                selectedCountry: null
            }, this.updateLayers);
        }
    };

    toggleEdit = () => {
        this.setState({ enableEdit: !this.state.enableEdit });
    };

    enterLayer = (layer: FeatureGroup, { target: { feature: { properties: { iso_a2 } } } }: any) => {
        const { selectedCountry } = this.state;

        if (!selectedCountry || selectedCountry.id !== iso_a2) {
            layer.bringToFront();
            layer.setStyle({
                weight: 2,
                opacity: 1
            });
        }
    };

    leaveLayer(layer: FeatureGroup, { target: { feature: { properties: { iso_a2 } } } }: any) {
        const { selectedCountry } = this.state;

        if (!selectedCountry || selectedCountry.id !== iso_a2) {
            layer.bringToBack();
            layer.setStyle({
                weight: 1,
                opacity: .5
            });
        }
    }

    findByFeature = (iso_a2: string): Country => {
        return this.props.countries.find(item => item.id === iso_a2);
    };

    updateLayers = () => this.refs.geoMap.leafletElement.eachLayer((layer) => {
        this.eachFeature(layer.feature, layer);
    });

    eachFeature = ({ properties: { iso_a2 } }: any, layer: FeatureGroup) => {
        const { selectedCountry } = this.state;
        const item = this.findByFeature(iso_a2);

        if (item) {
            if (selectedCountry && selectedCountry.id === item.id) {
                layer.bringToFront();
                layer.setStyle({
                    fillColor: this.colorScale(item.value),
                    fillOpacity: 1,
                    color: "#0036ff",
                    weight: 2,
                    opacity: 1
                });
            } else {
                layer.bringToBack();
                layer.setStyle({
                    fillColor: this.colorScale(item.value),
                    fillOpacity: 1,
                    color: "#555",
                    weight: 1,
                    opacity: 0.5
                });
            }

            layer.off();
            layer.on({
                "click": this.showInfo.bind(this, item),
                "mouseover": this.enterLayer.bind(this, layer),
                "mouseout": this.leaveLayer.bind(this, layer)
            });
        }
    };

    saveCountry = () => {
        const { selectedCountry } = this.state;
        const { actions } = this.props;

        const errors: {
            nameError: ?string,
            valueError: ?string
        } = {
                nameError: null,
                valueError: null
            };

        let success = true;

        if (selectedCountry.name === "") {
            success = false;
            errors.nameError = "Required";
        }

        if (isNaN(selectedCountry.value)) {
            success = false;
            errors.valueError = "Required";
        } else {
            selectedCountry.value = Number(selectedCountry.value);
        }

        this.setState({
            enableEdit: !success,
            ...errors
        }, () => {
            if (success) actions.countryEdit(selectedCountry)
        });
    };

    render() {
        const {
            showInfo, enableEdit,
            
            selectedCountry,

            nameError, valueError
        } = this.state;

        return (
            <div className="thermal-world-map">
                <Map className="thermal-world-map-container" onClick={this.clickMap}
                    center={[51.505, -0.09]} maxBounds={[[-240, -200], [240, 200]]}
                    zoom={2} maxZoom={5} minZoom={1}>

                    <GeoJSON ref="geoMap" data={geoData}
                        color={"#555"} weight={1}
                        fillColor={"#EBF5FF"} opacity={0.5}
                        onEachFeature={this.eachFeature} />
                </Map>

                {showInfo && selectedCountry &&
                    <Card className="thermal-world-map-info" onExpandChange={this.toggleEdit} expanded={enableEdit}>
                        <CardHeader
                            title={selectedCountry.name}
                            subtitle={`Value: ${selectedCountry.value}`}
                            actAsExpander showExpandableButton />

                        <CardText expandable>
                            <TextField className="thermal-world-map-info-text-field" hintText="Country"
                                name="selectedCountry.name" defaultValue={selectedCountry.name}
                                onChange={this.handleInput} errorText={nameError} />

                            <TextField className="thermal-world-map-info-text-field" hintText="Value"
                                type="number" name="selectedCountry.value" defaultValue={selectedCountry.value}
                                onChange={this.handleInput} errorText={valueError} />

                            <RaisedButton className="thermal-world-map-info-text-submit" label="Save"
                                secondary={true} onTouchTap={this.saveCountry} />
                        </CardText>
                    </Card>
                }
            </div>
        );
    }
}

export default ThermalWorldMap;