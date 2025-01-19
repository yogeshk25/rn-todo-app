import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

type DetailRowProps = {
  label: string;
  value: any;
};

const DetailRow = ({label, value}: DetailRowProps) => {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

export default DetailRow;

const styles = StyleSheet.create({
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    flex: 1,
    fontWeight: '600',
    letterSpacing: 1,
  },
  value: {
    flex: 2,
    letterSpacing: 1,
  },
});
