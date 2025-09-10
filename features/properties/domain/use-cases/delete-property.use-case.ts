import { PropertyService } from '../service';

interface DeletePropertyInput {
  id: string;
  ownerId: string;
}

export async function deleteProperty(input: DeletePropertyInput) {
  try {
    const { id, ownerId } = input;
    const success = await PropertyService.delete(id, ownerId);
    
    if (!success) {
      return { 
        success: false, 
        error: 'Property not found or you do not have permission to delete it' 
      };
    }
    
    return { success: true, data: { id } };
  } catch (error) {
    console.error('Error deleting property:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete property' 
    };
  }
}