import React, { Component } from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Card, CardHeader, CardText, RaisedButton, TextField } from "material-ui";
import { GeoJSON, Map } from "react-leaflet";
import chroma from "chroma-js";

import * as countriesActions from "actions/CountriesActions";
import { Country } from "types/Countries";
import { handleInput } from "utils/Input";
import geoData from "data/countries.geo.json";

import "leaflet/dist/leaflet.css";
import "./styles.scss";

@connect(({ countries }) => ({
    countries
}), dispatch => ({
    actions: bindActionCreators(countriesActions, dispatch)
}))
class ThermalWorldMap extends Component {

    static propTypes = {
        countries: PropTypes.arrayOf(PropTypes.shape(Country)),
        actions: PropTypes.shape({
            countryEdit: PropTypes.func
        })
    };

    refs: {
        geoMap: GeoJSON
    };

    constructor(props) {
        super(props);

        this.state = {
            showInfo: false,
            enableEdit: false,

            selectedCountry: null
        };

        this.handleInput = handleInput.bind(this);
        this.showInfo = this.showInfo.bind(this);
        this.clickMap = this.clickMap.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.eachFeature = this.eachFeature.bind(this);
        this.colorScale = this.colorScale.bind(this);
        this.saveCountry = this.saveCountry.bind(this);
        this.updateLayers = this.updateLayers.bind(this);
    }

    handleInput: (event: Event) => void;

    colorScale(value): string {
        const values = this.props.countries.map(item => item.value);
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);

        return chroma.scale(['#ffd900', '#ff1b00']).domain([minValue, maxValue])(value).hex();
    };

    showInfo(country) {
        this.setState({
            showInfo: true,
            enableEdit: false,
            selectedCountry: country
        });
    }

    clickMap(event) {
        console.log(event);

        if (event.originalEvent.target.nodeName === "DIV") {
            this.setState({
                showInfo: false,
                enableEdit: false
            });
        }
    }

    toggleEdit() {
        this.setState({ enableEdit: !this.state.enableEdit });
    }

    enterLayer() {
        this.bringToFront();
        this.setStyle({
            weight: 2,
            opacity: 1
        });
    }

    leaveLayer() {
        this.bringToBack();
        this.setStyle({
            weight: 1,
            opacity: .5
        });
    }

    findByFeature(properties) {
        return this.props.countries.find(item => item.id === properties.iso_a2);
    }

    updateLayers() {
        this.refs.geoMap.leafletElement.eachLayer((layer) => {
            this.eachFeature(layer.feature, layer);
        });
    }

    eachFeature({ properties }, layer) {
        const item = this.findByFeature(properties);

        if (item) {
            layer.setStyle({
                fillColor: this.colorScale(item.value),
                fillOpacity: 1,
                color: '#555',
                weight: 1,
                opacity: 0.5
            });

            layer.on({
                "click": this.showInfo.bind(this, item),
                "mouseover": this.enterLayer.bind(layer),
                "mouseout": this.leaveLayer.bind(layer)
            });
        }
    }

    saveCountry() {
        const { selectedCountry } = this.state;
        const { actions } = this.props;

        this.setState({
            enableEdit: false
        }, () => actions.countryEdit(selectedCountry));

        this.updateLayers();
    }

    render() {
        const { showInfo, enableEdit, selectedCountry } = this.state;

        return (
            <div className="thermal-world-map">
                <Map className="thermal-world-map-container" onClick={this.clickMap}
                     center={[51.505, -0.09]} maxBounds={[[-240, -200], [240, 200]]}
                     zoom={2} maxZoom={5} minZoom={1}>

                    <GeoJSON ref="geoMap" data={geoData}
                             color={"#555"} weight={1}
                             fillColor={"#EBF5FF"} opacity={0.5}
                             onEachFeature={this.eachFeature}/>
                </Map>

                {showInfo && selectedCountry &&
                <Card className="thermal-world-map-info" onExpandChange={this.toggleEdit} expanded={enableEdit}>
                    <CardHeader
                        title={selectedCountry.name}
                        subtitle={`Value: ${selectedCountry.value}`}
                        actAsExpander showExpandableButton/>

                    <CardText expandable>
                        <TextField className="thermal-world-map-info-text-field" hintText="Country"
                                   name="selectedCountry.name" value={selectedCountry.name}
                                   onChange={this.handleInput}/>

                        <TextField className="thermal-world-map-info-text-field" hintText="Value"
                                   type="number" name="selectedCountry.value" value={selectedCountry.value}
                                   onChange={this.handleInput}/>

                        <RaisedButton className="thermal-world-map-info-text-submit" label="Save"
                                      secondary={true} onTouchTap={this.saveCountry}/>
                    </CardText>
                </Card>
                }
            </div>
        );
    }
}

export default ThermalWorldMap;