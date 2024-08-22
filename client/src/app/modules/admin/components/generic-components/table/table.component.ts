import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})

export class TableComponent {
  @Input() data: any[] = [];
  @Input() columns: { key: string, label: string, subColumns?: { key: string, label: string }[] }[] = [];
  @Output() rowClicked = new EventEmitter<any>();
  @Output() editClicked = new EventEmitter<any>();
  @Output() deleteClicked = new EventEmitter<any>();
  
  isLoaded: boolean = false;

  isObject(value: any): boolean {
    return value && typeof value === 'object' && !Array.isArray(value);
  }

  onRowClick(row: any) {
    this.rowClicked.emit(row);
  }

  onEditClick(row: any) {
    this.editClicked.emit(row);
  }

  onDeleteClick(row: any) {
    this.deleteClicked.emit(row);
  }
}




// import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

// @Component({
//   selector: 'app-table',
//   templateUrl: './table.component.html',
//   styleUrls: ['./table.component.css']
// })
// export class TableComponent implements OnInit, OnChanges {
//   @Input() data: any[] = [];
//   @Input() columns: { key: string, label: string, subColumns?: { key: string, label: string }[] }[] = [];
//   @Output() rowClicked = new EventEmitter<any>();

//   currentPage: number = 1;
//   entriesPerPage: number = 5;
//   totalPages: number = 1;
//   paginatedData: any[] = [];
//   pages: number[] = [];

//   ngOnInit() {
//     this.updatePagination();
//   }

//   ngOnChanges(changes: SimpleChanges) {
//     if (changes['data'] || changes['entriesPerPage']) {
//       this.updatePagination();
//     }
//   }

//   isObject(value: any): boolean {
//     return value && typeof value === 'object' && !Array.isArray(value);
//   }

//   onRowClick(row: any) {
//     this.rowClicked.emit(row);
//   }

//   updatePagination() {
//     this.totalPages = Math.ceil(this.data.length / this.entriesPerPage);
//     this.paginateData();
//     this.generatePages();
//   }

//   paginateData() {
//     const startIndex = (this.currentPage - 1) * this.entriesPerPage;
//     const endIndex = startIndex + this.entriesPerPage;
//     this.paginatedData = this.data.slice(startIndex, endIndex);
//   }

//   changePage(page: number) {
//     if (page > 0 && page <= this.totalPages) {
//       this.currentPage = page;
//       this.paginateData();
//       this.generatePages();
//     }
//   }

//   changeEntriesPerPage(entries: number) {
//     this.entriesPerPage = entries;
//     this.currentPage = 1; // Reset to the first page
//     this.updatePagination();
//   }

//   getMinValue(a: number, b: number): number {
//     return Math.min(a, b);
//   }

//   generatePages() {
//     this.pages = [];
//     const maxPagesToShow = 5;
//     const pagesToShow = 3; // Number of pages to show around current page

//     if (this.totalPages <= maxPagesToShow) {
//       for (let i = 1; i <= this.totalPages; i++) {
//         this.pages.push(i);
//       }
//     } else {
//       this.pages.push(1);

//       if (this.currentPage > pagesToShow + 2) {
//         this.pages.push(-1); // Representing "..."
//       }

//       const startPage = Math.max(2, this.currentPage - pagesToShow);
//       const endPage = Math.min(this.totalPages - 1, this.currentPage + pagesToShow);

//       for (let i = startPage; i <= endPage; i++) {
//         this.pages.push(i);
//       }

//       if (this.currentPage < this.totalPages - (pagesToShow + 1)) {
//         this.pages.push(-1); // Representing "..."
//       }

//       this.pages.push(this.totalPages);
//     }
//   }

//   goToPrevious10Pages() {
//     const newPage = Math.max(1, this.currentPage - 10);
//     this.changePage(newPage);
//   }

//   goToNext10Pages() {
//     const newPage = Math.min(this.totalPages, this.currentPage + 10);
//     this.changePage(newPage);
//   }
// }

