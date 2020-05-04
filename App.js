import React from 'react';
import {StyleSheet, View, Text, Alert, Image} from 'react-native';
import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';

export default function App() {
  const [user, setUser] = React.useState({
    user_name: '',
    token: '',
    profile_pic: '',
  });

  async function logOut() {
    setUser({
      user_name: null,
      token: null,
    });
    Alert.alert('logout.');
  }

  async function get_Response_Info(error, result) {
    if (error) {
      Alert.alert('Error fetching data: ' + error.toString());
    } else {
      setUser({
        user_name: 'Name: ' + result.name,
        token: result.id,
        profile_pic: result.picture.data.url,
      });
    }
  }

  return (
    <View style={styles.container}>
      <Text>Name: {user.user_name}</Text>
      {user.profile_pic ? (
        <Image source={{uri: user.profile_pic}} style={styles.imageStyle} />
      ) : null}
      <LoginButton
        readPermissions={['public_profile']}
        onLoginFinished={(error, result) => {
          if (error) {
            Alert.alert('login has error: ' + result.error);
          } else if (result.isCancelled) {
            Alert.alert('login is cancelled.');
          } else {
            AccessToken.getCurrentAccessToken().then((data) => {
              const processRequest = new GraphRequest(
                '/me?fields=name,picture.type(large)',
                null,
                get_Response_Info,
              );
              new GraphRequestManager().addRequest(processRequest).start();
            });
          }
        }}
        onLogoutFinished={logOut}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    width: 200,
    height: 300,
    resizeMode: 'contain',
  },
});
