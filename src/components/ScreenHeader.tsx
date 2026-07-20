import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Fonts } from '../constants/theme';
import { Colors } from '../theme/colors';
import { AppIcon } from './icons/AppIcon';

interface Props {
  title: string;
  subtitle: string;
  notificationCount?: number;
  onPressBell?: () => void;
}

export function ScreenHeader({
  title,
  subtitle,
  notificationCount = 6,
  onPressBell,
}: Props) {
  return (
    <View style={styles.ScreenHeaderWrapper}>
      <View>
        <Text style={styles.ScreenHeaderHeading}>{title}</Text>
        <Text style={styles.ScreenHeaderCaption}>{subtitle}</Text>
      </View>

      <TouchableOpacity
        style={styles.ScreenHeaderAlert}
        onPress={onPressBell}
        disabled={!onPressBell}
      >
        <AppIcon name="bell" size={18} />
        {notificationCount > 0 && (
          <View style={styles.ScreenHeaderChip}>
            <Text style={styles.ScreenHeaderChipCopy}>{notificationCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  ScreenHeaderWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.headerBorder,
    backgroundColor: Colors.headerBg,
  },

  ScreenHeaderHeading: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 23,
    color: Colors.ivory,
  },
  ScreenHeaderCaption: {
    fontSize: 11.5,
    color: Colors.textFaint,
    letterSpacing: 0.5,
    marginTop: 4,
  },

  ScreenHeaderAlert: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#181c22',
    borderWidth: 1,
    borderColor: Colors.goldSoftBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ScreenHeaderChip: {
    position: 'absolute',
    top: -2,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    backgroundColor: Colors.badgeRed,
    borderWidth: 1.5,
    borderColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ScreenHeaderChipCopy: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#fff',
  },
});
