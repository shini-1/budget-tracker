// Role Selection Screen Component

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants';

type SelectedRole = 'user' | 'business_owner' | 'admin' | null;

export const RoleSelectionScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedRole, setSelectedRole] = useState<SelectedRole>(null);
  const [showModal, setShowModal] = useState(false);

  const handleRoleSelect = (role: 'user' | 'business_owner' | 'admin') => {
    setSelectedRole(role);
    setShowModal(true);
  };

  const handleActionSelect = (action: 'login' | 'signup') => {
    if (!selectedRole) return;

    setShowModal(false);

    if (action === 'login') {
      // @ts-ignore
      navigation.navigate('Login');
    } else {
      switch (selectedRole) {
        case 'user':
          // @ts-ignore
          navigation.navigate('Register');
          break;
        case 'business_owner':
          // @ts-ignore
          navigation.navigate('BusinessSignup');
          break;
        case 'admin':
          // @ts-ignore
          navigation.navigate('AdminSignup');
          break;
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRole(null);
  };

  const getRoleTitle = (role: SelectedRole) => {
    switch (role) {
      case 'user': return 'Food Explorer';
      case 'business_owner': return 'Business Owner';
      case 'admin': return 'Administrator';
      default: return '';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>🍽️ Foodventurer</Text>
        <Text style={styles.subtitle}>Choose your role and get started</Text>
      </View>

      <View style={styles.roleContainer}>
        {/* User Role */}
        <TouchableOpacity
          style={[styles.roleCard, styles.userCard]}
          onPress={() => handleRoleSelect('user')}
        >
          <View style={styles.roleIcon}>
            <Text style={styles.roleIconText}>👤</Text>
          </View>
          <View style={styles.roleContent}>
            <Text style={styles.roleTitle}>Food Explorer</Text>
            <Text style={styles.roleDescription}>
              Discover restaurants, read reviews, and find your next favorite dining spot
            </Text>
            <View style={styles.features}>
              <Text style={styles.feature}>• Browse restaurants</Text>
              <Text style={styles.feature}>• Read reviews</Text>
              <Text style={styles.feature}>• Save favorites</Text>
            </View>
          </View>
          <View style={styles.tapIndicator}>
            <Text style={styles.tapText}>TAP TO SELECT</Text>
          </View>
        </TouchableOpacity>

        {/* Business Owner Role */}
        <TouchableOpacity
          style={[styles.roleCard, styles.businessCard]}
          onPress={() => handleRoleSelect('business_owner')}
        >
          <View style={styles.roleIcon}>
            <Text style={styles.roleIconText}>🏪</Text>
          </View>
          <View style={styles.roleContent}>
            <Text style={styles.roleTitle}>Business Owner</Text>
            <Text style={styles.roleDescription}>
              Add your restaurant to the platform and manage your business profile
            </Text>
            <View style={styles.features}>
              <Text style={styles.feature}>• Add restaurant location</Text>
              <Text style={styles.feature}>• Manage menu & hours</Text>
              <Text style={styles.feature}>• View analytics</Text>
            </View>
          </View>
          <View style={styles.tapIndicator}>
            <Text style={styles.tapText}>TAP TO SELECT</Text>
          </View>
        </TouchableOpacity>

        {/* Admin Role */}
        <TouchableOpacity
          style={[styles.roleCard, styles.adminCard]}
          onPress={() => handleRoleSelect('admin')}
        >
          <View style={styles.roleIcon}>
            <Text style={styles.roleIconText}>👑</Text>
          </View>
          <View style={styles.roleContent}>
            <Text style={styles.roleTitle}>Administrator</Text>
            <Text style={styles.roleDescription}>
              Manage the platform, oversee users, and maintain system integrity
            </Text>
            <View style={styles.features}>
              <Text style={styles.feature}>• User management</Text>
              <Text style={styles.feature}>• System analytics</Text>
              <Text style={styles.feature}>• Platform oversight</Text>
            </View>
          </View>
          <View style={styles.tapIndicator}>
            <Text style={styles.tapText}>TAP TO SELECT</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Action Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {getRoleTitle(selectedRole)}
            </Text>
            <Text style={styles.modalSubtitle}>
              How would you like to proceed?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.loginModalButton]}
                onPress={() => handleActionSelect('login')}
              >
                <Text style={styles.loginModalText}>Login</Text>
                <Text style={styles.modalButtonSubtext}>Sign in to existing account</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.signupModalButton]}
                onPress={() => handleActionSelect('signup')}
              >
                <Text style={styles.signupModalText}>Sign Up</Text>
                <Text style={styles.modalButtonSubtext}>Create new account</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeModal}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
    marginTop: SPACING.xl,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  roleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.divider,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userCard: {
    borderColor: COLORS.info,
  },
  businessCard: {
    borderColor: COLORS.success,
  },
  adminCard: {
    borderColor: COLORS.primary,
  },
  roleIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  roleIconText: {
    fontSize: 24,
  },
  roleContent: {
    flex: 1,
  },
  roleTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  roleDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
    lineHeight: TYPOGRAPHY.lineHeight.sm,
  },
  features: {
    marginTop: SPACING.xs,
  },
  feature: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginBottom: 2,
  },
  actionButtons: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  actionButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: COLORS.secondary,
  },
  signupButton: {
    backgroundColor: COLORS.primary,
  },
  loginButtonText: {
    color: COLORS.surface,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  signupButtonText: {
    color: COLORS.surface,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  footerText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
  },
  backButton: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  backButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
  tapIndicator: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  tapText: {
    color: COLORS.surface,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.xl,
    margin: SPACING.lg,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  modalSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  modalButtons: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  modalButton: {
    padding: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.divider,
  },
  loginModalButton: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  signupModalButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  loginModalText: {
    color: COLORS.surface,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
  },
  signupModalText: {
    color: COLORS.surface,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
  },
  modalButtonSubtext: {
    color: COLORS.surface,
    fontSize: TYPOGRAPHY.fontSize.sm,
    opacity: 0.9,
    marginTop: SPACING.xs,
  },
  closeButton: {
    alignItems: 'center',
    padding: SPACING.md,
  },
  closeButtonText: {
    color: COLORS.text.secondary,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
  },
});
