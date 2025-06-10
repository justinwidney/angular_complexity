import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import {ChangeDetectionStrategy} from '@angular/core';
import {MatChipsModule} from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { FilterSection } from './types';
import { ChartComponent } from '../chart/chart.component';
import { ChartSignalService } from '../chart/chart.service';
import { FilterService } from '../filter/filter.service';
import { AccordionFiltersComponent } from '../filter/accordian-fitlers.component';
import { ChipListComponent } from '../filter/chip-list.component';

import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ProductSpaceChartComponent } from '../productspace/product-space-chart.component';
import { DisplayMode, FeasibleEventData, FilterType, GroupingType } from '../feasible/feasible-chart-model';
import { ChartCoordinationService } from '../service/chart-coordination.service';
import { Subject, takeUntil } from 'rxjs';
import { FeasibleChartComponent } from '../feasible/feasible-chart.component';

interface NodeData {
  node: any;
  data: any;
}

interface ChartStats {
  totalSum: number;
  nodeCount: number;
  dataCount: number;
}

interface GroupLabel {
  name: string;
  text: string;
  x: number;
  y: number;
  fontSize?: number;
  // ... other properties
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [MatChipsModule, CommonModule,  MatButtonToggleModule, ProductSpaceChartComponent, FeasibleChartComponent ],
  standalone: true,
  encapsulation: ViewEncapsulation.None
})

export class HomeComponent implements OnInit {

  selectedNode: NodeData | null = null;
  hoveredNode: NodeData | null = null;
  chartStats: ChartStats | null = null;
  showLabels: boolean = true; // Control group labels visibility
  customLabels?: Partial<GroupLabel>[] = undefined; // Use default labels
  selectedChartType: string = 'ProductSpace'; // Default chart type
  

  //
  currentRegion: string = '';
  currentYear: string = '';
  currentGrouping: GroupingType = GroupingType.HS4;
  currentDisplayMode: DisplayMode = DisplayMode.DEFAULT;
  currentFilterType: FilterType = FilterType.ALL;

  //
    private destroy$ = new Subject<void>();

  //
  @ViewChild('productSpaceChart') productSpaceChart: any;
  @ViewChild('feasibleChart') feasibleChart: any;

    // Feasible chart properties
  selectedFeasiblePoint: FeasibleEventData | null = null;
  feasibleStats: { dataCount: number, eci: number } | null = null;
    
 onChartTypeChange(event: MatButtonToggleChange): void {
    this.selectedChartType = event.value;
    console.log('Chart type changed to:', event.value);

    
    // Call appropriate chart rendering method based on selection
    //this.renderSelectedChart();
  }



  readonly maxFilters = 2;
  selectedValue: string = 'recent'; // Default value


