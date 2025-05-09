import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { ProductModel } from '../../../../core/model/product.model';
import { ProductRequest } from '../../../../core/interfaces/product-http.interface';
import { finalize } from 'rxjs';
import {Textarea} from 'primeng/textarea';

@Component({
  selector: 'app-update-product',
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
  templateUrl: './update-product.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateProductComponent implements OnInit {
  // Services
  private categoryService = inject(AdminCategoryService);
  private productService = inject(AdminProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private notificationService = inject(NotificationService);
  private loadingService = inject(LoadingService);

  // Component ID for loading state tracking
  private readonly COMPONENT_ID = 'update-product';

  // State
  categories = signal<CategoryModel[]>([]);
  product = signal<ProductModel | null>(null);
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

  ngOnInit() {
    this.loadCategories();

    const productId = this.route.snapshot.params['id'];
    if (productId) {
      this.loadProduct(+productId);
    } else {
      this.router.navigate(['/admin/products']);
    }
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

  loadProduct(id: number) {
    this.loadingService.startLoading(this.COMPONENT_ID);

    this.productService.getProductById(id)
      .pipe(finalize(() => this.loadingService.stopLoading(this.COMPONENT_ID)))
      .subscribe({
        next: (data) => {
          this.product.set(data);
          this.previewImage = data.image?.imageUrl || null;

          // Initialize form data from product
          this.productRequest = {
            nameProduct: data.nameProduct,
            description: data.description,
            price: data.price,
            units: data.units,
            isActive: data.isActive,
            categoryId: data.category?.id
          };
        },
        error: (error) => {
          console.error('Error loading product:', error);
          this.notificationService.showError(
            'Error',
            'No se pudo cargar el producto'
          );
          this.router.navigate(['/admin/products']);
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
    const currentProduct = this.product();
    if (currentProduct?.image?.imageUrl) {
      this.previewImage = currentProduct.image.imageUrl;
    } else {
      this.previewImage = null;
    }
  }

  updateProduct() {
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

    const currentProduct = this.product();
    if (!currentProduct) {
      this.notificationService.showError('Error', 'Producto no encontrado');
      return;
    }

    this.loadingService.startLoading(this.COMPONENT_ID);

    this.productService.updateProduct(currentProduct.id, this.productRequest)
      .pipe(finalize(() => this.loadingService.stopLoading(this.COMPONENT_ID)))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess(
            'Éxito',
            'Producto actualizado correctamente'
          );
          this.router.navigate(['/admin/products']);
        },
        error: (error) => {
          console.error('Error updating product:', error);
          this.notificationService.showError(
            'Error',
            'No se pudo actualizar el producto'
          );
        }
      });
  }

  cancel() {
    this.router.navigate(['/admin/products']);
  }
}
