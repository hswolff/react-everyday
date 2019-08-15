import React, { useState, useEffect } from 'react';
import { AsyncStorage } from 'react-native';
import { Provider, Consumer, ApplicationState, initialState } from './data';
import Router from './Router/createRouter';

function useAsyncStorage(applicationStateKey = 'ApplicationState') {
  const [storedData, setStoredData] = useState(null);

  const clearData = async () => {
    await AsyncStorage.setItem(applicationStateKey, '');
    // await AsyncStorage.setItem(String(navigationPersistenceKey), '');
  };

  const onMount = async () => {
    // await clearData();
    const rawData = await AsyncStorage.getItem(applicationStateKey);

    setStoredData(rawData ? JSON.parse(rawData) : initialState);
  };

  useEffect(() => {
    onMount();
  }, []);

  const onDataChange = (data: ApplicationState) => {
    AsyncStorage.setItem(applicationStateKey, JSON.stringify(data));
    return null;
  };

  return [storedData, onDataChange];
}

export default function Root() {
  const [state, onStateChange] = useAsyncStorage();

  if (!state) {
    return null;
  }

  return (
    <Provider initialState={state}>
      <Consumer>{onStateChange}</Consumer>
      <Router />
    </Provider>
  );
}
