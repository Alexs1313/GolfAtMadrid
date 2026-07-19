import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { FadeInItem } from '../../components/FadeInItem';
import { ScreenHeader } from '../../components/ScreenHeader';
import { useRequestsState } from '../../navigation/RequestsContext';
import { Colors } from '../../theme/colors';

import type { ServiceCategory } from '../../types';
import {
  ParkingSubTabs,
  ServiceCategoryTabs,
  type ParkingSegment,
} from './ServicesTabs';

export function MyParkingScreen({
  notificationCount,
  onPressBell,
  category,
  onSelectCategory,
  parkingSegment,
  onSelectParkingSegment,
}: {
  notificationCount: number;
  onPressBell: () => void;
  category: ServiceCategory;
  onSelectCategory: (category: ServiceCategory) => void;
  parkingSegment: ParkingSegment;
  onSelectParkingSegment: (segment: ParkingSegment) => void;
}) {
  const { parkingReservations } = useRequestsState();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.MyParkingScreenScroll}
    >
      <ScreenHeader
        title="Services"
        subtitle="Reservations & requests"
        notificationCount={notificationCount}
        onPressBell={onPressBell}
      />

      <View style={styles.MyParkingScreenBody}>
        <ServiceCategoryTabs category={category} onSelect={onSelectCategory} />
        <ParkingSubTabs
          parkingSegment={parkingSegment}
          onSelect={onSelectParkingSegment}
        />

        <Text style={styles.MyParkingScreenLabel}>Current & Upcoming</Text>

        {parkingReservations.length === 0 ? (
          <Text style={styles.MyParkingScreenEmptyText}>
            No parking reservations yet. Confirm a space on the Parking Map to
            see it here.
          </Text>
        ) : (
          parkingReservations.map((reservation, i) => (
            <FadeInItem
              key={reservation.id}
              index={i}
              style={styles.MyParkingScreenRow}
            >
              <View>
                <Text style={styles.MyParkingScreenTitle}>
                  Space {reservation.spaceId} · {reservation.zone}
                </Text>
                <Text style={styles.MyParkingScreenSubtitle}>
                  {reservation.dateLabel} · {reservation.timeLabel}
                </Text>
              </View>
              <View style={styles.MyParkingScreenBadge}>
                <Text style={styles.MyParkingScreenBadgeText}>
                  {reservation.status}
                </Text>
              </View>
            </FadeInItem>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  MyParkingScreenScroll: {
    paddingBottom: 24,
  },
  MyParkingScreenBody: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  MyParkingScreenLabel: {
    fontSize: 12,
    color: Colors.textFaint,
    marginBottom: 10,
  },

  MyParkingScreenEmptyText: {
    fontSize: 12.5,
    color: Colors.textFainter,
    textAlign: 'center',
    paddingVertical: 40,
  },

  MyParkingScreenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  MyParkingScreenTitle: {
    fontSize: 13.5,
    fontWeight: '600',
    color: Colors.ivory,
    marginBottom: 4,
  },
  MyParkingScreenSubtitle: {
    fontSize: 11.5,
    color: Colors.textFaint,
  },
  MyParkingScreenBadge: {
    backgroundColor: '#2c3a4a',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },

  MyParkingScreenBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: Colors.goldLight,
    letterSpacing: 0.3,
  },
});
