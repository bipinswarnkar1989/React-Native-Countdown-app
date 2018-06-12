import React, { Component } from 'react';
import { 
    View, 
    Text, 
    StyleSheet,
    Dimensions,
    TextInput,
    Button,
    Vibration,
    NativeAppEventEmitter,
    Platform
 } from 'react-native';

 import BackgroundTimer from 'react-native-background-timer';
 // Import the react-native-sound module
var Sound = require('react-native-sound');

 const DURATION = 10000;

 // Enable playback in silence mode
Sound.setCategory('Playback');


class CountDownTimer extends Component {
    _this;
    whoosh;
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
            currentISTTime:null
        };
        this.interval = this.interval.bind(this);
        this.startCounter = this.startCounter.bind(this);
        this.stopCounter = this.stopCounter.bind(this);
         this.whoosh = new Sound(require('../martian-gun.mp3'), (error) => {
            if (error) {
              alert(error.message)
              return;
            }
          });
        // Loop indefinitely until stop() is called
        this.whoosh.setNumberOfLoops(-1);
    }

    componentDidMount(){
        //alert('Audio Testing 3');
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
             this.playAudio(this.whoosh);
             alert(`Time Up !`);
             _this.setState({
                currentISTTime:this.createTime()
             })
            }
           
    }

    createTime = () => {
        let date = new Date();
        var seconds = date.getSeconds();
        var minutes = date.getMinutes();
        var hour = date.getHours();
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        hour = hour < 10 ? "0" + hour : hour;
        return `${hour}:${minutes}:${seconds}`;
    }
    
    playAudio = async (whoosh) => {
        try {
             // Play the sound with an onEnd callback
    whoosh.play((success) => {
    if (success) {
      console.log('successfully finished playing');
    } else {
      alert('some err')
      // reset the player to its uninitialized state (android only)
      // this is the only option to recover after an error occured and use the player again
      setTimeout(// Stop the sound and rewind to the beginning
        whoosh.stop(() => {
          // Note: If you want to play a sound after stopping and rewinding it,
          // it is important to call play() in a callback.
          whoosh.play();
          whoosh.reset();
        }), DURATION);
      
    }
  });
            // Sound.enable(true); // Enable sound
            // Sound.prepare(require('../martian-gun.mp3')); // Preload the sound file 'tap.aac' in the app bundle
            // Sound.play(); 
            // setTimeout(function(){
            //     Sound.stop(); // Stop and reset the sound.
            // }, DURATION);
            // await soundObject.loadAsync(require('../martian-gun.mp3'));
            // await soundObject.playAsync();
            // Your sound is playing!
          } catch (error) {
            // An error occurred!
          }
    }

    startCounter(){
        if (this.state.isCountDownStarted) {
            return;
        }
        var _this = this;
       let convertInMinutes = parseInt(this.state.countdownMinutes, 10) * 60;
       this.setState({
           isCountDownStarted:true,
           countdownMinutes: convertInMinutes,
       });
       if (Platform.OS === 'android') {
        this.startInterval = BackgroundTimer.setInterval(this.interval, 1000);
       } else if (Platform.OS === 'ios') {
        BackgroundTimer.start();
        // Do whatever you want incuding setTimeout;
        this.startInterval = BackgroundTimer.setInterval(this.interval, 1000);
        BackgroundTimer.stop();
       }
      
    }

    stopCounter(){
       // clearInterval(this.startInterval);
       if (Platform.OS === 'android') {
       BackgroundTimer.clearInterval(this.startInterval);
       } else if (Platform.OS === 'ios') {
        BackgroundTimer.stop();
        }
        this.setState({
            startButton: true,
            pauseButton: false,
            resetButton: true,
            countdownMinutes: '',
            remainingMinites:0,
            remainingSeconds:0,
            isCountDownStarted:false,
            currentISTTime:null
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
        const { isCountDownStarted,remainingMinites,remainingSeconds,currentISTTime } = this.state;
        return (
            <View style={styles.container}>
            <View style={styles.titleContainer}>
            <Text style={styles.title}>React Native Countdown Timer</Text>
            </View>
            <View style={styles.timerContainer}>
            {!isCountDownStarted ?  
            <TextInput
            style={styles.minutesInput}
            keyboardType={`numeric`}
            placeholder='0'
            maxLength={4}
            value={this.state.countdownMinutes ? String(this.state.countdownMinutes): null}
            onChangeText={(minutes) => {
                this.setState({
                    countdownMinutes: minutes,
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

                  <View>
                  {currentISTTime && 
                <View style={styles.ISTContainer}>
                   <Text style={styles.ISTLabel}>Countdown Finished On: </Text>
                   <Text style={styles.IST}>{currentISTTime}</Text>
                   </View>
                 }
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 30,
        borderWidth:0,
    },
    ISTContainer:{
        alignItems: 'center',
        justifyContent:'center'
    },
    IST:{
        fontWeight: "bold",
        color:"#FF6F00",
        fontSize: 22,
    },
    ISTLabel:{
        fontWeight: "bold",
        color:"#373737",
        fontSize: 18,
    }
})

export default CountDownTimer;