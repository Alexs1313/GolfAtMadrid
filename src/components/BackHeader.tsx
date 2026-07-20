import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Fonts } from '../constants/theme';
import { Colors } from '../theme/colors';

import { AppIcon } from './icons/AppIcon';

interface Props {
  title: string;
  onBack: () => void;
  eyebrow?: string;
}

export function BackHeader({ title, onBack, eyebrow }: Props) {
  return (
    <View style={styles.BackHeaderWrapper}>
      <TouchableOpacity style={styles.BackHeaderControl} onPress={onBack}>
        <AppIcon name="chevronLeft" size={9} />
      </TouchableOpacity>
      <View style={styles.BackHeaderTextGroup}>
        {eyebrow && <Text style={styles.BackHeaderKicker}>{eyebrow}</Text>}
        <Text style={styles.BackHeaderHeading}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  BackHeaderWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    gap: 14,
  },

  BackHeaderControl: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#181c22',
    borderWidth: 1,
    borderColor: Colors.goldSoftBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  BackHeaderTextGroup: {
    flex: 1,
  },

  BackHeaderKicker: {
    fontSize: 10.5,
    color: Colors.goldLight,
    letterSpacing: 1.5,
    marginBottom: 4,
  },

  BackHeaderHeading: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 20,
    color: Colors.ivory,
  },
});
