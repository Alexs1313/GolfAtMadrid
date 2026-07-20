import React, { useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { FadeInItem } from '../../components/FadeInItem';

import { ScreenHeader } from '../../components/ScreenHeader';
import { AppIcon } from '../../components/icons/AppIcon';

import { Fonts } from '../../constants/theme';
import { EVENTS } from '../../data/events';

import { useAppNavigation } from '../../navigation/NavigationContext';
import { useRequestsState } from '../../navigation/RequestsContext';
import { Colors } from '../../theme/colors';
import type { EventItem } from '../../types';

import { getEventDayLabel } from '../../utils/date';

export function EventsScreen() {
  const { openEventDetail, showRequestSent, openRequestCenter } =
    useAppNavigation();
  const { submitRequest, submittedRequests } = useRequestsState();
  const activeRequestCount = submittedRequests.filter(
    r => r.status === 'active',
  ).length;

  const daysWithEvents = useMemo(
    () => new Set(EVENTS.map(event => event.daysFromToday)),
    [],
  );

  const days = useMemo(() => {
    const maxDay = Math.max(...EVENTS.map(event => event.daysFromToday));
    return Array.from({ length: maxDay + 1 }, (_, i) => i);
  }, []);

  const [selectedDay, setSelectedDay] = useState(days[0]);
  const eventsForDay = EVENTS.filter(
    event => event.daysFromToday === selectedDay,
  );
  const selectedDayLabel = getEventDayLabel(selectedDay);

  const discoverEvent = () => {
    const pickedEvent = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    openEventDetail(pickedEvent);
  };

  return (
    <View style={styles.EventsScreenWrapper}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="Events"
          subtitle="Upcoming at Casino Real De Madrid"
          notificationCount={activeRequestCount}
          onPressBell={openRequestCenter}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.EventsScreenDaysLine}
        >
          {days.map(day => {
            const isActive = day === selectedDay;
            const hasEvents = daysWithEvents.has(day);
            const [weekday, number] = getEventDayLabel(day).split(' ');
            return (
              <TouchableOpacity key={day} onPress={() => setSelectedDay(day)}>
                {isActive ? (
                  <LinearGradient
                    colors={[Colors.goldLight, Colors.gold]}
                    style={styles.EventsScreenDayTile}
                  >
                    <Text style={styles.EventsScreenDayNameActive}>
                      {weekday}
                    </Text>
                    <Text style={styles.EventsScreenDayFigureActive}>
                      {number}
                    </Text>
                    <View
                      style={[
                        styles.EventsScreenDayMarkerActive,
                        !hasEvents && styles.EventsScreenDayMarkerHidden,
                      ]}
                    />
                  </LinearGradient>
                ) : (
                  <View style={styles.EventsScreenDayTileInactive}>
                    <Text style={styles.EventsScreenDayName}>{weekday}</Text>
                    <Text style={styles.EventsScreenDayFigure}>{number}</Text>
                    <View
                      style={[
                        styles.EventsScreenDayMarker,
                        !hasEvents && styles.EventsScreenDayMarkerHidden,
                      ]}
                    />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.EventsScreenSectionCaption}>
          {selectedDayLabel} — {eventsForDay.length}{' '}
          {eventsForDay.length === 1 ? 'event' : 'events'}
        </Text>

        {eventsForDay.length === 0 ? (
          <View style={styles.EventsScreenBlank}>
            <Text style={styles.EventsScreenBlankHeading}>
              No events this day
            </Text>
            <Text style={styles.EventsScreenBlankSubhead}>
              Check another date or let us surprise you below.
            </Text>
          </View>
        ) : (
          eventsForDay.map((event, i) => (
            <FadeInItem key={event.id} index={i}>
              <EventCard
                event={event}
                onViewDetails={() => openEventDetail(event)}
                onSendRequest={() => {
                  submitRequest('Events', event.title);
                  showRequestSent(event.title);
                }}
              />
            </FadeInItem>
          ))
        )}

        <TouchableOpacity
          style={styles.EventsScreenDiscoverTile}
          onPress={discoverEvent}
        >
          <View style={styles.EventsScreenDiscoverGlyph}>
            <AppIcon name="sparkle" size={18} />
          </View>
          <View style={styles.EventsScreenDiscoverCopy}>
            <Text style={styles.EventsScreenDiscoverHeading}>
              Discover an Event
            </Text>
            <Text style={styles.EventsScreenDiscoverSubhead}>
              Let us surprise you with something on today's calendar
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function EventCard({
  event,
  onViewDetails,
  onSendRequest,
}: {
  event: EventItem;
  onViewDetails: () => void;
  onSendRequest: () => void;
}) {
  return (
    <View style={styles.EventCardWrapper}>
      <View style={styles.EventCardImageFrame}>
        <Image
          source={event.image}
          style={styles.EventCardPhoto}
          resizeMode="cover"
        />
        <View style={styles.EventCardCategoryChip}>
          <Text style={styles.EventCardCategoryLabel}>{event.category}</Text>
        </View>
      </View>

      <View style={styles.EventCardContent}>
        <Text style={styles.EventCardHeading}>{event.title}</Text>
        <Text style={styles.EventCardDetails}>
          {getEventDayLabel(event.daysFromToday)} · {event.timeLabel} ·{' '}
          {event.location}
        </Text>
        <Text style={styles.EventCardSummary}>{event.shortDescription}</Text>
        <Text style={styles.EventCardAvailability}>{event.placesLabel}</Text>

        <View style={styles.EventCardControls}>
          <TouchableOpacity
            style={styles.EventCardDetailsAction}
            onPress={onViewDetails}
          >
            <Text style={styles.EventCardDetailsActionLabel}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.EventCardRequestActionShell}
            onPress={onSendRequest}
          >
            <LinearGradient
              colors={[Colors.goldLight, Colors.gold]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.EventCardRequestAction}
            >
              <Text style={styles.EventCardRequestActionLabel}>
                Send Request
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  EventsScreenWrapper: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  EventsScreenDaysLine: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 8,
  },

  EventsScreenDayTile: {
    width: 46,
    height: 65.5,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  EventsScreenDayTileInactive: {
    width: 46,
    height: 65.5,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceBorderSoft,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  EventsScreenDayName: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.ivory,
    letterSpacing: 0.5,
  },
  EventsScreenDayFigure: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 19,
    color: Colors.ivory,
  },

  EventsScreenDayNameActive: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.buttonText,
    letterSpacing: 0.5,
  },
  EventsScreenDayFigureActive: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 19,
    color: Colors.buttonText,
  },

  EventsScreenDayMarker: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.goldLight,
  },

  EventsScreenDayMarkerActive: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.buttonText,
  },
  EventsScreenDayMarkerHidden: {
    opacity: 0,
  },

  EventsScreenSectionCaption: {
    fontSize: 12,
    color: Colors.textFaint,
    paddingHorizontal: 18,
    marginTop: 16,
    marginBottom: 8,
  },
  EventsScreenBlank: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 32,
  },

  EventsScreenBlankHeading: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 17,
    color: Colors.ivory,
    marginBottom: 8,
  },

  EventsScreenBlankSubhead: {
    fontSize: 13,
    color: Colors.ivoryMuted,
    textAlign: 'center',
  },

  EventsScreenDiscoverTile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1b1f27',
    borderWidth: 1,
    borderColor: Colors.goldSoftBorder,
    borderRadius: 19,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 24,
    padding: 16,
    gap: 14,
  },
  EventsScreenDiscoverGlyph: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.goldSoftBg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  EventsScreenDiscoverCopy: {
    flex: 1,
  },
  EventsScreenDiscoverHeading: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 14.5,
    color: Colors.ivory,
    marginBottom: 4,
  },
  EventsScreenDiscoverSubhead: {
    fontSize: 11.5,
    color: Colors.textFainter,
  },

  EventCardWrapper: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
  },

  EventCardImageFrame: {
    height: 120,
  },
  EventCardPhoto: {
    width: '100%',
    height: '100%',
  },

  EventCardCategoryChip: {
    position: 'absolute',
    left: 12,
    top: 10,
    backgroundColor: 'rgba(5,6,10,0.6)',
    borderWidth: 1,
    borderColor: Colors.goldSoftBorder,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  EventCardCategoryLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: Colors.goldLight,
  },

  EventCardContent: {
    padding: 16,
  },
  EventCardHeading: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 17,
    color: Colors.ivory,
    marginBottom: 8,
  },

  EventCardDetails: {
    fontSize: 12.5,
    color: Colors.textFainter,
    marginBottom: 10,
  },
  EventCardSummary: {
    fontSize: 13,
    lineHeight: 19.5,
    color: Colors.ivoryMuted,
    marginBottom: 10,
  },
  EventCardAvailability: {
    fontSize: 12,
    color: Colors.goldLight,
    marginBottom: 14,
  },
  EventCardControls: {
    flexDirection: 'row',
    gap: 10,
  },

  EventCardDetailsAction: {
    flex: 1,
    height: 39.5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.goldSoftBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },

  EventCardDetailsActionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.goldLight,
  },
  EventCardRequestActionShell: {
    flex: 1,
  },
  EventCardRequestAction: {
    height: 39.5,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  EventCardRequestActionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.buttonText,
  },
});
