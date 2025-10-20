// Business Dashboard Screen with Analytics and Quick Actions

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../../store';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants';
import { Business } from '../../types';
import { mockBusinessService } from '../../services/mockBusinessService';

const { width } = Dimensions.get('window');

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, color }) => (
  <View style={[styles.statCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
    <View style={styles.statHeader}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
    <Text style={styles.statValue}>{value}</Text>
    {change && (
      <Text style={[styles.statChange, { color: change.startsWith('+') ? COLORS.success : COLORS.error }]}>
        {change}
      </Text>
    )}
  </View>
);

interface QuickActionProps {
  title: string;
  icon: string;
  onPress: () => void;
  color: string;
}

const QuickAction: React.FC<QuickActionProps> = ({ title, icon, onPress, color }) => (
  <TouchableOpacity
    style={[styles.quickAction, { backgroundColor: color }]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={styles.quickActionIcon}>{icon}</Text>
    <Text style={styles.quickActionTitle}>{title}</Text>
  </TouchableOpacity>
);

export const BusinessDashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [myBusiness, setMyBusiness] = useState<Business | null>(null);
  const [isLoadingBusiness, setIsLoadingBusiness] = useState(true);

  useEffect(() => {
    loadMyBusiness();
  }, [user]);

  const loadMyBusiness = async () => {
    try {
      setIsLoadingBusiness(true);
      // Find business owned by current user
      const businesses = await mockBusinessService.getBusinesses({ limit: 100 });
      const userBusiness = businesses.data.find(b => b.ownerId === user?.id);
      setMyBusiness(userBusiness || null);
    } catch (error) {
      console.error('Error loading business:', error);
    } finally {
      setIsLoadingBusiness(false);
    }
  };

  // Mock data - replace with real data from API
  const stats = {
    today: {
      views: 234,
      clicks: 45,
      calls: 12,
      reviews: 3,
    },
    week: {
      views: 1543,
      clicks: 287,
      calls: 76,
      reviews: 18,
    },
    month: {
      views: 6234,
      clicks: 1123,
      calls: 298,
      reviews: 67,
    },
  };

  const currentStats = stats[selectedPeriod];

  const recentReviews = [
    { id: '1', user: 'John Doe', rating: 5, comment: 'Amazing food and service!', time: '2 hours ago' },
    { id: '2', user: 'Jane Smith', rating: 4, comment: 'Great atmosphere', time: '5 hours ago' },
    { id: '3', user: 'Mike Johnson', rating: 5, comment: 'Best restaurant in town', time: '1 day ago' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.businessName}>
            {isLoadingBusiness ? 'Loading...' : myBusiness ? myBusiness.name : `${user?.firstName}'s Dashboard`}
          </Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Text style={styles.notificationIcon}>🔔</Text>
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        <TouchableOpacity
          style={[styles.periodButton, selectedPeriod === 'today' && styles.periodButtonActive]}
          onPress={() => setSelectedPeriod('today')}
        >
          <Text style={[styles.periodButtonText, selectedPeriod === 'today' && styles.periodButtonTextActive]}>
            Today
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.periodButton, selectedPeriod === 'week' && styles.periodButtonActive]}
          onPress={() => setSelectedPeriod('week')}
        >
          <Text style={[styles.periodButtonText, selectedPeriod === 'week' && styles.periodButtonTextActive]}>
            This Week
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.periodButton, selectedPeriod === 'month' && styles.periodButtonActive]}
          onPress={() => setSelectedPeriod('month')}
        >
          <Text style={[styles.periodButtonText, selectedPeriod === 'month' && styles.periodButtonTextActive]}>
            This Month
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Profile Views"
          value={currentStats.views}
          change="+12%"
          icon="👁️"
          color={COLORS.primary}
        />
        <StatCard
          title="Clicks"
          value={currentStats.clicks}
          change="+8%"
          icon="👆"
          color={COLORS.info}
        />
        <StatCard
          title="Phone Calls"
          value={currentStats.calls}
          change="+15%"
          icon="📞"
          color={COLORS.success}
        />
        <StatCard
          title="New Reviews"
          value={currentStats.reviews}
          change="+5%"
          icon="⭐"
          color={COLORS.warning}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <QuickAction
            title={myBusiness ? "Edit Info" : "Create Business"}
            icon="✏️"
            onPress={() => {
              if (myBusiness) {
                // @ts-ignore
                navigation.navigate('EditBusiness', { businessId: myBusiness.id });
              } else {
                // @ts-ignore
                navigation.navigate('CreateBusiness');
              }
            }}
            color={COLORS.primary}
          />
          <QuickAction
            title="Add Marker"
            icon="📍"
            onPress={() => {
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
            }}
            color={COLORS.secondary}
          />
          <QuickAction
            title="Menu"
            icon="🍽️"
            onPress={() => navigation.navigate('Menu' as never)}
            color={COLORS.info}
          />
          <QuickAction
            title="Analytics"
            icon="📊"
            onPress={() => navigation.navigate('Analytics' as never)}
            color={COLORS.warning}
          />
        </View>
      </View>

      {/* Recent Reviews */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Reviews</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ReviewManagement' as never)}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        {recentReviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View>
                <Text style={styles.reviewUser}>{review.user}</Text>
                <Text style={styles.reviewTime}>{review.time}</Text>
              </View>
              <View style={styles.reviewRating}>
                <Text style={styles.reviewRatingText}>{'⭐'.repeat(review.rating)}</Text>
              </View>
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
          </View>
        ))}
      </View>

      {/* Performance Insights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance Insights</Text>
        <View style={styles.insightCard}>
          <Text style={styles.insightIcon}>📈</Text>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Great Progress!</Text>
            <Text style={styles.insightText}>
              Your profile views increased by 25% this week. Keep up the good work!
            </Text>
          </View>
        </View>
        <View style={styles.insightCard}>
          <Text style={styles.insightIcon}>💡</Text>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Tip</Text>
            <Text style={styles.insightText}>
              Add more photos to attract more customers. Restaurants with 10+ photos get 50% more views.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>-Code Blooded</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  greeting: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
  },
  businessName: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginTop: SPACING.xs,
  },
  notificationButton: {
    position: 'relative',
  },
  notificationIcon: {
    fontSize: 28,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: COLORS.surface,
    fontSize: 10,
    fontWeight: 'bold',
  },
  periodSelector: {
    flexDirection: 'row',
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  periodButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  periodButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: COLORS.surface,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SPACING.sm,
    gap: SPACING.sm,
  },
  statCard: {
    width: (width - SPACING.md * 3) / 2,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  statIcon: {
    fontSize: 20,
    marginRight: SPACING.xs,
  },
  statTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
  },
  statValue: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  statChange: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  section: {
    padding: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  seeAllText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  quickAction: {
    width: (width - SPACING.md * 3) / 2,
    aspectRatio: 1.5,
    borderRadius: 12,
    padding: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  quickActionTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.surface,
  },
  reviewCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  reviewUser: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  reviewTime: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewRatingText: {
    fontSize: 14,
  },
  reviewComment: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.primary,
    lineHeight: 20,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  insightIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  insightText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  footerText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
