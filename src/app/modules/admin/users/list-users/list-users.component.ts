import { ChangeDetectionStrategy, Component, inject, signal, ViewChild, effect } from '@angular/core';
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
import { Table, TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AdminUserService } from '../../../../core/services/admin/admin-user.service';
import { UserModel } from '../../../../core/model/user.model';
import { RegisterRequest } from '../../../../core/interfaces/auth-http.interface';
import { finalize } from 'rxjs';
import { LoadingService } from '../../../../core/services/loading.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { TableSkeletonComponent } from '../../../../shared/components/skeletors/table-skeleton.component';
import { SelectButtonModule } from 'primeng/selectbutton';
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
  selector: 'app-list-users',
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
    TableSkeletonComponent,
    SelectButtonModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './list-users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListUsersComponent {
  // Services
  private userService = inject(AdminUserService);
  private notificationService = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);
  private loadingService = inject(LoadingService);

  // Component ID for loading state tracking
  private readonly COMPONENT_ID = 'users-list';

  // State management
  userDialog: boolean = false;
  users = signal<UserModel[]>([]);
  loading = this.loadingService.getLoadingState(this.COMPONENT_ID);

  user: UserModel | null = null;
  userRequest: RegisterRequest = {} as RegisterRequest;
  selectedUsers: UserModel[] | null = null;
  submitted: boolean = false;

  roles = [
    { label: 'Administrador', value: 'ADMIN' },
    { label: 'Usuario', value: 'USER' }
  ];

  @ViewChild('dt') dt!: Table;

  exportColumns!: ExportColumn[];
  cols!: Column[];

  constructor() {
    effect(() => {
      this.loadUsers();
    });
  }

  loadUsers() {
    this.loadingService.startLoading(this.COMPONENT_ID);

    this.userService.getAllUsers()
      .pipe(finalize(() => this.loadingService.stopLoading(this.COMPONENT_ID)))
      .subscribe({
        next: (data: any) => {
          this.users.set(data);
        },
        error: (error) => {
          console.error("Error loading users data:", error);
          this.notificationService.showError(
            'Error',
            'No se pudieron cargar los usuarios. Por favor, inténtelo de nuevo más tarde.'
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
      { field: 'lastName', header: 'Apellido' },
      { field: 'email', header: 'Email' },
      { field: 'role.roleEnum', header: 'Rol' },
      { field: 'enabled', header: 'Estado' }
    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.user = null;
    this.userRequest = {
      name: '',
      lastName: '',
      email: '',
      password: '',
      role: 'USER'
    };
    this.submitted = false;
    this.userDialog = true;
  }

  editUser(user: UserModel) {
    this.user = { ...user };
    this.userRequest = {
      name: user.name || '',
      lastName: user.lastName || '',
      email: user.email,
      role: user.role.roleEnum as "ADMIN" | "USER"
    };
    this.userDialog = true;
  }

  deleteSelectedUsers() {
    this.confirmationService.confirm({
      message: '¿Está seguro de eliminar los usuarios seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.selectedUsers) {
          this.loadingService.startLoading(this.COMPONENT_ID);

          const deletePromises = this.selectedUsers.map(user =>
            this.userService.deleteUser(user.id)
          );

          Promise.all(deletePromises)
            .then(() => {
              this.users.update(currentUsers =>
                currentUsers.filter(u => !this.selectedUsers?.some(selected => selected.id === u.id))
              );

              this.selectedUsers = null;
              this.notificationService.showSuccess(
                'Éxito',
                'Usuarios eliminados correctamente'
              );
            })
            .catch((error) => {
              console.error("Error deleting users:", error);
              this.notificationService.showError(
                'Error',
                'No se pudieron eliminar uno o más usuarios'
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
    this.userDialog = false;
    this.submitted = false;
  }

  deleteUser(user: UserModel) {
    this.confirmationService.confirm({
      message: '¿Está seguro de eliminar el usuario ' + user.email + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loadingService.startLoading(this.COMPONENT_ID);

        this.userService.deleteUser(user.id)
          .pipe(finalize(() => this.loadingService.stopLoading(this.COMPONENT_ID)))
          .subscribe({
            next: () => {
              this.users.update(currentUsers =>
                currentUsers.filter(u => u.id !== user.id)
              );

              this.notificationService.showSuccess(
                'Éxito',
                'Usuario eliminado correctamente'
              );
            },
            error: (error) => {
              console.error("Error deleting user:", error);
              this.notificationService.showError(
                'Error',
                'No se pudo eliminar el usuario'
              );
            }
          });
      }
    });
  }

  getSeverity(enabled: boolean) {
    return enabled ? 'success' : 'danger';
  }

  getStatusText(enabled: boolean) {
    return enabled ? 'Activo' : 'Inactivo';
  }

  saveUser() {
    this.submitted = true;

    if (!this.userRequest.email?.trim() ||
        (!this.user && !this.userRequest.password?.trim())) {
      return;
    }

    this.loadingService.startLoading(this.COMPONENT_ID);

    if (this.user) {
      // Update existing user
      this.userService.updateUser(this.user.id, this.userRequest)
        .pipe(finalize(() => this.loadingService.stopLoading(this.COMPONENT_ID)))
        .subscribe({
          next: () => {
            // Update local state with optimistic update
            this.users.update(currentUsers => {
              return currentUsers.map(u => {
                if (u.id === this.user?.id) {
                  return {
                    ...u,
                    name: this.userRequest.name || u.name,
                    lastName: this.userRequest.lastName || u.lastName,
                    email: this.userRequest.email || u.email,
                    role: { ...u.role, roleEnum: this.userRequest.role || u.role.roleEnum }
                  };
                }
                return u;
              });
            });

            this.notificationService.showSuccess(
              'Éxito',
              'Usuario actualizado correctamente'
            );

            this.userDialog = false;
            this.user = null;
            this.userRequest = {} as RegisterRequest;
          },
          error: (error) => {
            console.error("Error updating user:", error);
            this.notificationService.showError(
              'Error',
              'No se pudo actualizar el usuario'
            );
          }
        });
    } else {
      // This would typically be handled by an auth service or specific endpoint
      // Since we don't have a specific register endpoint exposed here, this is a placeholder
      this.notificationService.showInfo(
        'Información',
        'La creación de usuarios debe realizarse a través del registro'
      );
      this.userDialog = false;
    }
  }
}
