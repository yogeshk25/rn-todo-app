import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button} from 'react-native-elements';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StorageService} from '../services/StorageService';
import {ScreenNames} from '../constants';
import {Todo} from '../models/Todo';
import DetailRow from '../components/DetailRow';

const TodoDetailsScreen = () => {
  const navigation = useNavigation();
  const routes = useRoute();

  const [todo, setTodo] = useState<Todo>();

  useEffect(() => {
    if (routes.params?.todo) {
      setTodo(routes.params.todo);
    }
  }, [routes.params?.todo]);

  const handleDeletePress = () => {
    if (routes.params?.todo) {
      StorageService().deleteTodo(routes.params.todo);
      navigation.popToTop();
    }
  };

  const handleEditPress = () => {
    navigation.navigate(ScreenNames.ADD_TODO, {todo: routes.params?.todo});
  };

  return (
    <SafeAreaView style={styles.container}>
      {todo && (
        <>
          <ScrollView style={styles.form}>
            <View style={styles.container}>
              <DetailRow label="Title:" value={todo.title} />
              {todo.description && (
                <DetailRow label="Description:" value={todo.description} />
              )}
              {todo.dueDateTime && (
                <DetailRow label="Due on:" value={new Date(todo.dueDateTime).toLocaleString()} />
              )}
              <DetailRow label="Reminder Notification:" value={todo.isReminder ? 'Yes' : 'No'} />
              <DetailRow label="Completed:" value={todo.isCompleted ? 'Yes' : 'No'} />
            </View>
          </ScrollView>
          <View style={styles.buttonRow}>
            <Button
              title="Delete"
              onPress={handleDeletePress}
              type="outline"
              containerStyle={styles.buttonStyle}
            />
            <Button
              title="Edit"
              onPress={handleEditPress}
              type="solid"
              containerStyle={[styles.buttonStyle, {marginStart: 12}]}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default TodoDetailsScreen;

const row = {
  flexDirection: 'row',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 12,
  },
  buttonRow: {
    ...row,
    paddingHorizontal: 12,
  },
  buttonStyle: {
    flex: 1,
  },
});
