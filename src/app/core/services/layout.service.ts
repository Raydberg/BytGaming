import { Injectable, effect, signal, computed } from '@angular/core';
import { Subject } from 'rxjs';
import { layoutConfig } from '../interfaces/layout-config.interface';
import { LayoutState } from '../interfaces/layout-state.interface';

interface MenuChangeEvent {
  key: string;
  routeEvent?: boolean;
}

const DARK_MODE_STORAGE_KEY = 'bytgaming-dark-mode';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  constructor() {
    effect(() => {
      const config = this.layoutConfig();
      if (config) {
        this.onConfigUpdate();
      }
    });

    effect(() => {
      const config = this.layoutConfig();

      if (!this.initialized || !config) {
        this.initialized = true;
        return;
      }

      this.handleDarkModeTransition(config);

      localStorage.setItem(DARK_MODE_STORAGE_KEY, JSON.stringify(config.darkTheme));
      this.toggleDarkMode(this.initialConfig);
    });
  }

  private getInitialDarkMode(): boolean {
    try {
      const storedValue = localStorage.getItem(DARK_MODE_STORAGE_KEY);
      return storedValue ? JSON.parse(storedValue) : false;
    } catch (e) {
      return false;
    }
  }

  private initialConfig: layoutConfig = {
    preset: 'Material',
    primary: 'emerald',
    surface: null,
    darkTheme: this.getInitialDarkMode(),
    menuMode: 'static'
  };

  private initialState: LayoutState = {
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false
  };

  // Define signals
  layoutConfig = signal<layoutConfig>(this.initialConfig);
  layoutState = signal<LayoutState>(this.initialState);
  transitionComplete = signal<boolean>(false);

  // Computed values
  theme = computed(() => (this.layoutConfig().darkTheme ? 'light' : 'dark'));
  isSidebarActive = computed(() => this.layoutState().overlayMenuActive || this.layoutState().staticMenuMobileActive);
  isDarkTheme = computed(() => this.layoutConfig().darkTheme);
  getPrimary = computed(() => this.layoutConfig().primary);
  getSurface = computed(() => this.layoutConfig().surface);
  isOverlay = computed(() => this.layoutConfig().menuMode === 'overlay');
  isDesktopDevice = computed(() => window.innerWidth > 991);
  isMobileDevice = computed(() => !this.isDesktopDevice());

  // Subjects for events that need to be observed
  private configUpdate = new Subject<layoutConfig>();
  private overlayOpen = new Subject<any>();
  private menuSource = new Subject<MenuChangeEvent>();
  private resetSource = new Subject<boolean>();

  // Observable streams
  menuSource$ = this.menuSource.asObservable();
  resetSource$ = this.resetSource.asObservable();
  configUpdate$ = this.configUpdate.asObservable();
  overlayOpen$ = this.overlayOpen.asObservable();

  private initialized = false;


  private handleDarkModeTransition(config: layoutConfig): void {
    if ((document as any).startViewTransition) {
      this.startViewTransition(config);
    } else {
      this.toggleDarkMode(config);
      this.onTransitionEnd();
    }
  }

  private startViewTransition(config: layoutConfig): void {
    const transition = (document as any).startViewTransition(() => {
      this.toggleDarkMode(config);
    });

    transition.ready
      .then(() => {
        this.onTransitionEnd();
      })
      .catch(() => { });
  }

  toggleDarkMode(config?: layoutConfig): void {
    const _config = config || this.layoutConfig();
    if (_config.darkTheme) {
      document.documentElement.classList.add('app-dark');
    } else {
      document.documentElement.classList.remove('app-dark');
    }
  }

  private onTransitionEnd() {
    this.transitionComplete.set(true);
    setTimeout(() => {
      this.transitionComplete.set(false);
    });
  }

  onMenuToggle() {
    if (this.isOverlay()) {
      this.layoutState.update((prev) => ({
        ...prev,
        overlayMenuActive: !prev.overlayMenuActive
      }));

      if (this.layoutState().overlayMenuActive) {
        this.overlayOpen.next(null);
      }
    }

    if (this.isDesktopDevice()) {
      this.layoutState.update((prev) => ({
        ...prev,
        staticMenuDesktopInactive: !prev.staticMenuDesktopInactive
      }));
    } else {
      this.layoutState.update((prev) => ({
        ...prev,
        staticMenuMobileActive: !prev.staticMenuMobileActive
      }));

      if (this.layoutState().staticMenuMobileActive) {
        this.overlayOpen.next(null);
      }
    }
  }

  isDesktop() {
    return this.isDesktopDevice();
  }

  isMobile() {
    return this.isMobileDevice();
  }

  onConfigUpdate() {
    this.configUpdate.next(this.layoutConfig());
  }

  onMenuStateChange(event: MenuChangeEvent) {
    this.menuSource.next(event);
  }

  reset() {
    this.resetSource.next(true);
  }
}
