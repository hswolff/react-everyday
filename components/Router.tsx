import { createStackNavigator } from 'react-navigation';
import ProjectListScreen from './ProjectListScreen';
import ProjectScreen from './ProjectScreen';
import CreateProjectScreen from './CreateProjectScreen';

export enum RouteConfig {
  ProjectList = 'ProjectList',
  Project = 'Project',
  Camera = 'Camera',
  CreateProject = 'CreateProject',
}

export default createStackNavigator(
  {
    Main: createStackNavigator(
      {
        [RouteConfig.ProjectList]: ProjectListScreen,
        [RouteConfig.Project]: ProjectScreen,
      },
      {
        // initialRouteName: RouteConfig.Project,
        // initialRouteParams: {
        //   projectName: 'Banana Pan',
        // },
      }
    ),
    [RouteConfig.CreateProject]: CreateProjectScreen,
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);
