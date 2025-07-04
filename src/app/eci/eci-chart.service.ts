// static-eci-chart.service.ts

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { 
  ECIRawDataItem, 
  ECIDataPoint, 
  ECILineData, 
  ECIChartConfig,
  ECIProvinceMapping,
  ECIChartStats
} from './eci-chart.models';

@Injectable({
  providedIn: 'root'
})
export class ECIChartService {

  private provinceMapping: ECIProvinceMapping = {
    'Alberta': 'AB',
    'British Columbia': 'BC',
    'Manitoba': 'MB',
    'New Brunswick': 'NB',
    'Newfoundland and Labrador': 'NL',
    'Northwest Territories': 'NT',
    'Nova Scotia': 'NS',
    'Nunavut': 'NU',
    'Ontario': 'ON',
    'Prince Edward Island': 'PE',
    'Quebec': 'QC',
    'Saskatchewan': 'SK',
    'Yukon': 'YT'
  };

  // Static ECI data - using your provided data
  private static ECI_DATA: ECIRawDataItem[] = [
    {
      "year": "1998",
      "origin": "Alberta",
      "eci": 0.268317097
    },
    {
      "year": "1999",
      "origin": "Alberta",
      "eci": 0.208270291
    },
    {
      "year": "2000",
      "origin": "Alberta",
      "eci": 0.221752352
    },
    {
      "year": "2001",
      "origin": "Alberta",
      "eci": 0.238425076
    },
    {
      "year": "2002",
      "origin": "Alberta",
      "eci": 0.233542705
    },
    {
      "year": "2003",
      "origin": "Alberta",
      "eci": 0.193377662
    },
    {
      "year": "2004",
      "origin": "Alberta",
      "eci": 0.197464517
    },
    {
      "year": "2005",
      "origin": "Alberta",
      "eci": 0.185049339
    },
    {
      "year": "2006",
      "origin": "Alberta",
      "eci": 0.187401977
    },
    {
      "year": "2007",
      "origin": "Alberta",
      "eci": 0.157780955
    },
    {
      "year": "2008",
      "origin": "Alberta",
      "eci": 0.14038299
    },
    {
      "year": "2009",
      "origin": "Alberta",
      "eci": 0.144105494
    },
    {
      "year": "2010",
      "origin": "Alberta",
      "eci": 0.100881238
    },
    {
      "year": "2011",
      "origin": "Alberta",
      "eci": 0.073541689
    },
    {
      "year": "2012",
      "origin": "Alberta",
      "eci": 0.042946901
    },
    {
      "year": "2013",
      "origin": "Alberta",
      "eci": 0.114909776
    },
    {
      "year": "2014",
      "origin": "Alberta",
      "eci": 0.065523501
    },
    {
      "year": "2015",
      "origin": "Alberta",
      "eci": 0.046418797
    },
    {
      "year": "2016",
      "origin": "Alberta",
      "eci": -0.025059508
    },
    {
      "year": "2017",
      "origin": "Alberta",
      "eci": -0.178275041
    },
    {
      "year": "2018",
      "origin": "Alberta",
      "eci": -0.239034886
    },
    {
      "year": "2019",
      "origin": "Alberta",
      "eci": -0.214092398
    },
    {
      "year": "2020",
      "origin": "Alberta",
      "eci": -0.227770088
    },
    {
      "year": "2021",
      "origin": "Alberta",
      "eci": -0.184070516
    },
    {
      "year": "2022",
      "origin": "Alberta",
      "eci": -0.176001712
    },
    {
      "year": "2023",
      "origin": "Alberta",
      "eci": -0.278256832
    },
    {
      "year": "1998",
      "origin": "British Columbia",
      "eci": 0.149615554
    },
    {
      "year": "1999",
      "origin": "British Columbia",
      "eci": 0.085242019
    },
    {
      "year": "2000",
      "origin": "British Columbia",
      "eci": 0.12264327
    },
    {
      "year": "2001",
      "origin": "British Columbia",
      "eci": 0.111763793
    },
    {
      "year": "2002",
      "origin": "British Columbia",
      "eci": 0.095872047
    },
    {
      "year": "2003",
      "origin": "British Columbia",
      "eci": 0.105432273
    },
    {
      "year": "2004",
      "origin": "British Columbia",
      "eci": 0.072399024
    },
    {
      "year": "2005",
      "origin": "British Columbia",
      "eci": 0.076095339
    },
    {
      "year": "2006",
      "origin": "British Columbia",
      "eci": 0.088301931
    },
    {
      "year": "2007",
      "origin": "British Columbia",
      "eci": 0.083952871
    },
    {
      "year": "2008",
      "origin": "British Columbia",
      "eci": 0.063363221
    },
    {
      "year": "2009",
      "origin": "British Columbia",
      "eci": 0.082617652
    },
    {
      "year": "2010",
      "origin": "British Columbia",
      "eci": 0.068283775
    },
    {
      "year": "2011",
      "origin": "British Columbia",
      "eci": 0.062820959
    },
    {
      "year": "2012",
      "origin": "British Columbia",
      "eci": 0.014109224
    },
    {
      "year": "2013",
      "origin": "British Columbia",
      "eci": 0.040874789
    },
    {
      "year": "2014",
      "origin": "British Columbia",
      "eci": -0.005222769
    },
    {
      "year": "2015",
      "origin": "British Columbia",
      "eci": 0.030257918
    },
    {
      "year": "2016",
      "origin": "British Columbia",
      "eci": -0.031674065
    },
    {
      "year": "2017",
      "origin": "British Columbia",
      "eci": -0.10616145
    },
    {
      "year": "2018",
      "origin": "British Columbia",
      "eci": -0.079642628
    },
    {
      "year": "2019",
      "origin": "British Columbia",
      "eci": -0.049491112
    },
    {
      "year": "2020",
      "origin": "British Columbia",
      "eci": -0.018887137
    },
    {
      "year": "2021",
      "origin": "British Columbia",
      "eci": 0.01059269
    },
    {
      "year": "2022",
      "origin": "British Columbia",
      "eci": 0.033228658
    },
    {
      "year": "2023",
      "origin": "British Columbia",
      "eci": -0.042047694
    },
    {
      "year": "1998",
      "origin": "Manitoba",
      "eci": 0.15487204
    },
    {
      "year": "1999",
      "origin": "Manitoba",
      "eci": 0.100848026
    },
    {
      "year": "2000",
      "origin": "Manitoba",
      "eci": 0.153811469
    },
    {
      "year": "2001",
      "origin": "Manitoba",
      "eci": 0.100565689
    },
    {
      "year": "2002",
      "origin": "Manitoba",
      "eci": 0.089775687
    },
    {
      "year": "2003",
      "origin": "Manitoba",
      "eci": 0.096962982
    },
    {
      "year": "2004",
      "origin": "Manitoba",
      "eci": 0.124115113
    },
    {
      "year": "2005",
      "origin": "Manitoba",
      "eci": 0.166377858
    },
    {
      "year": "2006",
      "origin": "Manitoba",
      "eci": 0.184203622
    },
    {
      "year": "2007",
      "origin": "Manitoba",
      "eci": 0.174508959
    },
    {
      "year": "2008",
      "origin": "Manitoba",
      "eci": 0.144117446
    },
    {
      "year": "2009",
      "origin": "Manitoba",
      "eci": 0.191474858
    },
    {
      "year": "2010",
      "origin": "Manitoba",
      "eci": 0.169529923
    },
    {
      "year": "2011",
      "origin": "Manitoba",
      "eci": 0.142734877
    },
    {
      "year": "2012",
      "origin": "Manitoba",
      "eci": 0.11844835
    },
    {
      "year": "2013",
      "origin": "Manitoba",
      "eci": 0.141698962
    },
    {
      "year": "2014",
      "origin": "Manitoba",
      "eci": 0.13259652
    },
    {
      "year": "2015",
      "origin": "Manitoba",
      "eci": 0.089847177
    },
    {
      "year": "2016",
      "origin": "Manitoba",
      "eci": 0.020646059
    },
    {
      "year": "2017",
      "origin": "Manitoba",
      "eci": -0.038524788
    },
    {
      "year": "2018",
      "origin": "Manitoba",
      "eci": -0.035084856
    },
    {
      "year": "2019",
      "origin": "Manitoba",
      "eci": -0.00117601
    },
    {
      "year": "2020",
      "origin": "Manitoba",
      "eci": -0.017222346
    },
    {
      "year": "2021",
      "origin": "Manitoba",
      "eci": 0.004341015
    },
    {
      "year": "2022",
      "origin": "Manitoba",
      "eci": 0.035000042
    },
    {
      "year": "2023",
      "origin": "Manitoba",
      "eci": -0.041459891
    },
    {
      "year": "1998",
      "origin": "New Brunswick",
      "eci": -0.058548761
    },
    {
      "year": "1999",
      "origin": "New Brunswick",
      "eci": -0.054039318
    },
    {
      "year": "2000",
      "origin": "New Brunswick",
      "eci": 0.062358408
    },
    {
      "year": "2001",
      "origin": "New Brunswick",
      "eci": -0.028545309
    },
    {
      "year": "2002",
      "origin": "New Brunswick",
      "eci": -0.045940792
    },
    {
      "year": "2003",
      "origin": "New Brunswick",
      "eci": -0.099699845
    },
    {
      "year": "2004",
      "origin": "New Brunswick",
      "eci": -0.121473229
    },
    {
      "year": "2005",
      "origin": "New Brunswick",
      "eci": -0.173894848
    },
    {
      "year": "2006",
      "origin": "New Brunswick",
      "eci": -0.11864029
    },
    {
      "year": "2007",
      "origin": "New Brunswick",
      "eci": -0.110619175
    },
    {
      "year": "2008",
      "origin": "New Brunswick",
      "eci": -0.093996647
    },
    {
      "year": "2009",
      "origin": "New Brunswick",
      "eci": -0.041237048
    },
    {
      "year": "2010",
      "origin": "New Brunswick",
      "eci": -0.113964778
    },
    {
      "year": "2011",
      "origin": "New Brunswick",
      "eci": -0.120218505
    },
    {
      "year": "2012",
      "origin": "New Brunswick",
      "eci": -0.249201054
    },
    {
      "year": "2013",
      "origin": "New Brunswick",
      "eci": -0.260767488
    },
    {
      "year": "2014",
      "origin": "New Brunswick",
      "eci": -0.247192254
    },
    {
      "year": "2015",
      "origin": "New Brunswick",
      "eci": -0.205230356
    },
    {
      "year": "2016",
      "origin": "New Brunswick",
      "eci": -0.233123368
    },
    {
      "year": "2017",
      "origin": "New Brunswick",
      "eci": -0.363492786
    },
    {
      "year": "2018",
      "origin": "New Brunswick",
      "eci": -0.341057231
    },
    {
      "year": "2019",
      "origin": "New Brunswick",
      "eci": -0.214092398
    },
    {
      "year": "2020",
      "origin": "New Brunswick",
      "eci": -0.291185533
    },
    {
      "year": "2021",
      "origin": "New Brunswick",
      "eci": -0.326318586
    },
    {
      "year": "2022",
      "origin": "New Brunswick",
      "eci": -0.204486437
    },
    {
      "year": "2023",
      "origin": "New Brunswick",
      "eci": -0.267091352
    },
    {
      "year": "1998",
      "origin": "Newfoundland and Labrador",
      "eci": -0.441333793
    },
    {
      "year": "1999",
      "origin": "Newfoundland and Labrador",
      "eci": -0.42722646
    },
    {
      "year": "2000",
      "origin": "Newfoundland and Labrador",
      "eci": -0.330824652
    },
    {
      "year": "2001",
      "origin": "Newfoundland and Labrador",
      "eci": -0.337087459
    },
    {
      "year": "2002",
      "origin": "Newfoundland and Labrador",
      "eci": -0.354940355
    },
    {
      "year": "2003",
      "origin": "Newfoundland and Labrador",
      "eci": -0.396332758
    },
    {
      "year": "2004",
      "origin": "Newfoundland and Labrador",
      "eci": -0.427583887
    },
    {
      "year": "2005",
      "origin": "Newfoundland and Labrador",
      "eci": -0.475683615
    },
    {
      "year": "2006",
      "origin": "Newfoundland and Labrador",
      "eci": -0.483316437
    },
    {
      "year": "2007",
      "origin": "Newfoundland and Labrador",
      "eci": -0.523408284
    },
    {
      "year": "2008",
      "origin": "Newfoundland and Labrador",
      "eci": -0.597674411
    },
    {
      "year": "2009",
      "origin": "Newfoundland and Labrador",
      "eci": -0.537538124
    },
    {
      "year": "2010",
      "origin": "Newfoundland and Labrador",
      "eci": -0.591585635
    },
    {
      "year": "2011",
      "origin": "Newfoundland and Labrador",
      "eci": -0.57106785
    },
    {
      "year": "2012",
      "origin": "Newfoundland and Labrador",
      "eci": -0.658719316
    },
    {
      "year": "2013",
      "origin": "Newfoundland and Labrador",
      "eci": -0.683794304
    },
    {
      "year": "2014",
      "origin": "Newfoundland and Labrador",
      "eci": -0.664286614
    },
    {
      "year": "2015",
      "origin": "Newfoundland and Labrador",
      "eci": -0.58064395
    },
    {
      "year": "2016",
      "origin": "Newfoundland and Labrador",
      "eci": -0.538152913
    },
    {
      "year": "2017",
      "origin": "Newfoundland and Labrador",
      "eci": -0.713595477
    },
    {
      "year": "2018",
      "origin": "Newfoundland and Labrador",
      "eci": -0.717333524
    },
    {
      "year": "2019",
      "origin": "Newfoundland and Labrador",
      "eci": -0.829452029
    },
    {
      "year": "2020",
      "origin": "Newfoundland and Labrador",
      "eci": -0.824741874
    },
    {
      "year": "2021",
      "origin": "Newfoundland and Labrador",
      "eci": -0.803653086
    },
    {
      "year": "2022",
      "origin": "Newfoundland and Labrador",
      "eci": -0.761602947
    },
    {
      "year": "2023",
      "origin": "Newfoundland and Labrador",
      "eci": -0.851334184
    },
    {
      "year": "1998",
      "origin": "Nova Scotia",
      "eci": -0.101733052
    },
    {
      "year": "1999",
      "origin": "Nova Scotia",
      "eci": -0.08319323
    },
    {
      "year": "2000",
      "origin": "Nova Scotia",
      "eci": -0.080054512
    },
    {
      "year": "2001",
      "origin": "Nova Scotia",
      "eci": -0.073835734
    },
    {
      "year": "2002",
      "origin": "Nova Scotia",
      "eci": -0.089313075
    },
    {
      "year": "2003",
      "origin": "Nova Scotia",
      "eci": -0.09012775
    },
    {
      "year": "2004",
      "origin": "Nova Scotia",
      "eci": -0.105628951
    },
    {
      "year": "2005",
      "origin": "Nova Scotia",
      "eci": -0.084298462
    },
    {
      "year": "2006",
      "origin": "Nova Scotia",
      "eci": -0.091667305
    },
    {
      "year": "2007",
      "origin": "Nova Scotia",
      "eci": -0.110314311
    },
    {
      "year": "2008",
      "origin": "Nova Scotia",
      "eci": -0.063483057
    },
    {
      "year": "2009",
      "origin": "Nova Scotia",
      "eci": -0.012821946
    },
    {
      "year": "2010",
      "origin": "Nova Scotia",
      "eci": -0.046818631
    },
    {
      "year": "2011",
      "origin": "Nova Scotia",
      "eci": -0.045702135
    },
    {
      "year": "2012",
      "origin": "Nova Scotia",
      "eci": -0.099936378
    },
    {
      "year": "2013",
      "origin": "Nova Scotia",
      "eci": -0.120229055
    },
    {
      "year": "2014",
      "origin": "Nova Scotia",
      "eci": -0.157382035
    },
    {
      "year": "2015",
      "origin": "Nova Scotia",
      "eci": -0.148729334
    },
    {
      "year": "2016",
      "origin": "Nova Scotia",
      "eci": -0.222371955
    },
    {
      "year": "2017",
      "origin": "Nova Scotia",
      "eci": -0.294313323
    },
    {
      "year": "2018",
      "origin": "Nova Scotia",
      "eci": -0.269536848
    },
    {
      "year": "2019",
      "origin": "Nova Scotia",
      "eci": -0.209177665
    },
    {
      "year": "2020",
      "origin": "Nova Scotia",
      "eci": -0.195137277
    },
    {
      "year": "2021",
      "origin": "Nova Scotia",
      "eci": -0.166723992
    },
    {
      "year": "2022",
      "origin": "Nova Scotia",
      "eci": -0.164226466
    },
    {
      "year": "2023",
      "origin": "Nova Scotia",
      "eci": -0.210357797
    },
    {
      "year": "1998",
      "origin": "Ontario",
      "eci": 0.427596814
    },
    {
      "year": "1999",
      "origin": "Ontario",
      "eci": 0.406134891
    },
    {
      "year": "2000",
      "origin": "Ontario",
      "eci": 0.393870503
    },
    {
      "year": "2001",
      "origin": "Ontario",
      "eci": 0.39441355
    },
    {
      "year": "2002",
      "origin": "Ontario",
      "eci": 0.370816485
    },
    {
      "year": "2003",
      "origin": "Ontario",
      "eci": 0.357057104
    },
    {
      "year": "2004",
      "origin": "Ontario",
      "eci": 0.359431208
    },
    {
      "year": "2005",
      "origin": "Ontario",
      "eci": 0.372731672
    },
    {
      "year": "2006",
      "origin": "Ontario",
      "eci": 0.391397364
    },
    {
      "year": "2007",
      "origin": "Ontario",
      "eci": 0.390104591
    },
    {
      "year": "2008",
      "origin": "Ontario",
      "eci": 0.377086651
    },
    {
      "year": "2009",
      "origin": "Ontario",
      "eci": 0.408289163
    },
    {
      "year": "2010",
      "origin": "Ontario",
      "eci": 0.405738554
    },
    {
      "year": "2011",
      "origin": "Ontario",
      "eci": 0.400249134
    },
    {
      "year": "2012",
      "origin": "Ontario",
      "eci": 0.350547742
    },
    {
      "year": "2013",
      "origin": "Ontario",
      "eci": 0.367475235
    },
    {
      "year": "2014",
      "origin": "Ontario",
      "eci": 0.352743082
    },
    {
      "year": "2015",
      "origin": "Ontario",
      "eci": 0.368997682
    },
    {
      "year": "2016",
      "origin": "Ontario",
      "eci": 0.319330492
    },
    {
      "year": "2017",
      "origin": "Ontario",
      "eci": 0.255243193
    },
    {
      "year": "2018",
      "origin": "Ontario",
      "eci": 0.244171395
    },
    {
      "year": "2019",
      "origin": "Ontario",
      "eci": 0.264988087
    },
    {
      "year": "2020",
      "origin": "Ontario",
      "eci": 0.226013345
    },
    {
      "year": "2021",
      "origin": "Ontario",
      "eci": 0.236488443
    },
    {
      "year": "2022",
      "origin": "Ontario",
      "eci": 0.240777168
    },
    {
      "year": "2023",
      "origin": "Ontario",
      "eci": 0.202218095
    },
    {
      "year": "1998",
      "origin": "Prince Edward Island",
      "eci": 0.058692165
    },
    {
      "year": "1999",
      "origin": "Prince Edward Island",
      "eci": 0.077690678
    },
    {
      "year": "2000",
      "origin": "Prince Edward Island",
      "eci": 0.166036285
    },
    {
      "year": "2001",
      "origin": "Prince Edward Island",
      "eci": 0.136673416
    },
    {
      "year": "2002",
      "origin": "Prince Edward Island",
      "eci": 0.074692014
    },
    {
      "year": "2003",
      "origin": "Prince Edward Island",
      "eci": 0.12478403
    },
    {
      "year": "2004",
      "origin": "Prince Edward Island",
      "eci": 0.118020103
    },
    {
      "year": "2005",
      "origin": "Prince Edward Island",
      "eci": 0.18200247
    },
    {
      "year": "2006",
      "origin": "Prince Edward Island",
      "eci": 0.196581464
    },
    {
      "year": "2007",
      "origin": "Prince Edward Island",
      "eci": 0.164514011
    },
    {
      "year": "2008",
      "origin": "Prince Edward Island",
      "eci": 0.120669084
    },
    {
      "year": "2009",
      "origin": "Prince Edward Island",
      "eci": 0.163706864
    },
    {
      "year": "2010",
      "origin": "Prince Edward Island",
      "eci": 0.081682653
    },
    {
      "year": "2011",
      "origin": "Prince Edward Island",
      "eci": 0.117182071
    },
    {
      "year": "2012",
      "origin": "Prince Edward Island",
      "eci": 0.086772516
    },
    {
      "year": "2013",
      "origin": "Prince Edward Island",
      "eci": 0.095739234
    },
    {
      "year": "2014",
      "origin": "Prince Edward Island",
      "eci": 0.147746532
    },
    {
      "year": "2015",
      "origin": "Prince Edward Island",
      "eci": 0.143562133
    },
    {
      "year": "2016",
      "origin": "Prince Edward Island",
      "eci": 0.088443703
    },
    {
      "year": "2017",
      "origin": "Prince Edward Island",
      "eci": -0.013621499
    },
    {
      "year": "2018",
      "origin": "Prince Edward Island",
      "eci": 0.036819841
    },
    {
      "year": "2019",
      "origin": "Prince Edward Island",
      "eci": 0.07000133
    },
    {
      "year": "2020",
      "origin": "Prince Edward Island",
      "eci": -0.00124347
    },
    {
      "year": "2021",
      "origin": "Prince Edward Island",
      "eci": 0.021570375
    },
    {
      "year": "2022",
      "origin": "Prince Edward Island",
      "eci": 0.069235556
    },
    {
      "year": "2023",
      "origin": "Prince Edward Island",
      "eci": 0.030964278
    },
    {
      "year": "1998",
      "origin": "Quebec",
      "eci": 0.156203577
    },
    {
      "year": "1999",
      "origin": "Quebec",
      "eci": 0.112732829
    },
    {
      "year": "2000",
      "origin": "Quebec",
      "eci": 0.111094295
    },
    {
      "year": "2001",
      "origin": "Quebec",
      "eci": 0.129936912
    },
    {
      "year": "2002",
      "origin": "Quebec",
      "eci": 0.107579868
    },
    {
      "year": "2003",
      "origin": "Quebec",
      "eci": 0.11515255
    },
    {
      "year": "2004",
      "origin": "Quebec",
      "eci": 0.097695625
    },
    {
      "year": "2005",
      "origin": "Quebec",
      "eci": 0.124093235
    },
    {
      "year": "2006",
      "origin": "Quebec",
      "eci": 0.1638991
    },
    {
      "year": "2007",
      "origin": "Quebec",
      "eci": 0.177541118
    },
    {
      "year": "2008",
      "origin": "Quebec",
      "eci": 0.172327583
    },
    {
      "year": "2009",
      "origin": "Quebec",
      "eci": 0.206413639
    },
    {
      "year": "2010",
      "origin": "Quebec",
      "eci": 0.182299503
    },
    {
      "year": "2011",
      "origin": "Quebec",
      "eci": 0.201079516
    },
    {
      "year": "2012",
      "origin": "Quebec",
      "eci": 0.184551444
    },
    {
      "year": "2013",
      "origin": "Quebec",
      "eci": 0.217576241
    },
    {
      "year": "2014",
      "origin": "Quebec",
      "eci": 0.207975911
    },
    {
      "year": "2015",
      "origin": "Quebec",
      "eci": 0.195983897
    },
    {
      "year": "2016",
      "origin": "Quebec",
      "eci": 0.162817227
    },
    {
      "year": "2017",
      "origin": "Quebec",
      "eci": 0.08740171
    },
    {
      "year": "2018",
      "origin": "Quebec",
      "eci": 0.092612207
    },
    {
      "year": "2019",
      "origin": "Quebec",
      "eci": 0.117730716
    },
    {
      "year": "2020",
      "origin": "Quebec",
      "eci": 0.101356896
    },
    {
      "year": "2021",
      "origin": "Quebec",
      "eci": 0.113181551
    },
    {
      "year": "2022",
      "origin": "Quebec",
      "eci": 0.107285379
    },
    {
      "year": "2023",
      "origin": "Quebec",
      "eci": 0.055547407
    },
    {
      "year": "1998",
      "origin": "Saskatchewan",
      "eci": 0.145003348
    },
    {
      "year": "1999",
      "origin": "Saskatchewan",
      "eci": 0.057402017
    },
    {
      "year": "2000",
      "origin": "Saskatchewan",
      "eci": 0.131709623
    },
    {
      "year": "2001",
      "origin": "Saskatchewan",
      "eci": 0.123029186
    },
    {
      "year": "2002",
      "origin": "Saskatchewan",
      "eci": 0.116747597
    },
    {
      "year": "2003",
      "origin": "Saskatchewan",
      "eci": 0.10169047
    },
    {
      "year": "2004",
      "origin": "Saskatchewan",
      "eci": 0.069246514
    },
    {
      "year": "2005",
      "origin": "Saskatchewan",
      "eci": 0.072507553
    },
    {
      "year": "2006",
      "origin": "Saskatchewan",
      "eci": 0.07047199
    },
    {
      "year": "2007",
      "origin": "Saskatchewan",
      "eci": 0.079831194
    },
    {
      "year": "2008",
      "origin": "Saskatchewan",
      "eci": -0.038264525
    },
    {
      "year": "2009",
      "origin": "Saskatchewan",
      "eci": -0.029754102
    },
    {
      "year": "2010",
      "origin": "Saskatchewan",
      "eci": -0.083049466
    },
    {
      "year": "2011",
      "origin": "Saskatchewan",
      "eci": -0.103975547
    },
    {
      "year": "2012",
      "origin": "Saskatchewan",
      "eci": -0.165313016
    },
    {
      "year": "2013",
      "origin": "Saskatchewan",
      "eci": -0.130625863
    },
    {
      "year": "2014",
      "origin": "Saskatchewan",
      "eci": -0.208759532
    },
    {
      "year": "2015",
      "origin": "Saskatchewan",
      "eci": -0.189336416
    },
    {
      "year": "2016",
      "origin": "Saskatchewan",
      "eci": -0.227074521
    },
    {
      "year": "2017",
      "origin": "Saskatchewan",
      "eci": -0.276394413
    },
    {
      "year": "2018",
      "origin": "Saskatchewan",
      "eci": -0.325711755
    },
    {
      "year": "2019",
      "origin": "Saskatchewan",
      "eci": -0.227775305
    },
    {
      "year": "2020",
      "origin": "Saskatchewan",
      "eci": -0.249795959
    },
    {
      "year": "2021",
      "origin": "Saskatchewan",
      "eci": -0.236089698
    },
    {
      "year": "2022",
      "origin": "Saskatchewan",
      "eci": -0.15870651
    },
    {
      "year": "2023",
      "origin": "Saskatchewan",
      "eci": -0.272219653
    }
  ];

