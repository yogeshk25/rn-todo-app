import {Button} from 'react-native';
import React from 'react';
import {ScreenNames} from '../constants';
import {useNavigation} from '@react-navigation/native';

const AddTodoButton = () => {
  const navigation = useNavigation();

  return (
    <Button
      title="Add"
      onPress={() => {
        navigation.navigate(ScreenNames.ADD_TODO);
      }}
    />
  );
};

export default AddTodoButton;
