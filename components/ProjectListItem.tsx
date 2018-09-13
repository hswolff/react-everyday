import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Project } from './data';

interface Props extends Project {
  onPress: (title: string) => void;
}

export default class ProjectListItem extends React.Component<Props> {
  render() {
    const { title } = this.props;
    return (
      <TouchableOpacity onPress={() => this.props.onPress(title)}>
        <View style={styles.root}>
          <Text>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    paddingVertical: 40,
  },
});
