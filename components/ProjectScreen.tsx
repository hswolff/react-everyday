import React from 'react';
import { Button, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { CalendarList } from 'react-native-calendars';
import { mutators } from './data';
import { RouteConfig, RouteParams } from './Router';

interface Props extends NavigationScreenProps {}

export default class ProjectScreen extends React.Component<Props> {
  static navigationOptions = ({ navigation }: NavigationScreenProps) => {
    const projectName: string = navigation.getParam(
      RouteParams.ProjectName,
      'Details'
    );

    return {
      title: projectName,
      headerRight: (
        <TouchableOpacity
          onPress={() => {
            mutators.deleteProject(projectName);
            navigation.goBack();
          }}
        >
          <Text>Delete</Text>
        </TouchableOpacity>
      ),
    };
  };

  render() {
    const { navigation } = this.props;
    return (
      <View>
        <CalendarList
          // Callback which gets executed when visible months change in scroll view. Default = undefined
          onVisibleMonthsChange={months => {
            console.log('now these months are visible', months);
          }}
          // Max amount of months allowed to scroll to the past. Default = 50
          pastScrollRange={4}
          // Max amount of months allowed to scroll to the future. Default = 50
          futureScrollRange={0}
          // Enable or disable scrolling of calendar list
          scrollEnabled={true}
          // Enable or disable vertical scroll indicator. Default = false
          showScrollIndicator={true}
          maxDate={new Date()}
          onDayPress={day => {
            console.log('selected day', day);
            navigation.navigate(RouteConfig.CameraScreen, {
              [RouteParams.ProjectName]: navigation.getParam(
                RouteParams.ProjectName
              ),
            });
          }}
        />
      </View>
    );
  }
}