  constructor() {}

  /**
   * Load ECI data from static data - all provinces
   */
 loadECIData(): Observable<ECIRawDataItem[]> {
    return of(ECIChartService.ECI_DATA).pipe(
      map(data => data.map(item => ({
        ...item,
        id: `${item.origin.replace(/\s+/g, '-')}-${item.year}` // Create unique ID like "Alberta-1998"
      })))
    );
  }

  /**
   * Load ECI data for specific provinces only
   */
  loadECIDataForProvinces(provinces: string[]): Observable<ECIRawDataItem[]> {
    
    const filteredData = ECIChartService.ECI_DATA.filter(item => 
      provinces.includes(item.origin)
    );

    return of(filteredData)
  }

  /**
   * Simple trend calculation helper
   */
  private calculateSimpleTrend(values: number[]): 'up' | 'down' | 'stable' {
    if (values.length < 2) return 'stable';
    
    const first = values[0];
    const last = values[values.length - 1];
    const difference = last - first;
    
    if (Math.abs(difference) < 0.05) return 'stable';
    return difference > 0 ? 'up' : 'down';
  }

  /**
   * Transform raw data into line chart format
   */
  transformDataToLines(rawData: ECIRawDataItem[]): ECILineData[] {

    const groupedData: { [province: string]: ECIDataPoint[] } = {};

    // Group data by province
    rawData.forEach(item => {
      const province = item.origin;
      const year = parseInt(item.year.toString());
      const eci = parseFloat(item.eci.toString());

      if (!groupedData[province]) {
        groupedData[province] = [];
      }

      groupedData[province].push({
        year: year,
        eci: eci,
        id: item.id
      });
    });

    // Convert to line data format and sort by year
    const lineData: ECILineData[] = Object.keys(groupedData).map(province => ({
      name: province,
      values: groupedData[province].sort((a, b) => a.year - b.year)
    }));

    console.log('✅ Transformed to line data:', {
      lineCount: lineData.length,
      provinces: lineData.map(line => ({
        name: line.name,
        shortName: this.getProvinceShortName(line.name),
        dataPoints: line.values.length,
        yearRange: {
          min: Math.min(...line.values.map(v => v.year)),
          max: Math.max(...line.values.map(v => v.year))
        },
        eciRange: {
          min: Math.min(...line.values.map(v => v.eci)).toFixed(3),
          max: Math.max(...line.values.map(v => v.eci)).toFixed(3)
        },
        latest: line.values[line.values.length - 1]
      }))
    });

    return lineData;
  }

