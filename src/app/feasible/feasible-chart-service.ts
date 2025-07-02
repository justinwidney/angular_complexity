// feasible-chart.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { 
  FeasibleData, 
  FeasiblePoint, 
  GroupingType, 
  NaicsDescriptions,
  HSCodes
} from './feasible-chart-model';

import * as d3 from 'd3';


@Injectable({
  providedIn: 'root'
})
export class FeasibleChartService {


  constructor(private http: HttpClient) {}

  // Main method to get all feasible chart data
  public getAllData(region: string, year?: string): Observable<{
    feasibleData: FeasiblePoint[],
    rawData: any[], // Include raw data for re-aggregation
    eci: number,
    centerX: number,
    centerY: number,
    minDistance: number,
    maxDistance: number,
    minPci: number,
    maxPci: number
  }> {
    
    return this.getRawData().pipe(
      map((rawData) => {
        const processedData = this.processRawData(rawData);
        const bounds = this.calculateBounds(processedData);
        
        return {
          feasibleData: processedData,
          rawData: rawData, // Include raw data
          eci: rawData.length > 0 ? rawData[0].eci : 0,
          ...bounds
        };
      })
    );
  }


  // Get raw data from API
  private getRawData(): Observable<any[]> {
    return this.http.get<any[]>(`https://api.economicdata.alberta.ca/api/data?code=e786bd96-d36d-4933-b36b-8e5d1cfd549b`, {
    });
  }

 

  // Process raw data into feasible points
  private processRawData(rawData: any[]): FeasiblePoint[] {
    // Extract NAICS descriptions directly from the data (like your original approach)
    const naicsDescriptions: NaicsDescriptions = {};
    rawData.reduce((acc, item) => {
      const hsCode = item.naics;
      if (!acc[hsCode]) {
        acc[hsCode] = { description: item.naics_description };
        naicsDescriptions[hsCode] = item.naics_description;
      }
      return acc;
    }, {});

    // Filter for recent data (after 2021)
    const thresholdDate = new Date("2021-01-01T00:00:00");
    const recentData = rawData.filter(item => {
      const itemDate = new Date(item.Date);
      return itemDate > thresholdDate;
    });

    // Convert to standard format
    const modifiedData = recentData.map(obj => {
      const { product, ...rest } = obj;
      const hs2 = Math.floor(parseInt(product) / 100);
      const naics2 = Math.floor(rest.naics / 10);
      const hs4 = parseInt(product);

      return {
        hs2,
        hs4,
        naics2,
        state: 0,
        ...rest
      };
    });

    return this.aggregateData(modifiedData, GroupingType.HS4, naicsDescriptions);
  }

  // Aggregate data based on grouping type
public aggregateData(
    data: any[], 
    groupingType: GroupingType, 
    naicsDescriptions?: NaicsDescriptions
  ): FeasiblePoint[] {
    
    // If naicsDescriptions not provided, extract them from data
    if (!naicsDescriptions) {
      naicsDescriptions = {};
      data.reduce((acc, item) => {
        const hsCode = item.naics;
        if (!acc[hsCode]) {
          acc[hsCode] = { description: item.naics_description };
          naicsDescriptions![hsCode] = item.naics_description;
        }
        return acc;
      }, {});
    }

    let dataGroups: Map<any, any[]>;
    let isNaicsGrouping = false;

    switch (groupingType) {
      case GroupingType.HS4:
        dataGroups = this.groupBy(data, d => d.hs4);
        break;
      case GroupingType.HS2:
        dataGroups = this.groupBy(data, d => d.hs2);
        break;
      case GroupingType.NAICS2:
        dataGroups = this.groupBy(data, d => d.naics2);
        isNaicsGrouping = true;
        break;
      case GroupingType.NAICS4:
        dataGroups = this.groupBy(data, d => d.naics);
        isNaicsGrouping = true;
        break;
      default:
        dataGroups = this.groupBy(data, d => d.hs4);
    }

    const aggregatedData: FeasiblePoint[] = [];

    dataGroups.forEach((group, key) => {
      const pci = group.reduce((acc, curr) => acc + curr.pci, 0) / group.length;
      const distance = group.reduce((acc, curr) => acc + curr.distance, 0) / group.length;
      const value = group.reduce((acc, curr) => acc + curr.Value, 0);
      const rca = group.reduce((acc, curr) => acc + curr.rca, 0) / group.length;
      const Date = group[0].Date;

      const point: FeasiblePoint = {
        pci,
        distance,
        description: isNaicsGrouping ? (naicsDescriptions[key] || '----') : '----',
        description2: group[0].description || '',
        value,
        hs2: key,
        hs4: key,
        length: group.length,
        rca,
        Date,
        state: 0
      };

      aggregatedData.push(point);
    });

    return aggregatedData;
  }

