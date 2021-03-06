import React from "react";
import { Text, View, Button, StyleSheet, TextInput } from "react-native";

import Constants from "expo-constants";
const { manifest } = Constants;
import config from "./config.json";
const url = config.url;

import { setJWT } from "./utils/auth";

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "default_e",
            password: "default_p"
        };
    }

    handleEmail = text => {
        this.setState({ email: text });
    };

    handlePassword = text => {
        this.setState({ password: text });
    };

    handleFeedback(status, body) {
        const token = body.token;
        if (status == 200) {
            setJWT(token).then(res => {
                console.log("LoginPage: API call succeed");
                if (res) {
                    console.log(
                        "LoginPage: JWT stored, redirect to history page"
                    );
                    this.props.navigation.navigate("Record");
                } else {
                    alert("JWT token storation failed");
                    console.log("LoginPage: JWT storation failed");
                }
            });
        } else if (status == 404) {
            alert("User not found");
            console.log("LoginPage: 404: User not found");
        } else if (status == 400) {
            alert("Incorrect password");
            console.log("LoginPage: 400: Password entered not correct");
        }
    }

    loginPressed = () => {
        let status = null;
        const data_base_url = url
            ? `${url}/login`
            : `http://${manifest.debuggerHost
                  .split(`:`)
                  .shift()
                  .concat(`:3001/login`)}`; // Switch to the route you want to use

        fetch(data_base_url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        })
            .then(result => {
                status = result.status;
                return result.json();
            })
            .then(body => this.handleFeedback(status, body))
            .catch(error => {
                console.log(error);
            });
    };

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <Text style={{ fontSize: 30, marginBottom: 30 }}>
                    Welcome to Uroflow
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    autoCapitalize="none"
                    onChangeText={this.handleEmail}
                />
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    placeholder="Password"
                    autoCapitalize="none"
                    onChangeText={this.handlePassword}
                />
                <Button onPress={this.loginPressed} title="Login" />
            </View>
        );
    }
}

export default LoginPage;

const styles = StyleSheet.create({
    input: {
        margin: 15,
        height: 40,
        width: 230,
        borderColor: "steelblue",
        borderWidth: 1,
        paddingLeft: 15
    },
    submitButton: {
        padding: 10,
        margin: 15,
        height: 40
    },
    submitButtonText: {
        color: "white"
    }
});
