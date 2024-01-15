import { View, Text, StyleSheet } from "react-native";
import React from "react";
import * as Constants from "expo-constants";
const PlayScreen = ({ children }) => {
    return (
        <View style={styles.container}>
            <View style={styles.teksAtas}>
                <Text style={styles.teksJudul}>Audio Manager</Text>
            </View>
            {children}</View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "color.APP_BG",
        paddingTop: Constants.currentHeight,
        marginBottom: "5%",
    },
    teksAtas: {
        marginTop: "5%",
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    teksJudul: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: 10,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: "5%",
    },

});

export default PlayScreen;
