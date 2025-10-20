// Menu Management Screen with CRUD operations

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants';
import { MenuItem } from '../../types';
import { firebaseMenuService } from '../../services/firebaseMenuService';
import { firebaseBusinessService } from '../../services/firebaseBusinessService';
import LinearGradient from 'react-native-linear-gradient';

export const MenuManagementScreen: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    category: 'Main Course',
    isAvailable: true,
  });

  const categories = ['Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Sides'];

  useEffect(() => {
    loadBusinessAndMenu();
  }, [user]);

  const loadBusinessAndMenu = async () => {
    try {
      setIsLoading(true);
      if (!user?.id) return;
      
      // Get user's business
      const businesses = await firebaseBusinessService.getUserBusinesses(user.id);
      if (businesses.length > 0) {
        const business = businesses[0];
        setBusinessId(business.id);
        
        // Load menu items
        const items = await firebaseMenuService.getMenuItems(business.id);
        setMenuItems(items);
      }
    } catch (error) {
      console.error('Error loading menu:', error);
      Alert.alert('Error', 'Failed to load menu items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!businessId) {
      Alert.alert('Error', 'No business found');
      return;
    }

    try {
      const menuItemData = {
        businessId,
        name: newItem.name!,
        description: newItem.description || '',
        price: newItem.price!,
        category: newItem.category || 'Main Course',
        images: [],
        isAvailable: true,
      };

      const createdItem = await firebaseMenuService.createMenuItem(businessId, menuItemData);
      setMenuItems([...menuItems, createdItem]);
      setShowAddModal(false);
      setNewItem({ name: '', description: '', price: 0, category: 'Main Course', isAvailable: true });
      Alert.alert('Success', 'Menu item added successfully!');
    } catch (error: any) {
      console.error('Error adding menu item:', error);
      Alert.alert('Error', error.message || 'Failed to add menu item');
    }
  };

  const handleEditItem = async () => {
    if (!editingItem) return;

    try {
      const updates = {
        name: editingItem.name,
        description: editingItem.description,
        price: editingItem.price,
        category: editingItem.category,
      };

      await firebaseMenuService.updateMenuItem(editingItem.id, updates);
      setMenuItems(menuItems.map(item => 
        item.id === editingItem.id ? editingItem : item
      ));
      setEditingItem(null);
      Alert.alert('Success', 'Menu item updated successfully!');
    } catch (error: any) {
      console.error('Error updating menu item:', error);
      Alert.alert('Error', error.message || 'Failed to update menu item');
    }
  };

  const handleDeleteItem = (id: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this menu item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await firebaseMenuService.deleteMenuItem(id);
              setMenuItems(menuItems.filter(item => item.id !== id));
              Alert.alert('Success', 'Menu item deleted successfully!');
            } catch (error: any) {
              console.error('Error deleting menu item:', error);
              Alert.alert('Error', error.message || 'Failed to delete menu item');
            }
          },
        },
      ]
    );
  };

  const toggleAvailability = async (id: string) => {
    try {
      const item = menuItems.find(i => i.id === id);
      if (!item) return;

      const newAvailability = !item.isAvailable;
      await firebaseMenuService.toggleAvailability(id, newAvailability);
      
      setMenuItems(menuItems.map(item =>
        item.id === id ? { ...item, isAvailable: newAvailability } : item
      ));
    } catch (error: any) {
      console.error('Error toggling availability:', error);
      Alert.alert('Error', error.message || 'Failed to update availability');
    }
  };

  const renderMenuItem = (item: MenuItem) => (
    <View key={item.id} style={styles.menuCard}>
      <View style={styles.menuCardHeader}>
        <View style={styles.menuCardInfo}>
          <Text style={styles.menuItemName}>{item.name}</Text>
          <Text style={styles.menuItemCategory}>{item.category}</Text>
        </View>
        <View style={styles.menuCardActions}>
          <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
          <TouchableOpacity
            style={[styles.availabilityBadge, !item.isAvailable && styles.unavailableBadge]}
            onPress={() => toggleAvailability(item.id)}
          >
            <Text style={styles.availabilityText}>
              {item.isAvailable ? '✓ Available' : '✗ Unavailable'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.menuItemDescription}>{item.description}</Text>
      
      <View style={styles.menuCardFooter}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setEditingItem(item)}
        >
          <Text style={styles.actionButtonText}>✏️ Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteItem(item.id)}
        >
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>🗑️ Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderModal = (isEdit: boolean) => {
    const item = isEdit ? editingItem : newItem;

    return (
      <Modal
        visible={isEdit ? !!editingItem : showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => isEdit ? setEditingItem(null) : setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{isEdit ? 'Edit Menu Item' : 'Add Menu Item'}</Text>
            
            <Text style={styles.label}>Item Name *</Text>
            <TextInput
              style={styles.input}
              value={item?.name}
              onChangeText={(text) => {
                if (isEdit && editingItem) {
                  setEditingItem({ ...editingItem, name: text });
                } else {
                  setNewItem({ ...newItem, name: text });
                }
              }}
              placeholder="Enter item name"
              placeholderTextColor={COLORS.text.hint}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={item?.description}
              onChangeText={(text) => {
                if (isEdit && editingItem) {
                  setEditingItem({ ...editingItem, description: text });
                } else {
                  setNewItem({ ...newItem, description: text });
                }
              }}
              placeholder="Enter description"
              placeholderTextColor={COLORS.text.hint}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.label}>Price *</Text>
            <TextInput
              style={styles.input}
              value={item?.price?.toString()}
              onChangeText={(text) => {
                const price = parseFloat(text) || 0;
                if (isEdit && editingItem) {
                  setEditingItem({ ...editingItem, price });
                } else {
                  setNewItem({ ...newItem, price });
                }
              }}
              placeholder="0.00"
              placeholderTextColor={COLORS.text.hint}
              keyboardType="decimal-pad"
            />

            <Text style={styles.label}>Category *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryChip, item?.category === cat && styles.categoryChipSelected]}
                  onPress={() => {
                    if (isEdit && editingItem) {
                      setEditingItem({ ...editingItem, category: cat });
                    } else {
                      setNewItem({ ...newItem, category: cat });
                    }
                  }}
                >
                  <Text style={[styles.categoryChipText, item?.category === cat && styles.categoryChipTextSelected]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => isEdit ? setEditingItem(null) : setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={isEdit ? handleEditItem : handleAddItem}
              >
                <Text style={styles.saveButtonText}>{isEdit ? 'Update' : 'Add'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const groupedItems = categories.reduce((acc, category) => {
    acc[category] = menuItems.filter(item => item.category === category);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9370DB" />
        <Text style={styles.loadingText}>Loading menu...</Text>
      </View>
    );
  }

  if (!businessId) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.noBusinessText}>No business found. Please create one first.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#9370DB', '#98FB98']} // Purple to Green gradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View>
          <Text style={styles.title}>Menu Management</Text>
          <Text style={styles.subtitle}>{menuItems.length} items</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addButtonText}>+ Add Item</Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {categories.map(category => {
          const items = groupedItems[category];
          if (items.length === 0) return null;

          return (
            <View key={category} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{category} ({items.length})</Text>
              {items.map(renderMenuItem)}
            </View>
          );
        })}

        {menuItems.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🍽️</Text>
            <Text style={styles.emptyTitle}>No Menu Items</Text>
            <Text style={styles.emptyText}>Add your first menu item to get started</Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>-Code Blooded</Text>
        </View>
      </ScrollView>

      {renderModal(false)}
      {renderModal(true)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0E68C', // Khaki background
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0E68C',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
  },
  noBusinessText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  addButton: {
    backgroundColor: '#FFFACD', // Pastel lemon chiffon
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#6A5ACD', // Slate blue
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  categorySection: {
    padding: SPACING.md,
  },
  categoryTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  menuCard: {
    backgroundColor: '#E6E6FA', // Pastel lavender
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#DDA0DD', // Pastel plum
  },
  menuCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  menuCardInfo: {
    flex: 1,
  },
  menuItemName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  menuItemCategory: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
  },
  menuCardActions: {
    alignItems: 'flex-end',
  },
  menuItemPrice: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    color: '#9370DB', // Medium purple
    marginBottom: SPACING.xs,
  },
  availabilityBadge: {
    backgroundColor: '#98FB98', // Pastel green
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  unavailableBadge: {
    backgroundColor: COLORS.error,
  },
  availabilityText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.surface,
    fontWeight: '600',
  },
  menuItemDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  menuCardFooter: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    backgroundColor: '#FFFACD', // Pastel lemon chiffon
    borderWidth: 1,
    borderColor: '#DDA0DD', // Pastel plum
    alignItems: 'center',
  },
  deleteButton: {
    borderColor: COLORS.error,
  },
  actionButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  deleteButtonText: {
    color: COLORS.error,
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.xxxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#E6E6FA', // Pastel lavender
    borderRadius: 12,
    padding: SPACING.md,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm,
  },
  input: {
    backgroundColor: '#FFFACD', // Pastel lemon chiffon
    borderWidth: 1,
    borderColor: '#DDA0DD', // Pastel plum
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.primary,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  categoryScroll: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  categoryChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: '#FFFACD', // Pastel lemon chiffon
    borderWidth: 1,
    borderColor: '#DDA0DD', // Pastel plum
    marginRight: SPACING.sm,
  },
  categoryChipSelected: {
    backgroundColor: '#98FB98', // Pastel green
    borderColor: '#98FB98',
  },
  categoryChipText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.primary,
  },
  categoryChipTextSelected: {
    color: COLORS.surface,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FFFACD', // Pastel lemon chiffon
    borderWidth: 1,
    borderColor: '#DDA0DD', // Pastel plum
  },
  saveButton: {
    backgroundColor: '#98FB98', // Pastel green
  },
  cancelButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.primary,
    fontWeight: '600',
  },
  saveButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  footerText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: '#9370DB', // Medium purple
    fontWeight: '600',
  },
});
