import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Platform,
  Dimensions,
  Text,
} from 'react-native';
import {
  NavigationScreenProps,
  NavigationStackScreenOptions,
} from 'react-navigation';
import { RouteConfig, RouteParams } from './Router';
import { Project, Consumer, selectors } from './data';
import ProjectListItem from './ProjectListItem';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

const deviceWidth = Dimensions.get('window').width;

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
      [RouteParams.ProjectName]: title,
    });
  };

  render() {
    return (
      <View style={styles.root}>
        <Consumer select={[selectors.projects]}>
          {(projects: Array<Project>) =>
            projects.length ? (
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
            ) : (
              <TouchableOpacity
                style={styles.empty}
                onPress={() =>
                  this.props.navigation.navigate(RouteConfig.CreateProject)
                }
              >
                <MaterialCommunityIcons
                  name="flask-empty-outline"
                  size={deviceWidth / 2}
                  color="black"
                />
                <Text style={{ fontSize: 38 }}>Create a Project</Text>
              </TouchableOpacity>
            )
          }
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
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
