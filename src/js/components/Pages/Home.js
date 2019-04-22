import React, { Component, Fragment } from 'react';

import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';

import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

import moment from 'moment';

import config from '../../config';
import { firestore } from '../../lib/firebase';

class Home extends Component {
    /**
     * @constructor
     * @param {object} props - This components props.
     */
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            uid: props.match.params.uid,
            coordinates: [],
            tileSet: 'esriDeLorme',
        };

        this.availableTileSets = config.maps.tileSets;

        this.handleTileSetChange = this.handleTileSetChange.bind(this);
    }

    handleTileSetChange({ target: { value: tileSet } }) {
        this.setState({ tileSet });
    }

    async componentDidMount() {
        // Retrieve coordinates
        try {
            const docKey = `userData/${this.state.uid}/locations`;
            const locations = await firestore.readCollection(docKey);

            this.setState({ coordinates: Object.values(locations).sort((d1, d2) => d1.date - d2.date) });
        } catch (err) {
            console.error(err);
        }
    }

    render() {
        let centerPosition;
        const bounds = [];

        if (this.state.coordinates && this.state.coordinates.length) {
            // Determine the center position point for map
            const {
                coordinates: [firstPoint],
            } = this.state;

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
                    west: firstPoint.longitude,
                }
            );

            const centerLatitude = (north - south) / 2 + south;
            const centerLongitude = (east - west) / 2 + west;

            centerPosition = [centerLatitude, centerLongitude];

            bounds.push([south, west]);
            bounds.push([north, east]);
        }

        return (
            <Grid container style={{ height: '100%' }}>
                <Grid item xs={12} style={{ height: '7%' }}>
                    <Grid container alignItems="center">
                        <Grid item xs={11}>
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
                                        return (
                                            <FormControlLabel key={key} value={key} control={<Radio />} label={label} />
                                        );
                                    })}
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={1}>
                            <Button>Login</Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} style={{ height: '93%' }}>
                    <Grid container alignItems="center" style={{ height: '100%' }}>
                        <Grid item xs={12} style={{ height: '100%' }}>
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
                                            state,
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
                                                                county}
                                                            , {state}
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
                </Grid>
            </Grid>
        );
    }
}

Home.defaultProps = {};

Home.displayName = 'Home';

export default Home;
