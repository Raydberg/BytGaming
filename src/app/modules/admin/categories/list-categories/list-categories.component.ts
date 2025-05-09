import { ChangeDetectionStrategy, Component, effect, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
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
import { AdminCategoryService } from '../../../../core/services/admin/admin-category.service';
import { CategoryModel } from '../../../../core/model/category.model';
import { CategoryRequest } from '../../../../core/interfaces/category-http.interface';
import { NotificationService } from '../../../../core/services/notification.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { TableSkeletonComponent } from '../../../../shared/components/skeletors/table-skeleton.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { finalize } from 'rxjs';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-list-categories',
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
    TableSkeletonComponent
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './list-categories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListCategoriesComponent {
  // Services
  private categoryService = inject(AdminCategoryService);
  private notificationService = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);
  private loadingService = inject(LoadingService);

  // Component ID for loading state tracking
  private readonly COMPONENT_ID = 'categories-component';

  // State management
  categoryDialog: boolean = false;
  categories = signal<CategoryModel[]>([]);
  loading = this.loadingService.getLoadingState(this.COMPONENT_ID);

  category: CategoryModel = {} as CategoryModel;
  categoryRequest: CategoryRequest = {} as CategoryRequest;
  selectedCategories: CategoryModel[] | null = null;
  submitted: boolean = false;

  @ViewChild('dt') dt!: Table;

  exportColumns!: ExportColumn[];
  cols!: Column[];

  constructor() {
    effect(() => {
      this.loadCategories();
    });
  }

  loadCategories() {
    this.loadingService.startLoading(this.COMPONENT_ID);

    this.categoryService.getAllCategory()
      .pipe(finalize(() => this.loadingService.stopLoading(this.COMPONENT_ID)))
      .subscribe({
        next: (data: any) => {
          this.categories.set(data);
        },
        error: (error) => {
          console.error("Error loading categories data:", error);
          this.notificationService.showError(
            'Error',
            'Failed to load categories data. Please try again later.'
          );
        }
      });
  }

  exportCSV() {
    this.dt.exportCSV();
  }

  ngOnInit() {
    this.initializeColumns();
  }

  initializeColumns() {
    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Nombre' },
      { field: 'description', header: 'Descripción' }
    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.category = {} as CategoryModel;
    this.categoryRequest = {} as CategoryRequest;
    this.submitted = false;
    this.categoryDialog = true;
  }

  editCategory(category: CategoryModel) {
    this.category = { ...category };
    this.categoryRequest = {
      name: category.name,
      description: category.description
    };
    this.categoryDialog = true;
  }

  deleteSelectedCategories() {
    this.confirmationService.confirm({
      message: '¿Está seguro de eliminar las categorías seleccionadas?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.selectedCategories) {
          this.loadingService.startLoading(this.COMPONENT_ID);

          const deletePromises = this.selectedCategories.map(category =>
            this.categoryService.deleteCategory(category.id)
          );

          Promise.all(deletePromises)
            .then(() => {
              this.categories.update(currentCategories =>
                currentCategories.filter(c => !this.selectedCategories?.some(selected => selected.id === c.id))
              );

              this.selectedCategories = null;
              this.notificationService.showSuccess(
                'Éxito',
                'Categorías eliminadas'
              );
            })
            .catch((error) => {
              console.error("Error deleting categories:", error);
              this.notificationService.showError(
                'Error',
                'No se pudieron eliminar una o más categorías'
              );
            })
            .finally(() => {
              this.loadingService.stopLoading(this.COMPONENT_ID);
            });
        }
      }
    });
  }

  hideDialog() {
    this.categoryDialog = false;
    this.submitted = false;
  }

  deleteCategory(category: CategoryModel) {
    this.confirmationService.confirm({
      message: '¿Está seguro de eliminar ' + category.name + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loadingService.startLoading(this.COMPONENT_ID);

        this.categoryService.deleteCategory(category.id)
          .pipe(finalize(() => this.loadingService.stopLoading(this.COMPONENT_ID)))
          .subscribe({
            next: () => {
              this.categories.update(currentCategories =>
                currentCategories.filter(c => c.id !== category.id)
              );

              this.notificationService.showSuccess(
                'Éxito',
                'Categoría eliminada'
              );
            },
            error: (error) => {
              console.error("Error deleting category:", error);
              this.notificationService.showError(
                'Error',
                'No se pudo eliminar la categoría'
              );
            }
          });
      }
    });
  }

  saveCategory() {
    this.submitted = true;

    if (!this.categoryRequest.name?.trim()) {
      return;
    }

    this.loadingService.startLoading(this.COMPONENT_ID);

    if (this.category.id) {
      // Update existing category
      this.categoryService.updateCategory(this.category.id, this.categoryRequest)
        .pipe(finalize(() => this.loadingService.stopLoading(this.COMPONENT_ID)))
        .subscribe({
          next: () => {
            // Update the local data
            this.categories.update(currentCategories => {
              const index = currentCategories.findIndex(c => c.id === this.category.id);
              if (index !== -1) {
                const updatedCategories = [...currentCategories];
                updatedCategories[index] = {
                  id: this.category.id,
                  name: this.categoryRequest.name || '',
                  description: this.categoryRequest.description || ''
                };
                return updatedCategories;
              }
              return currentCategories;
            });

            this.notificationService.showSuccess(
              'Éxito',
              'Categoría actualizada'
            );

            this.categoryDialog = false;
            this.category = {} as CategoryModel;
            this.categoryRequest = {} as CategoryRequest;
          },
          error: (error) => {
            console.error("Error updating category:", error);
            this.notificationService.showError(
              'Error',
              'No se pudo actualizar la categoría'
            );
          }
        });
    } else {
      // Create new category
      this.categoryService.createCategory(this.categoryRequest)
        .pipe(finalize(() => this.loadingService.stopLoading(this.COMPONENT_ID)))
        .subscribe({
          next: (response: any) => {
            // Add the new category with the ID from response
            const newCategory: CategoryModel = {
              id: response.id,
              name: this.categoryRequest.name || '',
              description: this.categoryRequest.description || ''
            };

            this.categories.update(currentCategories => [...currentCategories, newCategory]);

            this.notificationService.showSuccess(
              'Éxito',
              'Categoría creada'
            );

            this.categoryDialog = false;
            this.category = {} as CategoryModel;
            this.categoryRequest = {} as CategoryRequest;
          },
          error: (error) => {
            console.error("Error creating category:", error);
            this.notificationService.showError(
              'Error',
              'No se pudo crear la categoría'
            );
          }
        });
    }
  }
}