  // Helper method to group data
  private groupBy<T, K>(array: T[], keyFn: (item: T) => K): Map<K, T[]> {
    const map = new Map<K, T[]>();
    array.forEach(item => {
      const key = keyFn(item);
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(item);
    });
    return map;
  }

  // Calculate chart bounds
  private calculateBounds(data: FeasiblePoint[]): {
    centerX: number,
    centerY: number,
    minDistance: number,
    maxDistance: number,
    minPci: number,
    maxPci: number
  } {

    const lowerPercentile = 5;   // 5th percentile
    const upperPercentile =  95;  // 95th percentile

    const distances = data.map(d => d.distance).sort((a, b) => a - b);
    const pcis = data.map(d => d.pci).sort((a, b) => a - b);

    const minDistance = d3.quantile(distances, lowerPercentile / 100) || distances[0];
    const maxDistance = d3.quantile(distances, upperPercentile / 100) || distances[distances.length - 1];
    const minPci = d3.quantile(pcis, lowerPercentile / 100) || pcis[0];
    const maxPci = d3.quantile(pcis, upperPercentile / 100) || pcis[pcis.length - 1];

    const centerX = (minDistance + maxDistance) / 2;
    const centerY = (minPci + maxPci) / 2;

    return {
      centerX,
      centerY,
      minDistance,
      maxDistance,
      minPci,
      maxPci
    };
  }

  // Filter data for frontier view
  public getFrontierData(data: FeasiblePoint[]): FeasiblePoint[] {
    const filtered = data.filter(d => d.distance > 0 && d.pci > 0);
    const paretoFrontier: FeasiblePoint[] = [];
    
    for (const point of filtered) {
      let isDominated = false;
      
      // Check if this point is dominated by any other point
      for (const other of filtered) {
        if (other !== point && 
            (1 - other.distance) >= (1 - point.distance) && // other has equal or better distance
            other.pci >= point.pci && // other has equal or better PCI
            ((1 - other.distance) > (1 - point.distance) || other.pci > point.pci)) { // other is strictly better in at least one dimension
          isDominated = true;
          break;
        }
      }
      
      if (!isDominated) {
        paretoFrontier.push(point);
      }
    }
    
    // Sort by distance priority, then PCI
    return paretoFrontier
      .sort((a, b) => {
        const distDiff = (1 - a.distance) - (1 - b.distance);
        return distDiff !== 0 ? -distDiff : b.pci - a.pci;
      })
  }

  // Filter data for four quadrants view
  public getFourQuadrantsData(
    data: FeasiblePoint[], 
    centerX: number, 
    eci: number
  ): FeasiblePoint[] {
    return data.map(d => {
      let color: string;
      
      if (d.distance > centerX && d.pci > eci) {
        color = 'red';    // Wish you were here
      } else if (d.distance > centerX && d.pci < eci) {
        color = 'blue';   // Stuck in the mud
      } else if (d.distance < centerX && d.pci < eci) {
        color = 'green';  // Long road ahead
      } else {
        color = 'yellow'; // Let it be
      }
      
      return { ...d, color };
    });
  }

  // Search functionality
  public searchData(data: FeasiblePoint[], query: string): FeasiblePoint[] {
    const lowerQuery = query.toLowerCase();
    return data.filter(d => 
      d.description2.toLowerCase().includes(lowerQuery) ||
      d.description.toLowerCase().includes(lowerQuery)
    );
  }

