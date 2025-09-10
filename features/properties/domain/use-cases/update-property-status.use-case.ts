import { PropertyService } from '../service';
import type { PropertyStatus } from '../../config/property.schema';

interface UpdatePropertyStatusInput {
  id: string;
  ownerId: string;
  status: PropertyStatus;
}

export async function updatePropertyStatus(input: UpdatePropertyStatusInput) {
  try {
    const { id, ownerId, status } = input;
    
    // Use the existing update method but only update the status field
    const property = await PropertyService.update(id, { status }, ownerId);
    
    if (!property) {
      return { 
        success: false, 
        error: 'Property not found or you do not have permission to update it' 
      };
    }
    
    return { success: true, data: property };
  } catch (error) {
    console.error('Error updating property status:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update property status' 
    };
  }
}