import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants';

export const UserProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, logout, isLoading } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => logout()
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
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
          <Text style={styles.roleValue}>
            {user?.role === 'user' ? 'Food Explorer' : 
             user?.role === 'business_owner' ? 'Restaurant Owner' : 
             'Administrator'}
          </Text>
        </View>
      </View>

      {/* Business Owner Dashboard Button - Only show for business owners */}
      {user?.role === 'business_owner' && (
        <TouchableOpacity
          style={styles.dashboardButton}
          onPress={() => {
            // @ts-ignore
            navigation.navigate('BusinessOwnerDashboard');
          }}
        >
          <Text style={styles.dashboardButtonIcon}>🏪</Text>
          <Text style={styles.dashboardButtonText}>Business Dashboard</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.logoutButton, isLoading && styles.logoutButtonDisabled]}
        onPress={handleLogout}
        disabled={isLoading}
      >
        <Text style={styles.logoutButtonText}>
          {isLoading ? 'Logging out...' : 'Logout'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
    justifyContent: 'center',
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.xl,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatarText: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  name: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  email: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
    marginBottom: SPACING.lg,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleLabel: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
    marginRight: SPACING.sm,
  },
  roleValue: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.primary,
  },
  dashboardButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dashboardButtonIcon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  dashboardButtonText: {
    color: COLORS.text.onPrimary,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    borderRadius: 8,
    padding: SPACING.md,
    alignItems: 'center',
  },
  logoutButtonDisabled: {
    backgroundColor: COLORS.text.disabled,
  },
  logoutButtonText: {
    color: COLORS.surface,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '600',
  },
});
