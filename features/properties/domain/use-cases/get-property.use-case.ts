import { PropertyService } from '../service';

export async function getPropertyById(id: string, userId?: string) {
  try {
    const property = await PropertyService.findById(id, userId);
    if (!property) {
      return { success: false, error: 'Property not found' };
    }
    
    // Increment view count
    await PropertyService.incrementViewCount(id);
    
    return { success: true, data: property };
  } catch (error) {
    console.error('Error getting property:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get property' 
    };
  }
}