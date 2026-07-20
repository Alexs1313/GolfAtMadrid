import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { FadeInItem } from '../../components/FadeInItem';

import { ScreenHeader } from '../../components/ScreenHeader';
import { Fonts } from '../../constants/theme';

import { SERVICES } from '../../data/services';
import { useAppNavigation } from '../../navigation/NavigationContext';
import { useRequestsState } from '../../navigation/RequestsContext';
import { Colors } from '../../theme/colors';

import type { ServiceCategory, ServiceItem } from '../../types';
import { MyParkingScreen } from './MyParkingScreen';
import { ParkingMapScreen } from './ParkingMapScreen';
import { ServiceCategoryTabs, type ParkingSegment } from './ServicesTabs';

export function ServicesScreen() {
  const { openServiceRequest, openServiceDetail, openRequestCenter } =
    useAppNavigation();
  const { submittedRequests } = useRequestsState();
  const [category, setCategory] = useState<ServiceCategory>('golfClub');
  const [parkingSegment, setParkingSegment] = useState<ParkingSegment>('map');

  const activeRequestCount = submittedRequests.filter(
    r => r.status === 'active',
  ).length;
  const items = SERVICES.filter(service => service.category === category);

  return (
    <View style={styles.ServicesScreenShell}>
      {category === 'parking' ? (
        parkingSegment === 'map' ? (
          <ParkingMapScreen
            notificationCount={activeRequestCount}
            onPressBell={openRequestCenter}
            category={category}
            onSelectCategory={setCategory}
            parkingSegment={parkingSegment}
            onSelectParkingSegment={setParkingSegment}
          />
        ) : (
          <MyParkingScreen
            notificationCount={activeRequestCount}
            onPressBell={openRequestCenter}
            category={category}
            onSelectCategory={setCategory}
            parkingSegment={parkingSegment}
            onSelectParkingSegment={setParkingSegment}
          />
        )
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.ServicesScreenFeed}
        >
          <ScreenHeader
            title="Services"
            subtitle="Reservations & requests"
            notificationCount={activeRequestCount}
            onPressBell={openRequestCenter}
          />

          <View style={styles.ServicesScreenFeedArea}>
            <ServiceCategoryTabs category={category} onSelect={setCategory} />

            {items.map((service, i) => (
              <FadeInItem key={service.id} index={i}>
                <ServiceCard
                  service={service}
                  onDetails={() => openServiceDetail(service)}
                  onRequest={() => openServiceRequest(service)}
                />
              </FadeInItem>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function ServiceCard({
  service,
  onDetails,
  onRequest,
}: {
  service: ServiceItem;
  onDetails: () => void;
  onRequest: () => void;
}) {
  return (
    <View style={styles.ServiceCardShell}>
      <View style={styles.ServiceCardIconHolder}>
        <Text style={styles.ServiceCardGlyph}>{service.icon}</Text>
      </View>

      <View style={styles.ServiceCardContent}>
        <Text style={styles.ServiceCardHeading}>{service.title}</Text>
        <Text style={styles.ServiceCardSummary}>{service.description}</Text>
        <Text style={styles.ServiceCardSchedule}>
          {service.availabilityLabel}
        </Text>

        <View style={styles.ServiceCardControls}>
          <TouchableOpacity
            style={styles.ServiceCardDetailsAction}
            onPress={onDetails}
          >
            <Text style={styles.ServiceCardDetailsActionLabel}>Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ServiceCardRequestActionWrapper}
            onPress={onRequest}
          >
            <LinearGradient
              colors={[Colors.goldLight, Colors.gold]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ServiceCardRequestAction}
            >
              <Text style={styles.ServiceCardRequestActionLabel}>Request</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ServicesScreenShell: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  ServicesScreenFeed: {
    paddingBottom: 24,
  },
  ServicesScreenFeedArea: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  ServiceCardShell: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  ServiceCardIconHolder: {
    width: 46,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(233,205,110,0.26)',
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ServiceCardGlyph: {
    fontSize: 21,
  },
  ServiceCardContent: {
    flex: 1,
  },
  ServiceCardHeading: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 14.5,
    color: Colors.ivory,
    marginBottom: 4,
  },
  ServiceCardSummary: {
    fontSize: 11.5,
    lineHeight: 16,
    color: Colors.textFainter,
    marginBottom: 8,
  },
  ServiceCardSchedule: {
    fontSize: 10.5,
    color: Colors.goldLight,
    marginBottom: 10,
  },
  ServiceCardControls: {
    flexDirection: 'row',
    gap: 8,
  },

  ServiceCardDetailsAction: {
    flex: 1,
    height: 34.5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.goldSoftBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ServiceCardDetailsActionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.goldLight,
  },
  ServiceCardRequestActionWrapper: {
    flex: 1,
  },
  ServiceCardRequestAction: {
    height: 34.5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ServiceCardRequestActionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.buttonText,
  },
});
