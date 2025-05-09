import { ChangeDetectionStrategy, Component, inject, signal, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { Table, TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AdminProductService } from '../../../../core/services/admin/admin-product.service';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';
import { ProductModel } from '../../../../core/model/product.model';
import { finalize } from 'rxjs';
import { LoadingService } from '../../../../core/services/loading.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { TableSkeletonComponent } from '../../../../shared/components/skeletors/table-skeleton.component';
import {TooltipModule} from 'primeng/tooltip';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'list-products',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,
    CurrencyFormatPipe,
    TableSkeletonComponent,
    TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './list-products.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListProductsComponent {
  // Services
  private productService = inject(AdminProductService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);
  private loadingService = inject(LoadingService);

  // Component ID for loading state tracking
  private readonly COMPONENT_ID = 'product-list';

  // State management
  products = signal<ProductModel[]>([]);
  loading = this.loadingService.getLoadingState(this.COMPONENT_ID);
  selectedProducts: ProductModel[] | null = null;

  @ViewChild('dt') dt!: Table;

  cols: Column[] = [
    { field: 'id', header: 'ID' },
    { field: 'nameProduct', header: 'Nombre' },
    { field: 'description', header: 'Descripción' },
    { field: 'price', header: 'Precio' },
    { field: 'units', header: 'Unidades' },
    { field: 'category', header: 'Categoría' },
    { field: 'image', header: 'Imagen' },
    { field: 'isActive', header: 'Estado' }
  ];

  constructor() {
    effect(() => {
      this.loadProducts();
    });
  }

  loadProducts() {
    this.loadingService.startLoading(this.COMPONENT_ID);

    this.productService.getAllProduct()
      .pipe(finalize(() => this.loadingService.stopLoading(this.COMPONENT_ID)))
      .subscribe({
        next: (data) => {
          this.products.set(data);
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.notificationService.showError(
            'Error',
            'No se pudieron cargar los productos'
          );
        }
      });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.router.navigate(['/admin/products/create']);
  }

  editProduct(product: ProductModel) {
    this.router.navigate([`/admin/products/product/${product.id}`]);
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar los productos seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.selectedProducts && this.selectedProducts.length > 0) {
          this.loadingService.startLoading(this.COMPONENT_ID);

          const deletePromises = this.selectedProducts.map(product =>
            this.productService.deleteProduct(product.id)
          );

          Promise.all(deletePromises)
            .then(() => {
              this.products.update(currentProducts =>
                currentProducts.filter(p => !this.selectedProducts?.some(selected => selected.id === p.id))
              );

              this.selectedProducts = null;
              this.notificationService.showSuccess(
                'Éxito',
                'Productos eliminados correctamente'
              );
            })
            .catch(error => {
              console.error('Error deleting products:', error);
              this.notificationService.showError(
                'Error',
                'No se pudieron eliminar los productos'
              );
            })
            .finally(() => {
              this.loadingService.stopLoading(this.COMPONENT_ID);
            });
        }
      }
    });
  }

  deleteProduct(product: ProductModel) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el producto ${product.nameProduct}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loadingService.startLoading(this.COMPONENT_ID);

        this.productService.deleteProduct(product.id)
          .pipe(finalize(() => this.loadingService.stopLoading(this.COMPONENT_ID)))
          .subscribe({
            next: () => {
              this.products.update(currentProducts =>
                currentProducts.filter(p => p.id !== product.id)
              );

              this.notificationService.showSuccess(
                'Éxito',
                'Producto eliminado correctamente'
              );
            },
            error: (error) => {
              console.error('Error deleting product:', error);
              this.notificationService.showError(
                'Error',
                'No se pudo eliminar el producto'
              );
            }
          });
      }
    });
  }

  toggleProductStatus(product: ProductModel) {
    this.loadingService.startLoading(this.COMPONENT_ID);

    this.productService.toggleProductStatus(product.id, !product.isActive)
      .pipe(finalize(() => this.loadingService.stopLoading(this.COMPONENT_ID)))
      .subscribe({
        next: () => {
          this.products.update(currentProducts => {
            return currentProducts.map(p => {
              if (p.id === product.id) {
                return { ...p, isActive: !p.isActive };
              }
              return p;
            });
          });

          this.notificationService.showSuccess(
            'Éxito',
            `Producto ${product.isActive ? 'desactivado' : 'activado'} correctamente`
          );
        },
        error: (error) => {
          console.error('Error toggling product status:', error);
          this.notificationService.showError(
            'Error',
            'No se pudo cambiar el estado del producto'
          );
        }
      });
  }

  getSeverity(active: boolean): 'success' | 'danger' {
    return active ? 'success' : 'danger';
  }
}
