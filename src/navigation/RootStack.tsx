import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TodoListScreen from '../screens/TodoListScreen';
import TodoDetailsScreen from '../screens/TodoDetailsScreen';
import AddTodoScreen from '../screens/AddTodoScreen';
import {ScreenNames} from '../constants';
import AddTodoButton from '../components/AddTodoButton';

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator initialRouteName="todos">
      <Stack.Screen
        name={ScreenNames.TODO_LIST}
        component={TodoListScreen}
        options={{
          title: 'Todos',
          headerRight: () => <AddTodoButton />,
        }}
      />
      <Stack.Screen
        name={ScreenNames.TODO_DETAILS}
        component={TodoDetailsScreen}
        options={{
          title: 'Todo Detail',
        }}
      />
      <Stack.Screen
        name={ScreenNames.ADD_TODO}
        component={AddTodoScreen}
        options={({route}) => ({
          title: route.params?.todo?.id ? 'Edit Todo' : 'Add Todo',
        })}
      />
    </Stack.Navigator>
  );
}

export default RootStack;
