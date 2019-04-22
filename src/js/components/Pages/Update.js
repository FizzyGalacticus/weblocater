import React, { Component, Fragment } from 'react';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

import { auth as firebaseAuth, firestore } from '../../lib/firebase';
import config from '../../config';

const {
    locationIQ: { apiKey: locationIQKey, url: locationIQURL },
} = config;

class Update extends Component {
    constructor(props) {
        super(props);

        this.state = {
            auth: null,
            showUpdateButton: false,
            snackbarOpen: false,
        };

        this.showMessage = this.showMessage.bind(this);
        this.updateLocation = this.updateLocation.bind(this);
        this.copyShareURL = this.copyShareURL.bind(this);
    }

    async componentDidMount() {
        try {
            const auth = await firebaseAuth.login();

            this.setState({ auth, showUpdateButton: auth !== null });
        } catch (err) {
            this.showMessage('Could not log in =(');
        }
    }

    showMessage(message, duration = 3000) {
        this.setState({ snackbarOpen: true, snackbarMessage: message }, () => {
            setTimeout(() => {
                this.setState({ snackbarOpen: false });
            }, duration);
        });
    }

    updateLocation() {
        navigator.geolocation.getCurrentPosition(async ({ coords }) => {
            const { pass } = this.state;

            const { latitude, longitude } = coords;

            const query = Object.entries({ key: locationIQKey, lat: latitude, lon: longitude, format: 'json' })
                .reduce((acc, [key, value]) => [...acc, `${key}=${value}`], [])
                .join('&');

            try {
                // Get reverse geo info
                const url = `${locationIQURL}?${query}`;
                const { address: locationData } = await fetch(url).then(res => res.json());

                const docKey = `userData/${this.state.auth.user.uid}/locations`;
                const now = Date.now();

                // Save to firestore
                await firestore.set(docKey, String(now), {
                    latitude,
                    longitude,
                    date: now,
                    locationData,
                });

                this.showMessage('Location updated!');
            } catch (err) {
                this.showMessage('Could not updated location =(');
                console.error(err);
            }
        });
    }

    copyShareURL() {
        const shareURL = `${window.location.href.split(window.location.hash)[0]}#/home/${this.state.auth.user.uid}`;

        // Create new element
        var el = document.createElement('textarea');
        // Set value (string to be copied)
        el.value = shareURL;
        // Set non-editable to avoid focus and move outside of view
        el.setAttribute('readonly', '');
        el.style = { position: 'absolute', left: '-9999px' };
        document.body.appendChild(el);
        // Select text inside element
        el.select();
        // Copy text to clipboard
        document.execCommand('copy');
        // Remove temporary element
        document.body.removeChild(el);

        this.showMessage('URL Copied to Clipboard =)');
    }

    render() {
        return (
            <Grid container direction="column" justify="space-evenly" alignItems="center" style={{ height: '100%' }}>
                {this.state.auth === null ? (
                    <Grid item>
                        <h3>You must be logged in to update.</h3>
                    </Grid>
                ) : (
                    <Fragment>
                        <Grid item>
                            <Button variant="contained" color="secondary" onClick={this.updateLocation}>
                                Update Location
                            </Button>
                        </Grid>

                        <Grid item>
                            <Button variant="contained" color="primary" onClick={this.copyShareURL}>
                                Copy Share URL
                            </Button>
                        </Grid>
                    </Fragment>
                )}
                <Snackbar
                    open={this.state.snackbarOpen}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    message={this.state.snackbarMessage}
                />
            </Grid>
        );
    }
}

Update.defaultProps = {};

Update.displayName = 'Update';

export default Update;