  /**
   * Calculate chart statistics
   */
  calculateChartStats(lineData: ECILineData[]): ECIChartStats {
    let allYears: number[] = [];
    let allECIs: number[] = [];
    let totalDataPoints = 0;

    lineData.forEach(line => {
      line.values.forEach(point => {
        allYears.push(point.year);
        allECIs.push(point.eci);
        totalDataPoints++;
      });
    });

    const stats = {
      provinceCount: lineData.length,
      yearRange: {
        min: Math.min(...allYears),
        max: Math.max(...allYears)
      },
      eciRange: {
        min: Math.min(...allECIs),
        max: Math.max(...allECIs)
      },
      dataPoints: totalDataPoints
    };

    console.log('📈 Calculated chart stats:', stats);

    return stats;
  }

  /**
   * Get province short name
   */
  getProvinceShortName(fullName: string): string {
    return this.provinceMapping[fullName] || fullName;
  }

  /**
   * Get all available provinces
   */
  getAvailableProvinces(lineData: ECILineData[]): string[] {
    const provinces = lineData.map(line => line.name);
    console.log('📊 Available provinces:', provinces.map(p => `${p} (${this.getProvinceShortName(p)})`));
    return provinces;
  }

  /**
   * Filter data for specific provinces
   */
  filterProvinces(lineData: ECILineData[], selectedProvinces: string[]): ECILineData[] {
    const filtered = lineData.filter(line => selectedProvinces.includes(line.name));
    console.log(`🔍 Filtered provinces from ${lineData.length} to ${filtered.length}:`, 
      filtered.map(line => `${line.name} (${this.getProvinceShortName(line.name)})`));
    return filtered;
  }

