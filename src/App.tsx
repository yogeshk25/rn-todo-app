import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useRef} from 'react';
import RootStack from './navigation/RootStack';
import {initializeNotifee} from './services/NotificationService';
import notifee, {EventType} from '@notifee/react-native';
import {ScreenNames} from './constants';
import {StorageService} from './services/StorageService';

function App(): React.JSX.Element {
  const navRef = useRef();

  useEffect(() => {
    initializeNotifee();
  }, []);

  // Subscribe to events
  useEffect(() => {
    return notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.PRESS:
          if (detail.notification?.id) {
            navigateToTodoDetail(detail.notification.id);
          }
          break;
      }
    });
  }, []);

  useEffect(() => {
    notifee.getInitialNotification().then(initialNotification => {
      if (initialNotification?.notification.id) {
        navigateToTodoDetail(initialNotification.notification.id);
      }
    });
  }, []);

  const navigateToTodoDetail = (todoId: string) => {
    const todo = StorageService().getTodo(todoId);
    if (navRef.current && todo) {
      navRef.current.navigate(ScreenNames.TODO_DETAILS, {todo});
    }
  };

  return (
    <NavigationContainer ref={navRef}>
      <RootStack />
    </NavigationContainer>
  );
}

export default App;
