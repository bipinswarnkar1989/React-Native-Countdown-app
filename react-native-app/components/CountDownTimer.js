import React, { Component } from 'react';
import { 
    View, 
    Text, 
    StyleSheet,
    Dimensions,
    TextInput,
    Button,
    Vibration
 } from 'react-native';

 const DURATION = 10000;

const soundObject = new Expo.Audio.Sound();

class CountDownTimer extends Component {
    _this;
    constructor(props) {
        super(props);
        this.state = {
            startButton: true,
            pauseButton: false,
            resetButton: true,
            countdownMinutes: null,
            remainingMinites:0,
            remainingSeconds:0,
            isCountDownStarted:false,
        };
        this.interval = this.interval.bind(this);
        this.startCounter = this.startCounter.bind(this);
        this.stopCounter = this.stopCounter.bind(this);
    }

    componentDidMount(){
        this._this = this;
    }

    interval(){
           var _this = this;
           var counterMinutes = parseInt(this.state.countdownMinutes, 10);
            var minutes = parseInt(counterMinutes / 60, 10);
            var seconds = parseInt(counterMinutes % 60, 10);
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            _this.setState({
                remainingMinites:minutes,
                remainingSeconds:seconds
            });
            if (--_this.state.countdownMinutes < 0) {
                _this.state.countdownMinutes = parseInt(this.state.countdownMinutes, 10);
            } 
            if (_this.state.countdownMinutes <= 0) {
                _this.stopCounter();
                Vibration.vibrate(DURATION)
            // Android: vibrate for 10s
            // iOS: duration is not configurable, vibrate for fixed time (about 500ms)
             this.playAudio();
             alert('Time Up!');
             
            }
           
    }
    
    playAudio = async () => {
        try {
            await soundObject.loadAsync(require('../martian-gun.mp3'));
            await soundObject.playAsync();
            // Your sound is playing!
          } catch (error) {
            // An error occurred!
          }
    }

    startCounter(){
        var _this = this;
       this.setState({
           isCountDownStarted:true
       });
      this.startInterval = setInterval(this.interval, 1000);
    }

    stopCounter(){
        clearInterval(this.startInterval);
        this.setState({
            startButton: true,
            pauseButton: false,
            resetButton: true,
            countdownMinutes: '',
            remainingMinites:0,
            remainingSeconds:0,
            isCountDownStarted:false,
        });
        
    }

    renderButton(title, color, label, callback, state) {
        return (
           <View>
                <Button
                onPress={() => callback()}
                title={title}
                color={color}
                accessibilityLabel={label}
                disabled={!state}
            />
            </View>
        )
    }
    
    render() {
        const { isCountDownStarted,remainingMinites,remainingSeconds } = this.state;
        return (
            <View style={styles.container}>
            <View style={styles.titleContainer}>
            <Text style={styles.title}>React Native Countdown Timer</Text>
            </View>
            <View style={styles.timerContainer}>
            {!isCountDownStarted ?  
            <TextInput
            style={styles.minutesInput}
            keyboardType='numeric'
            placeholder='0'
            maxLength={4}
            value={this.state.countdownMinutes}
            onChangeText={(minutes) => {
                let convertInMinutes = parseInt(minutes, 10) * 60;
                this.setState({
                    countdownMinutes: convertInMinutes,
                })
            }}
            />  : 
            <Text style={styles.minutesInput}>{`${remainingMinites}:${remainingSeconds}`}</Text>  
             }

            </View>
            <View style={styles.buttonsContainer}>
                        {this.renderButton(
                            this.props.startButtonTitle,
                            this.props.startButtonColor,
                            this.props.startButtonLabel,
                            this.startCounter,
                            this.state.startButton
                        )}
                    
                        {this.renderButton(
                            this.props.resetButtonTitle,
                            this.props.resetButtonColor,
                            this.props.resetButtonLabel,
                            this.stopCounter,
                            this.state.resetButton
                        )}
                    </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        
        marginTop: 100,
    },
    timerContainer:{
        alignItems: 'center',
    },
    minutesInput:{
        width: Dimensions.get('window').width,
        fontSize: 140,
        textAlign: 'center',
        alignSelf: 'stretch',
        borderWidth: 0
    },
    titleContainer:{
        padding: 50,
        alignItems: 'center',
    },
    title:{
        fontWeight: "bold",
        color:"#373737",
        fontSize: 18,
    },
    buttonsContainer:{
        flex:1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 30,
        borderWidth:0,
    }
})

export default CountDownTimer;