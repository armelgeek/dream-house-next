import { PropertyService } from '../service';
import type { UpdateProperty } from '../../config/property.schema';

interface UpdatePropertyInput extends UpdateProperty {
  id: string;
  ownerId: string;
}

export async function updateProperty(input: UpdatePropertyInput) {
  try {
    const { id, ownerId, ...updateData } = input;
    const property = await PropertyService.update(id, updateData, ownerId);
    
    if (!property) {
      return { 
        success: false, 
        error: 'Property not found or you do not have permission to update it' 
      };
    }
    
    return { success: true, data: property };
  } catch (error) {
    console.error('Error updating property:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update property' 
    };
  }
}