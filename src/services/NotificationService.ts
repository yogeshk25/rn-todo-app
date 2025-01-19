import notifee, { AndroidImportance, Trigger, TriggerType } from '@notifee/react-native';
import { Todo } from '../models/Todo';

export const initializeNotifee = async () => {
  await notifee.requestPermission();
  await notifee.createChannel({
    id: 'default',
    name: 'Default channel',
    sound: 'default',
    badge: true,
    importance: AndroidImportance.HIGH,
  });

};

export const createTriggerNotification = async (todo: Todo) => {
  if (todo.dueDateTime && todo.isReminder) {
    // Create a time-based trigger
    const trigger: Trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: todo.dueDateTime.getTime(),
    };

    // Create a trigger notification
    await notifee.createTriggerNotification(
      {
        id: todo.id,
        title: todo.title,
        body: todo.description ?? '',
        android: {
          channelId: 'default',
          pressAction: {
            id: 'default',
          },
        },
      },
      trigger,
    );
  } else {
    // cancel any existing trigger
    notifee.cancelNotification(todo.id);
  }
};
