import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAuth } from '../../hooks/useAuth';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants';
import { Business } from '../../types';
import { mockBusinessService } from '../../services/mockBusinessService';

export const BusinessSettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, logout, isLoading: authLoading } = useAuth();
  const [myBusiness, setMyBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMyBusiness();
  }, [user]);

  const loadMyBusiness = async () => {
    try {
      setIsLoading(true);
      // Find business owned by current user
      const businesses = await mockBusinessService.getBusinesses({ limit: 100 });
      const userBusiness = businesses.data.find(b => b.ownerId === user?.id);
      setMyBusiness(userBusiness || null);
    } catch (error) {
      console.error('Error loading business:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  const handleEditProfile = () => {
    // @ts-ignore
    navigation.navigate('EditOwnerProfile');
  };

  const handleEditBusiness = () => {
    if (myBusiness) {
      // @ts-ignore
      navigation.navigate('EditBusiness', { businessId: myBusiness.id });
    } else {
      // @ts-ignore
      navigation.navigate('CreateBusiness');
    }
  };

  const handleAddMarker = () => {
    if (myBusiness) {
      Alert.alert(
        'Add Business Marker',
        'Navigate to map to add your business location marker?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Add Marker',
            onPress: () => {
              // @ts-ignore
              navigation.navigate('AddBusinessMarker', { businessId: myBusiness.id });
            },
          },
        ]
      );
    } else {
      Alert.alert('No Business', 'Please create a business first before adding a marker.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Owner Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </Text>
        </View>
        
        <Text style={styles.name}>
          {user?.firstName} {user?.lastName}
        </Text>
        
        <Text style={styles.email}>{user?.email}</Text>
        
        <View style={styles.roleContainer}>
          <Text style={styles.roleLabel}>Role:</Text>
          <Text style={styles.roleValue}>Business Owner</Text>
        </View>

        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={handleEditProfile}
          activeOpacity={0.7}
        >
          <Text style={styles.editProfileButtonText}>✏️ Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Business Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Business</Text>
        
        {myBusiness ? (
          <View style={styles.businessCard}>
            <View style={styles.businessHeader}>
              <Text style={styles.businessName}>{myBusiness.name}</Text>
              <View style={[styles.statusBadge, myBusiness.isActive && styles.statusBadgeActive]}>
                <Text style={styles.statusText}>
                  {myBusiness.isActive ? '✓ Active' : '✗ Inactive'}
                </Text>
              </View>
            </View>
            
            <Text style={styles.businessDescription} numberOfLines={2}>
              {myBusiness.description}
            </Text>
            
            <View style={styles.businessStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>⭐ {myBusiness.rating.toFixed(1)}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{myBusiness.reviewCount}</Text>
                <Text style={styles.statLabel}>Reviews</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{myBusiness.priceRange}</Text>
                <Text style={styles.statLabel}>Price</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.editBusinessButton}
              onPress={handleEditBusiness}
              activeOpacity={0.7}
            >
              <Text style={styles.editBusinessButtonText}>✏️ Edit Business Info</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.addMarkerButton}
              onPress={handleAddMarker}
              activeOpacity={0.7}
            >
              <Text style={styles.addMarkerButtonText}>📍 Add Business Marker</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.noBusinessCard}>
            <Text style={styles.noBusinessIcon}>🏪</Text>
            <Text style={styles.noBusinessText}>No business created yet</Text>
            <TouchableOpacity
              style={styles.createBusinessButton}
              onPress={handleEditBusiness}
              activeOpacity={0.7}
            >
              <Text style={styles.createBusinessButtonText}>➕ Create Business</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Settings Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
          <Text style={styles.settingIcon}>🔔</Text>
          <Text style={styles.settingText}>Notifications</Text>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
          <Text style={styles.settingIcon}>🔒</Text>
          <Text style={styles.settingText}>Privacy & Security</Text>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
          <Text style={styles.settingIcon}>❓</Text>
          <Text style={styles.settingText}>Help & Support</Text>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.logoutButton, authLoading && styles.logoutButtonDisabled]}
          onPress={handleLogout}
          disabled={authLoading}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutButtonText}>
            {authLoading ? 'Logging out...' : '🚪 Logout'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer} />
    </ScrollView>
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
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text.onPrimary,
  },
  name: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  email: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    marginBottom: SPACING.md,
  },
  roleLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.onSecondary,
    marginRight: SPACING.xs,
  },
  roleValue: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    color: COLORS.text.onSecondary,
  },
  editProfileButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    marginTop: SPACING.sm,
  },
  editProfileButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.text.onPrimary,
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
  businessCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: 12,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  businessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  businessName: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
    backgroundColor: COLORS.text.disabled,
  },
  statusBadgeActive: {
    backgroundColor: COLORS.success,
  },
  statusText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
    color: COLORS.surface,
  },
  businessDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  businessStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.divider,
    marginBottom: SPACING.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.text.secondary,
  },
  editBusinessButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  editBusinessButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.text.onPrimary,
  },
  addMarkerButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    alignItems: 'center',
  },
  addMarkerButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.text.onSecondary,
  },
  noBusinessCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  noBusinessIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  noBusinessText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
    marginBottom: SPACING.md,
  },
  createBusinessButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  createBusinessButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.text.onPrimary,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    elevation: 1,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  settingText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.primary,
  },
  settingArrow: {
    fontSize: 18,
    color: COLORS.text.secondary,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logoutButtonDisabled: {
    backgroundColor: COLORS.text.disabled,
  },
  logoutButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.surface,
  },
  footer: {
    height: SPACING.xl,
  },
});
