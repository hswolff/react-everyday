import { createStackNavigator } from 'react-navigation';
import { RouteConfig } from './index';
import ProjectListScreen from '../ProjectListScreen';
import ProjectScreen from '../ProjectScreen';
import CreateProjectScreen from '../CreateProjectScreen';
import CameraScreen from '../CameraScreen';

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