  /**
   * Get data for a specific year
   */
  getDataForYear(lineData: ECILineData[], targetYear: number): { province: string; eci: number }[] {
    const result: { province: string; eci: number }[] = [];

    lineData.forEach(line => {
      const yearData = line.values.find(point => point.year === targetYear);
      if (yearData) {
        result.push({
          province: line.name,
          eci: yearData.eci
        });
      }
    });

    const sorted = result.sort((a, b) => b.eci - a.eci);
    console.log(`📊 ECI data for year ${targetYear}:`, sorted.map(d => 
      `${this.getProvinceShortName(d.province)}: ${d.eci.toFixed(3)}`
    ));
    
    return sorted;
  }

  /**
   * Find closest data point to mouse position
   */
  findClosestDataPoint(
    lineData: ECILineData[], 
    targetYear: number, 
    targetProvince?: string
  ): { province: string; year: number; eci: number } | null {
    
    if (targetProvince) {
      const line = lineData.find(l => l.name === targetProvince);
      if (line) {
        const closestPoint = line.values.reduce((prev, curr) => 
          Math.abs(curr.year - targetYear) < Math.abs(prev.year - targetYear) ? curr : prev
        );
        return {
          province: targetProvince,
          year: closestPoint.year,
          eci: closestPoint.eci
        };
      }
    }

    // Find closest across all provinces
    let closest: { province: string; year: number; eci: number } | null = null;
    let minDistance = Infinity;

    lineData.forEach(line => {
      line.values.forEach(point => {
        const distance = Math.abs(point.year - targetYear);
        if (distance < minDistance) {
          minDistance = distance;
          closest = {
            province: line.name,
            year: point.year,
            eci: point.eci
          };
        }
      });
    });

    return closest;
  }

