import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { CalendarList } from 'react-native-calendars';

export default class ProjectScreen extends React.Component {
  static navigationOptions = ({ navigation }: NavigationScreenProps) => {
    return {
      title: navigation.getParam('projectName', 'Details'),
    };
  };

  render() {
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
          }}
        />
      </View>
    );
  }
}
