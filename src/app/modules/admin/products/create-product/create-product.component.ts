import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { AdminCategoryService } from '../../../../core/services/admin/admin-category.service';
import { AdminProductService } from '../../../../core/services/admin/admin-product.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CategoryModel } from '../../../../core/model/category.model';
import { ProductRequest } from '../../../../core/interfaces/product-http.interface';
import { finalize } from 'rxjs';
import {Textarea} from 'primeng/textarea';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    FileUploadModule,
    InputNumberModule,
    InputSwitchModule,
    InputTextModule,
    Textarea,
    MessageModule,
    MessagesModule,
    ToastModule
  ],
  templateUrl: './create-product.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateProductComponent {
  // Services
  private categoryService = inject(AdminCategoryService);
  private productService = inject(AdminProductService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private loadingService = inject(LoadingService);

  // Component ID for loading state tracking
  private readonly COMPONENT_ID = 'create-product';

  // State
  categories = signal<CategoryModel[]>([]);
  loading = this.loadingService.getLoadingState(this.COMPONENT_ID);
  submitted = false;

  // Form data
  productRequest: ProductRequest = {
    nameProduct: '',
    description: '',
    price: 0,
    units: 0,
    isActive: true,
    categoryId: undefined,
    file: undefined
  };

  // Preview
  previewImage: string | ArrayBuffer | null = null;

  constructor() {
    this.loadCategories();
  }

  loadCategories() {
    this.loadingService.startLoading(this.COMPONENT_ID);

    this.categoryService.getAllCategory()
      .pipe(finalize(() => this.loadingService.stopLoading(this.COMPONENT_ID)))
      .subscribe({
        next: (data) => {
          this.categories.set(data);
        },
        error: (error) => {
          console.error('Error loading categories:', error);
          this.notificationService.showError(
            'Error',
            'No se pudieron cargar las categorías'
          );
        }
      });
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.productRequest.file = file;

      // Show preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeFile() {
    this.productRequest.file = undefined;
    this.previewImage = null;
  }

  saveProduct() {
    this.submitted = true;

    if (!this.productRequest.nameProduct?.trim() ||
        !this.productRequest.description?.trim() ||
        this.productRequest.price === undefined ||
        this.productRequest.price <= 0 ||
        this.productRequest.units === undefined ||
        this.productRequest.categoryId === undefined) {
      this.notificationService.showError(
        'Error',
        'Por favor complete todos los campos obligatorios'
      );
      return;
    }

    this.loadingService.startLoading(this.COMPONENT_ID);

    this.productService.createProduct(this.productRequest)
      .pipe(finalize(() => this.loadingService.stopLoading(this.COMPONENT_ID)))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess(
            'Éxito',
            'Producto creado correctamente'
          );
          this.router.navigate(['/admin/products']);
        },
        error: (error) => {
          console.error('Error creating product:', error);
          this.notificationService.showError(
            'Error',
            'No se pudo crear el producto'
          );
        }
      });
  }

  cancel() {
    this.router.navigate(['/admin/products']);
  }
}
