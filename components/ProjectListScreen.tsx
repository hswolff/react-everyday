import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  NavigationScreenProps,
  NavigationStackScreenOptions,
} from 'react-navigation';
import { RouteConfig } from './Router';
import { Project, Consumer, selectors } from './data';
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
        <Consumer select={[selectors.projects]}>
          {(projects: Array<Project>) => (
            <FlatList
              data={projects}
              keyExtractor={(i: Project, index) => i.title + index}
              ItemSeparatorComponent={
                Platform.OS === 'ios'
                  ? ({ highlighted }) => (
                      <View
                        style={[
                          styles.separator,
                          highlighted && { marginLeft: 0 },
                        ]}
                      />
                    )
                  : null
              }
              renderItem={({ item, separators }) => (
                <ProjectListItem
                  onPress={this.onPress}
                  separators={separators}
                  {...item}
                />
              )}
            />
          )}
        </Consumer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  separator: {
    backgroundColor: '#999',
    height: 1,
  },
  addButton: {
    paddingHorizontal: 10,
  },
});