  /**
   * Export data to CSV format
   */
  exportToCSV(lineData: ECILineData[]): string {
    const headers = ['Province', 'Province_Short', 'Year', 'ECI'];
    const rows: string[] = [headers.join(',')];

    lineData.forEach(line => {
      line.values.forEach(point => {
        rows.push(`${line.name},${this.getProvinceShortName(line.name)},${point.year},${point.eci}`);
      });
    });

    console.log('📊 Exported ECI data to CSV:', rows.length - 1, 'data rows');
    
    return rows.join('\n');
  }

  /**
   * Validate ECI data format
   */
  validateData(data: ECIRawDataItem[]): boolean {
    if (!Array.isArray(data) || data.length === 0) {
      console.warn('⚠️ ECI data validation failed: empty or invalid array');
      return false;
    }

    const isValid = data.every((item, index) => {
      const valid = (
        item.hasOwnProperty('year') &&
        item.hasOwnProperty('origin') &&
        item.hasOwnProperty('eci') &&
        !isNaN(parseInt(item.year.toString())) &&
        !isNaN(parseFloat(item.eci.toString())) &&
        typeof item.origin === 'string'
      );

      if (!valid && index < 5) {
        console.warn('⚠️ Invalid ECI data item:', item);
      }

      return valid;
    });

    console.log(`✅ ECI data validation ${isValid ? 'passed' : 'failed'} for ${data.length} records`);

    return isValid;
  }

