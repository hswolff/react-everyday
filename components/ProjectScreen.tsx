import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';

export default class ProjectScreen extends React.Component {
  static navigationOptions = ({ navigation }: NavigationScreenProps) => {
    return {
      title: navigation.getParam('projectName', 'Details'),
    };
  };

  render() {
    return (
      <View>
        <Text>Project Screen</Text>
      </View>
    );
  }
}
