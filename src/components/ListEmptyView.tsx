import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

type ListEmptyViewProps = {
  message: string;
};

const ListEmptyView = ({message}: ListEmptyViewProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

export default ListEmptyView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  message: {
    fontWeight: '700',
    fontSize: 20,
  },
});
