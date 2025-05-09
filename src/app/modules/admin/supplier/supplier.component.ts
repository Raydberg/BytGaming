import { ChangeDetectionStrategy, Component, effect, inject, signal, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { AdminSupplierService } from '../../../core/services/admin/admin-supplier.service';
import { SupplierModel } from '../../../core/model/supplier.model';
import { SupplierRequest } from '../../../core/interfaces/supplier-http.interface';
import { TooltipModule } from 'primeng/tooltip';
import { NotificationService } from '../../../core/services/notification.service';
import { LoadingService } from '../../../core/services/loading.service';
import { TableSkeletonComponent } from '../../../shared/components/skeletors/table-skeleton.component';
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
  selector: 'admin-supplier',
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
    TooltipModule,
    TableSkeletonComponent
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './supplier.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupplierComponent {
  // Services
  supplierService = inject(AdminSupplierService);
  notificationService = inject(NotificationService);
  confirmationService = inject(ConfirmationService);
  loadingService = inject(LoadingService);

  // Component ID for loading state tracking
  private readonly COMPONENT_ID = 'supplier-component';

  // State management
  supplierDialog: boolean = false;
  suppliers = signal<SupplierModel[]>([]);
  loading = this.loadingService.getLoadingState(this.COMPONENT_ID);

  supplier: SupplierModel = {} as SupplierModel;
  supplierRequest: SupplierRequest = {} as SupplierRequest;
  selectedSuppliers: SupplierModel[] | null = null;
  submitted: boolean = false;

  @ViewChild('dt') dt!: Table;

  exportColumns!: ExportColumn[];
  cols!: Column[];

  constructor() {
    effect(() => {
      this.loadSuppliers();
    });
  }

  loadSuppliers() {
    this.loadingService.startLoading(this.COMPONENT_ID);

    this.supplierService.getSuppliers()
      .pipe(finalize(() => this.loadingService.stopLoading(this.COMPONENT_ID)))
      .subscribe({
        next: (data: any) => {
          this.suppliers.set(data);
        },
        error: (error) => {
          this.notificationService.showError(
            'Error',
            'Failed to load suppliers. Please try again later.'
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
      { field: 'name', header: 'Name' },
      { field: 'ruc', header: 'RUC' },
      { field: 'email', header: 'Email' },
      { field: 'phone', header: 'Phone' },
      { field: 'isActive', header: 'Status' }
    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.supplier = {} as SupplierModel;
    this.supplierRequest = {} as SupplierRequest;
    this.submitted = false;
    this.supplierDialog = true;
  }

  editSupplier(supplier: SupplierModel) {
    this.supplier = { ...supplier };
    this.supplierRequest = {
      name: supplier.name,
      ruc: supplier.ruc,
      email: supplier.email,
      phone: supplier.phone,
      isActive: supplier.isActive
    };
    this.supplierDialog = true;
  }

  deleteSelectedSuppliers() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected suppliers?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.selectedSuppliers) {
          this.loadingService.startLoading(this.COMPONENT_ID);

          const deletePromises = this.selectedSuppliers.map(supplier =>
            this.supplierService.deleteSupplier(supplier.id)
          );

          Promise.all(deletePromises)
            .then(() => {
              this.suppliers.update(currentSuppliers =>
                currentSuppliers.filter(s => !this.selectedSuppliers?.some(selected => selected.id === s.id))
              );

              this.selectedSuppliers = null;
              this.notificationService.showSuccess(
                'Successful',
                'Suppliers Deleted'
              );
            })
            .catch(() => {
              this.notificationService.showError(
                'Error',
                'Failed to delete one or more suppliers'
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
    this.supplierDialog = false;
    this.submitted = false;
  }

  deleteSupplier(supplier: SupplierModel) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + supplier.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loadingService.startLoading(this.COMPONENT_ID);

        this.supplierService.deleteSupplier(supplier.id)
          .pipe(finalize(() => this.loadingService.stopLoading(this.COMPONENT_ID)))
          .subscribe({
            next: () => {
              this.suppliers.update(currentSuppliers =>
                currentSuppliers.filter(s => s.id !== supplier.id)
              );

              this.notificationService.showSuccess(
                'Successful',
                'Supplier Deleted'
              );
            },
            error: (error) => {
              this.notificationService.showError(
                'Error',
                'Failed to delete supplier'
              );
            }
          });
      }
    });
  }

  getSeverity(isActive: boolean): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    return isActive ? 'success' : 'danger';
  }

  saveSupplier() {
    this.submitted = true;

    if (!this.supplierRequest.name?.trim() || !this.supplierRequest.ruc?.trim() ||
        !this.supplierRequest.email?.trim() || !this.supplierRequest.phone?.trim()) {
      return;
    }

    // Ensure isActive is set (default to true for new suppliers)
    if (this.supplierRequest.isActive === undefined) {
      this.supplierRequest.isActive = true;
    }

    this.loadingService.startLoading(this.COMPONENT_ID);

    if (this.supplier.id) {
      // Update existing supplier
      this.supplierService.updateSupplier(this.supplierRequest)
        .pipe(finalize(() => this.loadingService.stopLoading(this.COMPONENT_ID)))
        .subscribe({
          next: (response) => {
            // Update the local data
            this.suppliers.update(currentSuppliers => {
              const index = currentSuppliers.findIndex(s => s.id === this.supplier.id);
              if (index !== -1) {
                const updatedSuppliers = [...currentSuppliers];
                updatedSuppliers[index] = {
                  ...this.supplier,
                  ...this.supplierRequest
                };
                return updatedSuppliers;
              }
              return currentSuppliers;
            });

            this.notificationService.showSuccess(
              'Successful',
              'Supplier Updated'
            );

            this.supplierDialog = false;
            this.supplier = {} as SupplierModel;
            this.supplierRequest = {} as SupplierRequest;
          },
          error: (error) => {
            this.notificationService.showError(
              'Error',
              'Failed to update supplier'
            );
          }
        });
    } else {
      // Create new supplier
      this.supplierService.createSupplier(this.supplierRequest)
      .pipe(finalize(() => this.loadingService.stopLoading(this.COMPONENT_ID)))
      .subscribe({
        next: (response: any) => {
          // Add the new supplier with the ID from response
          const newSupplier: SupplierModel = {
            id: response.id || Math.floor(Math.random() * 1000),
            name: this.supplierRequest.name,
            ruc: this.supplierRequest.ruc,
            email: this.supplierRequest.email,
            phone: this.supplierRequest.phone,
            isActive: this.supplierRequest.isActive === undefined ? true : this.supplierRequest.isActive
          };

          this.suppliers.update(currentSuppliers => [...currentSuppliers, newSupplier]);

          this.notificationService.showSuccess(
            'Successful',
            'Supplier Created'
          );

          this.supplierDialog = false;
          this.supplier = {} as SupplierModel;
          this.supplierRequest = {} as SupplierRequest;
        },
        error: (error) => {
          this.notificationService.showError(
            'Error',
            'Failed to create supplier'
          );
        }
      });
    }
  }

  toggleStatus(supplier: SupplierModel) {
    const updatedSupplier: SupplierRequest = {
      name: supplier.name,
      ruc: supplier.ruc,
      email: supplier.email,
      phone: supplier.phone,
      isActive: !supplier.isActive
    };

    this.loadingService.startLoading(this.COMPONENT_ID);

    this.supplierService.updateSupplier(updatedSupplier)
      .pipe(finalize(() => this.loadingService.stopLoading(this.COMPONENT_ID)))
      .subscribe({
        next: () => {
          this.suppliers.update(currentSuppliers => {
            return currentSuppliers.map(s => {
              if (s.id === supplier.id) {
                return { ...s, isActive: !s.isActive };
              }
              return s;
            });
          });

          this.notificationService.showSuccess(
            'Successful',
            `Supplier ${supplier.isActive ? 'Deactivated' : 'Activated'}`
          );
        },
        error: () => {
          this.notificationService.showError(
            'Error',
            'Failed to update supplier status'
          );
        }
      });
  }
}
