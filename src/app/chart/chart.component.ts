// chart.component.ts
import { Component, OnInit, OnDestroy, NgZone, effect, EffectRef } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { ChartFilters, ChartSignalService } from './chart.service';
import { FilterService } from '../filter/filter.service';




interface FilteredDataSet {
  data: ChartData[];
  data2: ChartData[];
  data3: ChartData[];
}

interface ChartData {
  Date: number;
  Value: number;
  Characteristics: string;
  'Expected change over the next three months': string;
  GeoName: string;
  QtrDate: string;
  'Business or organization information': string;
}


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  standalone: true,

})



export class ChartComponent implements OnInit, OnDestroy {


  private textButtonMap: { [key: string]: string } = {
    'All businesses or organizations': 'Business or organization type, all businesses or organizations',
    'All employment sizes': 'Business or organization size of employment, all employment sizes',
    'All ages': 'Age of business or organization, all ages',
    '2 years or less': 'Age of business or organization, 2 years or less',
    '3 to 10 years': 'Age of business or organization, 3 to 10 years old',
    '11 to 20 years': 'Age of business or organization, 11 to 20 years old',
    'More than 20 years': 'Age of business or organization, more than 20 years old',
    'All geographies': 'Geography, all geography',
    'All ownerships': 'Majority ownership, all ownerships',
    'Woman': 'Majority ownership, woman',
    'First Nations, Métis, or Inuit': 'Majority ownership, First Nations, MÃ©tis or Inuit',
    'First Nations, MÃ©tis or Inuit': 'Majority ownership, First Nations, MÃ©tis or Inuit',
    'Immigrant': 'Majority ownership, immigrant to Canada',
    'Person with a disability': 'Majority ownership, person with a disability',
    'Visible minority': 'Majority ownership, visible minority',
    'Visible Minority, n.i.e.': 'Majority ownership, visible minority',
    'LGBTQ2': 'Majority ownership, LGBTQ2 people',
    'All visible minorities': 'Ownership by visible minority, all visible minorities',
    'South Asian': 'Ownership by visible minority, South Asian',
    'Chinese': 'Ownership by visible minority, Chinese',
    'Black': 'Ownership by visible minority, Black',
    'Filipino': 'Ownership by visible minority, Filipino',
    'Arab': 'Ownership by visible minority, Arab',
    'Southeast Asian': 'Ownership by visible minority, Southeast Asian',
    'Latin American': 'Ownership by visible minority, Latin American',
    'West Asian': 'Ownership by visible minority, West Asian',
    'Korean': 'Ownership by visible minority, Korean',
    'Japanese': 'Ownership by visible minority, Japanese',
    'Other visible minority': 'Ownership by visible minority, other visible minority',
    "Preferred not to say": 'Ownership by visible minority, preferred not to say',
    'All Business or Organization Activities': 'Business or organization activity in the last 12 months, all business or organization activities',
    'Exported goods': 'Exported goods outside of Canada',
    'Exported services': 'Exported services outside of Canada',
    'Made investments': 'Made investments outside of Canada',
    'Sold goods in Canada, resold outside': 'Sold goods to businesses in Canada who then resold them outside of Canada',
    'Imported goods': 'Imported goods from outside of Canada',
    'Imported services': 'Imported services from outside of Canada',
    'Relocated into Canada': 'Relocated any business or organizational activities or employees from another country into Canada',
    'Relocated from Canada': 'Relocated any business or organizational activities or employees from Canada to another country',
    'Other international activities': 'Engaged in other international business activities',
    'None or other activity': 'Business or organization activity, none or other'
  }


  private root!: am5.Root;
  private chart!: am5xy.XYChart;
  private seriesList: am5xy.LineSeries[] = [];
  private legend!: am5.Legend;
  private loadingIndicator!: am5.Container;
  private hourglassAnimation!: any;

  // Raw data storage
  private rawData: any[] = [];
  private rawDataGeoB: any[] = [];

  // Processed data
  private data: any[] = [];
  private data2: any[] = [];
  private data3: any[] = [];
  private bulletDate!: Date;

