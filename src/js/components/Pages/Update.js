import React, { Component, Fragment } from 'react';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

class Update extends Component {
    /**
     * @constructor
     * @param {object} props - This components props.
     */
    constructor(props) {
        super(props);

        this.state = {
            pass: '',
            showUpdateButton: false,
            snackbarOpen: false
        };

        this.handleAccessKeyChange = this.handleAccessKeyChange.bind(this);
        this.showMessage = this.showMessage.bind(this);
        this.updateLocation = this.updateLocation.bind(this);
    }

    handleAccessKeyChange(e) {
        const {
            target: { value: pass }
        } = e;

        this.setState({ pass });

        // Verify access key
    }

    showMessage(message, duration = 3000) {
        this.setState({ snackbarOpen: true, snackbarMessage: message }, () => {
            setTimeout(() => {
                this.setState({ snackbarOpen: false });
            }, duration);
        });
    }

    updateLocation() {
        navigator.geolocation.getCurrentPosition(({ coords }) => {
            const { pass } = this.state;

            const { latitude, longitude } = coords;

            // Update location
        });
    }

    render() {
        return (
            <Grid container direction="column" justify="space-evenly" alignItems="center" style={{ height: '100%' }}>
                {'geolocation' in navigator ? (
                    <Fragment>
                        <Grid item>
                            <TextField
                                id="access-key-input"
                                placeholder="Access Key"
                                margin="normal"
                                onChange={this.handleAccessKeyChange}
                            />
                        </Grid>
                        {this.state.showUpdateButton ? (
                            <Grid item>
                                <Button variant="contained" color="secondary" onClick={this.updateLocation}>
                                    Update Location
                                </Button>
                            </Grid>
                        ) : null}
                    </Fragment>
                ) : (
                    <Grid item>
                        <h3>Sorry, geolocation is not available on this device.</h3>
                    </Grid>
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
