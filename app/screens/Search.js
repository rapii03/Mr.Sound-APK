import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  TextInput,
  TouchableOpacity
} from "react-native";
import React, { Component, useState } from "react";
import { MaterialIcons, Feather, Fontisto, FontAwesome5, AntDesign } from '@expo/vector-icons';
import { AudioContext } from "../context/AudioProvider";
import { RecyclerListView, LayoutProvider } from "recyclerlistview";
import AudioListItem from "../components/AudioListItem";
import Screen from "../components/Screen";
import OptionModal from "../components/OptionModal";
import { Audio } from "expo-av";
import { pause, play, playNext, resume } from "../misc/audioController";
import { storeAudioForNextOpening } from "../misc/helper";
import { ref, onValue, push, set, getDatabase } from "firebase/database";
import { db } from "../components/Connect";

export class Search extends Component {
  static contextType = AudioContext
  constructor(props) {
    super(props);
    this.state = {
      OptionModalVisible: false,
      searchQuery: "", // Initialize search query state
    };
    this.currentItem = {};
  }
  layoutProvider = new LayoutProvider(
    (i) => "audio",
    (type, dim) => {
      switch (type) {
        case "audio":
          dim.width = Dimensions.get("window").width;
          dim.height = 60;
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
  handleSearch = (query) => {
    this.setState({ searchQuery: query });
  };
  rowRenderer = (type, item, index, extendedState) => {
    const { searchQuery } = this.state;

    // Check if the item's filename contains the search query
    if (
      searchQuery &&
      item.filename.toLowerCase().indexOf(searchQuery.toLowerCase()) === -1
    ) {
      return null; // Skip rendering if search query doesn't match
    }

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

  render() {
    const { searchQuery } = this.state;

    return (
      <AudioContext.Consumer>
        {({ dataProvider, isPlaying }) => {
          if (!dataProvider._data.length) return null;
          return (
            <Screen>
              <View style={styles.cari}>
                <View style={styles.box}>
                  <View style={styles.inputbox}>
                    <TextInput
                      // onChangeText={() => set_cari(cari)}
                      placeholder={'Cari Musik...'}
                      style={styles.input}
                      value={searchQuery}
                      onChangeText={this.handleSearch}
                    />
                    {/* <Image style={{ width: 25, height: 25 }} source={require('../../assets/Al-Fatihah.png')}></Image> */}
                  </View>
                </View>
              </View>
              {/* <TextInput
                placeholder="Search music..."
                style={styles.input}
                value={searchQuery}
                onChangeText={this.handleSearch}
              /> */}
              <RecyclerListView
                dataProvider={dataProvider}
                layoutProvider={this.layoutProvider}
                rowRenderer={this.rowRenderer}
                extendedState={{ isPlaying }}
              />
              <OptionModal
                onPlayPress={() => console.log("Playing Music")}
                onPlaylistPress={() => this.addData(this.currentItem)}
                currentItem={this.currentItem}
                onClose={() =>
                  this.setState({ ...this.state, OptionModalVisible: false })
                }
                visible={this.state.OptionModalVisible}
              />
            </Screen>
          );
        }}
      </AudioContext.Consumer>
    );
  }
}
export default Search;

styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: '#F6F6FC',
    // overflow: "hidden",
    // padding: 20,
    backgroundColor: '#FCFCFC'
    // alignItems: "center",
  },
  cari: {
    marginTop: -40,
    marginBottom: 20,
    // width: '70%',
    alignItems:'center',
  },
  bodyContent: {
    padding: 20,
  },
  navBawah: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    backgroundColor: '#fff',
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    elevation: 20,
    // backgroundColor: 'red',
  },
  header: {
    marginTop: 40,
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
    // backgroundColor: 'red',
  },
  buttonBack: {
    zIndex: 99,
  },
  teksTitle: {
    display: 'flex',
    alignItems: 'center',
    // backgroundColor:'blue',
    width: "100%",
    position: 'absolute',
  },
  teksDaftar: {
    color: "#071D2C",
    fontSize: 20,
    fontWeight: 700,
    marginLeft: 3,
  },
  box: {
    marginTop: 20,
  },
  inputbox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#BFBFBF",
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'space-between'
  },
  jelajahi: {
    color: "#0E0E0E",
    fontSize: 22,
    fontWeight: 700,
    top: 0,
    marginLeft: 3,
    marginTop: 20,
  },
  lihat: {
    color: "#28A7CA",
    fontSize: 10,
    fontWeight: 700,
    marginLeft: 3,
  },
  judul: {
    marginTop: 4,
    color: "#28A7CA",
    fontSize: 14,
    fontWeight: 700,
    top: 0,
    marginLeft: 3,
  },
  penulis: {
    color: "#969696",
    fontSize: 10,
    fontWeight: 400,
    marginLeft: 3,
  },
  wrapLagu: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    // backgroundColor: 'red',
  },
  Lagu: {
    marginLeft: 10,
  },
  input: {
    width: "85%",
  }

});