  private albertaApi = 'https://api.economicdata.alberta.ca/api/data?code=19bea977-be6f-47d3-82a0-4304560c60fa';
  private  BCApi = 'https://api.economicdata.alberta.ca/api/data?code=7ff94fbb-4b5d-4a0d-b71f-0f4c82280367'
  private  ManApi = 'https://api.economicdata.alberta.ca/api/data?code=62039d61-fca1-42ff-99d4-3b20e616cc38'
  private  NBApi = 'https://api.economicdata.alberta.ca/api/data?code=d311e377-f4cb-41c9-8e1e-5a8afa6d5dd9'
  private  NFLApi = 'https://api.economicdata.alberta.ca/api/data?code=d8729741-e5b0-432b-acbf-5529f8d12988'
  private  NSApi = 'https://api.economicdata.alberta.ca/api/data?code=de92d6d0-0810-4139-85f1-5888870fcf6c'
  private  ONApi = 'https://api.economicdata.alberta.ca/api/data?code=79a2f43a-d931-4e54-b526-8bd605f96ab3'
  private  PEIA  = 'https://api.economicdata.alberta.ca/api/data?code=ae84dd10-ca39-4100-a9b7-db53f29e2644'
  private  QCApi = 'https://api.economicdata.alberta.ca/api/data?code=b93e63f3-2251-42c5-b9e9-0b127befe1fe'
  private  SKApi = 'https://api.economicdata.alberta.ca/api/data?code=6e61bbab-8917-4bb8-ab3d-46561fd912bb'
  private  CANApi = 'https://api.economicdata.alberta.ca/api/data?code=e42abd5c-5531-47f2-940d-859da6121b5c'


  private lastGeoB: string | null = null;
  private lastGeoA: string | null = 'Alberta';

  private apiMap: Record<string, string> = {
    'Alberta': this.albertaApi,
    'British Columbia': this.BCApi,
    'Manitoba': this.ManApi,
    'New Brunswick': this.NBApi,
    'Newfoundland and Labrador': this.NFLApi,
    'Nova Scotia': this.NSApi,
    'Ontario': this.ONApi,
    'Prince Edward Island': this.PEIA,
    'Quebec': this.QCApi,
    'Saskatchewan': this.SKApi,
    'Canada': this.CANApi
  }
  

  constructor(private zone: NgZone, 
    private http: HttpClient, 
    private chartService: ChartSignalService,
    private filterService : FilterService
  
  ) {}

  ngOnInit(): void {

    this.zone.runOutsideAngular(() => {
      this.createChart();
    });

    this.fetchData(); 
  }

  ngOnDestroy(): void {
    // Clean up chart when the component is removed
    if (this.root) {
      this.root.dispose();
    }

    

  }

  private effectRef: EffectRef = effect(() => {

    const { geoA, geoB, survey, display } = this.chartService.filters() as ChartFilters;
    const dropdowns = this.filterService.dropdownChips();
    const accordions = this.filterService.accordionChips();


    console.log("Effect Triggered with Filters:", geoA, geoB, survey, display, dropdowns, accordions);

    const refreshChartData = {
      geoA: geoA,
      geoB: geoB,
      survey: survey,
      display: display,
      dropdowns: dropdowns,
      accordions: accordions
    }


    this.refreshChart(refreshChartData);
  });

  private createLoadingIndicator(): void {
    this.loadingIndicator = this.root.container.children.push(am5.Container.new(this.root, {
      width: am5.p100,
      height: am5.p100,
      layer: 1000,
      background: am5.Rectangle.new(this.root, {
        fill: am5.color(0xffffff),
        fillOpacity: 0.7
      })
    }));
    
    this.loadingIndicator.children.push(am5.Label.new(this.root, {
      text: "Loading...",
      fontSize: 25,
      x: am5.p50,
      y: am5.p50,
      centerX: am5.p50,
      centerY: am5.p50
    }));
    
    const hourglass = this.loadingIndicator.children.push(am5.Graphics.new(this.root, {
      width: 32,
      height: 32,
      fill: am5.color(0x000000),
      x: am5.p50,
      y: am5.p50,
      centerX: am5.p50,
      centerY: am5.p50,
      dy: -45,
      svgPath: "M12 5v10l9 9-9 9v10h24V33l-9-9 9-9V5H12zm20 29v5H16v-5l8-8 8 8zm-8-12-8-8V9h16v5l-8 8z"
    }));
    
    this.hourglassAnimation = hourglass.animate({
      key: "rotation",
      to: 180,
      loops: Infinity,
      duration: 2000,
      easing: am5.ease.inOut(am5.ease.cubic)
    });
    
    // Initially hide the loading indicator
    this.hideLoading();
  }
  
  private showLoading(): void {
    if (this.loadingIndicator) {
      this.hourglassAnimation.play();
      this.loadingIndicator.show();
    }
  }
  
