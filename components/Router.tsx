import { createStackNavigator } from 'react-navigation';
import HomeScreen from './ProjectListScreen';
import ProjectScreen from './ProjectScreen';
import AddProjectScreen from './CreateProjectScreen';

export enum RouteConfig {
  ProjectList = 'ProjectList',
  Project = 'Project',
  Camera = 'Camera',
  CreateProject = 'CreateProject',
}

export default createStackNavigator(
  {
    Main: createStackNavigator({
      [RouteConfig.ProjectList]: HomeScreen,
      [RouteConfig.Project]: ProjectScreen,
    }),
    [RouteConfig.CreateProject]: AddProjectScreen,
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);
