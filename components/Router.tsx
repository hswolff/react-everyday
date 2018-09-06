import { createStackNavigator } from 'react-navigation';
import HomeScreen from './ProjectListScreen';
import ProjectScreen from './ProjectScreen';

export enum RouteConfig {
  ProjectList,
  Project,
  Camera,
}

export default createStackNavigator({
  [RouteConfig.ProjectList]: HomeScreen,
  [RouteConfig.Project]: ProjectScreen,
});
