import { ChangeDetectionStrategy, Component, inject, HostListener } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'client-layout',
  standalone: true,
  imports: [RouterModule, StyleClassModule, ButtonModule, RippleModule, CommonModule],
  template: `
    <div class="client-layout-wrapper">
      <header [class]="scrolled ? 'glassmorphism-scrolled' : 'glassmorphism'" class="client-layout-header flex justify-between items-center px-4 md:px-8 lg:px-20 py-4 fixed w-full z-50 transition-all duration-300">
        <!-- Logo -->
        <a class="flex items-center" href="#">
            <span class="text-surface-900 dark:text-surface-0 font-medium text-2xl leading-normal mr-4 md:mr-20">SAKAI</span>
        </a>

        <!-- Mobile Menu Button -->
        <a pButton [text]="true" severity="secondary" [rounded]="true" pRipple class="lg:!hidden" pStyleClass="@next" enterClass="hidden" leaveToClass="hidden" [hideOnOutsideClick]="true">
            <i class="pi pi-bars !text-2xl"></i>
        </a>

        <!-- Navigation Menu -->
        <div class="items-center grow justify-between hidden lg:flex absolute lg:static w-full left-0 top-full px-12 lg:px-0 z-20 rounded-border">
            <ul class="list-none p-0 m-0 flex lg:items-center select-none flex-col lg:flex-row cursor-pointer gap-8">
                <li>
                    <a (click)="router.navigate([''], { fragment: 'home' })" pRipple class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                        <span>Home</span>
                    </a>
                </li>
                <li>
                    <a (click)="router.navigate([''], { fragment: 'features' })" pRipple class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                        <span>Features</span>
                    </a>
                </li>
                <li>
                    <a (click)="router.navigate([''], { fragment: 'highlights' })" pRipple class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                        <span>Highlights</span>
                    </a>
                </li>
                <li>
                    <a (click)="router.navigate([''], { fragment: 'pricing' })" pRipple class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                        <span>Pricing</span>
                    </a>
                </li>
            </ul>
            <div class="flex border-t lg:border-t-0 border-surface py-4 lg:py-0 mt-4 lg:mt-0 gap-2">
                <button pButton pRipple label="Login" routerLink="/auth/login" [rounded]="true" [text]="true"></button>
                <button pButton pRipple label="Register" routerLink="/auth/register" [rounded]="true"></button>
            </div>
        </div>
      </header>

      <!-- <div class="header-spacer"></div> -->

      <main class="client-layout-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .glassmorphism {
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .glassmorphism-scrolled {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
    }

    .app-dark .glassmorphism {
      background: rgba(15, 23, 42, 0.2);
      border-bottom: 1px solid rgba(30, 41, 59, 0.2);
    }

    .app-dark .glassmorphism-scrolled {
      background: rgba(15, 23, 42, 0.8);
      border-bottom: 1px solid rgba(30, 41, 59, 0.3);
    }

    .header-spacer {
      height: 80px;
    }

    .client-layout-wrapper {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      overflow-x: hidden;
      width: 100%;
    }

    .client-layout-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      width: 100%;
      align-items: center;
      justify-content: flex-start;
    }

    :host {
      width: 100%;
      display: block;
    }
  `]
})
export class ClientLayoutComponent {
  router = inject(Router);
  scrolled = false;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.scrolled = window.pageYOffset > 50;
  }
}
