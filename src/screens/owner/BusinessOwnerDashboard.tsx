// Business Owner Dashboard Screen

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants';
import { Business } from '../../types';
import { seedFirestoreData } from '../../utils/seedFirestore';

export const BusinessOwnerDashboard: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);
  const [myBusiness, setMyBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMyBusiness();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMyBusiness = async () => {
    try {
      setIsLoading(true);
      // TODO: Fetch business owned by current user from Firestore
      // For now, simulate loading
      await new Promise<void>((resolve) => setTimeout(resolve, 1000));
      setMyBusiness(null); // Will be populated from Firestore
    } catch (error) {
      console.error('Error loading business:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBusiness = () => {
    // @ts-ignore
    navigation.navigate('CreateBusiness');
  };

  const handleEditBusiness = () => {
    if (myBusiness) {
      // @ts-ignore
      navigation.navigate('EditBusiness', { businessId: myBusiness.id });
    }
  };

  const handleEditProfile = () => {
    // @ts-ignore
    navigation.navigate('EditOwnerProfile');
  };

  const handleAddMarker = () => {
    if (myBusiness) {
      Alert.alert(
        'Rebuild Required',
        'The marker placement feature requires a full app rebuild to link the geolocation package.\n\nPlease run:\n1. Close the app\n2. Run: npx react-native run-android\n3. Try again',
        [{ text: 'OK' }]
      );
      // After rebuild, uncomment this:
      // navigation.navigate('AddBusinessMarker', { businessId: myBusiness.id });
    } else {
      Alert.alert('No Business', 'Please create a business first before adding a marker.');
    }
  };

  const handleViewAnalytics = () => {
    Alert.alert('Coming Soon', 'Analytics feature will be available soon!');
  };

  const handleSeedData = async () => {
    Alert.alert(
      'Seed Firestore Data',
      'This will create 3 sample businesses and markers in your Firestore database. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Seed Data',
          onPress: async () => {
            try {
              setIsLoading(true);
              const result = await seedFirestoreData();
              Alert.alert(
                'Success!',
                `Created ${result.businessesCreated} businesses and ${result.markersCreated} markers.\n\nCheck Firebase Console → Firestore Database`,
                [{ text: 'OK' }]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to seed data. Check console for details.');
              console.error('Seed error:', error);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading your business...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Business Dashboard</Text>
        <Text style={styles.headerSubtitle}>
          Welcome, {user?.firstName || user?.email || 'Business Owner'}!
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Business Status Card */}
        {myBusiness ? (
          <View style={styles.businessCard}>
            <View style={styles.businessHeader}>
              <Image
                source={{ uri: myBusiness.images?.[0] || 'https://via.placeholder.com/100' }}
                style={styles.businessImage}
              />
              <View style={styles.businessInfo}>
                <Text style={styles.businessName}>{myBusiness.name}</Text>
                <View style={styles.statusBadge}>
                  <View style={[styles.statusDot, myBusiness.isActive && styles.statusDotActive]} />
                  <Text style={styles.statusText}>
                    {myBusiness.isActive ? 'Active' : 'Inactive'}
                  </Text>
                </View>
                {myBusiness.isVerified && (
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedText}>✓ Verified</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>⭐ {myBusiness.rating?.toFixed(1) || 'N/A'}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{myBusiness.reviewCount || 0}</Text>
                <Text style={styles.statLabel}>Reviews</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{myBusiness.priceRange || '$$'}</Text>
                <Text style={styles.statLabel}>Price</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.noBusinessCard}>
            <Text style={styles.noBusinessIcon}>🏪</Text>
            <Text style={styles.noBusinessTitle}>No Business Yet</Text>
            <Text style={styles.noBusinessText}>
              Create your business page to start reaching customers!
            </Text>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          {!myBusiness ? (
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={handleCreateBusiness}
              activeOpacity={0.8}
            >
              <Text style={styles.actionIcon}>➕</Text>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Create Business Page</Text>
                <Text style={styles.actionDescription}>
                  Set up your restaurant profile and start attracting customers
                </Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleEditBusiness}
                activeOpacity={0.8}
              >
                <Text style={styles.actionIcon}>✏️</Text>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Edit Business Page</Text>
                  <Text style={styles.actionDescription}>
                    Update info, photos, hours, and menu
                  </Text>
                </View>
                <Text style={styles.actionArrow}>→</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleAddMarker}
                activeOpacity={0.8}
              >
                <Text style={styles.actionIcon}>📍</Text>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Add/Update Location Marker</Text>
                  <Text style={styles.actionDescription}>
                    Pin your exact location on the map for customers
                  </Text>
                </View>
                <Text style={styles.actionArrow}>→</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleViewAnalytics}
                activeOpacity={0.8}
              >
                <Text style={styles.actionIcon}>📊</Text>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>View Analytics</Text>
                  <Text style={styles.actionDescription}>
                    See views, clicks, and customer engagement
                  </Text>
                </View>
                <Text style={styles.actionArrow}>→</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleEditProfile}
            activeOpacity={0.8}
          >
            <Text style={styles.actionIcon}>👤</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Edit Owner Profile</Text>
              <Text style={styles.actionDescription}>
                Update your personal information and settings
              </Text>
            </View>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>

          {/* Seed Data Button - For Testing */}
          <TouchableOpacity
            style={[styles.actionButton, styles.seedButton]}
            onPress={handleSeedData}
            activeOpacity={0.8}
          >
            <Text style={styles.actionIcon}>🌱</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Seed Sample Data</Text>
              <Text style={styles.actionDescription}>
                Create 3 sample businesses with markers in Firestore
              </Text>
            </View>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Tips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Tips for Success</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              • Add high-quality photos of your food and restaurant
            </Text>
            <Text style={styles.tipText}>
              • Keep your business hours up to date
            </Text>
            <Text style={styles.tipText}>
              • Respond to customer reviews promptly
            </Text>
            <Text style={styles.tipText}>
              • Update your location marker for accurate directions
            </Text>
            <Text style={styles.tipText}>
              • Offer special promotions to attract new customers
            </Text>
          </View>
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: 'bold',
    color: COLORS.text.onPrimary,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.onPrimary,
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
  },
  businessCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: 16,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  businessHeader: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  businessImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceVariant,
  },
  businessInfo: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'center',
  },
  businessName: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.text.disabled,
    marginRight: SPACING.xs,
  },
  statusDotActive: {
    backgroundColor: COLORS.success,
  },
  statusText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
  },
  verifiedBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  verifiedText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: 'bold',
    color: COLORS.text.onSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
  },
  noBusinessCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    padding: SPACING.xl,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  noBusinessIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  noBusinessTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  noBusinessText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  section: {
    marginTop: SPACING.lg,
    marginHorizontal: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  seedButton: {
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
  },
  actionIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  actionDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
  },
  actionArrow: {
    fontSize: 20,
    color: COLORS.text.secondary,
  },
  tipCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  tipText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
    lineHeight: 20,
  },
  footer: {
    height: SPACING.xl,
  },
});