  private hideLoading(): void {
    if (this.loadingIndicator) {
      this.hourglassAnimation.pause();
      this.loadingIndicator.hide();
    }
  }

  private createChart(): void {

    this.root = am5.Root.new("chartdiv");
    this.root.setThemes([am5themes_Animated.new(this.root)]);

    this.createLoadingIndicator();


    this.chart = this.root.container.children.push(
      am5xy.XYChart.new(this.root, {
        panX: false,
        panY: false,
        pinchZoomX: true,
        paddingLeft: 0,
        paddingRight: 15,
        marginRight: 15,
        marginTop: 35,
        paddingTop: 35,
        width: am5.percent(100),
      })
    );

    // Add cursor
    const cursor = this.chart.set("cursor", am5xy.XYCursor.new(this.root, {
      behavior: "none"
    }));
    cursor.lineY.set("visible", false);

    // Create axes
    const xAxis = this.chart.xAxes.push(
      am5xy.DateAxis.new(this.root, {

        baseInterval: { timeUnit: "month", count: 3 },
        
        tooltipDateFormat: "Qq yyyy",
        renderer: am5xy.AxisRendererX.new(this.root, {
          minorGridEnabled: true,
          minGridDistance: 50,
          strokeOpacity: 0,
        }),
        tooltip: am5.Tooltip.new(this.root, {})
      })
    );

    const xRenderer = xAxis.get("renderer");
    xRenderer.grid.template.setAll({
      location: 0,
      stroke: am5.color(0xFFFFFF),
    });

    const yAxis = this.chart.yAxes.push(
      am5xy.ValueAxis.new(this.root, {
        renderer: am5xy.AxisRendererY.new(this.root, {
          pan: "zoom"
        })
      })
    );

    // Set date formats
    if (xAxis) {
      const dateFormats = xAxis.get("dateFormats");
      if (dateFormats) {
        dateFormats["month"] = "Qq yyyy";
      }
      const periodChangeDateFormats = xAxis.get("periodChangeDateFormats");
      if (periodChangeDateFormats) {
        periodChangeDateFormats["month"] = "Qq yyyy";
      }
      const tooltipDateFormats = xAxis.get("tooltipDateFormats");
      if (tooltipDateFormats) {
        tooltipDateFormats["month"] = "Qq yyyy";
      }
    }

    console.log("Chart Layout Created Successfully")


  }

  private fetchData(): void {

    const apiUrl = this.apiMap['Alberta'] || 'https://api.economicdata.alberta.ca/api/data?code=19bea977-be6f-47d3-82a0-4304560c60fa';
    
    this.showLoading();
    this.http.get<any[]>(apiUrl).subscribe(places => {
      this.rawData = places;
      this.addSeries();
      this.processData(places); // Initial Data Processing
      this.updateChartSeries();
      this.hideLoading();

    });
  }

  private processData(places: any[]): void {
    const data_filter = places.filter(element => element.GeoName == "Alberta");
    const filtered = data_filter.filter(element => element.Characteristics == "Geography, all geography");
    const business_data = filtered.filter(element => 
      element['Business or organization information'] == "Business or organization information, number of employees"
    );

    const processedData = this.threeDataFunctions(business_data);
    this.data = processedData.data;
    this.data2 = processedData.data2;
    this.data3 = processedData.data3;

    console.log("Processed Data:", this.data, this.data2, this.data3);

    // Find the latest date for bullets
    this.bulletDate = new Date(Math.max.apply(null, business_data.map(e => new Date(e.Date).getTime())));
    this.bulletDate = new Date(this.bulletDate.getFullYear(), this.bulletDate.getMonth() - 3, 1);
  }

  private threeDataFunctions(dataIn: any[]): FilteredDataSet {
    const d1 = dataIn.filter(element => 
      element['Expected change over the next three months'] == "Expected change over the next three months, increase"
    );
    const d2 = dataIn.filter(element => 
      element['Expected change over the next three months'] == "Expected change over the next three months, stay about the same"
    );
    const d3 = dataIn.filter(element => 
      element['Expected change over the next three months'] == "Expected change over the next three months, decrease"
    );

    // Process dates
    for (let i = 0; i < d1.length; i++) {
      if (d1[i]) d1[i].Date = new Date(d1[i].Date).getTime();
      if (d2[i]) d2[i].Date = new Date(d2[i].Date).getTime();
      if (d3[i]) d3[i].Date = new Date(d3[i].Date).getTime();
    }

    // Sort by date
    const sortedD1 = d1.sort((a, b) => a.Date - b.Date);
    const sortedD2 = d2.sort((a, b) => a.Date - b.Date);
    const sortedD3 = d3.sort((a, b) => a.Date - b.Date);

    return { data: sortedD1, data2: sortedD2, data3: sortedD3 };
  }


