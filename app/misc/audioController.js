//play music
export const play = async (playbackObj, uri) => {
  try {
    return await playbackObj.loadAsync(
      { uri },
      { shouldPlay: true, progressUpdateIntervalMillis: 1000 }
    );
  } catch (error) {
    console.log("Music Gagal Diputar", error.message);
  }
};
//pause music
export const pause = async (playbackObj) => {
  try {
    return await playbackObj.setStatusAsync({ shouldPlay: false });
  } catch (error) {
    console.log("Music Gagal di pause", error.message);
  }
};
//resume music
export const resume = async (playbackObj) => {
  try {
    return await playbackObj.playAsync();
  } catch (error) {
    console.log("Music Gagal di putar kembali", error.message);
  }
};
//select another music

export const playNext = async (playbackObj, uri) => {
  try {
    await playbackObj.stopAsync();
    await playbackObj.unloadAsync();
    return await play(playbackObj, uri);
  } catch (error) {
    console.log("Play Next error", error.message);
  }
};
