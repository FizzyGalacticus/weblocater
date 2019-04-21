import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';

class NotFound extends Component {
    /**
     * @constructor
     * @param {object} props - This components props.
     */
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <Grid container direction="column" justify="space-evenly" alignItems="center" style={{ height: '100%' }}>
                <Grid item>
                    <h1>This page doesn't exist. =(</h1>
                </Grid>
            </Grid>
        );
    }
}

NotFound.defaultProps = {};

NotFound.displayName = 'NotFound';

export default NotFound;
