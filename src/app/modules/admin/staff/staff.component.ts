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
import { AdminStaffService } from '../../../core/services/admin/admin-staff.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LoadingService } from '../../../core/services/loading.service';
import { TableSkeletonComponent } from '../../../shared/components/skeletors/table-skeleton.component';
import { finalize } from 'rxjs';
import { StaffModel } from '../../../core/model/staff.model';
import { StaffPost, StaffRequest } from '../../../core/interfaces/staff-http.interface';
import { TooltipModule } from 'primeng/tooltip';

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
  selector: 'admin-staff',
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
  templateUrl: './staff.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StaffComponent {
  // Services
  staffService = inject(AdminStaffService);
  notificationService = inject(NotificationService);
  confirmationService = inject(ConfirmationService);
  loadingService = inject(LoadingService);

  // Component ID for loading state tracking
  private readonly COMPONENT_ID = 'staff-component';

  // State management
  staffDialog: boolean = false;
  staff = signal<StaffModel[]>([]);
  loading = this.loadingService.getLoadingState(this.COMPONENT_ID);

  staffMember: StaffModel = {} as StaffModel;
  staffRequest: StaffRequest = {} as StaffRequest;
  selectedStaff: StaffModel[] | null = null;
  submitted: boolean = false;

  positions = [
    { label: 'Administrator', value: 'ADMINISTRADOR' },
    { label: 'Warehouse Manager', value: 'ALMACENERO' },
    { label: 'Supervisor', value: 'SUPERVISOR' }
  ];

  @ViewChild('dt') dt!: Table;

  exportColumns!: ExportColumn[];
  cols!: Column[];

  constructor() {
    effect(() => {
      this.loadStaff();
    });
  }

  loadStaff() {
    this.loadingService.startLoading(this.COMPONENT_ID);

    this.staffService.getAllStaff()
      .pipe(finalize(() => this.loadingService.stopLoading(this.COMPONENT_ID)))
      .subscribe({
        next: (data: any) => {
          this.staff.set(data);
        },
        error: (error) => {
          this.notificationService.showError(
            'Error',
            'Failed to load staff data. Please try again later.'
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
      { field: 'email', header: 'Email' },
      { field: 'post', header: 'Position' }
    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.staffMember = {} as StaffModel;
    this.staffRequest = {} as StaffRequest;
    this.submitted = false;
    this.staffDialog = true;
  }

  editStaff(staffMember: StaffModel) {
    this.staffMember = { ...staffMember };
    this.staffRequest = {
      name: staffMember.name,
      email: staffMember.email,
      post: staffMember.post as StaffPost
    };
    this.staffDialog = true;
  }

  deleteSelectedStaff() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected staff members?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.selectedStaff) {
          this.loadingService.startLoading(this.COMPONENT_ID);

          const deletePromises = this.selectedStaff.map(staffMember =>
            this.staffService.deleteStaff(staffMember.id)
          );

          Promise.all(deletePromises)
            .then(() => {
              this.staff.update(currentStaff =>
                currentStaff.filter(s => !this.selectedStaff?.some(selected => selected.id === s.id))
              );

              this.selectedStaff = null;
              this.notificationService.showSuccess(
                'Successful',
                'Staff Members Deleted'
              );
            })
            .catch(() => {
              this.notificationService.showError(
                'Error',
                'Failed to delete one or more staff members'
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
    this.staffDialog = false;
    this.submitted = false;
  }

  deleteStaff(staffMember: StaffModel) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + staffMember.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loadingService.startLoading(this.COMPONENT_ID);

        this.staffService.deleteStaff(staffMember.id)
          .pipe(finalize(() => this.loadingService.stopLoading(this.COMPONENT_ID)))
          .subscribe({
            next: () => {
              this.staff.update(currentStaff =>
                currentStaff.filter(s => s.id !== staffMember.id)
              );

              this.notificationService.showSuccess(
                'Successful',
                'Staff Member Deleted'
              );
            },
            error: (error) => {
              this.notificationService.showError(
                'Error',
                'Failed to delete staff member'
              );
            }
          });
      }
    });
  }

  getPostSeverity(post: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (post) {
      case 'Administrator':
        return 'danger';
      case 'Developer':
        return 'info';
      case 'Support':
        return 'warn'; // changed from 'warning' to 'warn'
      default:
        return 'secondary';
    }
  }

  saveStaff() {
    this.submitted = true;

    if (!this.staffRequest.name?.trim() || !this.staffRequest.email?.trim() || !this.staffRequest.post) {
      return;
    }

    this.loadingService.startLoading(this.COMPONENT_ID);

    if (this.staffMember.id) {
      // Update existing staff
      this.staffService.updateStaff(this.staffRequest, this.staffMember.id)
        .pipe(finalize(() => this.loadingService.stopLoading(this.COMPONENT_ID)))
        .subscribe({
          next: (response) => {
            // Update the local data
            this.staff.update(currentStaff => {
              const index = currentStaff.findIndex(s => s.id === this.staffMember.id);
              if (index !== -1) {
                const updatedStaffList = [...currentStaff];
                updatedStaffList[index] = {
                  ...this.staffMember,
                  ...this.staffRequest
                };
                return updatedStaffList;
              }
              return currentStaff;
            });

            this.notificationService.showSuccess(
              'Successful',
              'Staff Member Updated'
            );

            this.staffDialog = false;
            this.staffMember = {} as StaffModel;
            this.staffRequest = {} as StaffRequest;
          },
          error: (error) => {
            this.notificationService.showError(
              'Error',
              'Failed to update staff member'
            );
          }
        });
    } else {
      // Create new staff
      this.staffService.createStaff(this.staffRequest)
        .pipe(finalize(() => this.loadingService.stopLoading(this.COMPONENT_ID)))
        .subscribe({
          next: (response: any) => {
            // Add the new staff member with the ID from response
            const newStaffMember: StaffModel = {
              id: response.id || Math.floor(Math.random() * 1000), // Fallback random ID if not provided
              name: this.staffRequest.name,
              email: this.staffRequest.email,
              post: this.staffRequest.post
            };

            this.staff.update(currentStaff => [...currentStaff, newStaffMember]);

            this.notificationService.showSuccess(
              'Successful',
              'Staff Member Created'
            );

            this.staffDialog = false;
            this.staffMember = {} as StaffModel;
            this.staffRequest = {} as StaffRequest;
          },
          error: (error) => {
            this.notificationService.showError(
              'Error',
              'Failed to create staff member'
            );
          }
        });
    }
  }
}
