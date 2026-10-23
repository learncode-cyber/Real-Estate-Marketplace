import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import type {
  AreaOption,
  PagedResult,
  PropertyDetail,
  PropertySummary,
} from '@property-platform/shared-types';
import { PropertiesService } from './properties.service';

const SLUG_PATTERN = /^[a-z0-9-]{1,120}$/;

@Controller()
export class PropertiesController {
  constructor(private readonly properties: PropertiesService) {}

  @Get('properties')
  list(@Query() query: Record<string, unknown>): Promise<PagedResult<PropertySummary>> {
    return this.properties.list(query);
  }

  @Get('properties/:slug')
  detail(@Param('slug') slug: string): Promise<PropertyDetail> {
    if (!SLUG_PATTERN.test(slug)) {
      throw new NotFoundException('Listing not found.');
    }
    return this.properties.getBySlug(slug);
  }

  @Get('areas')
  areas(): Promise<AreaOption[]> {
    return this.properties.listAreas();
  }
}
