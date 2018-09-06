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

interface Props extends NavigationScreenProps {}

export default class ProjectListScreen extends React.Component<Props> {
  static navigationOptions = {
    title: 'Projects',
  };

  render() {
    return (
      <View style={styles.root}>
        <FlatList
          style={styles.list}
          data={[{ key: 'a' }, { key: 'b' }]}
          renderItem={({ item }) => (
            <TouchableHighlight
              onPress={() =>
                this.props.navigation.navigate(String(RouteConfig.Project), {
                  projectName: item.key,
                })
              }
            >
              <View style={styles.listItem}>
                <Text>{item.key}</Text>
              </View>
            </TouchableHighlight>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
  },
  list: {
    flex: 1,
  },
  listItem: {
    flex: 1,
    paddingVertical: 40,
    width: 200,
  },
});
