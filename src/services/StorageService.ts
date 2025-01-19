import { MMKV } from 'react-native-mmkv';
import { Todo } from '../models/Todo';
import notifee from '@notifee/react-native';

export const StorageService = () => {
  const TODO_COLLECTION_KEY = 'todos';

  let _storage: MMKV = new MMKV();

  const _getObject = (key: string, defaultReturn?: any) => {
    if (_storage) {
      const json = _storage.getString(key);
      if (json) {
        return JSON.parse(json);
      } else {
        return defaultReturn;
      }
    }
  };

  const _setObject = (key: string, obj: any) => {
    if (_storage) {
      _storage.set(key, JSON.stringify(obj));
    }
  };

  const saveTodos = (todos: Todo[]) => {
    _setObject(TODO_COLLECTION_KEY, todos);
  };

  return {
    getTodos(filterObject?: any): Todo[] {
      const todos: Todo[] = _getObject(TODO_COLLECTION_KEY, []);
      const searchToken = filterObject?.searchToken.toLocaleLowerCase() ?? '';
      let filteredTodos = todos.filter((todo) => todo.title.toLocaleLowerCase().includes(searchToken));

      if (filterObject.showPending === false) {
        const now = new Date();
        filteredTodos = filteredTodos.filter((t) => t.isCompleted || (t.dueDateTime && new Date(t.dueDateTime) < now));
      }

      if (filterObject.showOverdue === false) {
        const now = new Date();
        filteredTodos = filteredTodos.filter((t) => t.isCompleted || t.dueDateTime === undefined || (t.dueDateTime && new Date(t.dueDateTime) > now));
      }

      if (filterObject.showCompleted === false) {
        filteredTodos = filteredTodos.filter((t) => !t.isCompleted);
      }

      return filteredTodos;
    },
    getTodo(todoId: string) {
      return this.getTodos().find((t) => t.id === todoId);
    },
    clearCompletedTasks() {
      const todos = this.getTodos();
      saveTodos(todos.filter((t) => !t.isCompleted));
    },
    async deleteTodo(todo: Todo) {
      try {
        // remove associated notification trigger if any
        await notifee.cancelNotification(todo.id);
      } catch (error) {
        console.log('Failed to cancel trigger, while deleting todo.');
      }
      const todos = this.getTodos();
      const filteredTodos = todos.filter((t) => t.id !== todo.id);
      saveTodos(filteredTodos);
      return filteredTodos;
    },
    saveTodo(todo: Todo) {
      let todos: Todo[] = this.getTodos();
      const atIndex = todos.findIndex((t) => t.id === todo.id);
      if (atIndex >= 0) {
        todos[atIndex] = todo;
      } else {
        todos.push(todo);
      }
      saveTodos(todos);
    },
  };
};
