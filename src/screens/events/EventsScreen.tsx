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
    const random = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    openEventDetail(random);
  };

  return (
    <View style={styles.EventsScreenContainer}>
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
          contentContainerStyle={styles.EventsScreenDaysRow}
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
                    style={styles.EventsScreenDayChip}
                  >
                    <Text style={styles.EventsScreenDayWeekdayActive}>
                      {weekday}
                    </Text>
                    <Text style={styles.EventsScreenDayNumberActive}>
                      {number}
                    </Text>
                    <View
                      style={[
                        styles.EventsScreenDayDotActive,
                        !hasEvents && styles.EventsScreenDayDotHidden,
                      ]}
                    />
                  </LinearGradient>
                ) : (
                  <View style={styles.EventsScreenDayChipInactive}>
                    <Text style={styles.EventsScreenDayWeekday}>{weekday}</Text>
                    <Text style={styles.EventsScreenDayNumber}>{number}</Text>
                    <View
                      style={[
                        styles.EventsScreenDayDot,
                        !hasEvents && styles.EventsScreenDayDotHidden,
                      ]}
                    />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.EventsScreenSectionLabel}>
          {selectedDayLabel} — {eventsForDay.length}{' '}
          {eventsForDay.length === 1 ? 'event' : 'events'}
        </Text>

        {eventsForDay.length === 0 ? (
          <View style={styles.EventsScreenEmpty}>
            <Text style={styles.EventsScreenEmptyTitle}>
              No events this day
            </Text>
            <Text style={styles.EventsScreenEmptySubtitle}>
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
          style={styles.EventsScreenDiscoverCard}
          onPress={discoverEvent}
        >
          <View style={styles.EventsScreenDiscoverIcon}>
            <AppIcon name="sparkle" size={18} />
          </View>
          <View style={styles.EventsScreenDiscoverText}>
            <Text style={styles.EventsScreenDiscoverTitle}>
              Discover an Event
            </Text>
            <Text style={styles.EventsScreenDiscoverSubtitle}>
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
    <View style={styles.EventCardContainer}>
      <View style={styles.EventCardImageWrap}>
        <Image
          source={event.image}
          style={styles.EventCardImage}
          resizeMode="cover"
        />
        <View style={styles.EventCardCategoryBadge}>
          <Text style={styles.EventCardCategoryText}>{event.category}</Text>
        </View>
      </View>

      <View style={styles.EventCardBody}>
        <Text style={styles.EventCardTitle}>{event.title}</Text>
        <Text style={styles.EventCardMeta}>
          {getEventDayLabel(event.daysFromToday)} · {event.timeLabel} ·{' '}
          {event.location}
        </Text>
        <Text style={styles.EventCardDescription}>
          {event.shortDescription}
        </Text>
        <Text style={styles.EventCardPlaces}>{event.placesLabel}</Text>

        <View style={styles.EventCardActions}>
          <TouchableOpacity
            style={styles.EventCardDetailsBtn}
            onPress={onViewDetails}
          >
            <Text style={styles.EventCardDetailsBtnText}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.EventCardRequestBtnWrapper}
            onPress={onSendRequest}
          >
            <LinearGradient
              colors={[Colors.goldLight, Colors.gold]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.EventCardRequestBtn}
            >
              <Text style={styles.EventCardRequestBtnText}>Send Request</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  EventsScreenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  EventsScreenDaysRow: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 8,
  },
  EventsScreenDayChip: {
    width: 46,
    height: 65.5,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  EventsScreenDayChipInactive: {
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
  EventsScreenDayWeekday: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.ivory,
    letterSpacing: 0.5,
  },
  EventsScreenDayNumber: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 19,
    color: Colors.ivory,
  },
  EventsScreenDayWeekdayActive: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.buttonText,
    letterSpacing: 0.5,
  },
  EventsScreenDayNumberActive: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 19,
    color: Colors.buttonText,
  },
  EventsScreenDayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.goldLight,
  },
  EventsScreenDayDotActive: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.buttonText,
  },
  EventsScreenDayDotHidden: {
    opacity: 0,
  },
  EventsScreenSectionLabel: {
    fontSize: 12,
    color: Colors.textFaint,
    paddingHorizontal: 18,
    marginTop: 16,
    marginBottom: 8,
  },
  EventsScreenEmpty: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 32,
  },
  EventsScreenEmptyTitle: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 17,
    color: Colors.ivory,
    marginBottom: 8,
  },
  EventsScreenEmptySubtitle: {
    fontSize: 13,
    color: Colors.ivoryMuted,
    textAlign: 'center',
  },
  EventsScreenDiscoverCard: {
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
  EventsScreenDiscoverIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.goldSoftBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  EventsScreenDiscoverText: {
    flex: 1,
  },
  EventsScreenDiscoverTitle: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 14.5,
    color: Colors.ivory,
    marginBottom: 4,
  },
  EventsScreenDiscoverSubtitle: {
    fontSize: 11.5,
    color: Colors.textFainter,
  },
  EventCardContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
  },
  EventCardImageWrap: {
    height: 120,
  },
  EventCardImage: {
    width: '100%',
    height: '100%',
  },
  EventCardCategoryBadge: {
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
  EventCardCategoryText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: Colors.goldLight,
  },
  EventCardBody: {
    padding: 16,
  },
  EventCardTitle: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 17,
    color: Colors.ivory,
    marginBottom: 8,
  },
  EventCardMeta: {
    fontSize: 12.5,
    color: Colors.textFainter,
    marginBottom: 10,
  },
  EventCardDescription: {
    fontSize: 13,
    lineHeight: 19.5,
    color: Colors.ivoryMuted,
    marginBottom: 10,
  },
  EventCardPlaces: {
    fontSize: 12,
    color: Colors.goldLight,
    marginBottom: 14,
  },
  EventCardActions: {
    flexDirection: 'row',
    gap: 10,
  },
  EventCardDetailsBtn: {
    flex: 1,
    height: 39.5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.goldSoftBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  EventCardDetailsBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.goldLight,
  },
  EventCardRequestBtnWrapper: {
    flex: 1,
  },
  EventCardRequestBtn: {
    height: 39.5,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  EventCardRequestBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.buttonText,
  },
});
