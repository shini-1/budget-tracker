// Menu Management Screen with CRUD operations

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
}

export const MenuManagementScreen: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: '1', name: 'Caesar Salad', description: 'Fresh romaine lettuce with parmesan', price: 12.99, category: 'Appetizers', isAvailable: true },
    { id: '2', name: 'Grilled Salmon', description: 'Atlantic salmon with vegetables', price: 24.99, category: 'Main Course', isAvailable: true },
    { id: '3', name: 'Chocolate Cake', description: 'Rich chocolate cake with ice cream', price: 8.99, category: 'Desserts', isAvailable: true },
  ]);
  
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

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const item: MenuItem = {
      id: Date.now().toString(),
      name: newItem.name!,
      description: newItem.description || '',
      price: newItem.price!,
      category: newItem.category || 'Main Course',
      isAvailable: true,
    };

    setMenuItems([...menuItems, item]);
    setShowAddModal(false);
    setNewItem({ name: '', description: '', price: 0, category: 'Main Course', isAvailable: true });
    Alert.alert('Success', 'Menu item added successfully!');
  };

  const handleEditItem = () => {
    if (!editingItem) return;

    setMenuItems(menuItems.map(item => 
      item.id === editingItem.id ? editingItem : item
    ));
    setEditingItem(null);
    Alert.alert('Success', 'Menu item updated successfully!');
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
          onPress: () => {
            setMenuItems(menuItems.filter(item => item.id !== id));
            Alert.alert('Success', 'Menu item deleted successfully!');
          },
        },
      ]
    );
  };

  const toggleAvailability = (id: string) => {
    setMenuItems(menuItems.map(item =>
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    ));
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
    const setItem = isEdit ? setEditingItem : setNewItem;

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
              onChangeText={(text) => setItem({ ...item, name: text })}
              placeholder="Enter item name"
              placeholderTextColor={COLORS.text.hint}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={item?.description}
              onChangeText={(text) => setItem({ ...item, description: text })}
              placeholder="Enter description"
              placeholderTextColor={COLORS.text.hint}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.label}>Price *</Text>
            <TextInput
              style={styles.input}
              value={item?.price?.toString()}
              onChangeText={(text) => setItem({ ...item, price: parseFloat(text) || 0 })}
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
                  onPress={() => setItem({ ...item, category: cat })}
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
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
      </View>

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
  title: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  addButtonText: {
    color: COLORS.surface,
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
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  availabilityBadge: {
    backgroundColor: COLORS.success,
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
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    backgroundColor: COLORS.surface,
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
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
  },
  categoryChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
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
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.primary,
    fontWeight: '600',
  },
  saveButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.surface,
    fontWeight: '600',
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
