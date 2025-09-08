import { PropertyService } from '../service';
import type { CreateProperty } from '../../config/property.schema';

interface CreatePropertyInput extends CreateProperty {
  ownerId: string;
}

export async function createProperty(input: CreatePropertyInput) {
  try {
    const property = await PropertyService.create(input);
    return { success: true, data: property };
  } catch (error) {
    console.error('Error creating property:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create property' 
    };
  }
}