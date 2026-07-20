import React from 'react';

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { BackHeader } from '../../components/BackHeader';
import { Fonts } from '../../constants/theme';

import { useAppNavigation } from '../../navigation/NavigationContext';

import { useRequestsState } from '../../navigation/RequestsContext';
import { Colors } from '../../theme/colors';

import { getEventDayLabel } from '../../utils/date';

export function EventDetailScreen() {
  const { eventDetail, closeEventDetail, showRequestSent } = useAppNavigation();
  const { submitRequest } = useRequestsState();

  if (!eventDetail) {
    return null;
  }

  const event = eventDetail;

  return (
    <View style={styles.EventDetailScreenWrapper}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <BackHeader title="Event Details" onBack={closeEventDetail} />

        <Image
          source={event.image}
          style={styles.EventDetailScreenPhoto}
          resizeMode="cover"
        />

        <View style={styles.EventDetailScreenContent}>
          <View style={styles.EventDetailScreenCategoryChip}>
            <Text style={styles.EventDetailScreenCategoryLabel}>
              {event.category}
            </Text>
          </View>

          <Text style={styles.EventDetailScreenHeading}>{event.title}</Text>
          <Text style={styles.EventDetailScreenSummary}>
            {event.fullDescription}
          </Text>

          <View style={styles.EventDetailScreenInfoLine}>
            <View style={styles.EventDetailScreenInfoTile}>
              <Text style={styles.EventDetailScreenInfoCaption}>
                DATE & TIME
              </Text>
              <Text style={styles.EventDetailScreenInfoFigure}>
                {getEventDayLabel(event.daysFromToday)}
              </Text>
              <Text style={styles.EventDetailScreenInfoFigure}>
                {event.timeLabel}
              </Text>
            </View>
            <View style={styles.EventDetailScreenInfoTile}>
              <Text style={styles.EventDetailScreenInfoCaption}>LOCATION</Text>
              <Text style={styles.EventDetailScreenInfoFigure}>
                {event.location}
              </Text>
            </View>
          </View>

          <Text style={styles.EventDetailScreenSectionCaption}>Schedule</Text>
          {event.schedule.map((item, i) => (
            <View key={i} style={styles.EventDetailScreenScheduleLine}>
              <Text style={styles.EventDetailScreenScheduleSlot}>
                {item.time}
              </Text>
              <Text style={styles.EventDetailScreenScheduleCaption}>
                {item.label}
              </Text>
            </View>
          ))}

          <Text style={styles.EventDetailScreenSectionCaption}>
            Included & Requirements
          </Text>
          <View style={styles.EventDetailScreenTagsLine}>
            {event.included.map(tag => (
              <View key={tag} style={styles.EventDetailScreenChip}>
                <Text style={styles.EventDetailScreenChipLabel}>{tag}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.EventDetailScreenRequirementsNotice}>
            {event.requirementsNote}
          </Text>

          <Text style={styles.EventDetailScreenAvailability}>
            {event.placesLabel}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.EventDetailScreenBottomBar}>
        <TouchableOpacity
          onPress={() => {
            submitRequest('Events', event.title);
            showRequestSent(event.title);
          }}
        >
          <LinearGradient
            colors={[Colors.goldLight, Colors.gold]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.EventDetailScreenPrimaryAction}
          >
            <Text style={styles.EventDetailScreenPrimaryActionLabel}>
              Send Attendance Request
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  EventDetailScreenWrapper: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  EventDetailScreenPhoto: {
    width: '100%',
    height: 182,
  },
  EventDetailScreenContent: {
    padding: 18,
  },
  EventDetailScreenCategoryChip: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.goldSoftBg,
    borderWidth: 1,
    borderColor: Colors.goldSoftBorder,
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 4,
    marginBottom: 12,
  },

  EventDetailScreenCategoryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.goldLight,
  },

  EventDetailScreenHeading: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 23,
    color: Colors.ivory,
    marginBottom: 12,
  },

  EventDetailScreenSummary: {
    fontSize: 13,
    lineHeight: 20.8,
    color: Colors.ivoryMuted,
    marginBottom: 20,
  },

  EventDetailScreenInfoLine: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  EventDetailScreenInfoTile: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 12,
  },
  EventDetailScreenInfoCaption: {
    fontSize: 10,
    color: Colors.textFaint,
    marginBottom: 8,
  },
  EventDetailScreenInfoFigure: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.ivory,
  },
  EventDetailScreenSectionCaption: {
    fontSize: 12,
    color: Colors.textFaint,
    marginBottom: 10,
  },

  EventDetailScreenScheduleLine: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  EventDetailScreenScheduleSlot: {
    width: 74,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.goldLight,
  },

  EventDetailScreenScheduleCaption: {
    flex: 1,
    fontSize: 12.5,
    color: Colors.ivoryMuted,
  },

  EventDetailScreenTagsLine: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
    marginTop: 4,
  },
  EventDetailScreenChip: {
    backgroundColor: '#1b1f27',
    borderWidth: 1,
    borderColor: 'rgba(233,205,110,0.22)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  EventDetailScreenChipLabel: {
    fontSize: 11.5,
    color: Colors.ivoryMuted,
  },
  EventDetailScreenRequirementsNotice: {
    fontSize: 12.5,
    lineHeight: 18,
    color: Colors.textFainter,
    marginBottom: 20,
  },
  EventDetailScreenAvailability: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.goldLight,
    marginBottom: 24,
  },
  EventDetailScreenBottomBar: {
    borderTopWidth: 1,
    borderTopColor: Colors.headerBorder,
    padding: 18,
  },

  EventDetailScreenPrimaryAction: {
    height: 47.5,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  EventDetailScreenPrimaryActionLabel: {
    fontSize: 14.5,
    fontWeight: '700',
    color: Colors.buttonText,
  },
});
