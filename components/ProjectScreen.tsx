import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { CalendarList } from 'react-native-calendars';
// @ts-ignore
import Day from 'react-native-calendars/src/calendar/day/basic';
import { Project } from './types';
import { Consumer, selectors } from './data';
import { RouteConfig, RouteParams } from './Router';
import ProjectOptions from './ProjectOptions';

interface Props extends NavigationScreenProps {}

export default function ProjectScreen({ navigation }: NavigationScreenProps) {
  const projectName: string = navigation.getParam(
    RouteParams.ProjectName,
    'Details'
  );
  return (
    <Consumer select={[selectors.getProject(projectName)]}>
      {(project: Project) =>
        project ? (
          <View>
            <CalendarList
              // Max amount of months allowed to scroll to the past. Default = 50
              pastScrollRange={12}
              // Max amount of months allowed to scroll to the future. Default = 50
              futureScrollRange={1}
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
                    <View>
                      <Image
                        source={{ uri: photo.uri }}
                        style={[styles.dayContainer, styles.image]}
                      />
                      <View
                        style={{
                          position: 'absolute',
                          top: 0,
                        }}
                      >
                        <Day {...props} />
                      </View>
                    </View>
                  );
                }
                return <Day {...props} />;
              }}
              onDayPress={day => {
                navigation.navigate(RouteConfig.CameraScreen, {
                  [RouteParams.ProjectName]: navigation.getParam(
                    RouteParams.ProjectName
                  ),
                  [RouteParams.CurrentDateString]: day.dateString,
                  [RouteParams.Project]: project,
                });
              }}
            />
          </View>
        ) : null
      }
    </Consumer>
  );
}
ProjectScreen.navigationOptions = ({ navigation }: NavigationScreenProps) => {
  const projectName: string = navigation.getParam(
    RouteParams.ProjectName,
    'Details'
  );

  return {
    title: projectName,
    headerRight: <ProjectOptions navigation={navigation} />,
  };
};

const styles = StyleSheet.create({
  dayContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
  },
  image: {
    // resizeMode: 'contain',
  },
});
