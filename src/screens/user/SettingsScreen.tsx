// User Settings and Preferences Screen

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants';

export const SettingsScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => dispatch(logout()),
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Implement account deletion
            Alert.alert('Account Deletion', 'This feature will be implemented soon');
          },
        },
      ]
    );
  };

  const renderSection = (title: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const renderSettingRow = (
    label: string,
    value: boolean,
    onValueChange: (value: boolean) => void,
    description?: string
  ) => (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingLabel}>{label}</Text>
        {description && (
          <Text style={styles.settingDescription}>{description}</Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: COLORS.divider, true: COLORS.primaryLight }}
        thumbColor={value ? COLORS.primary : COLORS.text.disabled}
      />
    </View>
  );

  const renderActionRow = (
    label: string,
    onPress: () => void,
    icon?: string,
    color?: string
  ) => (
    <TouchableOpacity
      style={styles.actionRow}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon && <Text style={styles.actionIcon}>{icon}</Text>}
      <Text style={[styles.actionLabel, color && { color }]}>{label}</Text>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* User Info */}
      <View style={styles.userSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </Text>
        </View>
        <Text style={styles.userName}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      {/* Preferences */}
      {renderSection('Preferences')}
      {renderSettingRow(
        'Dark Mode',
        darkModeEnabled,
        setDarkModeEnabled,
        'Use dark theme throughout the app'
      )}
      {renderSettingRow(
        'Location Services',
        locationEnabled,
        setLocationEnabled,
        'Allow app to access your location'
      )}

      {/* Notifications */}
      {renderSection('Notifications')}
      {renderSettingRow(
        'All Notifications',
        notificationsEnabled,
        setNotificationsEnabled,
        'Enable or disable all notifications'
      )}
      {renderSettingRow(
        'Push Notifications',
        pushNotifications,
        setPushNotifications,
        'Receive push notifications on your device'
      )}
      {renderSettingRow(
        'Email Notifications',
        emailNotifications,
        setEmailNotifications,
        'Receive notifications via email'
      )}

      {/* Account Actions */}
      {renderSection('Account')}
      {renderActionRow('Edit Profile', () => Alert.alert('Edit Profile', 'Coming soon'), '👤')}
      {renderActionRow('Privacy Policy', () => Alert.alert('Privacy Policy', 'Coming soon'), '🔒')}
      {renderActionRow('Terms of Service', () => Alert.alert('Terms of Service', 'Coming soon'), '📄')}
      {renderActionRow('Help & Support', () => Alert.alert('Help & Support', 'Coming soon'), '❓')}
      {renderActionRow('About', () => Alert.alert('About', 'Foodventurer v1.0.0'), 'ℹ️')}

      {/* Danger Zone */}
      {renderSection('Danger Zone')}
      {renderActionRow('Logout', handleLogout, '🚪', COLORS.error)}
      {renderActionRow('Delete Account', handleDeleteAccount, '⚠️', COLORS.error)}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
        <Text style={styles.footerText}>© 2025 Foodventurer</Text>
        <Text style={styles.footerSignature}>-Code Blooded</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  userSection: {
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  userName: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  userEmail: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
  },
  sectionHeader: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    color: COLORS.text.secondary,
    textTransform: 'uppercase',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  settingLabel: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  settingDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
  },
  actionLabel: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.primary,
  },
  chevron: {
    fontSize: 24,
    color: COLORS.text.secondary,
  },
  footer: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  footerText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  footerSignature: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: SPACING.sm,
  },
});
