import React, { Component, createContext } from "react";
import { Text, View, Alert } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { DataProvider } from "recyclerlistview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import { pause, playNext } from "../misc/audioController";
import { storeAudioForNextOpening } from "../misc/helper";

export const AudioContext = createContext();
export class AudioProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioFiles: [],
      permissionError: false,
      dataProvider: new DataProvider((r1, r2) => r1 !== r2),
      playbackObj: null,
      soundObj: null,
      currentAudio: {},
      isPlaying: false,
      currentAudioIndex: null,
      playbackPosition: null,
      playbackDuration: null,
    };
    this.totalAudioCount = 0;
  }

  permissionAlert = () => {
    Alert.alert(
      "Permission denied",
      "Anda tidak memiliki izin untuk mengakses aplikasi ini",
      [
        {
          text: "Ok",
          onPress: () => this.getPermission(),
        },
        {
          text: "Cancel",
          onPress: () => this.permissionAlert(),
        },
      ]
    );
  };

  getAudioFiles = async () => {
    const { dataProvider, audioFiles } = this.state;
    let media = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
    });
    media = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
      first: media.totalCount,
    });
    this.totalAudioCount = media.totalCount;

    this.setState({
      ...this.state,
      dataProvider: dataProvider.cloneWithRows([
        ...audioFiles,
        ...media.assets,
      ]),
      audioFiles: [...audioFiles, ...media.assets],
    });
  };

  loadPrevAudio = async () => {
    let prevAudio = await AsyncStorage.getItem("prevAudio");
    let currentAudio;
    let currentAudioIndex;

    if (prevAudio === null) {
      currentAudio = this.state.audioFiles[0];
      currentAudioIndex = 0;
    } else {
      prevAudio = JSON.parse(prevAudio);
      currentAudio = prevAudio.audio;
      currentAudioIndex = prevAudio.index;
    }

    this.setState({ ...this.state, currentAudio, currentAudioIndex });
  };

  getPermission = async () => {
    // {
    //     "canAskAgain": true,
    //     "expires": "never",
    //     "granted": false,
    //     "status": "undetermined",
    //   }
    const permission = await MediaLibrary.getPermissionsAsync();
    if (permission.granted) {
      this.getAudioFiles();
    }

    if (!permission.canAskAgain && !permission.granted) {
      this.setState({ ...this.state, permissionError: true });
    }

    if (!permission.granted && permission.canAskAgain) {
      const { status, canAskAgain } =
        await MediaLibrary.requestPermissionsAsync();
      if (status === "denied" && canAskAgain) {
        this.permissionAlert();
      }
      if (status === "granted") {
        this.getAudioFiles();
      }
      if (status === "denied" && !canAskAgain) {
        this.setState({ ...this.state, permissionError: true });
      }
    }
  };

  onPlaybackStatusUpdate = async (playbackStatus) => {
    // console.log(playbackStatus)
    if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
      this.updateState(this, {
        playbackPosition: playbackStatus.positionMillis,
        playbackDuration: playbackStatus.durationMillis,
      });
    }
    if (playbackStatus.didJustFinish) {
      const nextAudioIndex = this.state.currentAudioIndex + 1;
      if (nextAudioIndex >= this.totalAudioCount) {
        this.playbackObj.unloadAsync();
        this.updateState(this, {
          soundObj: null,
          currentAudio: this.audioFiles[0],
          currentAudioIndex: 0,
          playbackPosition: null,
          playbackDuration: null,
          isPlaying: false,
        });
        return await storeAudioForNextOpening(this.state.audioFiles[0], 0);
      }
      const audio = this.state.audioFiles[nextAudioIndex];
      const status = await playNext(this.state.playbackObj, audio.uri);
      this.updateState(this, {
        soundObj: status,
        currentAudio: audio,
        currentAudioIndex: nextAudioIndex,
        isPlaying: true,
      });
      await storeAudioForNextOpening(audio, nextAudioIndex);
    }
  };

  componentDidMount() {
    this.getPermission();
    if (this.state.playbackObj === null) {
      this.setState({ ...this.state, playbackObj: new Audio.Sound() });
    }
  }

  updateState = (prevState, newState = {}) => {
    this.setState({ ...prevState, ...newState });
  };
  render() {
    const {
      audioFiles,
      dataProvider,
      permissionError,
      playbackObj,
      soundObj,
      currentAudio,
      isPlaying,
      currentAudioIndex,
      playbackPosition,
      playbackDuration,
    } = this.state;
    if (this.state.permissionError)
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 25,
              textAlign: "center",
              color: "red",
            }}
          >
            ANDA TIDAK MEMILIKI AKSES APLIKASI
          </Text>
        </View>
      );
    return (
      <AudioContext.Provider
        value={{
          audioFiles,
          dataProvider,
          playbackObj,
          soundObj,
          currentAudio,
          isPlaying,
          currentAudioIndex,
          playbackPosition,
          playbackDuration,
          totalAudioCount: this.totalAudioCount,
          updateState: this.updateState,
          loadPrevAudio: this.loadPrevAudio,
          onPlaybackStatusUpdate: this.onPlaybackStatusUpdate,
        }}
      >
        {this.props.children}
      </AudioContext.Provider>
    );
  }
}

export default AudioProvider;
