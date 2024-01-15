import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { storage } from '../components/Connect';
import { ref, onValue } from "firebase/database";
import { AudioContext } from '../context/AudioProvider';

const pickMP3 = async (item) => {
    try {
      const res = await DocumentPicker.pick({
        name:item.filename,
        type:'audio/mp3',
        uri:item.uri
      });
  
      const storageRef = ref(storage, 'mp3/' + item.filename);
      await uploadBytes(storageRef, res);
  
      setMP3File(res);
      console.log('MP3 file uploaded successfully.');
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.log('Error picking/uploading MP3:', err);
      }
    }
  };

  export default pickMP3
  