import { createStackNavigator } from 'react-navigation';
import ProjectListScreen from './ProjectListScreen';
import ProjectScreen from './ProjectScreen';
import CreateProjectScreen from './CreateProjectScreen';
import CameraScreen from './CameraScreen';

export enum RouteConfig {
  ProjectList = 'ProjectList',
  Project = 'Project',
  Camera = 'Camera',
  CreateProject = 'CreateProject',
  CameraScreen = 'CameraScreen',
}

export enum RouteParams {
  ProjectName = 'projectName',
  CurrentDateString = 'dateString',
  Project = 'project',
}

export default createStackNavigator(
  {
    Main: createStackNavigator({
      [RouteConfig.ProjectList]: ProjectListScreen,
      [RouteConfig.Project]: ProjectScreen,
    }),
    [RouteConfig.CreateProject]: CreateProjectScreen,
    [RouteConfig.CameraScreen]: CameraScreen,
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);