  private addSeries(): void {
    this.zone.runOutsideAngular(() => {


      this.seriesList.push(this.createSeries("Increase", this.data, am5.color(0x00aad2)));
      this.seriesList.push(this.createSeries("Stay the same", this.data2, am5.color(0x77b800)));
      this.seriesList.push(this.createSeries("Decrease", this.data3, am5.color(0xedb700)));
      
      this.seriesList.push(this.createSeries("Increase 2", [], am5.color(0x006c86)))
      
      this.seriesList.push(this.createSeries("Stay the same 2", [], am5.color(0x4d6f00)))
      this.seriesList.push(this.createSeries("Decrease 2", [], am5.color(0x8E6D00)))

      //this.seriesList[3].hide();
      //this.seriesList[4].hide();
     //this.seriesList[5].hide();

      this.addBullets();


      this.addLegend();
      
      // Make stuff animate on load
      this.seriesList.forEach(series => series.appear(1000));
      this.chart.appear(1000, 100);
    });
  }

  private createSeries(name: string, data: any[], color: am5.Color): am5xy.LineSeries {
    const series = this.chart.series.push(
      am5xy.LineSeries.new(this.root, {
        name: name,
        xAxis: this.chart.xAxes.getIndex(0)!,
        yAxis: this.chart.yAxes.getIndex(0)!,
        valueYField: "Value",
        valueXField: "Date",
        tooltip: am5.Tooltip.new(this.root, {
          labelText: "{valueY}% " + name
        })
      })
    );

    series.set("stroke", color);
    series.set("fill", color);
    
    series.strokes.template.setAll({
      strokeWidth: 4
    });

    series.data.setAll(data);
    
    return series;
  }

  private addBullets(): void {
    let validatedCount = 0;
    const totalSeries = this.seriesList.length;
    
    var color_map = { 
      "Increase": 0x00aad2, 
      "Stay the same": 0x77b800, 
      "Decrease": 0xedb700, 
      "Net Increase": 0x00aad2, 
      "Increase 2": 0x006c86, 
      "Stay the same 2": 0x4d6f00, 
      "Decrease 2": 0x8E6D00, 
    }
    
    // Add bullets at the latest date point for each series
    this.seriesList.forEach(series => {
      series.events.once("datavalidated", () => {
        const xAxis = this.chart.xAxes.getIndex(0) as am5xy.DateAxis<am5xy.AxisRendererX>;
        const axisPosition = xAxis!.dateToPosition(this.bulletDate);
        const seriesDataItem = xAxis.getSeriesItem(series, axisPosition, 0);
  
        if (seriesDataItem) {
          const tooltip = am5.Tooltip.new(this.root, {
            pointerOrientation: "left",
            marginTop: 10
          });
  
          tooltip.get("background")!.setAll({
            fill: am5.color(color_map[series.get("name") as keyof typeof color_map] || 0x000000),
            fillOpacity: 0.9
          });
          
          const bulletSprite = am5.Container.new(this.root, {
            tooltip: tooltip,
            tooltipText: `{valueY} ${series.get("name")}`,
            showTooltipOn: "always",
            centerX: am5.percent(50),
            centerY: am5.percent(50)
          });
  
          bulletSprite.children.push(am5.Circle.new(this.root, {
            radius: 5,
            fill: series.get("fill"),
            stroke: am5.color(0xFFFFFF),
            strokeWidth: 1
          }));
  
          series.addBullet(seriesDataItem, am5.Bullet.new(this.root, {
            sprite: bulletSprite,
            stacked: "auto"
          }));
          
          this.chart.events.on("pointerover", () => {
            bulletSprite.hide();
          });
        }
        
      
      });
    });
  }
  

  private addLegend(): void {
    this.legend = this.chart.children.push(am5.Legend.new(this.root, {
      centerX: am5.percent(50),
      x: am5.percent(50),
      y: am5.percent(-7)
    }));
    
    this.legend.data.setAll([this.seriesList[0], this.seriesList[1], this.seriesList[2]]);
  }

