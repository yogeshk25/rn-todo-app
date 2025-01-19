import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Button, Input, Switch} from 'react-native-elements';
import {useNavigation, useRoute} from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Todo} from '../models/Todo';
import {StorageService} from '../services/StorageService';
import {createTriggerNotification} from '../services/NotificationService';

const AddTodoScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [isDateTimeVisible, setIsDateTimeVisible] = useState(false);
  const [dateTime, setDateTime] = useState<Date>();
  const [isReminderNeeded, setIsReminderNeeded] = useState(false);

  useEffect(() => {
    if (route.params?.todo) {
      const todoObj = route.params?.todo as Todo;
      setTitle(todoObj.title);
      setDescription(todoObj.description);
      setDescription(todoObj.description);
      if (todoObj.dueDateTime) {
        setDateTime(new Date(todoObj.dueDateTime));
      }
      setIsReminderNeeded(todoObj.isReminder);
    }
  }, [route.params?.todo]);

  const openCalendar = () => setIsDateTimeVisible(true);
  const closeCalendar = () => setIsDateTimeVisible(false);

  const handleCancelPress = () => {
    navigation.goBack();
  };

  const handleSavePress = async () => {
    let todo: Todo = {...route.params?.todo} ?? {};
    if (todo.id === undefined) {
      todo.id = Math.random().toString(16).slice(2);
    }
    todo.title = title ?? '';
    todo.description = description;
    todo.dueDateTime = dateTime;
    todo.isReminder = isReminderNeeded;
    await createTriggerNotification(todo);
    StorageService().saveTodo(todo);
    route.params?.refresh && route.params.refresh();
    navigation.popToTop();
  };

  const canNotSave = useCallback(() => {
    if (title && title.trim().length > 0) {
      return false;
    }

    return true;
  }, [title]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.form}>
        <Input
          label="Title"
          value={title}
          onChangeText={value => setTitle(value)}
        />
        <Input
          label="Description"
          multiline={true}
          numberOfLines={5}
          value={description}
          onChangeText={value => setDescription(value)}
          style={styles.descriptionInput}
        />
        <Input
          value={dateTime ? dateTime.toLocaleString() : ''}
          label="Due Date & Time"
          onFocus={openCalendar}
        />
        <View style={styles.reminderRow}>
          <Text style={styles.reminderLabel}>Reminder Notification</Text>
          <Switch
            value={isReminderNeeded}
            onChange={() => setIsReminderNeeded(val => !val)}
          />
        </View>
      </ScrollView>
      <View style={styles.buttonRow}>
        <Button
          title="Cancel"
          onPress={handleCancelPress}
          type="outline"
          containerStyle={styles.buttonStyle}
        />
        <Button
          title="Save"
          disabled={canNotSave()}
          onPress={handleSavePress}
          type="solid"
          containerStyle={styles.buttonStyle}
        />
      </View>
      <DateTimePickerModal
        isVisible={isDateTimeVisible}
        mode="datetime"
        minimumDate={new Date()}
        date={dateTime ?? new Date()}
        onConfirm={value => {
          closeCalendar();
          value.setSeconds(0, 0);
          setDateTime(value);
        }}
        onCancel={closeCalendar}
      />
    </SafeAreaView>
  );
};

export default AddTodoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 8,
  },
  descriptionInput: {
    minHeight: 100,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderLabel: {
    flex: 1,
    fontSize: 15,
    marginStart: 12,
  },
  buttonRow: {
    flexDirection: 'row',
  },
  buttonStyle: {
    flex: 1,
    margin: 8,
  },
});
