import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Todo} from '../models/Todo';
import {useNavigation} from '@react-navigation/native';
import {ScreenNames} from '../constants';
import {Card, CheckBox, Icon} from 'react-native-elements';
import {StorageService} from '../services/StorageService';

type TodoListItemProps = {
  todo: Todo;
  onUpdate: () => void;
};

const TodoListItem = ({todo, onUpdate}: TodoListItemProps) => {
  const navigation = useNavigation();

  const getStatus = () => {
    let status = 'Pending';
    if (todo.isCompleted) {
      status = 'Completed';
    } else {
      if (todo.dueDateTime && new Date(todo.dueDateTime) < new Date()) {
        status = 'Overdue';
      }
    }

    return status;
  };

  const status = getStatus();

  const openTodoDetail = () => {
    navigation.navigate(ScreenNames.TODO_DETAILS, {todo});
  };

  const onCompleteChange = () => {
    todo.isCompleted = !todo.isCompleted;
    StorageService().saveTodo(todo);
    onUpdate();
  };

  const handleDelete = () => {
    StorageService().deleteTodo(todo);
    onUpdate();
  };

  return (
    <View style={styles.rowContainer}>
      <CheckBox checked={todo.isCompleted} onPress={onCompleteChange} />
      <TouchableOpacity style={styles.container} onPress={openTodoDetail}>
        <Card
          containerStyle={{
            marginStart: 0,
            backgroundColor: todo.isCompleted ? '#f7f7f7' : 'white',
          }}>
          <Text style={styles.title}>{todo.title}</Text>
          {todo.dueDateTime && (
            <Text style={styles.dueDateTime}>
              Due on: {new Date(todo.dueDateTime).toLocaleString()}
            </Text>
          )}
          <Text style={{color: status === 'Overdue' ? 'red' : 'black'}}>
            {status}
          </Text>
        </Card>
      </TouchableOpacity>
      <Icon name="trash" type="font-awesome" onPress={handleDelete} />
    </View>
  );
};

export default TodoListItem;

const baseTextStyle = {
  marginBottom: 4,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginEnd: 8,
  },
  title: {
    ...baseTextStyle,
    fontWeight: '600',
    fontSize: 16,
  },
  dueDateTime: {
    ...baseTextStyle,
  },
});
