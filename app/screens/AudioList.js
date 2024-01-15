import React, { Component, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  TextInput,
} from "react-native";
import { AudioContext } from "../context/AudioProvider";
import { RecyclerListView, LayoutProvider } from "recyclerlistview";
import AudioListItem from "../components/AudioListItem";
import Screen from "../components/Screen";
import OptionModal from "../components/OptionModal";
import { Audio } from "expo-av";
import { pause, play, playNext, resume } from "../misc/audioController";
import { storeAudioForNextOpening } from "../misc/helper";
import {ref,onValue,push,set, getDatabase} from "firebase/database";
import { db } from "../components/Connect";

export class AudioList extends Component {
  static contextType = AudioContext;

  constructor(props) {
    super(props);
    this.state = {
      OptionModalVisible: false,
    };

    this.currentItem = {};
  }

  layoutProvider = new LayoutProvider(
    (i) => "audio",
    (type, dim) => {
      switch (type) {
        case "audio":
          dim.width = Dimensions.get("window").width;
          dim.height = 70;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    }
  );


  handleAudioPress = async (audio) => {
    // console.log(audio)
    const { playbackObj, soundObj, currentAudio, updateState, audioFiles } =
      this.context;
    //play music
    if (soundObj === null) {
      const playbackObj = new Audio.Sound();
      const status = await play(playbackObj, audio.uri);
      const index = audioFiles.indexOf(audio);
      updateState(this.context, {
        currentAudio: audio,
        playbackObj: playbackObj,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
      });
      playbackObj.setOnPlaybackStatusUpdate(
        this.context.onPlaybackStatusUpdate
      );
      return storeAudioForNextOpening(audio, index);
    }
    //pause music
    if (
      soundObj.isLoaded &&
      soundObj.isPlaying &&
      currentAudio.id === audio.id
    ) {
      const status = await pause(playbackObj);
      return updateState(this.context, { soundObj: status, isPlaying: false });
    }
    //resume music
    if (
      soundObj.isLoaded &&
      !soundObj.isPlaying &&
      currentAudio.id === audio.id
    ) {
      const status = await resume(playbackObj);
      return updateState(this.context, { soundObj: status, isPlaying: true });
    }

    // select another music
    if (soundObj.isLoaded && currentAudio.id !== audio.id) {
      const status = await playNext(playbackObj, audio.uri);
      const index = audioFiles.indexOf(audio);
      updateState(this.context, {
        currentAudio: audio,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
      });
      return storeAudioForNextOpening(audio, index);
    }
  };

  componentDidMount() {
    this.context.loadPrevAudio();
  }

  rowRenderer = (type, item, index, extendedState) => {
    // console.log(item);
    return (
      <AudioListItem
        title={item.filename}
        isPlaying={extendedState.isPlaying}
        duration={item.duration}
        activeListItem={this.context.currentAudioIndex === index}
        onAudioPress={() => this.handleAudioPress(item)}
        onOptionPress={() => {
          this.currentItem = item;
          this.setState({
            ...this.state,
            OptionModalVisible: true,
          });
        }}
      />
    );
  };
  
  
addData = (item) =>{
  set(ref(db, 'Playlist/'+'play1/'+ item.id ), { // menambahkan data ke dalam path 'Playlist/play1')
    filename: item.filename,
    uri: item.uri,
    duration: item.duration,
})
}
  
  render() {
    return (
      <AudioContext.Consumer>
        {({ dataProvider, isPlaying }) => {
          // console.log(dataProvider)
          if (!dataProvider._data.length) return null;
          return (
            <Screen>
              <RecyclerListView
                dataProvider={dataProvider}
                layoutProvider={this.layoutProvider}
                rowRenderer={this.rowRenderer}
                extendedState={{ isPlaying }}
              ></RecyclerListView>
              <OptionModal
                onPlayPress={() => console.log("Playing Music")}
                onPlaylistPress={() => this.addData(this.currentItem)}
                currentItem={this.currentItem}
                onClose={() =>
                  this.setState({ ...this.state, OptionModalVisible: false })
                }
                visible={this.state.OptionModalVisible}
              ></OptionModal>
            </Screen>
          );
        }}
      </AudioContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default AudioList;
