import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'hero-widget',
  standalone: true,
  imports: [ButtonModule, RippleModule, ProgressSpinnerModule, TagModule, CommonModule, RouterLink],
  template: `
        <div class="grid grid-nogutter surface-section text-800 px-4 py-8 md:px-6 lg:px-8">
            <div class="col-12 mx-auto lg:col-10">
                <div class="grid flex justify-content-center align-items-center text-center">
                    <div class="col-12 mb-4">
                      <p-tag severity="warn" value="EN CONSTRUCCIÓN" class="text-lg"></p-tag>                    </div>
                    <div class="col-12 mb-4">
                        <h1 class="text-6xl font-bold text-primary mb-3">Sitio en construcción</h1>
                        <span class="text-2xl text-600 block mb-5">Estamos trabajando para ofrecerte una mejor experiencia</span>
                    </div>
                    <div class="col-12 mb-6">
                        <p-progressSpinner [style]="{ width: '80px', height: '80px' }" styleClass="custom-spinner" animationDuration="1.5s"></p-progressSpinner>
                    </div>
                    <div class="col-12 mb-6">
                        <div class="text-xl text-600 line-height-3">
                            Nuestro equipo está trabajando arduamente para crear un sitio impresionante.
                            Mientras tanto, puedes contactarnos o explorar otras secciones disponibles.
                        </div>
                    </div>
                    <div class="col-12 flex justify-content-center">
                        <p-button label="Volver al inicio" icon="pi pi-home" routerLink="/" styleClass="p-button-lg mr-2"></p-button>
                        <p-button label="Contacto" icon="pi pi-envelope" routerLink="/auth/login" styleClass="p-button-lg p-button-outlined"></p-button>
                    </div>
                </div>
            </div>
        </div>
    `,
  styles: [`
        :host ::ng-deep .custom-spinner .p-progress-spinner-circle {
            animation-duration: 1.5s;
            stroke: var(--primary-color);
        }
    `]
})
export class HeroWidget {}
