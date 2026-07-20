import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppIcon } from '../../components/icons/AppIcon';
import { Fonts } from '../../constants/theme';

import { useAppNavigation } from '../../navigation/NavigationContext';
import { Colors } from '../../theme/colors';

export function RequestSentModal() {
  const { requestSentTitle, closeRequestSent, openRequestCenter } =
    useAppNavigation();

  if (!requestSentTitle) {
    return null;
  }

  const viewRequest = () => {
    closeRequestSent();
    openRequestCenter();
  };

  return (
    <View style={styles.RequestSentModalOverlay}>
      <View style={styles.RequestSentModalPanel}>
        <View style={styles.RequestSentModalIconHolder}>
          <AppIcon name="checkmark" size={26} />
        </View>

        <Text style={styles.RequestSentModalHeading}>Request Sent</Text>
        <Text style={styles.RequestSentModalTopic}>{requestSentTitle}</Text>
        <Text style={styles.RequestSentModalDetail}>
          Your request has been successfully submitted. The venue team will
          review the details and update its status in the Request Center. Open
          the notification bell to follow progress and view further
          instructions.
        </Text>

        <View style={styles.RequestSentModalControls}>
          <TouchableOpacity
            style={styles.RequestSentModalSecondaryAction}
            onPress={closeRequestSent}
          >
            <Text style={styles.RequestSentModalSecondaryActionLabel}>
              Continue Browsing
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.RequestSentModalPrimaryAction}
            onPress={viewRequest}
          >
            <Text style={styles.RequestSentModalPrimaryActionLabel}>
              View Request
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  RequestSentModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.scrim,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  RequestSentModalPanel: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.goldSoftBorder,
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
  },
  RequestSentModalIconHolder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.goldSoftBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  RequestSentModalHeading: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 19,
    color: Colors.ivory,
    marginBottom: 6,
  },
  RequestSentModalTopic: {
    fontSize: 12.5,
    color: Colors.textFainter,
    marginBottom: 14,
    textAlign: 'center',
  },
  RequestSentModalDetail: {
    fontSize: 13,
    lineHeight: 20.15,
    color: Colors.ivoryMuted,
    textAlign: 'center',
    marginBottom: 20,
  },

  RequestSentModalControls: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  RequestSentModalSecondaryAction: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.goldSoftBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },

  RequestSentModalSecondaryActionLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.goldLight,
    textAlign: 'center',
  },

  RequestSentModalPrimaryAction: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.goldLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  RequestSentModalPrimaryActionLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: Colors.buttonText,
  },
});
