import React from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';

import Home from './Pages/Home';
import Update from './Pages/Update';
import NotFound from './Pages/NotFound';

const PageContainer = () => (
    <Grid container style={{ height: '99%', width: '99%' }}>
        <Grid item xs={12}>
            <Router>
                <Switch>
                    <Route component={Home} exact path="/home/:uid?" />
                    <Route component={Update} exact path="/update" />
                    <Route component={NotFound} />
                    <Redirect exact from="/" to="/home" />
                </Switch>
            </Router>
        </Grid>
    </Grid>
);

export default PageContainer;
