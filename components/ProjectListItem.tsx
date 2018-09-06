import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { RouteConfig } from './Router';
import { Project } from './data';

interface Props extends Project {
  onPress: (title: string) => void;
}

export default class ProjectListItem extends React.Component<Props> {
  render() {
    const { title } = this.props;
    return (
      <TouchableHighlight onPress={() => this.props.onPress(title)}>
        <View style={styles.root}>
          <Text>{title}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    paddingVertical: 40,
  },
});
