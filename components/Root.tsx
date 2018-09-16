import React from 'react';
import { AsyncStorage } from 'react-native';
import { Consumer, ApplicationState, initialState } from './data';
import Router from './Router';
import { Provider } from './data';

const applicationStateKey = 'ApplicationState';

export default class Root extends React.Component {
  state = {
    initialState: null,
  };

  private onDataChange = (data: ApplicationState) => {
    AsyncStorage.setItem(applicationStateKey, JSON.stringify(data));
    return null;
  };

  async componentDidMount() {
    const rawData = await AsyncStorage.getItem(applicationStateKey);

    this.setState({
      initialState: rawData ? JSON.parse(rawData) : initialState,
    });
  }

  render() {
    if (!this.state.initialState) {
      return null;
    }

    return (
      <Provider initialState={this.state.initialState}>
        <Consumer>{this.onDataChange}</Consumer>
        <Router />
      </Provider>
    );
  }
}
