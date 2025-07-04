// eci-generic-table.component.ts

import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { UnifiedDataService } from '../service/chart-data-service';
import { Subject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';

// jQuery + DataTables imports
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-buttons';
import 'datatables.net-buttons/js/buttons.html5.js';
import 'datatables.net-buttons/js/buttons.print.js';

@Component({
  selector: 'app-table',
  template: `
  <table id="example" #example class="display" width="100%"></table>
`,
  styleUrls: ['./data-table.component.scss'],
})
export class TableComponent implements AfterViewInit, OnDestroy {
  @ViewChild('example') tableRef!: ElementRef<HTMLTableElement>;

  private dtApi: any | null = null;
  private destroy$ = new Subject<void>();

  constructor(private uds: UnifiedDataService) {}

  ngAfterViewInit(): void {

     this.uds.currentSelection$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(({ region, year }) =>
          this.uds.getProductSpaceData(region as any)
        )
      )
      .subscribe(({ groupedData }) => this.renderTable(groupedData));
  }

  private renderTable(data: any[]): void {


    if (this.dtApi) {
      this.dtApi.clear();
      this.dtApi.rows.add(data);
      this.dtApi.draw(false);
      return;
    }

    // first time: initialize
    this.dtApi = $(this.tableRef.nativeElement).DataTable({
      dom: 'Bfrtip',
      data,
      columns: [
        { data: 'Date',        title: 'Year' },
        { data: 'product',     title: 'Product',    className: 'dt-body-right',  },
        { data: 'description', title: 'Description',className: 'dt-body-right', },
        { data: 'Value',       title: 'Value',      className: 'dt-body-right',  },
        { data: 'rca',         title: 'RCA',        className: 'dt-body-right', },
        { data: 'distance',         title: 'Distance',    className: 'dt-body-right',},
        { data: 'pci',         title: 'PCI',        className: 'dt-body-right',  },
      ],
      columnDefs: [
        {
          targets: [4,5,6],
          render: (val: number) => val.toFixed(3)
        },
        {
          targets: 3,
          render: (val: number) =>
            val.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        },
        {
          targets: 1,
          render: (val: any) => String(val).padStart(4, '0')
        },
        {
          targets: 0,
          render: (val: string) => {
            const dt = new Date(val);
            return dt.toLocaleDateString('en-CA', { year: 'numeric' });
          }
        }
      ],
      order: [[6, 'asc'], [3, 'desc']],
      paging: true,
      pageLength: 10,
          ordering: true,
      pagingType: 'simple_numbers',
      buttons: [
        {
          extend: 'collection',
          text: 'Export',
          buttons: ['copy', 'excel', 'csv', 'pdf', 'print']
        }
      ]
    });


  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.dtApi) {
      this.dtApi.destroy();
    }
  }
}
