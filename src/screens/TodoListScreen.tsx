import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {StorageService} from '../services/StorageService';
import {Todo} from '../models/Todo';
import TodoListItem from '../components/TodoListItem';
import ListEmptyView from '../components/ListEmptyView';
import {Button, Chip, Input} from 'react-native-elements';

const TodoListScreen = () => {
  const isFocus = useIsFocused();

  const [searchToken, setSearchToken] = useState('');
  const [todos, setTodos] = useState<Todo[]>();
  const [showPending, setShowPending] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  const [showOverdue, setShowOverdue] = useState(true);

  const fetchTodos = () => {
    setTodos(
      StorageService().getTodos({
        searchToken,
        showPending,
        showCompleted,
        showOverdue,
      }),
    );
  };

  useEffect(() => {
    isFocus && fetchTodos();
  }, [isFocus, showPending, showCompleted, showOverdue, searchToken]);

  const clearCompleted = () => {
    StorageService().clearCompletedTasks();
    fetchTodos();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.row}>
          <Input
            placeholder="Search"
            value={searchToken}
            onChangeText={value => setSearchToken(value)}
          />
        </View>
        <View style={styles.row}>
          <Chip
            containerStyle={styles.chipContainer}
            title="Pending"
            type={showPending ? 'solid' : 'outline'}
            onPress={() => setShowPending(val => !val)}
          />
          <Chip
            containerStyle={styles.chipContainer}
            title="Completed"
            type={showCompleted ? 'solid' : 'outline'}
            onPress={() => setShowCompleted(val => !val)}
          />
          <Chip
            containerStyle={styles.chipContainer}
            title="Overdue"
            type={showOverdue ? 'solid' : 'outline'}
            onPress={() => setShowOverdue(val => !val)}
          />
        </View>
        <FlatList
          data={todos}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TodoListItem todo={item} onUpdate={fetchTodos} />
          )}
          maxToRenderPerBatch={30}
          contentContainerStyle={styles.todoListContainer}
          ListEmptyComponent={<ListEmptyView message="No TODOs to show!" />}
        />
        <Button
          title="Clear completed tasks"
          onPress={clearCompleted}
          type="solid"
          containerStyle={styles.clearCompletedButton}
        />
      </View>
    </SafeAreaView>
  );
};

export default TodoListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  todoListContainer: {
    flexGrow: 1,
  },
  clearCompletedButton: {
    marginHorizontal: 12,
  },
  chipContainer: {
    marginStart: 12,
  },
});
