import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createDrawerNavigator } from 'react-navigation';
import App from '../components/App';

const AppDrawerNavigator =  createDrawerNavigator({
    App: { screen:App }
},{
    initialRouteName:'App',
    headerMode:'none'
});

export default AppDrawerNavigator;