  /**
   * Get trending direction for a province
   */
  getTrendDirection(lineData: ECILineData[], provinceName: string): 'up' | 'down' | 'stable' {
    const line = lineData.find(l => l.name === provinceName);
    if (!line || line.values.length < 2) return 'stable';

    const values = line.values;
    const firstValue = values[0].eci;
    const lastValue = values[values.length - 1].eci;
    const difference = lastValue - firstValue;

    if (Math.abs(difference) < 0.05) return 'stable';
    return difference > 0 ? 'up' : 'down';
  }

  /**
   * Calculate average ECI for a province
   */
  getAverageECI(lineData: ECILineData[], provinceName: string): number {
    const line = lineData.find(l => l.name === provinceName);
    if (!line || line.values.length === 0) return 0;

    const sum = line.values.reduce((acc, point) => acc + point.eci, 0);
    return sum / line.values.length;
  }

  /**
   * Get latest available year from data
   */
  getLatestYear(lineData: ECILineData[]): number {
    let maxYear = 0;
    lineData.forEach(line => {
      line.values.forEach(point => {
        if (point.year > maxYear) {
          maxYear = point.year;
        }
      });
    });
    return maxYear;
  }

  /**
   * Refresh ECI data for a specific province (simulated for static data)
   */
  refreshProvinceData(province: string): Observable<ECIRawDataItem[]> {
    console.log('🔄 Refreshing static ECI data for province:', province);
    
    const provinceData = ECIChartService.ECI_DATA.filter(item => item.origin === province);
    
    return of(provinceData).pipe(
      tap(data => console.log('✅ Refreshed static ECI data for', province, ':', data.length, 'records'))
    );
  }

  /**
   * Get static data summary for debugging
   */
  getDataSummary(): void {
    console.group('📊 Static ECI Data Summary');
    
    const provinces = [...new Set(ECIChartService.ECI_DATA.map(d => d.origin))];
    
    provinces.forEach(province => {
      const provinceData = ECIChartService.ECI_DATA.filter(d => d.origin === province);
      const years = provinceData.map(d => parseInt(d.year.toString()));
      const ecis = provinceData.map(d => parseFloat(d.eci.toString()));
      
      console.log(`🏛️ ${province} (${this.getProvinceShortName(province)}):`, {
        dataPoints: provinceData.length,
        yearRange: `${Math.min(...years)} - ${Math.max(...years)}`,
        eciRange: `${Math.min(...ecis).toFixed(3)} - ${Math.max(...ecis).toFixed(3)}`,
        avgECI: (ecis.reduce((a, b) => a + b, 0) / ecis.length).toFixed(3),
        trend: this.calculateSimpleTrend(ecis),
        latestECI: ecis[ecis.length - 1]?.toFixed(3),
        sampleData: provinceData.slice(0, 3)
      });
    });
    
    console.groupEnd();
  }
}