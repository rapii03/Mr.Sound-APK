import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeAudioForNextOpening = async (audio, index) => {
  await AsyncStorage.setItem("prevAudio", JSON.stringify({ audio, index }));
};

export const convertTime = (minutes) => {
  if (minutes) {
    const hrs = minutes / 60;
    const mins = hrs.toString().split(".")[0];
    const percent = parseInt(hrs.toString().split(".")[1].slice(0, 2));
    const sec = Math.ceil((60 * percent) / 100);

    if (parseInt(mins) < 10 && sec < 10) {
      return `0${mins}:0${sec}`;
    }

    if (sec == 60) {
      return `${mins + 1}:00`;
    }

    if (parseInt(mins) < 10) {
      return `0${mins}:${sec}`;
    }
    if (sec < 10) {
      return `${mins}:0${sec}`;
    }
    return `${mins}:${sec}`;
  }
};
