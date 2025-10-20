// Firebase Menu Service for Menu Item CRUD operations

import firestore from '@react-native-firebase/firestore';
import { MenuItem } from '../types';
import { COLLECTIONS } from '../config/firebase';

class FirebaseMenuService {
  // Get menu items for a business
  async getMenuItems(businessId: string): Promise<MenuItem[]> {
    try {
      const snapshot = await firestore()
        .collection(COLLECTIONS.MENUS)
        .where('businessId', '==', businessId)
        .where('isAvailable', '==', true)
        .orderBy('category', 'asc')
        .orderBy('name', 'asc')
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as MenuItem[];
    } catch (error: any) {
      console.error('Error fetching menu items:', error);
      throw new Error('Failed to fetch menu items');
    }
  }

  // Create new menu item
  async createMenuItem(businessId: string, menuItem: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    try {
      const menuRef = firestore().collection(COLLECTIONS.MENUS).doc();
      
      const newMenuItem: MenuItem = {
        id: menuRef.id,
        ...menuItem,
        businessId,
      };

      await menuRef.set(newMenuItem);
      return newMenuItem;
    } catch (error: any) {
      console.error('Error creating menu item:', error);
      throw new Error('Failed to create menu item');
    }
  }

  // Update menu item
  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<void> {
    try {
      await firestore()
        .collection(COLLECTIONS.MENUS)
        .doc(id)
        .update(updates);
    } catch (error: any) {
      console.error('Error updating menu item:', error);
      throw new Error('Failed to update menu item');
    }
  }

  // Delete menu item (soft delete by setting isAvailable to false)
  async deleteMenuItem(id: string): Promise<void> {
    try {
      await firestore()
        .collection(COLLECTIONS.MENUS)
        .doc(id)
        .update({
          isAvailable: false,
        });
    } catch (error: any) {
      console.error('Error deleting menu item:', error);
      throw new Error('Failed to delete menu item');
    }
  }

  // Toggle menu item availability
  async toggleAvailability(id: string, isAvailable: boolean): Promise<void> {
    try {
      await firestore()
        .collection(COLLECTIONS.MENUS)
        .doc(id)
        .update({
          isAvailable,
        });
    } catch (error: any) {
      console.error('Error toggling availability:', error);
      throw new Error('Failed to toggle availability');
    }
  }
}

export const firebaseMenuService = new FirebaseMenuService();
