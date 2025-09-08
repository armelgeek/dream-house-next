import { PropertyService } from '../service';
import type { PropertySearch } from '../../config/property.schema';

export async function searchProperties(filters: PropertySearch, userId?: string) {
  try {
    const result = await PropertyService.search(filters, userId);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error searching properties:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to search properties' 
    };
  }
}