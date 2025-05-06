import { inject, Injectable, signal, computed } from '@angular/core';
import { MessageService } from 'primeng/api';

export interface Notification {
  id: string;
  severity: NotificationSeverity;
  summary: string;
  detail: string;
  life: number;
  sticky: boolean;
  timestamp: number;
}

export type NotificationSeverity = 'success' | 'info' | 'warn' | 'error';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messageService = inject(MessageService);

  private notifications = signal<Notification[]>([]);

  activeNotifications = computed(() => this.notifications());
  successCount = computed(() => this.countBySeverity('success'));
  errorCount = computed(() => this.countBySeverity('error'));
  warningCount = computed(() => this.countBySeverity('warn'));
  infoCount = computed(() => this.countBySeverity('info'));

  showNotification(
    severity: NotificationSeverity,
    summary: string,
    detail: string,
    life: number = 3000,
    sticky: boolean = false
  ): void {
    const notification: Notification = {
      id: this.generateId(),
      severity,
      summary,
      detail,
      life,
      sticky,
      timestamp: Date.now()
    };

    this.messageService.add({
      severity,
      summary,
      detail,
      life,
      sticky,
      key: notification.id
    });

    this.notifications.update(notifications => [
      ...notifications,
      notification
    ]);

    if (!sticky && life > 0) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, life);
    }
  }

  showSuccess(summary: string, detail: string, life: number = 3000): void {
    this.showNotification('success', summary, detail, life);
  }

  showInfo(summary: string, detail: string, life: number = 3000): void {
    this.showNotification('info', summary, detail, life);
  }

  showWarning(summary: string, detail: string, life: number = 3000): void {
    this.showNotification('warn', summary, detail, life);
  }

  showError(summary: string, detail: string, life: number = 3000): void {
    this.showNotification('error', summary, detail, life);
  }

  removeNotification(id: string): void {
    this.messageService.clear(id);
    this.notifications.update(notifications =>
      notifications.filter(notification => notification.id !== id)
    );
  }

  clear(): void {
    this.messageService.clear();
    this.notifications.set([]);
  }

  private countBySeverity(severity: NotificationSeverity): number {
    return this.notifications().filter(n => n.severity === severity).length;
  }

  private generateId(): string {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
