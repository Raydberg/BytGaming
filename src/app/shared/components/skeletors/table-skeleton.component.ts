import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'table-skeleton',
  imports: [CommonModule, SkeletonModule],
  template: `
    <div class="skeleton-table">
      <div class="skeleton-header flex w-full mb-2">
        <p-skeleton *ngFor="let col of columns" height="2rem" styleClass="mr-2" [style]="{ width: '100%' }"></p-skeleton>
      </div>

      <div class="skeleton-row flex w-full mb-2" *ngFor="let i of rows">
        <p-skeleton *ngFor="let col of columns" height="3rem" styleClass="mr-2" [style]="{ width: '100%' }"></p-skeleton>
      </div>
    </div>
  `,
  styles: [`
    .skeleton-table {
      width: 100%;
    }

    .skeleton-header, .skeleton-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
      gap: 0.5rem;
    }
  `]
})
export class TableSkeletonComponent {
  @Input() rowCount = 5;
  @Input() columnCount = 4;

  get rows(): number[] {
    return Array(this.rowCount).fill(0).map((_, i) => i);
  }

  get columns(): number[] {
    return Array(this.columnCount).fill(0).map((_, i) => i);
  }
}
