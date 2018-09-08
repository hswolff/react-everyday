import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import {
  NavigationScreenProps,
  NavigationStackScreenOptions,
} from 'react-navigation';
import { RouteConfig } from './Router';
import { Project, projectFixtures } from './data';
import ProjectListItem from './ProjectListItem';
import { FontAwesome } from '@expo/vector-icons';

interface Props extends NavigationScreenProps {}

export default class ProjectListScreen extends React.Component<Props> {
  static navigationOptions = ({
    navigation,
  }: NavigationScreenProps): NavigationStackScreenOptions => ({
    title: 'Projects',
    headerRight: (
      <TouchableOpacity
        onPress={() => navigation.navigate(RouteConfig.CreateProject)}
        style={styles.addButton}
      >
        <FontAwesome name="plus" size={26} color="black" />
      </TouchableOpacity>
    ),
  });

  private onPress = (title: string) => {
    this.props.navigation.navigate(RouteConfig.Project, {
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
  addButton: {
    paddingHorizontal: 10,
  },
});
