import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appDate',
  standalone: true
})
export class AppDatePipe implements PipeTransform {
  transform(value: Date | string | number): string {
    if (!value) return '';
    const date = value instanceof Date ? value : new Date(value);
    // Format: e.g., "April 27, 2024"
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
