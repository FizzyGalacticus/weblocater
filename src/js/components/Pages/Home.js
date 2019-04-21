import React, { Component, Fragment } from 'react';

import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

import moment from 'moment';

class Home extends Component {
    /**
     * @constructor
     * @param {object} props - This components props.
     */
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            coordinates: [],
            tileSet: 'esriDeLorme'
        };

        this.availableTileSets = {
            esriDeLorme: {
                label: 'Esri DeLorme',
                attribution:
                    'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}'
            },
            openStreetMap: {
                label: 'Open Street Map',
                attribution: '&amp;copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors',
                url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            },
            stamenTerrain: {
                label: 'Stamen Terrain',
                attribution:
                    'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png'
            },
            wikiMedia: {
                label: 'WikiMedia',
                attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
                url: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png'
            },
            openTopoMap: {
                label: 'Open TopoMap',
                attribution:
                    'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
                url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
            }
        };

        this.handleTileSetChange = this.handleTileSetChange.bind(this);
    }

    handleTileSetChange({ target: { value: tileSet } }) {
        this.setState({ tileSet });
    }

    componentDidMount() {
        // Retrieve coordinates
    }

    render() {
        let centerPosition;
        const bounds = [];

        if (this.state.coordinates && this.state.coordinates.length) {
            // Determine the center position point for map
            const firstPoint = this.state.coordinates[0];
            const { north, east, south, west } = this.state.coordinates.reduce(
                (acc, coordinate) => {
                    if (coordinate.latitude > acc.north) acc.north = coordinate.latitude;
                    else if (coordinate.latitude < acc.south) acc.south = coordinate.latitude;

                    if (coordinate.longitude < acc.west) acc.west = coordinate.longitude;
                    else if (coordinate.longitude > acc.east) acc.east = coordinate.longitude;

                    return acc;
                },
                {
                    north: firstPoint.latitude,
                    east: firstPoint.longitude,
                    south: firstPoint.latitude,
                    west: firstPoint.longitude
                }
            );

            const centerLatitude = (north - south) / 2 + south;
            const centerLongitude = (east - west) / 2 + west;

            centerPosition = [centerLatitude, centerLongitude];

            bounds.push([south, west]);
            bounds.push([north, east]);
        }

        return (
            <Grid container direction="column" alignItems="center" style={{ height: '100%' }}>
                <Grid item style={{ height: '10%', width: '100%' }}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Available Map Tile Sets</FormLabel>
                        <RadioGroup
                            aria-label="Available Map Tile Sets"
                            name="tileSet"
                            value={this.state.tileSet}
                            onChange={this.handleTileSetChange}
                            style={{ display: 'flex', flexDirection: 'row' }}
                        >
                            {Object.entries(this.availableTileSets).map(([key, { label }]) => {
                                return <FormControlLabel key={key} value={key} control={<Radio />} label={label} />;
                            })}
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item style={this.state.loading ? {} : { height: '90%', width: '100%' }}>
                    {this.state.loading && this.state.coordinates.length < 1 ? (
                        <Fragment>
                            <CircularProgress size={50} />
                            <h1>There are no points to show.</h1>
                            <br />
                            <h1>Please come back later!</h1>
                        </Fragment>
                    ) : (
                        <Map style={{ height: '100%' }} center={centerPosition} animate={true} zoom={4}>
                            <TileLayer {...this.availableTileSets[this.state.tileSet]} />
                            {this.state.coordinates.map(coordinate => {
                                const position = [coordinate.latitude, coordinate.longitude];
                                const calendarDate = moment(new Date(coordinate.date)).calendar();
                                const {
                                    town,
                                    city,
                                    village,
                                    locality,
                                    hamlet,
                                    road,
                                    county,
                                    state
                                } = coordinate.locationData;

                                return (
                                    <Marker position={position} key={coordinate.date}>
                                        <Popup>
                                            <div>
                                                <span>
                                                    <b>Location: </b>
                                                    {town ||
                                                        city ||
                                                        village ||
                                                        locality ||
                                                        hamlet ||
                                                        road ||
                                                        county}, {state}
                                                </span>
                                                <br />
                                                <span>
                                                    <b>Date: </b>
                                                    {calendarDate}
                                                </span>
                                            </div>
                                        </Popup>
                                    </Marker>
                                );
                            })}
                        </Map>
                    )}
                </Grid>
            </Grid>
        );
    }
}

Home.defaultProps = {};

Home.displayName = 'Home';

export default Home;
