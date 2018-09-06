import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableHighlight,
} from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { RouteConfig } from './Router';
import { Project, projectFixtures } from './data';
import ProjectListItem from './ProjectListItem';

interface Props extends NavigationScreenProps {}

export default class ProjectListScreen extends React.Component<Props> {
  static navigationOptions = {
    title: 'Projects',
  };

  private onPress = (title: string) => {
    this.props.navigation.navigate(String(RouteConfig.Project), {
      projectName: title,
    });
  };

  render() {
    return (
      <View style={styles.root}>
        <FlatList
          data={projectFixtures}
          keyExtractor={(i: Project, index) => i.title + index}
          renderItem={({ item }) => (
            <ProjectListItem onPress={this.onPress} {...item} />
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
