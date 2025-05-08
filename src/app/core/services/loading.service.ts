import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingState = signal<Record<string, boolean>>({});

  startLoading(componentId: string): void {
    this.loadingState.update(state => ({
      ...state,
      [componentId]: true
    }));
  }

  stopLoading(componentId: string): void {
    this.loadingState.update(state => ({
      ...state,
      [componentId]: false
    }));
  }

  isLoading(componentId: string): boolean {
    return this.loadingState()[componentId] || false;
  }

  getLoadingState(componentId: string) {
    return this.isLoading.bind(this, componentId);
  }
}
