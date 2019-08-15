import React from 'react';
import {
  createAppContainer,
  createStackNavigator,
  NavigationContainerProps,
  NavigationNavigatorProps,
} from 'react-navigation';
import { RouteConfig } from './index';
import ProjectListScreen from '../ProjectListScreen';
import ProjectScreen from '../ProjectScreen';
import CreateProjectScreen from '../CreateProjectScreen';
import CameraScreen from '../CameraScreen';
import { AsyncStorage } from 'react-native';

const AppNavigator = createStackNavigator(
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

const AppContainer = createAppContainer(AppNavigator);

const navigationPersistenceKey = __DEV__ ? 'NavigationStateDEV' : null;
const persistNavigationState = async (navState: any) => {
  if (!navigationPersistenceKey) {
    return;
  }
  try {
    await AsyncStorage.setItem(
      navigationPersistenceKey,
      JSON.stringify(navState)
    );
  } catch (err) {
    // handle the error according to your needs
  }
};
const loadNavigationState = async () => {
  if (!navigationPersistenceKey) {
    return;
  }
  const jsonString = await AsyncStorage.getItem(navigationPersistenceKey);
  return JSON.parse(jsonString ? jsonString : '');
};

export default (
  props: NavigationContainerProps & NavigationNavigatorProps<any>
) =>
  React.createElement(AppContainer, {
    persistNavigationState: persistNavigationState,
    loadNavigationState: loadNavigationState,
    ...props,
  });