  filterSections: FilterSection[] = [
    {
      heading: 'NAICS Industries',
      items: [
        { label: 'Agriculture, forestry, fishing and hunting', value: 'Agriculture, forestry, fishing and hunting', selected: false },
        { label: 'Mining, quarrying, and oil and gas extraction', value: 'Mining, quarrying, and oil and gas extraction', selected: false },
        { label: 'Construction', value: 'Construction', selected: false },
        { label: 'Manufacturing', value: 'Manufacturing', selected: false },
        { label: 'Wholesale trade', value: 'Wholesale trade', selected: false },
        { label: 'Retail trade', value: 'Retail trade', selected: false },
        { label: 'Transportation and warehousing', value: 'Transportation and warehousing', selected: false },
        { label: 'Information and cultural industries', value: 'Information and cultural industries', selected: false },
        { label: 'Finance and insurance', value: 'Finance and insurance', selected: false },
        { label: 'Real estate and rental and leasing', value: 'Real estate and rental and leasing', selected: false },
        { label: 'Professional, scientific and technical services', value: 'Professional, scientific and technical services', selected: false },
        { label: 'Administrative and support, waste management and remediation services', value: 'Administrative and support, waste management and remediation services', selected: false },
        { label: 'Health care and social assistance', value: 'Health care and social assistance', selected: false },
        { label: 'Arts, entertainment and recreation', value: 'Arts, entertainment and recreation', selected: false },
        { label: 'Accommodation and food services', value: 'Accommodation and food services', selected: false },
        { label: 'Other services (except public administration)', value: 'Other services (except public administration)', selected: false }
      ]
    },
    {
      heading: 'Business Size',
      items: [
        { label: 'All employment sizes', value: 'All employment sizes', selected: false },
        { label: '1 to 4 employees', value: '1 to 4 employees', selected: false },
        { label: '5 to 19 employees', value: '5 to 19 employees', selected: false },
        { label: '20 to 99 employees', value: '20 to 99 employees', selected: false },
        { label: '100 or more employees', value: '100 or more employees', selected: false }
      ]
    },
    {
      heading: 'Business Type',
      items: [
        { label: 'All businesses or organizations', value: 'All businesses or organizations', selected: false },
        { label: 'Government agencies', value: 'Government agencies', selected: false },
        { label: 'Private sector businesses', value: 'Private sector businesses', selected: false }
      ]
    },
    {
      heading: 'Age of Business',
      items: [
        { label: 'All ages', value: 'All ages', selected: false },
        { label: '2 years or less', value: '2 years or less', selected: false },
        { label: '3 to 10 years', value: '3 to 10 years', selected: false },
        { label: '11 to 20 years', value: '11 to 20 years', selected: false },
        { label: 'More than 20 years', value: 'More than 20 years', selected: false }
      ]
    },
    {
      heading: 'Geography',
      items: [
        { label: 'All geographies', value: 'All geographies', selected: false },
        { label: 'Urban', value: 'Urban', selected: false },
        { label: 'Rural', value: 'Rural', selected: false }
      ]
    },
    {
      heading: 'Majority Ownership',
      items: [
        { label: 'All ownerships', value: 'All ownerships', selected: false },
        { label: 'Woman', value: 'Woman', selected: false },
        { label: 'First Nations, Métis, or Inuit', value: 'First Nations, Métis, or Inuit', selected: false },
        { label: 'Immigrant', value: 'Immigrant', selected: false },
        { label: 'Visible minority', value: 'Visible minority', selected: false },
        { label: 'Person with a disability', value: 'Person with a disability', selected: false },
        { label: 'LGBTQ2', value: 'LGBTQ2', selected: false }
      ]
    },
    {
      heading: 'Visible Minority',
      items: [
        { label: 'All visible minorities', value: 'All visible minorities', selected: false },
        { label: 'South Asian', value: 'South Asian', selected: false },
        { label: 'Chinese', value: 'Chinese', selected: false },
        { label: 'Black', value: 'Black', selected: false },
        { label: 'Filipino', value: 'Filipino', selected: false },
        { label: 'Latin American', value: 'Latin American', selected: false },
        { label: 'Arab', value: 'Arab', selected: false },
        { label: 'Southeast Asian', value: 'Southeast Asian', selected: false },
        { label: 'West Asian', value: 'West Asian', selected: false },
        { label: 'Korean', value: 'Korean', selected: false },
        { label: 'Japanese', value: 'Japanese', selected: false },
        { label: 'Other visible minority', value: 'Other visible minority', selected: false },
        { label: 'Preferred not to say', value: 'Preferred not to say', selected: false }
      ]
    },
    {
      heading: 'Business Activity',
      items: [
        { label: 'All Business or Organization Activities', value: 'All Business or Organization Activities', selected: false },
        { label: 'Exported goods', value: 'Exported goods', selected: false },
        { label: 'Exported services', value: 'Exported services', selected: false },
        { label: 'Made investments outside of Canada', value: 'Made investments outside of Canada', selected: false },
        { label: 'Sold goods in Canada, resold outside', value: 'Sold goods in Canada, resold outside', selected: false },
        { label: 'Imported goods', value: 'Imported goods', selected: false },
        { label: 'Imported services', value: 'Imported services', selected: false },
        { label: 'Relocated into Canada', value: 'Relocated into Canada', selected: false },
        { label: 'Relocated from Canada', value: 'Relocated from Canada', selected: false },
        { label: 'Other international activities', value: 'Other international activities', selected: false },
        { label: 'None or other activity', value: 'None or other activity', selected: false }
      ]
    }
  ];

  constructor(private router: Router, 
    private chartService: ChartSignalService, 
    public filterSvc: FilterService,
    private coordinationService: ChartCoordinationService
  ) 
    {}
  

  ngOnInit(): void {
    //this.sendData();
    this.chartService.initialize();

       this.coordinationService.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.currentRegion = state.selectedRegion;
        this.currentYear = state.selectedYear;
        this.currentGrouping = state.selectedGrouping;
        this.currentDisplayMode = state.displayMode;
        this.currentFilterType = state.filterType;
      });
   }


   





  handleDropdownRemove(labelOrEvent: string | Event) {

      console.log('handleDropdownRemove', labelOrEvent);


      const label = typeof labelOrEvent === 'string'
        ? labelOrEvent
        : (labelOrEvent as unknown as string);
        this.filterSvc.removeAccordion(label);

        for (const section of this.filterSections) {
          const it = section.items.find(i => i.value === label);
          if (it) {
            it.selected = false;
            break;
          }
        }

    }

  // TODO: Implement the logic to handle the selected filters and update the chart data accordingly
   onChange(event: Event, type: string): void {


    console.log('Selected value:', (event as CustomEvent).detail.value, type);

      if(type === 'geoA') {
        this.chartService.setDropdownA((event as CustomEvent).detail.value);
        this.filterSvc.setDropdown('geoA', (event as CustomEvent).detail.value);

      }
      if(type === 'geoB') {
        this.chartService.setDropdownB((event as CustomEvent).detail.value);
        this.filterSvc.setDropdown('geoB', (event as CustomEvent).detail.value);
      }
      if(type === 'survey') {
        this.chartService.setSurvey((event as CustomEvent).detail.value);
      }
     
    }

     // Event handlers for chart interactions
  onNodeSelected(event: {node: any, data: any}): void {
    console.log('Node selected:', event);
        this.selectedNode = event;
    
  }

  onNodeHovered(event: {node: any, data: any}): void {
    console.log('Node hovered:', event);
        this.hoveredNode = event;
  }

  onRowHighlight(productId: number): void {
    console.log('Highlighting product in table:', productId);
    
    // Add your table highlighting logic here
    // Example: this.dataTableService.highlightRow(productId);
  }

   clearSelection(): void {
    this.selectedNode = null;
    if (this.productSpaceChart) {
      this.productSpaceChart.clearSelections();
    }
  }

    // Feasible Chart Event Handlers
  onFeasiblePointSelected(event: {node: any, data: any}): void {
    console.log('Feasible point selected:', event);
    
  }

  onFeasiblePointHovered(event: {node: any, data: any}): void {
    console.log('Feasible point hovered:', event);
  }


}
