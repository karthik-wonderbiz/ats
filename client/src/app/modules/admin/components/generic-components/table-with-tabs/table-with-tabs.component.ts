import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
} from '@angular/core';
import { EncryptDescrypt } from '../../../../../utils/genericFunction';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table-with-tabs',
  templateUrl: './table-with-tabs.component.html',
  styleUrls: ['./table-with-tabs.component.css'],
})
export class TableWithTabsComponent implements OnInit, OnChanges {
  @Input() tabs: string[] = [];
  @Input() tabNames: string[] = [];
  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Output() filteredDataChange = new EventEmitter<any[]>();
  @Output() tabChanged = new EventEmitter<string>();
  @Output() rowClicked = new EventEmitter<any>();

  activeTab: string = '';
  filteredData: any[] = [];
  isLoaded: boolean = false;

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.tabs && this.tabs.length > 0) {
      this.activeTab = this.tabs[0];
    }
    this.filterData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['tabs']) {
      this.filterData();
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.filterData();
    this.tabChanged.emit(tab);
  }

  filterData(): void {
    this.filteredData = this.data.map((item) => ({
      ...item,
    }));
    this.filteredDataChange.emit(this.filteredData);
      this.isLoaded = true;
  }

  getFilteredData(): any[] {
    return this.filteredData;
  }

  onRowClicked(employee: any) {
    if (employee && employee.userId) {
      console.log(employee.userId);
      const encryptedId = EncryptDescrypt.encrypt(employee.userId.toString());
      this.router.navigate(['/admin/employee-detail', encryptedId]);
    } else {
      console.error('Employee ID is missing or data is incorrect');
    }
  }
}