  // Abbreviate large numbers
  public abbreviateNumber(number: number): string {
    const SI_SYMBOL = ["", "k", "M", "B", "T", "P", "E"];
    const tier = Math.log10(Math.abs(number)) / 3 | 0;

    if (tier === 0) return number.toString();

    const suffix = SI_SYMBOL[tier];
    const scale = Math.pow(10, tier * 3);
    const scaled = number / scale;

    return scaled.toFixed(1) + suffix;
  }

  // Get HS codes mapping
  public getHSCodes(): HSCodes {
    return {
      "1": "Live animals",
      "2": "Meat and edible meat offal",
      "3": "Fish and crustaceans, molluscs and other aquatic invertebrates",
      "4": "Dairy produce; birds' eggs; natural honey; edible products of animal origin, not elsewhere specified or included",
      "5": "Products of animal origin, not elsewhere specified or included",
      "6": "Live trees and other plants; bulbs, roots and the like; cut flowers and ornamental foliage",
      "7": "Edible vegetables and certain roots and tubers",
      "8": "Edible fruit and nuts; peel of citrus fruit or melons",
      "9": "Coffee, tea, maté and spices",
      "10": "Cereals",
      "11": "Products of the milling industry; malt; starches; inulin; wheat gluten",
      "12": "Oil seeds and oleaginous fruits; miscellaneous grains, seeds and fruit; industrial or medicinal plants; straw and fodder",
      "13": "Lac; gums, resins and other vegetable saps and extracts",
      "14": "Vegetable plaiting materials; vegetable products not elsewhere specified or included",
      "15": "Animal or vegetable fats and oils and their cleavage products; prepared edible fats; animal or vegetable waxes",
      "16": "Preparations of meat, of fish or of crustaceans, molluscs or other aquatic invertebrates",
      "17": "Sugars and sugar confectionery",
      "18": "Cocoa and cocoa preparations",
      "19": "Preparations of cereals, flour, starch or milk; pastrycooks' products",
      "20": "Preparations of vegetables, fruit, nuts or other parts of plants",
      "21": "Miscellaneous edible preparations",
      "22": "Beverages, spirits and vinegar",
      "23": "Residues and waste from the food industries; prepared animal fodder",
      "24": "Tobacco and manufactured tobacco substitutes",
      "25": "Salt; sulphur; earths and stone; plastering materials, lime and cement",
      "26": "Ores, slag and ash",
      "27": "Mineral fuels, mineral oils and products of their distillation; bituminous substances; mineral waxes",
      "28": "Inorganic chemicals; organic or inorganic compounds of precious metals, of rare-earth metals, of radioactive elements or of isotopes",
      "29": "Organic chemicals",
      "30": "Pharmaceutical products",
      "31": "Fertilizers",
      "32": "Tanning or dyeing extracts; tannins and their derivatives; dyes, pigments and other colouring matter; paints and varnishes; putty and other mastics; inks",
      "33": "Essential oils and resinoids; perfumery, cosmetic or toilet preparations",
      "34": "Soap, organic surface-active agents, washing preparations, lubricating preparations, artificial waxes, prepared waxes, polishing or scouring preparations, candles and similar articles, modelling pastes, 'dental waxes' and dental preparations with a basis of plaster",
      "35": "Albuminoidal substances; modified starches; glues; enzymes",
      "36": "Explosives; pyrotechnic products; matches; pyrophoric alloys; certain combustible preparations",
      "37": "Photographic or cinematographic goods",
      "38": "Miscellaneous chemical products",
      "39": "Plastics and articles thereof",
      "40": "Rubber and articles thereof",
      "41": "Raw hides and skins (other than furskins) and leather",
      "42": "Articles of leather; saddlery and harness; travel goods, handbags and similar containers; articles of animal gut (other than silkworm gut)",
      "43": "Furskins and artificial fur; manufactures thereof",
      "44": "Wood and articles of wood; wood charcoal",
      "45": "Cork and articles of cork",
      "46": "Manufactures of straw, of esparto or of other plaiting materials; basketware and wickerwork",
      "47": "Pulp of wood or of other fibrous cellulosic material; recovered (waste and scrap) paper or paperboard",
      "48": "Paper and paperboard; articles of paper pulp, of paper or of paperboard",
      "49": "Printed books, newspapers, pictures and other products of the printing industry; manuscripts, typescripts and plans",
      "50": "Silk",
      "51": "Wool, fine or coarse animal hair; horsehair yarn and woven fabric",
      "52": "Cotton",
      "53": "Other vegetable textile fibres; paper yarn and woven fabrics of paper yarn",
      "54": "Man-made filaments",
      "55": "Man-made staple fibres",
      "56": "Wadding, felt and nonwovens; special yarns; twine, cordage, ropes and cables and articles thereof",
      "57": "Carpets and other textile floor coverings",
      "58": "Special woven fabrics; tufted textile fabrics; lace; tapestries; trimmings; embroidery",
      "59": "Impregnated, coated, covered or laminated textile fabrics; textile articles of a kind suitable for industrial use",
      "60": "Knitted or crocheted fabrics",
      "61": "Articles of apparel and clothing accessories, knitted or crocheted",
      "62": "Articles of apparel and clothing accessories, not knitted or crocheted",
      "63": "Other made-up textile articles; sets; worn clothing and worn textile articles; rags",
      "64": "Footwear, gaiters and the like; parts of such articles",
      "65": "Headgear and parts thereof",
      "66": "Umbrellas, sun umbrellas, walking-sticks, seat-sticks, whips, riding-crops and parts thereof",
      "67": "Prepared feathers and down and articles made of feathers or of down; artificial flowers; articles of human hair",
      "68": "Articles of stone, plaster, cement, asbestos, mica or similar materials",
      "69": "Ceramic products",
      "70": "Glass and glassware",
      "71": "Natural or cultured pearls, precious or semi-precious stones, precious metals, metals clad with precious metal, and articles thereof; imitation jewellery; coin",
      "72": "Iron and steel",
      "73": "Articles of iron or steel",
      "74": "Copper and articles thereof",
      "75": "Nickel and articles thereof",
      "76": "Aluminium and articles thereof",
      "78": "Lead and articles thereof",
      "79": "Zinc and articles thereof",
      "80": "Tin and articles thereof",
      "81": "Other base metals; cermets; articles thereof",
      "82": "Tools, implements, cutlery, spoons and forks, of base metal; parts thereof of base metal",
      "83": "Miscellaneous articles of base metal",
      "84": "Nuclear reactors, boilers, machinery and mechanical appliances; parts thereof",
      "85": "Electrical machinery and equipment and parts thereof; sound recorders and reproducers, television image and sound recorders and reproducers, and parts and accessories of such articles",
      "86": "Railway or tramway locomotives, rolling stock and parts thereof; railway or tramway track fixtures and fittings and parts thereof; mechanical (including electro-mechanical) traffic signalling equipment of all kinds",
      "87": "Vehicles other than railway or tramway rolling stock, and parts and accessories thereof",
      "88": "Aircraft, spacecraft, and parts thereof",
      "89": "Ships, boats and floating structures",
      "90": "Optical, photographic, cinematographic, measuring, checking, precision, medical or surgical instruments and apparatus; parts and accessories thereof",
      "91": "Clocks and watches and parts thereof",
      "92": "Musical instruments; parts and accessories of such articles",
      "93": "Arms and ammunition; parts and accessories thereof",
      "94": "Furniture; bedding, mattresses, mattress supports, cushions and similar stuffed furnishings; lamps and lighting fittings, not elsewhere specified or included; illuminated signs, illuminated name-plates and the like; prefabricated buildings",
      "95": "Toys, games and sports requisites; parts and accessories thereof",
      "96": "Miscellaneous manufactured articles",
      "97": "Works of art, collectors' pieces and antiques",
      "98": "Special classifications provisions, not included in other chapters",
      "99": "Miscellaneous goods"
    };
  }
}