import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Colors } from '../../theme/colors';

import type { ServiceCategory } from '../../types';

export const CATEGORIES: { key: ServiceCategory; label: string }[] = [
  { key: 'golfClub', label: 'Golf Club' },
  { key: 'parking', label: 'Parking' },
];

export function ServiceCategoryTabs({
  category,
  onSelect,
}: {
  category: ServiceCategory;
  onSelect: (category: ServiceCategory) => void;
}) {
  return (
    <View style={styles.ServiceCategoryTabsControl}>
      {CATEGORIES.map(cat => {
        const isActive = cat.key === category;
        return (
          <TouchableOpacity
            key={cat.key}
            style={styles.ServiceCategoryTabsButton}
            onPress={() => onSelect(cat.key)}
          >
            {isActive ? (
              <LinearGradient
                colors={[Colors.goldLight, Colors.gold]}
                style={styles.ServiceCategoryTabsFill}
              >
                <Text style={styles.ServiceCategoryTabsTextActive}>
                  {cat.label}
                </Text>
              </LinearGradient>
            ) : (
              <Text style={styles.ServiceCategoryTabsText}>{cat.label}</Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export type ParkingSegment = 'map' | 'my';

export function ParkingSubTabs({
  parkingSegment,
  onSelect,
}: {
  parkingSegment: ParkingSegment;
  onSelect: (segment: ParkingSegment) => void;
}) {
  return (
    <View style={styles.ParkingSubTabsControl}>
      <TouchableOpacity
        style={[
          styles.ParkingSubTabsButton,
          parkingSegment === 'map' && styles.ParkingSubTabsButtonActive,
        ]}
        onPress={() => onSelect('map')}
      >
        <Text
          style={[
            styles.ParkingSubTabsText,
            parkingSegment === 'map' && styles.ParkingSubTabsTextActive,
          ]}
        >
          Parking Map
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.ParkingSubTabsButton,
          parkingSegment === 'my' && styles.ParkingSubTabsButtonActive,
        ]}
        onPress={() => onSelect('my')}
      >
        <Text
          style={[
            styles.ParkingSubTabsText,
            parkingSegment === 'my' && styles.ParkingSubTabsTextActive,
          ]}
        >
          My Parking
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  ServiceCategoryTabsControl: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: 14,
    padding: 4,
    gap: 4,
    marginBottom: 16,
  },
  ServiceCategoryTabsButton: {
    flex: 1,
  },
  ServiceCategoryTabsFill: {
    height: 34.5,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ServiceCategoryTabsText: {
    height: 34.5,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.ivoryMuted,
    textAlign: 'center',
    lineHeight: 34.5,
  },
  ServiceCategoryTabsTextActive: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.buttonText,
  },

  ParkingSubTabsControl: {
    flexDirection: 'row',
    backgroundColor: '#1b1f27',
    borderRadius: 10,
    padding: 3,
    marginBottom: 16,
  },
  ParkingSubTabsButton: {
    flex: 1,
    height: 30.5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ParkingSubTabsButtonActive: {
    backgroundColor: Colors.surface,
  },
  ParkingSubTabsText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textFaint,
  },
  ParkingSubTabsTextActive: {
    color: Colors.goldLight,
  },
});
