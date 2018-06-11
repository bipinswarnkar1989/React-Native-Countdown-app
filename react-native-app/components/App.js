import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CountDownTimer from './CountDownTimer';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <CountDownTimer 
        startButtonTitle="Start"
        startButtonColor="#25b31d"
        startButtonLabel="Press to start"
        pauseButtonTitle="Pause"
        pauseButtonColor="#ada2a2"
        pauseButtonLabel="Press to pause"
        resetButtonTitle="Reset"
        resetButtonColor="#ff0101"
        resetButtonLabel="Press to reset"
         />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
