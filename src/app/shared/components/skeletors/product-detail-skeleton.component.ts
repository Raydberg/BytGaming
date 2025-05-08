import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'product-detail-skeleton',
  imports: [CommonModule, SkeletonModule],
  template: `
    <div class="grid">
      <div class="col-12 md:col-6 p-3">
        <p-skeleton height="400px" styleClass="w-full"></p-skeleton>

        <div class="flex justify-content-between mt-3">
          <p-skeleton height="80px" width="80px" styleClass="mr-2"></p-skeleton>
          <p-skeleton height="80px" width="80px" styleClass="mr-2"></p-skeleton>
          <p-skeleton height="80px" width="80px" styleClass="mr-2"></p-skeleton>
          <p-skeleton height="80px" width="80px"></p-skeleton>
        </div>
      </div>

      <div class="col-12 md:col-6 p-3">
        <p-skeleton width="70%" height="3rem" styleClass="mb-2"></p-skeleton>
        <p-skeleton width="40%" height="2rem" styleClass="mb-2"></p-skeleton>

        <p-skeleton width="90%" height="1.5rem" styleClass="mb-1"></p-skeleton>
        <p-skeleton width="85%" height="1.5rem" styleClass="mb-1"></p-skeleton>
        <p-skeleton width="80%" height="1.5rem" styleClass="mb-3"></p-skeleton>

        <p-skeleton width="50%" height="2rem" styleClass="mb-2"></p-skeleton>
        <div class="flex mb-3">
          <p-skeleton width="4rem" height="2.5rem" styleClass="mr-2"></p-skeleton>
          <p-skeleton width="4rem" height="2.5rem" styleClass="mr-2"></p-skeleton>
          <p-skeleton width="4rem" height="2.5rem"></p-skeleton>
        </div>

        <div class="flex align-items-center mt-4">
          <p-skeleton width="30%" height="3rem" styleClass="mr-2"></p-skeleton>
          <p-skeleton width="50%" height="3rem"></p-skeleton>
        </div>
      </div>
    </div>
  `
})
export class ProductDetailSkeletonComponent {}
