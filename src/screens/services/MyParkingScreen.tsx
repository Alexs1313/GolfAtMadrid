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
      contentContainerStyle={styles.MyParkingScreenScrollWrap}
    >
      <ScreenHeader
        title="Services"
        subtitle="Reservations & requests"
        notificationCount={notificationCount}
        onPressBell={onPressBell}
      />

      <View style={styles.MyParkingScreenContent}>
        <ServiceCategoryTabs category={category} onSelect={onSelectCategory} />
        <ParkingSubTabs
          parkingSegment={parkingSegment}
          onSelect={onSelectParkingSegment}
        />

        <Text style={styles.MyParkingScreenCaption}>Current & Upcoming</Text>

        {parkingReservations.length === 0 ? (
          <Text style={styles.MyParkingScreenBlankMessage}>
            No parking reservations yet. Confirm a space on the Parking Map to
            see it here.
          </Text>
        ) : (
          parkingReservations.map((reservation, i) => (
            <FadeInItem
              key={reservation.id}
              index={i}
              style={styles.MyParkingScreenLine}
            >
              <View>
                <Text style={styles.MyParkingScreenHeading}>
                  Space {reservation.spaceId} · {reservation.zone}
                </Text>
                <Text style={styles.MyParkingScreenSubhead}>
                  {reservation.dateLabel} · {reservation.timeLabel}
                </Text>
              </View>
              <View style={styles.MyParkingScreenChip}>
                <Text style={styles.MyParkingScreenChipLabel}>
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
  MyParkingScreenScrollWrap: {
    paddingBottom: 24,
  },

  MyParkingScreenContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  MyParkingScreenCaption: {
    fontSize: 12,
    color: Colors.textFaint,
    marginBottom: 10,
  },

  MyParkingScreenBlankMessage: {
    fontSize: 12.5,
    color: Colors.textFainter,
    textAlign: 'center',
    paddingVertical: 40,
  },

  MyParkingScreenLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  MyParkingScreenHeading: {
    fontSize: 13.5,
    fontWeight: '600',
    color: Colors.ivory,
    marginBottom: 4,
  },
  MyParkingScreenSubhead: {
    fontSize: 11.5,
    color: Colors.textFaint,
  },
  MyParkingScreenChip: {
    backgroundColor: '#2c3a4a',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },

  MyParkingScreenChipLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: Colors.goldLight,
    letterSpacing: 0.3,
  },
});
