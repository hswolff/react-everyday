import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { CalendarList } from 'react-native-calendars';
// @ts-ignore
import Day from 'react-native-calendars/src/calendar/day/basic';
import { mutators, Consumer, selectors, Project } from './data';
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
    const projectName: string = navigation.getParam(
      RouteParams.ProjectName,
      'Details'
    );
    return (
      <Consumer select={[selectors.getProject(projectName)]}>
        {(project: Project) => (
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
              // @ts-ignore
              markedDates={project.photos}
              dayComponent={props => {
                const { date } = props;
                const photo = project.photos[date.dateString];
                if (photo) {
                  return (
                    <Image
                      source={{ uri: photo.uri }}
                      style={[styles.dayContainer, styles.image]}
                    />
                  );
                }
                return <Day {...props} />;
              }}
              onDayPress={day => {
                console.log('selected day', day);
                navigation.navigate(RouteConfig.CameraScreen, {
                  [RouteParams.ProjectName]: navigation.getParam(
                    RouteParams.ProjectName
                  ),
                  [RouteParams.CurrentDateString]: day.dateString,
                });
              }}
            />
          </View>
        )}
      </Consumer>
    );
  }
}

const styles = StyleSheet.create({
  dayContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
  },
  image: {
    resizeMode: 'contain',
  },
});