  private updateChartSeries(): void {
    this.zone.runOutsideAngular(() => {
      this.seriesList[0].data.setAll(this.data);
      this.seriesList[1].data.setAll(this.data2);
      this.seriesList[2].data.setAll(this.data3);

      this.addBullets();
      this.legend.data.setAll([this.seriesList[0], this.seriesList[1], this.seriesList[2]]);

      // Animate on load
      this.seriesList.forEach(series => {
        if (series.data.length > 0) {
          series.appear(1000);
        }
      });
      this.chart.appear(1000, 100);
    });
  }
  

  private async fetchGeographyData(geography: string, isSecondary: boolean = false): Promise<void> {
    const apiUrl = this.apiMap[geography];
    if (!apiUrl) return;

    this.showLoading();

    return new Promise((resolve, reject) => {
      this.http.get<any[]>(apiUrl).subscribe({
        next: (data) => {
          if (isSecondary) {
            this.rawDataGeoB = data;
          } else {
            this.rawData = data;
          }
          this.hideLoading();
          resolve();
        },
        error: (error) => {
          console.error('Error fetching geography data:', error);
          this.hideLoading();
          reject(error);
        }
      });
    });
  }

  private getPreFilter(geoA: string, geoB: string | null, survey: string) {

    const surveyFilter = `Business or organization information, ${survey.toLowerCase()}`;
    
    let data_filter = this.rawData.filter(element => element.GeoName == geoA);

    data_filter = data_filter.filter(element => 
      element['Business or organization information'] == surveyFilter
    );

    let data_filter2 = null;
    if (geoB && this.rawDataGeoB.length > 0) {
      data_filter2 = this.rawDataGeoB.filter(element => element.GeoName == geoB);
      data_filter2 = data_filter2.filter(element => 
        element['Business or organization information'] == surveyFilter
      );
    }

    return { GEO1: data_filter, GEO2: data_filter2 };
  }



  private async refreshChart(refreshChartData: ChartFilters): Promise<void> {

    
    const twoProvince = refreshChartData.geoB && refreshChartData.geoB !== 'None';


    if (this.lastGeoA !== refreshChartData.geoA) {
      await this.fetchGeographyData(refreshChartData.geoA);
      this.lastGeoA = refreshChartData.geoA;
    }

    if (twoProvince && (!this.rawDataGeoB.length || this.lastGeoB !== refreshChartData.geoB)) {
      await this.fetchGeographyData(refreshChartData.geoB);
      this.lastGeoB = refreshChartData.geoB;
    }

    const { GEO1, GEO2 } = this.getPreFilter(refreshChartData.geoA, refreshChartData.geoB, refreshChartData.survey);

    console.log(GEO1, "GEO1")

    let textFilters = refreshChartData.accordions || [];


    if (textFilters.length === 0) {
      textFilters = ['Geography, all geography'];
    }


    const maxFiltersPerGeo = twoProvince ? 1 : 2;
    textFilters = textFilters.slice(0, maxFiltersPerGeo);

        // Clear all series
    this.seriesList.forEach(series => {
          series.data.setAll([]);
          series.hide();
    });
    
    const legendData: am5xy.LineSeries[] = [];
    const isNetIncrease = refreshChartData.display 



    textFilters.forEach((filter: string, index: number) => {
      const mappedFilter = this.textButtonMap[filter] || filter;
      const data_filter = GEO1.filter(element => element.Characteristics == mappedFilter);
      
      if (data_filter.length > 0) {
        const { data, data2, data3 } = this.threeDataFunctions(data_filter);
        
        if (false) {
       
        } else {
          const baseIndex = index * 3;
          
          this.seriesList[baseIndex].data.setAll(data);
          this.seriesList[baseIndex + 1].data.setAll(data2);
          this.seriesList[baseIndex + 2].data.setAll(data3);
          
          this.seriesList[baseIndex].set("name", index === 0 ? "Increase" : "Increase " + (index + 1));
          this.seriesList[baseIndex + 1].set("name", index === 0 ? "Stay the same" : "Stay the same " + (index + 1));
          this.seriesList[baseIndex + 2].set("name", index === 0 ? "Decrease" : "Decrease " + (index + 1));
          
          this.seriesList[baseIndex].show();
          this.seriesList[baseIndex + 1].show();
          this.seriesList[baseIndex + 2].show();
          
          legendData.push(
            this.seriesList[baseIndex], 
            this.seriesList[baseIndex + 1], 
            this.seriesList[baseIndex + 2]
          );
        }
      }
    });

    // Update legend
    this.legend.data.setAll(legendData);

    // Re-add bullets for visible series
    this.addBullets()


  }




}