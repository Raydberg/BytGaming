import {ChangeDetectionStrategy, Component, signal, ViewChild} from '@angular/core';
import {CommonModule, CurrencyPipe, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Button, ButtonModule} from 'primeng/button';
import {ConfirmDialog, ConfirmDialogModule} from 'primeng/confirmdialog';
import {Dialog, DialogModule} from 'primeng/dialog';
import {IconField, IconFieldModule} from 'primeng/iconfield';
import {InputIcon, InputIconModule} from 'primeng/inputicon';
import {InputNumber, InputNumberModule} from 'primeng/inputnumber';
import {InputText, InputTextModule} from 'primeng/inputtext';
import {RadioButton, RadioButtonModule} from 'primeng/radiobutton';
import {Rating, RatingModule} from 'primeng/rating';
import {RippleModule} from 'primeng/ripple';
import {Select, SelectModule} from 'primeng/select';
import {Tag, TagModule} from 'primeng/tag';
import {Textarea, TextareaModule} from 'primeng/textarea';
import {ToastModule} from 'primeng/toast';
import {Toolbar, ToolbarModule} from 'primeng/toolbar';
import {Table, TableModule} from 'primeng/table';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Product, ProductService} from '../../../core/services/product.service';

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
  selector: 'app-kardex',
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
    ConfirmDialogModule
  ],
  providers: [ProductService, MessageService, ConfirmationService],
  templateUrl: './kardex.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KardexComponent {
  productDialog: boolean = false;

  products = signal<Product[]>([]);

  product!: Product;

  selectedProducts!: Product[] | null;

  submitted: boolean = false;

  statuses!: any[];

  @ViewChild('dt') dt!: Table;

  exportColumns!: ExportColumn[];

  cols!: Column[];

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
  }

  exportCSV() {
    this.dt.exportCSV();
  }

  ngOnInit() {
    this.loadDemoData();
  }

  loadDemoData() {
    this.productService.getProducts().then((data) => {
      this.products.set(data);
    });

    this.statuses = [
      {label: 'INSTOCK', value: 'instock'},
      {label: 'LOWSTOCK', value: 'lowstock'},
      {label: 'OUTOFSTOCK', value: 'outofstock'}
    ];

    this.cols = [
      {field: 'code', header: 'Code', customExportHeader: 'Product Code'},
      {field: 'name', header: 'Name'},
      {field: 'image', header: 'Image'},
      {field: 'price', header: 'Price'},
      {field: 'category', header: 'Category'}
    ];

    this.exportColumns = this.cols.map((col) => ({title: col.header, dataKey: col.field}));
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.product = {};
    this.submitted = false;
    this.productDialog = true;
  }

  editProduct(product: Product) {
    this.product = {...product};
    this.productDialog = true;
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.products.set(this.products().filter((val) => !this.selectedProducts?.includes(val)));
        this.selectedProducts = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Products Deleted',
          life: 3000
        });
      }
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  deleteProduct(product: Product) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.products.set(this.products().filter((val) => val.id !== product.id));
        this.product = {};
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Deleted',
          life: 3000
        });
      }
    });
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.products().length; i++) {
      if (this.products()[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warn';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return 'info';
    }
  }

  saveProduct() {
    this.submitted = true;
    let _products = this.products();
    if (this.product.name?.trim()) {
      if (this.product.id) {
        _products[this.findIndexById(this.product.id)] = this.product;
        this.products.set([..._products]);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Updated',
          life: 3000
        });
      } else {
        this.product.id = this.createId();
        this.product.image = 'product-placeholder.svg';
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Created',
          life: 3000
        });
        this.products.set([..._products, this.product]);
      }

      this.productDialog = false;
      this.product = {};
    }
  }
}

