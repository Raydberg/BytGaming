import {Component, Input, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SkeletonModule} from 'primeng/skeleton';

@Component({
  selector: 'card-skeleton',
  imports: [CommonModule, SkeletonModule],
  template: `
    <div class="grid">
      @for (item of items(); track $index) {
        <div class="col-12 sm:col-6 md:col-4 lg:col-3 xl:col-2 p-2">
          <div class="border border-surface-200 dark:border-surface-700 rounded m-2 p-4">
            <p-skeleton height="200px" styleClass="mb-2"></p-skeleton>

            <p-skeleton width="60%" height="2rem" styleClass="mb-2"></p-skeleton>

            <p-skeleton width="80%" height="1rem" styleClass="mb-1"></p-skeleton>
            <p-skeleton width="70%" height="1rem" styleClass="mb-1"></p-skeleton>

            <div class="flex justify-between align-items-center mt-3">
              <p-skeleton width="30%" height="2rem"></p-skeleton>
              <p-skeleton width="30%" height="2.5rem" styleClass="rounded-full"></p-skeleton>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class CardSkeletonComponent {
  @Input() set count(value: number) {
    this.itemCount.set(value);
  }
  itemCount = signal<number>(6);

  items = signal<number[]>([]);

  constructor() {
    this.updateItems(this.itemCount());
    this.itemCount.subscribe(count => {
      this.updateItems(count);
    });
  }
  private updateItems(count: number): void {
    this.items.set(Array(count).fill(0).map((_, i) => i));
  }
}
