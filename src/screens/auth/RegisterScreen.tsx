// Register Screen Component

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import { RegisterForm, UserRole } from '../../types';
import { COLORS, TYPOGRAPHY, SPACING, VALIDATION, USER_ROLES } from '../../constants';

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation();
  const { register, isLoading, error, clearAuthError } = useAuth();
  const [formData, setFormData] = useState<RegisterForm>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    role: 'user',
  });

  const [showRoleSelection, setShowRoleSelection] = useState(false);

  const handleInputChange = (field: keyof RegisterForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) clearAuthError();
  };

  const handleRoleSelection = (role: UserRole) => {
    setFormData(prev => ({ ...prev, role }));
    setShowRoleSelection(false);
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      Alert.alert('Error', 'Please enter your first name');
      return false;
    }

    if (!formData.lastName.trim()) {
      Alert.alert('Error', 'Please enter your last name');
      return false;
    }

    if (!VALIDATION.email.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    const passwordValidation = VALIDATION.validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      Alert.alert('Error', passwordValidation.errors[0]);
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (formData.phoneNumber && !VALIDATION.phone.test(formData.phoneNumber)) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      await register(formData);
    } catch (err) {
      Alert.alert('Registration Failed', 'Please try again');
    }
  };

  const getRoleLabel = (role: UserRole): string => {
    switch (role) {
      case 'user':
        return 'Food Explorer';
      case 'business_owner':
        return 'Restaurant Owner';
      case 'admin':
        return 'Administrator';
      default:
        return 'Food Explorer';
    }
  };

  const getRoleDescription = (role: UserRole): string => {
    switch (role) {
      case 'user':
        return 'Discover and review restaurants';
      case 'business_owner':
        return 'Manage your restaurant listing';
      case 'admin':
        return 'Manage the entire platform';
      default:
        return 'Discover and review restaurants';
    }
  };

  if (showRoleSelection) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Choose Your Role</Text>
            <Text style={styles.subtitle}>How will you use Foodventurer?</Text>
          </View>

          <View style={styles.roleContainer}>
            {Object.entries(USER_ROLES).map(([key, role]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.roleCard,
                  formData.role === role && styles.roleCardSelected,
                ]}
                onPress={() => handleRoleSelection(role as UserRole)}
              >
                <Text style={[
                  styles.roleTitle,
                  formData.role === role && styles.roleTitleSelected,
                ]}>
                  {getRoleLabel(role as UserRole)}
                </Text>
                <Text style={[
                  styles.roleDescription,
                  formData.role === role && styles.roleDescriptionSelected,
                ]}>
                  {getRoleDescription(role as UserRole)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setShowRoleSelection(false)}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => setShowRoleSelection(false)}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Join Foodventurer</Text>
          <Text style={styles.subtitle}>Create your account to get started</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.nameRow}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                placeholder="First name"
                value={formData.firstName}
                onChangeText={(value) => handleInputChange('firstName', value)}
                autoCapitalize="words"
              />
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Last name"
                value={formData.lastName}
                onChangeText={(value) => handleInputChange('lastName', value)}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              value={formData.phoneNumber}
              onChangeText={(value) => handleInputChange('phoneNumber', value)}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Create a password"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={styles.roleButton}
            onPress={() => setShowRoleSelection(true)}
          >
            <Text style={styles.roleButtonText}>
              Role: {getRoleLabel(formData.role)}
            </Text>
            <Text style={styles.roleButtonSubtext}>Tap to change</Text>
          </TouchableOpacity>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.registerButtonText}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    marginTop: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
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
  form: {
    marginBottom: SPACING.xl,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.md,
    backgroundColor: COLORS.surface,
    color: COLORS.text.primary,
  },
  roleButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.surface,
  },
  roleButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.primary,
  },
  roleButtonSubtext: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  roleContainer: {
    marginBottom: SPACING.xl,
  },
  roleCard: {
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  roleCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight + '20',
  },
  roleTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  roleTitleSelected: {
    color: COLORS.primary,
  },
  roleDescription: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
  },
  roleDescriptionSelected: {
    color: COLORS.primaryDark,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
  },
  backButton: {
    flex: 1,
    marginRight: SPACING.sm,
    padding: SPACING.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.divider,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
  },
  continueButton: {
    flex: 1,
    marginLeft: SPACING.sm,
    padding: SPACING.md,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.surface,
    fontWeight: '600',
  },
  errorContainer: {
    marginBottom: SPACING.md,
  },
  errorText: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.fontSize.sm,
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  registerButtonDisabled: {
    backgroundColor: COLORS.text.disabled,
  },
  registerButtonText: {
    color: COLORS.surface,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
  },
  signInText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
