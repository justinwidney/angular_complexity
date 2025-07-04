// product-space-chart.service.ts

import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, of } from 'rxjs';
import { Link, Node, GroupedData, HSDescription, RawNode } from './product-space-chart.models';
import { RawTradeData, UnifiedDataService } from '../service/chart-data-service';

@Injectable({
  providedIn: 'root'
})
export class ProductSpaceChartService {

  // Your links data
  private rawLinks = [
    {
    "source": 101,
    "target": 3501
  },
  {
    "source": 101,
    "target": 204
  },
  {
    "source": 101,
    "target": 1107
  },
  {
    "source": 101,
    "target": 2004
  },
  {
    "source": 101,
    "target": 1214
  },
  {
    "source": 102,
    "target": 201
  },
  {
    "source": 102,
    "target": 104
  },
  {
    "source": 102,
    "target": 4101
  },
  {
    "source": 102,
    "target": 1104
  },
  {
    "source": 102,
    "target": 105
  },
  {
    "source": 103,
    "target": 203
  },
  {
    "source": 103,
    "target": 4411
  },
  {
    "source": 103,
    "target": 1518
  },
  {
    "source": 103,
    "target": 401
  },
  {
    "source": 103,
    "target": 210
  },
  {
    "source": 104,
    "target": 102
  },
  {
    "source": 104,
    "target": 4102
  },
  {
    "source": 104,
    "target": 4105
  },
  {
    "source": 104,
    "target": 4106
  },
  {
    "source": 104,
    "target": 204
  },
  {
    "source": 105,
    "target": 407
  },
  {
    "source": 105,
    "target": 2309
  },
  {
    "source": 105,
    "target": 102
  },
  {
    "source": 105,
    "target": 1702
  },
  {
    "source": 105,
    "target": 2207
  },
  {
    "source": 201,
    "target": 206
  },
  {
    "source": 201,
    "target": 202
  },
  {
    "source": 201,
    "target": 102
  },
  {
    "source": 201,
    "target": 1602
  },
  {
    "source": 201,
    "target": 1502
  },
  {
    "source": 202,
    "target": 206
  },
  {
    "source": 202,
    "target": 201
  },
  {
    "source": 202,
    "target": 1502
  },
  {
    "source": 202,
    "target": 4104
  },
  {
    "source": 202,
    "target": 402
  },
  {
    "source": 203,
    "target": 8436
  },
  {
    "source": 203,
    "target": 207
  },
  {
    "source": 203,
    "target": 103
  },
  {
    "source": 203,
    "target": 206
  },
  {
    "source": 203,
    "target": 210
  },
  {
    "source": 204,
    "target": 4102
  },
  {
    "source": 204,
    "target": 5101
  },
  {
    "source": 204,
    "target": 101
  },
  {
    "source": 204,
    "target": 104
  },
  {
    "source": 204,
    "target": 1214
  },
  {
    "source": 206,
    "target": 201
  },
  {
    "source": 206,
    "target": 202
  },
  {
    "source": 206,
    "target": 504
  },
  {
    "source": 206,
    "target": 1502
  },
  {
    "source": 206,
    "target": 203
  },
  {
    "source": 207,
    "target": 1602
  },
  {
    "source": 207,
    "target": 203
  },
  {
    "source": 207,
    "target": 2303
  },
  {
    "source": 207,
    "target": 407
  },
  {
    "source": 207,
    "target": 210
  },
  {
    "source": 208,
    "target": 4302
  },
  {
    "source": 208,
    "target": 1214
  },
  {
    "source": 208,
    "target": 1107
  },
  {
    "source": 208,
    "target": 4813
  },
  {
    "source": 208,
    "target": 4303
  },
  {
    "source": 210,
    "target": 1602
  },
  {
    "source": 210,
    "target": 1601
  },
  {
    "source": 210,
    "target": 203
  },
  {
    "source": 210,
    "target": 103
  },
  {
    "source": 210,
    "target": 207
  },
  {
    "source": 301,
    "target": 307
  },
  {
    "source": 301,
    "target": 4602
  },
  {
    "source": 301,
    "target": 1212
  },
  {
    "source": 301,
    "target": 6704
  },
  {
    "source": 301,
    "target": 8902
  },
  {
    "source": 302,
    "target": 305
  },
  {
    "source": 302,
    "target": 303
  },
  {
    "source": 302,
    "target": 304
  },
  {
    "source": 302,
    "target": 307
  },
  {
    "source": 302,
    "target": 1504
  },
  {
    "source": 303,
    "target": 304
  },
  {
    "source": 303,
    "target": 302
  },
  {
    "source": 303,
    "target": 305
  },
  {
    "source": 303,
    "target": 1604
  },
  {
    "source": 303,
    "target": 8902
  },
  {
    "source": 304,
    "target": 303
  },
  {
    "source": 304,
    "target": 1604
  },
  {
    "source": 304,
    "target": 305
  },
  {
    "source": 304,
    "target": 302
  },
  {
    "source": 304,
    "target": 8902
  },
  {
    "source": 305,
    "target": 302
  },
  {
    "source": 305,
    "target": 1604
  },
  {
    "source": 305,
    "target": 304
  },
  {
    "source": 305,
    "target": 303
  },
  {
    "source": 305,
    "target": 1605
  },
  {
    "source": 306,
    "target": 1605
  },
  {
    "source": 306,
    "target": 307
  },
  {
    "source": 306,
    "target": 8902
  },
  {
    "source": 306,
    "target": 511
  },
  {
    "source": 306,
    "target": 1504
  },
  {
    "source": 307,
    "target": 1605
  },
  {
    "source": 307,
    "target": 306
  },
  {
    "source": 307,
    "target": 302
  },
  {
    "source": 307,
    "target": 2301
  },
  {
    "source": 307,
    "target": 301
  },
  {
    "source": 401,
    "target": 403
  },
  {
    "source": 401,
    "target": 405
  },
  {
    "source": 401,
    "target": 1602
  },
  {
    "source": 401,
    "target": 407
  },
  {
    "source": 401,
    "target": 103
  },
  {
    "source": 402,
    "target": 405
  },
  {
    "source": 402,
    "target": 1901
  },
  {
    "source": 402,
    "target": 3501
  },
  {
    "source": 402,
    "target": 202
  },
  {
    "source": 402,
    "target": 1701
  },
  {
    "source": 403,
    "target": 401
  },
  {
    "source": 403,
    "target": 406
  },
  {
    "source": 403,
    "target": 2105
  },
  {
    "source": 403,
    "target": 404
  },
  {
    "source": 403,
    "target": 2202
  },
  {
    "source": 404,
    "target": 3501
  },
  {
    "source": 404,
    "target": 8434
  },
  {
    "source": 404,
    "target": 405
  },
  {
    "source": 404,
    "target": 406
  },
  {
    "source": 404,
    "target": 403
  },
  {
    "source": 405,
    "target": 3501
  },
  {
    "source": 405,
    "target": 404
  },
  {
    "source": 405,
    "target": 402
  },
  {
    "source": 405,
    "target": 406
  },
  {
    "source": 405,
    "target": 401
  },
  {
    "source": 406,
    "target": 403
  },
  {
    "source": 406,
    "target": 8434
  },
  {
    "source": 406,
    "target": 1806
  },
  {
    "source": 406,
    "target": 404
  },
  {
    "source": 406,
    "target": 405
  },
  {
    "source": 407,
    "target": 105
  },
  {
    "source": 407,
    "target": 207
  },
  {
    "source": 407,
    "target": 6809
  },
  {
    "source": 407,
    "target": 602
  },
  {
    "source": 407,
    "target": 401
  },
  {
    "source": 409,
    "target": 1108
  },
  {
    "source": 409,
    "target": 1209
  },
  {
    "source": 409,
    "target": 2009
  },
  {
    "source": 409,
    "target": 4101
  },
  {
    "source": 409,
    "target": 5105
  },
  {
    "source": 504,
    "target": 206
  },
  {
    "source": 504,
    "target": 806
  },
  {
    "source": 504,
    "target": 1214
  },
  {
    "source": 504,
    "target": 5101
  },
  {
    "source": 504,
    "target": 1209
  },
  {
    "source": 511,
    "target": 2301
  },
  {
    "source": 511,
    "target": 1504
  },
  {
    "source": 511,
    "target": 8902
  },
  {
    "source": 511,
    "target": 306
  },
  {
    "source": 511,
    "target": 4909
  },
  {
    "source": 601,
    "target": 604
  },
  {
    "source": 601,
    "target": 603
  },
  {
    "source": 601,
    "target": 5105
  },
  {
    "source": 601,
    "target": 5101
  },
  {
    "source": 601,
    "target": 902
  },
  {
    "source": 602,
    "target": 407
  },
  {
    "source": 602,
    "target": 709
  },
  {
    "source": 602,
    "target": 604
  },
  {
    "source": 602,
    "target": 1209
  },
  {
    "source": 602,
    "target": 603
  },
  {
    "source": 603,
    "target": 602
  },
  {
    "source": 603,
    "target": 604
  },
  {
    "source": 603,
    "target": 601
  },
  {
    "source": 603,
    "target": 901
  },
  {
    "source": 603,
    "target": 904
  },
  {
    "source": 604,
    "target": 602
  },
  {
    "source": 604,
    "target": 3915
  },
  {
    "source": 604,
    "target": 601
  },
  {
    "source": 604,
    "target": 603
  },
  {
    "source": 604,
    "target": 904
  },
  {
    "source": 701,
    "target": 706
  },
  {
    "source": 701,
    "target": 703
  },
  {
    "source": 701,
    "target": 1209
  },
  {
    "source": 701,
    "target": 705
  },
  {
    "source": 701,
    "target": 707
  },
  {
    "source": 702,
    "target": 707
  },
  {
    "source": 702,
    "target": 706
  },
  {
    "source": 702,
    "target": 704
  },
  {
    "source": 702,
    "target": 705
  },
  {
    "source": 702,
    "target": 810
  },
  {
    "source": 703,
    "target": 712
  },
  {
    "source": 703,
    "target": 806
  },
  {
    "source": 703,
    "target": 701
  },
  {
    "source": 703,
    "target": 1209
  },
  {
    "source": 703,
    "target": 713
  },
  {
    "source": 704,
    "target": 706
  },
  {
    "source": 704,
    "target": 702
  },
  {
    "source": 704,
    "target": 705
  },
  {
    "source": 704,
    "target": 810
  },
  {
    "source": 704,
    "target": 808
  },
  {
    "source": 705,
    "target": 704
  },
  {
    "source": 705,
    "target": 702
  },
  {
    "source": 705,
    "target": 706
  },
  {
    "source": 705,
    "target": 701
  },
  {
    "source": 705,
    "target": 1509
  },
  {
    "source": 706,
    "target": 704
  },
  {
    "source": 706,
    "target": 702
  },
  {
    "source": 706,
    "target": 701
  },
  {
    "source": 706,
    "target": 808
  },
  {
    "source": 706,
    "target": 705
  },
  {
    "source": 707,
    "target": 702
  },
  {
    "source": 707,
    "target": 2001
  },
  {
    "source": 707,
    "target": 709
  },
  {
    "source": 707,
    "target": 809
  },
  {
    "source": 707,
    "target": 701
  },
  {
    "source": 708,
    "target": 713
  },
  {
    "source": 708,
    "target": 910
  },
  {
    "source": 708,
    "target": 1701
  },
  {
    "source": 708,
    "target": 1202
  },
  {
    "source": 708,
    "target": 804
  },
  {
    "source": 709,
    "target": 710
  },
  {
    "source": 709,
    "target": 810
  },
  {
    "source": 709,
    "target": 807
  },
  {
    "source": 709,
    "target": 707
  },
  {
    "source": 709,
    "target": 602
  },
  {
    "source": 710,
    "target": 2005
  },
  {
    "source": 710,
    "target": 811
  },
  {
    "source": 710,
    "target": 712
  },
  {
    "source": 710,
    "target": 709
  },
  {
    "source": 710,
    "target": 3924
  },
  {
    "source": 712,
    "target": 710
  },
  {
    "source": 712,
    "target": 703
  },
  {
    "source": 712,
    "target": 813
  },
  {
    "source": 712,
    "target": 1211
  },
  {
    "source": 712,
    "target": 2515
  },
  {
    "source": 713,
    "target": 1207
  },
  {
    "source": 713,
    "target": 708
  },
  {
    "source": 713,
    "target": 1202
  },
  {
    "source": 713,
    "target": 703
  },
  {
    "source": 713,
    "target": 1007
  },
  {
    "source": 714,
    "target": 801
  },
  {
    "source": 714,
    "target": 804
  },
  {
    "source": 714,
    "target": 803
  },
  {
    "source": 714,
    "target": 1006
  },
  {
    "source": 714,
    "target": 1513
  },
  {
    "source": 801,
    "target": 714
  },
  {
    "source": 801,
    "target": 1513
  },
  {
    "source": 801,
    "target": 1804
  },
  {
    "source": 801,
    "target": 4420
  },
  {
    "source": 801,
    "target": 4001
  },
  {
    "source": 802,
    "target": 2002
  },
  {
    "source": 802,
    "target": 1211
  },
  {
    "source": 802,
    "target": 7801
  },
  {
    "source": 802,
    "target": 1212
  },
  {
    "source": 802,
    "target": 2520
  },
  {
    "source": 803,
    "target": 714
  },
  {
    "source": 803,
    "target": 807
  },
  {
    "source": 803,
    "target": 901
  },
  {
    "source": 803,
    "target": 1006
  },
  {
    "source": 803,
    "target": 1805
  },
  {
    "source": 804,
    "target": 910
  },
  {
    "source": 804,
    "target": 714
  },
  {
    "source": 804,
    "target": 807
  },
  {
    "source": 804,
    "target": 1515
  },
  {
    "source": 804,
    "target": 708
  },
  {
    "source": 805,
    "target": 1509
  },
  {
    "source": 805,
    "target": 2009
  },
  {
    "source": 805,
    "target": 3301
  },
  {
    "source": 805,
    "target": 807
  },
  {
    "source": 805,
    "target": 2520
  },
  {
    "source": 806,
    "target": 809
  },
  {
    "source": 806,
    "target": 808
  },
  {
    "source": 806,
    "target": 813
  },
  {
    "source": 806,
    "target": 504
  },
  {
    "source": 806,
    "target": 703
  },
  {
    "source": 807,
    "target": 709
  },
  {
    "source": 807,
    "target": 804
  },
  {
    "source": 807,
    "target": 803
  },
  {
    "source": 807,
    "target": 2009
  },
  {
    "source": 807,
    "target": 805
  },
  {
    "source": 808,
    "target": 809
  },
  {
    "source": 808,
    "target": 810
  },
  {
    "source": 808,
    "target": 806
  },
  {
    "source": 808,
    "target": 706
  },
  {
    "source": 808,
    "target": 704
  },
  {
    "source": 809,
    "target": 808
  },
  {
    "source": 809,
    "target": 810
  },
  {
    "source": 809,
    "target": 806
  },
  {
    "source": 809,
    "target": 813
  },
  {
    "source": 809,
    "target": 707
  },
  {
    "source": 810,
    "target": 809
  },
  {
    "source": 810,
    "target": 808
  },
  {
    "source": 810,
    "target": 702
  },
  {
    "source": 810,
    "target": 704
  },
  {
    "source": 810,
    "target": 709
  },
  {
    "source": 811,
    "target": 2005
  },
  {
    "source": 811,
    "target": 710
  },
  {
    "source": 811,
    "target": 2008
  },
  {
    "source": 811,
    "target": 2102
  },
  {
    "source": 811,
    "target": 4803
  },
  {
    "source": 813,
    "target": 809
  },
  {
    "source": 813,
    "target": 2001
  },
  {
    "source": 813,
    "target": 712
  },
  {
    "source": 813,
    "target": 806
  },
  {
    "source": 813,
    "target": 2008
  },
  {
    "source": 901,
    "target": 1801
  },
  {
    "source": 901,
    "target": 803
  },
  {
    "source": 901,
    "target": 603
  },
  {
    "source": 901,
    "target": 1803
  },
  {
    "source": 901,
    "target": 1511
  },
  {
    "source": 902,
    "target": 5201
  },
  {
    "source": 902,
    "target": 7801
  },
  {
    "source": 902,
    "target": 1006
  },
  {
    "source": 902,
    "target": 601
  },
  {
    "source": 902,
    "target": 2714
  },
  {
    "source": 904,
    "target": 910
  },
  {
    "source": 904,
    "target": 1516
  },
  {
    "source": 904,
    "target": 603
  },
  {
    "source": 904,
    "target": 1805
  },
  {
    "source": 904,
    "target": 604
  },
  {
    "source": 910,
    "target": 904
  },
  {
    "source": 910,
    "target": 804
  },
  {
    "source": 910,
    "target": 708
  },
  {
    "source": 910,
    "target": 2008
  },
  {
    "source": 910,
    "target": 2515
  },
  {
    "source": 1001,
    "target": 1003
  },
  {
    "source": 1001,
    "target": 1205
  },
  {
    "source": 1001,
    "target": 2303
  },
  {
    "source": 1001,
    "target": 8606
  },
  {
    "source": 1001,
    "target": 1206
  },
  {
    "source": 1003,
    "target": 1001
  },
  {
    "source": 1003,
    "target": 1514
  },
  {
    "source": 1003,
    "target": 1205
  },
  {
    "source": 1003,
    "target": 1107
  },
  {
    "source": 1003,
    "target": 1206
  },
  {
    "source": 1005,
    "target": 1201
  },
  {
    "source": 1005,
    "target": 1007
  },
  {
    "source": 1005,
    "target": 1104
  },
  {
    "source": 1005,
    "target": 1206
  },
  {
    "source": 1005,
    "target": 2304
  },
  {
    "source": 1006,
    "target": 714
  },
  {
    "source": 1006,
    "target": 2401
  },
  {
    "source": 1006,
    "target": 5201
  },
  {
    "source": 1006,
    "target": 803
  },
  {
    "source": 1006,
    "target": 902
  },
  {
    "source": 1007,
    "target": 1005
  },
  {
    "source": 1007,
    "target": 1201
  },
  {
    "source": 1007,
    "target": 1202
  },
  {
    "source": 1007,
    "target": 1208
  },
  {
    "source": 1007,
    "target": 713
  },
  {
    "source": 1101,
    "target": 3401
  },
  {
    "source": 1101,
    "target": 1103
  },
  {
    "source": 1101,
    "target": 2523
  },
  {
    "source": 1101,
    "target": 2302
  },
  {
    "source": 1101,
    "target": 7010
  },
  {
    "source": 1103,
    "target": 1101
  },
  {
    "source": 1103,
    "target": 2302
  },
  {
    "source": 1103,
    "target": 1104
  },
  {
    "source": 1103,
    "target": 3401
  },
  {
    "source": 1103,
    "target": 2501
  },
  {
    "source": 1104,
    "target": 1005
  },
  {
    "source": 1104,
    "target": 1103
  },
  {
    "source": 1104,
    "target": 102
  },
  {
    "source": 1104,
    "target": 1702
  },
  {
    "source": 1104,
    "target": 4101
  },
  {
    "source": 1107,
    "target": 1003
  },
  {
    "source": 1107,
    "target": 101
  },
  {
    "source": 1107,
    "target": 2102
  },
  {
    "source": 1107,
    "target": 208
  },
  {
    "source": 1107,
    "target": 2501
  },
  {
    "source": 1108,
    "target": 3505
  },
  {
    "source": 1108,
    "target": 1702
  },
  {
    "source": 1108,
    "target": 409
  },
  {
    "source": 1108,
    "target": 7010
  },
  {
    "source": 1108,
    "target": 2309
  },
  {
    "source": 1201,
    "target": 2304
  },
  {
    "source": 1201,
    "target": 1005
  },
  {
    "source": 1201,
    "target": 1007
  },
  {
    "source": 1201,
    "target": 1208
  },
  {
    "source": 1201,
    "target": 1512
  },
  {
    "source": 1202,
    "target": 5201
  },
  {
    "source": 1202,
    "target": 1207
  },
  {
    "source": 1202,
    "target": 1007
  },
  {
    "source": 1202,
    "target": 713
  },
  {
    "source": 1202,
    "target": 708
  },
  {
    "source": 1205,
    "target": 1514
  },
  {
    "source": 1205,
    "target": 1003
  },
  {
    "source": 1205,
    "target": 1001
  },
  {
    "source": 1205,
    "target": 2303
  },
  {
    "source": 1205,
    "target": 1206
  },
  {
    "source": 1206,
    "target": 1001
  },
  {
    "source": 1206,
    "target": 1205
  },
  {
    "source": 1206,
    "target": 8606
  },
  {
    "source": 1206,
    "target": 1005
  },
  {
    "source": 1206,
    "target": 1003
  },
  {
    "source": 1207,
    "target": 713
  },
  {
    "source": 1207,
    "target": 1202
  },
  {
    "source": 1207,
    "target": 1208
  },
  {
    "source": 1207,
    "target": 2306
  },
  {
    "source": 1207,
    "target": 5201
  },
  {
    "source": 1208,
    "target": 2306
  },
  {
    "source": 1208,
    "target": 2304
  },
  {
    "source": 1208,
    "target": 1007
  },
  {
    "source": 1208,
    "target": 1201
  },
  {
    "source": 1208,
    "target": 1207
  },
  {
    "source": 1209,
    "target": 602
  },
  {
    "source": 1209,
    "target": 504
  },
  {
    "source": 1209,
    "target": 701
  },
  {
    "source": 1209,
    "target": 703
  },
  {
    "source": 1209,
    "target": 409
  },
  {
    "source": 1211,
    "target": 712
  },
  {
    "source": 1211,
    "target": 1212
  },
  {
    "source": 1211,
    "target": 7801
  },
  {
    "source": 1211,
    "target": 3301
  },
  {
    "source": 1211,
    "target": 802
  },
  {
    "source": 1212,
    "target": 1211
  },
  {
    "source": 1212,
    "target": 4105
  },
  {
    "source": 1212,
    "target": 802
  },
  {
    "source": 1212,
    "target": 7801
  },
  {
    "source": 1212,
    "target": 301
  },
  {
    "source": 1214,
    "target": 504
  },
  {
    "source": 1214,
    "target": 5105
  },
  {
    "source": 1214,
    "target": 101
  },
  {
    "source": 1214,
    "target": 208
  },
  {
    "source": 1214,
    "target": 204
  },
  {
    "source": 1302,
    "target": 2939
  },
  {
    "source": 1302,
    "target": 9706
  },
  {
    "source": 1302,
    "target": 9703
  },
  {
    "source": 1302,
    "target": 9701
  },
  {
    "source": 1502,
    "target": 206
  },
  {
    "source": 1502,
    "target": 201
  },
  {
    "source": 1502,
    "target": 202
  },
  {
    "source": 1502,
    "target": 3501
  },
  {
    "source": 1502,
    "target": 2004
  },
  {
    "source": 1504,
    "target": 2301
  },
  {
    "source": 1504,
    "target": 1604
  },
  {
    "source": 1504,
    "target": 302
  },
  {
    "source": 1504,
    "target": 511
  },
  {
    "source": 1504,
    "target": 306
  },
  {
    "source": 1507,
    "target": 1517
  },
  {
    "source": 1507,
    "target": 1512
  },
  {
    "source": 1507,
    "target": 2207
  },
  {
    "source": 1507,
    "target": 2304
  },
  {
    "source": 1507,
    "target": 1701
  },
  {
    "source": 1509,
    "target": 2002
  },
  {
    "source": 1509,
    "target": 805
  },
  {
    "source": 1509,
    "target": 2515
  },
  {
    "source": 1509,
    "target": 705
  },
  {
    "source": 1509,
    "target": 1902
  },
  {
    "source": 1511,
    "target": 1513
  },
  {
    "source": 1511,
    "target": 1801
  },
  {
    "source": 1511,
    "target": 1516
  },
  {
    "source": 1511,
    "target": 4001
  },
  {
    "source": 1511,
    "target": 901
  },
  {
    "source": 1512,
    "target": 2306
  },
  {
    "source": 1512,
    "target": 2716
  },
  {
    "source": 1512,
    "target": 1507
  },
  {
    "source": 1512,
    "target": 2204
  },
  {
    "source": 1512,
    "target": 1201
  },
  {
    "source": 1513,
    "target": 1511
  },
  {
    "source": 1513,
    "target": 801
  },
  {
    "source": 1513,
    "target": 714
  },
  {
    "source": 1513,
    "target": 4001
  },
  {
    "source": 1513,
    "target": 1804
  },
  {
    "source": 1514,
    "target": 1205
  },
  {
    "source": 1514,
    "target": 8403
  },
  {
    "source": 1514,
    "target": 1003
  },
  {
    "source": 1514,
    "target": 4805
  },
  {
    "source": 1514,
    "target": 2303
  },
  {
    "source": 1515,
    "target": 1516
  },
  {
    "source": 1515,
    "target": 3401
  },
  {
    "source": 1515,
    "target": 804
  },
  {
    "source": 1515,
    "target": 1902
  },
  {
    "source": 1515,
    "target": 2002
  },
  {
    "source": 1516,
    "target": 1515
  },
  {
    "source": 1516,
    "target": 1517
  },
  {
    "source": 1516,
    "target": 1902
  },
  {
    "source": 1516,
    "target": 1511
  },
  {
    "source": 1516,
    "target": 904
  },
  {
    "source": 1517,
    "target": 1901
  },
  {
    "source": 1517,
    "target": 1516
  },
  {
    "source": 1517,
    "target": 1520
  },
  {
    "source": 1517,
    "target": 1519
  },
  {
    "source": 1517,
    "target": 1507
  },
  {
    "source": 1518,
    "target": 103
  },
  {
    "source": 1518,
    "target": 6809
  },
  {
    "source": 1518,
    "target": 5601
  },
  {
    "source": 1518,
    "target": 2620
  },
  {
    "source": 1518,
    "target": 1520
  },
  {
    "source": 1519,
    "target": 1520
  },
  {
    "source": 1519,
    "target": 3505
  },
  {
    "source": 1519,
    "target": 1517
  },
  {
    "source": 1519,
    "target": 2403
  },
  {
    "source": 1519,
    "target": 2101
  },
  {
    "source": 1520,
    "target": 1519
  },
  {
    "source": 1520,
    "target": 4012
  },
  {
    "source": 1520,
    "target": 4813
  },
  {
    "source": 1520,
    "target": 1518
  },
  {
    "source": 1520,
    "target": 1517
  },
  {
    "source": 1601,
    "target": 1602
  },
  {
    "source": 1601,
    "target": 3925
  },
  {
    "source": 1601,
    "target": 2105
  },
  {
    "source": 1601,
    "target": 4415
  },
  {
    "source": 1601,
    "target": 210
  },
  {
    "source": 1602,
    "target": 1601
  },
  {
    "source": 1602,
    "target": 210
  },
  {
    "source": 1602,
    "target": 207
  },
  {
    "source": 1602,
    "target": 201
  },
  {
    "source": 1602,
    "target": 401
  },
  {
    "source": 1604,
    "target": 305
  },
  {
    "source": 1604,
    "target": 304
  },
  {
    "source": 1604,
    "target": 2301
  },
  {
    "source": 1604,
    "target": 303
  },
  {
    "source": 1604,
    "target": 1504
  },
  {
    "source": 1605,
    "target": 306
  },
  {
    "source": 1605,
    "target": 307
  },
  {
    "source": 1605,
    "target": 305
  },
  {
    "source": 1605,
    "target": 5608
  },
  {
    "source": 1605,
    "target": 2301
  },
  {
    "source": 1701,
    "target": 2207
  },
  {
    "source": 1701,
    "target": 708
  },
  {
    "source": 1701,
    "target": 2302
  },
  {
    "source": 1701,
    "target": 402
  },
  {
    "source": 1701,
    "target": 1507
  },
  {
    "source": 1702,
    "target": 1104
  },
  {
    "source": 1702,
    "target": 2309
  },
  {
    "source": 1702,
    "target": 2004
  },
  {
    "source": 1702,
    "target": 1108
  },
  {
    "source": 1702,
    "target": 105
  },
  {
    "source": 1704,
    "target": 1905
  },
  {
    "source": 1704,
    "target": 1806
  },
  {
    "source": 1704,
    "target": 4819
  },
  {
    "source": 1704,
    "target": 1904
  },
  {
    "source": 1704,
    "target": 3401
  },
  {
    "source": 1801,
    "target": 1511
  },
  {
    "source": 1801,
    "target": 901
  },
  {
    "source": 1801,
    "target": 1804
  },
  {
    "source": 1801,
    "target": 1803
  },
  {
    "source": 1801,
    "target": 4001
  },
  {
    "source": 1803,
    "target": 1804
  },
  {
    "source": 1803,
    "target": 1805
  },
  {
    "source": 1803,
    "target": 1801
  },
  {
    "source": 1803,
    "target": 4001
  },
  {
    "source": 1803,
    "target": 901
  },
  {
    "source": 1804,
    "target": 1803
  },
  {
    "source": 1804,
    "target": 1805
  },
  {
    "source": 1804,
    "target": 1801
  },
  {
    "source": 1804,
    "target": 801
  },
  {
    "source": 1804,
    "target": 1513
  },
  {
    "source": 1805,
    "target": 1804
  },
  {
    "source": 1805,
    "target": 1803
  },
  {
    "source": 1805,
    "target": 904
  },
  {
    "source": 1805,
    "target": 2401
  },
  {
    "source": 1805,
    "target": 803
  },
  {
    "source": 1806,
    "target": 1704
  },
  {
    "source": 1806,
    "target": 4808
  },
  {
    "source": 1806,
    "target": 406
  },
  {
    "source": 1806,
    "target": 4410
  },
  {
    "source": 1806,
    "target": 2007
  },
  {
    "source": 1901,
    "target": 2106
  },
  {
    "source": 1901,
    "target": 402
  },
  {
    "source": 1901,
    "target": 3808
  },
  {
    "source": 1901,
    "target": 1517
  },
  {
    "source": 1901,
    "target": 2101
  },
  {
    "source": 1902,
    "target": 1515
  },
  {
    "source": 1902,
    "target": 2002
  },
  {
    "source": 1902,
    "target": 1516
  },
  {
    "source": 1902,
    "target": 1509
  },
  {
    "source": 1902,
    "target": 2505
  },
  {
    "source": 1904,
    "target": 1905
  },
  {
    "source": 1904,
    "target": 3402
  },
  {
    "source": 1904,
    "target": 1704
  },
  {
    "source": 1904,
    "target": 2005
  },
  {
    "source": 1904,
    "target": 2105
  },
  {
    "source": 1905,
    "target": 1904
  },
  {
    "source": 1905,
    "target": 1704
  },
  {
    "source": 1905,
    "target": 3402
  },
  {
    "source": 1905,
    "target": 2105
  },
  {
    "source": 1905,
    "target": 2202
  },
  {
    "source": 2001,
    "target": 2005
  },
  {
    "source": 2001,
    "target": 2007
  },
  {
    "source": 2001,
    "target": 813
  },
  {
    "source": 2001,
    "target": 6802
  },
  {
    "source": 2001,
    "target": 707
  },
  {
    "source": 2002,
    "target": 1509
  },
  {
    "source": 2002,
    "target": 1515
  },
  {
    "source": 2002,
    "target": 802
  },
  {
    "source": 2002,
    "target": 1902
  },
  {
    "source": 2002,
    "target": 4106
  },
  {
    "source": 2003,
    "target": 5601
  },
  {
    "source": 2003,
    "target": 4414
  },
  {
    "source": 2003,
    "target": 4205
  },
  {
    "source": 2003,
    "target": 6907
  },
  {
    "source": 2003,
    "target": 2004
  },
  {
    "source": 2004,
    "target": 1702
  },
  {
    "source": 2004,
    "target": 101
  },
  {
    "source": 2004,
    "target": 1502
  },
  {
    "source": 2004,
    "target": 2834
  },
  {
    "source": 2004,
    "target": 2003
  },
  {
    "source": 2005,
    "target": 2001
  },
  {
    "source": 2005,
    "target": 2007
  },
  {
    "source": 2005,
    "target": 1904
  },
  {
    "source": 2005,
    "target": 710
  },
  {
    "source": 2005,
    "target": 811
  },
  {
    "source": 2007,
    "target": 2005
  },
  {
    "source": 2007,
    "target": 2001
  },
  {
    "source": 2007,
    "target": 1806
  },
  {
    "source": 2007,
    "target": 2009
  },
  {
    "source": 2007,
    "target": 2008
  },
  {
    "source": 2008,
    "target": 2007
  },
  {
    "source": 2008,
    "target": 2009
  },
  {
    "source": 2008,
    "target": 813
  },
  {
    "source": 2008,
    "target": 811
  },
  {
    "source": 2008,
    "target": 910
  },
  {
    "source": 2009,
    "target": 2007
  },
  {
    "source": 2009,
    "target": 2008
  },
  {
    "source": 2009,
    "target": 805
  },
  {
    "source": 2009,
    "target": 409
  },
  {
    "source": 2009,
    "target": 807
  },
  {
    "source": 2101,
    "target": 2104
  },
  {
    "source": 2101,
    "target": 1901
  },
  {
    "source": 2101,
    "target": 2403
  },
  {
    "source": 2101,
    "target": 1519
  },
  {
    "source": 2101,
    "target": 2102
  },
  {
    "source": 2102,
    "target": 811
  },
  {
    "source": 2102,
    "target": 2104
  },
  {
    "source": 2102,
    "target": 1107
  },
  {
    "source": 2102,
    "target": 7614
  },
  {
    "source": 2102,
    "target": 2101
  },
  {
    "source": 2103,
    "target": 2104
  },
  {
    "source": 2103,
    "target": 2106
  },
  {
    "source": 2103,
    "target": 2202
  },
  {
    "source": 2103,
    "target": 4820
  },
  {
    "source": 2103,
    "target": 4821
  },
  {
    "source": 2104,
    "target": 2103
  },
  {
    "source": 2104,
    "target": 3306
  },
  {
    "source": 2104,
    "target": 2101
  },
  {
    "source": 2104,
    "target": 7317
  },
  {
    "source": 2104,
    "target": 2102
  },
  {
    "source": 2105,
    "target": 1601
  },
  {
    "source": 2105,
    "target": 1905
  },
  {
    "source": 2105,
    "target": 1904
  },
  {
    "source": 2105,
    "target": 2202
  },
  {
    "source": 2105,
    "target": 403
  },
  {
    "source": 2106,
    "target": 1901
  },
  {
    "source": 2106,
    "target": 2103
  },
  {
    "source": 2106,
    "target": 4911
  },
  {
    "source": 2106,
    "target": 3808
  },
  {
    "source": 2106,
    "target": 3004
  },
  {
    "source": 2201,
    "target": 2203
  },
  {
    "source": 2201,
    "target": 2517
  },
  {
    "source": 2201,
    "target": 2505
  },
  {
    "source": 2201,
    "target": 7602
  },
  {
    "source": 2201,
    "target": 2714
  },
  {
    "source": 2202,
    "target": 1905
  },
  {
    "source": 2202,
    "target": 2105
  },
  {
    "source": 2202,
    "target": 2203
  },
  {
    "source": 2202,
    "target": 2103
  },
  {
    "source": 2202,
    "target": 403
  },
  {
    "source": 2203,
    "target": 2202
  },
  {
    "source": 2203,
    "target": 2201
  },
  {
    "source": 2203,
    "target": 7010
  },
  {
    "source": 2203,
    "target": 2208
  },
  {
    "source": 2203,
    "target": 2517
  },
  {
    "source": 2204,
    "target": 4707
  },
  {
    "source": 2204,
    "target": 3303
  },
  {
    "source": 2204,
    "target": 2208
  },
  {
    "source": 2204,
    "target": 1512
  },
  {
    "source": 2204,
    "target": 7404
  },
  {
    "source": 2207,
    "target": 1701
  },
  {
    "source": 2207,
    "target": 1507
  },
  {
    "source": 2207,
    "target": 105
  },
  {
    "source": 2207,
    "target": 2302
  },
  {
    "source": 2207,
    "target": 7112
  },
  {
    "source": 2208,
    "target": 2203
  },
  {
    "source": 2208,
    "target": 2204
  },
  {
    "source": 2208,
    "target": 3303
  },
  {
    "source": 2208,
    "target": 2402
  },
  {
    "source": 2208,
    "target": 4907
  },
  {
    "source": 2301,
    "target": 1504
  },
  {
    "source": 2301,
    "target": 1604
  },
  {
    "source": 2301,
    "target": 511
  },
  {
    "source": 2301,
    "target": 307
  },
  {
    "source": 2301,
    "target": 1605
  },
  {
    "source": 2302,
    "target": 1103
  },
  {
    "source": 2302,
    "target": 1101
  },
  {
    "source": 2302,
    "target": 2207
  },
  {
    "source": 2302,
    "target": 1701
  },
  {
    "source": 2302,
    "target": 4403
  },
  {
    "source": 2303,
    "target": 1514
  },
  {
    "source": 2303,
    "target": 4805
  },
  {
    "source": 2303,
    "target": 1001
  },
  {
    "source": 2303,
    "target": 207
  },
  {
    "source": 2303,
    "target": 1205
  },
  {
    "source": 2304,
    "target": 1201
  },
  {
    "source": 2304,
    "target": 1005
  },
  {
    "source": 2304,
    "target": 2306
  },
  {
    "source": 2304,
    "target": 1208
  },
  {
    "source": 2304,
    "target": 1507
  },
  {
    "source": 2306,
    "target": 1208
  },
  {
    "source": 2306,
    "target": 1512
  },
  {
    "source": 2306,
    "target": 2304
  },
  {
    "source": 2306,
    "target": 3102
  },
  {
    "source": 2306,
    "target": 1207
  },
  {
    "source": 2309,
    "target": 105
  },
  {
    "source": 2309,
    "target": 4707
  },
  {
    "source": 2309,
    "target": 1702
  },
  {
    "source": 2309,
    "target": 8437
  },
  {
    "source": 2309,
    "target": 1108
  },
  {
    "source": 2401,
    "target": 2516
  },
  {
    "source": 2401,
    "target": 1006
  },
  {
    "source": 2401,
    "target": 7801
  },
  {
    "source": 2401,
    "target": 3301
  },
  {
    "source": 2401,
    "target": 1805
  },
  {
    "source": 2402,
    "target": 2403
  },
  {
    "source": 2402,
    "target": 8478
  },
  {
    "source": 2402,
    "target": 2523
  },
  {
    "source": 2402,
    "target": 7404
  },
  {
    "source": 2402,
    "target": 2208
  },
  {
    "source": 2403,
    "target": 8478
  },
  {
    "source": 2403,
    "target": 2402
  },
  {
    "source": 2403,
    "target": 2101
  },
  {
    "source": 2403,
    "target": 1519
  },
  {
    "source": 2403,
    "target": 8212
  },
  {
    "source": 2501,
    "target": 1103
  },
  {
    "source": 2501,
    "target": 3103
  },
  {
    "source": 2501,
    "target": 4101
  },
  {
    "source": 2501,
    "target": 2520
  },
  {
    "source": 2501,
    "target": 1107
  },
  {
    "source": 2503,
    "target": 2708
  },
  {
    "source": 2503,
    "target": 2710
  },
  {
    "source": 2503,
    "target": 2707
  },
  {
    "source": 2503,
    "target": 2715
  },
  {
    "source": 2503,
    "target": 7301
  },
  {
    "source": 2505,
    "target": 2517
  },
  {
    "source": 2505,
    "target": 2516
  },
  {
    "source": 2505,
    "target": 1902
  },
  {
    "source": 2505,
    "target": 2809
  },
  {
    "source": 2505,
    "target": 2201
  },
  {
    "source": 2507,
    "target": 2904
  },
  {
    "source": 2507,
    "target": 2508
  },
  {
    "source": 2507,
    "target": 3912
  },
  {
    "source": 2507,
    "target": 3806
  },
  {
    "source": 2507,
    "target": 4804
  },
  {
    "source": 2508,
    "target": 2507
  },
  {
    "source": 2508,
    "target": 3802
  },
  {
    "source": 2508,
    "target": 5501
  },
  {
    "source": 2508,
    "target": 3603
  },
  {
    "source": 2508,
    "target": 8478
  },
  {
    "source": 2510,
    "target": 3103
  },
  {
    "source": 2510,
    "target": 2809
  },
  {
    "source": 2510,
    "target": 2602
  },
  {
    "source": 2510,
    "target": 2612
  },
  {
    "source": 2510,
    "target": 2606
  },
  {
    "source": 2515,
    "target": 6802
  },
  {
    "source": 2515,
    "target": 712
  },
  {
    "source": 2515,
    "target": 6801
  },
  {
    "source": 2515,
    "target": 1509
  },
  {
    "source": 2515,
    "target": 910
  },
  {
    "source": 2516,
    "target": 2505
  },
  {
    "source": 2516,
    "target": 2517
  },
  {
    "source": 2516,
    "target": 2529
  },
  {
    "source": 2516,
    "target": 2401
  },
  {
    "source": 2516,
    "target": 2610
  },
  {
    "source": 2517,
    "target": 2505
  },
  {
    "source": 2517,
    "target": 2203
  },
  {
    "source": 2517,
    "target": 2201
  },
  {
    "source": 2517,
    "target": 2516
  },
  {
    "source": 2517,
    "target": 2715
  },
  {
    "source": 2519,
    "target": 7202
  },
  {
    "source": 2519,
    "target": 2804
  },
  {
    "source": 2519,
    "target": 2530
  },
  {
    "source": 2519,
    "target": 2712
  },
  {
    "source": 2519,
    "target": 7206
  },
  {
    "source": 2520,
    "target": 2523
  },
  {
    "source": 2520,
    "target": 2501
  },
  {
    "source": 2520,
    "target": 802
  },
  {
    "source": 2520,
    "target": 805
  },
  {
    "source": 2520,
    "target": 3301
  },
  {
    "source": 2523,
    "target": 1101
  },
  {
    "source": 2523,
    "target": 7214
  },
  {
    "source": 2523,
    "target": 2715
  },
  {
    "source": 2523,
    "target": 2520
  },
  {
    "source": 2523,
    "target": 2402
  },
  {
    "source": 2529,
    "target": 2608
  },
  {
    "source": 2529,
    "target": 7901
  },
  {
    "source": 2529,
    "target": 2530
  },
  {
    "source": 2529,
    "target": 2516
  },
  {
    "source": 2529,
    "target": 7402
  },
  {
    "source": 2530,
    "target": 2712
  },
  {
    "source": 2530,
    "target": 2529
  },
  {
    "source": 2530,
    "target": 2519
  },
  {
    "source": 2530,
    "target": 2604
  },
  {
    "source": 2530,
    "target": 2614
  },
  {
    "source": 2601,
    "target": 7203
  },
  {
    "source": 2601,
    "target": 2701
  },
  {
    "source": 2601,
    "target": 7207
  },
  {
    "source": 2601,
    "target": 2603
  },
  {
    "source": 2601,
    "target": 2818
  },
  {
    "source": 2602,
    "target": 2612
  },
  {
    "source": 2602,
    "target": 2614
  },
  {
    "source": 2602,
    "target": 2605
  },
  {
    "source": 2602,
    "target": 2510
  },
  {
    "source": 2602,
    "target": 2606
  },
  {
    "source": 2603,
    "target": 2616
  },
  {
    "source": 2603,
    "target": 7402
  },
  {
    "source": 2603,
    "target": 2608
  },
  {
    "source": 2603,
    "target": 2604
  },
  {
    "source": 2603,
    "target": 2601
  },
  {
    "source": 2604,
    "target": 7501
  },
  {
    "source": 2604,
    "target": 2603
  },
  {
    "source": 2604,
    "target": 2616
  },
  {
    "source": 2604,
    "target": 2530
  },
  {
    "source": 2604,
    "target": 2610
  },
  {
    "source": 2605,
    "target": 8105
  },
  {
    "source": 2605,
    "target": 7501
  },
  {
    "source": 2605,
    "target": 2822
  },
  {
    "source": 2605,
    "target": 2615
  },
  {
    "source": 2605,
    "target": 2602
  },
  {
    "source": 2606,
    "target": 2818
  },
  {
    "source": 2606,
    "target": 2602
  },
  {
    "source": 2606,
    "target": 7102
  },
  {
    "source": 2606,
    "target": 2510
  },
  {
    "source": 2607,
    "target": 2608
  },
  {
    "source": 2607,
    "target": 2616
  },
  {
    "source": 2607,
    "target": 2613
  },
  {
    "source": 2607,
    "target": 7106
  },
  {
    "source": 2607,
    "target": 7901
  },
  {
    "source": 2608,
    "target": 2607
  },
  {
    "source": 2608,
    "target": 2616
  },
  {
    "source": 2608,
    "target": 2603
  },
  {
    "source": 2608,
    "target": 2613
  },
  {
    "source": 2608,
    "target": 2529
  },
  {
    "source": 2610,
    "target": 2604
  },
  {
    "source": 2610,
    "target": 2615
  },
  {
    "source": 2610,
    "target": 2516
  },
  {
    "source": 2610,
    "target": 7103
  },
  {
    "source": 2610,
    "target": 2612
  },
  {
    "source": 2612,
    "target": 2844
  },
  {
    "source": 2612,
    "target": 2602
  },
  {
    "source": 2612,
    "target": 2701
  },
  {
    "source": 2612,
    "target": 2610
  },
  {
    "source": 2612,
    "target": 2510
  },
  {
    "source": 2613,
    "target": 2841
  },
  {
    "source": 2613,
    "target": 2608
  },
  {
    "source": 2613,
    "target": 2825
  },
  {
    "source": 2613,
    "target": 2607
  },
  {
    "source": 2613,
    "target": 7106
  },
  {
    "source": 2614,
    "target": 2615
  },
  {
    "source": 2614,
    "target": 2530
  },
  {
    "source": 2614,
    "target": 2701
  },
  {
    "source": 2614,
    "target": 7103
  },
  {
    "source": 2614,
    "target": 2602
  },
  {
    "source": 2615,
    "target": 2614
  },
  {
    "source": 2615,
    "target": 7103
  },
  {
    "source": 2615,
    "target": 2605
  },
  {
    "source": 2615,
    "target": 7102
  },
  {
    "source": 2615,
    "target": 2610
  },
  {
    "source": 2616,
    "target": 2603
  },
  {
    "source": 2616,
    "target": 2608
  },
  {
    "source": 2616,
    "target": 2607
  },
  {
    "source": 2616,
    "target": 7402
  },
  {
    "source": 2616,
    "target": 2604
  },
  {
    "source": 2620,
    "target": 7413
  },
  {
    "source": 2620,
    "target": 2716
  },
  {
    "source": 2620,
    "target": 1518
  },
  {
    "source": 2620,
    "target": 7301
  },
  {
    "source": 2620,
    "target": 2807
  },
  {
    "source": 2701,
    "target": 2704
  },
  {
    "source": 2701,
    "target": 2601
  },
  {
    "source": 2701,
    "target": 2614
  },
  {
    "source": 2701,
    "target": 8111
  },
  {
    "source": 2701,
    "target": 2612
  },
  {
    "source": 2703,
    "target": 4301
  },
  {
    "source": 2703,
    "target": 3104
  },
  {
    "source": 2703,
    "target": 2836
  },
  {
    "source": 2703,
    "target": 2818
  },
  {
    "source": 2703,
    "target": 7102
  },
  {
    "source": 2704,
    "target": 2708
  },
  {
    "source": 2704,
    "target": 2803
  },
  {
    "source": 2704,
    "target": 2701
  },
  {
    "source": 2704,
    "target": 7605
  },
  {
    "source": 2704,
    "target": 7110
  },
  {
    "source": 2707,
    "target": 2710
  },
  {
    "source": 2707,
    "target": 2503
  },
  {
    "source": 2707,
    "target": 8906
  },
  {
    "source": 2707,
    "target": 2711
  },
  {
    "source": 2707,
    "target": 2709
  },
  {
    "source": 2708,
    "target": 2704
  },
  {
    "source": 2708,
    "target": 2503
  },
  {
    "source": 2708,
    "target": 7301
  },
  {
    "source": 2708,
    "target": 8602
  },
  {
    "source": 2708,
    "target": 7004
  },
  {
    "source": 2709,
    "target": 2711
  },
  {
    "source": 2709,
    "target": 2707
  },
  {
    "source": 2709,
    "target": 2710
  },
  {
    "source": 2709,
    "target": 8905
  },
  {
    "source": 2709,
    "target": 8904
  },
  {
    "source": 2710,
    "target": 2707
  },
  {
    "source": 2710,
    "target": 2713
  },
  {
    "source": 2710,
    "target": 2503
  },
  {
    "source": 2710,
    "target": 2711
  },
  {
    "source": 2710,
    "target": 2709
  },
  {
    "source": 2711,
    "target": 2709
  },
  {
    "source": 2711,
    "target": 2814
  },
  {
    "source": 2711,
    "target": 2707
  },
  {
    "source": 2711,
    "target": 2710
  },
  {
    "source": 2711,
    "target": 8905
  },
  {
    "source": 2712,
    "target": 2713
  },
  {
    "source": 2712,
    "target": 8437
  },
  {
    "source": 2712,
    "target": 2834
  },
  {
    "source": 2712,
    "target": 2530
  },
  {
    "source": 2712,
    "target": 2519
  },
  {
    "source": 2713,
    "target": 2714
  },
  {
    "source": 2713,
    "target": 2715
  },
  {
    "source": 2713,
    "target": 6807
  },
  {
    "source": 2713,
    "target": 2710
  },
  {
    "source": 2713,
    "target": 2712
  },
  {
    "source": 2714,
    "target": 2715
  },
  {
    "source": 2714,
    "target": 2713
  },
  {
    "source": 2714,
    "target": 4907
  },
  {
    "source": 2714,
    "target": 2201
  },
  {
    "source": 2714,
    "target": 902
  },
  {
    "source": 2715,
    "target": 2714
  },
  {
    "source": 2715,
    "target": 2713
  },
  {
    "source": 2715,
    "target": 2523
  },
  {
    "source": 2715,
    "target": 2503
  },
  {
    "source": 2715,
    "target": 2517
  },
  {
    "source": 2716,
    "target": 8606
  },
  {
    "source": 2716,
    "target": 2620
  },
  {
    "source": 2716,
    "target": 8104
  },
  {
    "source": 2716,
    "target": 7202
  },
  {
    "source": 2716,
    "target": 1512
  },
  {
    "source": 2803,
    "target": 3904
  },
  {
    "source": 2803,
    "target": 3206
  },
  {
    "source": 2803,
    "target": 8401
  },
  {
    "source": 2803,
    "target": 2704
  },
  {
    "source": 2803,
    "target": 2929
  },
  {
    "source": 2804,
    "target": 2811
  },
  {
    "source": 2804,
    "target": 3818
  },
  {
    "source": 2804,
    "target": 2519
  },
  {
    "source": 2804,
    "target": 3817
  },
  {
    "source": 2804,
    "target": 8111
  },
  {
    "source": 2807,
    "target": 7403
  },
  {
    "source": 2807,
    "target": 2833
  },
  {
    "source": 2807,
    "target": 7901
  },
  {
    "source": 2807,
    "target": 2904
  },
  {
    "source": 2807,
    "target": 2620
  },
  {
    "source": 2809,
    "target": 2835
  },
  {
    "source": 2809,
    "target": 2510
  },
  {
    "source": 2809,
    "target": 2505
  },
  {
    "source": 2809,
    "target": 8111
  },
  {
    "source": 2809,
    "target": 2836
  },
  {
    "source": 2811,
    "target": 2804
  },
  {
    "source": 2811,
    "target": 4806
  },
  {
    "source": 2811,
    "target": 8405
  },
  {
    "source": 2811,
    "target": 3912
  },
  {
    "source": 2811,
    "target": 5504
  },
  {
    "source": 2814,
    "target": 3102
  },
  {
    "source": 2814,
    "target": 7203
  },
  {
    "source": 2814,
    "target": 2905
  },
  {
    "source": 2814,
    "target": 7201
  },
  {
    "source": 2814,
    "target": 2711
  },
  {
    "source": 2815,
    "target": 3904
  },
  {
    "source": 2815,
    "target": 2903
  },
  {
    "source": 2815,
    "target": 3817
  },
  {
    "source": 2815,
    "target": 2929
  },
  {
    "source": 2815,
    "target": 3902
  },
  {
    "source": 2818,
    "target": 2606
  },
  {
    "source": 2818,
    "target": 2601
  },
  {
    "source": 2818,
    "target": 3802
  },
  {
    "source": 2818,
    "target": 2826
  },
  {
    "source": 2818,
    "target": 2703
  },
  {
    "source": 2821,
    "target": 7205
  },
  {
    "source": 2821,
    "target": 2904
  },
  {
    "source": 2821,
    "target": 3913
  },
  {
    "source": 2821,
    "target": 3812
  },
  {
    "source": 2821,
    "target": 3818
  },
  {
    "source": 2822,
    "target": 8105
  },
  {
    "source": 2822,
    "target": 2605
  },
  {
    "source": 2822,
    "target": 7502
  },
  {
    "source": 2822,
    "target": 7501
  },
  {
    "source": 2822,
    "target": 7402
  },
  {
    "source": 2825,
    "target": 2841
  },
  {
    "source": 2825,
    "target": 8112
  },
  {
    "source": 2825,
    "target": 7502
  },
  {
    "source": 2825,
    "target": 7106
  },
  {
    "source": 2825,
    "target": 2613
  },
  {
    "source": 2826,
    "target": 8545
  },
  {
    "source": 2826,
    "target": 8430
  },
  {
    "source": 2826,
    "target": 3802
  },
  {
    "source": 2826,
    "target": 7004
  },
  {
    "source": 2826,
    "target": 2818
  },
  {
    "source": 2827,
    "target": 8204
  },
  {
    "source": 2827,
    "target": 7227
  },
  {
    "source": 2827,
    "target": 3802
  },
  {
    "source": 2827,
    "target": 2904
  },
  {
    "source": 2827,
    "target": 7002
  },
  {
    "source": 2833,
    "target": 2836
  },
  {
    "source": 2833,
    "target": 2835
  },
  {
    "source": 2833,
    "target": 2807
  },
  {
    "source": 2833,
    "target": 6813
  },
  {
    "source": 2833,
    "target": 2904
  },
  {
    "source": 2834,
    "target": 3105
  },
  {
    "source": 2834,
    "target": 2836
  },
  {
    "source": 2834,
    "target": 2004
  },
  {
    "source": 2834,
    "target": 3104
  },
  {
    "source": 2834,
    "target": 2712
  },
  {
    "source": 2835,
    "target": 2833
  },
  {
    "source": 2835,
    "target": 3103
  },
  {
    "source": 2835,
    "target": 2809
  },
  {
    "source": 2835,
    "target": 3105
  },
  {
    "source": 2835,
    "target": 8104
  },
  {
    "source": 2836,
    "target": 2833
  },
  {
    "source": 2836,
    "target": 2834
  },
  {
    "source": 2836,
    "target": 8111
  },
  {
    "source": 2836,
    "target": 2809
  },
  {
    "source": 2836,
    "target": 2703
  },
  {
    "source": 2841,
    "target": 8102
  },
  {
    "source": 2841,
    "target": 2825
  },
  {
    "source": 2841,
    "target": 8112
  },
  {
    "source": 2841,
    "target": 7106
  },
  {
    "source": 2841,
    "target": 2613
  },
  {
    "source": 2843,
    "target": 7110
  },
  {
    "source": 2843,
    "target": 7115
  },
  {
    "source": 2843,
    "target": 5502
  },
  {
    "source": 2843,
    "target": 7004
  },
  {
    "source": 2843,
    "target": 2939
  },
  {
    "source": 2844,
    "target": 2612
  },
  {
    "source": 2844,
    "target": 8401
  },
  {
    "source": 2844,
    "target": 8805
  },
  {
    "source": 2844,
    "target": 8602
  },
  {
    "source": 2844,
    "target": 8710
  },
  {
    "source": 2849,
    "target": 8104
  },
  {
    "source": 2849,
    "target": 7227
  },
  {
    "source": 2849,
    "target": 7202
  },
  {
    "source": 2849,
    "target": 8410
  },
  {
    "source": 2849,
    "target": 7305
  },
  {
    "source": 2901,
    "target": 2905
  },
  {
    "source": 2901,
    "target": 3901
  },
  {
    "source": 2901,
    "target": 4002
  },
  {
    "source": 2901,
    "target": 2902
  },
  {
    "source": 2901,
    "target": 2909
  },
  {
    "source": 2902,
    "target": 2901
  },
  {
    "source": 2902,
    "target": 3901
  },
  {
    "source": 2902,
    "target": 3902
  },
  {
    "source": 2902,
    "target": 2905
  },
  {
    "source": 2902,
    "target": 3817
  },
  {
    "source": 2903,
    "target": 2915
  },
  {
    "source": 2903,
    "target": 2912
  },
  {
    "source": 2903,
    "target": 2909
  },
  {
    "source": 2903,
    "target": 3818
  },
  {
    "source": 2903,
    "target": 2815
  },
  {
    "source": 2904,
    "target": 2507
  },
  {
    "source": 2904,
    "target": 2821
  },
  {
    "source": 2904,
    "target": 2807
  },
  {
    "source": 2904,
    "target": 2833
  },
  {
    "source": 2904,
    "target": 2827
  },
  {
    "source": 2905,
    "target": 2901
  },
  {
    "source": 2905,
    "target": 2909
  },
  {
    "source": 2905,
    "target": 2814
  },
  {
    "source": 2905,
    "target": 2902
  },
  {
    "source": 2905,
    "target": 3102
  },
  {
    "source": 2906,
    "target": 2910
  },
  {
    "source": 2906,
    "target": 2922
  },
  {
    "source": 2906,
    "target": 2936
  },
  {
    "source": 2906,
    "target": 2909
  },
  {
    "source": 2906,
    "target": 2912
  },
  {
    "source": 2907,
    "target": 2914
  },
  {
    "source": 2907,
    "target": 7220
  },
  {
    "source": 2907,
    "target": 8456
  },
  {
    "source": 2907,
    "target": 2916
  },
  {
    "source": 2907,
    "target": 2910
  },
  {
    "source": 2909,
    "target": 2901
  },
  {
    "source": 2909,
    "target": 2910
  },
  {
    "source": 2909,
    "target": 2905
  },
  {
    "source": 2909,
    "target": 2906
  },
  {
    "source": 2909,
    "target": 2903
  },
  {
    "source": 2910,
    "target": 2907
  },
  {
    "source": 2910,
    "target": 3911
  },
  {
    "source": 2910,
    "target": 2906
  },
  {
    "source": 2910,
    "target": 2909
  },
  {
    "source": 2910,
    "target": 2926
  },
  {
    "source": 2912,
    "target": 2903
  },
  {
    "source": 2912,
    "target": 7223
  },
  {
    "source": 2912,
    "target": 2906
  },
  {
    "source": 2912,
    "target": 7606
  },
  {
    "source": 2912,
    "target": 8401
  },
  {
    "source": 2914,
    "target": 2907
  },
  {
    "source": 2914,
    "target": 7220
  },
  {
    "source": 2914,
    "target": 2930
  },
  {
    "source": 2914,
    "target": 2926
  },
  {
    "source": 2914,
    "target": 2916
  },
  {
    "source": 2915,
    "target": 2923
  },
  {
    "source": 2915,
    "target": 3206
  },
  {
    "source": 2915,
    "target": 2903
  },
  {
    "source": 2915,
    "target": 3912
  },
  {
    "source": 2915,
    "target": 3905
  },
  {
    "source": 2916,
    "target": 2922
  },
  {
    "source": 2916,
    "target": 2914
  },
  {
    "source": 2916,
    "target": 2907
  },
  {
    "source": 2916,
    "target": 3911
  },
  {
    "source": 2916,
    "target": 3907
  },
  {
    "source": 2917,
    "target": 3907
  },
  {
    "source": 2917,
    "target": 4002
  },
  {
    "source": 2917,
    "target": 3404
  },
  {
    "source": 2917,
    "target": 3904
  },
  {
    "source": 2917,
    "target": 3207
  },
  {
    "source": 2918,
    "target": 2932
  },
  {
    "source": 2918,
    "target": 2931
  },
  {
    "source": 2918,
    "target": 3812
  },
  {
    "source": 2918,
    "target": 3204
  },
  {
    "source": 2918,
    "target": 3006
  },
  {
    "source": 2920,
    "target": 2921
  },
  {
    "source": 2920,
    "target": 3908
  },
  {
    "source": 2920,
    "target": 2929
  },
  {
    "source": 2920,
    "target": 2924
  },
  {
    "source": 2920,
    "target": 2926
  },
  {
    "source": 2921,
    "target": 2925
  },
  {
    "source": 2921,
    "target": 2920
  },
  {
    "source": 2921,
    "target": 2924
  },
  {
    "source": 2921,
    "target": 2931
  },
  {
    "source": 2921,
    "target": 2937
  },
  {
    "source": 2922,
    "target": 2916
  },
  {
    "source": 2922,
    "target": 2934
  },
  {
    "source": 2922,
    "target": 2906
  },
  {
    "source": 2922,
    "target": 3204
  },
  {
    "source": 2922,
    "target": 2935
  },
  {
    "source": 2923,
    "target": 2915
  },
  {
    "source": 2923,
    "target": 3504
  },
  {
    "source": 2923,
    "target": 3815
  },
  {
    "source": 2923,
    "target": 3001
  },
  {
    "source": 2923,
    "target": 3912
  },
  {
    "source": 2924,
    "target": 2925
  },
  {
    "source": 2924,
    "target": 2931
  },
  {
    "source": 2924,
    "target": 3204
  },
  {
    "source": 2924,
    "target": 2921
  },
  {
    "source": 2924,
    "target": 2920
  },
  {
    "source": 2925,
    "target": 2924
  },
  {
    "source": 2925,
    "target": 3801
  },
  {
    "source": 2925,
    "target": 2934
  },
  {
    "source": 2925,
    "target": 2921
  },
  {
    "source": 2925,
    "target": 8603
  },
  {
    "source": 2926,
    "target": 2914
  },
  {
    "source": 2926,
    "target": 3701
  },
  {
    "source": 2926,
    "target": 2920
  },
  {
    "source": 2926,
    "target": 2933
  },
  {
    "source": 2926,
    "target": 2910
  },
  {
    "source": 2929,
    "target": 2920
  },
  {
    "source": 2929,
    "target": 3812
  },
  {
    "source": 2929,
    "target": 2815
  },
  {
    "source": 2929,
    "target": 2803
  },
  {
    "source": 2929,
    "target": 8445
  },
  {
    "source": 2930,
    "target": 2914
  },
  {
    "source": 2930,
    "target": 2935
  },
  {
    "source": 2930,
    "target": 2941
  },
  {
    "source": 2930,
    "target": 9012
  },
  {
    "source": 2930,
    "target": 7110
  },
  {
    "source": 2931,
    "target": 2933
  },
  {
    "source": 2931,
    "target": 2924
  },
  {
    "source": 2931,
    "target": 2918
  },
  {
    "source": 2931,
    "target": 2921
  },
  {
    "source": 2931,
    "target": 2932
  },
  {
    "source": 2932,
    "target": 2934
  },
  {
    "source": 2932,
    "target": 2918
  },
  {
    "source": 2932,
    "target": 2937
  },
  {
    "source": 2932,
    "target": 2941
  },
  {
    "source": 2932,
    "target": 2931
  },
  {
    "source": 2933,
    "target": 2934
  },
  {
    "source": 2933,
    "target": 2935
  },
  {
    "source": 2933,
    "target": 2931
  },
  {
    "source": 2933,
    "target": 2937
  },
  {
    "source": 2933,
    "target": 2926
  },
  {
    "source": 2934,
    "target": 2933
  },
  {
    "source": 2934,
    "target": 2932
  },
  {
    "source": 2934,
    "target": 2935
  },
  {
    "source": 2934,
    "target": 2925
  },
  {
    "source": 2934,
    "target": 2922
  },
  {
    "source": 2935,
    "target": 2933
  },
  {
    "source": 2935,
    "target": 2934
  },
  {
    "source": 2935,
    "target": 2941
  },
  {
    "source": 2935,
    "target": 2922
  },
  {
    "source": 2935,
    "target": 2930
  },
  {
    "source": 2936,
    "target": 3204
  },
  {
    "source": 2936,
    "target": 3507
  },
  {
    "source": 2936,
    "target": 3302
  },
  {
    "source": 2936,
    "target": 3003
  },
  {
    "source": 2936,
    "target": 2906
  },
  {
    "source": 2937,
    "target": 3001
  },
  {
    "source": 2937,
    "target": 2933
  },
  {
    "source": 2937,
    "target": 2932
  },
  {
    "source": 2937,
    "target": 3002
  },
  {
    "source": 2937,
    "target": 2921
  },
  {
    "source": 2939,
    "target": 1302
  },
  {
    "source": 2939,
    "target": 3302
  },
  {
    "source": 2939,
    "target": 7508
  },
  {
    "source": 2939,
    "target": 2843
  },
  {
    "source": 2939,
    "target": 7002
  },
  {
    "source": 2941,
    "target": 2935
  },
  {
    "source": 2941,
    "target": 2932
  },
  {
    "source": 2941,
    "target": 3003
  },
  {
    "source": 2941,
    "target": 3006
  },
  {
    "source": 2941,
    "target": 2930
  },
  {
    "source": 3001,
    "target": 2937
  },
  {
    "source": 3001,
    "target": 3821
  },
  {
    "source": 3001,
    "target": 3504
  },
  {
    "source": 3001,
    "target": 3002
  },
  {
    "source": 3001,
    "target": 2923
  },
  {
    "source": 3002,
    "target": 3821
  },
  {
    "source": 3002,
    "target": 3822
  },
  {
    "source": 3002,
    "target": 2937
  },
  {
    "source": 3002,
    "target": 3001
  },
  {
    "source": 3002,
    "target": 3006
  },
  {
    "source": 3003,
    "target": 3006
  },
  {
    "source": 3003,
    "target": 2936
  },
  {
    "source": 3003,
    "target": 2941
  },
  {
    "source": 3003,
    "target": 9021
  },
  {
    "source": 3003,
    "target": 3913
  },
  {
    "source": 3004,
    "target": 8434
  },
  {
    "source": 3004,
    "target": 4911
  },
  {
    "source": 3004,
    "target": 3808
  },
  {
    "source": 3004,
    "target": 2106
  },
  {
    "source": 3004,
    "target": 4901
  },
  {
    "source": 3005,
    "target": 3307
  },
  {
    "source": 3005,
    "target": 9603
  },
  {
    "source": 3005,
    "target": 9402
  },
  {
    "source": 3005,
    "target": 4809
  },
  {
    "source": 3005,
    "target": 5601
  },
  {
    "source": 3006,
    "target": 3002
  },
  {
    "source": 3006,
    "target": 3003
  },
  {
    "source": 3006,
    "target": 2918
  },
  {
    "source": 3006,
    "target": 3302
  },
  {
    "source": 3006,
    "target": 2941
  },
  {
    "source": 3102,
    "target": 2814
  },
  {
    "source": 3102,
    "target": 3105
  },
  {
    "source": 3102,
    "target": 2905
  },
  {
    "source": 3102,
    "target": 2306
  },
  {
    "source": 3102,
    "target": 3104
  },
  {
    "source": 3103,
    "target": 3105
  },
  {
    "source": 3103,
    "target": 2835
  },
  {
    "source": 3103,
    "target": 2510
  },
  {
    "source": 3103,
    "target": 3104
  },
  {
    "source": 3103,
    "target": 2501
  },
  {
    "source": 3104,
    "target": 3105
  },
  {
    "source": 3104,
    "target": 3103
  },
  {
    "source": 3104,
    "target": 3102
  },
  {
    "source": 3104,
    "target": 2834
  },
  {
    "source": 3104,
    "target": 2703
  },
  {
    "source": 3105,
    "target": 3103
  },
  {
    "source": 3105,
    "target": 3104
  },
  {
    "source": 3105,
    "target": 3102
  },
  {
    "source": 3105,
    "target": 2835
  },
  {
    "source": 3105,
    "target": 2834
  },
  {
    "source": 3204,
    "target": 2936
  },
  {
    "source": 3204,
    "target": 2922
  },
  {
    "source": 3204,
    "target": 2924
  },
  {
    "source": 3204,
    "target": 3809
  },
  {
    "source": 3204,
    "target": 2918
  },
  {
    "source": 3206,
    "target": 2915
  },
  {
    "source": 3206,
    "target": 3212
  },
  {
    "source": 3206,
    "target": 3903
  },
  {
    "source": 3206,
    "target": 2803
  },
  {
    "source": 3206,
    "target": 3918
  },
  {
    "source": 3207,
    "target": 7219
  },
  {
    "source": 3207,
    "target": 5603
  },
  {
    "source": 3207,
    "target": 4809
  },
  {
    "source": 3207,
    "target": 3905
  },
  {
    "source": 3207,
    "target": 2917
  },
  {
    "source": 3208,
    "target": 3209
  },
  {
    "source": 3208,
    "target": 3214
  },
  {
    "source": 3208,
    "target": 3814
  },
  {
    "source": 3208,
    "target": 4823
  },
  {
    "source": 3208,
    "target": 7212
  },
  {
    "source": 3209,
    "target": 3208
  },
  {
    "source": 3209,
    "target": 3917
  },
  {
    "source": 3209,
    "target": 4823
  },
  {
    "source": 3209,
    "target": 7310
  },
  {
    "source": 3209,
    "target": 4818
  },
  {
    "source": 3212,
    "target": 3506
  },
  {
    "source": 3212,
    "target": 3823
  },
  {
    "source": 3212,
    "target": 3905
  },
  {
    "source": 3212,
    "target": 3215
  },
  {
    "source": 3212,
    "target": 3206
  },
  {
    "source": 3214,
    "target": 3208
  },
  {
    "source": 3214,
    "target": 3916
  },
  {
    "source": 3214,
    "target": 3816
  },
  {
    "source": 3214,
    "target": 7019
  },
  {
    "source": 3214,
    "target": 3921
  },
  {
    "source": 3215,
    "target": 3403
  },
  {
    "source": 3215,
    "target": 3919
  },
  {
    "source": 3215,
    "target": 3823
  },
  {
    "source": 3215,
    "target": 3506
  },
  {
    "source": 3215,
    "target": 3212
  },
  {
    "source": 3301,
    "target": 1211
  },
  {
    "source": 3301,
    "target": 805
  },
  {
    "source": 3301,
    "target": 2520
  },
  {
    "source": 3301,
    "target": 2401
  },
  {
    "source": 3301,
    "target": 5105
  },
  {
    "source": 3302,
    "target": 2936
  },
  {
    "source": 3302,
    "target": 3006
  },
  {
    "source": 3302,
    "target": 3507
  },
  {
    "source": 3302,
    "target": 8411
  },
  {
    "source": 3302,
    "target": 2939
  },
  {
    "source": 3303,
    "target": 3304
  },
  {
    "source": 3303,
    "target": 4813
  },
  {
    "source": 3303,
    "target": 2204
  },
  {
    "source": 3303,
    "target": 9406
  },
  {
    "source": 3303,
    "target": 2208
  },
  {
    "source": 3304,
    "target": 3305
  },
  {
    "source": 3304,
    "target": 3303
  },
  {
    "source": 3304,
    "target": 4911
  },
  {
    "source": 3304,
    "target": 3306
  },
  {
    "source": 3304,
    "target": 3924
  },
  {
    "source": 3305,
    "target": 3402
  },
  {
    "source": 3305,
    "target": 3306
  },
  {
    "source": 3305,
    "target": 3307
  },
  {
    "source": 3305,
    "target": 3304
  },
  {
    "source": 3305,
    "target": 4818
  },
  {
    "source": 3306,
    "target": 3305
  },
  {
    "source": 3306,
    "target": 3808
  },
  {
    "source": 3306,
    "target": 3304
  },
  {
    "source": 3306,
    "target": 7615
  },
  {
    "source": 3306,
    "target": 2104
  },
  {
    "source": 3307,
    "target": 3305
  },
  {
    "source": 3307,
    "target": 3405
  },
  {
    "source": 3307,
    "target": 7608
  },
  {
    "source": 3307,
    "target": 3005
  },
  {
    "source": 3307,
    "target": 8418
  },
  {
    "source": 3401,
    "target": 1704
  },
  {
    "source": 3401,
    "target": 1101
  },
  {
    "source": 3401,
    "target": 4820
  },
  {
    "source": 3401,
    "target": 1515
  },
  {
    "source": 3401,
    "target": 1103
  },
  {
    "source": 3402,
    "target": 3305
  },
  {
    "source": 3402,
    "target": 4818
  },
  {
    "source": 3402,
    "target": 1904
  },
  {
    "source": 3402,
    "target": 3923
  },
  {
    "source": 3402,
    "target": 1905
  },
  {
    "source": 3403,
    "target": 8514
  },
  {
    "source": 3403,
    "target": 3506
  },
  {
    "source": 3403,
    "target": 3821
  },
  {
    "source": 3403,
    "target": 3215
  },
  {
    "source": 3403,
    "target": 3908
  },
  {
    "source": 3404,
    "target": 3906
  },
  {
    "source": 3404,
    "target": 3907
  },
  {
    "source": 3404,
    "target": 2917
  },
  {
    "source": 3404,
    "target": 3912
  },
  {
    "source": 3404,
    "target": 3815
  },
  {
    "source": 3405,
    "target": 3307
  },
  {
    "source": 3405,
    "target": 4823
  },
  {
    "source": 3405,
    "target": 3816
  },
  {
    "source": 3405,
    "target": 4821
  },
  {
    "source": 3405,
    "target": 3808
  },
  {
    "source": 3406,
    "target": 8201
  },
  {
    "source": 3406,
    "target": 8713
  },
  {
    "source": 3406,
    "target": 6306
  },
  {
    "source": 3406,
    "target": 4909
  },
  {
    "source": 3406,
    "target": 6702
  },
  {
    "source": 3501,
    "target": 404
  },
  {
    "source": 3501,
    "target": 405
  },
  {
    "source": 3501,
    "target": 101
  },
  {
    "source": 3501,
    "target": 402
  },
  {
    "source": 3501,
    "target": 1502
  },
  {
    "source": 3503,
    "target": 3504
  },
  {
    "source": 3503,
    "target": 4814
  },
  {
    "source": 3503,
    "target": 8805
  },
  {
    "source": 3503,
    "target": 8437
  },
  {
    "source": 3503,
    "target": 7002
  },
  {
    "source": 3504,
    "target": 3821
  },
  {
    "source": 3504,
    "target": 3001
  },
  {
    "source": 3504,
    "target": 2923
  },
  {
    "source": 3504,
    "target": 3503
  },
  {
    "source": 3504,
    "target": 3507
  },
  {
    "source": 3505,
    "target": 1108
  },
  {
    "source": 3505,
    "target": 4005
  },
  {
    "source": 3505,
    "target": 7210
  },
  {
    "source": 3505,
    "target": 7209
  },
  {
    "source": 3505,
    "target": 1519
  },
  {
    "source": 3506,
    "target": 3403
  },
  {
    "source": 3506,
    "target": 3909
  },
  {
    "source": 3506,
    "target": 3905
  },
  {
    "source": 3506,
    "target": 3212
  },
  {
    "source": 3506,
    "target": 3215
  },
  {
    "source": 3507,
    "target": 2936
  },
  {
    "source": 3507,
    "target": 3504
  },
  {
    "source": 3507,
    "target": 9021
  },
  {
    "source": 3507,
    "target": 3913
  },
  {
    "source": 3507,
    "target": 3302
  },
  {
    "source": 3603,
    "target": 8410
  },
  {
    "source": 3603,
    "target": 9306
  },
  {
    "source": 3603,
    "target": 8430
  },
  {
    "source": 3603,
    "target": 2508
  },
  {
    "source": 3603,
    "target": 7112
  },
  {
    "source": 3701,
    "target": 3702
  },
  {
    "source": 3701,
    "target": 3707
  },
  {
    "source": 3701,
    "target": 3703
  },
  {
    "source": 3701,
    "target": 2926
  },
  {
    "source": 3701,
    "target": 3823
  },
  {
    "source": 3702,
    "target": 3701
  },
  {
    "source": 3702,
    "target": 3703
  },
  {
    "source": 3702,
    "target": 3911
  },
  {
    "source": 3702,
    "target": 3810
  },
  {
    "source": 3702,
    "target": 3815
  },
  {
    "source": 3703,
    "target": 3707
  },
  {
    "source": 3703,
    "target": 3701
  },
  {
    "source": 3703,
    "target": 3702
  },
  {
    "source": 3703,
    "target": 7505
  },
  {
    "source": 3703,
    "target": 9012
  },
  {
    "source": 3707,
    "target": 3911
  },
  {
    "source": 3707,
    "target": 3703
  },
  {
    "source": 3707,
    "target": 3910
  },
  {
    "source": 3707,
    "target": 3701
  },
  {
    "source": 3707,
    "target": 8209
  },
  {
    "source": 3801,
    "target": 8545
  },
  {
    "source": 3801,
    "target": 2925
  },
  {
    "source": 3801,
    "target": 8406
  },
  {
    "source": 3801,
    "target": 3914
  },
  {
    "source": 3801,
    "target": 6902
  },
  {
    "source": 3802,
    "target": 2508
  },
  {
    "source": 3802,
    "target": 2827
  },
  {
    "source": 3802,
    "target": 3806
  },
  {
    "source": 3802,
    "target": 2818
  },
  {
    "source": 3802,
    "target": 2826
  },
  {
    "source": 3806,
    "target": 4703
  },
  {
    "source": 3806,
    "target": 3913
  },
  {
    "source": 3806,
    "target": 2507
  },
  {
    "source": 3806,
    "target": 5504
  },
  {
    "source": 3806,
    "target": 3802
  },
  {
    "source": 3808,
    "target": 3004
  },
  {
    "source": 3808,
    "target": 3405
  },
  {
    "source": 3808,
    "target": 2106
  },
  {
    "source": 3808,
    "target": 3306
  },
  {
    "source": 3808,
    "target": 1901
  },
  {
    "source": 3809,
    "target": 4811
  },
  {
    "source": 3809,
    "target": 3204
  },
  {
    "source": 3809,
    "target": 3903
  },
  {
    "source": 3809,
    "target": 4810
  },
  {
    "source": 3809,
    "target": 3812
  },
  {
    "source": 3810,
    "target": 3702
  },
  {
    "source": 3810,
    "target": 8475
  },
  {
    "source": 3810,
    "target": 3818
  },
  {
    "source": 3810,
    "target": 6909
  },
  {
    "source": 3810,
    "target": 4002
  },
  {
    "source": 3811,
    "target": 8805
  },
  {
    "source": 3811,
    "target": 8405
  },
  {
    "source": 3811,
    "target": 7002
  },
  {
    "source": 3811,
    "target": 8440
  },
  {
    "source": 3811,
    "target": 5502
  },
  {
    "source": 3812,
    "target": 2918
  },
  {
    "source": 3812,
    "target": 3823
  },
  {
    "source": 3812,
    "target": 3809
  },
  {
    "source": 3812,
    "target": 2929
  },
  {
    "source": 3812,
    "target": 2821
  },
  {
    "source": 3814,
    "target": 3208
  },
  {
    "source": 3814,
    "target": 8309
  },
  {
    "source": 3814,
    "target": 4707
  },
  {
    "source": 3814,
    "target": 6807
  },
  {
    "source": 3814,
    "target": 7317
  },
  {
    "source": 3815,
    "target": 6909
  },
  {
    "source": 3815,
    "target": 8427
  },
  {
    "source": 3815,
    "target": 2923
  },
  {
    "source": 3815,
    "target": 3702
  },
  {
    "source": 3815,
    "target": 3404
  },
  {
    "source": 3816,
    "target": 3214
  },
  {
    "source": 3816,
    "target": 7019
  },
  {
    "source": 3816,
    "target": 4811
  },
  {
    "source": 3816,
    "target": 6902
  },
  {
    "source": 3816,
    "target": 3405
  },
  {
    "source": 3817,
    "target": 2815
  },
  {
    "source": 3817,
    "target": 2902
  },
  {
    "source": 3817,
    "target": 7004
  },
  {
    "source": 3817,
    "target": 5502
  },
  {
    "source": 3817,
    "target": 2804
  },
  {
    "source": 3818,
    "target": 3810
  },
  {
    "source": 3818,
    "target": 2903
  },
  {
    "source": 3818,
    "target": 2821
  },
  {
    "source": 3818,
    "target": 2804
  },
  {
    "source": 3818,
    "target": 9024
  },
  {
    "source": 3821,
    "target": 3403
  },
  {
    "source": 3821,
    "target": 3001
  },
  {
    "source": 3821,
    "target": 3504
  },
  {
    "source": 3821,
    "target": 3822
  },
  {
    "source": 3821,
    "target": 3002
  },
  {
    "source": 3822,
    "target": 3821
  },
  {
    "source": 3822,
    "target": 8427
  },
  {
    "source": 3822,
    "target": 3002
  },
  {
    "source": 3822,
    "target": 9018
  },
  {
    "source": 3822,
    "target": 9019
  },
  {
    "source": 3823,
    "target": 3215
  },
  {
    "source": 3823,
    "target": 3701
  },
  {
    "source": 3823,
    "target": 3212
  },
  {
    "source": 3823,
    "target": 3812
  },
  {
    "source": 3823,
    "target": 8440
  },
  {
    "source": 3901,
    "target": 3902
  },
  {
    "source": 3901,
    "target": 2901
  },
  {
    "source": 3901,
    "target": 3904
  },
  {
    "source": 3901,
    "target": 3903
  },
  {
    "source": 3901,
    "target": 2902
  },
  {
    "source": 3902,
    "target": 3901
  },
  {
    "source": 3902,
    "target": 3903
  },
  {
    "source": 3902,
    "target": 3904
  },
  {
    "source": 3902,
    "target": 2902
  },
  {
    "source": 3902,
    "target": 2815
  },
  {
    "source": 3903,
    "target": 3902
  },
  {
    "source": 3903,
    "target": 8475
  },
  {
    "source": 3903,
    "target": 3901
  },
  {
    "source": 3903,
    "target": 3206
  },
  {
    "source": 3903,
    "target": 3809
  },
  {
    "source": 3904,
    "target": 2803
  },
  {
    "source": 3904,
    "target": 3901
  },
  {
    "source": 3904,
    "target": 2917
  },
  {
    "source": 3904,
    "target": 3902
  },
  {
    "source": 3904,
    "target": 2815
  },
  {
    "source": 3905,
    "target": 3506
  },
  {
    "source": 3905,
    "target": 3906
  },
  {
    "source": 3905,
    "target": 3212
  },
  {
    "source": 3905,
    "target": 3207
  },
  {
    "source": 3905,
    "target": 2915
  },
  {
    "source": 3906,
    "target": 3910
  },
  {
    "source": 3906,
    "target": 5603
  },
  {
    "source": 3906,
    "target": 3404
  },
  {
    "source": 3906,
    "target": 3907
  },
  {
    "source": 3906,
    "target": 3905
  },
  {
    "source": 3907,
    "target": 3908
  },
  {
    "source": 3907,
    "target": 2917
  },
  {
    "source": 3907,
    "target": 2916
  },
  {
    "source": 3907,
    "target": 3906
  },
  {
    "source": 3907,
    "target": 3404
  },
  {
    "source": 3908,
    "target": 3907
  },
  {
    "source": 3908,
    "target": 8456
  },
  {
    "source": 3908,
    "target": 3403
  },
  {
    "source": 3908,
    "target": 8457
  },
  {
    "source": 3908,
    "target": 2920
  },
  {
    "source": 3909,
    "target": 7220
  },
  {
    "source": 3909,
    "target": 8428
  },
  {
    "source": 3909,
    "target": 5906
  },
  {
    "source": 3909,
    "target": 3506
  },
  {
    "source": 3909,
    "target": 4811
  },
  {
    "source": 3910,
    "target": 3911
  },
  {
    "source": 3910,
    "target": 3707
  },
  {
    "source": 3910,
    "target": 8427
  },
  {
    "source": 3910,
    "target": 3906
  },
  {
    "source": 3910,
    "target": 4002
  },
  {
    "source": 3911,
    "target": 3910
  },
  {
    "source": 3911,
    "target": 3707
  },
  {
    "source": 3911,
    "target": 2916
  },
  {
    "source": 3911,
    "target": 3702
  },
  {
    "source": 3911,
    "target": 2910
  },
  {
    "source": 3912,
    "target": 2923
  },
  {
    "source": 3912,
    "target": 2915
  },
  {
    "source": 3912,
    "target": 3404
  },
  {
    "source": 3912,
    "target": 2507
  },
  {
    "source": 3912,
    "target": 2811
  },
  {
    "source": 3913,
    "target": 2821
  },
  {
    "source": 3913,
    "target": 3003
  },
  {
    "source": 3913,
    "target": 9021
  },
  {
    "source": 3913,
    "target": 3507
  },
  {
    "source": 3913,
    "target": 3806
  },
  {
    "source": 3914,
    "target": 7507
  },
  {
    "source": 3914,
    "target": 9024
  },
  {
    "source": 3914,
    "target": 8108
  },
  {
    "source": 3914,
    "target": 7218
  },
  {
    "source": 3914,
    "target": 3801
  },
  {
    "source": 3915,
    "target": 4707
  },
  {
    "source": 3915,
    "target": 604
  },
  {
    "source": 3915,
    "target": 5607
  },
  {
    "source": 3915,
    "target": 4104
  },
  {
    "source": 3915,
    "target": 4107
  },
  {
    "source": 3916,
    "target": 3214
  },
  {
    "source": 3916,
    "target": 3925
  },
  {
    "source": 3916,
    "target": 5602
  },
  {
    "source": 3916,
    "target": 7321
  },
  {
    "source": 3916,
    "target": 3920
  },
  {
    "source": 3917,
    "target": 3923
  },
  {
    "source": 3917,
    "target": 4819
  },
  {
    "source": 3917,
    "target": 3209
  },
  {
    "source": 3917,
    "target": 3922
  },
  {
    "source": 3917,
    "target": 4808
  },
  {
    "source": 3918,
    "target": 7419
  },
  {
    "source": 3918,
    "target": 4814
  },
  {
    "source": 3918,
    "target": 3206
  },
  {
    "source": 3918,
    "target": 7210
  },
  {
    "source": 3918,
    "target": 8101
  },
  {
    "source": 3919,
    "target": 5603
  },
  {
    "source": 3919,
    "target": 8424
  },
  {
    "source": 3919,
    "target": 3215
  },
  {
    "source": 3919,
    "target": 8475
  },
  {
    "source": 3919,
    "target": 4811
  },
  {
    "source": 3920,
    "target": 3921
  },
  {
    "source": 3920,
    "target": 3923
  },
  {
    "source": 3920,
    "target": 4823
  },
  {
    "source": 3920,
    "target": 3916
  },
  {
    "source": 3920,
    "target": 7306
  },
  {
    "source": 3921,
    "target": 3920
  },
  {
    "source": 3921,
    "target": 3923
  },
  {
    "source": 3921,
    "target": 3925
  },
  {
    "source": 3921,
    "target": 7310
  },
  {
    "source": 3921,
    "target": 3214
  },
  {
    "source": 3922,
    "target": 7308
  },
  {
    "source": 3922,
    "target": 7324
  },
  {
    "source": 3922,
    "target": 7314
  },
  {
    "source": 3922,
    "target": 3917
  },
  {
    "source": 3922,
    "target": 8716
  },
  {
    "source": 3923,
    "target": 4819
  },
  {
    "source": 3923,
    "target": 3921
  },
  {
    "source": 3923,
    "target": 3402
  },
  {
    "source": 3923,
    "target": 3917
  },
  {
    "source": 3923,
    "target": 3920
  },
  {
    "source": 3924,
    "target": 7323
  },
  {
    "source": 3924,
    "target": 7615
  },
  {
    "source": 3924,
    "target": 710
  },
  {
    "source": 3924,
    "target": 3304
  },
  {
    "source": 3924,
    "target": 7907
  },
  {
    "source": 3925,
    "target": 7610
  },
  {
    "source": 3925,
    "target": 1601
  },
  {
    "source": 3925,
    "target": 3916
  },
  {
    "source": 3925,
    "target": 3921
  },
  {
    "source": 3925,
    "target": 6810
  },
  {
    "source": 3926,
    "target": 8531
  },
  {
    "source": 3926,
    "target": 9506
  },
  {
    "source": 3926,
    "target": 8536
  },
  {
    "source": 3926,
    "target": 8301
  },
  {
    "source": 3926,
    "target": 8308
  },
  {
    "source": 4001,
    "target": 1513
  },
  {
    "source": 4001,
    "target": 1801
  },
  {
    "source": 4001,
    "target": 1803
  },
  {
    "source": 4001,
    "target": 801
  },
  {
    "source": 4001,
    "target": 1511
  },
  {
    "source": 4002,
    "target": 3910
  },
  {
    "source": 4002,
    "target": 6909
  },
  {
    "source": 4002,
    "target": 2917
  },
  {
    "source": 4002,
    "target": 2901
  },
  {
    "source": 4002,
    "target": 3810
  },
  {
    "source": 4005,
    "target": 4008
  },
  {
    "source": 4005,
    "target": 3505
  },
  {
    "source": 4005,
    "target": 7907
  },
  {
    "source": 4005,
    "target": 4015
  },
  {
    "source": 4005,
    "target": 8307
  },
  {
    "source": 4008,
    "target": 8416
  },
  {
    "source": 4008,
    "target": 5602
  },
  {
    "source": 4008,
    "target": 8417
  },
  {
    "source": 4008,
    "target": 4011
  },
  {
    "source": 4008,
    "target": 4005
  },
  {
    "source": 4009,
    "target": 8409
  },
  {
    "source": 4009,
    "target": 8512
  },
  {
    "source": 4009,
    "target": 8511
  },
  {
    "source": 4009,
    "target": 8516
  },
  {
    "source": 4009,
    "target": 7320
  },
  {
    "source": 4010,
    "target": 8482
  },
  {
    "source": 4010,
    "target": 7608
  },
  {
    "source": 4010,
    "target": 8402
  },
  {
    "source": 4010,
    "target": 6804
  },
  {
    "source": 4010,
    "target": 8546
  },
  {
    "source": 4011,
    "target": 7312
  },
  {
    "source": 4011,
    "target": 8402
  },
  {
    "source": 4011,
    "target": 4008
  },
  {
    "source": 4011,
    "target": 5902
  },
  {
    "source": 4011,
    "target": 8450
  },
  {
    "source": 4012,
    "target": 5404
  },
  {
    "source": 4012,
    "target": 9608
  },
  {
    "source": 4012,
    "target": 1520
  },
  {
    "source": 4012,
    "target": 8709
  },
  {
    "source": 4012,
    "target": 4014
  },
  {
    "source": 4013,
    "target": 4014
  },
  {
    "source": 4013,
    "target": 7317
  },
  {
    "source": 4013,
    "target": 4015
  },
  {
    "source": 4013,
    "target": 6702
  },
  {
    "source": 4013,
    "target": 4107
  },
  {
    "source": 4014,
    "target": 8305
  },
  {
    "source": 4014,
    "target": 4012
  },
  {
    "source": 4014,
    "target": 8715
  },
  {
    "source": 4014,
    "target": 4908
  },
  {
    "source": 4014,
    "target": 4013
  },
  {
    "source": 4015,
    "target": 4005
  },
  {
    "source": 4015,
    "target": 9609
  },
  {
    "source": 4015,
    "target": 9505
  },
  {
    "source": 4015,
    "target": 4013
  },
  {
    "source": 4015,
    "target": 6702
  },
  {
    "source": 4016,
    "target": 8512
  },
  {
    "source": 4016,
    "target": 8409
  },
  {
    "source": 4016,
    "target": 7326
  },
  {
    "source": 4016,
    "target": 7318
  },
  {
    "source": 4016,
    "target": 8537
  },
  {
    "source": 4101,
    "target": 4104
  },
  {
    "source": 4101,
    "target": 102
  },
  {
    "source": 4101,
    "target": 1104
  },
  {
    "source": 4101,
    "target": 2501
  },
  {
    "source": 4101,
    "target": 409
  },
  {
    "source": 4102,
    "target": 4105
  },
  {
    "source": 4102,
    "target": 104
  },
  {
    "source": 4102,
    "target": 204
  },
  {
    "source": 4102,
    "target": 4106
  },
  {
    "source": 4102,
    "target": 5101
  },
  {
    "source": 4104,
    "target": 4101
  },
  {
    "source": 4104,
    "target": 4105
  },
  {
    "source": 4104,
    "target": 4106
  },
  {
    "source": 4104,
    "target": 3915
  },
  {
    "source": 4104,
    "target": 202
  },
  {
    "source": 4105,
    "target": 4106
  },
  {
    "source": 4105,
    "target": 4102
  },
  {
    "source": 4105,
    "target": 4104
  },
  {
    "source": 4105,
    "target": 104
  },
  {
    "source": 4105,
    "target": 1212
  },
  {
    "source": 4106,
    "target": 4105
  },
  {
    "source": 4106,
    "target": 4102
  },
  {
    "source": 4106,
    "target": 4104
  },
  {
    "source": 4106,
    "target": 104
  },
  {
    "source": 4106,
    "target": 2002
  },
  {
    "source": 4107,
    "target": 6305
  },
  {
    "source": 4107,
    "target": 6301
  },
  {
    "source": 4107,
    "target": 3915
  },
  {
    "source": 4107,
    "target": 4013
  },
  {
    "source": 4107,
    "target": 5205
  },
  {
    "source": 4201,
    "target": 8212
  },
  {
    "source": 4201,
    "target": 4301
  },
  {
    "source": 4201,
    "target": 6309
  },
  {
    "source": 4201,
    "target": 7113
  },
  {
    "source": 4201,
    "target": 8001
  },
  {
    "source": 4202,
    "target": 4203
  },
  {
    "source": 4202,
    "target": 6214
  },
  {
    "source": 4202,
    "target": 6404
  },
  {
    "source": 4202,
    "target": 7117
  },
  {
    "source": 4202,
    "target": 6217
  },
  {
    "source": 4203,
    "target": 6202
  },
  {
    "source": 4203,
    "target": 4202
  },
  {
    "source": 4203,
    "target": 4205
  },
  {
    "source": 4203,
    "target": 6214
  },
  {
    "source": 4203,
    "target": 6405
  },
  {
    "source": 4205,
    "target": 4203
  },
  {
    "source": 4205,
    "target": 6215
  },
  {
    "source": 4205,
    "target": 6304
  },
  {
    "source": 4205,
    "target": 2003
  },
  {
    "source": 4205,
    "target": 6116
  },
  {
    "source": 4301,
    "target": 4302
  },
  {
    "source": 4301,
    "target": 4705
  },
  {
    "source": 4301,
    "target": 4303
  },
  {
    "source": 4301,
    "target": 2703
  },
  {
    "source": 4301,
    "target": 4201
  },
  {
    "source": 4302,
    "target": 4303
  },
  {
    "source": 4302,
    "target": 4301
  },
  {
    "source": 4302,
    "target": 5107
  },
  {
    "source": 4302,
    "target": 6809
  },
  {
    "source": 4302,
    "target": 208
  },
  {
    "source": 4303,
    "target": 4302
  },
  {
    "source": 4303,
    "target": 5112
  },
  {
    "source": 4303,
    "target": 5111
  },
  {
    "source": 4303,
    "target": 4301
  },
  {
    "source": 4303,
    "target": 208
  },
  {
    "source": 4401,
    "target": 4407
  },
  {
    "source": 4401,
    "target": 4410
  },
  {
    "source": 4401,
    "target": 4408
  },
  {
    "source": 4401,
    "target": 4403
  },
  {
    "source": 4401,
    "target": 4421
  },
  {
    "source": 4403,
    "target": 4407
  },
  {
    "source": 4403,
    "target": 4401
  },
  {
    "source": 4403,
    "target": 4408
  },
  {
    "source": 4403,
    "target": 2302
  },
  {
    "source": 4403,
    "target": 7204
  },
  {
    "source": 4407,
    "target": 4403
  },
  {
    "source": 4407,
    "target": 4409
  },
  {
    "source": 4407,
    "target": 4408
  },
  {
    "source": 4407,
    "target": 4412
  },
  {
    "source": 4407,
    "target": 4401
  },
  {
    "source": 4408,
    "target": 4407
  },
  {
    "source": 4408,
    "target": 4412
  },
  {
    "source": 4408,
    "target": 4409
  },
  {
    "source": 4408,
    "target": 4401
  },
  {
    "source": 4408,
    "target": 4403
  },
  {
    "source": 4409,
    "target": 4407
  },
  {
    "source": 4409,
    "target": 4412
  },
  {
    "source": 4409,
    "target": 4408
  },
  {
    "source": 4409,
    "target": 4418
  },
  {
    "source": 4409,
    "target": 4421
  },
  {
    "source": 4410,
    "target": 4411
  },
  {
    "source": 4410,
    "target": 4805
  },
  {
    "source": 4410,
    "target": 4415
  },
  {
    "source": 4410,
    "target": 1806
  },
  {
    "source": 4410,
    "target": 4401
  },
  {
    "source": 4411,
    "target": 4410
  },
  {
    "source": 4411,
    "target": 4805
  },
  {
    "source": 4411,
    "target": 4418
  },
  {
    "source": 4411,
    "target": 103
  },
  {
    "source": 4411,
    "target": 4421
  },
  {
    "source": 4412,
    "target": 4408
  },
  {
    "source": 4412,
    "target": 4409
  },
  {
    "source": 4412,
    "target": 4407
  },
  {
    "source": 4412,
    "target": 4418
  },
  {
    "source": 4412,
    "target": 4421
  },
  {
    "source": 4414,
    "target": 6912
  },
  {
    "source": 4414,
    "target": 8215
  },
  {
    "source": 4414,
    "target": 9503
  },
  {
    "source": 4414,
    "target": 9613
  },
  {
    "source": 4414,
    "target": 2003
  },
  {
    "source": 4415,
    "target": 4418
  },
  {
    "source": 4415,
    "target": 7308
  },
  {
    "source": 4415,
    "target": 1601
  },
  {
    "source": 4415,
    "target": 4410
  },
  {
    "source": 4415,
    "target": 6810
  },
  {
    "source": 4418,
    "target": 4415
  },
  {
    "source": 4418,
    "target": 4421
  },
  {
    "source": 4418,
    "target": 4409
  },
  {
    "source": 4418,
    "target": 4412
  },
  {
    "source": 4418,
    "target": 4411
  },
  {
    "source": 4420,
    "target": 8306
  },
  {
    "source": 4420,
    "target": 4602
  },
  {
    "source": 4420,
    "target": 6704
  },
  {
    "source": 4420,
    "target": 6306
  },
  {
    "source": 4420,
    "target": 801
  },
  {
    "source": 4421,
    "target": 4418
  },
  {
    "source": 4421,
    "target": 4409
  },
  {
    "source": 4421,
    "target": 4412
  },
  {
    "source": 4421,
    "target": 4401
  },
  {
    "source": 4421,
    "target": 4411
  },
  {
    "source": 4602,
    "target": 4420
  },
  {
    "source": 4602,
    "target": 6704
  },
  {
    "source": 4602,
    "target": 6210
  },
  {
    "source": 4602,
    "target": 301
  },
  {
    "source": 4602,
    "target": 5007
  },
  {
    "source": 4702,
    "target": 4703
  },
  {
    "source": 4702,
    "target": 4705
  },
  {
    "source": 4702,
    "target": 4802
  },
  {
    "source": 4702,
    "target": 4804
  },
  {
    "source": 4702,
    "target": 4801
  },
  {
    "source": 4703,
    "target": 4705
  },
  {
    "source": 4703,
    "target": 4702
  },
  {
    "source": 4703,
    "target": 4804
  },
  {
    "source": 4703,
    "target": 3806
  },
  {
    "source": 4703,
    "target": 4802
  },
  {
    "source": 4705,
    "target": 4703
  },
  {
    "source": 4705,
    "target": 4702
  },
  {
    "source": 4705,
    "target": 4804
  },
  {
    "source": 4705,
    "target": 4801
  },
  {
    "source": 4705,
    "target": 4301
  },
  {
    "source": 4707,
    "target": 3814
  },
  {
    "source": 4707,
    "target": 3915
  },
  {
    "source": 4707,
    "target": 7602
  },
  {
    "source": 4707,
    "target": 2309
  },
  {
    "source": 4707,
    "target": 2204
  },
  {
    "source": 4801,
    "target": 4810
  },
  {
    "source": 4801,
    "target": 4802
  },
  {
    "source": 4801,
    "target": 4705
  },
  {
    "source": 4801,
    "target": 4702
  },
  {
    "source": 4801,
    "target": 7508
  },
  {
    "source": 4802,
    "target": 4804
  },
  {
    "source": 4802,
    "target": 4702
  },
  {
    "source": 4802,
    "target": 4801
  },
  {
    "source": 4802,
    "target": 4703
  },
  {
    "source": 4802,
    "target": 4806
  },
  {
    "source": 4803,
    "target": 4818
  },
  {
    "source": 4803,
    "target": 7413
  },
  {
    "source": 4803,
    "target": 7604
  },
  {
    "source": 4803,
    "target": 7614
  },
  {
    "source": 4803,
    "target": 811
  },
  {
    "source": 4804,
    "target": 4703
  },
  {
    "source": 4804,
    "target": 4802
  },
  {
    "source": 4804,
    "target": 4702
  },
  {
    "source": 4804,
    "target": 4705
  },
  {
    "source": 4804,
    "target": 2507
  },
  {
    "source": 4805,
    "target": 4410
  },
  {
    "source": 4805,
    "target": 1514
  },
  {
    "source": 4805,
    "target": 4808
  },
  {
    "source": 4805,
    "target": 4411
  },
  {
    "source": 4805,
    "target": 2303
  },
  {
    "source": 4806,
    "target": 8439
  },
  {
    "source": 4806,
    "target": 8425
  },
  {
    "source": 4806,
    "target": 4802
  },
  {
    "source": 4806,
    "target": 2811
  },
  {
    "source": 4806,
    "target": 8713
  },
  {
    "source": 4808,
    "target": 4819
  },
  {
    "source": 4808,
    "target": 3917
  },
  {
    "source": 4808,
    "target": 4805
  },
  {
    "source": 4808,
    "target": 1806
  },
  {
    "source": 4808,
    "target": 7306
  },
  {
    "source": 4809,
    "target": 6909
  },
  {
    "source": 4809,
    "target": 3207
  },
  {
    "source": 4809,
    "target": 7223
  },
  {
    "source": 4809,
    "target": 3005
  },
  {
    "source": 4809,
    "target": 5404
  },
  {
    "source": 4810,
    "target": 4801
  },
  {
    "source": 4810,
    "target": 7607
  },
  {
    "source": 4810,
    "target": 7411
  },
  {
    "source": 4810,
    "target": 3809
  },
  {
    "source": 4810,
    "target": 7606
  },
  {
    "source": 4811,
    "target": 3909
  },
  {
    "source": 4811,
    "target": 8416
  },
  {
    "source": 4811,
    "target": 3809
  },
  {
    "source": 4811,
    "target": 3919
  },
  {
    "source": 4811,
    "target": 3816
  },
  {
    "source": 4813,
    "target": 1520
  },
  {
    "source": 4813,
    "target": 8478
  },
  {
    "source": 4813,
    "target": 3303
  },
  {
    "source": 4813,
    "target": 9406
  },
  {
    "source": 4813,
    "target": 208
  },
  {
    "source": 4814,
    "target": 7302
  },
  {
    "source": 4814,
    "target": 3918
  },
  {
    "source": 4814,
    "target": 3503
  },
  {
    "source": 4814,
    "target": 8715
  },
  {
    "source": 4814,
    "target": 7305
  },
  {
    "source": 4817,
    "target": 7314
  },
  {
    "source": 4817,
    "target": 4820
  },
  {
    "source": 4817,
    "target": 4821
  },
  {
    "source": 4817,
    "target": 7612
  },
  {
    "source": 4817,
    "target": 7604
  },
  {
    "source": 4818,
    "target": 3402
  },
  {
    "source": 4818,
    "target": 4803
  },
  {
    "source": 4818,
    "target": 4823
  },
  {
    "source": 4818,
    "target": 3209
  },
  {
    "source": 4818,
    "target": 3305
  },
  {
    "source": 4819,
    "target": 3923
  },
  {
    "source": 4819,
    "target": 4808
  },
  {
    "source": 4819,
    "target": 7310
  },
  {
    "source": 4819,
    "target": 3917
  },
  {
    "source": 4819,
    "target": 1704
  },
  {
    "source": 4820,
    "target": 7314
  },
  {
    "source": 4820,
    "target": 9404
  },
  {
    "source": 4820,
    "target": 2103
  },
  {
    "source": 4820,
    "target": 3401
  },
  {
    "source": 4820,
    "target": 4817
  },
  {
    "source": 4821,
    "target": 7310
  },
  {
    "source": 4821,
    "target": 3405
  },
  {
    "source": 4821,
    "target": 8309
  },
  {
    "source": 4821,
    "target": 2103
  },
  {
    "source": 4821,
    "target": 4817
  },
  {
    "source": 4823,
    "target": 3920
  },
  {
    "source": 4823,
    "target": 4818
  },
  {
    "source": 4823,
    "target": 3209
  },
  {
    "source": 4823,
    "target": 3208
  },
  {
    "source": 4823,
    "target": 3405
  },
  {
    "source": 4901,
    "target": 4911
  },
  {
    "source": 4901,
    "target": 4902
  },
  {
    "source": 4901,
    "target": 3004
  },
  {
    "source": 4901,
    "target": 8438
  },
  {
    "source": 4901,
    "target": 8474
  },
  {
    "source": 4902,
    "target": 6806
  },
  {
    "source": 4902,
    "target": 4901
  },
  {
    "source": 4902,
    "target": 4911
  },
  {
    "source": 4902,
    "target": 8434
  },
  {
    "source": 4902,
    "target": 8716
  },
  {
    "source": 4907,
    "target": 2208
  },
  {
    "source": 4907,
    "target": 7204
  },
  {
    "source": 4907,
    "target": 7103
  },
  {
    "source": 4907,
    "target": 2714
  },
  {
    "source": 4907,
    "target": 5201
  },
  {
    "source": 4908,
    "target": 9603
  },
  {
    "source": 4908,
    "target": 8305
  },
  {
    "source": 4908,
    "target": 9003
  },
  {
    "source": 4908,
    "target": 4014
  },
  {
    "source": 4908,
    "target": 8447
  },
  {
    "source": 4909,
    "target": 7018
  },
  {
    "source": 4909,
    "target": 3406
  },
  {
    "source": 4909,
    "target": 8212
  },
  {
    "source": 4909,
    "target": 511
  },
  {
    "source": 4909,
    "target": 5701
  },
  {
    "source": 4911,
    "target": 4901
  },
  {
    "source": 4911,
    "target": 4902
  },
  {
    "source": 4911,
    "target": 3004
  },
  {
    "source": 4911,
    "target": 3304
  },
  {
    "source": 4911,
    "target": 2106
  },
  {
    "source": 5007,
    "target": 5810
  },
  {
    "source": 5007,
    "target": 8447
  },
  {
    "source": 5007,
    "target": 7303
  },
  {
    "source": 5007,
    "target": 6704
  },
  {
    "source": 5007,
    "target": 4602
  },
  {
    "source": 5101,
    "target": 5105
  },
  {
    "source": 5101,
    "target": 504
  },
  {
    "source": 5101,
    "target": 4102
  },
  {
    "source": 5101,
    "target": 204
  },
  {
    "source": 5101,
    "target": 601
  },
  {
    "source": 5105,
    "target": 5101
  },
  {
    "source": 5105,
    "target": 1214
  },
  {
    "source": 5105,
    "target": 409
  },
  {
    "source": 5105,
    "target": 3301
  },
  {
    "source": 5105,
    "target": 601
  },
  {
    "source": 5107,
    "target": 5112
  },
  {
    "source": 5107,
    "target": 5111
  },
  {
    "source": 5107,
    "target": 5309
  },
  {
    "source": 5107,
    "target": 4302
  },
  {
    "source": 5107,
    "target": 5510
  },
  {
    "source": 5111,
    "target": 5112
  },
  {
    "source": 5111,
    "target": 5309
  },
  {
    "source": 5111,
    "target": 5107
  },
  {
    "source": 5111,
    "target": 5403
  },
  {
    "source": 5111,
    "target": 4303
  },
  {
    "source": 5112,
    "target": 5111
  },
  {
    "source": 5112,
    "target": 5408
  },
  {
    "source": 5112,
    "target": 5309
  },
  {
    "source": 5112,
    "target": 5107
  },
  {
    "source": 5112,
    "target": 4303
  },
  {
    "source": 5201,
    "target": 1202
  },
  {
    "source": 5201,
    "target": 1207
  },
  {
    "source": 5201,
    "target": 902
  },
  {
    "source": 5201,
    "target": 1006
  },
  {
    "source": 5201,
    "target": 4907
  },
  {
    "source": 5205,
    "target": 5209
  },
  {
    "source": 5205,
    "target": 5208
  },
  {
    "source": 5205,
    "target": 6305
  },
  {
    "source": 5205,
    "target": 5513
  },
  {
    "source": 5205,
    "target": 4107
  },
  {
    "source": 5208,
    "target": 5209
  },
  {
    "source": 5208,
    "target": 5205
  },
  {
    "source": 5208,
    "target": 5513
  },
  {
    "source": 5208,
    "target": 5810
  },
  {
    "source": 5208,
    "target": 6305
  },
  {
    "source": 5209,
    "target": 5208
  },
  {
    "source": 5209,
    "target": 5211
  },
  {
    "source": 5209,
    "target": 5205
  },
  {
    "source": 5209,
    "target": 6302
  },
  {
    "source": 5209,
    "target": 6002
  },
  {
    "source": 5210,
    "target": 5211
  },
  {
    "source": 5210,
    "target": 5407
  },
  {
    "source": 5210,
    "target": 5516
  },
  {
    "source": 5210,
    "target": 5801
  },
  {
    "source": 5210,
    "target": 5509
  },
  {
    "source": 5211,
    "target": 5210
  },
  {
    "source": 5211,
    "target": 5209
  },
  {
    "source": 5211,
    "target": 5801
  },
  {
    "source": 5211,
    "target": 5509
  },
  {
    "source": 5211,
    "target": 5515
  },
  {
    "source": 5309,
    "target": 5112
  },
  {
    "source": 5309,
    "target": 5408
  },
  {
    "source": 5309,
    "target": 5403
  },
  {
    "source": 5309,
    "target": 5111
  },
  {
    "source": 5309,
    "target": 5107
  },
  {
    "source": 5401,
    "target": 5807
  },
  {
    "source": 5401,
    "target": 5806
  },
  {
    "source": 5401,
    "target": 9606
  },
  {
    "source": 5401,
    "target": 9607
  },
  {
    "source": 5401,
    "target": 6217
  },
  {
    "source": 5402,
    "target": 5509
  },
  {
    "source": 5402,
    "target": 5514
  },
  {
    "source": 5402,
    "target": 5403
  },
  {
    "source": 5402,
    "target": 5703
  },
  {
    "source": 5402,
    "target": 9609
  },
  {
    "source": 5403,
    "target": 5309
  },
  {
    "source": 5403,
    "target": 5402
  },
  {
    "source": 5403,
    "target": 5111
  },
  {
    "source": 5403,
    "target": 5510
  },
  {
    "source": 5403,
    "target": 5601
  },
  {
    "source": 5404,
    "target": 6815
  },
  {
    "source": 5404,
    "target": 8712
  },
  {
    "source": 5404,
    "target": 4012
  },
  {
    "source": 5404,
    "target": 4809
  },
  {
    "source": 5404,
    "target": 6809
  },
  {
    "source": 5407,
    "target": 5512
  },
  {
    "source": 5407,
    "target": 5515
  },
  {
    "source": 5407,
    "target": 5408
  },
  {
    "source": 5407,
    "target": 5210
  },
  {
    "source": 5407,
    "target": 5516
  },
  {
    "source": 5408,
    "target": 5801
  },
  {
    "source": 5408,
    "target": 5407
  },
  {
    "source": 5408,
    "target": 5516
  },
  {
    "source": 5408,
    "target": 5112
  },
  {
    "source": 5408,
    "target": 5309
  },
  {
    "source": 5501,
    "target": 5503
  },
  {
    "source": 5501,
    "target": 6907
  },
  {
    "source": 5501,
    "target": 2508
  },
  {
    "source": 5501,
    "target": 7614
  },
  {
    "source": 5501,
    "target": 8447
  },
  {
    "source": 5502,
    "target": 2843
  },
  {
    "source": 5502,
    "target": 3811
  },
  {
    "source": 5502,
    "target": 3817
  },
  {
    "source": 5502,
    "target": 8710
  },
  {
    "source": 5502,
    "target": 7004
  },
  {
    "source": 5503,
    "target": 5902
  },
  {
    "source": 5503,
    "target": 5501
  },
  {
    "source": 5503,
    "target": 7312
  },
  {
    "source": 5503,
    "target": 8311
  },
  {
    "source": 5503,
    "target": 6914
  },
  {
    "source": 5504,
    "target": 8711
  },
  {
    "source": 5504,
    "target": 2811
  },
  {
    "source": 5504,
    "target": 3806
  },
  {
    "source": 5504,
    "target": 8445
  },
  {
    "source": 5504,
    "target": 8204
  },
  {
    "source": 5509,
    "target": 5510
  },
  {
    "source": 5509,
    "target": 5211
  },
  {
    "source": 5509,
    "target": 5210
  },
  {
    "source": 5509,
    "target": 6001
  },
  {
    "source": 5509,
    "target": 5402
  },
  {
    "source": 5510,
    "target": 5509
  },
  {
    "source": 5510,
    "target": 8712
  },
  {
    "source": 5510,
    "target": 5107
  },
  {
    "source": 5510,
    "target": 5403
  },
  {
    "source": 5510,
    "target": 6914
  },
  {
    "source": 5512,
    "target": 5516
  },
  {
    "source": 5512,
    "target": 5515
  },
  {
    "source": 5512,
    "target": 5407
  },
  {
    "source": 5512,
    "target": 5514
  },
  {
    "source": 5512,
    "target": 5804
  },
  {
    "source": 5513,
    "target": 5514
  },
  {
    "source": 5513,
    "target": 5208
  },
  {
    "source": 5513,
    "target": 9609
  },
  {
    "source": 5513,
    "target": 6301
  },
  {
    "source": 5513,
    "target": 5205
  },
  {
    "source": 5514,
    "target": 5512
  },
  {
    "source": 5514,
    "target": 5402
  },
  {
    "source": 5514,
    "target": 5513
  },
  {
    "source": 5514,
    "target": 6001
  },
  {
    "source": 5514,
    "target": 7615
  },
  {
    "source": 5515,
    "target": 5516
  },
  {
    "source": 5515,
    "target": 5512
  },
  {
    "source": 5515,
    "target": 5407
  },
  {
    "source": 5515,
    "target": 5801
  },
  {
    "source": 5515,
    "target": 5211
  },
  {
    "source": 5516,
    "target": 5512
  },
  {
    "source": 5516,
    "target": 5515
  },
  {
    "source": 5516,
    "target": 5210
  },
  {
    "source": 5516,
    "target": 5408
  },
  {
    "source": 5516,
    "target": 5407
  },
  {
    "source": 5601,
    "target": 3005
  },
  {
    "source": 5601,
    "target": 9028
  },
  {
    "source": 5601,
    "target": 2003
  },
  {
    "source": 5601,
    "target": 5403
  },
  {
    "source": 5601,
    "target": 1518
  },
  {
    "source": 5602,
    "target": 5906
  },
  {
    "source": 5602,
    "target": 4008
  },
  {
    "source": 5602,
    "target": 7212
  },
  {
    "source": 5602,
    "target": 6815
  },
  {
    "source": 5602,
    "target": 3916
  },
  {
    "source": 5603,
    "target": 7229
  },
  {
    "source": 5603,
    "target": 3919
  },
  {
    "source": 5603,
    "target": 3906
  },
  {
    "source": 5603,
    "target": 6804
  },
  {
    "source": 5603,
    "target": 3207
  },
  {
    "source": 5607,
    "target": 5608
  },
  {
    "source": 5607,
    "target": 9507
  },
  {
    "source": 5607,
    "target": 3915
  },
  {
    "source": 5607,
    "target": 7317
  },
  {
    "source": 5607,
    "target": 6306
  },
  {
    "source": 5608,
    "target": 5607
  },
  {
    "source": 5608,
    "target": 9507
  },
  {
    "source": 5608,
    "target": 9609
  },
  {
    "source": 5608,
    "target": 1605
  },
  {
    "source": 5608,
    "target": 6301
  },
  {
    "source": 5701,
    "target": 5702
  },
  {
    "source": 5701,
    "target": 5705
  },
  {
    "source": 5701,
    "target": 7018
  },
  {
    "source": 5701,
    "target": 4909
  },
  {
    "source": 5702,
    "target": 5703
  },
  {
    "source": 5702,
    "target": 5705
  },
  {
    "source": 5702,
    "target": 5701
  },
  {
    "source": 5702,
    "target": 6302
  },
  {
    "source": 5702,
    "target": 6001
  },
  {
    "source": 5703,
    "target": 5702
  },
  {
    "source": 5703,
    "target": 5705
  },
  {
    "source": 5703,
    "target": 7013
  },
  {
    "source": 5703,
    "target": 7604
  },
  {
    "source": 5703,
    "target": 5402
  },
  {
    "source": 5705,
    "target": 5702
  },
  {
    "source": 5705,
    "target": 5703
  },
  {
    "source": 5705,
    "target": 6303
  },
  {
    "source": 5705,
    "target": 6214
  },
  {
    "source": 5705,
    "target": 5701
  },
  {
    "source": 5801,
    "target": 5903
  },
  {
    "source": 5801,
    "target": 5408
  },
  {
    "source": 5801,
    "target": 5515
  },
  {
    "source": 5801,
    "target": 5211
  },
  {
    "source": 5801,
    "target": 5210
  },
  {
    "source": 5804,
    "target": 5810
  },
  {
    "source": 5804,
    "target": 5807
  },
  {
    "source": 5804,
    "target": 5512
  },
  {
    "source": 5804,
    "target": 6002
  },
  {
    "source": 5804,
    "target": 9607
  },
  {
    "source": 5806,
    "target": 5903
  },
  {
    "source": 5806,
    "target": 5401
  },
  {
    "source": 5806,
    "target": 9607
  },
  {
    "source": 5806,
    "target": 8308
  },
  {
    "source": 5806,
    "target": 6506
  },
  {
    "source": 5807,
    "target": 6002
  },
  {
    "source": 5807,
    "target": 6117
  },
  {
    "source": 5807,
    "target": 5401
  },
  {
    "source": 5807,
    "target": 6217
  },
  {
    "source": 5807,
    "target": 5804
  },
  {
    "source": 5810,
    "target": 5804
  },
  {
    "source": 5810,
    "target": 6217
  },
  {
    "source": 5810,
    "target": 5208
  },
  {
    "source": 5810,
    "target": 9606
  },
  {
    "source": 5810,
    "target": 5007
  },
  {
    "source": 5902,
    "target": 7229
  },
  {
    "source": 5902,
    "target": 4011
  },
  {
    "source": 5902,
    "target": 7312
  },
  {
    "source": 5902,
    "target": 7005
  },
  {
    "source": 5902,
    "target": 5503
  },
  {
    "source": 5903,
    "target": 8480
  },
  {
    "source": 5903,
    "target": 5801
  },
  {
    "source": 5903,
    "target": 8308
  },
  {
    "source": 5903,
    "target": 5906
  },
  {
    "source": 5903,
    "target": 5806
  },
  {
    "source": 5906,
    "target": 5602
  },
  {
    "source": 5906,
    "target": 6805
  },
  {
    "source": 5906,
    "target": 3909
  },
  {
    "source": 5906,
    "target": 5903
  },
  {
    "source": 5906,
    "target": 6903
  },
  {
    "source": 5911,
    "target": 8404
  },
  {
    "source": 5911,
    "target": 9022
  },
  {
    "source": 5911,
    "target": 8703
  },
  {
    "source": 5911,
    "target": 8442
  },
  {
    "source": 5911,
    "target": 7612
  },
  {
    "source": 6001,
    "target": 6002
  },
  {
    "source": 6001,
    "target": 5509
  },
  {
    "source": 6001,
    "target": 5514
  },
  {
    "source": 6001,
    "target": 5702
  },
  {
    "source": 6001,
    "target": 6116
  },
  {
    "source": 6002,
    "target": 5807
  },
  {
    "source": 6002,
    "target": 6001
  },
  {
    "source": 6002,
    "target": 5804
  },
  {
    "source": 6002,
    "target": 9606
  },
  {
    "source": 6002,
    "target": 5209
  },
  {
    "source": 6101,
    "target": 6103
  },
  {
    "source": 6101,
    "target": 6102
  },
  {
    "source": 6101,
    "target": 6205
  },
  {
    "source": 6101,
    "target": 6114
  },
  {
    "source": 6101,
    "target": 6108
  },
  {
    "source": 6102,
    "target": 6104
  },
  {
    "source": 6102,
    "target": 6110
  },
  {
    "source": 6102,
    "target": 6101
  },
  {
    "source": 6102,
    "target": 6111
  },
  {
    "source": 6102,
    "target": 6201
  },
  {
    "source": 6103,
    "target": 6101
  },
  {
    "source": 6103,
    "target": 6209
  },
  {
    "source": 6103,
    "target": 6207
  },
  {
    "source": 6103,
    "target": 6206
  },
  {
    "source": 6103,
    "target": 6106
  },
  {
    "source": 6104,
    "target": 6110
  },
  {
    "source": 6104,
    "target": 6106
  },
  {
    "source": 6104,
    "target": 6109
  },
  {
    "source": 6104,
    "target": 6102
  },
  {
    "source": 6104,
    "target": 6204
  },
  {
    "source": 6105,
    "target": 6106
  },
  {
    "source": 6105,
    "target": 6111
  },
  {
    "source": 6105,
    "target": 6205
  },
  {
    "source": 6105,
    "target": 6114
  },
  {
    "source": 6105,
    "target": 6208
  },
  {
    "source": 6106,
    "target": 6104
  },
  {
    "source": 6106,
    "target": 6110
  },
  {
    "source": 6106,
    "target": 6109
  },
  {
    "source": 6106,
    "target": 6105
  },
  {
    "source": 6106,
    "target": 6103
  },
  {
    "source": 6107,
    "target": 6108
  },
  {
    "source": 6107,
    "target": 6207
  },
  {
    "source": 6107,
    "target": 6203
  },
  {
    "source": 6107,
    "target": 6208
  },
  {
    "source": 6107,
    "target": 6112
  },
  {
    "source": 6108,
    "target": 6107
  },
  {
    "source": 6108,
    "target": 6208
  },
  {
    "source": 6108,
    "target": 6111
  },
  {
    "source": 6108,
    "target": 6207
  },
  {
    "source": 6108,
    "target": 6101
  },
  {
    "source": 6109,
    "target": 6104
  },
  {
    "source": 6109,
    "target": 6110
  },
  {
    "source": 6109,
    "target": 6106
  },
  {
    "source": 6109,
    "target": 6206
  },
  {
    "source": 6109,
    "target": 6204
  },
  {
    "source": 6110,
    "target": 6104
  },
  {
    "source": 6110,
    "target": 6109
  },
  {
    "source": 6110,
    "target": 6106
  },
  {
    "source": 6110,
    "target": 6102
  },
  {
    "source": 6110,
    "target": 6204
  },
  {
    "source": 6111,
    "target": 6209
  },
  {
    "source": 6111,
    "target": 6102
  },
  {
    "source": 6111,
    "target": 6114
  },
  {
    "source": 6111,
    "target": 6108
  },
  {
    "source": 6111,
    "target": 6105
  },
  {
    "source": 6112,
    "target": 6201
  },
  {
    "source": 6112,
    "target": 6115
  },
  {
    "source": 6112,
    "target": 6212
  },
  {
    "source": 6112,
    "target": 6107
  },
  {
    "source": 6112,
    "target": 6202
  },
  {
    "source": 6114,
    "target": 6111
  },
  {
    "source": 6114,
    "target": 6101
  },
  {
    "source": 6114,
    "target": 6211
  },
  {
    "source": 6114,
    "target": 6105
  },
  {
    "source": 6114,
    "target": 6208
  },
  {
    "source": 6115,
    "target": 6112
  },
  {
    "source": 6115,
    "target": 6212
  },
  {
    "source": 6115,
    "target": 6406
  },
  {
    "source": 6115,
    "target": 6307
  },
  {
    "source": 6115,
    "target": 6302
  },
  {
    "source": 6116,
    "target": 6505
  },
  {
    "source": 6116,
    "target": 9507
  },
  {
    "source": 6116,
    "target": 6001
  },
  {
    "source": 6116,
    "target": 6210
  },
  {
    "source": 6116,
    "target": 4205
  },
  {
    "source": 6117,
    "target": 5807
  },
  {
    "source": 6117,
    "target": 6217
  },
  {
    "source": 6117,
    "target": 6505
  },
  {
    "source": 6117,
    "target": 6202
  },
  {
    "source": 6117,
    "target": 6307
  },
  {
    "source": 6201,
    "target": 6202
  },
  {
    "source": 6201,
    "target": 6102
  },
  {
    "source": 6201,
    "target": 6203
  },
  {
    "source": 6201,
    "target": 6211
  },
  {
    "source": 6201,
    "target": 6112
  },
  {
    "source": 6202,
    "target": 6201
  },
  {
    "source": 6202,
    "target": 4203
  },
  {
    "source": 6202,
    "target": 6403
  },
  {
    "source": 6202,
    "target": 6112
  },
  {
    "source": 6202,
    "target": 6117
  },
  {
    "source": 6203,
    "target": 6204
  },
  {
    "source": 6203,
    "target": 6205
  },
  {
    "source": 6203,
    "target": 6201
  },
  {
    "source": 6203,
    "target": 6211
  },
  {
    "source": 6203,
    "target": 6107
  },
  {
    "source": 6204,
    "target": 6206
  },
  {
    "source": 6204,
    "target": 6203
  },
  {
    "source": 6204,
    "target": 6104
  },
  {
    "source": 6204,
    "target": 6110
  },
  {
    "source": 6204,
    "target": 6109
  },
  {
    "source": 6205,
    "target": 6203
  },
  {
    "source": 6205,
    "target": 6206
  },
  {
    "source": 6205,
    "target": 6209
  },
  {
    "source": 6205,
    "target": 6101
  },
  {
    "source": 6205,
    "target": 6105
  },
  {
    "source": 6206,
    "target": 6204
  },
  {
    "source": 6206,
    "target": 6109
  },
  {
    "source": 6206,
    "target": 6209
  },
  {
    "source": 6206,
    "target": 6103
  },
  {
    "source": 6206,
    "target": 6205
  },
  {
    "source": 6207,
    "target": 6208
  },
  {
    "source": 6207,
    "target": 6103
  },
  {
    "source": 6207,
    "target": 6107
  },
  {
    "source": 6207,
    "target": 6108
  },
  {
    "source": 6207,
    "target": 6209
  },
  {
    "source": 6208,
    "target": 6207
  },
  {
    "source": 6208,
    "target": 6108
  },
  {
    "source": 6208,
    "target": 6107
  },
  {
    "source": 6208,
    "target": 6114
  },
  {
    "source": 6208,
    "target": 6105
  },
  {
    "source": 6209,
    "target": 6103
  },
  {
    "source": 6209,
    "target": 6206
  },
  {
    "source": 6209,
    "target": 6111
  },
  {
    "source": 6209,
    "target": 6205
  },
  {
    "source": 6209,
    "target": 6207
  },
  {
    "source": 6210,
    "target": 6211
  },
  {
    "source": 6210,
    "target": 6212
  },
  {
    "source": 6210,
    "target": 6116
  },
  {
    "source": 6210,
    "target": 6402
  },
  {
    "source": 6210,
    "target": 4602
  },
  {
    "source": 6211,
    "target": 6203
  },
  {
    "source": 6211,
    "target": 6201
  },
  {
    "source": 6211,
    "target": 6114
  },
  {
    "source": 6211,
    "target": 6307
  },
  {
    "source": 6211,
    "target": 6210
  },
  {
    "source": 6212,
    "target": 6112
  },
  {
    "source": 6212,
    "target": 6115
  },
  {
    "source": 6212,
    "target": 6505
  },
  {
    "source": 6212,
    "target": 6406
  },
  {
    "source": 6212,
    "target": 6210
  },
  {
    "source": 6214,
    "target": 4202
  },
  {
    "source": 6214,
    "target": 6215
  },
  {
    "source": 6214,
    "target": 4203
  },
  {
    "source": 6214,
    "target": 7117
  },
  {
    "source": 6214,
    "target": 5705
  },
  {
    "source": 6215,
    "target": 6214
  },
  {
    "source": 6215,
    "target": 7117
  },
  {
    "source": 6215,
    "target": 9507
  },
  {
    "source": 6215,
    "target": 4205
  },
  {
    "source": 6215,
    "target": 8452
  },
  {
    "source": 6217,
    "target": 6117
  },
  {
    "source": 6217,
    "target": 5807
  },
  {
    "source": 6217,
    "target": 4202
  },
  {
    "source": 6217,
    "target": 5401
  },
  {
    "source": 6217,
    "target": 5810
  },
  {
    "source": 6301,
    "target": 6304
  },
  {
    "source": 6301,
    "target": 6305
  },
  {
    "source": 6301,
    "target": 4107
  },
  {
    "source": 6301,
    "target": 5513
  },
  {
    "source": 6301,
    "target": 5608
  },
  {
    "source": 6302,
    "target": 6303
  },
  {
    "source": 6302,
    "target": 6115
  },
  {
    "source": 6302,
    "target": 5209
  },
  {
    "source": 6302,
    "target": 6405
  },
  {
    "source": 6302,
    "target": 5702
  },
  {
    "source": 6303,
    "target": 6302
  },
  {
    "source": 6303,
    "target": 6304
  },
  {
    "source": 6303,
    "target": 6911
  },
  {
    "source": 6303,
    "target": 9404
  },
  {
    "source": 6303,
    "target": 5705
  },
  {
    "source": 6304,
    "target": 6303
  },
  {
    "source": 6304,
    "target": 9404
  },
  {
    "source": 6304,
    "target": 6305
  },
  {
    "source": 6304,
    "target": 6301
  },
  {
    "source": 6304,
    "target": 4205
  },
  {
    "source": 6305,
    "target": 6304
  },
  {
    "source": 6305,
    "target": 6301
  },
  {
    "source": 6305,
    "target": 5205
  },
  {
    "source": 6305,
    "target": 4107
  },
  {
    "source": 6305,
    "target": 5208
  },
  {
    "source": 6306,
    "target": 5607
  },
  {
    "source": 6306,
    "target": 3406
  },
  {
    "source": 6306,
    "target": 9406
  },
  {
    "source": 6306,
    "target": 6704
  },
  {
    "source": 6306,
    "target": 4420
  },
  {
    "source": 6307,
    "target": 6117
  },
  {
    "source": 6307,
    "target": 6211
  },
  {
    "source": 6307,
    "target": 6406
  },
  {
    "source": 6307,
    "target": 6115
  },
  {
    "source": 6307,
    "target": 6505
  },
  {
    "source": 6309,
    "target": 7311
  },
  {
    "source": 6309,
    "target": 9703
  },
  {
    "source": 6309,
    "target": 8609
  },
  {
    "source": 6309,
    "target": 4201
  },
  {
    "source": 6309,
    "target": 8802
  },
  {
    "source": 6402,
    "target": 6403
  },
  {
    "source": 6402,
    "target": 6404
  },
  {
    "source": 6402,
    "target": 6405
  },
  {
    "source": 6402,
    "target": 6406
  },
  {
    "source": 6402,
    "target": 6210
  },
  {
    "source": 6403,
    "target": 6404
  },
  {
    "source": 6403,
    "target": 6402
  },
  {
    "source": 6403,
    "target": 6202
  },
  {
    "source": 6403,
    "target": 6406
  },
  {
    "source": 6403,
    "target": 6405
  },
  {
    "source": 6404,
    "target": 6403
  },
  {
    "source": 6404,
    "target": 6402
  },
  {
    "source": 6404,
    "target": 6405
  },
  {
    "source": 6404,
    "target": 6505
  },
  {
    "source": 6404,
    "target": 4202
  },
  {
    "source": 6405,
    "target": 6403
  },
  {
    "source": 6405,
    "target": 6404
  },
  {
    "source": 6405,
    "target": 6402
  },
  {
    "source": 6405,
    "target": 6302
  },
  {
    "source": 6405,
    "target": 4203
  },
  {
    "source": 6406,
    "target": 6403
  },
  {
    "source": 6406,
    "target": 6307
  },
  {
    "source": 6406,
    "target": 6115
  },
  {
    "source": 6406,
    "target": 6212
  },
  {
    "source": 6406,
    "target": 6402
  },
  {
    "source": 6505,
    "target": 6117
  },
  {
    "source": 6505,
    "target": 6116
  },
  {
    "source": 6505,
    "target": 6404
  },
  {
    "source": 6505,
    "target": 6212
  },
  {
    "source": 6505,
    "target": 6307
  },
  {
    "source": 6506,
    "target": 7020
  },
  {
    "source": 6506,
    "target": 5806
  },
  {
    "source": 6506,
    "target": 9209
  },
  {
    "source": 6506,
    "target": 6914
  },
  {
    "source": 6506,
    "target": 8404
  },
  {
    "source": 6601,
    "target": 8510
  },
  {
    "source": 6601,
    "target": 8715
  },
  {
    "source": 6601,
    "target": 8513
  },
  {
    "source": 6601,
    "target": 9505
  },
  {
    "source": 6601,
    "target": 9113
  },
  {
    "source": 6702,
    "target": 9505
  },
  {
    "source": 6702,
    "target": 8513
  },
  {
    "source": 6702,
    "target": 4015
  },
  {
    "source": 6702,
    "target": 4013
  },
  {
    "source": 6702,
    "target": 3406
  },
  {
    "source": 6704,
    "target": 4602
  },
  {
    "source": 6704,
    "target": 4420
  },
  {
    "source": 6704,
    "target": 6306
  },
  {
    "source": 6704,
    "target": 5007
  },
  {
    "source": 6704,
    "target": 301
  },
  {
    "source": 6801,
    "target": 6802
  },
  {
    "source": 6801,
    "target": 2515
  },
  {
    "source": 6801,
    "target": 6908
  },
  {
    "source": 6801,
    "target": 7303
  },
  {
    "source": 6801,
    "target": 7614
  },
  {
    "source": 6802,
    "target": 2515
  },
  {
    "source": 6802,
    "target": 2001
  },
  {
    "source": 6802,
    "target": 6801
  },
  {
    "source": 6802,
    "target": 6908
  },
  {
    "source": 6802,
    "target": 6907
  },
  {
    "source": 6804,
    "target": 4010
  },
  {
    "source": 6804,
    "target": 7607
  },
  {
    "source": 6804,
    "target": 5603
  },
  {
    "source": 6804,
    "target": 8507
  },
  {
    "source": 6804,
    "target": 8454
  },
  {
    "source": 6805,
    "target": 8202
  },
  {
    "source": 6805,
    "target": 5906
  },
  {
    "source": 6805,
    "target": 8480
  },
  {
    "source": 6805,
    "target": 7007
  },
  {
    "source": 6805,
    "target": 7211
  },
  {
    "source": 6806,
    "target": 8433
  },
  {
    "source": 6806,
    "target": 7008
  },
  {
    "source": 6806,
    "target": 8403
  },
  {
    "source": 6806,
    "target": 8412
  },
  {
    "source": 6806,
    "target": 4902
  },
  {
    "source": 6807,
    "target": 7604
  },
  {
    "source": 6807,
    "target": 3814
  },
  {
    "source": 6807,
    "target": 6809
  },
  {
    "source": 6807,
    "target": 7605
  },
  {
    "source": 6807,
    "target": 2713
  },
  {
    "source": 6809,
    "target": 5404
  },
  {
    "source": 6809,
    "target": 407
  },
  {
    "source": 6809,
    "target": 6807
  },
  {
    "source": 6809,
    "target": 1518
  },
  {
    "source": 6809,
    "target": 4302
  },
  {
    "source": 6810,
    "target": 7610
  },
  {
    "source": 6810,
    "target": 9403
  },
  {
    "source": 6810,
    "target": 3925
  },
  {
    "source": 6810,
    "target": 7308
  },
  {
    "source": 6810,
    "target": 4415
  },
  {
    "source": 6813,
    "target": 8407
  },
  {
    "source": 6813,
    "target": 6902
  },
  {
    "source": 6813,
    "target": 7205
  },
  {
    "source": 6813,
    "target": 7304
  },
  {
    "source": 6813,
    "target": 2833
  },
  {
    "source": 6815,
    "target": 6903
  },
  {
    "source": 6815,
    "target": 5602
  },
  {
    "source": 6815,
    "target": 7019
  },
  {
    "source": 6815,
    "target": 7419
  },
  {
    "source": 6815,
    "target": 5404
  },
  {
    "source": 6902,
    "target": 3816
  },
  {
    "source": 6902,
    "target": 6813
  },
  {
    "source": 6902,
    "target": 8545
  },
  {
    "source": 6902,
    "target": 3801
  },
  {
    "source": 6902,
    "target": 7208
  },
  {
    "source": 6903,
    "target": 6909
  },
  {
    "source": 6903,
    "target": 7009
  },
  {
    "source": 6903,
    "target": 6815
  },
  {
    "source": 6903,
    "target": 5906
  },
  {
    "source": 6903,
    "target": 8511
  },
  {
    "source": 6907,
    "target": 6908
  },
  {
    "source": 6907,
    "target": 6802
  },
  {
    "source": 6907,
    "target": 5501
  },
  {
    "source": 6907,
    "target": 7614
  },
  {
    "source": 6907,
    "target": 2003
  },
  {
    "source": 6908,
    "target": 6907
  },
  {
    "source": 6908,
    "target": 6910
  },
  {
    "source": 6908,
    "target": 6802
  },
  {
    "source": 6908,
    "target": 7010
  },
  {
    "source": 6908,
    "target": 6801
  },
  {
    "source": 6909,
    "target": 6903
  },
  {
    "source": 6909,
    "target": 4809
  },
  {
    "source": 6909,
    "target": 4002
  },
  {
    "source": 6909,
    "target": 3810
  },
  {
    "source": 6909,
    "target": 3815
  },
  {
    "source": 6910,
    "target": 6908
  },
  {
    "source": 6910,
    "target": 7321
  },
  {
    "source": 6910,
    "target": 8544
  },
  {
    "source": 6910,
    "target": 7612
  },
  {
    "source": 6910,
    "target": 6911
  },
  {
    "source": 6911,
    "target": 6912
  },
  {
    "source": 6911,
    "target": 6913
  },
  {
    "source": 6911,
    "target": 7013
  },
  {
    "source": 6911,
    "target": 6303
  },
  {
    "source": 6911,
    "target": 6910
  },
  {
    "source": 6912,
    "target": 6911
  },
  {
    "source": 6912,
    "target": 6913
  },
  {
    "source": 6912,
    "target": 4414
  },
  {
    "source": 6912,
    "target": 8306
  },
  {
    "source": 6912,
    "target": 8215
  },
  {
    "source": 6913,
    "target": 6912
  },
  {
    "source": 6913,
    "target": 8306
  },
  {
    "source": 6913,
    "target": 6911
  },
  {
    "source": 6913,
    "target": 6914
  },
  {
    "source": 6913,
    "target": 8712
  },
  {
    "source": 6914,
    "target": 6913
  },
  {
    "source": 6914,
    "target": 7020
  },
  {
    "source": 6914,
    "target": 6506
  },
  {
    "source": 6914,
    "target": 5503
  },
  {
    "source": 6914,
    "target": 5510
  },
  {
    "source": 7002,
    "target": 3503
  },
  {
    "source": 7002,
    "target": 3811
  },
  {
    "source": 7002,
    "target": 7508
  },
  {
    "source": 7002,
    "target": 2827
  },
  {
    "source": 7002,
    "target": 2939
  },
  {
    "source": 7004,
    "target": 2708
  },
  {
    "source": 7004,
    "target": 2843
  },
  {
    "source": 7004,
    "target": 3817
  },
  {
    "source": 7004,
    "target": 2826
  },
  {
    "source": 7004,
    "target": 5502
  },
  {
    "source": 7005,
    "target": 7009
  },
  {
    "source": 7005,
    "target": 5902
  },
  {
    "source": 7005,
    "target": 8528
  },
  {
    "source": 7005,
    "target": 7208
  },
  {
    "source": 7005,
    "target": 8311
  },
  {
    "source": 7006,
    "target": 7020
  },
  {
    "source": 7006,
    "target": 9002
  },
  {
    "source": 7006,
    "target": 8714
  },
  {
    "source": 7006,
    "target": 8472
  },
  {
    "source": 7006,
    "target": 8507
  },
  {
    "source": 7007,
    "target": 8530
  },
  {
    "source": 7007,
    "target": 7009
  },
  {
    "source": 7007,
    "target": 8301
  },
  {
    "source": 7007,
    "target": 6805
  },
  {
    "source": 7007,
    "target": 8707
  },
  {
    "source": 7008,
    "target": 6806
  },
  {
    "source": 7008,
    "target": 8607
  },
  {
    "source": 7008,
    "target": 8530
  },
  {
    "source": 7008,
    "target": 7019
  },
  {
    "source": 7008,
    "target": 8403
  },
  {
    "source": 7009,
    "target": 8512
  },
  {
    "source": 7009,
    "target": 7007
  },
  {
    "source": 7009,
    "target": 6903
  },
  {
    "source": 7009,
    "target": 7412
  },
  {
    "source": 7009,
    "target": 7005
  },
  {
    "source": 7010,
    "target": 8309
  },
  {
    "source": 7010,
    "target": 1101
  },
  {
    "source": 7010,
    "target": 6908
  },
  {
    "source": 7010,
    "target": 2203
  },
  {
    "source": 7010,
    "target": 1108
  },
  {
    "source": 7013,
    "target": 8418
  },
  {
    "source": 7013,
    "target": 6911
  },
  {
    "source": 7013,
    "target": 5703
  },
  {
    "source": 7013,
    "target": 7604
  },
  {
    "source": 7013,
    "target": 7323
  },
  {
    "source": 7018,
    "target": 4909
  },
  {
    "source": 7018,
    "target": 8212
  },
  {
    "source": 7018,
    "target": 5701
  },
  {
    "source": 7018,
    "target": 7303
  },
  {
    "source": 7018,
    "target": 8447
  },
  {
    "source": 7019,
    "target": 7008
  },
  {
    "source": 7019,
    "target": 3214
  },
  {
    "source": 7019,
    "target": 6815
  },
  {
    "source": 7019,
    "target": 7324
  },
  {
    "source": 7019,
    "target": 3816
  },
  {
    "source": 7020,
    "target": 8714
  },
  {
    "source": 7020,
    "target": 7006
  },
  {
    "source": 7020,
    "target": 6506
  },
  {
    "source": 7020,
    "target": 8472
  },
  {
    "source": 7020,
    "target": 6914
  },
  {
    "source": 7101,
    "target": 7113
  },
  {
    "source": 7101,
    "target": 9101
  },
  {
    "source": 7101,
    "target": 8001
  },
  {
    "source": 7101,
    "target": 9015
  },
  {
    "source": 7102,
    "target": 7103
  },
  {
    "source": 7102,
    "target": 2615
  },
  {
    "source": 7102,
    "target": 2703
  },
  {
    "source": 7102,
    "target": 8904
  },
  {
    "source": 7102,
    "target": 2606
  },
  {
    "source": 7103,
    "target": 7102
  },
  {
    "source": 7103,
    "target": 2615
  },
  {
    "source": 7103,
    "target": 2614
  },
  {
    "source": 7103,
    "target": 4907
  },
  {
    "source": 7103,
    "target": 2610
  },
  {
    "source": 7106,
    "target": 2841
  },
  {
    "source": 7106,
    "target": 7115
  },
  {
    "source": 7106,
    "target": 2825
  },
  {
    "source": 7106,
    "target": 2607
  },
  {
    "source": 7106,
    "target": 2613
  },
  {
    "source": 7110,
    "target": 7506
  },
  {
    "source": 7110,
    "target": 7115
  },
  {
    "source": 7110,
    "target": 2843
  },
  {
    "source": 7110,
    "target": 2930
  },
  {
    "source": 7110,
    "target": 2704
  },
  {
    "source": 7112,
    "target": 2207
  },
  {
    "source": 7112,
    "target": 3603
  },
  {
    "source": 7112,
    "target": 7602
  },
  {
    "source": 7112,
    "target": 7404
  },
  {
    "source": 7112,
    "target": 7204
  },
  {
    "source": 7113,
    "target": 9101
  },
  {
    "source": 7113,
    "target": 9111
  },
  {
    "source": 7113,
    "target": 7101
  },
  {
    "source": 7113,
    "target": 8001
  },
  {
    "source": 7113,
    "target": 4201
  },
  {
    "source": 7115,
    "target": 7110
  },
  {
    "source": 7115,
    "target": 8102
  },
  {
    "source": 7115,
    "target": 7106
  },
  {
    "source": 7115,
    "target": 2843
  },
  {
    "source": 7115,
    "target": 8112
  },
  {
    "source": 7117,
    "target": 4202
  },
  {
    "source": 7117,
    "target": 8306
  },
  {
    "source": 7117,
    "target": 6214
  },
  {
    "source": 7117,
    "target": 6215
  },
  {
    "source": 7117,
    "target": 9603
  },
  {
    "source": 7201,
    "target": 7208
  },
  {
    "source": 7201,
    "target": 7207
  },
  {
    "source": 7201,
    "target": 2814
  },
  {
    "source": 7201,
    "target": 7202
  },
  {
    "source": 7201,
    "target": 7203
  },
  {
    "source": 7202,
    "target": 7601
  },
  {
    "source": 7202,
    "target": 2716
  },
  {
    "source": 7202,
    "target": 7201
  },
  {
    "source": 7202,
    "target": 2849
  },
  {
    "source": 7202,
    "target": 2519
  },
  {
    "source": 7203,
    "target": 2814
  },
  {
    "source": 7203,
    "target": 7206
  },
  {
    "source": 7203,
    "target": 7207
  },
  {
    "source": 7203,
    "target": 7201
  },
  {
    "source": 7203,
    "target": 2601
  },
  {
    "source": 7204,
    "target": 7602
  },
  {
    "source": 7204,
    "target": 7404
  },
  {
    "source": 7204,
    "target": 7112
  },
  {
    "source": 7204,
    "target": 4403
  },
  {
    "source": 7204,
    "target": 4907
  },
  {
    "source": 7205,
    "target": 7218
  },
  {
    "source": 7205,
    "target": 7606
  },
  {
    "source": 7205,
    "target": 7302
  },
  {
    "source": 7205,
    "target": 2821
  },
  {
    "source": 7205,
    "target": 6813
  },
  {
    "source": 7206,
    "target": 7203
  },
  {
    "source": 7206,
    "target": 7207
  },
  {
    "source": 7206,
    "target": 7601
  },
  {
    "source": 7206,
    "target": 7301
  },
  {
    "source": 7206,
    "target": 2519
  },
  {
    "source": 7207,
    "target": 7201
  },
  {
    "source": 7207,
    "target": 7206
  },
  {
    "source": 7207,
    "target": 7203
  },
  {
    "source": 7207,
    "target": 7601
  },
  {
    "source": 7207,
    "target": 2601
  },
  {
    "source": 7208,
    "target": 7209
  },
  {
    "source": 7208,
    "target": 7210
  },
  {
    "source": 7208,
    "target": 7005
  },
  {
    "source": 7208,
    "target": 7201
  },
  {
    "source": 7208,
    "target": 6902
  },
  {
    "source": 7209,
    "target": 7208
  },
  {
    "source": 7209,
    "target": 7210
  },
  {
    "source": 7209,
    "target": 7213
  },
  {
    "source": 7209,
    "target": 3505
  },
  {
    "source": 7209,
    "target": 7305
  },
  {
    "source": 7210,
    "target": 7209
  },
  {
    "source": 7210,
    "target": 7212
  },
  {
    "source": 7210,
    "target": 7208
  },
  {
    "source": 7210,
    "target": 3918
  },
  {
    "source": 7210,
    "target": 3505
  },
  {
    "source": 7211,
    "target": 7225
  },
  {
    "source": 7211,
    "target": 7212
  },
  {
    "source": 7211,
    "target": 7226
  },
  {
    "source": 7211,
    "target": 6805
  },
  {
    "source": 7211,
    "target": 7228
  },
  {
    "source": 7212,
    "target": 7211
  },
  {
    "source": 7212,
    "target": 5602
  },
  {
    "source": 7212,
    "target": 7210
  },
  {
    "source": 7212,
    "target": 3208
  },
  {
    "source": 7212,
    "target": 7229
  },
  {
    "source": 7213,
    "target": 7217
  },
  {
    "source": 7213,
    "target": 7215
  },
  {
    "source": 7213,
    "target": 7216
  },
  {
    "source": 7213,
    "target": 7214
  },
  {
    "source": 7213,
    "target": 7209
  },
  {
    "source": 7214,
    "target": 7217
  },
  {
    "source": 7214,
    "target": 7215
  },
  {
    "source": 7214,
    "target": 7216
  },
  {
    "source": 7214,
    "target": 7213
  },
  {
    "source": 7214,
    "target": 2523
  },
  {
    "source": 7215,
    "target": 7217
  },
  {
    "source": 7215,
    "target": 7228
  },
  {
    "source": 7215,
    "target": 7216
  },
  {
    "source": 7215,
    "target": 7214
  },
  {
    "source": 7215,
    "target": 7213
  },
  {
    "source": 7216,
    "target": 7217
  },
  {
    "source": 7216,
    "target": 7215
  },
  {
    "source": 7216,
    "target": 7306
  },
  {
    "source": 7216,
    "target": 7214
  },
  {
    "source": 7216,
    "target": 7213
  },
  {
    "source": 7217,
    "target": 7215
  },
  {
    "source": 7217,
    "target": 7216
  },
  {
    "source": 7217,
    "target": 7306
  },
  {
    "source": 7217,
    "target": 7213
  },
  {
    "source": 7217,
    "target": 7214
  },
  {
    "source": 7218,
    "target": 7219
  },
  {
    "source": 7218,
    "target": 7505
  },
  {
    "source": 7218,
    "target": 7222
  },
  {
    "source": 7218,
    "target": 7205
  },
  {
    "source": 7218,
    "target": 3914
  },
  {
    "source": 7219,
    "target": 7220
  },
  {
    "source": 7219,
    "target": 7218
  },
  {
    "source": 7219,
    "target": 3207
  },
  {
    "source": 7219,
    "target": 7229
  },
  {
    "source": 7219,
    "target": 7225
  },
  {
    "source": 7220,
    "target": 7219
  },
  {
    "source": 7220,
    "target": 3909
  },
  {
    "source": 7220,
    "target": 2907
  },
  {
    "source": 7220,
    "target": 2914
  },
  {
    "source": 7220,
    "target": 8420
  },
  {
    "source": 7221,
    "target": 7223
  },
  {
    "source": 7221,
    "target": 8448
  },
  {
    "source": 7221,
    "target": 7227
  },
  {
    "source": 7221,
    "target": 8446
  },
  {
    "source": 7221,
    "target": 8445
  },
  {
    "source": 7222,
    "target": 7226
  },
  {
    "source": 7222,
    "target": 7315
  },
  {
    "source": 7222,
    "target": 7218
  },
  {
    "source": 7222,
    "target": 7505
  },
  {
    "source": 7222,
    "target": 7223
  },
  {
    "source": 7223,
    "target": 7222
  },
  {
    "source": 7223,
    "target": 4809
  },
  {
    "source": 7223,
    "target": 2912
  },
  {
    "source": 7223,
    "target": 8204
  },
  {
    "source": 7223,
    "target": 7221
  },
  {
    "source": 7224,
    "target": 7228
  },
  {
    "source": 7224,
    "target": 8707
  },
  {
    "source": 7224,
    "target": 8605
  },
  {
    "source": 7224,
    "target": 8701
  },
  {
    "source": 7224,
    "target": 8406
  },
  {
    "source": 7225,
    "target": 7226
  },
  {
    "source": 7225,
    "target": 7211
  },
  {
    "source": 7225,
    "target": 8209
  },
  {
    "source": 7225,
    "target": 7229
  },
  {
    "source": 7225,
    "target": 7219
  },
  {
    "source": 7226,
    "target": 7225
  },
  {
    "source": 7226,
    "target": 7211
  },
  {
    "source": 7226,
    "target": 7222
  },
  {
    "source": 7226,
    "target": 8475
  },
  {
    "source": 7226,
    "target": 8603
  },
  {
    "source": 7227,
    "target": 7228
  },
  {
    "source": 7227,
    "target": 7221
  },
  {
    "source": 7227,
    "target": 2849
  },
  {
    "source": 7227,
    "target": 8410
  },
  {
    "source": 7227,
    "target": 2827
  },
  {
    "source": 7228,
    "target": 7224
  },
  {
    "source": 7228,
    "target": 7211
  },
  {
    "source": 7228,
    "target": 7215
  },
  {
    "source": 7228,
    "target": 8455
  },
  {
    "source": 7228,
    "target": 7227
  },
  {
    "source": 7229,
    "target": 5603
  },
  {
    "source": 7229,
    "target": 7219
  },
  {
    "source": 7229,
    "target": 5902
  },
  {
    "source": 7229,
    "target": 7225
  },
  {
    "source": 7229,
    "target": 7212
  },
  {
    "source": 7301,
    "target": 2620
  },
  {
    "source": 7301,
    "target": 2708
  },
  {
    "source": 7301,
    "target": 7303
  },
  {
    "source": 7301,
    "target": 7206
  },
  {
    "source": 7301,
    "target": 2503
  },
  {
    "source": 7302,
    "target": 4814
  },
  {
    "source": 7302,
    "target": 8605
  },
  {
    "source": 7302,
    "target": 8601
  },
  {
    "source": 7302,
    "target": 7205
  },
  {
    "source": 7302,
    "target": 8602
  },
  {
    "source": 7303,
    "target": 6801
  },
  {
    "source": 7303,
    "target": 7301
  },
  {
    "source": 7303,
    "target": 8437
  },
  {
    "source": 7303,
    "target": 7018
  },
  {
    "source": 7303,
    "target": 5007
  },
  {
    "source": 7304,
    "target": 8545
  },
  {
    "source": 7304,
    "target": 7305
  },
  {
    "source": 7304,
    "target": 6813
  },
  {
    "source": 7304,
    "target": 9028
  },
  {
    "source": 7304,
    "target": 8307
  },
  {
    "source": 7305,
    "target": 7304
  },
  {
    "source": 7305,
    "target": 7209
  },
  {
    "source": 7305,
    "target": 7605
  },
  {
    "source": 7305,
    "target": 4814
  },
  {
    "source": 7305,
    "target": 2849
  },
  {
    "source": 7306,
    "target": 7217
  },
  {
    "source": 7306,
    "target": 3920
  },
  {
    "source": 7306,
    "target": 7317
  },
  {
    "source": 7306,
    "target": 7216
  },
  {
    "source": 7306,
    "target": 4808
  },
  {
    "source": 7307,
    "target": 8466
  },
  {
    "source": 7307,
    "target": 8421
  },
  {
    "source": 7307,
    "target": 8484
  },
  {
    "source": 7307,
    "target": 7325
  },
  {
    "source": 7307,
    "target": 7412
  },
  {
    "source": 7308,
    "target": 7610
  },
  {
    "source": 7308,
    "target": 7325
  },
  {
    "source": 7308,
    "target": 3922
  },
  {
    "source": 7308,
    "target": 4415
  },
  {
    "source": 7308,
    "target": 6810
  },
  {
    "source": 7309,
    "target": 8402
  },
  {
    "source": 7309,
    "target": 8431
  },
  {
    "source": 7309,
    "target": 9028
  },
  {
    "source": 7309,
    "target": 8544
  },
  {
    "source": 7309,
    "target": 8474
  },
  {
    "source": 7310,
    "target": 3921
  },
  {
    "source": 7310,
    "target": 4819
  },
  {
    "source": 7310,
    "target": 3209
  },
  {
    "source": 7310,
    "target": 4821
  },
  {
    "source": 7310,
    "target": 8309
  },
  {
    "source": 7311,
    "target": 9303
  },
  {
    "source": 7311,
    "target": 8907
  },
  {
    "source": 7311,
    "target": 8903
  },
  {
    "source": 7311,
    "target": 8609
  },
  {
    "source": 7311,
    "target": 6309
  },
  {
    "source": 7312,
    "target": 4011
  },
  {
    "source": 7312,
    "target": 8311
  },
  {
    "source": 7312,
    "target": 5902
  },
  {
    "source": 7312,
    "target": 8404
  },
  {
    "source": 7312,
    "target": 5503
  },
  {
    "source": 7314,
    "target": 3922
  },
  {
    "source": 7314,
    "target": 4820
  },
  {
    "source": 7314,
    "target": 9404
  },
  {
    "source": 7314,
    "target": 4817
  },
  {
    "source": 7314,
    "target": 8303
  },
  {
    "source": 7315,
    "target": 7325
  },
  {
    "source": 7315,
    "target": 8484
  },
  {
    "source": 7315,
    "target": 7222
  },
  {
    "source": 7315,
    "target": 8441
  },
  {
    "source": 7315,
    "target": 8455
  },
  {
    "source": 7317,
    "target": 7306
  },
  {
    "source": 7317,
    "target": 2104
  },
  {
    "source": 7317,
    "target": 5607
  },
  {
    "source": 7317,
    "target": 3814
  },
  {
    "source": 7317,
    "target": 4013
  },
  {
    "source": 7318,
    "target": 8483
  },
  {
    "source": 7318,
    "target": 4016
  },
  {
    "source": 7318,
    "target": 8481
  },
  {
    "source": 7318,
    "target": 8466
  },
  {
    "source": 7318,
    "target": 8516
  },
  {
    "source": 7320,
    "target": 8708
  },
  {
    "source": 7320,
    "target": 8483
  },
  {
    "source": 7320,
    "target": 8481
  },
  {
    "source": 7320,
    "target": 4009
  },
  {
    "source": 7320,
    "target": 8482
  },
  {
    "source": 7321,
    "target": 8516
  },
  {
    "source": 7321,
    "target": 8418
  },
  {
    "source": 7321,
    "target": 3916
  },
  {
    "source": 7321,
    "target": 6910
  },
  {
    "source": 7321,
    "target": 9401
  },
  {
    "source": 7322,
    "target": 8433
  },
  {
    "source": 7322,
    "target": 7610
  },
  {
    "source": 7322,
    "target": 8403
  },
  {
    "source": 7322,
    "target": 8607
  },
  {
    "source": 7322,
    "target": 8432
  },
  {
    "source": 7323,
    "target": 7615
  },
  {
    "source": 7323,
    "target": 8215
  },
  {
    "source": 7323,
    "target": 3924
  },
  {
    "source": 7323,
    "target": 7013
  },
  {
    "source": 7323,
    "target": 8507
  },
  {
    "source": 7324,
    "target": 8516
  },
  {
    "source": 7324,
    "target": 9403
  },
  {
    "source": 7324,
    "target": 7412
  },
  {
    "source": 7324,
    "target": 3922
  },
  {
    "source": 7324,
    "target": 7019
  },
  {
    "source": 7325,
    "target": 7308
  },
  {
    "source": 7325,
    "target": 8403
  },
  {
    "source": 7325,
    "target": 8417
  },
  {
    "source": 7325,
    "target": 7307
  },
  {
    "source": 7325,
    "target": 7315
  },
  {
    "source": 7326,
    "target": 8302
  },
  {
    "source": 7326,
    "target": 7616
  },
  {
    "source": 7326,
    "target": 9405
  },
  {
    "source": 7326,
    "target": 8419
  },
  {
    "source": 7326,
    "target": 4016
  },
  {
    "source": 7402,
    "target": 7403
  },
  {
    "source": 7402,
    "target": 2603
  },
  {
    "source": 7402,
    "target": 2616
  },
  {
    "source": 7402,
    "target": 2822
  },
  {
    "source": 7402,
    "target": 2529
  },
  {
    "source": 7403,
    "target": 7402
  },
  {
    "source": 7403,
    "target": 7901
  },
  {
    "source": 7403,
    "target": 2807
  },
  {
    "source": 7403,
    "target": 7408
  },
  {
    "source": 7403,
    "target": 7409
  },
  {
    "source": 7404,
    "target": 7602
  },
  {
    "source": 7404,
    "target": 7204
  },
  {
    "source": 7404,
    "target": 2402
  },
  {
    "source": 7404,
    "target": 2204
  },
  {
    "source": 7404,
    "target": 7112
  },
  {
    "source": 7407,
    "target": 7408
  },
  {
    "source": 7407,
    "target": 7411
  },
  {
    "source": 7407,
    "target": 7409
  },
  {
    "source": 7407,
    "target": 7413
  },
  {
    "source": 7407,
    "target": 7612
  },
  {
    "source": 7408,
    "target": 7407
  },
  {
    "source": 7408,
    "target": 7409
  },
  {
    "source": 7408,
    "target": 7413
  },
  {
    "source": 7408,
    "target": 7411
  },
  {
    "source": 7408,
    "target": 7403
  },
  {
    "source": 7409,
    "target": 7407
  },
  {
    "source": 7409,
    "target": 7408
  },
  {
    "source": 7409,
    "target": 7411
  },
  {
    "source": 7409,
    "target": 7413
  },
  {
    "source": 7409,
    "target": 7403
  },
  {
    "source": 7410,
    "target": 9108
  },
  {
    "source": 7410,
    "target": 9114
  },
  {
    "source": 7410,
    "target": 9207
  },
  {
    "source": 7410,
    "target": 9003
  },
  {
    "source": 7410,
    "target": 9010
  },
  {
    "source": 7411,
    "target": 7407
  },
  {
    "source": 7411,
    "target": 7419
  },
  {
    "source": 7411,
    "target": 7409
  },
  {
    "source": 7411,
    "target": 7408
  },
  {
    "source": 7411,
    "target": 4810
  },
  {
    "source": 7412,
    "target": 7324
  },
  {
    "source": 7412,
    "target": 7009
  },
  {
    "source": 7412,
    "target": 8463
  },
  {
    "source": 7412,
    "target": 7307
  },
  {
    "source": 7412,
    "target": 8451
  },
  {
    "source": 7413,
    "target": 7408
  },
  {
    "source": 7413,
    "target": 7407
  },
  {
    "source": 7413,
    "target": 4803
  },
  {
    "source": 7413,
    "target": 7409
  },
  {
    "source": 7413,
    "target": 2620
  },
  {
    "source": 7419,
    "target": 6815
  },
  {
    "source": 7419,
    "target": 8308
  },
  {
    "source": 7419,
    "target": 7411
  },
  {
    "source": 7419,
    "target": 8538
  },
  {
    "source": 7419,
    "target": 3918
  },
  {
    "source": 7501,
    "target": 2604
  },
  {
    "source": 7501,
    "target": 7502
  },
  {
    "source": 7501,
    "target": 8105
  },
  {
    "source": 7501,
    "target": 2605
  },
  {
    "source": 7501,
    "target": 2822
  },
  {
    "source": 7502,
    "target": 8105
  },
  {
    "source": 7502,
    "target": 7506
  },
  {
    "source": 7502,
    "target": 7501
  },
  {
    "source": 7502,
    "target": 2822
  },
  {
    "source": 7502,
    "target": 2825
  },
  {
    "source": 7505,
    "target": 7507
  },
  {
    "source": 7505,
    "target": 7506
  },
  {
    "source": 7505,
    "target": 7218
  },
  {
    "source": 7505,
    "target": 7222
  },
  {
    "source": 7505,
    "target": 3703
  },
  {
    "source": 7506,
    "target": 7505
  },
  {
    "source": 7506,
    "target": 7502
  },
  {
    "source": 7506,
    "target": 7110
  },
  {
    "source": 7506,
    "target": 8401
  },
  {
    "source": 7506,
    "target": 8105
  },
  {
    "source": 7507,
    "target": 7505
  },
  {
    "source": 7507,
    "target": 3914
  },
  {
    "source": 7507,
    "target": 8108
  },
  {
    "source": 7507,
    "target": 8401
  },
  {
    "source": 7507,
    "target": 7508
  },
  {
    "source": 7508,
    "target": 7507
  },
  {
    "source": 7508,
    "target": 8108
  },
  {
    "source": 7508,
    "target": 2939
  },
  {
    "source": 7508,
    "target": 7002
  },
  {
    "source": 7508,
    "target": 4801
  },
  {
    "source": 7601,
    "target": 7605
  },
  {
    "source": 7601,
    "target": 7202
  },
  {
    "source": 7601,
    "target": 7207
  },
  {
    "source": 7601,
    "target": 7206
  },
  {
    "source": 7601,
    "target": 7901
  },
  {
    "source": 7602,
    "target": 7404
  },
  {
    "source": 7602,
    "target": 7204
  },
  {
    "source": 7602,
    "target": 4707
  },
  {
    "source": 7602,
    "target": 7112
  },
  {
    "source": 7602,
    "target": 2201
  },
  {
    "source": 7604,
    "target": 7013
  },
  {
    "source": 7604,
    "target": 5703
  },
  {
    "source": 7604,
    "target": 6807
  },
  {
    "source": 7604,
    "target": 4803
  },
  {
    "source": 7604,
    "target": 4817
  },
  {
    "source": 7605,
    "target": 7601
  },
  {
    "source": 7605,
    "target": 6807
  },
  {
    "source": 7605,
    "target": 8545
  },
  {
    "source": 7605,
    "target": 7305
  },
  {
    "source": 7605,
    "target": 2704
  },
  {
    "source": 7606,
    "target": 7607
  },
  {
    "source": 7606,
    "target": 8104
  },
  {
    "source": 7606,
    "target": 7205
  },
  {
    "source": 7606,
    "target": 2912
  },
  {
    "source": 7606,
    "target": 4810
  },
  {
    "source": 7607,
    "target": 6804
  },
  {
    "source": 7607,
    "target": 8422
  },
  {
    "source": 7607,
    "target": 8441
  },
  {
    "source": 7607,
    "target": 7606
  },
  {
    "source": 7607,
    "target": 4810
  },
  {
    "source": 7608,
    "target": 7616
  },
  {
    "source": 7608,
    "target": 4010
  },
  {
    "source": 7608,
    "target": 3307
  },
  {
    "source": 7608,
    "target": 9401
  },
  {
    "source": 7608,
    "target": 8303
  },
  {
    "source": 7610,
    "target": 3925
  },
  {
    "source": 7610,
    "target": 7308
  },
  {
    "source": 7610,
    "target": 9403
  },
  {
    "source": 7610,
    "target": 7322
  },
  {
    "source": 7610,
    "target": 6810
  },
  {
    "source": 7612,
    "target": 8309
  },
  {
    "source": 7612,
    "target": 6910
  },
  {
    "source": 7612,
    "target": 5911
  },
  {
    "source": 7612,
    "target": 7407
  },
  {
    "source": 7612,
    "target": 4817
  },
  {
    "source": 7614,
    "target": 4803
  },
  {
    "source": 7614,
    "target": 6801
  },
  {
    "source": 7614,
    "target": 6907
  },
  {
    "source": 7614,
    "target": 2102
  },
  {
    "source": 7614,
    "target": 5501
  },
  {
    "source": 7615,
    "target": 7323
  },
  {
    "source": 7615,
    "target": 8215
  },
  {
    "source": 7615,
    "target": 3924
  },
  {
    "source": 7615,
    "target": 3306
  },
  {
    "source": 7615,
    "target": 5514
  },
  {
    "source": 7616,
    "target": 7326
  },
  {
    "source": 7616,
    "target": 9405
  },
  {
    "source": 7616,
    "target": 8302
  },
  {
    "source": 7616,
    "target": 7608
  },
  {
    "source": 7616,
    "target": 8547
  },
  {
    "source": 7801,
    "target": 1211
  },
  {
    "source": 7801,
    "target": 802
  },
  {
    "source": 7801,
    "target": 2401
  },
  {
    "source": 7801,
    "target": 902
  },
  {
    "source": 7801,
    "target": 1212
  },
  {
    "source": 7901,
    "target": 7403
  },
  {
    "source": 7901,
    "target": 2807
  },
  {
    "source": 7901,
    "target": 2607
  },
  {
    "source": 7901,
    "target": 2529
  },
  {
    "source": 7901,
    "target": 7601
  },
  {
    "source": 7907,
    "target": 3924
  },
  {
    "source": 7907,
    "target": 8307
  },
  {
    "source": 7907,
    "target": 9608
  },
  {
    "source": 7907,
    "target": 4005
  },
  {
    "source": 7907,
    "target": 8201
  },
  {
    "source": 8001,
    "target": 8506
  },
  {
    "source": 8001,
    "target": 7113
  },
  {
    "source": 8001,
    "target": 7101
  },
  {
    "source": 8001,
    "target": 4201
  },
  {
    "source": 8101,
    "target": 8209
  },
  {
    "source": 8101,
    "target": 8102
  },
  {
    "source": 8101,
    "target": 9012
  },
  {
    "source": 8101,
    "target": 9023
  },
  {
    "source": 8101,
    "target": 3918
  },
  {
    "source": 8102,
    "target": 2841
  },
  {
    "source": 8102,
    "target": 8108
  },
  {
    "source": 8102,
    "target": 8101
  },
  {
    "source": 8102,
    "target": 8112
  },
  {
    "source": 8102,
    "target": 7115
  },
  {
    "source": 8104,
    "target": 7606
  },
  {
    "source": 8104,
    "target": 8425
  },
  {
    "source": 8104,
    "target": 2849
  },
  {
    "source": 8104,
    "target": 2716
  },
  {
    "source": 8104,
    "target": 2835
  },
  {
    "source": 8105,
    "target": 7502
  },
  {
    "source": 8105,
    "target": 2605
  },
  {
    "source": 8105,
    "target": 2822
  },
  {
    "source": 8105,
    "target": 7501
  },
  {
    "source": 8105,
    "target": 7506
  },
  {
    "source": 8108,
    "target": 7507
  },
  {
    "source": 8108,
    "target": 8102
  },
  {
    "source": 8108,
    "target": 8112
  },
  {
    "source": 8108,
    "target": 3914
  },
  {
    "source": 8108,
    "target": 7508
  },
  {
    "source": 8111,
    "target": 2836
  },
  {
    "source": 8111,
    "target": 2804
  },
  {
    "source": 8111,
    "target": 2809
  },
  {
    "source": 8111,
    "target": 2701
  },
  {
    "source": 8111,
    "target": 8609
  },
  {
    "source": 8112,
    "target": 8102
  },
  {
    "source": 8112,
    "target": 2841
  },
  {
    "source": 8112,
    "target": 8108
  },
  {
    "source": 8112,
    "target": 2825
  },
  {
    "source": 8112,
    "target": 7115
  },
  {
    "source": 8201,
    "target": 8203
  },
  {
    "source": 8201,
    "target": 7907
  },
  {
    "source": 8201,
    "target": 8713
  },
  {
    "source": 8201,
    "target": 8709
  },
  {
    "source": 8201,
    "target": 3406
  },
  {
    "source": 8202,
    "target": 6805
  },
  {
    "source": 8202,
    "target": 8424
  },
  {
    "source": 8202,
    "target": 8467
  },
  {
    "source": 8202,
    "target": 8603
  },
  {
    "source": 8202,
    "target": 8412
  },
  {
    "source": 8203,
    "target": 8201
  },
  {
    "source": 8203,
    "target": 8211
  },
  {
    "source": 8203,
    "target": 9017
  },
  {
    "source": 8203,
    "target": 8706
  },
  {
    "source": 8203,
    "target": 8205
  },
  {
    "source": 8204,
    "target": 8205
  },
  {
    "source": 8204,
    "target": 7223
  },
  {
    "source": 8204,
    "target": 8715
  },
  {
    "source": 8204,
    "target": 2827
  },
  {
    "source": 8204,
    "target": 5504
  },
  {
    "source": 8205,
    "target": 8204
  },
  {
    "source": 8205,
    "target": 8203
  },
  {
    "source": 8205,
    "target": 8211
  },
  {
    "source": 8205,
    "target": 9105
  },
  {
    "source": 8205,
    "target": 8711
  },
  {
    "source": 8207,
    "target": 8412
  },
  {
    "source": 8207,
    "target": 8514
  },
  {
    "source": 8207,
    "target": 8515
  },
  {
    "source": 8207,
    "target": 8465
  },
  {
    "source": 8207,
    "target": 8485
  },
  {
    "source": 8208,
    "target": 8466
  },
  {
    "source": 8208,
    "target": 8480
  },
  {
    "source": 8208,
    "target": 8515
  },
  {
    "source": 8208,
    "target": 8485
  },
  {
    "source": 8208,
    "target": 8417
  },
  {
    "source": 8209,
    "target": 3707
  },
  {
    "source": 8209,
    "target": 7225
  },
  {
    "source": 8209,
    "target": 9022
  },
  {
    "source": 8209,
    "target": 8101
  },
  {
    "source": 8209,
    "target": 8464
  },
  {
    "source": 8211,
    "target": 8215
  },
  {
    "source": 8211,
    "target": 8203
  },
  {
    "source": 8211,
    "target": 9105
  },
  {
    "source": 8211,
    "target": 9017
  },
  {
    "source": 8211,
    "target": 8205
  },
  {
    "source": 8212,
    "target": 7018
  },
  {
    "source": 8212,
    "target": 2403
  },
  {
    "source": 8212,
    "target": 4909
  },
  {
    "source": 8212,
    "target": 4201
  },
  {
    "source": 8212,
    "target": 8478
  },
  {
    "source": 8215,
    "target": 8211
  },
  {
    "source": 8215,
    "target": 7323
  },
  {
    "source": 8215,
    "target": 4414
  },
  {
    "source": 8215,
    "target": 6912
  },
  {
    "source": 8215,
    "target": 7615
  },
  {
    "source": 8301,
    "target": 8302
  },
  {
    "source": 8301,
    "target": 8503
  },
  {
    "source": 8301,
    "target": 9405
  },
  {
    "source": 8301,
    "target": 7007
  },
  {
    "source": 8301,
    "target": 3926
  },
  {
    "source": 8302,
    "target": 7326
  },
  {
    "source": 8302,
    "target": 7616
  },
  {
    "source": 8302,
    "target": 9405
  },
  {
    "source": 8302,
    "target": 8301
  },
  {
    "source": 8302,
    "target": 8708
  },
  {
    "source": 8303,
    "target": 7608
  },
  {
    "source": 8303,
    "target": 8418
  },
  {
    "source": 8303,
    "target": 8415
  },
  {
    "source": 8303,
    "target": 8311
  },
  {
    "source": 8303,
    "target": 7314
  },
  {
    "source": 8305,
    "target": 8510
  },
  {
    "source": 8305,
    "target": 4908
  },
  {
    "source": 8305,
    "target": 4014
  },
  {
    "source": 8305,
    "target": 8533
  },
  {
    "source": 8305,
    "target": 9003
  },
  {
    "source": 8306,
    "target": 6913
  },
  {
    "source": 8306,
    "target": 6912
  },
  {
    "source": 8306,
    "target": 7117
  },
  {
    "source": 8306,
    "target": 9505
  },
  {
    "source": 8306,
    "target": 4420
  },
  {
    "source": 8307,
    "target": 7907
  },
  {
    "source": 8307,
    "target": 9028
  },
  {
    "source": 8307,
    "target": 8410
  },
  {
    "source": 8307,
    "target": 7304
  },
  {
    "source": 8307,
    "target": 4005
  },
  {
    "source": 8308,
    "target": 5903
  },
  {
    "source": 8308,
    "target": 3926
  },
  {
    "source": 8308,
    "target": 5806
  },
  {
    "source": 8308,
    "target": 9607
  },
  {
    "source": 8308,
    "target": 7419
  },
  {
    "source": 8309,
    "target": 7612
  },
  {
    "source": 8309,
    "target": 7310
  },
  {
    "source": 8309,
    "target": 4821
  },
  {
    "source": 8309,
    "target": 7010
  },
  {
    "source": 8309,
    "target": 3814
  },
  {
    "source": 8311,
    "target": 7312
  },
  {
    "source": 8311,
    "target": 8404
  },
  {
    "source": 8311,
    "target": 7005
  },
  {
    "source": 8311,
    "target": 8303
  },
  {
    "source": 8311,
    "target": 5503
  },
  {
    "source": 8401,
    "target": 7507
  },
  {
    "source": 8401,
    "target": 2803
  },
  {
    "source": 8401,
    "target": 7506
  },
  {
    "source": 8401,
    "target": 2912
  },
  {
    "source": 8401,
    "target": 2844
  },
  {
    "source": 8402,
    "target": 8503
  },
  {
    "source": 8402,
    "target": 8546
  },
  {
    "source": 8402,
    "target": 4010
  },
  {
    "source": 8402,
    "target": 4011
  },
  {
    "source": 8402,
    "target": 7309
  },
  {
    "source": 8403,
    "target": 7322
  },
  {
    "source": 8403,
    "target": 6806
  },
  {
    "source": 8403,
    "target": 1514
  },
  {
    "source": 8403,
    "target": 7008
  },
  {
    "source": 8403,
    "target": 7325
  },
  {
    "source": 8404,
    "target": 5911
  },
  {
    "source": 8404,
    "target": 8406
  },
  {
    "source": 8404,
    "target": 7312
  },
  {
    "source": 8404,
    "target": 8311
  },
  {
    "source": 8404,
    "target": 6506
  },
  {
    "source": 8405,
    "target": 8440
  },
  {
    "source": 8405,
    "target": 9020
  },
  {
    "source": 8405,
    "target": 8502
  },
  {
    "source": 8405,
    "target": 2811
  },
  {
    "source": 8405,
    "target": 3811
  },
  {
    "source": 8406,
    "target": 7224
  },
  {
    "source": 8406,
    "target": 8404
  },
  {
    "source": 8406,
    "target": 9017
  },
  {
    "source": 8406,
    "target": 3801
  },
  {
    "source": 8406,
    "target": 8410
  },
  {
    "source": 8407,
    "target": 8408
  },
  {
    "source": 8407,
    "target": 8484
  },
  {
    "source": 8407,
    "target": 8415
  },
  {
    "source": 8407,
    "target": 8703
  },
  {
    "source": 8407,
    "target": 6813
  },
  {
    "source": 8408,
    "target": 8407
  },
  {
    "source": 8408,
    "target": 8701
  },
  {
    "source": 8408,
    "target": 8706
  },
  {
    "source": 8408,
    "target": 8704
  },
  {
    "source": 8408,
    "target": 8703
  },
  {
    "source": 8409,
    "target": 8708
  },
  {
    "source": 8409,
    "target": 8483
  },
  {
    "source": 8409,
    "target": 4009
  },
  {
    "source": 8409,
    "target": 8421
  },
  {
    "source": 8409,
    "target": 4016
  },
  {
    "source": 8410,
    "target": 8406
  },
  {
    "source": 8410,
    "target": 8307
  },
  {
    "source": 8410,
    "target": 7227
  },
  {
    "source": 8410,
    "target": 2849
  },
  {
    "source": 8410,
    "target": 3603
  },
  {
    "source": 8411,
    "target": 8803
  },
  {
    "source": 8411,
    "target": 9014
  },
  {
    "source": 8411,
    "target": 9024
  },
  {
    "source": 8411,
    "target": 8805
  },
  {
    "source": 8411,
    "target": 3302
  },
  {
    "source": 8412,
    "target": 8207
  },
  {
    "source": 8412,
    "target": 6806
  },
  {
    "source": 8412,
    "target": 8413
  },
  {
    "source": 8412,
    "target": 9026
  },
  {
    "source": 8412,
    "target": 8202
  },
  {
    "source": 8413,
    "target": 8421
  },
  {
    "source": 8413,
    "target": 8414
  },
  {
    "source": 8413,
    "target": 8501
  },
  {
    "source": 8413,
    "target": 8484
  },
  {
    "source": 8413,
    "target": 8412
  },
  {
    "source": 8414,
    "target": 8413
  },
  {
    "source": 8414,
    "target": 8428
  },
  {
    "source": 8414,
    "target": 8482
  },
  {
    "source": 8414,
    "target": 8501
  },
  {
    "source": 8414,
    "target": 8546
  },
  {
    "source": 8415,
    "target": 8450
  },
  {
    "source": 8415,
    "target": 8407
  },
  {
    "source": 8415,
    "target": 8508
  },
  {
    "source": 8415,
    "target": 8303
  },
  {
    "source": 8415,
    "target": 8539
  },
  {
    "source": 8416,
    "target": 4008
  },
  {
    "source": 8416,
    "target": 8530
  },
  {
    "source": 8416,
    "target": 8428
  },
  {
    "source": 8416,
    "target": 8417
  },
  {
    "source": 8416,
    "target": 4811
  },
  {
    "source": 8417,
    "target": 8455
  },
  {
    "source": 8417,
    "target": 8416
  },
  {
    "source": 8417,
    "target": 8208
  },
  {
    "source": 8417,
    "target": 7325
  },
  {
    "source": 8417,
    "target": 4008
  },
  {
    "source": 8418,
    "target": 7013
  },
  {
    "source": 8418,
    "target": 8450
  },
  {
    "source": 8418,
    "target": 7321
  },
  {
    "source": 8418,
    "target": 8303
  },
  {
    "source": 8418,
    "target": 3307
  },
  {
    "source": 8419,
    "target": 7326
  },
  {
    "source": 8419,
    "target": 9032
  },
  {
    "source": 8419,
    "target": 8481
  },
  {
    "source": 8419,
    "target": 8421
  },
  {
    "source": 8419,
    "target": 8428
  },
  {
    "source": 8420,
    "target": 8463
  },
  {
    "source": 8420,
    "target": 8454
  },
  {
    "source": 8420,
    "target": 7220
  },
  {
    "source": 8420,
    "target": 8457
  },
  {
    "source": 8420,
    "target": 8462
  },
  {
    "source": 8421,
    "target": 8409
  },
  {
    "source": 8421,
    "target": 8428
  },
  {
    "source": 8421,
    "target": 8419
  },
  {
    "source": 8421,
    "target": 8413
  },
  {
    "source": 8421,
    "target": 7307
  },
  {
    "source": 8422,
    "target": 8465
  },
  {
    "source": 8422,
    "target": 8438
  },
  {
    "source": 8422,
    "target": 8441
  },
  {
    "source": 8422,
    "target": 8515
  },
  {
    "source": 8422,
    "target": 7607
  },
  {
    "source": 8423,
    "target": 9025
  },
  {
    "source": 8423,
    "target": 8442
  },
  {
    "source": 8423,
    "target": 8476
  },
  {
    "source": 8423,
    "target": 9023
  },
  {
    "source": 8423,
    "target": 8540
  },
  {
    "source": 8424,
    "target": 8202
  },
  {
    "source": 8424,
    "target": 8467
  },
  {
    "source": 8424,
    "target": 3919
  },
  {
    "source": 8424,
    "target": 8485
  },
  {
    "source": 8424,
    "target": 8439
  },
  {
    "source": 8425,
    "target": 8439
  },
  {
    "source": 8425,
    "target": 8431
  },
  {
    "source": 8425,
    "target": 8476
  },
  {
    "source": 8425,
    "target": 4806
  },
  {
    "source": 8425,
    "target": 8104
  },
  {
    "source": 8426,
    "target": 8430
  },
  {
    "source": 8426,
    "target": 8705
  },
  {
    "source": 8426,
    "target": 8429
  },
  {
    "source": 8426,
    "target": 8502
  },
  {
    "source": 8426,
    "target": 9020
  },
  {
    "source": 8427,
    "target": 8514
  },
  {
    "source": 8427,
    "target": 3910
  },
  {
    "source": 8427,
    "target": 3822
  },
  {
    "source": 8427,
    "target": 9022
  },
  {
    "source": 8427,
    "target": 3815
  },
  {
    "source": 8428,
    "target": 8421
  },
  {
    "source": 8428,
    "target": 8419
  },
  {
    "source": 8428,
    "target": 3909
  },
  {
    "source": 8428,
    "target": 8414
  },
  {
    "source": 8428,
    "target": 8416
  },
  {
    "source": 8429,
    "target": 8502
  },
  {
    "source": 8429,
    "target": 8705
  },
  {
    "source": 8429,
    "target": 8430
  },
  {
    "source": 8429,
    "target": 8426
  },
  {
    "source": 8429,
    "target": 8709
  },
  {
    "source": 8430,
    "target": 8426
  },
  {
    "source": 8430,
    "target": 8429
  },
  {
    "source": 8430,
    "target": 8705
  },
  {
    "source": 8430,
    "target": 3603
  },
  {
    "source": 8430,
    "target": 2826
  },
  {
    "source": 8431,
    "target": 9026
  },
  {
    "source": 8431,
    "target": 7309
  },
  {
    "source": 8431,
    "target": 8425
  },
  {
    "source": 8431,
    "target": 8474
  },
  {
    "source": 8431,
    "target": 8459
  },
  {
    "source": 8432,
    "target": 8433
  },
  {
    "source": 8432,
    "target": 8436
  },
  {
    "source": 8432,
    "target": 7322
  },
  {
    "source": 8432,
    "target": 9403
  },
  {
    "source": 8432,
    "target": 8716
  },
  {
    "source": 8433,
    "target": 8432
  },
  {
    "source": 8433,
    "target": 8436
  },
  {
    "source": 8433,
    "target": 7322
  },
  {
    "source": 8433,
    "target": 8530
  },
  {
    "source": 8433,
    "target": 6806
  },
  {
    "source": 8434,
    "target": 8436
  },
  {
    "source": 8434,
    "target": 3004
  },
  {
    "source": 8434,
    "target": 406
  },
  {
    "source": 8434,
    "target": 4902
  },
  {
    "source": 8434,
    "target": 404
  },
  {
    "source": 8436,
    "target": 8433
  },
  {
    "source": 8436,
    "target": 8432
  },
  {
    "source": 8436,
    "target": 8434
  },
  {
    "source": 8436,
    "target": 8438
  },
  {
    "source": 8436,
    "target": 203
  },
  {
    "source": 8437,
    "target": 3503
  },
  {
    "source": 8437,
    "target": 2309
  },
  {
    "source": 8437,
    "target": 2712
  },
  {
    "source": 8437,
    "target": 8440
  },
  {
    "source": 8437,
    "target": 7303
  },
  {
    "source": 8438,
    "target": 8422
  },
  {
    "source": 8438,
    "target": 8465
  },
  {
    "source": 8438,
    "target": 8436
  },
  {
    "source": 8438,
    "target": 8474
  },
  {
    "source": 8438,
    "target": 4901
  },
  {
    "source": 8439,
    "target": 4806
  },
  {
    "source": 8439,
    "target": 8424
  },
  {
    "source": 8439,
    "target": 8461
  },
  {
    "source": 8439,
    "target": 8441
  },
  {
    "source": 8439,
    "target": 8425
  },
  {
    "source": 8440,
    "target": 3823
  },
  {
    "source": 8440,
    "target": 8446
  },
  {
    "source": 8440,
    "target": 8405
  },
  {
    "source": 8440,
    "target": 3811
  },
  {
    "source": 8440,
    "target": 8437
  },
  {
    "source": 8441,
    "target": 8422
  },
  {
    "source": 8441,
    "target": 8465
  },
  {
    "source": 8441,
    "target": 8439
  },
  {
    "source": 8441,
    "target": 7607
  },
  {
    "source": 8441,
    "target": 7315
  },
  {
    "source": 8442,
    "target": 8477
  },
  {
    "source": 8442,
    "target": 8454
  },
  {
    "source": 8442,
    "target": 8524
  },
  {
    "source": 8442,
    "target": 8423
  },
  {
    "source": 8442,
    "target": 5911
  },
  {
    "source": 8443,
    "target": 8471
  },
  {
    "source": 8443,
    "target": 8517
  },
  {
    "source": 8443,
    "target": 8541
  },
  {
    "source": 8443,
    "target": 9002
  },
  {
    "source": 8443,
    "target": 8534
  },
  {
    "source": 8445,
    "target": 8448
  },
  {
    "source": 8445,
    "target": 8446
  },
  {
    "source": 8445,
    "target": 2929
  },
  {
    "source": 8445,
    "target": 7221
  },
  {
    "source": 8445,
    "target": 5504
  },
  {
    "source": 8446,
    "target": 8448
  },
  {
    "source": 8446,
    "target": 8445
  },
  {
    "source": 8446,
    "target": 8440
  },
  {
    "source": 8446,
    "target": 7221
  },
  {
    "source": 8446,
    "target": 9005
  },
  {
    "source": 8447,
    "target": 8452
  },
  {
    "source": 8447,
    "target": 5007
  },
  {
    "source": 8447,
    "target": 4908
  },
  {
    "source": 8447,
    "target": 5501
  },
  {
    "source": 8447,
    "target": 7018
  },
  {
    "source": 8448,
    "target": 8446
  },
  {
    "source": 8448,
    "target": 8445
  },
  {
    "source": 8448,
    "target": 7221
  },
  {
    "source": 8448,
    "target": 8535
  },
  {
    "source": 8448,
    "target": 8713
  },
  {
    "source": 8450,
    "target": 8418
  },
  {
    "source": 8450,
    "target": 8509
  },
  {
    "source": 8450,
    "target": 4011
  },
  {
    "source": 8450,
    "target": 8415
  },
  {
    "source": 8450,
    "target": 8451
  },
  {
    "source": 8451,
    "target": 7412
  },
  {
    "source": 8451,
    "target": 8468
  },
  {
    "source": 8451,
    "target": 8477
  },
  {
    "source": 8451,
    "target": 8476
  },
  {
    "source": 8451,
    "target": 8450
  },
  {
    "source": 8452,
    "target": 8447
  },
  {
    "source": 8452,
    "target": 9606
  },
  {
    "source": 8452,
    "target": 9507
  },
  {
    "source": 8452,
    "target": 9603
  },
  {
    "source": 8452,
    "target": 6215
  },
  {
    "source": 8454,
    "target": 8420
  },
  {
    "source": 8454,
    "target": 8458
  },
  {
    "source": 8454,
    "target": 8455
  },
  {
    "source": 8454,
    "target": 6804
  },
  {
    "source": 8454,
    "target": 8442
  },
  {
    "source": 8455,
    "target": 8417
  },
  {
    "source": 8455,
    "target": 8546
  },
  {
    "source": 8455,
    "target": 8454
  },
  {
    "source": 8455,
    "target": 7228
  },
  {
    "source": 8455,
    "target": 7315
  },
  {
    "source": 8456,
    "target": 8457
  },
  {
    "source": 8456,
    "target": 2907
  },
  {
    "source": 8456,
    "target": 8458
  },
  {
    "source": 8456,
    "target": 3908
  },
  {
    "source": 8456,
    "target": 9017
  },
  {
    "source": 8457,
    "target": 8463
  },
  {
    "source": 8457,
    "target": 8420
  },
  {
    "source": 8457,
    "target": 8456
  },
  {
    "source": 8457,
    "target": 8458
  },
  {
    "source": 8457,
    "target": 3908
  },
  {
    "source": 8458,
    "target": 8461
  },
  {
    "source": 8458,
    "target": 8457
  },
  {
    "source": 8458,
    "target": 8456
  },
  {
    "source": 8458,
    "target": 8454
  },
  {
    "source": 8458,
    "target": 8459
  },
  {
    "source": 8459,
    "target": 8458
  },
  {
    "source": 8459,
    "target": 8461
  },
  {
    "source": 8459,
    "target": 8464
  },
  {
    "source": 8459,
    "target": 8460
  },
  {
    "source": 8459,
    "target": 8431
  },
  {
    "source": 8460,
    "target": 8463
  },
  {
    "source": 8460,
    "target": 8461
  },
  {
    "source": 8460,
    "target": 8462
  },
  {
    "source": 8460,
    "target": 8459
  },
  {
    "source": 8460,
    "target": 8464
  },
  {
    "source": 8461,
    "target": 8464
  },
  {
    "source": 8461,
    "target": 8458
  },
  {
    "source": 8461,
    "target": 8460
  },
  {
    "source": 8461,
    "target": 8439
  },
  {
    "source": 8461,
    "target": 8459
  },
  {
    "source": 8462,
    "target": 8463
  },
  {
    "source": 8462,
    "target": 8420
  },
  {
    "source": 8462,
    "target": 8465
  },
  {
    "source": 8462,
    "target": 8460
  },
  {
    "source": 8462,
    "target": 8474
  },
  {
    "source": 8463,
    "target": 8420
  },
  {
    "source": 8463,
    "target": 8462
  },
  {
    "source": 8463,
    "target": 8457
  },
  {
    "source": 8463,
    "target": 8460
  },
  {
    "source": 8463,
    "target": 7412
  },
  {
    "source": 8464,
    "target": 8461
  },
  {
    "source": 8464,
    "target": 8477
  },
  {
    "source": 8464,
    "target": 8459
  },
  {
    "source": 8464,
    "target": 8209
  },
  {
    "source": 8464,
    "target": 8460
  },
  {
    "source": 8465,
    "target": 8422
  },
  {
    "source": 8465,
    "target": 8462
  },
  {
    "source": 8465,
    "target": 8207
  },
  {
    "source": 8465,
    "target": 8441
  },
  {
    "source": 8465,
    "target": 8438
  },
  {
    "source": 8466,
    "target": 7318
  },
  {
    "source": 8466,
    "target": 8480
  },
  {
    "source": 8466,
    "target": 7307
  },
  {
    "source": 8466,
    "target": 8208
  },
  {
    "source": 8466,
    "target": 8482
  },
  {
    "source": 8467,
    "target": 8508
  },
  {
    "source": 8467,
    "target": 8424
  },
  {
    "source": 8467,
    "target": 8202
  },
  {
    "source": 8467,
    "target": 8468
  },
  {
    "source": 8467,
    "target": 9017
  },
  {
    "source": 8468,
    "target": 8515
  },
  {
    "source": 8468,
    "target": 8514
  },
  {
    "source": 8468,
    "target": 8467
  },
  {
    "source": 8468,
    "target": 8451
  },
  {
    "source": 8468,
    "target": 8477
  },
  {
    "source": 8470,
    "target": 8527
  },
  {
    "source": 8470,
    "target": 8531
  },
  {
    "source": 8470,
    "target": 8526
  },
  {
    "source": 8470,
    "target": 8472
  },
  {
    "source": 8470,
    "target": 9001
  },
  {
    "source": 8471,
    "target": 8473
  },
  {
    "source": 8471,
    "target": 8517
  },
  {
    "source": 8471,
    "target": 8443
  },
  {
    "source": 8471,
    "target": 8519
  },
  {
    "source": 8471,
    "target": 8523
  },
  {
    "source": 8472,
    "target": 8470
  },
  {
    "source": 8472,
    "target": 7020
  },
  {
    "source": 8472,
    "target": 7006
  },
  {
    "source": 8472,
    "target": 9011
  },
  {
    "source": 8472,
    "target": 8539
  },
  {
    "source": 8473,
    "target": 8471
  },
  {
    "source": 8473,
    "target": 8542
  },
  {
    "source": 8473,
    "target": 8523
  },
  {
    "source": 8473,
    "target": 8517
  },
  {
    "source": 8473,
    "target": 8519
  },
  {
    "source": 8474,
    "target": 8462
  },
  {
    "source": 8474,
    "target": 8438
  },
  {
    "source": 8474,
    "target": 8431
  },
  {
    "source": 8474,
    "target": 7309
  },
  {
    "source": 8474,
    "target": 4901
  },
  {
    "source": 8475,
    "target": 8485
  },
  {
    "source": 8475,
    "target": 3919
  },
  {
    "source": 8475,
    "target": 7226
  },
  {
    "source": 8475,
    "target": 3810
  },
  {
    "source": 8475,
    "target": 3903
  },
  {
    "source": 8476,
    "target": 8714
  },
  {
    "source": 8476,
    "target": 8451
  },
  {
    "source": 8476,
    "target": 8423
  },
  {
    "source": 8476,
    "target": 9209
  },
  {
    "source": 8476,
    "target": 8425
  },
  {
    "source": 8477,
    "target": 8480
  },
  {
    "source": 8477,
    "target": 8442
  },
  {
    "source": 8477,
    "target": 8468
  },
  {
    "source": 8477,
    "target": 8464
  },
  {
    "source": 8477,
    "target": 8451
  },
  {
    "source": 8478,
    "target": 2403
  },
  {
    "source": 8478,
    "target": 4813
  },
  {
    "source": 8478,
    "target": 2402
  },
  {
    "source": 8478,
    "target": 2508
  },
  {
    "source": 8478,
    "target": 8212
  },
  {
    "source": 8479,
    "target": 8515
  },
  {
    "source": 8479,
    "target": 8514
  },
  {
    "source": 8479,
    "target": 9027
  },
  {
    "source": 8479,
    "target": 8485
  },
  {
    "source": 8479,
    "target": 9031
  },
  {
    "source": 8480,
    "target": 8466
  },
  {
    "source": 8480,
    "target": 5903
  },
  {
    "source": 8480,
    "target": 6805
  },
  {
    "source": 8480,
    "target": 8477
  },
  {
    "source": 8480,
    "target": 8208
  },
  {
    "source": 8481,
    "target": 8483
  },
  {
    "source": 8481,
    "target": 7320
  },
  {
    "source": 8481,
    "target": 7318
  },
  {
    "source": 8481,
    "target": 8419
  },
  {
    "source": 8481,
    "target": 9032
  },
  {
    "source": 8482,
    "target": 8466
  },
  {
    "source": 8482,
    "target": 8607
  },
  {
    "source": 8482,
    "target": 8414
  },
  {
    "source": 8482,
    "target": 4010
  },
  {
    "source": 8482,
    "target": 7320
  },
  {
    "source": 8483,
    "target": 8708
  },
  {
    "source": 8483,
    "target": 8481
  },
  {
    "source": 8483,
    "target": 7318
  },
  {
    "source": 8483,
    "target": 7320
  },
  {
    "source": 8483,
    "target": 8409
  },
  {
    "source": 8484,
    "target": 7307
  },
  {
    "source": 8484,
    "target": 8413
  },
  {
    "source": 8484,
    "target": 7315
  },
  {
    "source": 8484,
    "target": 8511
  },
  {
    "source": 8484,
    "target": 8407
  },
  {
    "source": 8485,
    "target": 8479
  },
  {
    "source": 8485,
    "target": 8208
  },
  {
    "source": 8485,
    "target": 8475
  },
  {
    "source": 8485,
    "target": 8424
  },
  {
    "source": 8485,
    "target": 8207
  },
  {
    "source": 8501,
    "target": 8503
  },
  {
    "source": 8501,
    "target": 8504
  },
  {
    "source": 8501,
    "target": 8414
  },
  {
    "source": 8501,
    "target": 8413
  },
  {
    "source": 8501,
    "target": 9029
  },
  {
    "source": 8502,
    "target": 8429
  },
  {
    "source": 8502,
    "target": 9023
  },
  {
    "source": 8502,
    "target": 8702
  },
  {
    "source": 8502,
    "target": 8426
  },
  {
    "source": 8502,
    "target": 8405
  },
  {
    "source": 8503,
    "target": 8501
  },
  {
    "source": 8503,
    "target": 8301
  },
  {
    "source": 8503,
    "target": 9032
  },
  {
    "source": 8503,
    "target": 8547
  },
  {
    "source": 8503,
    "target": 8402
  },
  {
    "source": 8504,
    "target": 8517
  },
  {
    "source": 8504,
    "target": 8501
  },
  {
    "source": 8504,
    "target": 8529
  },
  {
    "source": 8504,
    "target": 8538
  },
  {
    "source": 8504,
    "target": 8533
  },
  {
    "source": 8505,
    "target": 8543
  },
  {
    "source": 8505,
    "target": 8531
  },
  {
    "source": 8505,
    "target": 8536
  },
  {
    "source": 8505,
    "target": 9029
  },
  {
    "source": 8505,
    "target": 9033
  },
  {
    "source": 8506,
    "target": 8513
  },
  {
    "source": 8506,
    "target": 9207
  },
  {
    "source": 8506,
    "target": 9010
  },
  {
    "source": 8506,
    "target": 8001
  },
  {
    "source": 8506,
    "target": 8711
  },
  {
    "source": 8507,
    "target": 6804
  },
  {
    "source": 8507,
    "target": 7323
  },
  {
    "source": 8507,
    "target": 8544
  },
  {
    "source": 8507,
    "target": 8528
  },
  {
    "source": 8507,
    "target": 7006
  },
  {
    "source": 8508,
    "target": 8467
  },
  {
    "source": 8508,
    "target": 8509
  },
  {
    "source": 8508,
    "target": 9029
  },
  {
    "source": 8508,
    "target": 8706
  },
  {
    "source": 8508,
    "target": 8415
  },
  {
    "source": 8509,
    "target": 9405
  },
  {
    "source": 8509,
    "target": 8508
  },
  {
    "source": 8509,
    "target": 8510
  },
  {
    "source": 8509,
    "target": 8450
  },
  {
    "source": 8509,
    "target": 8511
  },
  {
    "source": 8510,
    "target": 9504
  },
  {
    "source": 8510,
    "target": 8509
  },
  {
    "source": 8510,
    "target": 6601
  },
  {
    "source": 8510,
    "target": 8539
  },
  {
    "source": 8510,
    "target": 8305
  },
  {
    "source": 8511,
    "target": 4009
  },
  {
    "source": 8511,
    "target": 6903
  },
  {
    "source": 8511,
    "target": 8484
  },
  {
    "source": 8511,
    "target": 8509
  },
  {
    "source": 8511,
    "target": 9029
  },
  {
    "source": 8512,
    "target": 8708
  },
  {
    "source": 8512,
    "target": 4016
  },
  {
    "source": 8512,
    "target": 7009
  },
  {
    "source": 8512,
    "target": 4009
  },
  {
    "source": 8512,
    "target": 8547
  },
  {
    "source": 8513,
    "target": 8506
  },
  {
    "source": 8513,
    "target": 6702
  },
  {
    "source": 8513,
    "target": 6601
  },
  {
    "source": 8513,
    "target": 8711
  },
  {
    "source": 8513,
    "target": 9101
  },
  {
    "source": 8514,
    "target": 3403
  },
  {
    "source": 8514,
    "target": 8479
  },
  {
    "source": 8514,
    "target": 8207
  },
  {
    "source": 8514,
    "target": 8427
  },
  {
    "source": 8514,
    "target": 8468
  },
  {
    "source": 8515,
    "target": 8479
  },
  {
    "source": 8515,
    "target": 8422
  },
  {
    "source": 8515,
    "target": 8468
  },
  {
    "source": 8515,
    "target": 8208
  },
  {
    "source": 8515,
    "target": 8207
  },
  {
    "source": 8516,
    "target": 9401
  },
  {
    "source": 8516,
    "target": 4009
  },
  {
    "source": 8516,
    "target": 7318
  },
  {
    "source": 8516,
    "target": 7324
  },
  {
    "source": 8516,
    "target": 7321
  },
  {
    "source": 8517,
    "target": 8471
  },
  {
    "source": 8517,
    "target": 8473
  },
  {
    "source": 8517,
    "target": 8504
  },
  {
    "source": 8517,
    "target": 8529
  },
  {
    "source": 8517,
    "target": 8443
  },
  {
    "source": 8518,
    "target": 8521
  },
  {
    "source": 8518,
    "target": 8527
  },
  {
    "source": 8518,
    "target": 8519
  },
  {
    "source": 8518,
    "target": 8531
  },
  {
    "source": 8518,
    "target": 9006
  },
  {
    "source": 8519,
    "target": 8527
  },
  {
    "source": 8519,
    "target": 8523
  },
  {
    "source": 8519,
    "target": 8518
  },
  {
    "source": 8519,
    "target": 8473
  },
  {
    "source": 8519,
    "target": 8471
  },
  {
    "source": 8521,
    "target": 8518
  },
  {
    "source": 8521,
    "target": 9006
  },
  {
    "source": 8521,
    "target": 8529
  },
  {
    "source": 8521,
    "target": 8527
  },
  {
    "source": 8521,
    "target": 8522
  },
  {
    "source": 8522,
    "target": 8532
  },
  {
    "source": 8522,
    "target": 8521
  },
  {
    "source": 8522,
    "target": 9001
  },
  {
    "source": 8522,
    "target": 8541
  },
  {
    "source": 8522,
    "target": 9006
  },
  {
    "source": 8523,
    "target": 8519
  },
  {
    "source": 8523,
    "target": 8473
  },
  {
    "source": 8523,
    "target": 8471
  },
  {
    "source": 8523,
    "target": 8524
  },
  {
    "source": 8523,
    "target": 8542
  },
  {
    "source": 8524,
    "target": 9027
  },
  {
    "source": 8524,
    "target": 8523
  },
  {
    "source": 8524,
    "target": 9022
  },
  {
    "source": 8524,
    "target": 9025
  },
  {
    "source": 8524,
    "target": 8442
  },
  {
    "source": 8525,
    "target": 8529
  },
  {
    "source": 8525,
    "target": 8528
  },
  {
    "source": 8525,
    "target": 8548
  },
  {
    "source": 8525,
    "target": 9207
  },
  {
    "source": 8525,
    "target": 8533
  },
  {
    "source": 8526,
    "target": 8470
  },
  {
    "source": 8526,
    "target": 9029
  },
  {
    "source": 8526,
    "target": 9033
  },
  {
    "source": 8526,
    "target": 9026
  },
  {
    "source": 8526,
    "target": 9025
  },
  {
    "source": 8527,
    "target": 8519
  },
  {
    "source": 8527,
    "target": 8518
  },
  {
    "source": 8527,
    "target": 8470
  },
  {
    "source": 8527,
    "target": 9006
  },
  {
    "source": 8527,
    "target": 8521
  },
  {
    "source": 8528,
    "target": 8525
  },
  {
    "source": 8528,
    "target": 7005
  },
  {
    "source": 8528,
    "target": 8507
  },
  {
    "source": 8528,
    "target": 8539
  },
  {
    "source": 8528,
    "target": 8540
  },
  {
    "source": 8529,
    "target": 8525
  },
  {
    "source": 8529,
    "target": 8517
  },
  {
    "source": 8529,
    "target": 8521
  },
  {
    "source": 8529,
    "target": 9006
  },
  {
    "source": 8529,
    "target": 8504
  },
  {
    "source": 8530,
    "target": 8416
  },
  {
    "source": 8530,
    "target": 7007
  },
  {
    "source": 8530,
    "target": 8707
  },
  {
    "source": 8530,
    "target": 8433
  },
  {
    "source": 8530,
    "target": 7008
  },
  {
    "source": 8531,
    "target": 8543
  },
  {
    "source": 8531,
    "target": 3926
  },
  {
    "source": 8531,
    "target": 8518
  },
  {
    "source": 8531,
    "target": 8505
  },
  {
    "source": 8531,
    "target": 8470
  },
  {
    "source": 8532,
    "target": 8533
  },
  {
    "source": 8532,
    "target": 8543
  },
  {
    "source": 8532,
    "target": 8522
  },
  {
    "source": 8532,
    "target": 8534
  },
  {
    "source": 8532,
    "target": 9013
  },
  {
    "source": 8533,
    "target": 8532
  },
  {
    "source": 8533,
    "target": 8504
  },
  {
    "source": 8533,
    "target": 8548
  },
  {
    "source": 8533,
    "target": 8305
  },
  {
    "source": 8533,
    "target": 8525
  },
  {
    "source": 8534,
    "target": 8542
  },
  {
    "source": 8534,
    "target": 8541
  },
  {
    "source": 8534,
    "target": 8443
  },
  {
    "source": 8534,
    "target": 9013
  },
  {
    "source": 8534,
    "target": 8532
  },
  {
    "source": 8535,
    "target": 8536
  },
  {
    "source": 8535,
    "target": 8538
  },
  {
    "source": 8535,
    "target": 8448
  },
  {
    "source": 8535,
    "target": 9028
  },
  {
    "source": 8535,
    "target": 8709
  },
  {
    "source": 8536,
    "target": 8538
  },
  {
    "source": 8536,
    "target": 8537
  },
  {
    "source": 8536,
    "target": 8535
  },
  {
    "source": 8536,
    "target": 3926
  },
  {
    "source": 8536,
    "target": 8505
  },
  {
    "source": 8537,
    "target": 9032
  },
  {
    "source": 8537,
    "target": 8538
  },
  {
    "source": 8537,
    "target": 8536
  },
  {
    "source": 8537,
    "target": 4016
  },
  {
    "source": 8537,
    "target": 8547
  },
  {
    "source": 8538,
    "target": 8536
  },
  {
    "source": 8538,
    "target": 8537
  },
  {
    "source": 8538,
    "target": 8504
  },
  {
    "source": 8538,
    "target": 8535
  },
  {
    "source": 8538,
    "target": 7419
  },
  {
    "source": 8539,
    "target": 8540
  },
  {
    "source": 8539,
    "target": 8415
  },
  {
    "source": 8539,
    "target": 8510
  },
  {
    "source": 8539,
    "target": 8528
  },
  {
    "source": 8539,
    "target": 8472
  },
  {
    "source": 8540,
    "target": 8548
  },
  {
    "source": 8540,
    "target": 8539
  },
  {
    "source": 8540,
    "target": 9612
  },
  {
    "source": 8540,
    "target": 8528
  },
  {
    "source": 8540,
    "target": 8423
  },
  {
    "source": 8541,
    "target": 8542
  },
  {
    "source": 8541,
    "target": 8534
  },
  {
    "source": 8541,
    "target": 8522
  },
  {
    "source": 8541,
    "target": 8443
  },
  {
    "source": 8541,
    "target": 9002
  },
  {
    "source": 8542,
    "target": 8541
  },
  {
    "source": 8542,
    "target": 8473
  },
  {
    "source": 8542,
    "target": 8534
  },
  {
    "source": 8542,
    "target": 9013
  },
  {
    "source": 8542,
    "target": 8523
  },
  {
    "source": 8543,
    "target": 8505
  },
  {
    "source": 8543,
    "target": 8531
  },
  {
    "source": 8543,
    "target": 9001
  },
  {
    "source": 8543,
    "target": 8532
  },
  {
    "source": 8543,
    "target": 9031
  },
  {
    "source": 8544,
    "target": 9401
  },
  {
    "source": 8544,
    "target": 6910
  },
  {
    "source": 8544,
    "target": 9404
  },
  {
    "source": 8544,
    "target": 8507
  },
  {
    "source": 8544,
    "target": 7309
  },
  {
    "source": 8545,
    "target": 3801
  },
  {
    "source": 8545,
    "target": 6902
  },
  {
    "source": 8545,
    "target": 7304
  },
  {
    "source": 8545,
    "target": 2826
  },
  {
    "source": 8545,
    "target": 7605
  },
  {
    "source": 8546,
    "target": 8547
  },
  {
    "source": 8546,
    "target": 8414
  },
  {
    "source": 8546,
    "target": 8402
  },
  {
    "source": 8546,
    "target": 8455
  },
  {
    "source": 8546,
    "target": 4010
  },
  {
    "source": 8547,
    "target": 8512
  },
  {
    "source": 8547,
    "target": 8537
  },
  {
    "source": 8547,
    "target": 7616
  },
  {
    "source": 8547,
    "target": 8546
  },
  {
    "source": 8547,
    "target": 8503
  },
  {
    "source": 8548,
    "target": 9001
  },
  {
    "source": 8548,
    "target": 8540
  },
  {
    "source": 8548,
    "target": 9011
  },
  {
    "source": 8548,
    "target": 8533
  },
  {
    "source": 8548,
    "target": 8525
  },
  {
    "source": 8601,
    "target": 8607
  },
  {
    "source": 8601,
    "target": 8605
  },
  {
    "source": 8601,
    "target": 8603
  },
  {
    "source": 8601,
    "target": 7302
  },
  {
    "source": 8601,
    "target": 8604
  },
  {
    "source": 8602,
    "target": 8606
  },
  {
    "source": 8602,
    "target": 8604
  },
  {
    "source": 8602,
    "target": 7302
  },
  {
    "source": 8602,
    "target": 2708
  },
  {
    "source": 8602,
    "target": 2844
  },
  {
    "source": 8603,
    "target": 8605
  },
  {
    "source": 8603,
    "target": 8202
  },
  {
    "source": 8603,
    "target": 2925
  },
  {
    "source": 8603,
    "target": 7226
  },
  {
    "source": 8603,
    "target": 8601
  },
  {
    "source": 8604,
    "target": 8602
  },
  {
    "source": 8604,
    "target": 8601
  },
  {
    "source": 8604,
    "target": 8606
  },
  {
    "source": 8604,
    "target": 9305
  },
  {
    "source": 8604,
    "target": 9306
  },
  {
    "source": 8605,
    "target": 8603
  },
  {
    "source": 8605,
    "target": 8607
  },
  {
    "source": 8605,
    "target": 8601
  },
  {
    "source": 8605,
    "target": 7224
  },
  {
    "source": 8605,
    "target": 7302
  },
  {
    "source": 8606,
    "target": 8602
  },
  {
    "source": 8606,
    "target": 1001
  },
  {
    "source": 8606,
    "target": 8604
  },
  {
    "source": 8606,
    "target": 2716
  },
  {
    "source": 8606,
    "target": 1206
  },
  {
    "source": 8607,
    "target": 8605
  },
  {
    "source": 8607,
    "target": 8482
  },
  {
    "source": 8607,
    "target": 8601
  },
  {
    "source": 8607,
    "target": 7322
  },
  {
    "source": 8607,
    "target": 7008
  },
  {
    "source": 8609,
    "target": 7311
  },
  {
    "source": 8609,
    "target": 8111
  },
  {
    "source": 8609,
    "target": 6309
  },
  {
    "source": 8609,
    "target": 8907
  },
  {
    "source": 8701,
    "target": 8704
  },
  {
    "source": 8701,
    "target": 8707
  },
  {
    "source": 8701,
    "target": 8408
  },
  {
    "source": 8701,
    "target": 7224
  },
  {
    "source": 8701,
    "target": 8706
  },
  {
    "source": 8702,
    "target": 8704
  },
  {
    "source": 8702,
    "target": 8502
  },
  {
    "source": 8702,
    "target": 9406
  },
  {
    "source": 8702,
    "target": 8705
  },
  {
    "source": 8702,
    "target": 9303
  },
  {
    "source": 8703,
    "target": 8707
  },
  {
    "source": 8703,
    "target": 8704
  },
  {
    "source": 8703,
    "target": 8407
  },
  {
    "source": 8703,
    "target": 8408
  },
  {
    "source": 8703,
    "target": 5911
  },
  {
    "source": 8704,
    "target": 8701
  },
  {
    "source": 8704,
    "target": 8703
  },
  {
    "source": 8704,
    "target": 8408
  },
  {
    "source": 8704,
    "target": 8702
  },
  {
    "source": 8704,
    "target": 8706
  },
  {
    "source": 8705,
    "target": 8429
  },
  {
    "source": 8705,
    "target": 8426
  },
  {
    "source": 8705,
    "target": 8430
  },
  {
    "source": 8705,
    "target": 8702
  },
  {
    "source": 8705,
    "target": 8709
  },
  {
    "source": 8706,
    "target": 8701
  },
  {
    "source": 8706,
    "target": 8408
  },
  {
    "source": 8706,
    "target": 8704
  },
  {
    "source": 8706,
    "target": 8508
  },
  {
    "source": 8706,
    "target": 8203
  },
  {
    "source": 8707,
    "target": 8530
  },
  {
    "source": 8707,
    "target": 7224
  },
  {
    "source": 8707,
    "target": 7007
  },
  {
    "source": 8707,
    "target": 8703
  },
  {
    "source": 8707,
    "target": 8701
  },
  {
    "source": 8708,
    "target": 8512
  },
  {
    "source": 8708,
    "target": 8409
  },
  {
    "source": 8708,
    "target": 8483
  },
  {
    "source": 8708,
    "target": 7320
  },
  {
    "source": 8708,
    "target": 8302
  },
  {
    "source": 8709,
    "target": 4012
  },
  {
    "source": 8709,
    "target": 8429
  },
  {
    "source": 8709,
    "target": 8705
  },
  {
    "source": 8709,
    "target": 8535
  },
  {
    "source": 8709,
    "target": 8201
  },
  {
    "source": 8710,
    "target": 9306
  },
  {
    "source": 8710,
    "target": 9305
  },
  {
    "source": 8710,
    "target": 2844
  },
  {
    "source": 8710,
    "target": 9303
  },
  {
    "source": 8710,
    "target": 5502
  },
  {
    "source": 8711,
    "target": 8205
  },
  {
    "source": 8711,
    "target": 5504
  },
  {
    "source": 8711,
    "target": 9207
  },
  {
    "source": 8711,
    "target": 8513
  },
  {
    "source": 8711,
    "target": 8506
  },
  {
    "source": 8712,
    "target": 5404
  },
  {
    "source": 8712,
    "target": 8715
  },
  {
    "source": 8712,
    "target": 6913
  },
  {
    "source": 8712,
    "target": 5510
  },
  {
    "source": 8712,
    "target": 9503
  },
  {
    "source": 8713,
    "target": 9402
  },
  {
    "source": 8713,
    "target": 8448
  },
  {
    "source": 8713,
    "target": 8201
  },
  {
    "source": 8713,
    "target": 3406
  },
  {
    "source": 8713,
    "target": 4806
  },
  {
    "source": 8714,
    "target": 7020
  },
  {
    "source": 8714,
    "target": 9209
  },
  {
    "source": 8714,
    "target": 8476
  },
  {
    "source": 8714,
    "target": 9612
  },
  {
    "source": 8714,
    "target": 7006
  },
  {
    "source": 8715,
    "target": 8712
  },
  {
    "source": 8715,
    "target": 4014
  },
  {
    "source": 8715,
    "target": 8204
  },
  {
    "source": 8715,
    "target": 6601
  },
  {
    "source": 8715,
    "target": 4814
  },
  {
    "source": 8716,
    "target": 3922
  },
  {
    "source": 8716,
    "target": 8432
  },
  {
    "source": 8716,
    "target": 4902
  },
  {
    "source": 8716,
    "target": 9402
  },
  {
    "source": 8716,
    "target": 9406
  },
  {
    "source": 8802,
    "target": 9014
  },
  {
    "source": 8802,
    "target": 9015
  },
  {
    "source": 8802,
    "target": 9701
  },
  {
    "source": 8802,
    "target": 9703
  },
  {
    "source": 8802,
    "target": 6309
  },
  {
    "source": 8803,
    "target": 8411
  },
  {
    "source": 8803,
    "target": 8805
  },
  {
    "source": 8803,
    "target": 9014
  },
  {
    "source": 8803,
    "target": 9020
  },
  {
    "source": 8803,
    "target": 9024
  },
  {
    "source": 8805,
    "target": 8803
  },
  {
    "source": 8805,
    "target": 3811
  },
  {
    "source": 8805,
    "target": 3503
  },
  {
    "source": 8805,
    "target": 2844
  },
  {
    "source": 8805,
    "target": 8411
  },
  {
    "source": 8901,
    "target": 8906
  },
  {
    "source": 8901,
    "target": 8904
  },
  {
    "source": 8901,
    "target": 8903
  },
  {
    "source": 8901,
    "target": 8905
  },
  {
    "source": 8901,
    "target": 8907
  },
  {
    "source": 8902,
    "target": 304
  },
  {
    "source": 8902,
    "target": 303
  },
  {
    "source": 8902,
    "target": 511
  },
  {
    "source": 8902,
    "target": 306
  },
  {
    "source": 8902,
    "target": 301
  },
  {
    "source": 8903,
    "target": 8901
  },
  {
    "source": 8903,
    "target": 8907
  },
  {
    "source": 8903,
    "target": 9020
  },
  {
    "source": 8903,
    "target": 8906
  },
  {
    "source": 8903,
    "target": 7311
  },
  {
    "source": 8904,
    "target": 8906
  },
  {
    "source": 8904,
    "target": 8905
  },
  {
    "source": 8904,
    "target": 8901
  },
  {
    "source": 8904,
    "target": 7102
  },
  {
    "source": 8904,
    "target": 2709
  },
  {
    "source": 8905,
    "target": 8904
  },
  {
    "source": 8905,
    "target": 8906
  },
  {
    "source": 8905,
    "target": 8901
  },
  {
    "source": 8905,
    "target": 2709
  },
  {
    "source": 8905,
    "target": 2711
  },
  {
    "source": 8906,
    "target": 8904
  },
  {
    "source": 8906,
    "target": 8905
  },
  {
    "source": 8906,
    "target": 8901
  },
  {
    "source": 8906,
    "target": 8903
  },
  {
    "source": 8906,
    "target": 2707
  },
  {
    "source": 8907,
    "target": 8903
  },
  {
    "source": 8907,
    "target": 7311
  },
  {
    "source": 8907,
    "target": 8901
  },
  {
    "source": 8907,
    "target": 9015
  },
  {
    "source": 8907,
    "target": 8609
  },
  {
    "source": 9001,
    "target": 8543
  },
  {
    "source": 9001,
    "target": 8522
  },
  {
    "source": 9001,
    "target": 9002
  },
  {
    "source": 9001,
    "target": 8548
  },
  {
    "source": 9001,
    "target": 8470
  },
  {
    "source": 9002,
    "target": 8443
  },
  {
    "source": 9002,
    "target": 9013
  },
  {
    "source": 9002,
    "target": 9001
  },
  {
    "source": 9002,
    "target": 8541
  },
  {
    "source": 9002,
    "target": 7006
  },
  {
    "source": 9003,
    "target": 9004
  },
  {
    "source": 9003,
    "target": 4908
  },
  {
    "source": 9003,
    "target": 8305
  },
  {
    "source": 9003,
    "target": 9113
  },
  {
    "source": 9003,
    "target": 7410
  },
  {
    "source": 9004,
    "target": 9506
  },
  {
    "source": 9004,
    "target": 9504
  },
  {
    "source": 9004,
    "target": 9003
  },
  {
    "source": 9004,
    "target": 9105
  },
  {
    "source": 9004,
    "target": 9102
  },
  {
    "source": 9005,
    "target": 9011
  },
  {
    "source": 9005,
    "target": 9023
  },
  {
    "source": 9005,
    "target": 9305
  },
  {
    "source": 9005,
    "target": 9012
  },
  {
    "source": 9005,
    "target": 8446
  },
  {
    "source": 9006,
    "target": 8521
  },
  {
    "source": 9006,
    "target": 8518
  },
  {
    "source": 9006,
    "target": 8527
  },
  {
    "source": 9006,
    "target": 8529
  },
  {
    "source": 9006,
    "target": 8522
  },
  {
    "source": 9010,
    "target": 9024
  },
  {
    "source": 9010,
    "target": 9207
  },
  {
    "source": 9010,
    "target": 9015
  },
  {
    "source": 9010,
    "target": 8506
  },
  {
    "source": 9010,
    "target": 7410
  },
  {
    "source": 9011,
    "target": 9030
  },
  {
    "source": 9011,
    "target": 9013
  },
  {
    "source": 9011,
    "target": 8548
  },
  {
    "source": 9011,
    "target": 8472
  },
  {
    "source": 9011,
    "target": 9005
  },
  {
    "source": 9012,
    "target": 8101
  },
  {
    "source": 9012,
    "target": 3703
  },
  {
    "source": 9012,
    "target": 9023
  },
  {
    "source": 9012,
    "target": 9005
  },
  {
    "source": 9012,
    "target": 2930
  },
  {
    "source": 9013,
    "target": 8542
  },
  {
    "source": 9013,
    "target": 9002
  },
  {
    "source": 9013,
    "target": 8534
  },
  {
    "source": 9013,
    "target": 9011
  },
  {
    "source": 9013,
    "target": 8532
  },
  {
    "source": 9014,
    "target": 9020
  },
  {
    "source": 9014,
    "target": 8411
  },
  {
    "source": 9014,
    "target": 8803
  },
  {
    "source": 9014,
    "target": 9015
  },
  {
    "source": 9014,
    "target": 8802
  },
  {
    "source": 9015,
    "target": 9014
  },
  {
    "source": 9015,
    "target": 9010
  },
  {
    "source": 9015,
    "target": 8802
  },
  {
    "source": 9015,
    "target": 8907
  },
  {
    "source": 9015,
    "target": 7101
  },
  {
    "source": 9017,
    "target": 8456
  },
  {
    "source": 9017,
    "target": 8467
  },
  {
    "source": 9017,
    "target": 8203
  },
  {
    "source": 9017,
    "target": 8211
  },
  {
    "source": 9017,
    "target": 8406
  },
  {
    "source": 9018,
    "target": 3822
  },
  {
    "source": 9018,
    "target": 9019
  },
  {
    "source": 9018,
    "target": 9021
  },
  {
    "source": 9018,
    "target": 9022
  },
  {
    "source": 9018,
    "target": 9402
  },
  {
    "source": 9019,
    "target": 9402
  },
  {
    "source": 9019,
    "target": 9018
  },
  {
    "source": 9019,
    "target": 3822
  },
  {
    "source": 9019,
    "target": 9021
  },
  {
    "source": 9019,
    "target": 9504
  },
  {
    "source": 9020,
    "target": 9014
  },
  {
    "source": 9020,
    "target": 8405
  },
  {
    "source": 9020,
    "target": 8803
  },
  {
    "source": 9020,
    "target": 8903
  },
  {
    "source": 9020,
    "target": 8426
  },
  {
    "source": 9021,
    "target": 9018
  },
  {
    "source": 9021,
    "target": 9019
  },
  {
    "source": 9021,
    "target": 3003
  },
  {
    "source": 9021,
    "target": 3913
  },
  {
    "source": 9021,
    "target": 3507
  },
  {
    "source": 9022,
    "target": 8427
  },
  {
    "source": 9022,
    "target": 5911
  },
  {
    "source": 9022,
    "target": 8209
  },
  {
    "source": 9022,
    "target": 8524
  },
  {
    "source": 9022,
    "target": 9018
  },
  {
    "source": 9023,
    "target": 8423
  },
  {
    "source": 9023,
    "target": 8101
  },
  {
    "source": 9023,
    "target": 9012
  },
  {
    "source": 9023,
    "target": 9005
  },
  {
    "source": 9023,
    "target": 8502
  },
  {
    "source": 9024,
    "target": 3914
  },
  {
    "source": 9024,
    "target": 8411
  },
  {
    "source": 9024,
    "target": 9010
  },
  {
    "source": 9024,
    "target": 8803
  },
  {
    "source": 9024,
    "target": 3818
  },
  {
    "source": 9025,
    "target": 9033
  },
  {
    "source": 9025,
    "target": 9030
  },
  {
    "source": 9025,
    "target": 8526
  },
  {
    "source": 9025,
    "target": 8423
  },
  {
    "source": 9025,
    "target": 8524
  },
  {
    "source": 9026,
    "target": 9032
  },
  {
    "source": 9026,
    "target": 9027
  },
  {
    "source": 9026,
    "target": 8412
  },
  {
    "source": 9026,
    "target": 8431
  },
  {
    "source": 9026,
    "target": 8526
  },
  {
    "source": 9027,
    "target": 8479
  },
  {
    "source": 9027,
    "target": 9031
  },
  {
    "source": 9027,
    "target": 8524
  },
  {
    "source": 9027,
    "target": 9026
  },
  {
    "source": 9027,
    "target": 9030
  },
  {
    "source": 9028,
    "target": 7309
  },
  {
    "source": 9028,
    "target": 5601
  },
  {
    "source": 9028,
    "target": 8535
  },
  {
    "source": 9028,
    "target": 8307
  },
  {
    "source": 9028,
    "target": 7304
  },
  {
    "source": 9029,
    "target": 8505
  },
  {
    "source": 9029,
    "target": 8526
  },
  {
    "source": 9029,
    "target": 8501
  },
  {
    "source": 9029,
    "target": 8511
  },
  {
    "source": 9029,
    "target": 8508
  },
  {
    "source": 9030,
    "target": 9031
  },
  {
    "source": 9030,
    "target": 9033
  },
  {
    "source": 9030,
    "target": 9027
  },
  {
    "source": 9030,
    "target": 9011
  },
  {
    "source": 9030,
    "target": 9025
  },
  {
    "source": 9031,
    "target": 9030
  },
  {
    "source": 9031,
    "target": 8543
  },
  {
    "source": 9031,
    "target": 9033
  },
  {
    "source": 9031,
    "target": 8479
  },
  {
    "source": 9031,
    "target": 9027
  },
  {
    "source": 9032,
    "target": 8537
  },
  {
    "source": 9032,
    "target": 8419
  },
  {
    "source": 9032,
    "target": 8481
  },
  {
    "source": 9032,
    "target": 9026
  },
  {
    "source": 9032,
    "target": 8503
  },
  {
    "source": 9033,
    "target": 9031
  },
  {
    "source": 9033,
    "target": 9025
  },
  {
    "source": 9033,
    "target": 9030
  },
  {
    "source": 9033,
    "target": 8505
  },
  {
    "source": 9033,
    "target": 8526
  },
  {
    "source": 9101,
    "target": 9102
  },
  {
    "source": 9101,
    "target": 7113
  },
  {
    "source": 9101,
    "target": 9111
  },
  {
    "source": 9101,
    "target": 7101
  },
  {
    "source": 9101,
    "target": 8513
  },
  {
    "source": 9102,
    "target": 9101
  },
  {
    "source": 9102,
    "target": 9114
  },
  {
    "source": 9102,
    "target": 9004
  },
  {
    "source": 9102,
    "target": 9105
  },
  {
    "source": 9102,
    "target": 9108
  },
  {
    "source": 9105,
    "target": 8211
  },
  {
    "source": 9105,
    "target": 9004
  },
  {
    "source": 9105,
    "target": 8205
  },
  {
    "source": 9105,
    "target": 9102
  },
  {
    "source": 9105,
    "target": 9613
  },
  {
    "source": 9108,
    "target": 9114
  },
  {
    "source": 9108,
    "target": 9111
  },
  {
    "source": 9108,
    "target": 9102
  },
  {
    "source": 9108,
    "target": 7410
  },
  {
    "source": 9108,
    "target": 9113
  },
  {
    "source": 9111,
    "target": 9113
  },
  {
    "source": 9111,
    "target": 9114
  },
  {
    "source": 9111,
    "target": 9108
  },
  {
    "source": 9111,
    "target": 7113
  },
  {
    "source": 9111,
    "target": 9101
  },
  {
    "source": 9113,
    "target": 9111
  },
  {
    "source": 9113,
    "target": 9114
  },
  {
    "source": 9113,
    "target": 9108
  },
  {
    "source": 9113,
    "target": 9003
  },
  {
    "source": 9113,
    "target": 6601
  },
  {
    "source": 9114,
    "target": 9108
  },
  {
    "source": 9114,
    "target": 9111
  },
  {
    "source": 9114,
    "target": 9113
  },
  {
    "source": 9114,
    "target": 9102
  },
  {
    "source": 9114,
    "target": 7410
  },
  {
    "source": 9207,
    "target": 8525
  },
  {
    "source": 9207,
    "target": 9010
  },
  {
    "source": 9207,
    "target": 8711
  },
  {
    "source": 9207,
    "target": 7410
  },
  {
    "source": 9207,
    "target": 8506
  },
  {
    "source": 9209,
    "target": 8714
  },
  {
    "source": 9209,
    "target": 9608
  },
  {
    "source": 9209,
    "target": 9612
  },
  {
    "source": 9209,
    "target": 6506
  },
  {
    "source": 9209,
    "target": 8476
  },
  {
    "source": 9303,
    "target": 9305
  },
  {
    "source": 9303,
    "target": 9306
  },
  {
    "source": 9303,
    "target": 8702
  },
  {
    "source": 9303,
    "target": 8710
  },
  {
    "source": 9303,
    "target": 7311
  },
  {
    "source": 9305,
    "target": 9303
  },
  {
    "source": 9305,
    "target": 9306
  },
  {
    "source": 9305,
    "target": 9005
  },
  {
    "source": 9305,
    "target": 8604
  },
  {
    "source": 9305,
    "target": 8710
  },
  {
    "source": 9306,
    "target": 9303
  },
  {
    "source": 9306,
    "target": 9305
  },
  {
    "source": 9306,
    "target": 3603
  },
  {
    "source": 9306,
    "target": 8604
  },
  {
    "source": 9306,
    "target": 8710
  },
  {
    "source": 9401,
    "target": 8516
  },
  {
    "source": 9401,
    "target": 9403
  },
  {
    "source": 9401,
    "target": 8544
  },
  {
    "source": 9401,
    "target": 7608
  },
  {
    "source": 9401,
    "target": 7321
  },
  {
    "source": 9402,
    "target": 9019
  },
  {
    "source": 9402,
    "target": 8716
  },
  {
    "source": 9402,
    "target": 3005
  },
  {
    "source": 9402,
    "target": 9018
  },
  {
    "source": 9402,
    "target": 8713
  },
  {
    "source": 9403,
    "target": 9401
  },
  {
    "source": 9403,
    "target": 7610
  },
  {
    "source": 9403,
    "target": 7324
  },
  {
    "source": 9403,
    "target": 6810
  },
  {
    "source": 9403,
    "target": 8432
  },
  {
    "source": 9404,
    "target": 4820
  },
  {
    "source": 9404,
    "target": 7314
  },
  {
    "source": 9404,
    "target": 6303
  },
  {
    "source": 9404,
    "target": 6304
  },
  {
    "source": 9404,
    "target": 8544
  },
  {
    "source": 9405,
    "target": 7616
  },
  {
    "source": 9405,
    "target": 8302
  },
  {
    "source": 9405,
    "target": 7326
  },
  {
    "source": 9405,
    "target": 8301
  },
  {
    "source": 9405,
    "target": 8509
  },
  {
    "source": 9406,
    "target": 8716
  },
  {
    "source": 9406,
    "target": 8702
  },
  {
    "source": 9406,
    "target": 4813
  },
  {
    "source": 9406,
    "target": 6306
  },
  {
    "source": 9406,
    "target": 3303
  },
  {
    "source": 9503,
    "target": 9506
  },
  {
    "source": 9503,
    "target": 9505
  },
  {
    "source": 9503,
    "target": 8712
  },
  {
    "source": 9503,
    "target": 4414
  },
  {
    "source": 9503,
    "target": 9603
  },
  {
    "source": 9504,
    "target": 8510
  },
  {
    "source": 9504,
    "target": 9506
  },
  {
    "source": 9504,
    "target": 9612
  },
  {
    "source": 9504,
    "target": 9004
  },
  {
    "source": 9504,
    "target": 9019
  },
  {
    "source": 9505,
    "target": 6702
  },
  {
    "source": 9505,
    "target": 8306
  },
  {
    "source": 9505,
    "target": 9503
  },
  {
    "source": 9505,
    "target": 4015
  },
  {
    "source": 9505,
    "target": 6601
  },
  {
    "source": 9506,
    "target": 3926
  },
  {
    "source": 9506,
    "target": 9504
  },
  {
    "source": 9506,
    "target": 9004
  },
  {
    "source": 9506,
    "target": 9613
  },
  {
    "source": 9506,
    "target": 9503
  },
  {
    "source": 9507,
    "target": 8452
  },
  {
    "source": 9507,
    "target": 5607
  },
  {
    "source": 9507,
    "target": 5608
  },
  {
    "source": 9507,
    "target": 6116
  },
  {
    "source": 9507,
    "target": 6215
  },
  {
    "source": 9603,
    "target": 3005
  },
  {
    "source": 9603,
    "target": 7117
  },
  {
    "source": 9603,
    "target": 8452
  },
  {
    "source": 9603,
    "target": 9503
  },
  {
    "source": 9603,
    "target": 4908
  },
  {
    "source": 9606,
    "target": 9607
  },
  {
    "source": 9606,
    "target": 5401
  },
  {
    "source": 9606,
    "target": 6002
  },
  {
    "source": 9606,
    "target": 8452
  },
  {
    "source": 9606,
    "target": 5810
  },
  {
    "source": 9607,
    "target": 5806
  },
  {
    "source": 9607,
    "target": 9606
  },
  {
    "source": 9607,
    "target": 8308
  },
  {
    "source": 9607,
    "target": 5401
  },
  {
    "source": 9607,
    "target": 5804
  },
  {
    "source": 9608,
    "target": 9609
  },
  {
    "source": 9608,
    "target": 9209
  },
  {
    "source": 9608,
    "target": 4012
  },
  {
    "source": 9608,
    "target": 9613
  },
  {
    "source": 9608,
    "target": 7907
  },
  {
    "source": 9609,
    "target": 9608
  },
  {
    "source": 9609,
    "target": 5402
  },
  {
    "source": 9609,
    "target": 5513
  },
  {
    "source": 9609,
    "target": 5608
  },
  {
    "source": 9609,
    "target": 4015
  },
  {
    "source": 9612,
    "target": 9613
  },
  {
    "source": 9612,
    "target": 9504
  },
  {
    "source": 9612,
    "target": 8714
  },
  {
    "source": 9612,
    "target": 9209
  },
  {
    "source": 9612,
    "target": 8540
  },
  {
    "source": 9613,
    "target": 9612
  },
  {
    "source": 9613,
    "target": 9506
  },
  {
    "source": 9613,
    "target": 9608
  },
  {
    "source": 9613,
    "target": 9105
  },
  {
    "source": 9613,
    "target": 4414
  },
  {
    "source": 9701,
    "target": 9703
  },
  {
    "source": 9701,
    "target": 9706
  },
  {
    "source": 9701,
    "target": 8802
  },
  {
    "source": 9701,
    "target": 1302
  },
  {
    "source": 9703,
    "target": 9701
  },
  {
    "source": 9703,
    "target": 9706
  },
  {
    "source": 9703,
    "target": 6309
  },
  {
    "source": 9703,
    "target": 8802
  },
  {
    "source": 9703,
    "target": 1302
  },
  {
    "source": 9706,
    "target": 9703
  },
  {
    "source": 9706,
    "target": 9701
  },
  {
    "source": 9706,
    "target": 1302
  },
  {
    "source": null,
    "target": null
  }
 ]

  // Your nodes data
  private rawNodes: RawNode[] = [
    {
      "product_code": 8518,
      "x": -1.496793491,
      "y": -1.784721993,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 8535,
      "x": -1.165152876,
      "y": -1.164215032,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 9608,
      "x": -0.617562086,
      "y": -1.376213694,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 1519,
      "x": 0.3527594827435716,
      "y": 0.9301673540527218,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 6805,
      "x": -0.695376426,
      "y": -0.126305048,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 8202,
      "x": -1.638982088,
      "y": -0.17746564,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8607,
      "x": -0.614456922,
      "y": 0.1914656266704812,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 4015,
      "x": 0.6171878202263139,
      "y": -1.372086739,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 604,
      "x": 2.285599209669289,
      "y": 0.678739533,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 701,
      "x": 2.2591412153581087,
      "y": 1.2415419709481967,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 6306,
      "x": 1.238806661191444,
      "y": -0.271479939,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 713,
      "x": 1.9864849714084527,
      "y": 1.4391142256884462,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 4806,
      "x": -1.2480144,
      "y": -0.393659681,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8409,
      "x": -0.912911125,
      "y": -0.454063304,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 207,
      "x": 1.0466527006171016,
      "y": 1.0149181412630388,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 1509,
      "x": 2.1951713424380808,
      "y": 1.197321806477328,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 1512,
      "x": 1.210486057238375,
      "y": 1.5870433395174763,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 3404,
      "x": -2.043378916,
      "y": 0.8730408963070015,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 3808,
      "x": 0.8752847887566642,
      "y": 0.4179778834393541,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 1701,
      "x": 1.7184663925568398,
      "y": 1.224737373249226,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 5402,
      "x": 1.113904101830694,
      "y": -1.387738555,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 6301,
      "x": 2.6533088819503927,
      "y": -1.197805464,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 6909,
      "x": -1.481836679,
      "y": 0.2909759421736302,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 7413,
      "x": -0.223057158,
      "y": 0.974887081,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 9706,
      "x": -2.503885538,
      "y": -0.069799966,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 2303,
      "x": 0.8065746724137686,
      "y": 1.277808791779142,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 4104,
      "x": 1.8357736932955009,
      "y": 1.381524843922425,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8524,
      "x": -1.995288755,
      "y": -0.925144222,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 8605,
      "x": -0.765550882,
      "y": 0.4162199441217553,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 7322,
      "x": 0.195721726,
      "y": 0.2439587601117465,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 6217,
      "x": 2.779339619490311,
      "y": -1.604279034,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 4908,
      "x": 0.018525067,
      "y": -1.310532701,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 6209,
      "x": 2.917058234061364,
      "y": -1.311750651,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 7501,
      "x": -0.429617871,
      "y": 1.8562032041312932,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 7320,
      "x": -0.650126914,
      "y": -0.526691295,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 3816,
      "x": -0.146925151,
      "y": 0.1927881060702492,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 8105,
      "x": -1.03914219,
      "y": 1.784912135536553,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 7616,
      "x": -0.223711446,
      "y": -0.829228271,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8509,
      "x": -0.336021202,
      "y": -1.050544663,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 2804,
      "x": -1.554359738,
      "y": 0.940573881,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 7102,
      "x": -0.816510057,
      "y": 1.887541224796725,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 2933,
      "x": -2.777425496,
      "y": 0.7634535044125674,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 6404,
      "x": 2.7140597027675426,
      "y": -1.57484601,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 708,
      "x": 2.097306241000558,
      "y": 1.170210475668139,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 809,
      "x": 2.3846793568661804,
      "y": 1.4067748307006198,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 3923,
      "x": 1.2555526644160606,
      "y": 0.043901951,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 8504,
      "x": -1.398842072,
      "y": -1.374307484,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 4016,
      "x": -0.589448106,
      "y": -0.728802644,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 709,
      "x": 2.389752643622568,
      "y": 1.166276124609527,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 2836,
      "x": -0.459865456,
      "y": 0.7723774436393591,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 2707,
      "x": -1.104915375,
      "y": 1.3023382601966258,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 2009,
      "x": 1.9406548342682752,
      "y": 0.862050816,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 9406,
      "x": 0.3837579433825491,
      "y": -0.116165467,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 2613,
      "x": -0.57537568,
      "y": 1.901592309463552,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 6201,
      "x": 2.9035107428221405,
      "y": -1.486742442,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 5701,
      "x": 1.790827514782836,
      "y": -0.77502822,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 2306,
      "x": 1.2118755717337688,
      "y": 1.5229525417701408,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 1005,
      "x": 1.330411611643454,
      "y": 1.572149391016218,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 4002,
      "x": -1.861366455,
      "y": 0.9616546515854588,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 2510,
      "x": 0.1919073163289346,
      "y": 1.360649462500631,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 8541,
      "x": -1.918507962,
      "y": -1.967185334,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 8452,
      "x": 1.4153932911758256,
      "y": -1.699253807,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 7219,
      "x": -1.814083288,
      "y": 0.6225920761086723,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 9017,
      "x": -1.766036836,
      "y": -0.895083105,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 6914,
      "x": -0.200481613,
      "y": -1.411220836,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 4201,
      "x": -0.270779187,
      "y": -1.139680769,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8102,
      "x": -1.782352964,
      "y": 1.4708660427770877,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 8459,
      "x": -1.523931388,
      "y": -0.354433011,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 802,
      "x": 2.4268149626362057,
      "y": 1.2271890179137015,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 2505,
      "x": 0.6996560862752674,
      "y": 0.5707284861886857,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 5408,
      "x": 1.4142593055229635,
      "y": -1.423484742,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 7608,
      "x": 0.086321515,
      "y": -0.545059334,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 2914,
      "x": -2.477115591,
      "y": 0.9646791358699928,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 2849,
      "x": -1.344204321,
      "y": 0.7309410974171535,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 4819,
      "x": 1.4432685535935257,
      "y": 0.29655808,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 9032,
      "x": -1.43365696,
      "y": -1.16769439,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 3402,
      "x": 1.2239587848952027,
      "y": 0.2483366209113273,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 7306,
      "x": 0.5825077880532157,
      "y": 0.1862663879614623,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 6908,
      "x": 0.8402196293807074,
      "y": -0.626900643,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 5602,
      "x": -0.080310555,
      "y": -0.293276019,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 6108,
      "x": 2.952423120211228,
      "y": -1.427692313,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 6907,
      "x": 0.8775476250330154,
      "y": -0.676296311,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 6206,
      "x": 2.9419883737406325,
      "y": -1.548930404,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 6406,
      "x": 2.6748387152162305,
      "y": -1.414121466,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 9113,
      "x": -1.329041801,
      "y": -2.08260732,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 7004,
      "x": -1.751667128,
      "y": 0.2489388187098882,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 8537,
      "x": -1.23721201,
      "y": -1.22024843,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 9003,
      "x": -1.106697169,
      "y": -1.658818954,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 1905,
      "x": 1.531626820594134,
      "y": 0.5451000985331369,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 4808,
      "x": 1.1409256656153903,
      "y": 0.5081794071418715,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 5603,
      "x": -1.652626533,
      "y": 0.5156065527840359,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 8513,
      "x": -0.610523245,
      "y": -1.573211866,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 4809,
      "x": -1.310793802,
      "y": 0.1111747966177754,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 1208,
      "x": 1.477478853,
      "y": 1.5965466292506876,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 4907,
      "x": 0.9102537274632084,
      "y": 0.8448740324388653,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 102,
      "x": 1.4285194043500802,
      "y": 1.4144773868358749,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8215,
      "x": 0.6148960077127947,
      "y": -1.312595173,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 2901,
      "x": -1.484283765,
      "y": 1.230845354124679,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 8451,
      "x": -0.320686293,
      "y": -0.863992853,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 7117,
      "x": 1.0718051748418933,
      "y": -1.75666192,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 305,
      "x": 2.566338601162625,
      "y": -0.033923325,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 1003,
      "x": 0.905329846,
      "y": 1.3523542973267295,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 4804,
      "x": -1.046671427,
      "y": 0.7509200481667246,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 4911,
      "x": 0.7355667526897536,
      "y": 0.3556322991862739,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 5516,
      "x": 1.4522640246888665,
      "y": -1.528166062,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 7226,
      "x": -1.527953766,
      "y": 0.5124274645433551,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 5403,
      "x": 0.962102853,
      "y": -1.218111025,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 7228,
      "x": -0.808825975,
      "y": 0.3306873178391765,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 8417,
      "x": -0.469428409,
      "y": -0.083951673,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 4012,
      "x": -0.688710058,
      "y": -0.243117452,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 2915,
      "x": -2.186348893,
      "y": 0.7845251002733464,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 6116,
      "x": 2.6156914295829194,
      "y": -1.391037266,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 9024,
      "x": -1.963227649,
      "y": -0.970915221,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 4005,
      "x": -0.489095694,
      "y": -0.689435102,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8212,
      "x": 0.2506304729886848,
      "y": -0.530902773,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 7323,
      "x": 0.963785186,
      "y": -0.969217478,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 1202,
      "x": 1.918068652103167,
      "y": 1.506129003310845,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 6402,
      "x": 2.753291571690617,
      "y": -1.48104589,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 5705,
      "x": 1.5463705291516971,
      "y": -1.01359633,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 8438,
      "x": -0.097490652,
      "y": 0.025675731,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 2811,
      "x": -1.421976113,
      "y": 0.7112219902232813,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 1214,
      "x": 1.6269540560274232,
      "y": 1.5358145018278575,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 5703,
      "x": 0.7825828370895285,
      "y": -0.620178804,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 6202,
      "x": 2.851166759792978,
      "y": -1.542083763,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 7008,
      "x": 0.1441127247976665,
      "y": 0.2189303210394704,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 8712,
      "x": -0.062994747,
      "y": -1.296271966,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 9613,
      "x": -1.050010113,
      "y": -1.714674072,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 2844,
      "x": -1.321488234,
      "y": 1.575276984064768,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 707,
      "x": 2.338746152350761,
      "y": 1.3676720453402431,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8533,
      "x": -1.792954965,
      "y": -1.788205909,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 8470,
      "x": -1.570559533,
      "y": -1.785096221,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 4411,
      "x": 0.6029283327122181,
      "y": 1.1074606245618877,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8525,
      "x": -1.654304832,
      "y": -1.616492214,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 2926,
      "x": -2.423499221,
      "y": 0.9966793728682628,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 7312,
      "x": -0.176314697,
      "y": -0.530017292,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 8415,
      "x": -0.987424008,
      "y": -1.408628793,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 5608,
      "x": 1.8008438786222616,
      "y": -0.909048009,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 9612,
      "x": -1.369645762,
      "y": -1.6639329,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 9001,
      "x": -1.622823556,
      "y": -1.832776993,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 2102,
      "x": 1.5562251395659237,
      "y": 0.4805380309929825,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 5804,
      "x": 1.7151756945679697,
      "y": -1.586337873,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 9402,
      "x": -1.073565471,
      "y": -0.820296637,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8303,
      "x": -0.013390485,
      "y": -0.747732217,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 8446,
      "x": -1.821045899,
      "y": -0.21779774,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 3918,
      "x": -0.761824012,
      "y": 0.060837122,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 2833,
      "x": -0.478403707,
      "y": 0.9731608675330884,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 8529,
      "x": -1.656502197,
      "y": -1.744012599,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 3405,
      "x": 0.9490985741130612,
      "y": 0.2089706773621951,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 5515,
      "x": 1.579146321266216,
      "y": -1.504828323,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 8714,
      "x": -1.036711304,
      "y": -1.610298585,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 2605,
      "x": -0.487734178,
      "y": 1.9010101178430832,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 8477,
      "x": -1.338386332,
      "y": -0.751265497,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 3104,
      "x": -0.087205677,
      "y": 1.231972743693107,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 8514,
      "x": -1.422206517,
      "y": -0.482375006,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 6115,
      "x": 2.8179568743026646,
      "y": -1.408774223,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 8706,
      "x": -0.746673963,
      "y": -0.236510619,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 9303,
      "x": -1.066288951,
      "y": -0.069182319,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 5309,
      "x": 1.047461712268313,
      "y": -1.246867183,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 7410,
      "x": -1.831705242,
      "y": -1.970033278,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 9004,
      "x": -1.09271748,
      "y": -1.757777501,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 2903,
      "x": -2.20801835,
      "y": 0.909160808,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 8802,
      "x": -2.206568835,
      "y": -0.734715061,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 1804,
      "x": 2.236462480401711,
      "y": 0.5038356989007502,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 7507,
      "x": -2.117171978,
      "y": 1.025492175853333,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 1520,
      "x": 0.646295306,
      "y": 0.5869630853816474,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 6107,
      "x": 3.0607795757050376,
      "y": -1.343138688,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 8461,
      "x": -1.605959998,
      "y": -0.446960519,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8480,
      "x": -0.859844876,
      "y": -0.832615767,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 7321,
      "x": 0.3624179228095485,
      "y": -0.519197028,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 404,
      "x": 0.9430506710082338,
      "y": 1.0876186983752874,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8609,
      "x": -0.154078675,
      "y": -0.365389767,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 6112,
      "x": 2.8900334914489614,
      "y": -1.409082779,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 7301,
      "x": 0.023631609,
      "y": 0.303105428,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 7213,
      "x": -0.045427811,
      "y": 0.4202746281983027,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 201,
      "x": 1.346093013243025,
      "y": 1.2963227930973815,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 4805,
      "x": 0.663589229,
      "y": 1.1395988923510203,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8539,
      "x": -0.53669222,
      "y": -1.12089994,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 7227,
      "x": -1.307810411,
      "y": 0.3141378285058231,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8410,
      "x": -1.045809353,
      "y": -0.140055685,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 4014,
      "x": -0.833575105,
      "y": -0.718875258,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8412,
      "x": -1.07132562,
      "y": -0.385343148,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8523,
      "x": -1.760184553,
      "y": -1.857726852,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 2002,
      "x": 2.285140724903981,
      "y": 1.3921435076792332,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8442,
      "x": -1.316391106,
      "y": -0.84221601,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8478,
      "x": 0.5813921417909667,
      "y": 0.3599828734530126,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 2007,
      "x": 1.8481974078093035,
      "y": 0.8289001054598666,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 3208,
      "x": 0.8526918821483318,
      "y": 0.2187069976372715,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 6804,
      "x": -1.282353075,
      "y": -0.174971438,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8440,
      "x": -1.640963292,
      "y": -0.23283256,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 1602,
      "x": 1.119563270985843,
      "y": 0.9078515869981408,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 3302,
      "x": -2.711705984,
      "y": 0.5181249044387788,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 3702,
      "x": -2.34703032,
      "y": 0.7343705588333713,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 5911,
      "x": -0.592883257,
      "y": -0.500374055,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 3001,
      "x": -2.759374706,
      "y": 0.4696536046928741,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 5903,
      "x": 0.3247530325516914,
      "y": -1.386121547,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 3822,
      "x": -2.523169468,
      "y": 0.1259394744298196,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 3903,
      "x": -1.86078583,
      "y": 0.7407433552141085,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 8707,
      "x": -0.272716866,
      "y": 0.061696677,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 7317,
      "x": 0.6564964700647526,
      "y": 0.086048339,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 9028,
      "x": -0.619274863,
      "y": -0.664626139,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 3503,
      "x": -1.139608062,
      "y": 0.9046413648826768,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 8519,
      "x": -1.539587603,
      "y": -1.862165642,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 9102,
      "x": -1.26334393,
      "y": -1.950537891,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 6104,
      "x": 3.1144308516283488,
      "y": -1.454576023,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 8458,
      "x": -1.57407226,
      "y": -0.167141564,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 9607,
      "x": 1.3446160809857135,
      "y": -1.65568266,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 1201,
      "x": 1.3294457370712047,
      "y": 1.6937828105275248,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 2704,
      "x": -0.627710799,
      "y": 1.145050398311609,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 5513,
      "x": 1.6174013119826762,
      "y": -1.548288371,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 7315,
      "x": -1.076003387,
      "y": -0.313574536,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8434,
      "x": 0.4276416598657406,
      "y": 0.7493138716912244,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 2930,
      "x": -2.570578749,
      "y": 0.7594461130469541,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 4011,
      "x": -0.178416881,
      "y": -0.619654796,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 9010,
      "x": -2.12615021,
      "y": -0.8002933,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 2608,
      "x": -0.379762238,
      "y": 1.9969841342038104,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 5201,
      "x": 2.028683909207393,
      "y": 1.558448118516631,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 6309,
      "x": -0.987670428,
      "y": -0.416542487,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 3006,
      "x": -2.714348642,
      "y": 0.4225939834898891,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 403,
      "x": 1.1813967271621395,
      "y": 0.7937808579450696,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 5208,
      "x": 1.7132506698666976,
      "y": -1.498802142,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 7112,
      "x": 0.4280579640326398,
      "y": 0.8357201997336374,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 8422,
      "x": -1.347115699,
      "y": -0.673344038,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 4008,
      "x": -0.567371759,
      "y": -0.123267661,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 4813,
      "x": 0.4760328317736264,
      "y": 0.3653623453344927,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8463,
      "x": -1.590779139,
      "y": -0.255802967,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 9504,
      "x": -1.161032382,
      "y": -1.614382184,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 9305,
      "x": -1.22826471,
      "y": -0.249046739,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 4811,
      "x": -0.974805162,
      "y": 0.6075108508397076,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 6204,
      "x": 2.9812278229451614,
      "y": -1.352626825,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 3301,
      "x": 2.210862219389468,
      "y": 1.085452644862576,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 2614,
      "x": 0.1149512597850228,
      "y": 1.951158740295457,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 4802,
      "x": -1.066374779,
      "y": 0.6859620003560405,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 9505,
      "x": 0.8176028815645786,
      "y": -1.728351728,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 1515,
      "x": 1.9928071706655397,
      "y": 0.998819916,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 7324,
      "x": 0.049210291,
      "y": -0.877551182,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 3603,
      "x": -0.742826237,
      "y": 0.2071776976379968,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 7901,
      "x": -0.630725978,
      "y": 1.5856784209766066,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 7005,
      "x": -0.26147867,
      "y": -0.513917646,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 4301,
      "x": 0.2819779933623172,
      "y": 0.4106356752692686,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 3812,
      "x": -2.235986226,
      "y": 0.5088824052992829,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 8211,
      "x": -0.786927581,
      "y": -1.445592634,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 6212,
      "x": 2.8346753684413626,
      "y": -1.473688884,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 1604,
      "x": 2.5841485946992666,
      "y": 0.029720057,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 6215,
      "x": 2.671818523238892,
      "y": -1.730468062,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 6109,
      "x": 3.0201694404461445,
      "y": -1.55002737,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 7010,
      "x": 1.0011987655096846,
      "y": 0.074671927,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 6405,
      "x": 3.061118854431365,
      "y": -1.667294529,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 3905,
      "x": -2.265769764,
      "y": 0.6095097521425572,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 5514,
      "x": 1.5114729918059373,
      "y": -1.430274768,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 7210,
      "x": -0.420717154,
      "y": 0.4016891255098396,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 1212,
      "x": 2.5076953431146425,
      "y": 1.2176582640780205,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8903,
      "x": -0.832798248,
      "y": -0.108002592,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 9209,
      "x": -1.051631315,
      "y": -1.539327616,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 7304,
      "x": -0.977085971,
      "y": 0.093236298,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8474,
      "x": -0.781029205,
      "y": -0.290500369,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 2815,
      "x": -1.636987862,
      "y": 1.1394800390799855,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 3913,
      "x": -2.612308706,
      "y": 0.4062600044951003,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 3105,
      "x": 0.1187647526689477,
      "y": 1.1850570722685867,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 2507,
      "x": -1.031775012,
      "y": 0.4382888302034846,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 202,
      "x": 1.3754629359956292,
      "y": 1.3659839500763409,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 4420,
      "x": 2.4642927299785145,
      "y": -0.972333647,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 3707,
      "x": -2.316419004,
      "y": 0.9051621766017188,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 6802,
      "x": 1.4437879251356662,
      "y": -0.21520694,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 8501,
      "x": -0.68464776,
      "y": -1.040424141,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 7009,
      "x": -0.421509416,
      "y": -0.794189995,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 4013,
      "x": 0.5208787549509437,
      "y": -1.188799724,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 5502,
      "x": -2.360166519,
      "y": 0.9757086365562108,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 6102,
      "x": 3.037132154136496,
      "y": -1.409977494,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 3406,
      "x": 0.4948322965651033,
      "y": -0.314291147,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 5806,
      "x": 1.375184605177436,
      "y": -1.605958725,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 8460,
      "x": -1.566462635,
      "y": -0.404069404,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 3922,
      "x": 0.8187844885017306,
      "y": -0.122585793,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 3921,
      "x": 0.5286764193140927,
      "y": -0.076567914,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 6208,
      "x": 3.125961743475842,
      "y": -1.520982365,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 2906,
      "x": -2.666850647,
      "y": 0.9240906846216794,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 306,
      "x": 2.6479776210993915,
      "y": 0.069566326,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8548,
      "x": -1.732076319,
      "y": -1.769005844,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 7222,
      "x": -1.544214265,
      "y": 0.2807174488123634,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 2818,
      "x": -0.761236234,
      "y": 0.72625977,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 7002,
      "x": -2.344537018,
      "y": 0.8457833073141838,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 2912,
      "x": -2.400313402,
      "y": 0.8519411852551162,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 9404,
      "x": 1.3818988394745118,
      "y": -0.425983627,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 1205,
      "x": 0.7996054594558801,
      "y": 1.2160844052748234,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 2001,
      "x": 2.168496087479447,
      "y": 1.0447820380663564,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 407,
      "x": 1.6809977949098371,
      "y": 0.8453075390907876,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 2207,
      "x": 1.5747204149984446,
      "y": 1.0586328241927538,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 4303,
      "x": 0.7101585662285239,
      "y": -0.611076703,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8426,
      "x": -1.257374642,
      "y": -0.456750525,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 3005,
      "x": 0.2098412230148123,
      "y": -0.241678783,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8507,
      "x": -0.616371126,
      "y": -1.118221657,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 2302,
      "x": 1.578695172257154,
      "y": 1.400965758699034,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 3303,
      "x": 0.9006744524333747,
      "y": 0.165830077,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 2936,
      "x": -2.779201073,
      "y": 0.6820729887424544,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 8464,
      "x": -1.572104688,
      "y": -0.555783,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 2105,
      "x": 1.481425245176302,
      "y": 0.5960539992486731,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 7205,
      "x": -1.202354025,
      "y": 0.4958495640695153,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 8603,
      "x": -1.230882108,
      "y": 0.2160132071900249,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8531,
      "x": -1.397656308,
      "y": -1.719829392,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 8301,
      "x": -0.410541543,
      "y": -0.935873749,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8436,
      "x": 0.1488227082260236,
      "y": 0.6495024572887953,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 2834,
      "x": -0.116947156,
      "y": 1.1526559422400782,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 2403,
      "x": 1.0458606834678577,
      "y": 0.4085334876327757,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 3810,
      "x": -1.930788996,
      "y": 0.4008536604099104,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 2920,
      "x": -2.599619297,
      "y": 0.9291114066646422,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 4909,
      "x": 1.1514527814833704,
      "y": -0.001554039,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8204,
      "x": -1.441085391,
      "y": -0.42433803,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 4823,
      "x": 0.9448002488726486,
      "y": 0.038158698,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 3909,
      "x": -1.593782887,
      "y": 0.5860845300519806,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 2827,
      "x": -2.280673147,
      "y": 0.5536303067046879,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 7506,
      "x": -1.968354364,
      "y": 1.367164196204048,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 1207,
      "x": 1.977213003,
      "y": 1.5152531226983146,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 6303,
      "x": 2.093484923309971,
      "y": -1.237750699,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 6305,
      "x": 2.8229592487486848,
      "y": -1.088371611,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 8606,
      "x": -0.08522594,
      "y": 0.7373442582042857,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 8528,
      "x": -1.29222737,
      "y": -1.671378039,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 5205,
      "x": 1.9628580899573975,
      "y": -1.527476678,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 803,
      "x": 2.4380362244388616,
      "y": 0.7328316220570223,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 1702,
      "x": 0.806690577,
      "y": 0.3535618373233244,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 504,
      "x": 1.8070144722502857,
      "y": 1.5255497935296098,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 2909,
      "x": -1.78389121,
      "y": 1.182022052186122,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 7310,
      "x": 1.1420823309813102,
      "y": 0.1942313920069605,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 8716,
      "x": 0.094299517,
      "y": -0.189785835,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 2401,
      "x": 1.9371243181814977,
      "y": 1.0290047398554738,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 7801,
      "x": 1.7886435990174192,
      "y": 0.5504943678836205,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 5503,
      "x": -0.012323989,
      "y": -0.877221435,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 7408,
      "x": -0.414291948,
      "y": 1.012829093779021,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 6304,
      "x": 2.7999677660510445,
      "y": -1.229550119,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 8532,
      "x": -1.625829443,
      "y": -2.134836386,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 8511,
      "x": -0.531786311,
      "y": -0.637200806,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 804,
      "x": 2.386502536818253,
      "y": 0.8633296725393551,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 4202,
      "x": 2.597113321236133,
      "y": -1.683373459,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8405,
      "x": -1.101286315,
      "y": -0.2316738,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 3306,
      "x": 1.0405801615975516,
      "y": 0.023956088,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 6505,
      "x": 2.782642176951777,
      "y": -1.546140489,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 703,
      "x": 2.3244579331247053,
      "y": 1.440492580331171,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 3701,
      "x": -2.304395821,
      "y": 0.6555586470227368,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 4410,
      "x": 0.5780042450318512,
      "y": 1.2196204084678652,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8207,
      "x": -1.195463488,
      "y": -0.496978924,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 4101,
      "x": 1.7060848586414448,
      "y": 1.398728973284487,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8543,
      "x": -1.532997404,
      "y": -1.662306149,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 2701,
      "x": -0.411328853,
      "y": 1.6903566637443634,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 601,
      "x": 2.3038826651402378,
      "y": 0.9419414041893122,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 7305,
      "x": -0.705696613,
      "y": 0.8281641977313918,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 9207,
      "x": -1.587086686,
      "y": -1.890165484,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 8402,
      "x": -0.322678745,
      "y": -0.31682844,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 704,
      "x": 2.395435042672492,
      "y": 1.347965782349466,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 2826,
      "x": -1.422456422,
      "y": 0.454781734,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 5401,
      "x": 1.6626877473225008,
      "y": -1.712535601,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 3924,
      "x": 1.1112583390783568,
      "y": -0.161794765,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 8526,
      "x": -1.790399004,
      "y": -1.39703107,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 1006,
      "x": 2.034099714649116,
      "y": 1.3343777400826924,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 2202,
      "x": 1.4354468034973724,
      "y": 0.5137689438933233,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8404,
      "x": -0.76983423,
      "y": -0.727005994,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 2530,
      "x": -0.152696313,
      "y": 1.713598693168679,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 4902,
      "x": 0.8819847794603639,
      "y": 0.7032695344314974,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 6111,
      "x": 3.093074936916816,
      "y": -1.570224613,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 9018,
      "x": -2.135032527,
      "y": -1.111832761,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 7214,
      "x": 0.2416672180895194,
      "y": 0.4822173661552353,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 6103,
      "x": 3.122808529785262,
      "y": -1.318629936,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 7606,
      "x": -0.86002992,
      "y": 0.4448472460353998,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 8406,
      "x": -1.01329233,
      "y": -0.315587998,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8429,
      "x": -1.373327456,
      "y": -0.354662609,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 1007,
      "x": 1.5745626962391783,
      "y": 1.6190236295275295,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 3206,
      "x": -2.011404739,
      "y": 0.5502328078215171,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 7502,
      "x": -1.293593716,
      "y": 1.6355196704028423,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 7614,
      "x": 0.5667444093776077,
      "y": -0.322741272,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 8450,
      "x": -0.062266429,
      "y": -0.785099851,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 8455,
      "x": -0.988786075,
      "y": -0.059472575,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 2916,
      "x": -2.268598798,
      "y": 1.0221375304403968,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 302,
      "x": 2.618313351,
      "y": -0.145307484,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8437,
      "x": -0.148913447,
      "y": 0.061721774,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 2304,
      "x": 1.384618815627526,
      "y": 1.6304872287644292,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8432,
      "x": 0.2528990556074286,
      "y": 0.6927449825775507,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8479,
      "x": -1.819738056,
      "y": -0.829948375,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 6903,
      "x": -1.104238468,
      "y": 0.082885469,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8428,
      "x": -1.122461893,
      "y": -0.527253776,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8472,
      "x": -1.5732023,
      "y": -1.725191373,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 2921,
      "x": -2.623693519,
      "y": 0.8745182756122967,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 2208,
      "x": 1.305602695336133,
      "y": 0.5771422419636241,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 4107,
      "x": 1.9476080919563312,
      "y": -0.442609116,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8408,
      "x": -0.8462431,
      "y": -0.243176169,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 2809,
      "x": -0.497943411,
      "y": 0.8207163356326221,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 7307,
      "x": -1.006825738,
      "y": -0.771792783,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 2523,
      "x": 1.5287447853594085,
      "y": 0.6955011591541158,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 2604,
      "x": -0.29543124,
      "y": 1.9034691020521848,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 8447,
      "x": 1.1631242141942568,
      "y": -1.755844656,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 1108,
      "x": 0.7362000729788991,
      "y": 1.2177906718306626,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 7602,
      "x": 0.8627867997108813,
      "y": 0.490663761,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 2615,
      "x": 0.2416825009150298,
      "y": 1.9829135168778984,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 8108,
      "x": -1.924908654,
      "y": 1.4069500919234956,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 104,
      "x": 1.931854799945559,
      "y": 1.6731939672955112,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 7318,
      "x": -0.958444592,
      "y": -0.888268989,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8538,
      "x": -1.324330473,
      "y": -1.243803811,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 402,
      "x": 1.273147475769517,
      "y": 1.105249586743406,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 2610,
      "x": -0.243279515,
      "y": 1.8761000585228345,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 7207,
      "x": -0.517761996,
      "y": 1.3511932879087256,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 3307,
      "x": 0.7592080611280903,
      "y": 0.055719565,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 3506,
      "x": -2.355008175,
      "y": 0.4119584506184166,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 203,
      "x": 0.9177166368163804,
      "y": 1.1558547998993474,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 2106,
      "x": 1.273293335056187,
      "y": 0.4741760071696799,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 7212,
      "x": -0.382392107,
      "y": 0.2749722426869962,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 8602,
      "x": -0.230942362,
      "y": 0.6844159607945697,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8503,
      "x": -0.6208158,
      "y": -0.844662327,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 4415,
      "x": 0.9884488543681896,
      "y": 0.7759721631894068,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 3801,
      "x": -1.287711356,
      "y": 0.381456013,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8483,
      "x": -1.028551436,
      "y": -0.242723307,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 7326,
      "x": -0.546814647,
      "y": -0.901079276,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 714,
      "x": 2.448895222145622,
      "y": 0.832720694,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 3207,
      "x": -1.921741196,
      "y": 0.573979727,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 8420,
      "x": -1.587920395,
      "y": -0.023615585,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 2710,
      "x": -0.891879512,
      "y": 1.306597563674552,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 3103,
      "x": 0.2264701597960199,
      "y": 1.3168563529851984,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 9401,
      "x": 0.3475630775448737,
      "y": -0.728187069,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 8905,
      "x": -1.034498656,
      "y": 1.2665305160440403,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 901,
      "x": 2.3970360714729475,
      "y": 0.6653862380866258,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 7407,
      "x": -0.423295428,
      "y": 0.9477518375580458,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 7601,
      "x": -0.59093433,
      "y": 1.2874940311912186,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 8201,
      "x": -0.691117041,
      "y": -1.112049278,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8418,
      "x": 0.043499038,
      "y": -0.806160378,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 101,
      "x": 1.2879449187415748,
      "y": 1.262717385851504,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 910,
      "x": 2.270740268607379,
      "y": 0.9865940098943358,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 2917,
      "x": -1.745051682,
      "y": 0.9553914748550988,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 3214,
      "x": 0.492923777,
      "y": 0.1300768467631581,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 7314,
      "x": 0.7863564723645227,
      "y": -0.181453262,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 6809,
      "x": 0.4127008639903966,
      "y": 0.2007350572035635,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 7612,
      "x": 0.5753566483404535,
      "y": 0.1193070712528876,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 702,
      "x": 2.458336095907635,
      "y": 1.3506336476310192,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 7615,
      "x": 1.0991038468187426,
      "y": -0.93514086,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 8208,
      "x": -1.133211221,
      "y": -0.41318938,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8471,
      "x": -1.877564355,
      "y": -1.850475222,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 2309,
      "x": 1.146357487458249,
      "y": 0.2771022495652158,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 4803,
      "x": 1.0489212832358454,
      "y": 0.1164758419135378,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 5404,
      "x": -0.38620022,
      "y": -0.231277346,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8427,
      "x": -1.828200462,
      "y": -0.132349755,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 4820,
      "x": 1.5808708352967944,
      "y": 0.1889709509661434,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8305,
      "x": -0.437523616,
      "y": -1.173592602,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 3802,
      "x": -2.119051399,
      "y": 0.7077085975628763,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 3507,
      "x": -2.700984593,
      "y": 0.6208806008437442,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 5407,
      "x": 1.5067112301647514,
      "y": -1.595501057,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 9603,
      "x": 0.8972455977018927,
      "y": -1.400213709,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 6601,
      "x": 0.031081192,
      "y": -1.444074058,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 4602,
      "x": 2.786354436399522,
      "y": -1.163967914,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8425,
      "x": -1.269623704,
      "y": -0.694146083,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8468,
      "x": -1.28853186,
      "y": -0.794590711,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8904,
      "x": -0.96178175,
      "y": 1.192036742448089,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 9006,
      "x": -1.637423728,
      "y": -1.917524016,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 2807,
      "x": -0.550557594,
      "y": 1.228977735966828,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 8522,
      "x": -1.632580234,
      "y": -1.995864912,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 3505,
      "x": -0.565099753,
      "y": 0.2925115051270466,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 4102,
      "x": 1.9833261336380852,
      "y": 1.6584062054318212,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 7610,
      "x": 0.5947709717678595,
      "y": -0.187442685,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 9101,
      "x": -1.197742707,
      "y": -2.107211945,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 6911,
      "x": 0.5417389559342252,
      "y": -1.133845713,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 4302,
      "x": 0.4483849166682172,
      "y": -0.174838024,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8517,
      "x": -1.771832083,
      "y": -1.692813475,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 103,
      "x": 0.6782504106838738,
      "y": 0.8734235588554284,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8515,
      "x": -1.405603867,
      "y": -0.721696248,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 2910,
      "x": -2.30768603,
      "y": 1.070620135,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 2603,
      "x": -0.452195862,
      "y": 1.9639597347808808,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 1211,
      "x": 2.353433192191333,
      "y": 1.1139970217599262,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 9005,
      "x": -1.543923708,
      "y": -0.805210499,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8485,
      "x": -1.530521587,
      "y": -0.602289729,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 7103,
      "x": 0.1812800673882111,
      "y": 1.9922546263508332,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 2922,
      "x": -2.692077169,
      "y": 0.8600677776621315,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 4801,
      "x": -1.270081089,
      "y": 0.6411256100859957,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 2515,
      "x": 2.318742767696888,
      "y": 1.0687852492962038,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 6105,
      "x": 3.0165669728168654,
      "y": -1.625462854,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 5504,
      "x": -1.436114683,
      "y": 0.175455357,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 8307,
      "x": -0.631127305,
      "y": -0.781690159,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 3915,
      "x": 1.8443779240577785,
      "y": 0.2233078858896711,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 6106,
      "x": 3.106063443530177,
      "y": -1.629213717,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 7208,
      "x": -0.642351746,
      "y": 0.7833166205747801,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 7311,
      "x": -0.417731685,
      "y": -0.277499727,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 2924,
      "x": -2.6367867,
      "y": 0.8071780720515758,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 8101,
      "x": -1.932626297,
      "y": 0.8256354286584702,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 813,
      "x": 2.313333686698389,
      "y": 1.3178101386472787,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8203,
      "x": -0.886894315,
      "y": -1.128404565,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 4414,
      "x": 0.4063157606235106,
      "y": -1.338876898,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 7007,
      "x": -0.063368015,
      "y": -0.06013929,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 7217,
      "x": 0.2613920273999919,
      "y": 0.3540255900018896,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 204,
      "x": 1.840522984151069,
      "y": 1.680084497521738,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 7403,
      "x": -0.449829347,
      "y": 1.782909742031019,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 2822,
      "x": -1.1519347,
      "y": 1.7775450084286657,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 8416,
      "x": -0.608308457,
      "y": 0.1293620106305439,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8445,
      "x": -1.876493151,
      "y": -0.201864121,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8805,
      "x": -2.450252968,
      "y": 0.5480511281815383,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 2104,
      "x": 1.6411573027436417,
      "y": 0.4218615087742225,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 4412,
      "x": 0.7204245291741849,
      "y": 1.5454498441744553,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 9503,
      "x": -0.706516811,
      "y": -1.561888725,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 3911,
      "x": -2.228469583,
      "y": 0.9694603164847292,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 2501,
      "x": 1.5949200311318696,
      "y": 1.2773844003681265,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 8521,
      "x": -1.451519954,
      "y": -1.855140976,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 2516,
      "x": 0.381105456,
      "y": 1.3414006188716847,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 810,
      "x": 2.489562576303226,
      "y": 1.2847186179049497,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 2714,
      "x": 0.689869637,
      "y": 0.7243627345970216,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 2935,
      "x": -2.851439218,
      "y": 0.7235338987632058,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 4105,
      "x": 2.0939515996697526,
      "y": 1.5851486715862864,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8112,
      "x": -1.826362794,
      "y": 1.5019829892556085,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 8407,
      "x": -0.726180978,
      "y": -0.509066089,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 2715,
      "x": 0.517974162,
      "y": 0.7526750279905228,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 801,
      "x": 2.468297441575224,
      "y": 0.6519020148623795,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 3926,
      "x": -0.587029629,
      "y": -1.498354371,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 8441,
      "x": -1.411491422,
      "y": -0.625223912,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 5501,
      "x": -0.018721624,
      "y": -0.651988568,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 902,
      "x": 2.0454968512077443,
      "y": 1.411461544273239,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 6002,
      "x": 1.779595249345813,
      "y": -1.608071359,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 6810,
      "x": 0.6685154953590442,
      "y": -0.155943905,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 1209,
      "x": 1.8357244825973569,
      "y": 1.2961641642296655,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 7907,
      "x": -0.281575586,
      "y": -0.944086166,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8505,
      "x": -1.416313704,
      "y": -1.626895249,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 8456,
      "x": -2.165751068,
      "y": 0.3078790910161637,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 8547,
      "x": -0.729451625,
      "y": -0.918625996,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 5211,
      "x": 1.5694991904911175,
      "y": -1.441000328,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 7215,
      "x": 0.1783543232725266,
      "y": 0.410737186,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 1104,
      "x": 1.308960270969436,
      "y": 1.3752717294709873,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 2713,
      "x": -0.672599514,
      "y": 0.9967231733765124,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 4703,
      "x": -1.03929563,
      "y": 0.8247545649236381,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 7325,
      "x": 0.251402133,
      "y": -0.108832434,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 8710,
      "x": -1.036878498,
      "y": 0.1351166279461972,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 2923,
      "x": -2.530874702,
      "y": 0.4634590882186891,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 3002,
      "x": -2.824156531,
      "y": 0.4015145153756001,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 8403,
      "x": 0.1943175401745072,
      "y": 0.098737997,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 8430,
      "x": -1.195161316,
      "y": -0.426850463,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8709,
      "x": -0.886236482,
      "y": -0.326843308,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 6207,
      "x": 3.0937491540470266,
      "y": -1.391045908,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 2519,
      "x": -0.43864617,
      "y": 1.5940443180523445,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 9021,
      "x": -2.258622169,
      "y": -0.955292171,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 8708,
      "x": -0.472491271,
      "y": -0.373538615,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 7225,
      "x": -1.467809857,
      "y": 0.597477042,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 304,
      "x": 2.495693434584923,
      "y": -0.029025954,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8308,
      "x": 0.5571862246469785,
      "y": -1.533272551,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 2918,
      "x": -2.699741995,
      "y": 0.7936197431025609,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 7209,
      "x": -0.601422505,
      "y": 0.5889420988861565,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 9002,
      "x": -1.969760017,
      "y": -2.045441299,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 904,
      "x": 2.4325859409427872,
      "y": 0.9084708314809932,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 3304,
      "x": 0.8808523220900533,
      "y": 0.086319547,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 2703,
      "x": 0.5225058256860686,
      "y": 1.0105874547946412,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 7020,
      "x": -0.734607256,
      "y": -1.4194226,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 2934,
      "x": -2.814310412,
      "y": 0.8429630872917722,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 6801,
      "x": 1.4306229324533124,
      "y": -0.272850421,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 8306,
      "x": 1.010022824434102,
      "y": -1.609344598,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 9013,
      "x": -1.889576717,
      "y": -2.063381028,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 105,
      "x": 1.462525525049477,
      "y": 0.793218909,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 2931,
      "x": -2.730165376,
      "y": 0.9154104893043103,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 3917,
      "x": 1.0678609832342048,
      "y": 0.1811898498654187,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 6815,
      "x": -0.509789618,
      "y": -0.147584223,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 6912,
      "x": 0.5632885957419251,
      "y": -1.399913765,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 7505,
      "x": -2.086320294,
      "y": 1.288710975042055,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 1101,
      "x": 1.684045434841792,
      "y": 1.1669905464130088,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 7216,
      "x": 0.194084019,
      "y": 0.3506230599792581,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 9014,
      "x": -2.003205931,
      "y": -1.037093054,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 1302,
      "x": -2.941896368,
      "y": 0.7907250622161244,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 5105,
      "x": 1.722005894945017,
      "y": 1.7505204499777127,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 8411,
      "x": -2.070022872,
      "y": -0.973237654,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 3209,
      "x": 1.216733676306971,
      "y": 0.1671815594789496,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 1502,
      "x": 1.232849110151033,
      "y": 1.276699573502651,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 7018,
      "x": 0.6985578624340998,
      "y": -1.000934017,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 6211,
      "x": 3.0398683912158537,
      "y": -1.472848447,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 8508,
      "x": -1.279753039,
      "y": -1.145760753,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 4705,
      "x": -1.10379062,
      "y": 0.8560386044221455,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 805,
      "x": 2.3245432112910533,
      "y": 1.2503127267758662,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8527,
      "x": -1.586435882,
      "y": -1.954510236,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 2601,
      "x": -0.529442048,
      "y": 1.7178887753821317,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 4901,
      "x": 0.6668839009075684,
      "y": 0.3666444572388196,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 7110,
      "x": -2.076609709,
      "y": 1.4221554383624602,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 5111,
      "x": 0.6806849036563563,
      "y": -1.051262755,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 7404,
      "x": 1.0296003684379578,
      "y": 0.5073759637648654,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 7224,
      "x": -0.842240345,
      "y": 0.2621880581263611,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 4010,
      "x": -0.897491916,
      "y": -0.127289494,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8516,
      "x": 0.1945165225626501,
      "y": -0.796333912,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 8111,
      "x": -1.326907035,
      "y": 0.6602922389771586,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 2939,
      "x": -2.860122179,
      "y": 0.8877162565961418,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 3403,
      "x": -2.374693114,
      "y": 0.4747862547913781,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 3003,
      "x": -2.784267556,
      "y": 0.5409741498458693,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 7113,
      "x": -1.257478137,
      "y": -2.041542944,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 2905,
      "x": -1.382052605,
      "y": 1.2838250875366506,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 3910,
      "x": -2.292259118,
      "y": 0.9631216726624516,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 1517,
      "x": 1.540175727528065,
      "y": 0.61541773,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 9306,
      "x": -0.969064444,
      "y": 0.007052584,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 5902,
      "x": -0.237261322,
      "y": -0.566984093,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 9609,
      "x": 0.7787407347562478,
      "y": -1.467569326,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 7220,
      "x": -1.84125658,
      "y": 0.4816940684614006,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 2520,
      "x": 1.7325310546113313,
      "y": 0.8822820932692257,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 6205,
      "x": 3.2561739232066707,
      "y": -1.490456311,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 7106,
      "x": -1.616375365,
      "y": 1.6260562746460645,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 7218,
      "x": -1.452306225,
      "y": 0.6619748295825918,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 3901,
      "x": -1.668860806,
      "y": 1.2414478590453355,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 3920,
      "x": 0.7401805765799998,
      "y": -0.120218198,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 8536,
      "x": -1.284354086,
      "y": -1.327236262,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 9031,
      "x": -1.891328863,
      "y": -1.229223628,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 5801,
      "x": 1.3589837709044224,
      "y": -1.435539411,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 8481,
      "x": -1.161443001,
      "y": -0.797044723,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 1605,
      "x": 2.711226511443148,
      "y": 0.020426418,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8465,
      "x": -1.427998463,
      "y": -0.544320171,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8534,
      "x": -1.802185853,
      "y": -2.042957733,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 6101,
      "x": 3.149726231487792,
      "y": -1.386635019,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 807,
      "x": 2.478431483,
      "y": 1.0929402825580263,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 7211,
      "x": -0.707256928,
      "y": 0.4214493104776653,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 3814,
      "x": 0.6040934953291202,
      "y": 0.2567667390025394,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 3919,
      "x": -2.115127442,
      "y": 0.3656112387631292,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 2003,
      "x": 1.0347280620531616,
      "y": -0.77656763,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 3004,
      "x": 0.6407093113126505,
      "y": 0.4786035874651118,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 9405,
      "x": -0.002459231,
      "y": -0.995042849,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 3904,
      "x": -1.596706369,
      "y": 1.0306673834726916,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 8413,
      "x": -1.128449093,
      "y": -0.614557541,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 1518,
      "x": 0.7727058526187549,
      "y": 0.7551865728095244,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 5101,
      "x": 1.8211254107004224,
      "y": 1.7525216596857267,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 6704,
      "x": 2.6104998537570827,
      "y": -1.156160059,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 2929,
      "x": -2.366739479,
      "y": 1.0482000166466277,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 4205,
      "x": 2.4647334866662307,
      "y": -1.288406046,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 5601,
      "x": 0.260973278,
      "y": -0.587258282,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 303,
      "x": 2.6257872029836973,
      "y": -0.070523207,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 5007,
      "x": 1.470781307390122,
      "y": -1.650530181,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 8713,
      "x": -0.827608812,
      "y": -0.935589874,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 9029,
      "x": -1.318387532,
      "y": -1.404416013,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 811,
      "x": 1.953882792191731,
      "y": 0.7228615609615692,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 2907,
      "x": -2.363557901,
      "y": 1.1083369306762665,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 4810,
      "x": -1.337792442,
      "y": 0.1700599631494825,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 6307,
      "x": 2.765732158443784,
      "y": -1.362265304,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 3809,
      "x": -2.059757887,
      "y": 0.4040925896152409,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 9507,
      "x": 1.8912605588251967,
      "y": -1.087338807,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8419,
      "x": -1.226236252,
      "y": -0.570237464,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 7309,
      "x": 0.042057684,
      "y": -0.291605444,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 9030,
      "x": -1.97508975,
      "y": -1.236907243,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 8457,
      "x": -1.906298757,
      "y": -0.049066344,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8546,
      "x": -0.720516307,
      "y": -0.69996214,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8414,
      "x": -1.187889808,
      "y": -0.690592797,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8506,
      "x": -1.694272416,
      "y": -1.818464922,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 2835,
      "x": -0.122277194,
      "y": 0.9461093184986732,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 6807,
      "x": 0.088858097,
      "y": 0.2080151160038346,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 6702,
      "x": 0.6369688703346643,
      "y": -1.73356754,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 9403,
      "x": 0.5016539385598646,
      "y": -0.461224688,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 4409,
      "x": 0.6550101847182281,
      "y": 1.5329053194217983,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 706,
      "x": 2.424064054044358,
      "y": 1.2905265652988906,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 9114,
      "x": -1.587208582,
      "y": -2.027277506,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 3102,
      "x": -0.355726633,
      "y": 1.293813379113916,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 3902,
      "x": -1.709417085,
      "y": 1.1589559350733185,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 8544,
      "x": 0.4193513383394425,
      "y": -0.647669542,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 9105,
      "x": -1.02795724,
      "y": -1.775460796,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 1206,
      "x": 1.115686079,
      "y": 1.594025969,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 5107,
      "x": 0.9245248299246924,
      "y": -1.258734516,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 8601,
      "x": -0.752113243,
      "y": 0.2599605063324715,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 3907,
      "x": -1.909190145,
      "y": 0.8934085469723532,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 7229,
      "x": -1.374467372,
      "y": 0.3270686263893441,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 2825,
      "x": -1.59826699,
      "y": 1.5629723558795932,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 603,
      "x": 2.2142638706915427,
      "y": 0.8594699007245197,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 6813,
      "x": -0.771397785,
      "y": -0.123556507,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 7013,
      "x": 0.2877756860478908,
      "y": -0.81113002,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 2004,
      "x": 1.0806234262926182,
      "y": 0.8368429133018598,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 4401,
      "x": 0.6714586007645087,
      "y": 1.5932273201937304,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 3908,
      "x": -2.172386565,
      "y": 0.8516616906605807,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 7419,
      "x": -0.622463533,
      "y": -0.90921303,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8545,
      "x": -1.244793392,
      "y": 0.3057085982627514,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 7402,
      "x": -0.395704059,
      "y": 1.9093783825138615,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 6214,
      "x": 2.6225341618768843,
      "y": -1.757457722,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 8473,
      "x": -1.72447238,
      "y": -1.963482208,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 9019,
      "x": -2.043489931,
      "y": -1.090831068,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 1601,
      "x": 1.1872152044904078,
      "y": 0.6446813235077498,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 5702,
      "x": 1.652906127682912,
      "y": -0.769570677,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 8424,
      "x": -1.646195581,
      "y": -0.5875083,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 3703,
      "x": -2.374153423,
      "y": 0.8988994733903661,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 4408,
      "x": 0.7612280227414328,
      "y": 1.594551338530275,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8711,
      "x": -1.138497061,
      "y": -1.386527625,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8104,
      "x": -0.544261681,
      "y": 0.014986868,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8901,
      "x": -1.054960037,
      "y": 1.1318234734783927,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 4001,
      "x": 2.359746588540925,
      "y": 0.5209265388401225,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 3821,
      "x": -2.579494401,
      "y": 0.306051426,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 7508,
      "x": -1.799890862,
      "y": 1.080019546953428,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 8454,
      "x": -1.313416946,
      "y": -0.122105527,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 9022,
      "x": -2.121845283,
      "y": -0.651240467,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 4407,
      "x": 0.7063160359761298,
      "y": 1.6583434641632473,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 9108,
      "x": -1.620507291,
      "y": -2.0698401,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 8701,
      "x": -0.605884112,
      "y": 0.05660327,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 5807,
      "x": 1.6806601055973625,
      "y": -1.627805945,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 1801,
      "x": 2.4226625578137657,
      "y": 0.5452482507927989,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 208,
      "x": 0.6863964012060522,
      "y": 1.0250713358348778,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 4814,
      "x": -0.219385001,
      "y": 0.5347266584326524,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8703,
      "x": -0.664262611,
      "y": -0.373435092,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 1704,
      "x": 1.660971547,
      "y": 0.4809684597713519,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 2803,
      "x": -1.536964459,
      "y": 1.0003422791554772,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 8803,
      "x": -2.176416951,
      "y": -1.01170403,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 4421,
      "x": 0.7227344365531074,
      "y": 1.4252095767748765,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 1511,
      "x": 2.369478263906746,
      "y": 0.5925681890704908,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 6910,
      "x": 0.7667348526918953,
      "y": -0.68205957,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 8475,
      "x": -1.685338626,
      "y": 0.015869152,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 808,
      "x": 2.4021035507556405,
      "y": 1.468230909,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 2841,
      "x": -1.679891216,
      "y": 1.6046061595281795,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 6001,
      "x": 1.6473521043672736,
      "y": -1.497305609,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 8443,
      "x": -1.864494788,
      "y": -1.736372489,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 2101,
      "x": 1.5288970023014912,
      "y": 0.3514391107998551,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 2517,
      "x": 0.7530967648630464,
      "y": 0.4149289537360263,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 2616,
      "x": -0.340926133,
      "y": 1.9455371226312064,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 8431,
      "x": -1.038435268,
      "y": -0.645311003,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 6210,
      "x": 2.973264003703065,
      "y": -1.490345744,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 7203,
      "x": -0.626897264,
      "y": 1.4136262956086778,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 1901,
      "x": 1.2484188248617762,
      "y": 0.8091877459118599,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 7409,
      "x": -0.517212609,
      "y": 1.1026517430851768,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 1805,
      "x": 2.133130651147864,
      "y": 0.4844682387602739,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 2301,
      "x": 2.647296007081634,
      "y": -0.002990873,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 7303,
      "x": 1.0473742945063944,
      "y": -0.174305611,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 8433,
      "x": 0.1115041879255316,
      "y": 0.4950493169458139,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 7605,
      "x": -0.671381167,
      "y": 1.0678792298640665,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 5512,
      "x": 1.4878114489066254,
      "y": -1.48155072,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 8906,
      "x": -1.020508391,
      "y": 1.201069472666994,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 406,
      "x": 1.2545595864144037,
      "y": 0.987180582,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8484,
      "x": -0.938189713,
      "y": -0.753601899,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8510,
      "x": -0.666286913,
      "y": -1.413011152,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 2602,
      "x": -0.193185714,
      "y": 2.020557686123677,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 9011,
      "x": -1.936384649,
      "y": -1.717164368,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 3504,
      "x": -2.671111113,
      "y": 0.3036706908316091,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 3818,
      "x": -2.095019094,
      "y": 0.5835417329784436,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 9015,
      "x": -2.086344991,
      "y": -0.883294257,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 9020,
      "x": -1.827388149,
      "y": -1.114987404,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 2204,
      "x": 1.370102943432669,
      "y": 1.0114099573117237,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 3401,
      "x": 1.794420568191601,
      "y": 0.857875444,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 8439,
      "x": -1.321376486,
      "y": -0.473796025,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 2607,
      "x": -0.331296731,
      "y": 2.0372962279210176,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 6110,
      "x": 3.1795900951608864,
      "y": -1.571963848,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 705,
      "x": 2.3670220693220383,
      "y": 1.297432603272633,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 7411,
      "x": -0.457749702,
      "y": 0.593142331,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 9701,
      "x": -2.545056675,
      "y": -0.015751441,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 2708,
      "x": -0.681406884,
      "y": 1.1714404412916983,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 2620,
      "x": 0.097664061,
      "y": 0.9572396195437416,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 3215,
      "x": -2.457840867,
      "y": 0.3878961087024311,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 3815,
      "x": -2.150482363,
      "y": 0.6307074224392446,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 3916,
      "x": 0.3443007444801513,
      "y": 0.047437303,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 806,
      "x": 2.348295473042594,
      "y": 1.507825385,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 1803,
      "x": 2.188564271313484,
      "y": 0.4685784205950898,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 2712,
      "x": -0.97069555,
      "y": 1.135412747559847,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 3912,
      "x": -2.217664319,
      "y": 0.6466287888083437,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 4418,
      "x": 0.7607314531749534,
      "y": 1.3702704808972328,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 7204,
      "x": 0.6388246332707248,
      "y": 0.7924100204165985,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 7101,
      "x": -1.336911356,
      "y": -2.011491093,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 7206,
      "x": -0.571792347,
      "y": 1.4523112004443992,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 6117,
      "x": 2.895153482520108,
      "y": -1.591515152,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 2711,
      "x": -0.935143418,
      "y": 1.595975683706662,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 7412,
      "x": -0.431405106,
      "y": -0.854375149,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 2821,
      "x": -1.925634465,
      "y": 0.7405666734342087,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 8311,
      "x": -0.791698573,
      "y": -0.472919186,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 5112,
      "x": 0.9895171850026592,
      "y": -1.265144365,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 3817,
      "x": -1.731859242,
      "y": 1.2876769279081008,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 4009,
      "x": -0.36780844,
      "y": -0.636236484,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 5209,
      "x": 1.840081371625125,
      "y": -1.529860017,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 6506,
      "x": -0.154709184,
      "y": -1.475350285,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 9026,
      "x": -1.814847857,
      "y": -0.974381676,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 1507,
      "x": 1.555197522378613,
      "y": 0.917212229,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 1516,
      "x": 1.9107442662804195,
      "y": 0.8020634156753799,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 712,
      "x": 2.4667789400325244,
      "y": 1.1500663851644908,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 3806,
      "x": -1.827293885,
      "y": 0.5361697076098597,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 8482,
      "x": -0.84831594,
      "y": -0.513421102,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8704,
      "x": -0.607206627,
      "y": -0.210351002,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8502,
      "x": -1.476052802,
      "y": -0.706140142,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 9111,
      "x": -1.546850124,
      "y": -2.122733635,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 8309,
      "x": 0.9100792587271832,
      "y": 0.2539018898136138,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 3914,
      "x": -1.736604253,
      "y": 0.4145277647564076,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 8902,
      "x": 2.549193716192192,
      "y": -0.090991658,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 2904,
      "x": -2.100856645,
      "y": 0.8717083546283115,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 8448,
      "x": -1.833312934,
      "y": -0.273066287,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8512,
      "x": -0.485811721,
      "y": -0.760057325,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 7019,
      "x": 0.035370653,
      "y": 0.094231044,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 8530,
      "x": -0.449625535,
      "y": -0.013679381,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 9023,
      "x": -1.578291787,
      "y": -0.666522701,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 3212,
      "x": -2.089973256,
      "y": 0.1028534103287999,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 2503,
      "x": -0.758471755,
      "y": 1.340293768190234,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 4106,
      "x": 2.1250427353626247,
      "y": 1.6267119800925416,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8702,
      "x": -0.474680383,
      "y": -0.244103023,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 3501,
      "x": 1.0019653520372795,
      "y": 1.2049219641270796,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 8705,
      "x": -0.551917032,
      "y": -0.285675032,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 2937,
      "x": -2.843093719,
      "y": 0.5822687955048989,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 2201,
      "x": 1.346178902722393,
      "y": 0.4570070957838457,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 2508,
      "x": -0.546585893,
      "y": 0.4856158120764222,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 511,
      "x": 2.477776277875804,
      "y": 0.1367306174853313,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8401,
      "x": -2.178992719,
      "y": 1.029754439,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 9606,
      "x": 1.6398814924700442,
      "y": -1.663892769,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 3811,
      "x": -2.506812199,
      "y": 0.6272504969205563,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 7221,
      "x": -1.863455923,
      "y": 0.5769605290442628,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 1001,
      "x": 1.070668377149138,
      "y": 1.5368849507355602,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 2716,
      "x": 0.3857043640395363,
      "y": 1.2731677136009298,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 210,
      "x": 1.0417098680592702,
      "y": 0.9132577535137024,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 2529,
      "x": -0.382214581,
      "y": 1.815445824976838,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 7607,
      "x": -1.381261627,
      "y": -0.178000125,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8421,
      "x": -1.089947315,
      "y": -0.725562826,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8604,
      "x": -0.223391424,
      "y": 0.606452536,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 6203,
      "x": 3.211415295528668,
      "y": -1.425063868,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 8423,
      "x": -1.555349637,
      "y": -0.946237304,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 5210,
      "x": 1.5744321809093211,
      "y": -1.585205866,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 409,
      "x": 2.0284193940634614,
      "y": 1.1307980680663363,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 5607,
      "x": 1.7608340527494128,
      "y": -0.847024714,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 9027,
      "x": -2.15957732,
      "y": -0.914386285,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 9506,
      "x": -0.686773235,
      "y": -1.642161265,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 8542,
      "x": -1.761297387,
      "y": -2.177750684,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 6902,
      "x": -0.817837279,
      "y": 0.1920409522653319,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8467,
      "x": -1.307643706,
      "y": -0.91876308,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 2932,
      "x": -2.857438063,
      "y": 0.788508697,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 9703,
      "x": -2.555010398,
      "y": -0.101160242,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 7604,
      "x": 0.660811117,
      "y": -0.223754668,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 2925,
      "x": -2.455961012,
      "y": 0.8427322467753195,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 4203,
      "x": 2.768554223871208,
      "y": -1.669091297,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 4817,
      "x": 1.1796563189930316,
      "y": 0.064945728,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 6403,
      "x": 2.8424126962093963,
      "y": -1.643665848,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 3305,
      "x": 0.976718124,
      "y": 0.1455823450633868,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 6302,
      "x": 2.781701733001177,
      "y": -1.293107971,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 8001,
      "x": -1.678734918,
      "y": -1.876853598,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 9025,
      "x": -1.840498552,
      "y": -1.284348698,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 7201,
      "x": -0.56864494,
      "y": 1.3976375119707996,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 2606,
      "x": 0.5573351404987505,
      "y": 1.604371767619166,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 2843,
      "x": -2.318496918,
      "y": 1.2840355667357546,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 602,
      "x": 2.168107292398465,
      "y": 0.9062602079916436,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8476,
      "x": -1.24104262,
      "y": -1.095806155,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 5810,
      "x": 1.7102760207093797,
      "y": -1.672735322,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 2402,
      "x": 1.091806053112383,
      "y": 0.4627077319325745,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 1103,
      "x": 1.6444362023912171,
      "y": 1.2511242199760102,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8907,
      "x": -1.029122892,
      "y": -0.499785294,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 5906,
      "x": -0.331153072,
      "y": -0.224539526,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 301,
      "x": 2.622239264475839,
      "y": -0.247069205,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 710,
      "x": 2.2127502596530064,
      "y": 1.0049762545485683,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8466,
      "x": -1.375674409,
      "y": -0.433827825,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 7308,
      "x": 0.608244311,
      "y": -0.105665361,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 7302,
      "x": -0.597489012,
      "y": 0.4585155497740478,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 2203,
      "x": 1.2338969006680172,
      "y": 0.5484665819212764,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8715,
      "x": -0.202323866,
      "y": -1.093746643,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 7202,
      "x": -0.386682118,
      "y": 1.5501820747617283,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 5509,
      "x": 1.5227105145349356,
      "y": -1.528791818,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 8302,
      "x": -0.177694675,
      "y": -1.000720993,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 8462,
      "x": -1.502817553,
      "y": -0.411913898,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 405,
      "x": 1.1364967639138186,
      "y": 1.1674922398020984,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 9012,
      "x": -2.316583349,
      "y": -0.101382559,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 4821,
      "x": 1.2530704890279851,
      "y": 0.1184360922273501,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 1107,
      "x": 0.86502176,
      "y": 1.2561364186768271,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 2709,
      "x": -0.759406391,
      "y": 1.491720411792897,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 6806,
      "x": 0.007276174,
      "y": 0.6100445918622146,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 7115,
      "x": -1.865783131,
      "y": 1.4603977213053536,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 4403,
      "x": 0.8475935315581076,
      "y": 1.6350569831420456,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 5510,
      "x": 1.429374019952614,
      "y": -1.579562407,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 4702,
      "x": -1.105934006,
      "y": 0.7842147085635323,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 9033,
      "x": -1.824919667,
      "y": -1.340686924,
      "cluster_name": "Electronic and Electrical Goods"
    },
    {
      "product_code": 7006,
      "x": -1.4817319,
      "y": -1.715842303,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 1806,
      "x": 1.3648619735147838,
      "y": 0.7546194154175638,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8209,
      "x": -1.988002698,
      "y": 0.2802387802850425,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 2902,
      "x": -1.797567322,
      "y": 1.2574575367094472,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 6114,
      "x": 3.1788687457968026,
      "y": -1.492796465,
      "cluster_name": "Textile Apparel and Accessories"
    },
    {
      "product_code": 2008,
      "x": 2.0582029923369767,
      "y": 0.8289817282988889,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 401,
      "x": 1.1543950310506066,
      "y": 0.8495585559860719,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 2814,
      "x": -0.629940869,
      "y": 1.3536582502953047,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 2612,
      "x": -0.303085246,
      "y": 1.988929931,
      "cluster_name": "Minerals"
    },
    {
      "product_code": 206,
      "x": 1.252061455756496,
      "y": 1.3548833031591547,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 3823,
      "x": -2.456788394,
      "y": 0.4759266069426524,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 4707,
      "x": 1.1987170589694314,
      "y": 0.4911520187495855,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 8540,
      "x": -1.634067131,
      "y": -1.509337674,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 2005,
      "x": 2.08183941,
      "y": 0.893219021,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 1504,
      "x": 2.5191617414384826,
      "y": 0.034473359,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 3906,
      "x": -2.114519063,
      "y": 0.8102343412995294,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 2941,
      "x": -2.898994939,
      "y": 0.8398056625457118,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 8205,
      "x": -1.241133644,
      "y": -0.907752165,
      "cluster_name": "Metalworking and Electrical Machinery and Parts"
    },
    {
      "product_code": 3925,
      "x": 0.6784102079074095,
      "y": -0.068929105,
      "cluster_name": "Construction, Building, and Home Supplies"
    },
    {
      "product_code": 1514,
      "x": 0.7273271090128484,
      "y": 1.1583944007195792,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 7223,
      "x": -1.999379723,
      "y": 0.7046939387977607,
      "cluster_name": "Industrial Chemicals and Metals"
    },
    {
      "product_code": 1904,
      "x": 1.6020927501942523,
      "y": 0.6058231699049368,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 1513,
      "x": 2.4854542471495567,
      "y": 0.5432619569335402,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 6913,
      "x": 0.715028102,
      "y": -1.514050259,
      "cluster_name": "Textile and Home Goods"
    },
    {
      "product_code": 307,
      "x": 2.6986426329179967,
      "y": -0.068705841,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 1902,
      "x": 1.6329320860540175,
      "y": 0.5411951648429034,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 4818,
      "x": 1.2865205594040177,
      "y": 0.19738124,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 2103,
      "x": 1.5969764881325317,
      "y": 0.3759279157725168,
      "cluster_name": "Agriculture"
    },
    {
      "product_code": 3204,
      "x": -2.537357983,
      "y": 0.9378807419352873,
      "cluster_name": "Industrial Chemicals and Metals"
    }
  ]

 private apiMap = {
  'Alberta': 'https://api.economicdata.alberta.ca/api/data?code=e786bd96-d36d-4933-b36b-8e5d1cfd549b',
  'British Columbia': 'https://api.economicdata.alberta.ca/api/data?code=e6429f6a-0a6d-4475-a3f1-400a5fa1e0b3',
  'Manitoba' : 'https://api.economicdata.alberta.ca/api/data?code=dcb00881-bd06-4cd3-8f89-1dd182867aa7',
  'New Brunswick' : 'https://api.economicdata.alberta.ca/api/data?code=f547346c-2ff5-48f8-b94b-2d896607a27f',
  'Newfoundland and Labrador' : 'https://api.economicdata.alberta.ca/api/data?code=52332753-d386-42bc-aab9-0a2b6f33cec7',
  'Nova Scotia' : 'https://api.economicdata.alberta.ca/api/data?code=14323f81-095b-4ca6-bfd7-88c96802b347',
  'Ontario': 'https://api.economicdata.alberta.ca/api/data?code=b36d2876-996c-4afc-a388-e743c215cd0d',
  'Prince Edward Island' : 'https://api.economicdata.alberta.ca/api/data?code=c7f40018-09f6-4372-828b-135bce1a7a6a',
  'Quebec' : 'https://api.economicdata.alberta.ca/api/data?code=412697ba-64c3-4263-ad33-240b7b451517',
  'Saskatchewan' : 'https://api.economicdata.alberta.ca/api/data?code=96b8107d-c8dd-4315-bb83-cca5a220f2f5',
    }



 constructor(private unifiedDataService: UnifiedDataService) { 

  this.unifiedDataService.setHSDescriptions([
  {
    "HS4": "0101",
    "HS4 Short Name": "Horses",
    "HS4 Description": "Live horses, asses, mules and hinnies."
  },
  {
    "HS4": "0102",
    "HS4 Short Name": "Bovine",
    "HS4 Description": "Live bovine animals."
  },
  {
    "HS4": "0103",
    "HS4 Short Name": "Pigs",
    "HS4 Description": "Live swine."
  },
  {
    "HS4": "0104",
    "HS4 Short Name": "Sheep and Goats",
    "HS4 Description": "Live sheep and goats."
  },
  {
    "HS4": "0105",
    "HS4 Short Name": "Poultry",
    "HS4 Description": "Live poultry, that is to say, fowls of the species Gallus domesticus, ducks, geese, turkeys and guinea fowls."
  },
  {
    "HS4": "0106",
    "HS4 Short Name": "Other Animals",
    "HS4 Description": "Other live animals."
  },
  {
    "HS4": "0201",
    "HS4 Short Name": "Bovine Meat",
    "HS4 Description": "Meat of bovine animals, fresh or chilled."
  },
  {
    "HS4": "0202",
    "HS4 Short Name": "Frozen Bovine Meat",
    "HS4 Description": "Meat of bovine animals, frozen."
  },
  {
    "HS4": "0203",
    "HS4 Short Name": "Pig Meat",
    "HS4 Description": "Meat of swine, fresh, chilled or frozen."
  },
  {
    "HS4": "0204",
    "HS4 Short Name": "Sheep and Goat Meat",
    "HS4 Description": "Meat of sheep or goats, fresh, chilled or frozen."
  },
  {
    "HS4": "0205",
    "HS4 Short Name": "Horse Meat",
    "HS4 Description": "Meat of horses, asses, mules or hinnies, fresh, chilled or frozen."
  },
  {
    "HS4": "0206",
    "HS4 Short Name": "Edible Offal",
    "HS4 Description": "Edible offal of bovine animals, swine, sheep, goats, horses, asses, mules or hinnies, fresh, chilled or frozen."
  },
  {
    "HS4": "0207",
    "HS4 Short Name": "Poultry Meat",
    "HS4 Description": "Meat and edible offal, of the poultry of heading 01.05, fresh, chilled or frozen."
  },
  {
    "HS4": "0208",
    "HS4 Short Name": "Other Meat",
    "HS4 Description": "Other meat and edible meat offal, fresh, chilled or frozen."
  },
  {
    "HS4": "0209",
    "HS4 Short Name": "Animal Fat",
    "HS4 Description": "Pig fat, free of lean meat, and poultry fat, not rendered or otherwise extracted, fresh, chilled, frozen, salted, in brine, dried or smoked."
  },
  {
    "HS4": "0210",
    "HS4 Short Name": "Preserved Meat",
    "HS4 Description": "Meat and edible meat offal, salted, in brine, dried or smoked; edible flours and meals of meat or meat offal."
  },
  {
    "HS4": "0301",
    "HS4 Short Name": "Live Fish",
    "HS4 Description": "Live fish."
  },
  {
    "HS4": "0302",
    "HS4 Short Name": "Non-fillet Fresh Fish",
    "HS4 Description": "Fish, fresh or chilled, excluding fish fillets and other fish meat of heading 03.04."
  },
  {
    "HS4": "0303",
    "HS4 Short Name": "Non-fillet Frozen Fish",
    "HS4 Description": "Fish, frozen, excluding fish fillets and other fish meat of heading 03.04."
  },
  {
    "HS4": "0304",
    "HS4 Short Name": "Fish Fillets",
    "HS4 Description": "Fish fillets and other fish meat (whether or not minced), fresh, chilled or frozen."
  },
  {
    "HS4": "0305",
    "HS4 Short Name": "Processed Fish",
    "HS4 Description": "Fish, dried, salted or in brine; smoked fish, whether or not cooked before or during the smoking process; flours, meals and pellets of fish, fit for human consumption."
  },
  {
    "HS4": "0306",
    "HS4 Short Name": "Crustaceans",
    "HS4 Description": "Crustaceans, whether in shell or not, live, fresh, chilled, frozen, dried, salted or in brine; smoked crustaceans, whether in shell or not, whether or not cooked before or during the smoking process; crustaceans, in shell, cooked by steaming or by boiling"
  },
  {
    "HS4": "0307",
    "HS4 Short Name": "Molluscs",
    "HS4 Description": "Molluscs, whether in shell or not, live, fresh, chilled, frozen, dried, salted or in brine; smoked molluscs, whether in shell or not, whether or not cooked before or during the smoking process; flours, meals and pellets of molluscs, fit for human consumpt"
  },
  {
    "HS4": "0308",
    "HS4 Short Name": "Aquatic invertebrates other than crustaceans and molluscs",
    "HS4 Description": "Aquatic invertebrates other than crustaceans and molluscs, live, fresh, chilled, frozen, dried, salted or in brine; smoked aquatic invertebrates other than crustaceans and molluscs, whether or not cooked before or during the smoking process; flours, meals"
  },
  {
    "HS4": "0401",
    "HS4 Short Name": "Milk",
    "HS4 Description": "Milk and cream, not concentrated nor containing added sugar or other sweetening matter."
  },
  {
    "HS4": "0402",
    "HS4 Short Name": "Concentrated Milk",
    "HS4 Description": "Milk and cream, concentrated or containing added sugar or other sweetening matter."
  },
  {
    "HS4": "0403",
    "HS4 Short Name": "Fermented Milk Products",
    "HS4 Description": "Buttermilk, curdled milk and cream, yogurt, kephir and other fermented or acidified milk and cream, whether or not concentrated or containing added sugar or other sweetening matter or flavoured or containing added fruit, nuts or cocoa."
  },
  {
    "HS4": "0404",
    "HS4 Short Name": "Whey",
    "HS4 Description": "Whey, whether or not concentrated or containing added sugar or other sweetening matter; products consisting of natural milk constituents, whether or not containing added sugar or other sweetening matter, not elsewhere specified or included."
  },
  {
    "HS4": "0405",
    "HS4 Short Name": "Butter",
    "HS4 Description": "Butter and other fats and oils derived from milk; dairy spreads."
  },
  {
    "HS4": "0406",
    "HS4 Short Name": "Cheese",
    "HS4 Description": "Cheese and curd."
  },
  {
    "HS4": "0407",
    "HS4 Short Name": "Eggs",
    "HS4 Description": "Birds' eggs, in shell, fresh, preserved or cooked."
  },
  {
    "HS4": "0408",
    "HS4 Short Name": "Processed Egg Products",
    "HS4 Description": "Birds' eggs, not in shell, and egg yolks, fresh, dried, cooked by steaming or by boiling in water, moulded, frozen or otherwise preserved, whether or not containing added sugar or other sweetening matter."
  },
  {
    "HS4": "0409",
    "HS4 Short Name": "Honey",
    "HS4 Description": "Natural honey."
  },
  {
    "HS4": "0410",
    "HS4 Short Name": "Other Edible Animal Products",
    "HS4 Description": "Edible products of animal origin, not elsewhere specified or included."
  },
  {
    "HS4": "0501",
    "HS4 Short Name": "Human Hair",
    "HS4 Description": "Human hair, unworked, whether or not washed or scoured; waste of human hair."
  },
  {
    "HS4": "0502",
    "HS4 Short Name": "Pig Hair",
    "HS4 Description": "Pigs', hogs' or boars' bristles and hair; badger hair and other brush making hair; waste of such bristles or hair."
  },
  {
    "HS4": "0503",
    "HS4 Short Name": "Horse Hair",
    "HS4 Description": "(-2006) Horsehair and horsehair waste, whether or not put up as a layer, with or without supporting material"
  },
  {
    "HS4": "0504",
    "HS4 Short Name": "Animal Organs",
    "HS4 Description": "Guts, bladders and stomachs of animals (other than fish), whole and pieces thereof, fresh, chilled, frozen, salted, in brine, dried or smoked."
  },
  {
    "HS4": "0505",
    "HS4 Short Name": "Bird Feathers and Skins",
    "HS4 Description": "Skins and other parts of birds, with their feathers or down, feathers and parts of feathers (whether or not with trimmed edges) and down, not further worked than cleaned, disinfected or treated for preservation; powder and waste of feathers or parts of fe"
  },
  {
    "HS4": "0506",
    "HS4 Short Name": "Processed Bones",
    "HS4 Description": "Bones and horn-cores, unworked, defatted, simply prepared (but not cut to shape), treated with acid or degelatinised; powder and waste of these products."
  },
  {
    "HS4": "0507",
    "HS4 Short Name": "Raw Bones",
    "HS4 Description": "Ivory, tortoise-shell, whalebone and whalebone hair, horns, antlers, hooves, nails, claws and beaks, unworked or simply prepared but not cut to shape; powder and waste of these products."
  },
  {
    "HS4": "0508",
    "HS4 Short Name": "Coral and Shells",
    "HS4 Description": "Coral and similar materials, unworked or simply prepared but not otherwise worked; shells of molluscs, crustaceans or echinoderms and cuttle-bone, unworked or simply prepared but not cut to shape, powder and waste thereof."
  },
  {
    "HS4": "0509",
    "HS4 Short Name": "Sponges",
    "HS4 Description": "(-2006) Natural sponges of animal origin"
  },
  {
    "HS4": "0510",
    "HS4 Short Name": "Pharmaceutical Animal Products",
    "HS4 Description": "Ambergris, castoreum, civet and musk; cantharides; bile, whether or not dried; glands and other animal products used in the preparation of pharmaceutical products, fresh, chilled, frozen or otherwise provisionally preserved."
  },
  {
    "HS4": "0511",
    "HS4 Short Name": "Other Inedible Animal Products",
    "HS4 Description": "Animal products not elsewhere specified or included; dead animals of Chapter 1 or 3, unfit for human consumption."
  },
  {
    "HS4": "0601",
    "HS4 Short Name": "Bulbs and Roots",
    "HS4 Description": "Bulbs, tubers, tuberous roots, corms, crowns and rhizomes, dormant, in growth or in flower; chicory plants and roots other than roots of heading 12.12."
  },
  {
    "HS4": "0602",
    "HS4 Short Name": "Other Live Plants",
    "HS4 Description": "Other live plants (including their roots), cuttings and slips; mushroom spawn."
  },
  {
    "HS4": "0603",
    "HS4 Short Name": "Cut Flowers",
    "HS4 Description": "Cut flowers and flower buds of a kind suitable for bouquets or for ornamental purposes, fresh, dried, dyed, bleached, impregnated or otherwise prepared."
  },
  {
    "HS4": "0604",
    "HS4 Short Name": "Foliage",
    "HS4 Description": "Foliage, branches and other parts of plants, without flowers or flower buds, and grasses, mosses and lichens, being goods of a kind suitable for bouquets or for ornamental purposes, fresh, dried, dyed, bleached, impregnated or otherwise prepared."
  },
  {
    "HS4": "0701",
    "HS4 Short Name": "Potatoes",
    "HS4 Description": "Potatoes, fresh or chilled."
  },
  {
    "HS4": "0702",
    "HS4 Short Name": "Tomatoes",
    "HS4 Description": "Tomatoes, fresh or chilled."
  },
  {
    "HS4": "0703",
    "HS4 Short Name": "Onions",
    "HS4 Description": "Onions, shallots, garlic, leeks and other alliaceous vegetables, fresh or chilled."
  },
  {
    "HS4": "0704",
    "HS4 Short Name": "Cabbages",
    "HS4 Description": "Cabbages, cauliflowers, kohlrabi, kale and similar edible brassicas, fresh or chilled."
  },
  {
    "HS4": "0705",
    "HS4 Short Name": "Lettuce",
    "HS4 Description": "Lettuce (Lactuca sativa) and chicory (Cichorium spp.), fresh or chilled."
  },
  {
    "HS4": "0706",
    "HS4 Short Name": "Root Vegetables",
    "HS4 Description": "Carrots, turnips, salad beetroot, salsify, celeriac, radishes and similar edible roots, fresh or chilled."
  },
  {
    "HS4": "0707",
    "HS4 Short Name": "Cucumbers",
    "HS4 Description": "Cucumbers and gherkins, fresh or chilled."
  },
  {
    "HS4": "0708",
    "HS4 Short Name": "Legumes",
    "HS4 Description": "Leguminous vegetables, shelled or unshelled, fresh or chilled."
  },
  {
    "HS4": "0709",
    "HS4 Short Name": "Other Vegetables",
    "HS4 Description": "Other vegetables, fresh or chilled."
  },
  {
    "HS4": "0710",
    "HS4 Short Name": "Frozen Vegetables",
    "HS4 Description": "Vegetables (uncooked or cooked by steaming or boiling in water), frozen."
  },
  {
    "HS4": "0711",
    "HS4 Short Name": "Preserved Vegetables",
    "HS4 Description": "Vegetables provisionally preserved (for example, by sulphur dioxide gas, in brine, in sulphur water or in other preservative solutions), but unsuitable in that state for immediate consumption."
  },
  {
    "HS4": "0712",
    "HS4 Short Name": "Dried Vegetables",
    "HS4 Description": "Dried vegetables, whole, cut, sliced, broken or in powder, but not further prepared."
  },
  {
    "HS4": "0713",
    "HS4 Short Name": "Dried Legumes",
    "HS4 Description": "Dried leguminous vegetables, shelled, whether or not skinned or split."
  },
  {
    "HS4": "0714",
    "HS4 Short Name": "Cassava",
    "HS4 Description": "Manioc, arrowroot, salep, Jerusalem artichokes, sweet potatoes and similar roots and tubers with high starch or inulin content, fresh, chilled, frozen or dried, whether or not sliced or in the form of pellets; sago pith."
  },
  {
    "HS4": "0801",
    "HS4 Short Name": "Coconuts, Brazil Nuts, and Cashews",
    "HS4 Description": "Coconuts, Brazil nuts and cashew nuts, fresh or dried, whether or not shelled or peeled."
  },
  {
    "HS4": "0802",
    "HS4 Short Name": "Other Nuts",
    "HS4 Description": "Other nuts, fresh or dried, whether or not shelled or peeled."
  },
  {
    "HS4": "0803",
    "HS4 Short Name": "Bananas",
    "HS4 Description": "Bananas, including plantains, fresh or dried."
  },
  {
    "HS4": "0804",
    "HS4 Short Name": "Tropical Fruits",
    "HS4 Description": "Dates, figs, pineapples, avocados, guavas, mangoes and mangosteens, fresh or dried."
  },
  {
    "HS4": "0805",
    "HS4 Short Name": "Citrus",
    "HS4 Description": "Citrus fruit, fresh or dried."
  },
  {
    "HS4": "0806",
    "HS4 Short Name": "Grapes",
    "HS4 Description": "Grapes, fresh or dried."
  },
  {
    "HS4": "0807",
    "HS4 Short Name": "Melons",
    "HS4 Description": "Melons (including watermelons) and papaws (papayas), fresh."
  },
  {
    "HS4": "0808",
    "HS4 Short Name": "Apples and Pears",
    "HS4 Description": "Apples, pears and quinces, fresh."
  },
  {
    "HS4": "0809",
    "HS4 Short Name": "Pitted Fruits",
    "HS4 Description": "Apricots, cherries, peaches (including nectarines), plums and sloes, fresh."
  },
  {
    "HS4": "0810",
    "HS4 Short Name": "Other Fruits",
    "HS4 Description": "Other fruit, fresh."
  },
  {
    "HS4": "0811",
    "HS4 Short Name": "Frozen Fruits and Nuts",
    "HS4 Description": "Fruit and nuts, uncooked or cooked by steaming or boiling in water, frozen, whether or not containing added sugar or other sweetening matter."
  },
  {
    "HS4": "0812",
    "HS4 Short Name": "Preserved Fruits and Nuts",
    "HS4 Description": "Fruit and nuts, provisionally preserved (for example, by sulphur dioxide gas, in brine, in sulphur water or in other preservative solutions), but unsuitable in that state for immediate consumption."
  },
  {
    "HS4": "0813",
    "HS4 Short Name": "Dried Fruits",
    "HS4 Description": "Fruit, dried, other than that of headings 08.01 to 08.06; mixtures of nuts or dried fruits of this Chapter."
  },
  {
    "HS4": "0814",
    "HS4 Short Name": "Citrus and Melon Peels",
    "HS4 Description": "Peel of citrus fruit or melons (including watermelons), fresh, frozen, dried or provisionally preserved in brine, in sulphur water or in other preservative solutions."
  },
  {
    "HS4": "0901",
    "HS4 Short Name": "Coffee",
    "HS4 Description": "Coffee, whether or not roasted or decaffeinated; coffee husks and skins; coffee substitutes containing coffee in any proportion."
  },
  {
    "HS4": "0902",
    "HS4 Short Name": "Tea",
    "HS4 Description": "Tea, whether or not flavoured."
  },
  {
    "HS4": "0903",
    "HS4 Short Name": "Maté",
    "HS4 Description": "Maté"
  },
  {
    "HS4": "0904",
    "HS4 Short Name": "Pepper",
    "HS4 Description": "Pepper of the genus Piper; dried or crushed or ground fruits of the genus Capsicum or of the genus Pimenta."
  },
  {
    "HS4": "0905",
    "HS4 Short Name": "Vanilla",
    "HS4 Description": "Vanilla."
  },
  {
    "HS4": "0906",
    "HS4 Short Name": "Cinnamon",
    "HS4 Description": "Cinnamon and cinnamon-tree flowers."
  },
  {
    "HS4": "0907",
    "HS4 Short Name": "Cloves",
    "HS4 Description": "Cloves (whole fruit, cloves and stems)."
  },
  {
    "HS4": "0908",
    "HS4 Short Name": "Nutmeg",
    "HS4 Description": "Nutmeg, mace and cardamoms."
  },
  {
    "HS4": "0909",
    "HS4 Short Name": "Spice Seeds",
    "HS4 Description": "Seeds of anise, badian, fennel, coriander, cumin or caraway; juniper berries."
  },
  {
    "HS4": "0910",
    "HS4 Short Name": "Spices",
    "HS4 Description": "Ginger, saffron, turmeric (curcuma), thyme, bay leaves, curry and other spices."
  },
  {
    "HS4": "1001",
    "HS4 Short Name": "Wheat",
    "HS4 Description": "Wheat and meslin."
  },
  {
    "HS4": "1002",
    "HS4 Short Name": "Rye",
    "HS4 Description": "Rye."
  },
  {
    "HS4": "1003",
    "HS4 Short Name": "Barley",
    "HS4 Description": "Barley."
  },
  {
    "HS4": "1004",
    "HS4 Short Name": "Oats",
    "HS4 Description": "Oats."
  },
  {
    "HS4": "1005",
    "HS4 Short Name": "Corn",
    "HS4 Description": "Maize (corn)."
  },
  {
    "HS4": "1006",
    "HS4 Short Name": "Rice",
    "HS4 Description": "Rice."
  },
  {
    "HS4": "1007",
    "HS4 Short Name": "Sorghum",
    "HS4 Description": "Grain sorghum."
  },
  {
    "HS4": "1008",
    "HS4 Short Name": "Buckwheat",
    "HS4 Description": "Buckwheat, millet and canary seeds; other cereals."
  },
  {
    "HS4": "1101",
    "HS4 Short Name": "Wheat Flours",
    "HS4 Description": "Wheat or meslin flour."
  },
  {
    "HS4": "1102",
    "HS4 Short Name": "Cereal Flours",
    "HS4 Description": "Cereal flours other than of wheat or meslin."
  },
  {
    "HS4": "1103",
    "HS4 Short Name": "Cereal Meal and Pellets",
    "HS4 Description": "Cereal groats, meal and pellets."
  },
  {
    "HS4": "1104",
    "HS4 Short Name": "Processed Cereals",
    "HS4 Description": "Cereal grains otherwise worked (for example, hulled, rolled, flaked, pearled, sliced or kibbled), except rice of heading 10.06; germ of cereals, whole, rolled, flaked or ground."
  },
  {
    "HS4": "1105",
    "HS4 Short Name": "Potato Flours",
    "HS4 Description": "Flour, meal, powder, flakes, granules and pellets of potatoes."
  },
  {
    "HS4": "1106",
    "HS4 Short Name": "Legume Flours",
    "HS4 Description": "Flour, meal and powder of the dried leguminous vegetables of heading 07.13, of sago or of roots or tubers of heading 07.14 or of the products of Chapter 8."
  },
  {
    "HS4": "1107",
    "HS4 Short Name": "Malt",
    "HS4 Description": "Malt, whether or not roasted."
  },
  {
    "HS4": "1108",
    "HS4 Short Name": "Starches",
    "HS4 Description": "Starches; inulin."
  },
  {
    "HS4": "1109",
    "HS4 Short Name": "Wheat Gluten",
    "HS4 Description": "Wheat gluten, whether or not dried."
  },
  {
    "HS4": "1201",
    "HS4 Short Name": "Soybeans",
    "HS4 Description": "Soya beans, whether or not broken."
  },
  {
    "HS4": "1202",
    "HS4 Short Name": "Ground Nuts",
    "HS4 Description": "Ground-nuts, not roasted or otherwise cooked, whether or not shelled or broken."
  },
  {
    "HS4": "1203",
    "HS4 Short Name": "Copra",
    "HS4 Description": "Copra."
  },
  {
    "HS4": "1204",
    "HS4 Short Name": "Linseed",
    "HS4 Description": "Linseed, whether or not broken."
  },
  {
    "HS4": "1205",
    "HS4 Short Name": "Canola",
    "HS4 Description": "Canola or colza seeds, whether or not broken."
  },
  {
    "HS4": "1206",
    "HS4 Short Name": "Sunflower Seeds",
    "HS4 Description": "Sunflower seeds, whether or not broken."
  },
  {
    "HS4": "1207",
    "HS4 Short Name": "Other Oily Seeds",
    "HS4 Description": "Other oil seeds and oleaginous fruits, whether or not broken."
  },
  {
    "HS4": "1208",
    "HS4 Short Name": "Oil Seed Flower",
    "HS4 Description": "Flours and meals of oil seeds or oleaginous fruits, other than those of mustard."
  },
  {
    "HS4": "1209",
    "HS4 Short Name": "Sowing Seeds",
    "HS4 Description": "Seeds, fruit and spores, of a kind used for sowing."
  },
  {
    "HS4": "1210",
    "HS4 Short Name": "Hops",
    "HS4 Description": "Hop cones, fresh or dried, whether or not ground, powdered or in the form of pellets; lupulin."
  },
  {
    "HS4": "1211",
    "HS4 Short Name": "Perfume Plants",
    "HS4 Description": "Plants and parts of plants (including seeds and fruits), of a kind used primarily in perfumery, in pharmacy or for insecticidal, fungicidal or similar purposes, fresh or dried, whether or not cut, crushed or powdered."
  },
  {
    "HS4": "1212",
    "HS4 Short Name": "Locust beans, seaweed, sugar beet, cane, for food",
    "HS4 Description": "Locust beans, seaweeds and other algae, sugar beet and sugar cane, fresh, chilled, frozen or dried, whether or not ground; fruit stones and kernels and other vegetable products (including unroasted chicory roots of the variety Cichorium intybus sativum) o"
  },
  {
    "HS4": "1213",
    "HS4 Short Name": "Cereal Straws",
    "HS4 Description": "Cereal straw and husks, unprepared, whether or not chopped, ground, pressed or in the form of pellets."
  },
  {
    "HS4": "1214",
    "HS4 Short Name": "Forage Crops",
    "HS4 Description": "Swedes, mangolds, fodder roots, hay, lucerne (alfalfa), clover, sainfoin, forage kale, lupines, vetches and similar forage products, whether or not in the form of pellets."
  },
  {
    "HS4": "1301",
    "HS4 Short Name": "Insect Resins",
    "HS4 Description": "Lac; natural gums, resins, gum-resins and oleoresins (for example, balsams)."
  },
  {
    "HS4": "1302",
    "HS4 Short Name": "Vegetable Saps",
    "HS4 Description": "Vegetable saps and extracts; pectic substances, pectinates and pectates; agar-agar and other mucilages and thickeners, whether or not modified, derived from vegetable products."
  },
  {
    "HS4": "1401",
    "HS4 Short Name": "Vegetable Plaiting Materials",
    "HS4 Description": "Vegetable materials of a kind used primarily for plaiting (for example, bamboos, rattans, reeds, rushes, osier, raffia, cleaned, bleached or dyed cereal straw, and lime bark)."
  },
  {
    "HS4": "1402",
    "HS4 Short Name": "Vegetable Stuffing Materials",
    "HS4 Description": "(-2006) Vegetable materials of a kind used primarily as stuffing or as padding, e.g. kapok, vegetable hair and eelgrass, whether or not put up as a layer, with or without supporting material"
  },
  {
    "HS4": "1403",
    "HS4 Short Name": "Vegetable Brush Materials",
    "HS4 Description": "(-2006) Vegetable materials, such as broom-corn, piassava, couch grass and istle, of a kind used primarily in brooms or in brushes, whether or not in hanks or bundles"
  },
  {
    "HS4": "1404",
    "HS4 Short Name": "Other Vegetable Products",
    "HS4 Description": "Vegetable products not elsewhere specified or included."
  },
  {
    "HS4": "1501",
    "HS4 Short Name": "Pig and Poultry Fat",
    "HS4 Description": "Pig fat (including lard) and poultry fat, other than that of heading 02.09 or 15.03."
  },
  {
    "HS4": "1502",
    "HS4 Short Name": "Bovine, Sheep, and Goat Fat",
    "HS4 Description": "Fats of bovine animals, sheep or goats, other than those of heading 15.03."
  },
  {
    "HS4": "1503",
    "HS4 Short Name": "Lard",
    "HS4 Description": "Lard stearin, lard oil, oleostearin, oleo-oil and tallow oil, not emulsified or mixed or otherwise prepared."
  },
  {
    "HS4": "1504",
    "HS4 Short Name": "Fish Oil",
    "HS4 Description": "Fats and oils and their fractions, of fish or marine mammals, whether or not refined, but not chemically modified."
  },
  {
    "HS4": "1505",
    "HS4 Short Name": "Wool Grease",
    "HS4 Description": "Wool grease and fatty substances derived therefrom (including lanolin)."
  },
  {
    "HS4": "1506",
    "HS4 Short Name": "Other Animal Fats",
    "HS4 Description": "Other animal fats and oils and their fractions, whether or not refined, but not chemically modified."
  },
  {
    "HS4": "1507",
    "HS4 Short Name": "Soybean Oil",
    "HS4 Description": "Soya-bean oil and its fractions, whether or not refined, but not chemically modified."
  },
  {
    "HS4": "1508",
    "HS4 Short Name": "Ground Nut Oil",
    "HS4 Description": "Ground-nut oil and its fractions, whether or not refined, but not chemically modified."
  },
  {
    "HS4": "1509",
    "HS4 Short Name": "Pure Olive Oil",
    "HS4 Description": "Olive oil and its fractions, whether or not refined, but not chemically modified."
  },
  {
    "HS4": "1510",
    "HS4 Short Name": "Olive Oil",
    "HS4 Description": "Other oils and their fractions, obtained solely from olives, whether or not refined, but not chemically modified, including blends of these oils or fractions with oils or fractions of heading 15.09."
  },
  {
    "HS4": "1511",
    "HS4 Short Name": "Palm Oil",
    "HS4 Description": "Palm oil and its fractions, whether or not refined, but not chemically modified."
  },
  {
    "HS4": "1512",
    "HS4 Short Name": "Seed Oils",
    "HS4 Description": "Sunflower-seed, safflower or cotton-seed oil and fractions thereof, whether or not refined, but not chemically modified."
  },
  {
    "HS4": "1513",
    "HS4 Short Name": "Coconut Oil",
    "HS4 Description": "Coconut (copra), palm kernel or babassu oil and fractions thereof, whether or not refined, but not chemically modified."
  },
  {
    "HS4": "1514",
    "HS4 Short Name": "Canola Oil",
    "HS4 Description": "Canola, colza or mustard oil and fractions thereof, whether or not refined, but not chemically modified."
  },
  {
    "HS4": "1515",
    "HS4 Short Name": "Other Pure Vegetable Oils",
    "HS4 Description": "Other fixed vegetable fats and oils (including jojoba oil) and their fractions, whether or not refined, but not chemically modified."
  },
  {
    "HS4": "1516",
    "HS4 Short Name": "Other Vegetable Oils",
    "HS4 Description": "Animal or vegetable fats and oils and their fractions, partly or wholly hydrogenated, inter-esterified, re-esterified or elaidinised, whether or not refined, but not further prepared."
  },
  {
    "HS4": "1517",
    "HS4 Short Name": "Margarine",
    "HS4 Description": "Margarine; edible mixtures or preparations of animal or vegetable fats or oils or of fractions of different fats or oils of this Chapter, other than edible fats or oils or their fractions of heading 15.16."
  },
  {
    "HS4": "1518",
    "HS4 Short Name": "Inedible Fats and Oils",
    "HS4 Description": "Animal or vegetable fats and oils and their fractions, boiled, oxidised, dehydrated, sulphurised, blown, polymerised by heat in vacuum or in inert gas or otherwise chemically modified, excluding those of heading 15.16; inedible mixtures or preparations of"
  },
  {
    "HS4": "1519",
    "HS4 Short Name": "Stearic Acid",
    "HS4 Description": "(-1996) Industrial monocarboxylic fatty acids; acid oils from refining; industrial fatty alcohols"
  },
  {
    "HS4": "1520",
    "HS4 Short Name": "Glycerol",
    "HS4 Description": "Glycerol, crude; glycerol waters and glycerol lyes."
  },
  {
    "HS4": "1521",
    "HS4 Short Name": "Waxes",
    "HS4 Description": "Vegetable waxes (other than triglycerides), beeswax, other insect waxes and spermaceti, whether or not refined or coloured."
  },
  {
    "HS4": "1522",
    "HS4 Short Name": "Fat and Oil Residues",
    "HS4 Description": "Degras; residues resulting from the treatment of fatty substances or animal or vegetable waxes."
  },
  {
    "HS4": "1601",
    "HS4 Short Name": "Sausages",
    "HS4 Description": "Sausages and similar products, of meat, meat offal or blood; food preparations based on these products."
  },
  {
    "HS4": "1602",
    "HS4 Short Name": "Other Prepared Meat",
    "HS4 Description": "Other prepared or preserved meat, meat offal or blood."
  },
  {
    "HS4": "1603",
    "HS4 Short Name": "Animal Extracts",
    "HS4 Description": "Extracts and juices of meat, fish or crustaceans, molluscs or other aquatic invertebrates."
  },
  {
    "HS4": "1604",
    "HS4 Short Name": "Processed Fish",
    "HS4 Description": "Prepared or preserved fish; caviar and caviar substitutes prepared from fish eggs."
  },
  {
    "HS4": "1605",
    "HS4 Short Name": "Processed Crustaceans",
    "HS4 Description": "Crustaceans, molluscs and other aquatic invertebrates, prepared or preserved."
  },
  {
    "HS4": "1701",
    "HS4 Short Name": "Raw Sugar",
    "HS4 Description": "Cane or beet sugar and chemically pure sucrose, in solid form."
  },
  {
    "HS4": "1702",
    "HS4 Short Name": "Other Sugars",
    "HS4 Description": "Other sugars, including chemically pure lactose, maltose, glucose and fructose, in solid form; sugar syrups not containing added flavouring or colouring matter; artificial honey, whether or not mixed with natural honey; caramel."
  },
  {
    "HS4": "1703",
    "HS4 Short Name": "Molasses",
    "HS4 Description": "Molasses resulting from the extraction or refining of sugar."
  },
  {
    "HS4": "1704",
    "HS4 Short Name": "Confectionery Sugar",
    "HS4 Description": "Sugar confectionery (including white chocolate), not containing cocoa."
  },
  {
    "HS4": "1801",
    "HS4 Short Name": "Cocoa Beans",
    "HS4 Description": "Cocoa beans, whole or broken, raw or roasted."
  },
  {
    "HS4": "1802",
    "HS4 Short Name": "Cocoa Shells",
    "HS4 Description": "Cocoa shells, husks, skins and other cocoa waste."
  },
  {
    "HS4": "1803",
    "HS4 Short Name": "Cocoa Paste",
    "HS4 Description": "Cocoa paste, whether or not defatted."
  },
  {
    "HS4": "1804",
    "HS4 Short Name": "Cocoa Butter",
    "HS4 Description": "Cocoa butter, fat and oil."
  },
  {
    "HS4": "1805",
    "HS4 Short Name": "Cocoa Powder",
    "HS4 Description": "Cocoa powder, not containing added sugar or other sweetening matter."
  },
  {
    "HS4": "1806",
    "HS4 Short Name": "Chocolate",
    "HS4 Description": "Chocolate and other food preparations containing cocoa."
  },
  {
    "HS4": "1901",
    "HS4 Short Name": "Malt Extract",
    "HS4 Description": "Malt extract; food preparations of flour, groats, meal, starch or malt extract, not containing cocoa or containing less than 40 % by weight of cocoa calculated on a totally defatted basis, not elsewhere specified or included; food preparations of goods of"
  },
  {
    "HS4": "1902",
    "HS4 Short Name": "Pasta",
    "HS4 Description": "Pasta, whether or not cooked or stuffed (with meat or other substances) or otherwise prepared, such as spaghetti, macaroni, noodles, lasagne, gnocchi, ravioli, cannelloni; couscous, whether or not prepared."
  },
  {
    "HS4": "1903",
    "HS4 Short Name": "Tapioca",
    "HS4 Description": "Tapioca and substitutes therefor prepared from starch, in the form of flakes, grains, pearls, siftings or in similar forms."
  },
  {
    "HS4": "1904",
    "HS4 Short Name": "Prepared Cereals",
    "HS4 Description": "Prepared foods obtained by the swelling or roasting of cereals or cereal products (for example, corn flakes); cereals (other than maize (corn)) in grain form or in the form of flakes or other worked grains (except flour, groats and meal), pre-cooked, or o"
  },
  {
    "HS4": "1905",
    "HS4 Short Name": "Baked Goods",
    "HS4 Description": "Bread, pastry, cakes, biscuits and other bakers' wares, whether or not containing cocoa; communion wafers, empty cachets of a kind suitable for pharmaceutical use, sealing wafers, rice paper and similar products."
  },
  {
    "HS4": "2001",
    "HS4 Short Name": "Pickled Foods",
    "HS4 Description": "Vegetables, fruit, nuts and other edible parts of plants, prepared or preserved by vinegar or acetic acid."
  },
  {
    "HS4": "2002",
    "HS4 Short Name": "Processed Tomatoes",
    "HS4 Description": "Tomatoes prepared or preserved otherwise than by vinegar or acetic acid."
  },
  {
    "HS4": "2003",
    "HS4 Short Name": "Processed Mushrooms",
    "HS4 Description": "Mushrooms and truffles, prepared or preserved otherwise than by vinegar or acetic acid."
  },
  {
    "HS4": "2004",
    "HS4 Short Name": "Other Frozen Vegetables",
    "HS4 Description": "Other vegetables prepared or preserved otherwise than by vinegar or acetic acid, frozen, other than products of heading 20.06."
  },
  {
    "HS4": "2005",
    "HS4 Short Name": "Other Processed Vegetables",
    "HS4 Description": "Other vegetables prepared or preserved otherwise than by vinegar or acetic acid, not frozen, other than products of heading 20.06."
  },
  {
    "HS4": "2006",
    "HS4 Short Name": "Sugar Preserved Foods",
    "HS4 Description": "Vegetables, fruit, nuts, fruit-peel and other parts of plants, preserved by sugar (drained, glacé or crystallised)."
  },
  {
    "HS4": "2007",
    "HS4 Short Name": "Jams",
    "HS4 Description": "Jams, fruit jellies, marmalades, fruit or nut purée and fruit or nut pastes, obtained by cooking, whether or not containing added sugar or other sweetening matter."
  },
  {
    "HS4": "2008",
    "HS4 Short Name": "Other Processed Fruits and Nuts",
    "HS4 Description": "Fruit, nuts and other edible parts of plants, otherwise prepared or preserved, whether or not containing added sugar or other sweetening matter or spirit, not elsewhere specified or included."
  },
  {
    "HS4": "2009",
    "HS4 Short Name": "Fruit Juice",
    "HS4 Description": "Fruit juices (including grape must) and vegetable juices, unfermented and not containing added spirit, whether or not containing added sugar or other sweetening matter."
  },
  {
    "HS4": "2101",
    "HS4 Short Name": "Coffee and Tea Extracts",
    "HS4 Description": "Extracts, essences and concentrates, of coffee, tea or maté and preparations with a basis of these products or with a basis of coffee, tea or maté; roasted chicory and other roasted coffee substitutes, and extracts, essences and concentrates thereof."
  },
  {
    "HS4": "2102",
    "HS4 Short Name": "Yeast",
    "HS4 Description": "Yeasts (active or inactive); other single-cell micro-organisms, dead (but not including vaccines of heading 30.02); prepared baking powders."
  },
  {
    "HS4": "2103",
    "HS4 Short Name": "Sauces and Seasonings",
    "HS4 Description": "Sauces and preparations therefor; mixed condiments and mixed seasonings; mustard flour and meal and prepared mustard."
  },
  {
    "HS4": "2104",
    "HS4 Short Name": "Soups and Broths",
    "HS4 Description": "Soups and broths and preparations therefor; homogenised composite food preparations."
  },
  {
    "HS4": "2105",
    "HS4 Short Name": "Ice Cream",
    "HS4 Description": "Ice cream and other edible ice, whether or not containing cocoa."
  },
  {
    "HS4": "2106",
    "HS4 Short Name": "Other Edible Preparations",
    "HS4 Description": "Food preparations not elsewhere specified or included."
  },
  {
    "HS4": "2201",
    "HS4 Short Name": "Water",
    "HS4 Description": "Waters, including natural or artificial mineral waters and aerated waters, not containing added sugar or other sweetening matter nor flavoured; ice and snow."
  },
  {
    "HS4": "2202",
    "HS4 Short Name": "Flavored Water",
    "HS4 Description": "Waters, including mineral waters and aerated waters, containing added sugar or other sweetening matter or flavoured, and other non-alcoholic beverages, not including fruit or vegetable juices of heading 20.09."
  },
  {
    "HS4": "2203",
    "HS4 Short Name": "Beer",
    "HS4 Description": "Beer made from malt."
  },
  {
    "HS4": "2204",
    "HS4 Short Name": "Wine",
    "HS4 Description": "Wine of fresh grapes, including fortified wines; grape must other than that of heading 20.09."
  },
  {
    "HS4": "2205",
    "HS4 Short Name": "Vermouth",
    "HS4 Description": "Vermouth and other wine of fresh grapes flavoured with plants or aromatic substances."
  },
  {
    "HS4": "2206",
    "HS4 Short Name": "Other Fermented Beverages",
    "HS4 Description": "Other fermented beverages (for example, cider, perry, mead); mixtures of fermented beverages and mixtures of fermented beverages and non-alcoholic beverages, not elsewhere specified or included."
  },
  {
    "HS4": "2207",
    "HS4 Short Name": "Alcohol > 80% ABV",
    "HS4 Description": "Undenatured ethyl alcohol of an alcoholic strength by volume of 80 % vol. or higher; ethyl alcohol and other spirits, denatured, of any strength."
  },
  {
    "HS4": "2208",
    "HS4 Short Name": "Hard Liquor",
    "HS4 Description": "Undenatured ethyl alcohol of an alcoholic strength by volume of less than 80 % vol.; spirits, liqueurs and other spirituous beverages."
  },
  {
    "HS4": "2209",
    "HS4 Short Name": "Vinegar",
    "HS4 Description": "Vinegar and substitutes for vinegar obtained from acetic acid."
  },
  {
    "HS4": "2301",
    "HS4 Short Name": "Animal Meal and Pellets",
    "HS4 Description": "Flours, meals and pellets, of meat or meat offal, of fish or of crustaceans, molluscs or other aquatic invertebrates, unfit for human consumption; greaves."
  },
  {
    "HS4": "2302",
    "HS4 Short Name": "Bran",
    "HS4 Description": "Bran, sharps and other residues, whether or not in the form of pellets, derived from the sifting, milling or other working of cereals or of leguminous plants."
  },
  {
    "HS4": "2303",
    "HS4 Short Name": "Starch Residue",
    "HS4 Description": "Residues of starch manufacture and similar residues, beet-pulp, bagasse and other waste of sugar manufacture, brewing or distilling dregs and waste, whether or not in the form of pellets."
  },
  {
    "HS4": "2304",
    "HS4 Short Name": "Soybean Meal",
    "HS4 Description": "Oil-cake and other solid residues, whether or not ground or in the form of pellets, resulting from the extraction of soyabean oil."
  },
  {
    "HS4": "2305",
    "HS4 Short Name": "Ground Nut Meal",
    "HS4 Description": "Oil-cake and other solid residues, whether or not ground or in the form of pellets, resulting from the extraction of ground-nut oil."
  },
  {
    "HS4": "2306",
    "HS4 Short Name": "Other Vegetable Residues",
    "HS4 Description": "Oil-cake and other solid residues, whether or not ground or in the form of pellets, resulting from the extraction of vegetable fats or oils, other than those of heading 23.04 or 23.05."
  },
  {
    "HS4": "2307",
    "HS4 Short Name": "Wine Lees",
    "HS4 Description": "Wine lees; argol."
  },
  {
    "HS4": "2308",
    "HS4 Short Name": "Other Vegetable Residues and Waste",
    "HS4 Description": "Vegetable materials and vegetable waste, vegetable residues and by-products, whether or not in the form of pellets, of a kind used in animal feeding, not elsewhere specified or included."
  },
  {
    "HS4": "2309",
    "HS4 Short Name": "Animal Food",
    "HS4 Description": "Preparations of a kind used in animal feeding."
  },
  {
    "HS4": "2401",
    "HS4 Short Name": "Raw Tobacco",
    "HS4 Description": "Unmanufactured tobacco; tobacco refuse."
  },
  {
    "HS4": "2402",
    "HS4 Short Name": "Rolled Tobacco",
    "HS4 Description": "Cigars, cheroots, cigarillos and cigarettes, of tobacco or of tobacco substitutes."
  },
  {
    "HS4": "2403",
    "HS4 Short Name": "Processed Tobacco",
    "HS4 Description": "Other manufactured tobacco and manufactured tobacco substitutes; “homogenised” or “reconstituted” tobacco; tobacco extracts and essences."
  },
  {
    "HS4": "2404",
    "HS4 Short Name": "Products intended for oral application of nicotine into the human body,",
    "HS4 Description": "Products intended for the intake of nicotine into the human body, for oral application"
  },
  {
    "HS4": "2501",
    "HS4 Short Name": "Salt",
    "HS4 Description": "Salt (including table salt and denatured salt) and pure sodium chloride, whether or not in aqueous solution or containing added anti-caking or free-flowing agents; sea water."
  },
  {
    "HS4": "2502",
    "HS4 Short Name": "Iron Pyrites",
    "HS4 Description": "Unroasted iron pyrites."
  },
  {
    "HS4": "2503",
    "HS4 Short Name": "Sulphur",
    "HS4 Description": "Sulphur of all kinds, other than sublimed sulphur, precipitated sulphur and colloidal sulphur."
  },
  {
    "HS4": "2504",
    "HS4 Short Name": "Graphite",
    "HS4 Description": "Natural graphite."
  },
  {
    "HS4": "2505",
    "HS4 Short Name": "Sand",
    "HS4 Description": "Natural sands of all kinds, whether or not coloured, other than metalbearing sands of Chapter 26."
  },
  {
    "HS4": "2506",
    "HS4 Short Name": "Quartz",
    "HS4 Description": "Quartz (other than natural sands); quartzite, whether or not roughly trimmed or merely cut, by sawing or otherwise, into blocks or slabs of a rectangular (including square) shape."
  },
  {
    "HS4": "2507",
    "HS4 Short Name": "Kaolin",
    "HS4 Description": "Kaolin and other kaolinic clays, whether or not calcined."
  },
  {
    "HS4": "2508",
    "HS4 Short Name": "Clays",
    "HS4 Description": "Other clays (not including expanded clays of heading 68.06), andalusite, kyanite and sillimanite, whether or not calcined; mullite; chamotte or dinas earths."
  },
  {
    "HS4": "2509",
    "HS4 Short Name": "Chalk",
    "HS4 Description": "Chalk."
  },
  {
    "HS4": "2510",
    "HS4 Short Name": "Calcium Phosphates",
    "HS4 Description": "Natural calcium phosphates, natural aluminium calcium phosphates and phosphatic chalk."
  },
  {
    "HS4": "2511",
    "HS4 Short Name": "Barium Sulphate",
    "HS4 Description": "Natural barium sulphate (barytes); natural barium carbonate (witherite), whether or not calcined, other than barium oxide of heading 28.16."
  },
  {
    "HS4": "2512",
    "HS4 Short Name": "Siliceous Fossil Meals",
    "HS4 Description": "Siliceous fossil meals (for example, kieselguhr, tripolite and diatomite) and similar siliceous earths, whether or not calcined, of an apparent specific gravity of 1 or less."
  },
  {
    "HS4": "2513",
    "HS4 Short Name": "Pumice",
    "HS4 Description": "Pumice stone; emery; natural corundum, natural garnet and other natural abrasives, whether or not heat-treated."
  },
  {
    "HS4": "2514",
    "HS4 Short Name": "Slate",
    "HS4 Description": "Slate, whether or not roughly trimmed or merely cut, by sawing or otherwise, into blocks or slabs of a rectangular (including square) shape."
  },
  {
    "HS4": "2515",
    "HS4 Short Name": "Marble, Travertine and Alabaster",
    "HS4 Description": "Marble, travertine, ecaussine and other calcareous monumental or building stone of an apparent specific gravity of 2.5 or more, and alabaster, whether or not roughly trimmed or merely cut, by sawing or otherwise, into blocks or slabs of a rectangular (inc"
  },
  {
    "HS4": "2516",
    "HS4 Short Name": "Granite",
    "HS4 Description": "Granite, porphyry, basalt, sandstone and other monumental or building stone, whether or not roughly trimmed or merely cut, by sawing or otherwise, into blocks or slabs of a rectangular (including square) shape."
  },
  {
    "HS4": "2517",
    "HS4 Short Name": "Gravel and Crushed Stone",
    "HS4 Description": "Pebbles, gravel, broken or crushed stone, of a kind commonly used for concrete aggregates, for road metalling or for railway or other ballast, shingle and flint, whether or not heat-treated; macadam of slag, dross or similar industrial waste, whether or n"
  },
  {
    "HS4": "2518",
    "HS4 Short Name": "Dolomite",
    "HS4 Description": "Dolomite, whether or not calcined or sintered, including dolomite roughly trimmed or merely cut, by sawing or otherwise, into blocks or slabs of a rectangular (including square) shape; dolomite ramming mix."
  },
  {
    "HS4": "2519",
    "HS4 Short Name": "Magnesium Carbonate",
    "HS4 Description": "Natural magnesium carbonate (magnesite); fused magnesia; dead-burned (sintered) magnesia, whether or not containing small quantities of other oxides added before sintering; other magnesium oxide, whether or not pure."
  },
  {
    "HS4": "2520",
    "HS4 Short Name": "Gypsum",
    "HS4 Description": "Gypsum; anhydrite; plasters (consisting of calcined gypsum or calcium sulphate) whether or not coloured, with or without small quantities of accelerators or retarders."
  },
  {
    "HS4": "2521",
    "HS4 Short Name": "Limestone",
    "HS4 Description": "Limestone flux; limestone and other calcareous stone, of a kind used for the manufacture of lime or cement."
  },
  {
    "HS4": "2522",
    "HS4 Short Name": "Quicklime",
    "HS4 Description": "Quicklime, slaked lime and hydraulic lime, other than calcium oxide and hydroxide of heading 28.25."
  },
  {
    "HS4": "2523",
    "HS4 Short Name": "Cement",
    "HS4 Description": "Portland cement, aluminous cement, slag cement, supersulphate cement and similar hydraulic cements, whether or not coloured or in the form of clinkers."
  },
  {
    "HS4": "2524",
    "HS4 Short Name": "Asbestos",
    "HS4 Description": "Asbestos."
  },
  {
    "HS4": "2525",
    "HS4 Short Name": "Mica",
    "HS4 Description": "Mica, including spliiting; mica waste."
  },
  {
    "HS4": "2526",
    "HS4 Short Name": "Soapstone",
    "HS4 Description": "Natural steatite, whether or not roughly trimmed or merely cut, by sawing or otherwise, into blocks or slabs of a rectangular (including square) shape; talc."
  },
  {
    "HS4": "2527",
    "HS4 Short Name": "Cryolite",
    "HS4 Description": "(-2001) Natural cryolite and natural chiolite"
  },
  {
    "HS4": "2528",
    "HS4 Short Name": "Borax",
    "HS4 Description": "Natural borates and concentrates thereof (whether or not calcined), but not including borates separated from natural brine; natural boric acid containing not more than 85 % of H3BO3 calculated on the dry weight."
  },
  {
    "HS4": "2529",
    "HS4 Short Name": "Feldspar",
    "HS4 Description": "Feldspar; leucite, nepheline and nepheline syenite; fluorspar."
  },
  {
    "HS4": "2530",
    "HS4 Short Name": "Other Mineral",
    "HS4 Description": "Mineral substances not elsewhere specified or included."
  },
  {
    "HS4": "2601",
    "HS4 Short Name": "Iron Ore",
    "HS4 Description": "Iron ores and concentrates, including roasted iron pyrites."
  },
  {
    "HS4": "2602",
    "HS4 Short Name": "Manganese Ore",
    "HS4 Description": "Manganese ores and concentrates, including ferruginous manganese ores and concentrates with a manganese content of 20 % or more, calculated on the dry weight."
  },
  {
    "HS4": "2603",
    "HS4 Short Name": "Copper Ore",
    "HS4 Description": "Copper ores and concentrates."
  },
  {
    "HS4": "2604",
    "HS4 Short Name": "Nickel Ore",
    "HS4 Description": "Nickel ores and concentrates."
  },
  {
    "HS4": "2605",
    "HS4 Short Name": "Cobalt Ore",
    "HS4 Description": "Cobalt ores and concentrates."
  },
  {
    "HS4": "2606",
    "HS4 Short Name": "Aluminium Ore",
    "HS4 Description": "Aluminium ores and concentrates."
  },
  {
    "HS4": "2607",
    "HS4 Short Name": "Lead Ore",
    "HS4 Description": "Lead ores and concentrates."
  },
  {
    "HS4": "2608",
    "HS4 Short Name": "Zinc Ore",
    "HS4 Description": "Zinc ores and concentrates."
  },
  {
    "HS4": "2609",
    "HS4 Short Name": "Tin Ores",
    "HS4 Description": "Tin ores and concentrates."
  },
  {
    "HS4": "2610",
    "HS4 Short Name": "Chromium Ore",
    "HS4 Description": "Chromium ores and concentrates."
  },
  {
    "HS4": "2611",
    "HS4 Short Name": "Tungsten Ore",
    "HS4 Description": "Tungsten ores and concentrates."
  },
  {
    "HS4": "2612",
    "HS4 Short Name": "Uranium and Thorium Ore",
    "HS4 Description": "Uranium or thorium ores and concentrates."
  },
  {
    "HS4": "2613",
    "HS4 Short Name": "Molybdenum Ore",
    "HS4 Description": "Molybdenum ores and concentrates."
  },
  {
    "HS4": "2614",
    "HS4 Short Name": "Titanium Ore",
    "HS4 Description": "Titanium ores and concentrates."
  },
  {
    "HS4": "2615",
    "HS4 Short Name": "Niobium, Tantalum, Vanadium and Zirconium Ore",
    "HS4 Description": "Niobium, tantalum, vanadium or zirconium ores and concentrates."
  },
  {
    "HS4": "2616",
    "HS4 Short Name": "Precious Metal Ore",
    "HS4 Description": "Precious metal ores and concentrates."
  },
  {
    "HS4": "2617",
    "HS4 Short Name": "Other Ores",
    "HS4 Description": "Other ores and concentrates."
  },
  {
    "HS4": "2618",
    "HS4 Short Name": "Granulated Slag",
    "HS4 Description": "Granulated slag (slag sand) from the manufacture of iron or steel."
  },
  {
    "HS4": "2619",
    "HS4 Short Name": "Slag Dross",
    "HS4 Description": "Slag, dross (other than granulated slag), scalings and other waste from the manufacture of iron or steel."
  },
  {
    "HS4": "2620",
    "HS4 Short Name": "Non-Iron and Steel Slag, Ash and Residues",
    "HS4 Description": "Slag, ash and residues (other than from the manufacture of iron or steel) containing metals, arsenic or their compounds."
  },
  {
    "HS4": "2621",
    "HS4 Short Name": "Other Slag and Ash",
    "HS4 Description": "Other slag and ash, including seaweed ash (kelp); ash and residues from the incineration of municipal waste."
  },
  {
    "HS4": "2701",
    "HS4 Short Name": "Coal Briquettes",
    "HS4 Description": "Coal; briquettes, ovoids and similar solid fuels manufactured from coal."
  },
  {
    "HS4": "2702",
    "HS4 Short Name": "Lignite",
    "HS4 Description": "Lignite, whether or not agglomerated, excluding jet."
  },
  {
    "HS4": "2703",
    "HS4 Short Name": "Peat",
    "HS4 Description": "Peat (including peat litter), whether or not agglomerated."
  },
  {
    "HS4": "2704",
    "HS4 Short Name": "Coke",
    "HS4 Description": "Coke and semi-coke of coal, of lignite or of peat, whether or not agglomerated; retort carbon."
  },
  {
    "HS4": "2705",
    "HS4 Short Name": "Non-Petroleum Gas",
    "HS4 Description": "Coal gas, water gas, producer gas and similar gases, other than petroleum gases and other gaseous hydrocarbons."
  },
  {
    "HS4": "2706",
    "HS4 Short Name": "Tar",
    "HS4 Description": "Tar distilled from coal, from lignite or from peat, and other mineral tars, whether or not dehydrated or partially distilled, including reconstituted tars."
  },
  {
    "HS4": "2707",
    "HS4 Short Name": "Coal Tar Oil",
    "HS4 Description": "Oils and other products of the distillation of high temperature coal tar; similar products in which the weight of the aromatic constituents exceeds that of the non-aromatic constituents."
  },
  {
    "HS4": "2708",
    "HS4 Short Name": "Pitch Coke",
    "HS4 Description": "Pitch and pitch coke, obtained from coal tar or from other mineral tars."
  },
  {
    "HS4": "2709",
    "HS4 Short Name": "Crude Petroleum",
    "HS4 Description": "Petroleum oils and oils obtained from bituminous minerals, crude."
  },
  {
    "HS4": "2710",
    "HS4 Short Name": "Refined Petroleum",
    "HS4 Description": "Petroleum oils and oils obtained from bituminous minerals, other than crude; preparations not elsewhere specified or included, containing by weight 70 % or more of petroleum oils or of oils obtained from bituminous minerals, these oils being the basic con"
  },
  {
    "HS4": "2711",
    "HS4 Short Name": "Petroleum Gas",
    "HS4 Description": "Petroleum gases and other gaseous hydrocarbons."
  },
  {
    "HS4": "2712",
    "HS4 Short Name": "Petroleum Jelly",
    "HS4 Description": "Petroleum jelly; paraffin wax, micro-crystalline petroleum wax, slack wax, ozokerite, lignite wax, peat wax, other mineral waxes, and similar products obtained by synthesis or by other processes, whether or not coloured."
  },
  {
    "HS4": "2713",
    "HS4 Short Name": "Petroleum Coke",
    "HS4 Description": "Petroleum coke, petroleum bitumen and other residues of petroleum oils or of oils obtained from bituminous minerals."
  },
  {
    "HS4": "2714",
    "HS4 Short Name": "Asphalt",
    "HS4 Description": "Bitumen and asphalt, natural; bituminous or oil shale and tar sands; asphaltites and asphaltic rocks."
  },
  {
    "HS4": "2715",
    "HS4 Short Name": "Asphalt Mixtures",
    "HS4 Description": "Bituminous mixtures based on natural asphalt, on natural bitumen, on petroleum bitumen, on mineral tar or on mineral tar pitch (for example, bituminous mastics, cut-backs)."
  },
  {
    "HS4": "2716",
    "HS4 Short Name": "Electricity",
    "HS4 Description": "Electrical energy. (optional heading)"
  },
  {
    "HS4": "2801",
    "HS4 Short Name": "Halogens",
    "HS4 Description": "Fluorine, chlorine, bromine and iodine."
  },
  {
    "HS4": "2802",
    "HS4 Short Name": "Sulfur",
    "HS4 Description": "Sulphur, sublimed or precipitated; colloidal sulphur."
  },
  {
    "HS4": "2803",
    "HS4 Short Name": "Carbon",
    "HS4 Description": "Carbon (carbon blacks and other forms of carbon not elsewhere specified or included)."
  },
  {
    "HS4": "2804",
    "HS4 Short Name": "Hydrogen",
    "HS4 Description": "Hydrogen, rare gases and other non-metals."
  },
  {
    "HS4": "2805",
    "HS4 Short Name": "Alkaline Metals",
    "HS4 Description": "Alkali or alkaline-earth metals; rare-earth metals, scandium and yttrium, whether or not intermixed or interalloyed; mercury."
  },
  {
    "HS4": "2806",
    "HS4 Short Name": "Hydrochloric Acid",
    "HS4 Description": "Hydrogen chloride (hydrochloric acid); chlorosulphuric acid."
  },
  {
    "HS4": "2807",
    "HS4 Short Name": "Sulfuric Acid",
    "HS4 Description": "Sulphuric acid; oleum."
  },
  {
    "HS4": "2808",
    "HS4 Short Name": "Nitric Acids",
    "HS4 Description": "Nitric acid; sulphonitric acids."
  },
  {
    "HS4": "2809",
    "HS4 Short Name": "Phosphoric Acid",
    "HS4 Description": "Diphosphorus pentaoxide; phosphoric acid; polyphosphoric acids, whether or not chemically defined."
  },
  {
    "HS4": "2810",
    "HS4 Short Name": "Boron",
    "HS4 Description": "Oxides of boron; boric acids."
  },
  {
    "HS4": "2811",
    "HS4 Short Name": "Other Inorganic Acids",
    "HS4 Description": "Other inorganic acids and other inorganic oxygen compounds of non-metals."
  },
  {
    "HS4": "2812",
    "HS4 Short Name": "Halides",
    "HS4 Description": "Halides and halide oxides of non-metals."
  },
  {
    "HS4": "2813",
    "HS4 Short Name": "Nonmetal Sulfides",
    "HS4 Description": "Sulphides of non-metals; commercial phosphorus trisulphide."
  },
  {
    "HS4": "2814",
    "HS4 Short Name": "Ammonia",
    "HS4 Description": "Ammonia, anhydrous or in aqueous solution."
  },
  {
    "HS4": "2815",
    "HS4 Short Name": "Sodium or Potassium Peroxides",
    "HS4 Description": "Sodium hydroxide (caustic soda); potassium hydroxide (caustic potash); peroxides of sodium or potassium."
  },
  {
    "HS4": "2816",
    "HS4 Short Name": "Magnesium Hydroxide and Peroxide",
    "HS4 Description": "Hydroxide and peroxide of magnesium; oxides, hydroxides and peroxides, of strontium or barium."
  },
  {
    "HS4": "2817",
    "HS4 Short Name": "Zinc Oxide and Peroxide",
    "HS4 Description": "Zinc oxide; zinc peroxide."
  },
  {
    "HS4": "2818",
    "HS4 Short Name": "Aluminium Oxide",
    "HS4 Description": "Artificial corundum, whether or not chemically defined; aluminium oxide; aluminium hydroxide."
  },
  {
    "HS4": "2819",
    "HS4 Short Name": "Chromium Oxides and Hydroxides",
    "HS4 Description": "Chromium oxides and hydroxides."
  },
  {
    "HS4": "2820",
    "HS4 Short Name": "Manganese Oxides",
    "HS4 Description": "Manganese oxides."
  },
  {
    "HS4": "2821",
    "HS4 Short Name": "Iron Oxides and Hydroxides",
    "HS4 Description": "Iron oxides and hydroxides; earth colours containing 70 % or more by weight of combined iron evaluated as Fe2O3."
  },
  {
    "HS4": "2822",
    "HS4 Short Name": "Cobalt Oxides and Hydroxides",
    "HS4 Description": "Cobalt oxides and hydroxides; commercial cobalt oxides."
  },
  {
    "HS4": "2823",
    "HS4 Short Name": "Titanium Oxides",
    "HS4 Description": "Titanium oxides."
  },
  {
    "HS4": "2824",
    "HS4 Short Name": "Lead Oxides",
    "HS4 Description": "Lead oxides; red lead and orange lead."
  },
  {
    "HS4": "2825",
    "HS4 Short Name": "Inorganic Salts",
    "HS4 Description": "Hydrazine and hydroxylamine and their inorganic salts; other inorganic bases; other metal oxides, hydroxides and peroxides."
  },
  {
    "HS4": "2826",
    "HS4 Short Name": "Fluorides",
    "HS4 Description": "Fluorides; fluorosilicates, fluoroaluminates and other complex fluorine salts."
  },
  {
    "HS4": "2827",
    "HS4 Short Name": "Chlorides",
    "HS4 Description": "Chlorides, chloride oxides and chloride hydroxides; bromides and bromide oxides; iodides and iodide oxides."
  },
  {
    "HS4": "2828",
    "HS4 Short Name": "Hypochlorites",
    "HS4 Description": "Hypochlorites; commercial calcium hypochlorite; chlorites; hypobromites."
  },
  {
    "HS4": "2829",
    "HS4 Short Name": "Chlorates and Perchlorates",
    "HS4 Description": "Chlorates and perchlorates; bromates and perbromates; iodates and periodates."
  },
  {
    "HS4": "2830",
    "HS4 Short Name": "Sulfides",
    "HS4 Description": "Sulphides; polysulphides, whether or not chemically defined."
  },
  {
    "HS4": "2831",
    "HS4 Short Name": "Dithionites and Sulfoxylates",
    "HS4 Description": "Dithionites and sulphoxylates."
  },
  {
    "HS4": "2832",
    "HS4 Short Name": "Sulfites",
    "HS4 Description": "Sulphites; thiosulphates."
  },
  {
    "HS4": "2833",
    "HS4 Short Name": "Sulfates",
    "HS4 Description": "Sulphates; alums; peroxosulphates (persulphates)."
  },
  {
    "HS4": "2834",
    "HS4 Short Name": "Nitrites and Nitrates",
    "HS4 Description": "Nitrites; nitrates."
  },
  {
    "HS4": "2835",
    "HS4 Short Name": "Phosphinates and Phosphonates",
    "HS4 Description": "Phosphinates (hypophosphites), phosphonates (phosphites) and phosphates; polyphosphates, whether or not chemically defined."
  },
  {
    "HS4": "2836",
    "HS4 Short Name": "Carbonates",
    "HS4 Description": "Carbonates; peroxocarbonates (percarbonates); commercial ammonium carbonate containing ammonium carbamate."
  },
  {
    "HS4": "2837",
    "HS4 Short Name": "Cyanides",
    "HS4 Description": "Cyanides, cyanide oxides and complex cyanides."
  },
  {
    "HS4": "2838",
    "HS4 Short Name": "Fulminates",
    "HS4 Description": "(-2006) Fulminates, cyanates and thiocyanates"
  },
  {
    "HS4": "2839",
    "HS4 Short Name": "Silicates",
    "HS4 Description": "Silicates; commercial alkali metal silicates."
  },
  {
    "HS4": "2840",
    "HS4 Short Name": "Borates",
    "HS4 Description": "Borates; peroxoborates (perborates)."
  },
  {
    "HS4": "2841",
    "HS4 Short Name": "Oxometallic or Peroxometallic Acid Salts",
    "HS4 Description": "Salts of oxometallic or peroxometallic acids."
  },
  {
    "HS4": "2842",
    "HS4 Short Name": "Other Inorganic Acids Salts",
    "HS4 Description": "Other salts of inorganic acids or peroxoacids (including aluminosilicates whether or not chemically defined), other than azides."
  },
  {
    "HS4": "2843",
    "HS4 Short Name": "Precious Metal Compounds",
    "HS4 Description": "Colloidal precious metals; inorganic or organic compounds of precious metals, whether or not chemically defined; amalgams of precious metals."
  },
  {
    "HS4": "2844",
    "HS4 Short Name": "Radioactive Chemicals",
    "HS4 Description": "Radioactive chemical elements and radioactive isotopes (including the fissile or fertile chemical elements and isotopes) and their compounds; mixtures and residues containing these products."
  },
  {
    "HS4": "2845",
    "HS4 Short Name": "Other Isotopes",
    "HS4 Description": "Isotopes other than those of heading 28.44; compounds, inorganic or organic, of such isotopes, whether or not chemically defined."
  },
  {
    "HS4": "2846",
    "HS4 Short Name": "Rare-Earth Metal Compounds",
    "HS4 Description": "Compounds, inorganic or organic, of rare-earth metals, of yttrium or of scandium or of mixtures of these metals."
  },
  {
    "HS4": "2847",
    "HS4 Short Name": "Hydrogen peroxide",
    "HS4 Description": "Hydrogen peroxide, whether or not solidified with urea."
  },
  {
    "HS4": "2848",
    "HS4 Short Name": "Phosphides",
    "HS4 Description": "Phosphides, whether or not chemically defined, excluding ferrophosphorus."
  },
  {
    "HS4": "2849",
    "HS4 Short Name": "Carbides",
    "HS4 Description": "Carbides, whether or not chemically defined."
  },
  {
    "HS4": "2850",
    "HS4 Short Name": "Hydrides and other anions",
    "HS4 Description": "Hydrides, nitrides, azides, silicides and borides, whether or not chemically defined, other than compounds which are also carbides of heading 28.49."
  },
  {
    "HS4": "2851",
    "HS4 Short Name": "Inorganic Compounds",
    "HS4 Description": "(-2006) Inorganic compounds, incl. distilled or conductivity water and water of similar purity, n.e.s.; liquid air, whether or not rare gases have been removed; compressed air; amalgams (other than amalgams of precious metals)"
  },
  {
    "HS4": "2852",
    "HS4 Short Name": "Mercury compounds",
    "HS4 Description": "Inorganic or organic compounds of mercury, whether or not chemically defined, excluding amalgams."
  },
  {
    "HS4": "2853",
    "HS4 Short Name": "Other inorganic compounds",
    "HS4 Description": "Other inorganic compounds (including distilled or conductivity water and water of similar purity); liquid air (whether or not rare gases have been removed); compressed air; amalgams, other than amalgams of precious metals."
  },
  {
    "HS4": "2901",
    "HS4 Short Name": "Acyclic Hydrocarbons",
    "HS4 Description": "Acyclic hydrocarbons."
  },
  {
    "HS4": "2902",
    "HS4 Short Name": "Cyclic Hydrocarbons",
    "HS4 Description": "Cyclic hydrocarbons."
  },
  {
    "HS4": "2903",
    "HS4 Short Name": "Halogenated Hydrocarbons",
    "HS4 Description": "Halogenated derivatives of hydrocarbons."
  },
  {
    "HS4": "2904",
    "HS4 Short Name": "Sulfonated, Nitrated or Nitrosated Hydrocarbons",
    "HS4 Description": "Sulphonated, nitrated or nitrosated derivatives of hydrocarbons, whether or not halogenated."
  },
  {
    "HS4": "2905",
    "HS4 Short Name": "Acyclic Alcohols",
    "HS4 Description": "Acyclic alcohols and their halogenated, sulphonated, nitrated or nitrosated derivatives."
  },
  {
    "HS4": "2906",
    "HS4 Short Name": "Cyclic Alcohols",
    "HS4 Description": "Cyclic alcohols and their halogenated, sulphonated, nitrated or nitrosated derivatives."
  },
  {
    "HS4": "2907",
    "HS4 Short Name": "Phenols",
    "HS4 Description": "Phenols; phenol-alcohols."
  },
  {
    "HS4": "2908",
    "HS4 Short Name": "Phenol Derivatives",
    "HS4 Description": "Halogenated, sulphonated, nitrated or nitrosated derivatives of phenols or phenol-alcohols."
  },
  {
    "HS4": "2909",
    "HS4 Short Name": "Ethers",
    "HS4 Description": "Ethers, ether-alcohols, ether-phenols, ether-alcohol-phenols, alcohol peroxides, ether peroxides, ketone peroxides (whether or not chemically defined), and their halogenated, sulphonated, nitrated or nitrosated derivatives."
  },
  {
    "HS4": "2910",
    "HS4 Short Name": "Epoxides",
    "HS4 Description": "Epoxides, epoxyalcohols, epoxyphenols and epoxyethers, with a three-membered ring, and their halogenated, sulphonated, nitrated or nitrosated derivatives."
  },
  {
    "HS4": "2911",
    "HS4 Short Name": "Acetals and Hemiacetals",
    "HS4 Description": "Acetals and hemiacetals, whether or not with other oxygen function, and their halogenated, sulphonated, nitrated or nitrosated derivatives."
  },
  {
    "HS4": "2912",
    "HS4 Short Name": "Aldehydes",
    "HS4 Description": "Aldehydes, whether or not with other oxygen function; cyclic polymers of aldehydes; paraformaldehyde."
  },
  {
    "HS4": "2913",
    "HS4 Short Name": "Aldehyde Derivatives",
    "HS4 Description": "Halogenated, sulphonated, nitrated or nitrosated derivatives of products of heading 29.12."
  },
  {
    "HS4": "2914",
    "HS4 Short Name": "Ketones and Quinones",
    "HS4 Description": "Ketones and quinones, whether or not with other oxygen function, and their halogenated, sulphonated, nitrated or nitrosated derivatives."
  },
  {
    "HS4": "2915",
    "HS4 Short Name": "Saturated Acyclic Monocarboxylic Acids",
    "HS4 Description": "Saturated acyclic monocarboxylic acids and their anhydrides, halides, peroxides and peroxyacids; their halogenated, sulphonated, nitrated or nitrosated derivatives."
  },
  {
    "HS4": "2916",
    "HS4 Short Name": "Unsaturated Acyclic Monocarboxylic Acids",
    "HS4 Description": "Unsaturated acyclic monocarboxylic acids, cyclic monocarboxylic acids, their anhydrides, halides, peroxides and peroxyacids; their halogenated, sulphonated, nitrated or nitrosated derivatives."
  },
  {
    "HS4": "2917",
    "HS4 Short Name": "Polycarboxylic Acids",
    "HS4 Description": "Polycarboxylic acids, their anhydrides, halides, peroxides and peroxyacids; their halogenated, sulphonated, nitrated or nitrosated derivatives."
  },
  {
    "HS4": "2918",
    "HS4 Short Name": "Carboxylic Acid",
    "HS4 Description": "Carboxylic Acid, Added Oxygen & Anhy Etc, Hal Etc"
  },
  {
    "HS4": "2919",
    "HS4 Short Name": "Phosphoric Esters and Salts",
    "HS4 Description": "Phosphoric esters and their salts, including lactophosphates; their halogenated, sulphonated, nitrated or nitrosated derivatives."
  },
  {
    "HS4": "2920",
    "HS4 Short Name": "Other Esters",
    "HS4 Description": "Esters of other inorganic acids of non-metals (excluding esters of hydrogen halides) and their salts; their halogenated, sulphonated, nitrated or nitrosated derivatives."
  },
  {
    "HS4": "2921",
    "HS4 Short Name": "Amine Compounds",
    "HS4 Description": "Amine-function compounds."
  },
  {
    "HS4": "2922",
    "HS4 Short Name": "Oxygen Amino Compounds",
    "HS4 Description": "Oxygen-function amino-compounds."
  },
  {
    "HS4": "2923",
    "HS4 Short Name": "Quaternary Ammonium Salts and Hydroxides",
    "HS4 Description": "Quaternary ammonium salts and hydroxides; lecithins and other phosphoaminolipids, whether or not chemically defined."
  },
  {
    "HS4": "2924",
    "HS4 Short Name": "Carboxyamide Compounds",
    "HS4 Description": "Carboxyamide-function compounds; amide-function compounds of carbonic acid."
  },
  {
    "HS4": "2925",
    "HS4 Short Name": "Carboxyimide Compounds",
    "HS4 Description": "Carboxyimide-function compounds (including saccharin and its salts) and imine-function compounds."
  },
  {
    "HS4": "2926",
    "HS4 Short Name": "Nitrile Compounds",
    "HS4 Description": "Nitrile-function compounds."
  },
  {
    "HS4": "2927",
    "HS4 Short Name": "Diazo, Azo or Aoxy Compounds",
    "HS4 Description": "Diazo-, azoor azoxy-compounds."
  },
  {
    "HS4": "2928",
    "HS4 Short Name": "Hydrazine or Hydroxylamine Derivatives",
    "HS4 Description": "Organic derivatives of hydrazine or of hydroxylamine."
  },
  {
    "HS4": "2929",
    "HS4 Short Name": "Other Nitrogen Compounds",
    "HS4 Description": "Compounds with other nitrogen function."
  },
  {
    "HS4": "2930",
    "HS4 Short Name": "Organo-Sulfur Compounds",
    "HS4 Description": "Organo-sulphur compounds."
  },
  {
    "HS4": "2931",
    "HS4 Short Name": "Other Organo-Inorganic Compounds",
    "HS4 Description": "Other organo-inorganic compounds."
  },
  {
    "HS4": "2932",
    "HS4 Short Name": "Oxygen Heterocyclic Compounds",
    "HS4 Description": "Heterocyclic compounds with oxygen hetero-atom(s) only."
  },
  {
    "HS4": "2933",
    "HS4 Short Name": "Nitrogen Heterocyclic Compounds",
    "HS4 Description": "Heterocyclic compounds with nitrogen hetero-atom(s) only."
  },
  {
    "HS4": "2934",
    "HS4 Short Name": "Nucleic Acids",
    "HS4 Description": "Nucleic acids and their salts, whether or not chemically defined; other heterocyclic compounds."
  },
  {
    "HS4": "2935",
    "HS4 Short Name": "Sulfonamides",
    "HS4 Description": "Sulphonamides."
  },
  {
    "HS4": "2936",
    "HS4 Short Name": "Vitamins",
    "HS4 Description": "Provitamins and vitamins, natural or reproduced by synthesis (including natural concentrates), derivatives thereof used primarily as vitamins, and intermixtures of the foregoing, whether or not in any solvent."
  },
  {
    "HS4": "2937",
    "HS4 Short Name": "Hormones",
    "HS4 Description": "Hormones, prostaglandins, thromboxanes and leukotrienes, natural or reproduced by synthesis; derivatives and structural analogues thereof, including chain modified polypeptides, used primarily as hormones."
  },
  {
    "HS4": "2938",
    "HS4 Short Name": "Glycosides",
    "HS4 Description": "Glycosides, natural or reproduced by synthesis, and their salts, ethers, esters and other derivatives."
  },
  {
    "HS4": "2939",
    "HS4 Short Name": "Vegetable Alkaloids",
    "HS4 Description": "Vegetable alkaloids, natural or reproduced by synthesis, and their salts, ethers, esters and other derivatives."
  },
  {
    "HS4": "2940",
    "HS4 Short Name": "Chemically Pure Sugars",
    "HS4 Description": "Sugars, chemically pure, other than sucrose, lactose, maltose, glucose and fructose; sugar ethers, sugar acetals and sugar esters, and their salts, other than products of heading 29.37, 29.38 or 29.39."
  },
  {
    "HS4": "2941",
    "HS4 Short Name": "Antibiotics",
    "HS4 Description": "Antibiotics."
  },
  {
    "HS4": "2942",
    "HS4 Short Name": "Other Organic Compounds",
    "HS4 Description": "Other organic compounds."
  },
  {
    "HS4": "3001",
    "HS4 Short Name": "Glands and Other Organs",
    "HS4 Description": "Glands and other organs for organo-therapeutic uses, dried, whether or not powdered; extracts of glands or other organs or of their secretions for organo-therapeutic uses; heparin and its salts; other human or animal substances prepared for therapeutic or"
  },
  {
    "HS4": "3002",
    "HS4 Short Name": "Human or Animal Blood",
    "HS4 Description": "Human blood; animal blood prepared for therapeutic, prophylactic or diagnostic uses; antisera, other blood fractions and immunological products, whether or not modified or obtained by means of biotechnological processes; vaccines, toxins, cultures of micr"
  },
  {
    "HS4": "3003",
    "HS4 Short Name": "Unpackaged Medicaments",
    "HS4 Description": "Medicaments (excluding goods of heading 30.02, 30.05 or 30.06) consisting of two or more constituents which have been mixed together for therapeutic or prophylactic uses, not put up in measured doses or in forms or packings for retail sale."
  },
  {
    "HS4": "3004",
    "HS4 Short Name": "Packaged Medicaments",
    "HS4 Description": "Medicaments (excluding goods of heading 30.02, 30.05 or 30.06) consisting of mixed or unmixed products for therapeutic or prophylactic uses, put up in measured doses (including those in the form of transdermal administration systems) or in forms or packin"
  },
  {
    "HS4": "3005",
    "HS4 Short Name": "Bandages",
    "HS4 Description": "Wadding, gauze, bandages and similar articles (for example, dressings, adhesive plasters, poultices), impregnated or coated with pharmaceutical substances or put up in forms or packings for retail sale for medical, surgical, dental or veterinary purposes."
  },
  {
    "HS4": "3006",
    "HS4 Short Name": "Special Pharmaceuticals",
    "HS4 Description": "Pharmaceutical goods specified in Note 4 to this Chapter."
  },
  {
    "HS4": "3101",
    "HS4 Short Name": "Animal or Vegetable Fertilizers",
    "HS4 Description": "Animal or vegetable fertilisers, whether or not mixed together or chemically treated; fertilisers produced by the mixing or chemical treatment of animal or vegetable products."
  },
  {
    "HS4": "3102",
    "HS4 Short Name": "Nitrogenous Fertilizers",
    "HS4 Description": "Mineral or chemical fertilisers, nitrogenous."
  },
  {
    "HS4": "3103",
    "HS4 Short Name": "Phosphatic Fertilizers",
    "HS4 Description": "Mineral or chemical fertilisers, phosphatic."
  },
  {
    "HS4": "3104",
    "HS4 Short Name": "Potassic Fertilizers",
    "HS4 Description": "Mineral or chemical fertilisers, potassic."
  },
  {
    "HS4": "3105",
    "HS4 Short Name": "Mixed Mineral or Chemical Fertilizers",
    "HS4 Description": "Mineral or chemical fertilisers containing two or three of the fertilising elements nitrogen, phosphorus and potassium; other fertilisers; goods of this Chapter in tablets or similar forms or in packages of a gross weight not exceeding 10 kg."
  },
  {
    "HS4": "3201",
    "HS4 Short Name": "Vegetable Tanning Extracts",
    "HS4 Description": "Tanning extracts of vegetable origin; tannins and their salts, ethers, esters and other derivatives."
  },
  {
    "HS4": "3202",
    "HS4 Short Name": "Synthetic Tanning Extracts",
    "HS4 Description": "Synthetic organic tanning substances; inorganic tanning substances; tanning preparations, whether or not containing natural tanning substances; enzymatic preparations for pretanning."
  },
  {
    "HS4": "3203",
    "HS4 Short Name": "Vegetable or Animal Dyes",
    "HS4 Description": "Colouring matter of vegetable or animal origin (including dyeing extracts but excluding animal black), whether or not chemically defined; preparations as specified in Note 3 to this Chapter based on colouring matter of vegetable or animal origin."
  },
  {
    "HS4": "3204",
    "HS4 Short Name": "Synthetic Coloring Matter",
    "HS4 Description": "Synthetic organic colouring matter, whether or not chemically defined; preparations as specified in Note 3 to this Chapter based on synthetic organic colouring matter; synthetic organic products of a kind used as fluorescent brightening agents or as lumin"
  },
  {
    "HS4": "3205",
    "HS4 Short Name": "Lake Pigments",
    "HS4 Description": "Colour lakes; preparations as specified in Note 3 to this Chapter based on colour lakes."
  },
  {
    "HS4": "3206",
    "HS4 Short Name": "Other Coloring Matter",
    "HS4 Description": "Other colouring matter; preparations as specified in Note 3 to this Chapter, other than those of heading 32.03, 32.04 or 32.05; inorganic products of a kind used as luminophores, whether or not chemically defined."
  },
  {
    "HS4": "3207",
    "HS4 Short Name": "Prepared Pigments",
    "HS4 Description": "Prepared pigments, prepared opacifiers and prepared colours, vitrifiable enamels and glazes, engobes (slips), liquid lustres and similar preparations, of a kind used in the ceramic, enamelling or glass industry; glass frit and other glass, in the form of"
  },
  {
    "HS4": "3208",
    "HS4 Short Name": "Nonaqueous Paints",
    "HS4 Description": "Paints and varnishes (including enamels and lacquers) based on synthetic polymers or chemically modified natural polymers, dispersed or dissolved in a non-aqueous medium; solutions as defined in Note 4 to this Chapter."
  },
  {
    "HS4": "3209",
    "HS4 Short Name": "Aqueous Paints",
    "HS4 Description": "Paints and varnishes (including enamels and lacquers) based on synthetic polymers or chemically modified natural polymers, dispersed or dissolved in an aqueous medium."
  },
  {
    "HS4": "3210",
    "HS4 Short Name": "Other Paints",
    "HS4 Description": "Other paints and varnishes (including enamels, lacquers and distempers); prepared water pigments of a kind used for finishing leather."
  },
  {
    "HS4": "3211",
    "HS4 Short Name": "Prepared Paint Driers",
    "HS4 Description": "Prepared driers."
  },
  {
    "HS4": "3212",
    "HS4 Short Name": "Nonaqueous Pigments",
    "HS4 Description": "Pigments (including metallic powders and flakes) dispersed in non-aqueous media, in liquid or paste form, of a kind used in the manufacture of paints (including enamels); stamping foils; dyes and other colouring matter put up in forms or packings for reta"
  },
  {
    "HS4": "3213",
    "HS4 Short Name": "Artistry Paints",
    "HS4 Description": "Artists', students' or signboard painters' colours, modifying tints, amusement colours and the like, in tablets, tubes, jars, bottles, pans or in similar forms or packings."
  },
  {
    "HS4": "3214",
    "HS4 Short Name": "Glaziers Putty",
    "HS4 Description": "Glaziers' putty, grafting putty, resin cements, caulking compounds and other mastics; painters' fillings; non-refractory surfacing preparations for façades, indoor walls, floors, ceilings or the like."
  },
  {
    "HS4": "3215",
    "HS4 Short Name": "Ink",
    "HS4 Description": "Printing ink, writing or drawing ink and other inks, whether or not concentrated or solid."
  },
  {
    "HS4": "3301",
    "HS4 Short Name": "Essential Oils",
    "HS4 Description": "Essential oils (terpeneless or not), including concretes and absolutes; resinoids; extracted oleoresins; concentrates of essential oils in fats, in fixed oils, in waxes or the like, obtained by enfleurage or maceration; terpenic by-products of the deterpe"
  },
  {
    "HS4": "3302",
    "HS4 Short Name": "Scented Mixtures",
    "HS4 Description": "Mixtures of odoriferous substances and mixtures (including alcoholic solutions) with a basis of one or more of these substances, of a kind used as raw materials in industry; other preparations based on odoriferous substances, of a kind used for the manufa"
  },
  {
    "HS4": "3303",
    "HS4 Short Name": "Perfumes",
    "HS4 Description": "Perfumes and toilet waters."
  },
  {
    "HS4": "3304",
    "HS4 Short Name": "Beauty Products",
    "HS4 Description": "Beauty or make-up preparations and preparations for the care of the skin (other than medicaments), including sunscreen or sun tan preparations; manicure or pedicure preparations."
  },
  {
    "HS4": "3305",
    "HS4 Short Name": "Hair Products",
    "HS4 Description": "Preparations for use on the hair."
  },
  {
    "HS4": "3306",
    "HS4 Short Name": "Dental Products",
    "HS4 Description": "Preparations for oral or dental hygiene, including denture fixative pastes and powders; yarn used to clean between the teeth (dental floss), in individual retail packages."
  },
  {
    "HS4": "3307",
    "HS4 Short Name": "Shaving Products",
    "HS4 Description": "Pre-shave, shaving or after-shave preparations, personal deodorants, bath preparations, depilatories and other perfumery, cosmetic or toilet preparations, not elsewhere specified or included; prepared room deodorisers, whether or not perfumed or having di"
  },
  {
    "HS4": "3401",
    "HS4 Short Name": "Soap",
    "HS4 Description": "Soap; organic surface-active products and preparations for use as soap, in the form of bars, cakes, moulded pieces or shapes, whether or not containing soap; organic surface-active products and preparations for washing the skin, in the form of liquid or c"
  },
  {
    "HS4": "3402",
    "HS4 Short Name": "Cleaning Products",
    "HS4 Description": "Organic surface-active agents (other than soap); surface-active preparations, washing preparations (including auxiliary washing preparations) and cleaning preparations, whether or not containing soap, other than those of heading 34.01."
  },
  {
    "HS4": "3403",
    "HS4 Short Name": "Lubricating Products",
    "HS4 Description": "Lubricating preparations (including cutting-oil preparations, bolt or nut release preparations, anti-rust or anti-corrosion preparations and mould release preparations, based on lubricants) and preparations of a kind used for the oil or grease treatment o"
  },
  {
    "HS4": "3404",
    "HS4 Short Name": "Waxes",
    "HS4 Description": "Artificial waxes and prepared waxes."
  },
  {
    "HS4": "3405",
    "HS4 Short Name": "Polishes and Creams",
    "HS4 Description": "Polishes and creams, for footwear, furniture, floors, coachwork, glass or metal, scouring pastes and powders and similar preparations (whether or not in the form of paper, wadding, felt, nonwovens, cellular plastics or cellular rubber, impregnated, coated"
  },
  {
    "HS4": "3406",
    "HS4 Short Name": "Candles",
    "HS4 Description": "Candles, tapers and the like."
  },
  {
    "HS4": "3407",
    "HS4 Short Name": "Pastes and Waxes",
    "HS4 Description": "Modelling pastes, including those put up for children's amusement; preparations known as “dental wax” or as “dental impression compounds”, put up in sets, in packings for retail sale or in plates, horseshoe shapes, sticks or similar forms; other preparati"
  },
  {
    "HS4": "3501",
    "HS4 Short Name": "Casein",
    "HS4 Description": "Casein, caseinates and other casein derivatives; casein glues."
  },
  {
    "HS4": "3502",
    "HS4 Short Name": "Water Soluble Proteins",
    "HS4 Description": "Albumins (including concentrates of two or more whey proteins, containing by weight more than 80 % whey proteins, calculated on the dry matter), albuminates and other albumin derivatives."
  },
  {
    "HS4": "3503",
    "HS4 Short Name": "Gelatin",
    "HS4 Description": "Gelatin (including gelatin in rectangular (including square) sheets, whether or not surface-worked or coloured) and gelatin derivatives; isinglass; other glues of animal origin, excluding casein glues of heading 35.01."
  },
  {
    "HS4": "3504",
    "HS4 Short Name": "Peptones",
    "HS4 Description": "Peptones and their derivatives; other protein substances and their derivatives, not elsewhere specified or included; hide powder, whether or not chromed."
  },
  {
    "HS4": "3505",
    "HS4 Short Name": "Dextrins",
    "HS4 Description": "Dextrins and other modified starches (for example, pregelatinised or esterified starches); glues based on starches, or on dextrins or other modified starches."
  },
  {
    "HS4": "3506",
    "HS4 Short Name": "Glues",
    "HS4 Description": "Prepared glues and other prepared adhesives, not elsewhere specified or included; products suitable for use as glues or adhesives, put up for retail sale as glues or adhesives, not exceeding a net weight of 1 kg."
  },
  {
    "HS4": "3507",
    "HS4 Short Name": "Enzymes",
    "HS4 Description": "Enzymes; prepared enzymes not elsewhere specified or included."
  },
  {
    "HS4": "3601",
    "HS4 Short Name": "Propellant Powders",
    "HS4 Description": "Propellent powders."
  },
  {
    "HS4": "3602",
    "HS4 Short Name": "Prepared Explosives",
    "HS4 Description": "Prepared explosives, other than propellent powders."
  },
  {
    "HS4": "3603",
    "HS4 Short Name": "Detonating Fuses",
    "HS4 Description": "Safety fuses; detonating fuses; percussion or detonating caps; igniters; electric detonators."
  },
  {
    "HS4": "3604",
    "HS4 Short Name": "Fireworks",
    "HS4 Description": "Fireworks, signalling flares, rain rockets, fog signals and other pyrotechnic articles."
  },
  {
    "HS4": "3605",
    "HS4 Short Name": "Matches",
    "HS4 Description": "Matches, other than pyrotechnic articles of heading 36.04."
  },
  {
    "HS4": "3606",
    "HS4 Short Name": "Pyrophoric Alloys",
    "HS4 Description": "Ferro-cerium and other pyrophoric alloys in all forms; articles of combustible materials as specified in Note 2 to this Chapter."
  },
  {
    "HS4": "3701",
    "HS4 Short Name": "Photographic Plates",
    "HS4 Description": "Photographic plates and film in the flat, sensitised, unexposed, of any material other than paper, paperboard or textiles; instant print film in the flat, sensitised, unexposed, whether or not in packs."
  },
  {
    "HS4": "3702",
    "HS4 Short Name": "Photographic Film",
    "HS4 Description": "Photographic film in rolls, sensitised, unexposed, of any material other than paper, paperboard or textiles; instant print film in rolls, sensitised, unexposed."
  },
  {
    "HS4": "3703",
    "HS4 Short Name": "Photographic Paper",
    "HS4 Description": "Photographic paper, paperboard and textiles, sensitised, unexposed."
  },
  {
    "HS4": "3704",
    "HS4 Short Name": "Undeveloped Exposed Photographic Material",
    "HS4 Description": "Photographic plates, film, paper, paperboard and textiles, exposed but not developed."
  },
  {
    "HS4": "3705",
    "HS4 Short Name": "Developed Exposed Photographic Material",
    "HS4 Description": "Photographic plates and film; exposed and developed, other than cinematographic film"
  },
  {
    "HS4": "3706",
    "HS4 Short Name": "Motion-picture film, exposed and developed",
    "HS4 Description": "Cinematographic film, exposed and developed, whether or not incorporating sound track or consisting only of sound track."
  },
  {
    "HS4": "3707",
    "HS4 Short Name": "Photographic Chemicals",
    "HS4 Description": "Chemical preparations for photographic uses (other than varnishes, glues, adhesives and similar preparations); unmixed products for photographic uses, put up in measured portions or put up for retail sale in a form ready for use."
  },
  {
    "HS4": "3801",
    "HS4 Short Name": "Artificial Graphite",
    "HS4 Description": "Artificial graphite; colloidal or semi-colloidal graphite; preparations based on graphite or other carbon in the form of pastes, blocks, plates or other semi-manufactures."
  },
  {
    "HS4": "3802",
    "HS4 Short Name": "Activated Carbon",
    "HS4 Description": "Activated carbon; activated natural mineral products; animal black, including spent animal black."
  },
  {
    "HS4": "3803",
    "HS4 Short Name": "Tall Oil",
    "HS4 Description": "Tall oil, whether or not refined."
  },
  {
    "HS4": "3804",
    "HS4 Short Name": "Wood Pulp Lyes",
    "HS4 Description": "Residual lyes from the manufacture of wood pulp, whether or not concentrated, desugared or chemically treated, including lignin sulphonates, but excluding tall oil of heading 38.03."
  },
  {
    "HS4": "3805",
    "HS4 Short Name": "Turpentine",
    "HS4 Description": "Gum, wood or sulphate turpentine and other terpenic oils produced by the distillation or other treatment of coniferous woods; crude dipentene; sulphite turpentine and other crude para-cymene; pine oil containing alpha-terpineol as the main constituent."
  },
  {
    "HS4": "3806",
    "HS4 Short Name": "Rosin",
    "HS4 Description": "Rosin and resin acids, and derivatives thereof; rosin spirit and rosin oils; run gums."
  },
  {
    "HS4": "3807",
    "HS4 Short Name": "Wood Tar, Oils and Pitch",
    "HS4 Description": "Wood tar; wood tar oils; wood creosote; wood naphtha; vegetable pitch; brewers' pitch and similar preparations based on rosin, resin acids or on vegetable pitch."
  },
  {
    "HS4": "3808",
    "HS4 Short Name": "Pesticides",
    "HS4 Description": "Insecticides, rodenticides, fungicides, herbicides, anti-sprouting products and plant-growth regulators, disinfectants and similar products, put up in forms or packings for retail sale or as preparations or articles (for example, sulphur-treated bands, wi"
  },
  {
    "HS4": "3809",
    "HS4 Short Name": "Dyeing Finishing Agents",
    "HS4 Description": "Finishing agents, dye carriers to accelerate the dyeing or fixing of dyestuffs and other products and preparations (for example, dressings and mordants), of a kind used in the textile, paper, leather or like industries, not elsewhere specified or included"
  },
  {
    "HS4": "3810",
    "HS4 Short Name": "Metal Pickling Preparations",
    "HS4 Description": "Pickling preparations for metal surfaces; fluxes and other auxiliary preparations for soldering, brazing or welding; soldering, brazing or welding powders and pastes consisting of metal and other materials; preparations of a kind used as cores or coatings"
  },
  {
    "HS4": "3811",
    "HS4 Short Name": "Antiknock",
    "HS4 Description": "Anti-knock preparations, oxidation inhibitors, gum inhibitors, viscosity improvers, anti-corrosive preparations and other prepared additives, for mineral oils (including gasoline) or for other liquids used for the same purposes as mineral oils."
  },
  {
    "HS4": "3812",
    "HS4 Short Name": "Prepared Rubber Accelerators",
    "HS4 Description": "Prepared rubber accelerators; compound plasticisers for rubber or plastics, not elsewhere specified or included; anti-oxidising preparations and other compound stabilisers for rubber or plastics."
  },
  {
    "HS4": "3813",
    "HS4 Short Name": "Fire Extinguishers Preparations",
    "HS4 Description": "Preparations and charges for fire-extinguishers; charged fireextinguishing grenades."
  },
  {
    "HS4": "3814",
    "HS4 Short Name": "Organic Composite Solvents",
    "HS4 Description": "Organic composite solvents and thinners, not elsewhere specified or included; prepared paint or varnish removers."
  },
  {
    "HS4": "3815",
    "HS4 Short Name": "Reaction and Catalytic Products",
    "HS4 Description": "Reaction initiators, reaction accelerators and catalytic preparations, not elsewhere specified or included."
  },
  {
    "HS4": "3816",
    "HS4 Short Name": "Refractory Cements",
    "HS4 Description": "Refractory cements, mortars, concretes and similar compositions, other than products of heading 38.01."
  },
  {
    "HS4": "3817",
    "HS4 Short Name": "Alkylbenzenes and Alkylnaphthalenes",
    "HS4 Description": "Mixed alkylbenzenes and mixed alkylnaphthalenes, other than those of heading 27.07 or 29.02."
  },
  {
    "HS4": "3818",
    "HS4 Short Name": "Disc Chemicals for Electronics",
    "HS4 Description": "Chemical elements doped for use in electronics, in the form of discs, wafers or similar forms; chemical compounds doped for use in electronics."
  },
  {
    "HS4": "3819",
    "HS4 Short Name": "Hydraulic Brake Fluid",
    "HS4 Description": "Hydraulic brake fluids and other prepared liquids for hydraulic transmission, not containing or containing less than 70 % by weight of petroleum oils or oils obtained from bituminous minerals."
  },
  {
    "HS4": "3820",
    "HS4 Short Name": "Antifreeze",
    "HS4 Description": "Anti-freezing preparations and prepared de-icing fluids."
  },
  {
    "HS4": "3821",
    "HS4 Short Name": "Micro-Organism Culture Preparations",
    "HS4 Description": "Prepared culture media for the development or maintenance of micro-organisms (including viruses and the like) or of plant, human or animal cells."
  },
  {
    "HS4": "3822",
    "HS4 Short Name": "Laboratory Reagents",
    "HS4 Description": "Diagnostic or laboratory reagents on a backing, prepared diagnostic or laboratory reagents whether or not on a backing, other than those of heading 30.02 or 30.06; certified reference materials."
  },
  {
    "HS4": "3823",
    "HS4 Short Name": "Industrial Fatty Acids, Oils and Alcohols",
    "HS4 Description": "Industrial monocarboxylic fatty acids; acid oils from refining; industrial fatty alcohols."
  },
  {
    "HS4": "3824",
    "HS4 Short Name": "Prepared binders for foundry moulds or cores",
    "HS4 Description": "Prepared binders for foundry moulds or cores; chemical products and preparations of the chemical or allied industries (including those consisting of mixtures of natural products), not elsewhere specified or included."
  },
  {
    "HS4": "3825",
    "HS4 Short Name": "Residual products of the chemical or allied industries",
    "HS4 Description": "Residual products of the chemical or allied industries, not elsewhere specified or included; municipal waste; sewage sludge; other wastes specified in Note 6 to this Chapter."
  },
  {
    "HS4": "3826",
    "HS4 Short Name": "Biodiesel and mixtures",
    "HS4 Description": "Biodiesel and mixtures thereof, not containing or containing less than 70 % by weight of petroleum oils or oils obtained from bituminous minerals."
  },
  {
    "HS4": "3827",
    "HS4 Short Name": "Mixtures containing halogenated derivatives of methane, ethane or propane",
    "HS4 Description": "Mixtures containing halogenated derivatives of methane, ethane or propane, not elsewhere specified or included"
  },
  {
    "HS4": "3901",
    "HS4 Short Name": "Ethylene Polymers",
    "HS4 Description": "Polymers of ethylene, in primary forms."
  },
  {
    "HS4": "3902",
    "HS4 Short Name": "Propylene Polymers",
    "HS4 Description": "Polymers of propylene or of other olefins, in primary forms."
  },
  {
    "HS4": "3903",
    "HS4 Short Name": "Styrene Polymers",
    "HS4 Description": "Polymers of styrene, in primary forms."
  },
  {
    "HS4": "3904",
    "HS4 Short Name": "Vinyl Chloride Polymers",
    "HS4 Description": "Polymers of vinyl chloride or of other halogenated olefins, in primary forms."
  },
  {
    "HS4": "3905",
    "HS4 Short Name": "Other Vinyl Polymers",
    "HS4 Description": "Polymers of vinyl acetate or of other vinyl esters, in primary forms; other vinyl polymers in primary forms."
  },
  {
    "HS4": "3906",
    "HS4 Short Name": "Acrylic Polymers",
    "HS4 Description": "Acrylic polymers in primary forms."
  },
  {
    "HS4": "3907",
    "HS4 Short Name": "Polyacetals",
    "HS4 Description": "Polyacetals, other polyethers and epoxide resins, in primary forms; polycarbonates, alkyd resins, polyallyl esters and other polyesters, in primary forms."
  },
  {
    "HS4": "3908",
    "HS4 Short Name": "Polyamides",
    "HS4 Description": "Polyamides in primary forms."
  },
  {
    "HS4": "3909",
    "HS4 Short Name": "Amino-resins",
    "HS4 Description": "Amino-resins, phenolic resins and polyurethanes, in primary forms."
  },
  {
    "HS4": "3910",
    "HS4 Short Name": "Silicone",
    "HS4 Description": "Silicones in primary forms."
  },
  {
    "HS4": "3911",
    "HS4 Short Name": "Petroleum Resins",
    "HS4 Description": "Petroleum resins, coumarone-indene resins, polyterpenes, polysulphides, polysulphones and other products specified in Note 3 to this Chapter, not elsewhere specified or included, in primary forms."
  },
  {
    "HS4": "3912",
    "HS4 Short Name": "Cellulose",
    "HS4 Description": "Cellulose and its chemical derivatives, not elsewhere specified or included, in primary forms."
  },
  {
    "HS4": "3913",
    "HS4 Short Name": "Natural Polymers",
    "HS4 Description": "Natural polymers (for example, alginic acid) and modified natural polymers (for example, hardened proteins, chemical derivatives of natural rubber), not elsewhere specified or included, in primary forms."
  },
  {
    "HS4": "3914",
    "HS4 Short Name": "Polymer Ion-Exchangers",
    "HS4 Description": "Ion-exchangers based on polymers of headings 39.01 to 39.13, in primary forms."
  },
  {
    "HS4": "3915",
    "HS4 Short Name": "Scrap Plastic",
    "HS4 Description": "Waste, parings and scrap, of plastics."
  },
  {
    "HS4": "3916",
    "HS4 Short Name": "Monofilament",
    "HS4 Description": "Monofilament of which any cross-sectional dimension exceeds 1 mm, rods, sticks and profile shapes, whether or not surfaceworked but not otherwise worked, of plastics."
  },
  {
    "HS4": "3917",
    "HS4 Short Name": "Plastic Pipes",
    "HS4 Description": "Tubes, pipes and hoses, and fittings therefor (for example, joints, elbows, flanges), of plastics."
  },
  {
    "HS4": "3918",
    "HS4 Short Name": "Plastic Floor Coverings",
    "HS4 Description": "Floor coverings of plastics, whether or not self-adhesive, in rolls or in the form of tiles; wall or ceiling coverings of plastics, as defined in Note 9 to this Chapter."
  },
  {
    "HS4": "3919",
    "HS4 Short Name": "Self-adhesive Plastics",
    "HS4 Description": "Self-adhesive plates, sheets, film, foil, tape, strip and other flat shapes, of plastics, whether or not in rolls."
  },
  {
    "HS4": "3920",
    "HS4 Short Name": "Raw Plastic Sheeting",
    "HS4 Description": "Other plates, sheets, film, foil and strip, of plastics, non-cellular and not reinforced, laminated, supported or similarly combined with other materials."
  },
  {
    "HS4": "3921",
    "HS4 Short Name": "Other Plastic Sheetings",
    "HS4 Description": "Other plates, sheets, film, foil and strip, of plastics."
  },
  {
    "HS4": "3922",
    "HS4 Short Name": "Plastic Wash Basins",
    "HS4 Description": "Baths, shower-baths, sinks, wash-basins, bidets, lavatory pans, seats and covers, flushing cisterns and similar sanitary ware, of plastics."
  },
  {
    "HS4": "3923",
    "HS4 Short Name": "Plastic Lids",
    "HS4 Description": "Articles for the conveyance or packing of goods, of plastics; stoppers, lids, caps and other closures, of plastics."
  },
  {
    "HS4": "3924",
    "HS4 Short Name": "Plastic Housewares",
    "HS4 Description": "Tableware, kitchenware, other household articles and hygienic or toilet articles, of plastics."
  },
  {
    "HS4": "3925",
    "HS4 Short Name": "Plastic Building Materials",
    "HS4 Description": "Builders' ware of plastics, not elsewhere specified or included."
  },
  {
    "HS4": "3926",
    "HS4 Short Name": "Other Plastic Products",
    "HS4 Description": "Other articles of plastics and articles of other materials of headings 39.01 to 39.14."
  },
  {
    "HS4": "4001",
    "HS4 Short Name": "Rubber",
    "HS4 Description": "Natural rubber, balata, gutta-percha, guayule, chicle and similar natural gums, in primary forms or in plates, sheets or strip."
  },
  {
    "HS4": "4002",
    "HS4 Short Name": "Synthetic Rubber",
    "HS4 Description": "Synthetic rubber and factice derived from oils, in primary forms or in plates, sheets or strip; mixtures of any product of heading 40.01 with any product of this heading, in primary forms or in plates, sheets or strip."
  },
  {
    "HS4": "4003",
    "HS4 Short Name": "Reclaimed Rubber",
    "HS4 Description": "Reclaimed rubber in primary forms or in plates, sheets or strip."
  },
  {
    "HS4": "4004",
    "HS4 Short Name": "Scrap Rubber",
    "HS4 Description": "Waste, parings and scrap of rubber (other than hard rubber) and powders and granules obtained therefrom."
  },
  {
    "HS4": "4005",
    "HS4 Short Name": "Compounded Unvulcanised Rubber",
    "HS4 Description": "Compounded rubber, unvulcanised, in primary forms or in plates, sheets or strip."
  },
  {
    "HS4": "4006",
    "HS4 Short Name": "Unvulcanised Rubber Products",
    "HS4 Description": "Other forms (for example, rods, tubes and profile shapes) and articles (for example, discs and rings), of unvulcanised rubber."
  },
  {
    "HS4": "4007",
    "HS4 Short Name": "Rubber Thread",
    "HS4 Description": "Vulcanised rubber thread and cord."
  },
  {
    "HS4": "4008",
    "HS4 Short Name": "Rubber Sheets",
    "HS4 Description": "Plates, sheets, strip, rods and profile shapes, of vulcanised rubber other than hard rubber."
  },
  {
    "HS4": "4009",
    "HS4 Short Name": "Rubber Pipes",
    "HS4 Description": "Tubes, pipes and hoses, of vulcanised rubber other than hard rubber, with or without their fittings (for example, joints, elbows, flanges)."
  },
  {
    "HS4": "4010",
    "HS4 Short Name": "Rubber Belting",
    "HS4 Description": "Conveyor or transmission belts or belting, of vulcanised rubber."
  },
  {
    "HS4": "4011",
    "HS4 Short Name": "Rubber Tires",
    "HS4 Description": "New pneumatic tyres, of rubber."
  },
  {
    "HS4": "4012",
    "HS4 Short Name": "Used Rubber Tires",
    "HS4 Description": "Retreaded or used pneumatic tyres of rubber; solid or cushion tyres, tyre treads and tyre flaps, of rubber."
  },
  {
    "HS4": "4013",
    "HS4 Short Name": "Rubber Inner Tubes",
    "HS4 Description": "Inner tubes, of rubber."
  },
  {
    "HS4": "4014",
    "HS4 Short Name": "Pharmaceutical Rubber Products",
    "HS4 Description": "Hygienic or pharmaceutical articles (including teats), of vulcanised rubber other than hard rubber, with or without fittings of hard rubber."
  },
  {
    "HS4": "4015",
    "HS4 Short Name": "Rubber Apparel",
    "HS4 Description": "Articles of apparel and clothing accessories (including gloves, mittens and mitts), for all purposes, of vulcanised rubber other than hard rubber."
  },
  {
    "HS4": "4016",
    "HS4 Short Name": "Other Rubber Products",
    "HS4 Description": "Other articles of vulcanised rubber other than hard rubber."
  },
  {
    "HS4": "4017",
    "HS4 Short Name": "Hard Rubber",
    "HS4 Description": "Hard rubber (for example, ebonite) in all forms, including waste and scrap; articles of hard rubber."
  },
  {
    "HS4": "4101",
    "HS4 Short Name": "Equine and Bovine Hides",
    "HS4 Description": "Raw hides and skins of bovine (including buffalo) or equine animals (fresh, or salted, dried, limed, pickled or otherwise preserved, but not tanned, parchment-dressed or further prepared), whether or not dehaired or split."
  },
  {
    "HS4": "4102",
    "HS4 Short Name": "Sheep Hides",
    "HS4 Description": "Raw skins of sheep or lambs (fresh, or salted, dried, limed, pickled or otherwise preserved, but not tanned, parchmentdressed or further prepared), whether or not with wool on or split, other than those excluded by Note 1 (c) to this Chapter."
  },
  {
    "HS4": "4103",
    "HS4 Short Name": "Other Hides and Skins",
    "HS4 Description": "Other raw hides and skins (fresh, or salted, dried, limed, pickled or otherwise preserved, but not tanned, parchment-dressed or further prepared), whether or not dehaired or split, other than those excluded by Note 1 (b) or 1 (c) to this Chapter."
  },
  {
    "HS4": "4104",
    "HS4 Short Name": "Tanned Equine and Bovine Hides",
    "HS4 Description": "Tanned or crust hides and skins of bovine (including buffalo) or equine animals, without hair on, whether or not split, but not further prepared."
  },
  {
    "HS4": "4105",
    "HS4 Short Name": "Tanned Sheep Hides",
    "HS4 Description": "Tanned or crust skins of sheep or lambs, without wool on, whether or not split, but not further prepared."
  },
  {
    "HS4": "4106",
    "HS4 Short Name": "Tanned Goat Hides",
    "HS4 Description": "Tanned or crust hides and skins of other animals, without wool or hair on, whether or not split, but not further prepared."
  },
  {
    "HS4": "4107",
    "HS4 Short Name": "Leather of Other Animals",
    "HS4 Description": "Leather further prepared after tanning or crusting, including parchment-dressed leather, of bovine (including buffalo) or equine animals, without hair on, whether or not split, other than leather of heading 41.14."
  },
  {
    "HS4": "4108",
    "HS4 Short Name": "Chamois Leather",
    "HS4 Description": "(-2001) Chamois leather, incl. combination chamois leather (excl. glacé-tanned leather subsequently treated with formaldehyde and leather stuffed with oil only after tanning)"
  },
  {
    "HS4": "4109",
    "HS4 Short Name": "Patent Leather",
    "HS4 Description": "(-2001) Patent leather and patent laminated leather; metallized leather (excl. lacquered or metallized reconstituted leather)"
  },
  {
    "HS4": "4110",
    "HS4 Short Name": "Leather Waste",
    "HS4 Description": "(-2001) Parings and other waste of leather, parchment-dressed leather or composition leather, not suitable for the manufacture of leather articles; leather dust, powder and flour"
  },
  {
    "HS4": "4111",
    "HS4 Short Name": "Leather Sheets",
    "HS4 Description": "(-2001) Composition leather based on leather or leather fibre, in slabs, sheets or strip, whether or not in rolls"
  },
  {
    "HS4": "4112",
    "HS4 Short Name": "Leather further prepared after tanning or crusting",
    "HS4 Description": "Leather further prepared after tanning or crusting, including parchment-dressed leather, of sheep or lamb, without wool on, whether or not split, other than leather of heading 41.14."
  },
  {
    "HS4": "4113",
    "HS4 Short Name": "Leather further prepared after tanning or crusting",
    "HS4 Description": "Leather further prepared after tanning or crusting, including parchment-dressed leather, of other animals, without wool or hair on, whether or not split, other than leather of heading 41.14."
  },
  {
    "HS4": "4114",
    "HS4 Short Name": "Chamois",
    "HS4 Description": "Chamois (including combination chamois) leather; patent leather and patent laminated leather; metallised leather."
  },
  {
    "HS4": "4115",
    "HS4 Short Name": "Composition leather with a basis of leather or leather fibre",
    "HS4 Description": "Composition leather with a basis of leather or leather fibre, in slabs, sheets or strip, whether or not in rolls; parings and other waste of leather or of composition leather, not suitable for the manufacture of leather articles; leather dust, powder and"
  },
  {
    "HS4": "4201",
    "HS4 Short Name": "Saddlery",
    "HS4 Description": "Saddlery and harness for any animal (including traces, leads, knee pads, muzzles, saddle cloths, saddle bags, dog coats and the like), of any material."
  },
  {
    "HS4": "4202",
    "HS4 Short Name": "Trunks and Cases",
    "HS4 Description": "Trunks, suit-cases, vanity-cases, executive-cases, brief-cases, school satchels, spectacle cases, binocular cases, camera cases, musical instrument cases, gun cases, holsters and similar containers; travelling-bags, insulated food or beverages bags, toile"
  },
  {
    "HS4": "4203",
    "HS4 Short Name": "Leather Apparel",
    "HS4 Description": "Articles of apparel and clothing accessories, of leather or of composition leather."
  },
  {
    "HS4": "4204",
    "HS4 Short Name": "Leather Used in Machinery",
    "HS4 Description": "(-20016) Articles for technical use, of leather or composition leather"
  },
  {
    "HS4": "4205",
    "HS4 Short Name": "Other Leather Articles",
    "HS4 Description": "Other articles of leather or of composition leather."
  },
  {
    "HS4": "4206",
    "HS4 Short Name": "Articles of Gut",
    "HS4 Description": "Articles of gut (other than silk-worm gut), of goldbeater's skin, of bladders or of tendons."
  },
  {
    "HS4": "4301",
    "HS4 Short Name": "Raw Furskins",
    "HS4 Description": "Raw furskins (including heads, tails, paws and other pieces or cuttings, suitable for furriers' use), other than raw hides and skins of heading 41.01, 41.02 or 41.03."
  },
  {
    "HS4": "4302",
    "HS4 Short Name": "Tanned Furskins",
    "HS4 Description": "Tanned or dressed furskins (including heads, tails, paws and other pieces or cuttings), unassembled, or assembled (without the addition of other materials) other than those of heading 43.03."
  },
  {
    "HS4": "4303",
    "HS4 Short Name": "Furskin Apparel",
    "HS4 Description": "Articles of apparel, clothing accessories and other articles of furskin."
  },
  {
    "HS4": "4304",
    "HS4 Short Name": "Artificial Fur",
    "HS4 Description": "Artificial fur and articles thereof."
  },
  {
    "HS4": "4401",
    "HS4 Short Name": "Fuel Wood",
    "HS4 Description": "Fuel wood, in logs, in billets, in twigs, in faggots or in similar forms; wood in chips or particles; sawdust and wood waste and scrap, whether or not agglomerated in logs, briquettes, pellets or similar forms."
  },
  {
    "HS4": "4402",
    "HS4 Short Name": "Wood Charcoal",
    "HS4 Description": "Wood charcoal (including shell or nut charcoal), whether or not agglomerated."
  },
  {
    "HS4": "4403",
    "HS4 Short Name": "Rough Wood",
    "HS4 Description": "Wood in the rough, whether or not stripped of bark or sapwood, or roughly squared."
  },
  {
    "HS4": "4404",
    "HS4 Short Name": "Wood Stakes",
    "HS4 Description": "Hoopwood; split poles; piles, pickets and stakes of wood, pointed but not sawn lengthwise; wooden sticks, roughly trimmed but not turned, bent or otherwise worked, suitable for the manufacture of walking-sticks, umbrellas, tool handles or the like; chipwo"
  },
  {
    "HS4": "4405",
    "HS4 Short Name": "Wood Wool",
    "HS4 Description": "Wood wool; wood flour."
  },
  {
    "HS4": "4406",
    "HS4 Short Name": "Railroad Ties",
    "HS4 Description": "Railway or tramway sleepers (cross-ties) of wood."
  },
  {
    "HS4": "4407",
    "HS4 Short Name": "Sawn Wood",
    "HS4 Description": "Wood sawn or chipped lengthwise, sliced or peeled, whether or not planed, sanded or end-jointed, of a thickness exceeding 6 mm."
  },
  {
    "HS4": "4408",
    "HS4 Short Name": "Veneer Sheets",
    "HS4 Description": "Sheets for veneering (including those obtained by slicing laminated wood), for plywood or for similar laminated wood and other wood, sawn lengthwise, sliced or peeled, whether or not planed, sanded, spliced or end-jointed, of a thickness not exceeding 6 m"
  },
  {
    "HS4": "4409",
    "HS4 Short Name": "Shaped Wood",
    "HS4 Description": "Wood (including strips and friezes for parquet flooring, not assembled) continuously shaped (tongued, grooved, rebated, chamfered, V-jointed, beaded, moulded, rounded or the like) along any of its edges, ends or faces, whether or not planed, sanded or end"
  },
  {
    "HS4": "4410",
    "HS4 Short Name": "Particle Board",
    "HS4 Description": "Particle board, oriented strand board (OSB) and similar board (for example, waferboard) of wood or other ligneous materials, whether or not agglomerated with resins or other organic binding substances."
  },
  {
    "HS4": "4411",
    "HS4 Short Name": "Wood Fiberboard",
    "HS4 Description": "Fibreboard of wood or other ligneous materials, whether or not bonded with resins or other organic substances."
  },
  {
    "HS4": "4412",
    "HS4 Short Name": "Plywood",
    "HS4 Description": "Plywood, veneered panels and similar laminated wood."
  },
  {
    "HS4": "4413",
    "HS4 Short Name": "Densified Wood",
    "HS4 Description": "Densified wood, in blocks, plates, strips or profile shapes."
  },
  {
    "HS4": "4414",
    "HS4 Short Name": "Wood Frames",
    "HS4 Description": "Wooden frames for paintings, photographs, mirrors or similar objects."
  },
  {
    "HS4": "4415",
    "HS4 Short Name": "Wood Crates",
    "HS4 Description": "Packing cases, boxes, crates, drums and similar packings, of wood; cable-drums of wood; pallets, box pallets and other load boards, of wood; pallet collars of wood."
  },
  {
    "HS4": "4416",
    "HS4 Short Name": "Wood Barrels",
    "HS4 Description": "Casks, barrels, vats, tubs and other coopers' products and parts thereof, of wood, including staves."
  },
  {
    "HS4": "4417",
    "HS4 Short Name": "Wooden Tool Handles",
    "HS4 Description": "Tools, tool bodies, tool handles, broom or brush bodies and handles, of wood; boot or shoe lasts and trees, of wood."
  },
  {
    "HS4": "4418",
    "HS4 Short Name": "Wood Carpentry",
    "HS4 Description": "Builders' joinery and carpentry of wood, including cellular wood panels, assembled flooring panels, shingles and shakes."
  },
  {
    "HS4": "4419",
    "HS4 Short Name": "Wood Kitchenware",
    "HS4 Description": "Tableware and kitchenware, of wood."
  },
  {
    "HS4": "4420",
    "HS4 Short Name": "Wood Ornaments",
    "HS4 Description": "Wood marquetry and inlaid wood; caskets and cases for jewellery or cutlery, and similar articles, of wood; statuettes and other ornaments, of wood; wooden articles of furniture not falling in Chapter 94."
  },
  {
    "HS4": "4421",
    "HS4 Short Name": "Other Wood Articles",
    "HS4 Description": "Other articles of wood."
  },
  {
    "HS4": "4501",
    "HS4 Short Name": "Raw Cork",
    "HS4 Description": "Natural cork, raw or simply prepared; waste cork; crushed, granulated or ground cork."
  },
  {
    "HS4": "4502",
    "HS4 Short Name": "Debacked Cork",
    "HS4 Description": "Natural cork, debacked or roughly squared, or in rectangular (including square) blocks, plates, sheets or strip (including sharp-edged blanks for corks or stoppers)."
  },
  {
    "HS4": "4503",
    "HS4 Short Name": "Natural Cork Articles",
    "HS4 Description": "Articles of natural cork."
  },
  {
    "HS4": "4504",
    "HS4 Short Name": "Agglomerated Cork",
    "HS4 Description": "Agglomerated cork (with or without a binding substance) and articles of agglomerated cork."
  },
  {
    "HS4": "4601",
    "HS4 Short Name": "Plaiting Products",
    "HS4 Description": "Plaits and similar products of plaiting materials, whether or not assembled into strips; plaiting materials, plaits and similar products of plaiting materials, bound together in parallel strands or woven, in sheet form, whether or not being finished artic"
  },
  {
    "HS4": "4602",
    "HS4 Short Name": "Basketwork",
    "HS4 Description": "Basketwork, wickerwork and other articles, made directly to shape from plaiting materials or made up from goods of heading 46.01; articles of loofah."
  },
  {
    "HS4": "4701",
    "HS4 Short Name": "Mechanical Wood Pulp",
    "HS4 Description": "Mechanical wood pulp."
  },
  {
    "HS4": "4702",
    "HS4 Short Name": "Dissolving Grades Chemical Woodpulp",
    "HS4 Description": "Chemical wood pulp, dissolving grades."
  },
  {
    "HS4": "4703",
    "HS4 Short Name": "Sulfate Chemical Woodpulp",
    "HS4 Description": "Chemical wood pulp, soda or sulphate, other than dissolving grades."
  },
  {
    "HS4": "4704",
    "HS4 Short Name": "Sulfite Chemical Woodpulp",
    "HS4 Description": "Chemical wood pulp, sulphite, other than dissolving grades."
  },
  {
    "HS4": "4705",
    "HS4 Short Name": "Semi chemical Woodpulp",
    "HS4 Description": "Wood pulp obtained by a combination of mechanical and chemical pulping processes."
  },
  {
    "HS4": "4706",
    "HS4 Short Name": "Recovered Paper Pulp",
    "HS4 Description": "Pulps of fibres derived from recovered (waste and scrap) paper or paperboard or of other fibrous cellulosic material."
  },
  {
    "HS4": "4707",
    "HS4 Short Name": "Recovered Paper",
    "HS4 Description": "Recovered (waste and scrap) paper or paperboard."
  },
  {
    "HS4": "4801",
    "HS4 Short Name": "Newsprint",
    "HS4 Description": "Newsprint, in rolls or sheets."
  },
  {
    "HS4": "4802",
    "HS4 Short Name": "Uncoated Paper",
    "HS4 Description": "Uncoated paper and paperboard, of a kind used for writing, printing or other graphic purposes, and non perforated punchcards and punch tape paper, in rolls or rectangular (including square) sheets, of any size, other than paper of heading 48.01 or 48.03"
  },
  {
    "HS4": "4803",
    "HS4 Short Name": "Facial Tissue",
    "HS4 Description": "Toilet or facial tissue stock, towel or napkin stock and similar paper of a kind used for household or sanitary purposes, cellulose wadding and webs of cellulose fibres, whether or not creped, crinkled, embossed, perforated, surface-coloured, surfacedec"
  },
  {
    "HS4": "4804",
    "HS4 Short Name": "Uncoated Kraft Paper",
    "HS4 Description": "Uncoated kraft paper and paperboard, in rolls or sheets, other than that of heading 48.02 or 48.03."
  },
  {
    "HS4": "4805",
    "HS4 Short Name": "Other Uncoated Paper",
    "HS4 Description": "Other uncoated paper and paperboard, in rolls or sheets, not further worked or processed than as specified in Note 3 to this Chapter."
  },
  {
    "HS4": "4806",
    "HS4 Short Name": "Vegetable Parchment",
    "HS4 Description": "Vegetable parchment, greaseproof papers, tracing papers and glassine and other glazed transparent or translucent papers, in rolls or sheets."
  },
  {
    "HS4": "4807",
    "HS4 Short Name": "Composite Paper",
    "HS4 Description": "Composite paper and paperboard (made by sticking flat layers of paper or paperboard together with an adhesive), not surfacecoated or impregnated, whether or not internally reinforced, in rolls or sheets."
  },
  {
    "HS4": "4808",
    "HS4 Short Name": "Corrugated Paper",
    "HS4 Description": "Paper and paperboard, corrugated (with or without glued flat surface sheets), creped, crinkled, embossed or perforated, in rolls or sheets, other than paper of the kind described in heading 48.03."
  },
  {
    "HS4": "4809",
    "HS4 Short Name": "Carbon Paper",
    "HS4 Description": "Carbon paper, self-copy paper and other copying or transfer papers (including coated or impregnated paper for duplicator stencils or offset plates), whether or not printed, in rolls or sheets."
  },
  {
    "HS4": "4810",
    "HS4 Short Name": "Kaolin Coated Paper",
    "HS4 Description": "Paper and paperboard, coated on one or both sides with kaolin (China clay) or other inorganic substances, with or without a binder, and with no other coating, whether or not surfacecoloured, surface-decorated or printed, in rolls or rectangular (includi"
  },
  {
    "HS4": "4811",
    "HS4 Short Name": "Cellulose Fibers Paper",
    "HS4 Description": "Paper, paperboard, cellulose wadding and webs of cellulose fibres, coated, impregnated, covered, surface-coloured, surfacedecorated or printed, in rolls or rectangular (including square) sheets, of any size, other than goods of the kind described in hea"
  },
  {
    "HS4": "4812",
    "HS4 Short Name": "Paper Pulp Filter Blocks",
    "HS4 Description": "Filter blocks, slabs and plates, of paper pulp."
  },
  {
    "HS4": "4813",
    "HS4 Short Name": "Cigarette Paper",
    "HS4 Description": "Cigarette paper, whether or not cut to size or in the form of booklets or tubes."
  },
  {
    "HS4": "4814",
    "HS4 Short Name": "Wallpaper",
    "HS4 Description": "Wallpaper and similar wall coverings; window transparencies of paper."
  },
  {
    "HS4": "4815",
    "HS4 Short Name": "Paper Floor Coverings",
    "HS4 Description": "(-2006) Floor coverings on a base of paper or paperboard, whether or not cut to size (excl. similar floor coverings with textile backings, and floor coverings without backings)"
  },
  {
    "HS4": "4816",
    "HS4 Short Name": "Other Carbon Paper",
    "HS4 Description": "Carbon paper, self-copy paper and other copying or transfer papers (other than those of heading 48.09), duplicator stencils and offset plates, of paper, whether or not put up in boxes."
  },
  {
    "HS4": "4817",
    "HS4 Short Name": "Letter Stock",
    "HS4 Description": "Envelopes, letter cards, plain postcards and correspondence cards, of paper or paperboard; boxes, pouches, wallets and writing compendiums, of paper or paperboard, containing an assortment of paper stationery."
  },
  {
    "HS4": "4818",
    "HS4 Short Name": "Toilet Paper",
    "HS4 Description": "Toilet paper and similar paper, cellulose wadding or webs of cellulose fibres, of a kind used for household or sanitary purposes, in rolls of a width not exceeding 36 cm, or cut to size or shape; handkerchiefs, cleansing tissues, towels, tablecloths, serv"
  },
  {
    "HS4": "4819",
    "HS4 Short Name": "Paper Containers",
    "HS4 Description": "Cartons, boxes, cases, bags and other packing containers, of paper, paperboard, cellulose wadding or webs of cellulose fibres; box files, letter trays, and similar articles, of paper or paperboard of a kind used in offices, shops or the like."
  },
  {
    "HS4": "4820",
    "HS4 Short Name": "Paper Notebooks",
    "HS4 Description": "Registers, account books, note books, order books, receipt books, letter pads, memorandum pads, diaries and similar articles, exercise books, blotting-pads, binders (loose-leaf or other), folders, file covers, manifold business forms, interleaved carbon s"
  },
  {
    "HS4": "4821",
    "HS4 Short Name": "Paper Labels",
    "HS4 Description": "Paper or paperboard labels of all kinds, whether or not printed."
  },
  {
    "HS4": "4822",
    "HS4 Short Name": "Paper Spools",
    "HS4 Description": "Bobbins, spools, cops and similar supports of paper pulp, paper or paperboard (whether or not perforated or hardened)."
  },
  {
    "HS4": "4823",
    "HS4 Short Name": "Shaped Paper",
    "HS4 Description": "Other paper, paperboard, cellulose wadding and webs of cellulose fibres, cut to size or shape; other articles of paper pulp, paper, paperboard, cellulose wadding or webs of cellulose fibres."
  },
  {
    "HS4": "4901",
    "HS4 Short Name": "Brochures",
    "HS4 Description": "Printed books, brochures, leaflets and similar printed matter, whether or not in single sheets."
  },
  {
    "HS4": "4902",
    "HS4 Short Name": "Newspapers",
    "HS4 Description": "Newspapers, journals and periodicals, whether or not illustrated or containing advertising material."
  },
  {
    "HS4": "4903",
    "HS4 Short Name": "Children's Picture Books",
    "HS4 Description": "Children's picture, drawing or colouring books."
  },
  {
    "HS4": "4904",
    "HS4 Short Name": "Sheet Music",
    "HS4 Description": "Music, printed or in manuscript, whether or not bound or illustrated."
  },
  {
    "HS4": "4905",
    "HS4 Short Name": "Maps",
    "HS4 Description": "Maps and hydrographic or similar charts of all kinds, including atlases, wall maps, topographical plans and globes, printed."
  },
  {
    "HS4": "4906",
    "HS4 Short Name": "Architectural Plans",
    "HS4 Description": "Plans and drawings for architectural, engineering, industrial, commercial, topographical or similar purposes, being originals drawn by hand; hand-written texts; photographic reproductions on sensitised paper and carbon copies of the foregoing."
  },
  {
    "HS4": "4907",
    "HS4 Short Name": "Postage Stamps",
    "HS4 Description": "Unused postage, revenue or similar stamps of current or new issue in the country in which they have, or will have, a recognised face value; stamp-impressed paper; banknotes; cheque forms; stock, share or bond certificates and similar documents of title."
  },
  {
    "HS4": "4908",
    "HS4 Short Name": "Decals",
    "HS4 Description": "Transfers (decalcomanias)."
  },
  {
    "HS4": "4909",
    "HS4 Short Name": "Postcards",
    "HS4 Description": "Printed or illustrated postcards; printed cards bearing personal greetings, messages or announcements, whether or not illustrated, with or without envelopes or trimmings."
  },
  {
    "HS4": "4910",
    "HS4 Short Name": "Calendars",
    "HS4 Description": "Calendars of any kind, printed, including calendar blocks."
  },
  {
    "HS4": "4911",
    "HS4 Short Name": "Other Printed Material",
    "HS4 Description": "Other printed matter, including printed pictures and photographs."
  },
  {
    "HS4": "5001",
    "HS4 Short Name": "Silkworm Cocoons",
    "HS4 Description": "Silk-worm cocoons suitable for reeling."
  },
  {
    "HS4": "5002",
    "HS4 Short Name": "Raw Silk",
    "HS4 Description": "Raw silk (not thrown)."
  },
  {
    "HS4": "5003",
    "HS4 Short Name": "Silk Waste",
    "HS4 Description": "Silk waste (including cocoons unsuitable for reeling, yarn waste and garnetted stock)."
  },
  {
    "HS4": "5004",
    "HS4 Short Name": "Non-Retail Silk Yarn",
    "HS4 Description": "Silk yarn (other than yarn spun from silk waste) not put up for retail sale."
  },
  {
    "HS4": "5005",
    "HS4 Short Name": "Silk Waste Yarn",
    "HS4 Description": "Yarn spun from silk waste, not put up for retail sale."
  },
  {
    "HS4": "5006",
    "HS4 Short Name": "Retail Silk Yarn",
    "HS4 Description": "Silk yarn and yarn spun from silk waste, put up for retail sale; silk-worm gut."
  },
  {
    "HS4": "5007",
    "HS4 Short Name": "Silk Fabrics",
    "HS4 Description": "Woven fabrics of silk or of silk waste."
  },
  {
    "HS4": "5101",
    "HS4 Short Name": "Wool",
    "HS4 Description": "Wool, not carded or combed."
  },
  {
    "HS4": "5102",
    "HS4 Short Name": "Animal Hair",
    "HS4 Description": "Fine or coarse animal hair, not carded or combed."
  },
  {
    "HS4": "5103",
    "HS4 Short Name": "Wool or Animal Hair Waste",
    "HS4 Description": "Waste of wool or of fine or coarse animal hair, including yarn waste but excluding garnetted stock."
  },
  {
    "HS4": "5104",
    "HS4 Short Name": "Garnetted Wool or Animal Hair",
    "HS4 Description": "Garnetted stock of wool or of fine or coarse animal hair."
  },
  {
    "HS4": "5105",
    "HS4 Short Name": "Prepared Wool or Animal Hair",
    "HS4 Description": "Wool and fine or coarse animal hair, carded or combed (including combed wool in fragments)."
  },
  {
    "HS4": "5106",
    "HS4 Short Name": "Non-Retail Carded Wool Yarn",
    "HS4 Description": "Yarn of carded wool, not put up for retail sale."
  },
  {
    "HS4": "5107",
    "HS4 Short Name": "Non-Retail Combed Wool Yarn",
    "HS4 Description": "Yarn of combed wool, not put up for retail sale."
  },
  {
    "HS4": "5108",
    "HS4 Short Name": "Non-Retail Animal Hair Yarn",
    "HS4 Description": "Yarn of fine animal hair (carded or combed), not put up for retail sale."
  },
  {
    "HS4": "5109",
    "HS4 Short Name": "Retail Wool or Animal Hair Yarn",
    "HS4 Description": "Yarn of wool or of fine animal hair, put up for retail sale."
  },
  {
    "HS4": "5110",
    "HS4 Short Name": "Horsehair Yarn",
    "HS4 Description": "Yarn of coarse animal hair or of horsehair (including gimped horsehair yarn), whether or not put up for retail sale."
  },
  {
    "HS4": "5111",
    "HS4 Short Name": "Carded Wool or Animal Hair Fabric",
    "HS4 Description": "Woven fabrics of carded wool or of carded fine animal hair."
  },
  {
    "HS4": "5112",
    "HS4 Short Name": "Combed Wool or Animal Hair Fabric",
    "HS4 Description": "Woven fabrics of combed wool or of combed fine animal hair."
  },
  {
    "HS4": "5113",
    "HS4 Short Name": "Horsehair Fabric",
    "HS4 Description": "Woven fabrics of coarse animal hair or of horsehair."
  },
  {
    "HS4": "5201",
    "HS4 Short Name": "Raw Cotton",
    "HS4 Description": "Cotton, not carded or combed."
  },
  {
    "HS4": "5202",
    "HS4 Short Name": "Cotton Waste",
    "HS4 Description": "Cotton waste (including yarn waste and garnetted stock)."
  },
  {
    "HS4": "5203",
    "HS4 Short Name": "Prepared Cotton",
    "HS4 Description": "Cotton, carded or combed."
  },
  {
    "HS4": "5204",
    "HS4 Short Name": "Cotton Sewing Thread",
    "HS4 Description": "Cotton sewing thread, whether or not put up for retail sale."
  },
  {
    "HS4": "5205",
    "HS4 Short Name": "Non-Retail Pure Cotton Yarn",
    "HS4 Description": "Cotton yarn (other than sewing thread), containing 85 % or more by weight of cotton, not put up for retail sale."
  },
  {
    "HS4": "5206",
    "HS4 Short Name": "Non-Retail Mixed Cotton Yarn",
    "HS4 Description": "Cotton yarn (other than sewing thread), containing less than 85 % by weight of cotton, not put up for retail sale."
  },
  {
    "HS4": "5207",
    "HS4 Short Name": "Retail Cotton Yarn",
    "HS4 Description": "Cotton yarn (other than sewing thread) put up for retail sale."
  },
  {
    "HS4": "5208",
    "HS4 Short Name": "Light Pure Woven Cotton",
    "HS4 Description": "Woven fabrics of cotton, containing 85 % or more by weight of cotton, weighing not more than 200 g/m2."
  },
  {
    "HS4": "5209",
    "HS4 Short Name": "Heavy Pure Woven Cotton",
    "HS4 Description": "Woven fabrics of cotton, containing 85 % or more by weight of cotton, weighing more than 200 g/m2."
  },
  {
    "HS4": "5210",
    "HS4 Short Name": "Light Mixed Woven Cotton",
    "HS4 Description": "Woven fabrics of cotton, containing less than 85 % by weight of cotton, mixed mainly or solely with man-made fibres, weighing not more than 200 g/m2."
  },
  {
    "HS4": "5211",
    "HS4 Short Name": "Heavy Mixed Woven Cotton",
    "HS4 Description": "Woven fabrics of cotton, containing less than 85 % by weight of cotton, mixed mainly or solely with man-made fibres, weighing more than 200 g/m2."
  },
  {
    "HS4": "5212",
    "HS4 Short Name": "Other Cotton Fabrics",
    "HS4 Description": "Other woven fabrics of cotton."
  },
  {
    "HS4": "5301",
    "HS4 Short Name": "Flax Fibers",
    "HS4 Description": "Flax, raw or processed but not spun; flax tow and waste (including yarn waste and garnetted stock)."
  },
  {
    "HS4": "5302",
    "HS4 Short Name": "Hemp Fibers",
    "HS4 Description": "True hemp (Cannabis sativa L.), raw or processed but not spun; tow and waste of true hemp (including yarn waste and garnetted stock)."
  },
  {
    "HS4": "5303",
    "HS4 Short Name": "Jute and Other Textile Fibers",
    "HS4 Description": "Jute and other textile bast fibres (excluding flax, true hemp and ramie), raw or processed but not spun; tow and waste of these fibres (including yarn waste and garnetted stock)."
  },
  {
    "HS4": "5304",
    "HS4 Short Name": "Agave",
    "HS4 Description": "(-2006) Sisal and other textile fibres of the genus Agave, raw or processed, but not spun; tow and waste of such fibres, incl. yarn waste and garnetted stock"
  },
  {
    "HS4": "5305",
    "HS4 Short Name": "Coconut and Other Vegetable Fibers",
    "HS4 Description": "Coconut, abaca (Manila hemp or Musa textilis Nee), ramie and other vegetable textile fibres, not elsewhere specified or included, raw or processed but not spun; tow, noils and waste of these fibres (including yarn waste and garnetted stock)."
  },
  {
    "HS4": "5306",
    "HS4 Short Name": "Flax Yarn",
    "HS4 Description": "Flax yarn."
  },
  {
    "HS4": "5307",
    "HS4 Short Name": "Jute Yarn",
    "HS4 Description": "Yarn of jute or of other textile bast fibres of heading 53.03."
  },
  {
    "HS4": "5308",
    "HS4 Short Name": "Other Vegetable Fibers Yarn",
    "HS4 Description": "Yarn of other vegetable textile fibres; paper yarn."
  },
  {
    "HS4": "5309",
    "HS4 Short Name": "Flax Woven Fabric",
    "HS4 Description": "Woven fabrics of flax."
  },
  {
    "HS4": "5310",
    "HS4 Short Name": "Jute Woven Fabric",
    "HS4 Description": "Woven fabrics of jute or of other textile bast fibres of heading 53.03."
  },
  {
    "HS4": "5311",
    "HS4 Short Name": "Other Vegetable Fibers Fabric",
    "HS4 Description": "Woven fabrics of other vegetable textile fibres; woven fabrics of paper yarn."
  },
  {
    "HS4": "5401",
    "HS4 Short Name": "Artificial Filament Sewing Thread",
    "HS4 Description": "Sewing thread of man-made filaments, whether or not put up for retail sale."
  },
  {
    "HS4": "5402",
    "HS4 Short Name": "Non-Retail Synthetic Filament Yarn",
    "HS4 Description": "Synthetic filament yarn (other than sewing thread), not put up for retail sale, including synthetic monofilament of less than 67 decitex."
  },
  {
    "HS4": "5403",
    "HS4 Short Name": "Non-Retail Artificial Filament Yarn",
    "HS4 Description": "Artificial filament yarn (other than sewing thread), not put up for retail sale, including artificial monofilament of less than 67 decitex."
  },
  {
    "HS4": "5404",
    "HS4 Short Name": "Synthetic Monofilament",
    "HS4 Description": "Synthetic monofilament of 67 decitex or more and of which no cross-sectional dimension exceeds 1 mm; strip and the like (for example, artificial straw) of synthetic textile materials of an apparent width not exceeding 5 mm."
  },
  {
    "HS4": "5405",
    "HS4 Short Name": "Artificial Monofilament",
    "HS4 Description": "Artificial monofilament of 67 decitex or more and of which no cross-sectional dimension exceeds 1 mm; strip and the like (for example, artificial straw) of artificial textile materials of an apparent width not exceeding 5 mm."
  },
  {
    "HS4": "5406",
    "HS4 Short Name": "Retail Artificial Filament Yarn",
    "HS4 Description": "Man-made filament yarn (other than sewing thread), put up for retail sale."
  },
  {
    "HS4": "5407",
    "HS4 Short Name": "Synthetic Filament Yarn Woven Fabric",
    "HS4 Description": "Woven fabrics of synthetic filament yarn, including woven fabrics obtained from materials of heading 54.04."
  },
  {
    "HS4": "5408",
    "HS4 Short Name": "Artificial Filament Yarn Woven Fabric",
    "HS4 Description": "Woven fabrics of artificial filament yarn, including woven fabrics obtained from materials of heading 54.05."
  },
  {
    "HS4": "5501",
    "HS4 Short Name": "Synthetic Filament Tow",
    "HS4 Description": "Synthetic filament tow."
  },
  {
    "HS4": "5502",
    "HS4 Short Name": "Artificial Filament Tow",
    "HS4 Description": "Artificial filament tow."
  },
  {
    "HS4": "5503",
    "HS4 Short Name": "Unprocessed Synthetic Staple Fibers",
    "HS4 Description": "Synthetic staple fibres, not carded, combed or otherwise processed for spinning."
  },
  {
    "HS4": "5504",
    "HS4 Short Name": "Unprocessed Artificial Staple Fibers",
    "HS4 Description": "Artificial staple fibres, not carded, combed or otherwise processed for spinning."
  },
  {
    "HS4": "5505",
    "HS4 Short Name": "Artificial Fibers Waste",
    "HS4 Description": "Waste (including noils, yarn waste and garnetted stock) of manmade fibres."
  },
  {
    "HS4": "5506",
    "HS4 Short Name": "Processed Synthetic Staple Fibers",
    "HS4 Description": "Synthetic staple fibres, carded, combed or otherwise processed for spinning."
  },
  {
    "HS4": "5507",
    "HS4 Short Name": "Processed Artificial Staple Fibers",
    "HS4 Description": "Artificial staple fibres, carded, combed or otherwise processed for spinning."
  },
  {
    "HS4": "5508",
    "HS4 Short Name": "Non-Retail Artificial Staple Fibers Sewing Thread",
    "HS4 Description": "Sewing thread of man-made staple fibres, whether or not put up for retail sale."
  },
  {
    "HS4": "5509",
    "HS4 Short Name": "Non-Retail Synthetic Staple Fibers Yarn",
    "HS4 Description": "Yarn (other than sewing thread) of synthetic staple fibres, not put up for retail sale."
  },
  {
    "HS4": "5510",
    "HS4 Short Name": "Non-Retail Artificial Staple Fibers Yarn",
    "HS4 Description": "Yarn (other than sewing thread) of artificial staple fibres, not put up for retail sale."
  },
  {
    "HS4": "5511",
    "HS4 Short Name": "Retail Artificial Staple Fibers Yarn",
    "HS4 Description": "Yarn (other than sewing thread) of man-made staple fibres, put up for retail sale."
  },
  {
    "HS4": "5512",
    "HS4 Short Name": "Synthetic Fabrics",
    "HS4 Description": "Woven fabrics of synthetic staple fibres, containing 85 % or more by weight of synthetic staple fibres."
  },
  {
    "HS4": "5513",
    "HS4 Short Name": "Light Synthetic Cotton Fabrics",
    "HS4 Description": "Woven fabrics of synthetic staple fibres, containing less than 85 % by weight of such fibres, mixed mainly or solely with cotton, of a weight not exceeding 170 g/m²."
  },
  {
    "HS4": "5514",
    "HS4 Short Name": "Heavy Synthetic Cotton Fabrics",
    "HS4 Description": "Woven fabrics of synthetic staple fibres, containing less than 85 % by weight of such fibres, mixed mainly or solely with cotton, of a weight exceeding 170 g/m²."
  },
  {
    "HS4": "5515",
    "HS4 Short Name": "Other Synthetic Fabrics",
    "HS4 Description": "Other woven fabrics of synthetic staple fibres."
  },
  {
    "HS4": "5516",
    "HS4 Short Name": "Woven Fabric of Synthetic Staple Fibers",
    "HS4 Description": "Woven fabrics of artificial staple fibres."
  },
  {
    "HS4": "5601",
    "HS4 Short Name": "Wadding",
    "HS4 Description": "Wadding of textile materials and articles thereof; textile fibres, not exceeding 5 mm in length (flock), textile dust and mill neps."
  },
  {
    "HS4": "5602",
    "HS4 Short Name": "Felt",
    "HS4 Description": "Felt, whether or not impregnated, coated, covered or laminated."
  },
  {
    "HS4": "5603",
    "HS4 Short Name": "Non-woven Textiles",
    "HS4 Description": "Nonwovens, whether or not impregnated, coated, covered or laminated."
  },
  {
    "HS4": "5604",
    "HS4 Short Name": "Rubber Textiles",
    "HS4 Description": "Rubber thread and cord, textile covered; textile yarn, and strip and the like of heading 54.04 or 54.05, impregnated, coated, covered or sheathed with rubber or plastics."
  },
  {
    "HS4": "5605",
    "HS4 Short Name": "Metallic Yarn",
    "HS4 Description": "Metallised yarn, whether or not gimped, being textile yarn, or strip or the like of heading 54.04 or 54.05, combined with metal in the form of thread, strip or powder or covered with metal."
  },
  {
    "HS4": "5606",
    "HS4 Short Name": "Gimp Yarn",
    "HS4 Description": "Gimped yarn, and strip and the like of heading 54.04 or 54.05, gimped (other than those of heading 56.05 and gimped horsehair yarn); chenille yarn (including flock chenille yarn); loop waleyarn."
  },
  {
    "HS4": "5607",
    "HS4 Short Name": "Twine and Rope",
    "HS4 Description": "Twine, cordage, ropes and cables, whether or not plaited or braided and whether or not impregnated, coated, covered or sheathed with rubber or plastics."
  },
  {
    "HS4": "5608",
    "HS4 Short Name": "Netting",
    "HS4 Description": "Knotted netting of twine, cordage or rope; made up fishing nets and other made up nets, of textile materials."
  },
  {
    "HS4": "5609",
    "HS4 Short Name": "Other Articles of Twine and Rope",
    "HS4 Description": "Articles of yarn, strip or the like of heading 54.04 or 54.05, twine, cordage, rope or cables, not elsewhere specified or included."
  },
  {
    "HS4": "5701",
    "HS4 Short Name": "Knotted Carpets",
    "HS4 Description": "Carpets and other textile floor coverings, knotted, whether or not made up."
  },
  {
    "HS4": "5702",
    "HS4 Short Name": "Hand-Woven Rugs",
    "HS4 Description": "Carpets and other textile floor coverings, woven, not tufted or flocked, whether or not made up, including “Kelem”, “Schumacks”, “Karamanie” and similar hand-woven rugs."
  },
  {
    "HS4": "5703",
    "HS4 Short Name": "Tufted Carpets",
    "HS4 Description": "Carpets and other textile floor coverings, tufted, whether or not made up."
  },
  {
    "HS4": "5704",
    "HS4 Short Name": "Felt Carpets",
    "HS4 Description": "Carpets and other textile floor coverings, of felt, not tufted or flocked, whether or not made up."
  },
  {
    "HS4": "5705",
    "HS4 Short Name": "Other Carpets",
    "HS4 Description": "Other carpets and other textile floor coverings, whether or not made up."
  },
  {
    "HS4": "5801",
    "HS4 Short Name": "Woven Fabrics",
    "HS4 Description": "Woven pile fabrics and chenille fabrics, other than fabrics of heading 58.02 or 58.06."
  },
  {
    "HS4": "5802",
    "HS4 Short Name": "Terry Fabric",
    "HS4 Description": "Terry towelling and similar woven terry fabrics, other than narrow fabrics of heading 58.06; tufted textile fabrics, other than products of heading 57.03."
  },
  {
    "HS4": "5803",
    "HS4 Short Name": "Gauze",
    "HS4 Description": "Gauze, other than narrow fabrics of heading 58.06."
  },
  {
    "HS4": "5804",
    "HS4 Short Name": "Tulles and Net Fabric",
    "HS4 Description": "Tulles and other net fabrics, not including woven, knitted or crocheted fabrics; lace in the piece, in strips or in motifs, other than fabrics of headings 60.02 to 60.06."
  },
  {
    "HS4": "5805",
    "HS4 Short Name": "Hand-Woven Tapestries",
    "HS4 Description": "Hand-woven tapestries of the type Gobelins, Flanders, Aubusson, Beauvais and the like, and needle-worked tapestries (for example, petit point, cross stitch), whether or not made up."
  },
  {
    "HS4": "5806",
    "HS4 Short Name": "Narrow Woven Fabric",
    "HS4 Description": "Narrow woven fabrics, other than goods of heading 58.07; narrow fabrics consisting of warp without weft assembled by means of an adhesive (bolducs)."
  },
  {
    "HS4": "5807",
    "HS4 Short Name": "Labels",
    "HS4 Description": "Labels, badges and similar articles of textile materials, in the piece, in strips or cut to shape or size, not embroidered."
  },
  {
    "HS4": "5808",
    "HS4 Short Name": "Ornamental Trimmings",
    "HS4 Description": "Braids in the piece; ornamental trimmings in the piece, without embroidery, other than knitted or crocheted; tassels, pompons and similar articles."
  },
  {
    "HS4": "5809",
    "HS4 Short Name": "Metallic Fabric",
    "HS4 Description": "Woven fabrics of metal thread and woven fabrics of metallised yarn of heading 56.05, of a kind used in apparel, as furnishing fabrics or for similar purposes, not elsewhere specified or included."
  },
  {
    "HS4": "5810",
    "HS4 Short Name": "Embroidery",
    "HS4 Description": "Embroidery in the piece, in strips or in motifs."
  },
  {
    "HS4": "5811",
    "HS4 Short Name": "Quilted Textiles",
    "HS4 Description": "Quilted textile products in the piece, composed of one or more layers of textile materials assembled with padding by stitching or otherwise, other than embroidery of heading 58.10."
  },
  {
    "HS4": "5901",
    "HS4 Short Name": "Gum Coated Textile Fabric",
    "HS4 Description": "Textile fabrics coated with gum or amylaceous substances, of a kind used for the outer covers of books or the like; tracing cloth; prepared painting canvas; buckram and similar stiffened textile fabrics of a kind used for hat foundations."
  },
  {
    "HS4": "5902",
    "HS4 Short Name": "Polyamide Fabric",
    "HS4 Description": "Tyre cord fabric of high tenacity yarn of nylon or other polyamides, polyesters or viscose rayon."
  },
  {
    "HS4": "5903",
    "HS4 Short Name": "Plastic Coated Textile Fabric",
    "HS4 Description": "Textile fabrics impregnated, coated, covered or laminated with plastics, other than those of heading 59.02."
  },
  {
    "HS4": "5904",
    "HS4 Short Name": "Linoleum",
    "HS4 Description": "Linoleum, whether or not cut to shape; floor coverings consisting of a coating or covering applied on a textile backing, whether or not cut to shape."
  },
  {
    "HS4": "5905",
    "HS4 Short Name": "Textile Wall Coverings",
    "HS4 Description": "Textile wall coverings."
  },
  {
    "HS4": "5906",
    "HS4 Short Name": "Rubber Textile Fabric",
    "HS4 Description": "Rubberised textile fabrics, other than those of heading 59.02."
  },
  {
    "HS4": "5907",
    "HS4 Short Name": "Coated Textile Fabric",
    "HS4 Description": "Textile fabrics otherwise impregnated, coated or covered; painted canvas being theatrical scenery, studio back-cloths or the like."
  },
  {
    "HS4": "5908",
    "HS4 Short Name": "Textile Wicks",
    "HS4 Description": "Textile wicks, woven, plaited or knitted , for lamps, stoves, lighters, candles or the like; incandescent gas mantles and tubular knitted gas mantle fabric therefor, whether or not impregnated."
  },
  {
    "HS4": "5909",
    "HS4 Short Name": "Hose Piping Textiles",
    "HS4 Description": "Textile hosepiping and similar textile tubing, with or without lining, armour or accessories of other materials."
  },
  {
    "HS4": "5910",
    "HS4 Short Name": "Conveyor Belt Textiles",
    "HS4 Description": "Transmission or conveyor belts or belting, of textile material, whether or not impregnated, coated, covered or laminated with plastics, or reinforced with metal or other material."
  },
  {
    "HS4": "5911",
    "HS4 Short Name": "Technical Use Textiles",
    "HS4 Description": "Textile products and articles, for technical uses, specified in Note 7 to this Chapter."
  },
  {
    "HS4": "6001",
    "HS4 Short Name": "Pile Fabric",
    "HS4 Description": "Pile fabrics, including “long pile” fabrics and terry fabrics, knitted or crocheted."
  },
  {
    "HS4": "6002",
    "HS4 Short Name": "Light Rubberized Knitted Fabric",
    "HS4 Description": "Knitted or crocheted fabrics of a width not exceeding 30 cm, containing by weight 5 % or more of elastomeric yarn or rubber thread, other than those of heading 60.01."
  },
  {
    "HS4": "6003",
    "HS4 Short Name": "Knitted or crocheted fabrics",
    "HS4 Description": "Knitted or crocheted fabrics of a width not exceeding 30 cm, other than those of heading 60.01 or 60.02."
  },
  {
    "HS4": "6004",
    "HS4 Short Name": "Knitted or crocheted fabrics",
    "HS4 Description": "Knitted or crocheted fabrics of a width exceeding 30 cm, containing by weight 5 % or more of elastomeric yarn or rubber thread, other than those of heading 60.01."
  },
  {
    "HS4": "6005",
    "HS4 Short Name": "Warp knit fabrics ",
    "HS4 Description": "Warp knit fabrics (including those made on galloon knitting machines), other than those of headings 60.01 to 60.04."
  },
  {
    "HS4": "6006",
    "HS4 Short Name": "Other knitted or crocheted fabrics.",
    "HS4 Description": "Other knitted or crocheted fabrics."
  },
  {
    "HS4": "6101",
    "HS4 Short Name": "Knit Men's Coats",
    "HS4 Description": "Men's or boys' overcoats, car-coats, capes, cloaks, anoraks (including ski-jackets), wind-cheaters, wind-jackets and similar articles, knitted or crocheted, other than those of heading 61.03."
  },
  {
    "HS4": "6102",
    "HS4 Short Name": "Knit Women's Coats",
    "HS4 Description": "Women's or girls' overcoats, car-coats, capes, cloaks, anoraks (including ski-jackets), wind-cheaters, windjackets and similar articles, knitted or crocheted, other than those of heading 61.04."
  },
  {
    "HS4": "6103",
    "HS4 Short Name": "Knit Men's Suits",
    "HS4 Description": "Men's or boys' suits, ensembles, jackets, blazers, trousers, bib and brace overalls, breeches and shorts (other than swimwear), knitted or crocheted."
  },
  {
    "HS4": "6104",
    "HS4 Short Name": "Knit Women's Suits",
    "HS4 Description": "Women's or girls' suits, ensembles, jackets, blazers, dresses, skirts, divided skirts, trousers, bib and brace overalls, breeches and shorts (other than swimwear), knitted or crocheted."
  },
  {
    "HS4": "6105",
    "HS4 Short Name": "Knit Men's Shirts",
    "HS4 Description": "Men's or boys' shirts, knitted or crocheted."
  },
  {
    "HS4": "6106",
    "HS4 Short Name": "Knit Women's Shirts",
    "HS4 Description": "Women's or girls' blouses, shirts and shirt-blouses, knitted or crocheted."
  },
  {
    "HS4": "6107",
    "HS4 Short Name": "Knit Men's Undergarments",
    "HS4 Description": "Men's or boys' underpants, briefs, nightshirts, pyjamas, bathrobes, dressing gowns and similar articles, knitted or crocheted."
  },
  {
    "HS4": "6108",
    "HS4 Short Name": "Knit Women's Undergarments",
    "HS4 Description": "Women's or girls' slips, petticoats, briefs, panties, nightdresses, pyjamas, negligees, bathrobes, dressing gowns and similar articles, knitted or crocheted."
  },
  {
    "HS4": "6109",
    "HS4 Short Name": "Knit T-shirts",
    "HS4 Description": "T-shirts, singlets and other vests, knitted or crocheted."
  },
  {
    "HS4": "6110",
    "HS4 Short Name": "Knit Sweaters",
    "HS4 Description": "Jerseys, pullovers, cardigans, waistcoats and similar articles, knitted or crocheted."
  },
  {
    "HS4": "6111",
    "HS4 Short Name": "Knit Babies' Garments",
    "HS4 Description": "Babies' garments and clothing accessories, knitted or crocheted."
  },
  {
    "HS4": "6112",
    "HS4 Short Name": "Knit Active Wear",
    "HS4 Description": "Track suits, ski suits and swimwear, knitted or crocheted."
  },
  {
    "HS4": "6113",
    "HS4 Short Name": "Garments of Impregnated Fabric",
    "HS4 Description": "Garments, made up of knitted or crocheted fabrics of heading 59.03, 59.06 or 59.07."
  },
  {
    "HS4": "6114",
    "HS4 Short Name": "Other Knit Garments",
    "HS4 Description": "Other garments, knitted or crocheted."
  },
  {
    "HS4": "6115",
    "HS4 Short Name": "Knit Socks and Hosiery",
    "HS4 Description": "Panty hose, tights, stockings, socks and other hosiery, including graduated compression hosiery (for example, stockings for varicose veins) and footwear without applied soles, knitted or crocheted."
  },
  {
    "HS4": "6116",
    "HS4 Short Name": "Knit Gloves",
    "HS4 Description": "Gloves, mittens and mitts, knitted or crocheted."
  },
  {
    "HS4": "6117",
    "HS4 Short Name": "Other Knit Clothing Accessories",
    "HS4 Description": "Other made up clothing accessories, knitted or crocheted; knitted or crocheted parts of garments or of clothing accessories."
  },
  {
    "HS4": "6201",
    "HS4 Short Name": "Non-Knit Men's Coats",
    "HS4 Description": "Men's or boys' overcoats, car-coats, capes, cloaks, anoraks (including ski-jackets), wind-cheaters, wind-jackets and similar articles, other than those of heading 62.03."
  },
  {
    "HS4": "6202",
    "HS4 Short Name": "Non-Knit Women's Coats",
    "HS4 Description": "Women's or girls' overcoats, car-coats, capes, cloaks, anoraks (including ski-jackets), wind-cheaters, wind-jackets and similar articles, other than those of heading 62.04."
  },
  {
    "HS4": "6203",
    "HS4 Short Name": "Non-Knit Men's Suits",
    "HS4 Description": "Men's or boys' suits, ensembles, jackets, blazers, trousers, bib and brace overalls, breeches and shorts (other than swimwear)."
  },
  {
    "HS4": "6204",
    "HS4 Short Name": "Non-Knit Women's Suits",
    "HS4 Description": "Women's or girls' suits, ensembles, jackets, blazers, dresses, skirts, divided skirts, trousers, bib and brace overalls, breeches and shorts (other than swimwear)."
  },
  {
    "HS4": "6205",
    "HS4 Short Name": "Non-Knit Men's Shirts",
    "HS4 Description": "Men's or boys' shirts."
  },
  {
    "HS4": "6206",
    "HS4 Short Name": "Non-Knit Women's Shirts",
    "HS4 Description": "Women's or girls' blouses, shirts and shirt-blouses."
  },
  {
    "HS4": "6207",
    "HS4 Short Name": "Non-Knit Men's Undergarments",
    "HS4 Description": "Men's or boys' singlets and other vests, underpants, briefs, nightshirts, pyjamas, bathrobes, dressing gowns and similar articles."
  },
  {
    "HS4": "6208",
    "HS4 Short Name": "Non-Knit Women's Undergarments",
    "HS4 Description": "Women's or girls' singlets and other vests, slips, petticoats, briefs, panties, nightdresses, pyjamas, negligees, bathrobes, dressing gowns and similar articles."
  },
  {
    "HS4": "6209",
    "HS4 Short Name": "Non-Knit Babies' Garments",
    "HS4 Description": "Babies' garments and clothing accessories."
  },
  {
    "HS4": "6210",
    "HS4 Short Name": "Felt or Coated Fabric Garments",
    "HS4 Description": "Garments, made up of fabrics of heading 56.02, 56.03, 59.03, 59.06 or 59.07."
  },
  {
    "HS4": "6211",
    "HS4 Short Name": "Non-Knit Active Wear",
    "HS4 Description": "Track suits, ski suits and swimwear; other garments."
  },
  {
    "HS4": "6212",
    "HS4 Short Name": "Other Women's Undergarments",
    "HS4 Description": "Brassieres, girdles, corsets, braces, suspenders, garters and similar articles and parts thereof, whether or not knitted or crocheted."
  },
  {
    "HS4": "6213",
    "HS4 Short Name": "Handkerchiefs",
    "HS4 Description": "Handkerchiefs."
  },
  {
    "HS4": "6214",
    "HS4 Short Name": "Scarves",
    "HS4 Description": "Shawls, scarves, mufflers, mantillas, veils and the like."
  },
  {
    "HS4": "6215",
    "HS4 Short Name": "Neck Ties",
    "HS4 Description": "Ties, bow ties and cravats."
  },
  {
    "HS4": "6216",
    "HS4 Short Name": "Non-Knit Gloves",
    "HS4 Description": "Gloves, mittens and mitts."
  },
  {
    "HS4": "6217",
    "HS4 Short Name": "Other Non-Knit Clothing Accessories",
    "HS4 Description": "Other made up clothing accessories; parts of garments or of clothing accessories, other than those of heading 62.12."
  },
  {
    "HS4": "6301",
    "HS4 Short Name": "Blankets",
    "HS4 Description": "Blankets and travelling rugs."
  },
  {
    "HS4": "6302",
    "HS4 Short Name": "House Linens",
    "HS4 Description": "Bed linen, table linen, toilet linen and kitchen linen."
  },
  {
    "HS4": "6303",
    "HS4 Short Name": "Window Dressings",
    "HS4 Description": "Curtains (including drapes) and interior blinds; curtain or bed valances."
  },
  {
    "HS4": "6304",
    "HS4 Short Name": "Bedspreads",
    "HS4 Description": "Other furnishing articles, excluding those of heading 94.04."
  },
  {
    "HS4": "6305",
    "HS4 Short Name": "Packing Bags",
    "HS4 Description": "Sacks and bags, of a kind used for the packing of goods."
  },
  {
    "HS4": "6306",
    "HS4 Short Name": "Awnings, Tents, and Sails",
    "HS4 Description": "Tarpaulins, awnings and sunblinds; tents; sails for boats, sailboards or landcraft; camping goods."
  },
  {
    "HS4": "6307",
    "HS4 Short Name": "Other Cloth Articles",
    "HS4 Description": "Other made up articles, including dress patterns."
  },
  {
    "HS4": "6308",
    "HS4 Short Name": "Packaged Sewing Sets",
    "HS4 Description": "Sets consisting of woven fabric and yarn, whether or not with accessories, for making up into rugs, tapestries, embroidered table cloths or serviettes, or similar textile articles, put up in packings for retail sale."
  },
  {
    "HS4": "6309",
    "HS4 Short Name": "Used Clothing",
    "HS4 Description": "Worn clothing and other worn articles."
  },
  {
    "HS4": "6310",
    "HS4 Short Name": "Textile Scraps",
    "HS4 Description": "Used or new rags, scrap twine, cordage, rope and cables and worn out articles of twine, cordage, rope or cables, of textile materials."
  },
  {
    "HS4": "6401",
    "HS4 Short Name": "Waterproof Footwear",
    "HS4 Description": "Waterproof footwear with outer soles and uppers of rubber or of plastics, the uppers of which are neither fixed to the sole nor assembled by stitching, riveting, nailing, screwing, plugging or similar processes."
  },
  {
    "HS4": "6402",
    "HS4 Short Name": "Rubber Footwear",
    "HS4 Description": "Other footwear with outer soles and uppers of rubber or plastics."
  },
  {
    "HS4": "6403",
    "HS4 Short Name": "Leather Footwear",
    "HS4 Description": "Footwear with outer soles of rubber, plastics, leather or composition leather and uppers of leather."
  },
  {
    "HS4": "6404",
    "HS4 Short Name": "Textile Footwear",
    "HS4 Description": "Footwear with outer soles of rubber, plastics, leather or composition leather and uppers of textile materials."
  },
  {
    "HS4": "6405",
    "HS4 Short Name": "Other Footwear",
    "HS4 Description": "Other footwear."
  },
  {
    "HS4": "6406",
    "HS4 Short Name": "Footwear Parts",
    "HS4 Description": "Parts of footwear (including uppers whether or not attached to soles other than outer soles); removable in-soles, heel cushions and similar articles; gaiters, leggings and similar articles, and parts thereof."
  },
  {
    "HS4": "6501",
    "HS4 Short Name": "Hat Forms",
    "HS4 Description": "Hat-forms, hat bodies and hoods of felt, neither blocked to shape nor with made brims; plateaux and manchons (including slit manchons), of felt."
  },
  {
    "HS4": "6502",
    "HS4 Short Name": "Hat Shapes",
    "HS4 Description": "Hat-shapes, plaited or made by assembling strips of any material, neither blocked to shape, nor with made brims, nor lined, nor trimmed."
  },
  {
    "HS4": "6503",
    "HS4 Short Name": "Felt Hats",
    "HS4 Description": "(-2006) Felt hats and other felt headgear, made from the hat bodies, hoods or plateaux of heading 6501, whether or not lined or trimmed (excl. made by assembling strips or pieces of felt, and toy and carnival headgear)"
  },
  {
    "HS4": "6504",
    "HS4 Short Name": "Hats",
    "HS4 Description": "Hats and other headgear, plaited or made by assembling strips of any material, whether or not lined or trimmed."
  },
  {
    "HS4": "6505",
    "HS4 Short Name": "Knitted Hats",
    "HS4 Description": "Hats and other headgear, knitted or crocheted, or made up from lace, felt or other textile fabric, in the piece (but not in strips), whether or not lined or trimmed; hair-nets of any material, whether or not lined or trimmed."
  },
  {
    "HS4": "6506",
    "HS4 Short Name": "Other Headwear",
    "HS4 Description": "Other headgear, whether or not lined or trimmed."
  },
  {
    "HS4": "6507",
    "HS4 Short Name": "Headbands and Linings",
    "HS4 Description": "Head-bands, linings, covers, hat foundations, hat frames, peaks and chinstraps, for headgear."
  },
  {
    "HS4": "6601",
    "HS4 Short Name": "Umbrellas",
    "HS4 Description": "Umbrellas and sun umbrellas (including walking-stick umbrellas, garden umbrellas and similar umbrellas)."
  },
  {
    "HS4": "6602",
    "HS4 Short Name": "Walking Sticks",
    "HS4 Description": "Walking-sticks, seat-sticks, whips, riding-crops and the like."
  },
  {
    "HS4": "6603",
    "HS4 Short Name": "Umbrella and Walking Stick Accessories",
    "HS4 Description": "Parts, trimmings and accessories of articles of heading 66.01 or 66.02."
  },
  {
    "HS4": "6701",
    "HS4 Short Name": "Bird Skins and Feathers",
    "HS4 Description": "Skins and other parts of birds with their feathers or down, feathers, parts of feathers, down and articles thereof (other than goods of heading 05.05 and worked quills and scapes)."
  },
  {
    "HS4": "6702",
    "HS4 Short Name": "Artificial Vegetation",
    "HS4 Description": "Artificial flowers, foliage and fruit and parts thereof; articles made of artificial flowers, foliage or fruit."
  },
  {
    "HS4": "6703",
    "HS4 Short Name": "Processed Hair",
    "HS4 Description": "Human hair, dressed, thinned, bleached or otherwise worked; wool or other animal hair or other textile materials, prepared for use in making wigs or the like."
  },
  {
    "HS4": "6704",
    "HS4 Short Name": "Fake Hair",
    "HS4 Description": "Wigs, false beards, eyebrows and eyelashes, switches and the like, of human or animal hair or of textile materials; articles of human hair not elsewhere specified or included."
  },
  {
    "HS4": "6801",
    "HS4 Short Name": "Curbstones",
    "HS4 Description": "Setts, curbstones and flagstones, of natural stone (except slate)."
  },
  {
    "HS4": "6802",
    "HS4 Short Name": "Building Stone",
    "HS4 Description": "Worked monumental or building stone (except slate) and articles thereof, other than goods of heading 68.01; mosaic cubes and the like, of natural stone (including slate), whether or not on a backing; artificially coloured granules, chippings and powder, o"
  },
  {
    "HS4": "6803",
    "HS4 Short Name": "Slate",
    "HS4 Description": "Worked slate and articles of slate or of agglomerated slate."
  },
  {
    "HS4": "6804",
    "HS4 Short Name": "Milling Stones",
    "HS4 Description": "Millstones, grindstones, grinding wheels and the like, without frameworks, for grinding, sharpening, polishing, trueing or cutting, hand sharpening or polishing stones, and parts thereof, of natural stone, of agglomerated natural or artificial abrasives,"
  },
  {
    "HS4": "6805",
    "HS4 Short Name": "Abrasive Powder",
    "HS4 Description": "Natural or artificial abrasive powder or grain, on a base of textile material, of paper, of paperboard or of other materials, whether or not cut to shape or sewn or otherwise made up."
  },
  {
    "HS4": "6806",
    "HS4 Short Name": "Rock Wool",
    "HS4 Description": "Slag wool, rock wool and similar mineral wools; exfoliated vermiculite, expanded clays, foamed slag and similar expanded mineral materials; mixtures and articles of heat-insulating, sound-insulating or sound-absorbing mineral materials, other than those o"
  },
  {
    "HS4": "6807",
    "HS4 Short Name": "Asphalt",
    "HS4 Description": "Articles of asphalt or of similar material (for example, petroleum bitumen or coal tar pitch)."
  },
  {
    "HS4": "6808",
    "HS4 Short Name": "Vegetable Fiber",
    "HS4 Description": "Panels, boards, tiles, blocks and similar articles of vegetable fibre, of straw or of shavings, chips, particles, sawdust or other waste, of wood, agglomerated with cement, plaster or other mineral binders."
  },
  {
    "HS4": "6809",
    "HS4 Short Name": "Plaster Articles",
    "HS4 Description": "Articles of plaster or of compositions based on plaster."
  },
  {
    "HS4": "6810",
    "HS4 Short Name": "Cement Articles",
    "HS4 Description": "Articles of cement, of concrete or of artificial stone, whether or not reinforced."
  },
  {
    "HS4": "6811",
    "HS4 Short Name": "Asbestos Cement Articles",
    "HS4 Description": "Articles of asbestos-cement, of cellulose fibre-cement or the like."
  },
  {
    "HS4": "6812",
    "HS4 Short Name": "Asbestos Fibres",
    "HS4 Description": "Fabricated asbestos fibres; mixtures with a basis of asbestos or with a basis of asbestos and magnesium carbonate; articles of such mixtures or of asbestos (for example, thread, woven fabric, clothing, headgear, footwear, gaskets), whether or not reinforc"
  },
  {
    "HS4": "6813",
    "HS4 Short Name": "Friction Material",
    "HS4 Description": "Friction material and articles thereof (for example, sheets, rolls, strips, segments, discs, washers, pads), not mounted, for brakes, for clutches or the like, with a basis of asbestos, of other mineral substances or of cellulose, whether or not combined"
  },
  {
    "HS4": "6814",
    "HS4 Short Name": "Mica",
    "HS4 Description": "Worked mica and articles of mica, including agglomerated or reconstituted mica, whether or not on a support of paper, paperboard or other materials."
  },
  {
    "HS4": "6815",
    "HS4 Short Name": "Other Stone Articles",
    "HS4 Description": "Articles of stone or of other mineral substances (including carbon fibres, articles of carbon fibres and articles of peat), not elsewhere specified or included."
  },
  {
    "HS4": "6901",
    "HS4 Short Name": "Bricks",
    "HS4 Description": "Bricks, blocks, tiles and other ceramic goods of siliceous fossil meals (for example, kieselguhr, tripolite or diatomite) or of similar siliceous earths."
  },
  {
    "HS4": "6902",
    "HS4 Short Name": "Refractory Bricks",
    "HS4 Description": "Refractory bricks, blocks, tiles and similar refractory ceramic constructional goods, other than those of siliceous fossil meals or similar siliceous earths."
  },
  {
    "HS4": "6903",
    "HS4 Short Name": "Refractory Ceramics",
    "HS4 Description": "Other refractory ceramic goods (for example, retorts, crucibles, muffles, nozzles, plugs, supports, cupels, tubes, pipes, sheaths and rods), other than those of siliceous fossil meals or of similar siliceous earths."
  },
  {
    "HS4": "6904",
    "HS4 Short Name": "Ceramic Bricks",
    "HS4 Description": "Ceramic building bricks, flooring blocks, support or filler tiles and the like."
  },
  {
    "HS4": "6905",
    "HS4 Short Name": "Roofing Tiles",
    "HS4 Description": "Roofing tiles, chimney-pots, cowls, chimney liners, architectural ornaments and other ceramic constructional goods."
  },
  {
    "HS4": "6906",
    "HS4 Short Name": "Ceramic Pipes",
    "HS4 Description": "Ceramic pipes, conduits, guttering and pipe fittings."
  },
  {
    "HS4": "6907",
    "HS4 Short Name": "Unglazed Ceramics",
    "HS4 Description": "Unglazed ceramic flags and paving, hearth or wall tiles; unglazed ceramic mosaic cubes and the like, whether or not on a backing."
  },
  {
    "HS4": "6908",
    "HS4 Short Name": "Glazed Ceramics",
    "HS4 Description": "Glazed ceramic flags and paving, hearth or wall tiles; glazed ceramic mosaic cubes and the like, whether or not on a backing."
  },
  {
    "HS4": "6909",
    "HS4 Short Name": "Laboratory Ceramic Ware",
    "HS4 Description": "Ceramic wares for laboratory, chemical or other technical uses; ceramic troughs, tubs and similar receptacles of a kind used in agriculture; ceramic pots, jars and similar articles of a kind used for the conveyance or packing of goods."
  },
  {
    "HS4": "6910",
    "HS4 Short Name": "Bathroom Ceramics",
    "HS4 Description": "Ceramic sinks, wash basins, wash basin pedestals, baths, bidets, water closet pans, flushing cisterns, urinals and similar sanitary fixtures."
  },
  {
    "HS4": "6911",
    "HS4 Short Name": "Porcelain Tableware",
    "HS4 Description": "Tableware, kitchenware, other household articles and toilet articles, of porcelain or china."
  },
  {
    "HS4": "6912",
    "HS4 Short Name": "Ceramic Tableware",
    "HS4 Description": "Ceramic tableware, kitchenware, other household articles and toilet articles, other than of porcelain or china."
  },
  {
    "HS4": "6913",
    "HS4 Short Name": "Ornamental Ceramics",
    "HS4 Description": "Statuettes and other ornamental ceramic articles."
  },
  {
    "HS4": "6914",
    "HS4 Short Name": "Other Ceramic Articles",
    "HS4 Description": "Other ceramic articles."
  },
  {
    "HS4": "7001",
    "HS4 Short Name": "Glass Scraps",
    "HS4 Description": "Cullet and other waste and scrap of glass; glass in the mass."
  },
  {
    "HS4": "7002",
    "HS4 Short Name": "Glass Balls",
    "HS4 Description": "Glass in balls (other than microspheres of heading 70.18), rods or tubes, unworked."
  },
  {
    "HS4": "7003",
    "HS4 Short Name": "Cast or Rolled Glass",
    "HS4 Description": "Cast glass and rolled glass, in sheets or profiles, whether or not having an absorbent, reflecting or non-reflecting layer, but not otherwise worked."
  },
  {
    "HS4": "7004",
    "HS4 Short Name": "Blown Glass",
    "HS4 Description": "Drawn glass and blown glass, in sheets, whether or not having an absorbent, reflecting or non-reflecting layer, but not otherwise worked."
  },
  {
    "HS4": "7005",
    "HS4 Short Name": "Float Glass",
    "HS4 Description": "Float glass and surface ground or polished glass, in sheets, whether or not having an absorbent, reflecting or non-reflecting layer, but not otherwise worked."
  },
  {
    "HS4": "7006",
    "HS4 Short Name": "Glass with Edge Workings",
    "HS4 Description": "Glass of heading 70.03, 70.04 or 70.05, bent, edge-worked, engraved, drilled, enamelled or otherwise worked, but not framed or fitted with other materials."
  },
  {
    "HS4": "7007",
    "HS4 Short Name": "Safety Glass",
    "HS4 Description": "Safety glass, consisting of toughened (tempered) or laminated glass."
  },
  {
    "HS4": "7008",
    "HS4 Short Name": "Insulating Glass",
    "HS4 Description": "Multiple-walled insulating units of glass."
  },
  {
    "HS4": "7009",
    "HS4 Short Name": "Glass Mirrors",
    "HS4 Description": "Glass mirrors, whether or not framed, including rear-view mirrors."
  },
  {
    "HS4": "7010",
    "HS4 Short Name": "Glass Bottles",
    "HS4 Description": "Carboys, bottles, flasks, jars, pots, phials, ampoules and other containers, of glass, of a kind used for the conveyance or packing of goods; preserving jars of glass; stoppers, lids and other closures, of glass."
  },
  {
    "HS4": "7011",
    "HS4 Short Name": "Glass Bulbs",
    "HS4 Description": "Glass envelopes (including bulbs and tubes), open, and glass parts thereof, without fittings, for electric lamps, cathode-ray tubes or the like."
  },
  {
    "HS4": "7012",
    "HS4 Short Name": "Vacuum Flasks Glass Inners",
    "HS4 Description": "(-2006) Glass inners for vacuum flasks or for other vacuum vessels"
  },
  {
    "HS4": "7013",
    "HS4 Short Name": "Interior Decorative Glassware",
    "HS4 Description": "Glassware of a kind used for table, kitchen, toilet, office, indoor decoration or similar purposes (other than that of heading 70.10 or 70.18)."
  },
  {
    "HS4": "7014",
    "HS4 Short Name": "Signaling Glassware",
    "HS4 Description": "Signalling glassware and optical elements of glass (other than those of heading 70.15), not optically worked."
  },
  {
    "HS4": "7015",
    "HS4 Short Name": "Eyewear and Clock Glass",
    "HS4 Description": "Clock or watch glasses and similar glasses, glasses for noncorrective or corrective spectacles, curved, bent, hollowed or the like, not optically worked; hollow glass spheres and their segments, for the manufacture of such glasses."
  },
  {
    "HS4": "7016",
    "HS4 Short Name": "Glass Bricks",
    "HS4 Description": "Paving blocks, slabs, bricks, squares, tiles and other articles of pressed or moulded glass, whether or not wired, of a kind used for building or construction purposes; glass cubes and other glass smallwares, whether or not on a backing, for mosaics or si"
  },
  {
    "HS4": "7017",
    "HS4 Short Name": "Laboratory Glassware",
    "HS4 Description": "Laboratory, hygienic or pharmaceutical glassware, whether or not graduated or calibrated."
  },
  {
    "HS4": "7018",
    "HS4 Short Name": "Glass Beads",
    "HS4 Description": "Glass beads, imitation pearls, imitation precious or semi-precious stones and similar glass smallwares, and articles thereof other than imitation jewellery; glass eyes other than prosthetic articles; statuettes and other ornaments of lamp-worked glass, ot"
  },
  {
    "HS4": "7019",
    "HS4 Short Name": "Glass Fibers",
    "HS4 Description": "Glass fibres (including glass wool) and articles thereof (for example, yarn, woven fabrics)."
  },
  {
    "HS4": "7020",
    "HS4 Short Name": "Other Glass Articles",
    "HS4 Description": "Other articles of glass."
  },
  {
    "HS4": "7101",
    "HS4 Short Name": "Pearls",
    "HS4 Description": "Pearls, natural or cultured, whether or not worked or graded but not strung, mounted or set; pearls, natural or cultured, temporarily strung for convenience of transport."
  },
  {
    "HS4": "7102",
    "HS4 Short Name": "Diamonds",
    "HS4 Description": "Diamonds, whether or not worked, but not mounted or set."
  },
  {
    "HS4": "7103",
    "HS4 Short Name": "Precious Stones",
    "HS4 Description": "Precious stones (other than diamonds) and semi-precious stones, whether or not worked or graded but not strung, mounted or set; ungraded precious stones (other than diamonds) and semiprecious stones, temporarily strung for convenience of transport."
  },
  {
    "HS4": "7104",
    "HS4 Short Name": "Synthetic Reconstructed Jewellery Stones",
    "HS4 Description": "Synthetic or reconstructed precious or semi-precious stones, whether or not worked or graded but not strung, mounted or set; ungraded synthetic or reconstructed precious or semi-precious stones, temporarily strung for convenience of transport."
  },
  {
    "HS4": "7105",
    "HS4 Short Name": "Precious Stone Dust",
    "HS4 Description": "Dust and powder of natural or synthetic precious or semiprecious stones."
  },
  {
    "HS4": "7106",
    "HS4 Short Name": "Silver",
    "HS4 Description": "Silver (including silver plated with gold or platinum), unwrought or in semi-manufactured forms, or in powder form."
  },
  {
    "HS4": "7107",
    "HS4 Short Name": "Silver Clad Metals",
    "HS4 Description": "Base metals clad with silver, not further worked than semimanufactured."
  },
  {
    "HS4": "7108",
    "HS4 Short Name": "Gold",
    "HS4 Description": "Gold (including gold plated with platinum) unwrought or in semi-manufactured forms, or in powder form."
  },
  {
    "HS4": "7109",
    "HS4 Short Name": "Gold Clad Metals",
    "HS4 Description": "Base metals or silver, clad with gold, not further worked than semi-manufactured."
  },
  {
    "HS4": "7110",
    "HS4 Short Name": "Platinum",
    "HS4 Description": "Platinum, unwrought or in semi-manufactured forms, or in powder form."
  },
  {
    "HS4": "7111",
    "HS4 Short Name": "Platinum Clad Metals",
    "HS4 Description": "Base metals, silver or gold, clad with platinum, not further worked than semi-manufactured."
  },
  {
    "HS4": "7112",
    "HS4 Short Name": "Precious Metal Scraps",
    "HS4 Description": "Waste and scrap of precious metal or of metal clad with precious metal; other waste and scrap containing precious metal or precious metal compounds, of a kind used principally for the recovery of precious metal."
  },
  {
    "HS4": "7113",
    "HS4 Short Name": "Jewellery",
    "HS4 Description": "Articles of jewellery and parts thereof, of precious metal or of metal clad with precious metal."
  },
  {
    "HS4": "7114",
    "HS4 Short Name": "Metal-Clad Products",
    "HS4 Description": "Articles of goldsmiths' or silversmiths' wares and parts thereof, of precious metal or of metal clad with precious metal."
  },
  {
    "HS4": "7115",
    "HS4 Short Name": "Other Precious Metal Products",
    "HS4 Description": "Other articles of precious metal or of metal clad with precious metal."
  },
  {
    "HS4": "7116",
    "HS4 Short Name": "Pearl Products",
    "HS4 Description": "Articles of natural or cultured pearls, precious or semi-precious stones (natural, synthetic or reconstructed)."
  },
  {
    "HS4": "7117",
    "HS4 Short Name": "Imitation Jewellery",
    "HS4 Description": "Imitation jewellery."
  },
  {
    "HS4": "7118",
    "HS4 Short Name": "Coin",
    "HS4 Description": "Coin."
  },
  {
    "HS4": "7201",
    "HS4 Short Name": "Pig Iron",
    "HS4 Description": "Pig iron and spiegeleisen in pigs, blocks or other primary forms."
  },
  {
    "HS4": "7202",
    "HS4 Short Name": "Ferroalloys",
    "HS4 Description": "Ferro-alloys."
  },
  {
    "HS4": "7203",
    "HS4 Short Name": "Iron Reductions",
    "HS4 Description": "Ferrous products obtained by direct reduction of iron ore and other spongy ferrous products, in lumps, pellets or similar forms; iron having a minimum purity by weight of 99.94 %, in lumps, pellets or similar forms."
  },
  {
    "HS4": "7204",
    "HS4 Short Name": "Scrap Iron",
    "HS4 Description": "Ferrous waste and scrap; remelting scrap ingots of iron or steel."
  },
  {
    "HS4": "7205",
    "HS4 Short Name": "Iron Powder",
    "HS4 Description": "Granules and powders, of pig iron, spiegeleisen, iron or steel."
  },
  {
    "HS4": "7206",
    "HS4 Short Name": "Iron Ingots",
    "HS4 Description": "Iron and non-alloy steel in ingots or other primary forms (excluding iron of heading 72.03)."
  },
  {
    "HS4": "7207",
    "HS4 Short Name": "Semi-Finished Iron",
    "HS4 Description": "Semi-finished products of iron or non-alloy steel."
  },
  {
    "HS4": "7208",
    "HS4 Short Name": "Hot-Rolled Iron",
    "HS4 Description": "Flat-rolled products of iron or non-alloy steel, of a width of 600 mm or more, hot-rolled, not clad, plated or coated."
  },
  {
    "HS4": "7209",
    "HS4 Short Name": "Cold-Rolled Iron",
    "HS4 Description": "Flat-rolled products of iron or non-alloy steel, of a width of 600 mm or more, cold-rolled (cold-reduced), not clad, plated or coated."
  },
  {
    "HS4": "7210",
    "HS4 Short Name": "Coated Flat-Rolled Iron",
    "HS4 Description": "Flat-rolled products of iron or non-alloy steel, of a width of 600 mm or more, clad, plated or coated."
  },
  {
    "HS4": "7211",
    "HS4 Short Name": "Large Flat-Rolled Iron",
    "HS4 Description": "Flat-rolled products of iron or non-alloy steel, of a width of less than 600 mm, not clad, plated or coated."
  },
  {
    "HS4": "7212",
    "HS4 Short Name": "Large Coated Flat-Rolled Iron",
    "HS4 Description": "Flat-rolled products of iron or non-alloy steel, of a width of less than 600 mm, clad, plated or coated."
  },
  {
    "HS4": "7213",
    "HS4 Short Name": "Hot-Rolled Iron Bars",
    "HS4 Description": "Bars and rods, hot-rolled, in irregularly wound coils, of iron or non-alloy steel."
  },
  {
    "HS4": "7214",
    "HS4 Short Name": "Raw Iron Bars",
    "HS4 Description": "Other bars and rods of iron or non-alloy steel, not further worked than forged, hot-rolled, hot-drawn or hot-extruded, but including those twisted after rolling."
  },
  {
    "HS4": "7215",
    "HS4 Short Name": "Other Iron Bars",
    "HS4 Description": "Other bars and rods of iron or non-alloy steel."
  },
  {
    "HS4": "7216",
    "HS4 Short Name": "Iron Blocks",
    "HS4 Description": "Angles, shapes and sections of iron or non-alloy steel."
  },
  {
    "HS4": "7217",
    "HS4 Short Name": "Iron Wire",
    "HS4 Description": "Wire of iron or non-alloy steel."
  },
  {
    "HS4": "7218",
    "HS4 Short Name": "Stainless Steel Ingots",
    "HS4 Description": "Stainless steel in ingots or other primary forms; semi-finished products of stainless steel."
  },
  {
    "HS4": "7219",
    "HS4 Short Name": "Large Flat-Rolled Stainless Steel",
    "HS4 Description": "Flat-rolled products of stainless steel, of a width of 600 mm or more."
  },
  {
    "HS4": "7220",
    "HS4 Short Name": "Flat-Rolled Stainless Steel",
    "HS4 Description": "Flat-rolled products of stainless steel, of a width of less than 600 mm."
  },
  {
    "HS4": "7221",
    "HS4 Short Name": "Hot-Rolled Stainless Steel Bars",
    "HS4 Description": "Bars and rods, hot-rolled, in irregularly wound coils, of stainless steel."
  },
  {
    "HS4": "7222",
    "HS4 Short Name": "Other Stainless Steel Bars",
    "HS4 Description": "Other bars and rods of stainless steel; angles, shapes and sections of stainless steel."
  },
  {
    "HS4": "7223",
    "HS4 Short Name": "Stainless Steel Wire",
    "HS4 Description": "Wire of stainless steel."
  },
  {
    "HS4": "7224",
    "HS4 Short Name": "Steel Ingots",
    "HS4 Description": "Other alloy steel in ingots or other primary forms; semi-finished products of other alloy steel."
  },
  {
    "HS4": "7225",
    "HS4 Short Name": "Flat Flat-Rolled Steel",
    "HS4 Description": "Flat-rolled products of other alloy steel, of a width of 600 mm or more."
  },
  {
    "HS4": "7226",
    "HS4 Short Name": "Flat-Rolled Iron",
    "HS4 Description": "Flat-rolled products of other alloy steel, of a width of less than 600 mm."
  },
  {
    "HS4": "7227",
    "HS4 Short Name": "Steel Bars",
    "HS4 Description": "Bars and rods, hot-rolled, in irregularly wound coils, of other alloy steel."
  },
  {
    "HS4": "7228",
    "HS4 Short Name": "Other Steel Bars",
    "HS4 Description": "Other bars and rods of other alloy steel; angles, shapes and sections, of other alloy steel; hollow drill bars and rods, of alloy or non-alloy steel."
  },
  {
    "HS4": "7229",
    "HS4 Short Name": "Steel Wire",
    "HS4 Description": "Wire of other alloy steel."
  },
  {
    "HS4": "7301",
    "HS4 Short Name": "Iron Sheet Piling",
    "HS4 Description": "Sheet piling of iron or steel, whether or not drilled, punched or made from assembled elements; welded angles, shapes and sections, of iron or steel."
  },
  {
    "HS4": "7302",
    "HS4 Short Name": "Iron Railway Products",
    "HS4 Description": "Railway or tramway track construction material of iron or steel, the following : rails, check-rails and rack rails, switch blades, crossing frogs, point rods and other crossing pieces, sleepers (cross-ties), fish-plates, chairs, chair wedges, sole plates"
  },
  {
    "HS4": "7303",
    "HS4 Short Name": "Cast Iron Pipes",
    "HS4 Description": "Tubes, pipes and hollow profiles, of cast iron."
  },
  {
    "HS4": "7304",
    "HS4 Short Name": "Iron Pipes",
    "HS4 Description": "Tubes, pipes and hollow profiles, seamless, of iron (other than cast iron) or steel."
  },
  {
    "HS4": "7305",
    "HS4 Short Name": "Other Large Iron Pipes",
    "HS4 Description": "Other tubes and pipes (for example, welded, riveted or similarly closed), having circular cross-sections, the external diameter of which exceeds 406.4 mm, of iron or steel."
  },
  {
    "HS4": "7306",
    "HS4 Short Name": "Other Small Iron Pipes",
    "HS4 Description": "Other tubes, pipes and hollow profiles (for example, open seam or welded, riveted or similarly closed), of iron or steel."
  },
  {
    "HS4": "7307",
    "HS4 Short Name": "Iron Pipe Fittings",
    "HS4 Description": "Tube or pipe fittings (for example, couplings, elbows, sleeves), of iron or steel."
  },
  {
    "HS4": "7308",
    "HS4 Short Name": "Iron Structures",
    "HS4 Description": "Structures (excluding prefabricated buildings of heading 94.06) and parts of structures (for example, bridges and bridge-sections, lock-gates, towers, lattice masts, roofs, roofing frame-works, doors and windows and their frames and thresholds for doors,"
  },
  {
    "HS4": "7309",
    "HS4 Short Name": "Large Iron Containers",
    "HS4 Description": "Reservoirs, tanks, vats and similar containers for any material (other than compressed or liquefied gas), of iron or steel, of a capacity exceeding 300 l, whether or not lined or heat-insulated, but not fitted with mechanical or thermal equipment."
  },
  {
    "HS4": "7310",
    "HS4 Short Name": "Small Iron Containers",
    "HS4 Description": "Tanks, casks, drums, cans, boxes and similar containers, for any material (other than compressed or liquefied gas), of iron or steel, of a capacity not exceeding 300 l, whether or not lined or heatinsulated, but not fitted with mechanical or thermal equ"
  },
  {
    "HS4": "7311",
    "HS4 Short Name": "Iron Gas Containers",
    "HS4 Description": "Containers for compressed or liquefied gas, of iron or steel."
  },
  {
    "HS4": "7312",
    "HS4 Short Name": "Stranded Iron Wire",
    "HS4 Description": "Stranded wire, ropes, cables, plaited bands, slings and the like, of iron or steel, not electrically insulated."
  },
  {
    "HS4": "7313",
    "HS4 Short Name": "Barbed Wire",
    "HS4 Description": "Barbed wire of iron or steel; twisted hoop or single flat wire, barbed or not, and loosely twisted double wire, of a kind used for fencing, of iron or steel."
  },
  {
    "HS4": "7314",
    "HS4 Short Name": "Iron Cloth",
    "HS4 Description": "Cloth (including endless bands), grill, netting and fencing, of iron or steel wire; expanded metal of iron or steel."
  },
  {
    "HS4": "7315",
    "HS4 Short Name": "Iron Chains",
    "HS4 Description": "Chain and parts thereof, of iron or steel."
  },
  {
    "HS4": "7316",
    "HS4 Short Name": "Iron Anchors",
    "HS4 Description": "Anchors, grapnels and parts thereof, of iron or steel."
  },
  {
    "HS4": "7317",
    "HS4 Short Name": "Iron Nails",
    "HS4 Description": "Nails, tacks, drawing pins, corrugated nails, staples (other than those of heading 83.05) and similar articles, of iron or steel, whether or not with heads of other material, but excluding such articles with heads of copper."
  },
  {
    "HS4": "7318",
    "HS4 Short Name": "Iron Fasteners",
    "HS4 Description": "Screws, bolts, nuts, coach screws, screw hooks, rivets, cotters, cotter-pins, washers (including spring washers) and similar articles, of iron or steel."
  },
  {
    "HS4": "7319",
    "HS4 Short Name": "Iron Sewing Needles",
    "HS4 Description": "Sewing needles, knitting needles, bodkins, crochet hooks, embroidery stilettos and similar articles, for use in the hand, of iron or steel; safety pins and other pins of iron or steel, not elsewhere specified or included."
  },
  {
    "HS4": "7320",
    "HS4 Short Name": "Iron Springs",
    "HS4 Description": "Springs and leaves for springs, of iron or steel."
  },
  {
    "HS4": "7321",
    "HS4 Short Name": "Iron Stovetops",
    "HS4 Description": "Stoves, ranges, grates, cookers (including those with subsidiary boilers for central heating), barbecues, braziers, gas-rings, plate warmers and similar non-electric domestic appliances, and parts thereof, of iron or steel."
  },
  {
    "HS4": "7322",
    "HS4 Short Name": "Iron Radiators",
    "HS4 Description": "Radiators for central heating, not electrically heated, and parts thereof, of iron or steel; air heaters and hot air distributors (including distributors which can also distribute fresh or conditioned air), not electrically heated, incorporating a motor-"
  },
  {
    "HS4": "7323",
    "HS4 Short Name": "Iron Housewares",
    "HS4 Description": "Table, kitchen or other household articles and parts thereof, of iron or steel; iron or steel wool; pot scourers and scouring or polishing pads, gloves and the like, of iron or steel."
  },
  {
    "HS4": "7324",
    "HS4 Short Name": "Iron Toiletry",
    "HS4 Description": "Sanitary ware and parts thereof, of iron or steel."
  },
  {
    "HS4": "7325",
    "HS4 Short Name": "Other Cast Iron Products",
    "HS4 Description": "Other cast articles of iron or steel."
  },
  {
    "HS4": "7326",
    "HS4 Short Name": "Other Iron Products",
    "HS4 Description": "Other articles of iron or steel."
  },
  {
    "HS4": "7401",
    "HS4 Short Name": "Precipitated Copper",
    "HS4 Description": "Copper mattes; cement copper (precipitated copper)."
  },
  {
    "HS4": "7402",
    "HS4 Short Name": "Raw Copper",
    "HS4 Description": "Unrefined copper; copper anodes for electrolytic refining."
  },
  {
    "HS4": "7403",
    "HS4 Short Name": "Refined Copper",
    "HS4 Description": "Refined copper and copper alloys, unwrought."
  },
  {
    "HS4": "7404",
    "HS4 Short Name": "Scrap Copper",
    "HS4 Description": "Copper waste and scrap."
  },
  {
    "HS4": "7405",
    "HS4 Short Name": "Copper Alloys",
    "HS4 Description": "Master alloys of copper."
  },
  {
    "HS4": "7406",
    "HS4 Short Name": "Copper Powder",
    "HS4 Description": "Copper powders and flakes."
  },
  {
    "HS4": "7407",
    "HS4 Short Name": "Copper Bars",
    "HS4 Description": "Copper bars, rods and profiles."
  },
  {
    "HS4": "7408",
    "HS4 Short Name": "Copper Wire",
    "HS4 Description": "Copper wire."
  },
  {
    "HS4": "7409",
    "HS4 Short Name": "Copper Plating",
    "HS4 Description": "Copper plates, sheets and strip, of a thickness exceeding 0.15 mm."
  },
  {
    "HS4": "7410",
    "HS4 Short Name": "Copper Foil",
    "HS4 Description": "Copper foil (whether or not printed or backed with paper, paperboard, plastics or similar backing materials) of a thickness (excluding any backing) not exceeding 0.15 mm."
  },
  {
    "HS4": "7411",
    "HS4 Short Name": "Copper Pipes",
    "HS4 Description": "Copper tubes and pipes."
  },
  {
    "HS4": "7412",
    "HS4 Short Name": "Copper Pipe Fittings",
    "HS4 Description": "Copper tube or pipe fittings (for example, couplings, elbows, sleeves)."
  },
  {
    "HS4": "7413",
    "HS4 Short Name": "Stranded Copper Wire",
    "HS4 Description": "Stranded wire, cables, plaited bands and the like, of copper, not electrically insulated."
  },
  {
    "HS4": "7414",
    "HS4 Short Name": "Endless Copper Wire Bands",
    "HS4 Description": "(-2006) Cloth 'incl. endless bands', grill and netting, of copper wire, and expanded metal, of copper (excl. cloth of metal fibres for clothing, lining and similar uses, flux-coated copper fabric for brazing, cloth, grill and netting made into hand sieves or mach"
  },
  {
    "HS4": "7415",
    "HS4 Short Name": "Copper Fasteners",
    "HS4 Description": "Nails, tacks, drawing pins, staples (other than those of heading 83.05) and similar articles, of copper or of iron or steel with heads of copper; screws, bolts, nuts, screw hooks, rivets, cotters, cotter-pins, washers (including spring washers) and simila"
  },
  {
    "HS4": "7416",
    "HS4 Short Name": "Copper Springs",
    "HS4 Description": "(-2006) Copper springs (excl. clock and watch springs, spring washers and other lock washers)"
  },
  {
    "HS4": "7417",
    "HS4 Short Name": "Copper Stovetops",
    "HS4 Description": "(-2006) Cooking or heating apparatus of a kind used for domestic purposes, non-electric, and parts thereof, of copper (excl. hot water heaters and geysers)"
  },
  {
    "HS4": "7418",
    "HS4 Short Name": "Copper Housewares",
    "HS4 Description": "Table, kitchen or other household articles and parts thereof, of copper; pot scourers and scouring or polishing pads, gloves and the like, of copper; sanitary ware and parts thereof, of copper."
  },
  {
    "HS4": "7419",
    "HS4 Short Name": "Other Copper Products",
    "HS4 Description": "Other articles of copper."
  },
  {
    "HS4": "7501",
    "HS4 Short Name": "Nickel Mattes",
    "HS4 Description": "Nickel mattes, nickel oxide sinters and other intermediate products of nickel metallurgy."
  },
  {
    "HS4": "7502",
    "HS4 Short Name": "Raw Nickel",
    "HS4 Description": "Unwrought nickel."
  },
  {
    "HS4": "7503",
    "HS4 Short Name": "Scrap Nickel",
    "HS4 Description": "Nickel waste and scrap."
  },
  {
    "HS4": "7504",
    "HS4 Short Name": "Nickel Powder",
    "HS4 Description": "Nickel powders and flakes."
  },
  {
    "HS4": "7505",
    "HS4 Short Name": "Nickel Bars",
    "HS4 Description": "Nickel bars, rods, profiles and wire."
  },
  {
    "HS4": "7506",
    "HS4 Short Name": "Nickel Sheets",
    "HS4 Description": "Nickel plates, sheets, strip and foil."
  },
  {
    "HS4": "7507",
    "HS4 Short Name": "Nickel Pipes",
    "HS4 Description": "Nickel tubes, pipes and tube or pipe fittings (for example, couplings, elbows, sleeves)."
  },
  {
    "HS4": "7508",
    "HS4 Short Name": "Other Nickel Products",
    "HS4 Description": "Other articles of nickel."
  },
  {
    "HS4": "7601",
    "HS4 Short Name": "Raw Aluminium",
    "HS4 Description": "Unwrought aluminium."
  },
  {
    "HS4": "7602",
    "HS4 Short Name": "Scrap Aluminium",
    "HS4 Description": "Aluminium waste and scrap."
  },
  {
    "HS4": "7603",
    "HS4 Short Name": "Aluminium Powder",
    "HS4 Description": "Aluminium powders and flakes."
  },
  {
    "HS4": "7604",
    "HS4 Short Name": "Aluminium Bars",
    "HS4 Description": "Aluminium bars, rods and profiles."
  },
  {
    "HS4": "7605",
    "HS4 Short Name": "Aluminium Wire",
    "HS4 Description": "Aluminium wire."
  },
  {
    "HS4": "7606",
    "HS4 Short Name": "Aluminium Plating",
    "HS4 Description": "Aluminium plates, sheets and strip, of a thickness exceeding 0.2 mm."
  },
  {
    "HS4": "7607",
    "HS4 Short Name": "Aluminium Foil",
    "HS4 Description": "Aluminium foil (whether or not printed or backed with paper, paperboard, plastics or similar backing materials) of a thickness (excluding any backing) not exceeding 0.2 mm."
  },
  {
    "HS4": "7608",
    "HS4 Short Name": "Aluminium Pipes",
    "HS4 Description": "Aluminium tubes and pipes."
  },
  {
    "HS4": "7609",
    "HS4 Short Name": "Aluminium Pipe Fittings",
    "HS4 Description": "Aluminium tube or pipe fittings (for example, couplings, elbows, sleeves)."
  },
  {
    "HS4": "7610",
    "HS4 Short Name": "Aluminium Structures",
    "HS4 Description": "Aluminium structures (excluding prefabricated buildings of heading 94.06) and parts of structures (for example, bridges and bridge-sections, towers, lattice masts, roofs, roofing frameworks, doors and windows and their frames and thresholds for doors, bal"
  },
  {
    "HS4": "7611",
    "HS4 Short Name": "Large Aluminium Containers",
    "HS4 Description": "Aluminium reservoirs, tanks, vats and similar containers, for any material (other than compressed or liquefied gas), of a capacity exceeding 300 l, whether or not lined or heat-insulated, but not fitted with mechanical or thermal equipment."
  },
  {
    "HS4": "7612",
    "HS4 Short Name": "Aluminium Cans",
    "HS4 Description": "Aluminium casks, drums, cans, boxes and similar containers (including rigid or collapsible tubular containers), for any material (other than compressed or liquefied gas), of a capacity not exceeding 300 l, whether or not lined or heat-insulated, but not f"
  },
  {
    "HS4": "7613",
    "HS4 Short Name": "Aluminium Gas Containers",
    "HS4 Description": "Aluminium containers for compressed or liquefied gas."
  },
  {
    "HS4": "7614",
    "HS4 Short Name": "Stranded Aluminium Wire",
    "HS4 Description": "Stranded wire, cables, plaited bands and the like, of aluminium, not electrically insulated."
  },
  {
    "HS4": "7615",
    "HS4 Short Name": "Aluminium Housewares",
    "HS4 Description": "Table, kitchen or other household articles and parts thereof, of aluminium; pot scourers and scouring or polishing pads, gloves and the like, of aluminium; sanitary ware and parts thereof, of aluminium."
  },
  {
    "HS4": "7616",
    "HS4 Short Name": "Other Aluminium Products",
    "HS4 Description": "Other articles of aluminium."
  },
  {
    "HS4": "7801",
    "HS4 Short Name": "Raw Lead",
    "HS4 Description": "Unwrought lead."
  },
  {
    "HS4": "7802",
    "HS4 Short Name": "Scrap Lead",
    "HS4 Description": "Lead waste and scrap."
  },
  {
    "HS4": "7803",
    "HS4 Short Name": "Lead Bars",
    "HS4 Description": "(-2006) Lead bars, rods, profiles and wire, n.e.s."
  },
  {
    "HS4": "7804",
    "HS4 Short Name": "Lead Sheets",
    "HS4 Description": "Lead plates, sheets, strip and foil; lead powders and flakes."
  },
  {
    "HS4": "7805",
    "HS4 Short Name": "Lead Pipes",
    "HS4 Description": "(-2006) Lead tubes, pipes and tube or pipe fittings 'e.g., couplings, elbows, sleeves'"
  },
  {
    "HS4": "7806",
    "HS4 Short Name": "Other Lead Products",
    "HS4 Description": "Other articles of lead."
  },
  {
    "HS4": "7901",
    "HS4 Short Name": "Raw Zinc",
    "HS4 Description": "Unwrought zinc."
  },
  {
    "HS4": "7902",
    "HS4 Short Name": "Scrap Waste",
    "HS4 Description": "Zinc waste and scrap."
  },
  {
    "HS4": "7903",
    "HS4 Short Name": "Zinc Powder",
    "HS4 Description": "Zinc dust, powders and flakes."
  },
  {
    "HS4": "7904",
    "HS4 Short Name": "Zinc Bars",
    "HS4 Description": "Zinc bars, rods, profiles and wire."
  },
  {
    "HS4": "7905",
    "HS4 Short Name": "Zinc Sheets",
    "HS4 Description": "Zinc plates, sheets, strip and foil."
  },
  {
    "HS4": "7906",
    "HS4 Short Name": "Zinc Pipes",
    "HS4 Description": "(-2006) Zinc tubes, pipes and tube or pipe fittings 'e.g., couplings, elbows, sleeves'"
  },
  {
    "HS4": "7907",
    "HS4 Short Name": "Other Zinc Products",
    "HS4 Description": "Other articles of zinc."
  },
  {
    "HS4": "8001",
    "HS4 Short Name": "Raw Tin",
    "HS4 Description": "Unwrought tin."
  },
  {
    "HS4": "8002",
    "HS4 Short Name": "Scrap Tin",
    "HS4 Description": "Tin waste and scrap."
  },
  {
    "HS4": "8003",
    "HS4 Short Name": "Tin Bars",
    "HS4 Description": "Tin bars, rods, profiles and wire."
  },
  {
    "HS4": "8004",
    "HS4 Short Name": "Tin Plating",
    "HS4 Description": "(-2006) Tin plates, sheets and strip, of a thickness of > 0,2 mm"
  },
  {
    "HS4": "8005",
    "HS4 Short Name": "Tin Foil",
    "HS4 Description": "(-2006) Tin foil of a thickness 'without any backing' <= 0,2 mm, whether or not printed or backed with paper, paperboard, plastics or similar backing materials; tin powders and flakes (excl. tin granules and spangles of heading 8308)"
  },
  {
    "HS4": "8006",
    "HS4 Short Name": "Tin Pipes",
    "HS4 Description": "(-2006) Tin tubes, pipes and tube or pipe fittings 'e.g., couplings, elbows, sleeves'"
  },
  {
    "HS4": "8007",
    "HS4 Short Name": "Other Tin Products",
    "HS4 Description": "Other articles of tin."
  },
  {
    "HS4": "8101",
    "HS4 Short Name": "Tungsten",
    "HS4 Description": "Tungsten (wolfram) and articles thereof, including waste and scrap."
  },
  {
    "HS4": "8102",
    "HS4 Short Name": "Molybdenum",
    "HS4 Description": "Molybdenum and articles thereof, including waste and scrap."
  },
  {
    "HS4": "8103",
    "HS4 Short Name": "Tantalum",
    "HS4 Description": "Tantalum and articles thereof, including waste and scrap."
  },
  {
    "HS4": "8104",
    "HS4 Short Name": "Magnesium",
    "HS4 Description": "Magnesium and articles thereof, including waste and scrap."
  },
  {
    "HS4": "8105",
    "HS4 Short Name": "Cobalt",
    "HS4 Description": "Cobalt mattes and other intermediate products of cobalt metallurgy; cobalt and articles thereof, including waste and scrap."
  },
  {
    "HS4": "8106",
    "HS4 Short Name": "Bismuth",
    "HS4 Description": "Bismuth and articles thereof, including waste and scrap."
  },
  {
    "HS4": "8107",
    "HS4 Short Name": "Cadmium",
    "HS4 Description": "Cadmium and articles thereof, including waste and scrap."
  },
  {
    "HS4": "8108",
    "HS4 Short Name": "Titanium",
    "HS4 Description": "Titanium and articles thereof, including waste and scrap."
  },
  {
    "HS4": "8109",
    "HS4 Short Name": "Zirconium",
    "HS4 Description": "Zirconium and articles thereof, including waste and scrap."
  },
  {
    "HS4": "8110",
    "HS4 Short Name": "Antimony",
    "HS4 Description": "Antimony and articles thereof, including waste and scrap."
  },
  {
    "HS4": "8111",
    "HS4 Short Name": "Manganese",
    "HS4 Description": "Manganese and articles thereof, including waste and scrap."
  },
  {
    "HS4": "8112",
    "HS4 Short Name": "Other Metals",
    "HS4 Description": "Beryllium, chromium, germanium, vanadium, gallium, hafnium, indium, niobium (columbium), rhenium and thallium, and articles of these metals, including waste and scrap."
  },
  {
    "HS4": "8113",
    "HS4 Short Name": "Cermets",
    "HS4 Description": "Cermets and articles thereof, including waste and scrap."
  },
  {
    "HS4": "8201",
    "HS4 Short Name": "Garden Tools",
    "HS4 Description": "Hand tools, the following : spades, shovels, mattocks, picks, hoes, forks and rakes; axes, bill hooks and similar hewing tools; secateurs and pruners of any kind; scythes, sickles, hay knives, hedge shears, timber wedges and other tools of a kind used in"
  },
  {
    "HS4": "8202",
    "HS4 Short Name": "Hand Saws",
    "HS4 Description": "Hand saws; blades for saws of all kinds (including slitting, slotting or toothless saw blades)."
  },
  {
    "HS4": "8203",
    "HS4 Short Name": "Hand Tools",
    "HS4 Description": "Files, rasps, pliers (including cutting pliers), pincers, tweezers, metal cutting shears, pipe-cutters, bolt croppers, perforating punches and similar hand tools."
  },
  {
    "HS4": "8204",
    "HS4 Short Name": "Wrenches",
    "HS4 Description": "Hand-operated spanners and wrenches (including torque meter wrenches but not including tap wrenches); interchangeable spanner sockets, with or without handles."
  },
  {
    "HS4": "8205",
    "HS4 Short Name": "Other Hand Tools",
    "HS4 Description": "Hand tools (including glaziers' diamonds), not elsewhere specified or included; blow lamps; vices, clamps and the like, other than accessories for and parts of, machine tools; anvils; portable forges; hand or pedal-operated grinding wheels with frameworks"
  },
  {
    "HS4": "8206",
    "HS4 Short Name": "Tool Sets",
    "HS4 Description": "Tools of two or more of the headings 82.02 to 82.05, put up in sets for retail sale."
  },
  {
    "HS4": "8207",
    "HS4 Short Name": "Interchangeable Tool Parts",
    "HS4 Description": "Interchangeable tools for hand tools, whether or not poweroperated, or for machine-tools (for example, for pressing, stamping, punching, tapping, threading, drilling, boring, broaching, milling, turning or screw driving), including dies for drawing or e"
  },
  {
    "HS4": "8208",
    "HS4 Short Name": "Cutting Blades",
    "HS4 Description": "Knives and cutting blades, for machines or for mechanical appliances."
  },
  {
    "HS4": "8209",
    "HS4 Short Name": "Tool Plates",
    "HS4 Description": "Plates, sticks, tips and the like for tools, unmounted, of cermets."
  },
  {
    "HS4": "8210",
    "HS4 Short Name": "Cooking Hand Tools",
    "HS4 Description": "Hand-operated mechanical appliances, weighing 10 kg or less, used in the preparation, conditioning or serving of food or drink."
  },
  {
    "HS4": "8211",
    "HS4 Short Name": "Knives",
    "HS4 Description": "Knives with cutting blades, serrated or not (including pruning knives), other than knives of heading 82.08, and blades therefor."
  },
  {
    "HS4": "8212",
    "HS4 Short Name": "Razor Blades",
    "HS4 Description": "Razors and razor blades (including razor blade blanks in strips)."
  },
  {
    "HS4": "8213",
    "HS4 Short Name": "Scissors",
    "HS4 Description": "Scissors, tailors' shears and similar shears, and blades therefor."
  },
  {
    "HS4": "8214",
    "HS4 Short Name": "Other Cutlery",
    "HS4 Description": "Other articles of cutlery (for example, hair clippers, butchers' or kitchen cleavers, choppers and mincing knives, paper knives); manicure or pedicure sets and instruments (including nail files)."
  },
  {
    "HS4": "8215",
    "HS4 Short Name": "Cutlery Sets",
    "HS4 Description": "Spoons, forks, ladles, skimmers, cake-servers, fish-knives, butterknives, sugar tongs and similar kitchen or tableware."
  },
  {
    "HS4": "8301",
    "HS4 Short Name": "Padlocks",
    "HS4 Description": "Padlocks and locks (key, combination or electrically operated), of base metal; clasps and frames with clasps, incorporating locks, of base metal; keys for any of the foregoing articles, of base metal."
  },
  {
    "HS4": "8302",
    "HS4 Short Name": "Metal Mountings",
    "HS4 Description": "Base metal mountings, fittings and similar articles suitable for furniture, doors, staircases, windows, blinds, coachwork, saddlery, trunks, chests, caskets or the like; base metal hat-racks, hat-pegs, brackets and similar fixtures; castors with mountings"
  },
  {
    "HS4": "8303",
    "HS4 Short Name": "Safes",
    "HS4 Description": "Armoured or reinforced safes, strong-boxes and doors and safe deposit lockers for strong-rooms, cash or deed boxes and the like, of base metal."
  },
  {
    "HS4": "8304",
    "HS4 Short Name": "Filing Cabinets",
    "HS4 Description": "Filing cabinets, card-index cabinets, paper trays, paper rests, pen trays, office-stamp stands and similar office or desk equipment, of base metal, other than office furniture of heading 94.03."
  },
  {
    "HS4": "8305",
    "HS4 Short Name": "Metal Office Supplies",
    "HS4 Description": "Fittings for loose-leaf binders or files, letter clips, letter corners, paper clips, indexing tags and similar office articles, of base metal; staples in strips (for example, for offices, upholstery, packaging), of base metal."
  },
  {
    "HS4": "8306",
    "HS4 Short Name": "Bells and Other Metal Ornaments",
    "HS4 Description": "Bells, gongs and the like, non-electric, of base metal; statuettes and other ornaments, of base metal; photograph, picture or similar frames, of base metal; mirrors of base metal."
  },
  {
    "HS4": "8307",
    "HS4 Short Name": "Flexible Metal Tubing",
    "HS4 Description": "Flexible tubing of base metal, with or without fittings."
  },
  {
    "HS4": "8308",
    "HS4 Short Name": "Other Metal Fasteners",
    "HS4 Description": "Clasps, frames with clasps, buckles, buckle-clasps, hooks, eyes, eyelets and the like, of base metal, of a kind used for clothing, footwear, awnings, handbags, travel goods or other made up articles; tubular or bifurcated rivets, of base metal; beads and"
  },
  {
    "HS4": "8309",
    "HS4 Short Name": "Metal Stoppers",
    "HS4 Description": "Stoppers, caps and lids (including crown corks, screw caps and pouring stoppers), capsules for bottles, threaded bungs, bung covers, seals and other packing accessories, of base metal."
  },
  {
    "HS4": "8310",
    "HS4 Short Name": "Metal Signs",
    "HS4 Description": "Sign-plates, name-plates, address-plates and similar plates, numbers, letters and other symbols, of base metal, excluding those of heading 94.05."
  },
  {
    "HS4": "8311",
    "HS4 Short Name": "Coated Metal Soldering Products",
    "HS4 Description": "Wire, rods, tubes, plates, electrodes and similar products, of base metal or of metal carbides, coated or cored with flux material, of a kind used for soldering, brazing, welding or deposition of metal or of metal carbides; wire and rods, of agglomerated"
  },
  {
    "HS4": "8401",
    "HS4 Short Name": "Nuclear Reactors",
    "HS4 Description": "Nuclear reactors; fuel elements (cartridges), non-irradiated, for nuclear reactors; machinery and apparatus for isotopic separation."
  },
  {
    "HS4": "8402",
    "HS4 Short Name": "Steam Boilers",
    "HS4 Description": "Steam or other vapour generating boilers (other than central heating hot water boilers capable also of producing low pressure steam); super-heated water boilers."
  },
  {
    "HS4": "8403",
    "HS4 Short Name": "Central Heating Boilers",
    "HS4 Description": "Central heating boilers other than those of heading 84.02."
  },
  {
    "HS4": "8404",
    "HS4 Short Name": "Boiler Plants",
    "HS4 Description": "Auxiliary plant for use with boilers of heading 84.02 or 84.03 (for example, economisers, super-heaters, soot removers, gas recoverers); condensers for steam or other vapour power units."
  },
  {
    "HS4": "8405",
    "HS4 Short Name": "Water and Gas Generators",
    "HS4 Description": "Producer gas or water gas generators, with or without their purifiers; acetylene gas generators and similar water process gas generators, with or without their purifiers."
  },
  {
    "HS4": "8406",
    "HS4 Short Name": "Steam Turbines",
    "HS4 Description": "Steam turbines and other vapour turbines."
  },
  {
    "HS4": "8407",
    "HS4 Short Name": "Spark-Ignition Engines",
    "HS4 Description": "Spark-ignition reciprocating or rotary internal combustion piston engines."
  },
  {
    "HS4": "8408",
    "HS4 Short Name": "Combustion Engines",
    "HS4 Description": "Compression-ignition internal combustion piston engines (diesel or semi-diesel engines)."
  },
  {
    "HS4": "8409",
    "HS4 Short Name": "Engine Parts",
    "HS4 Description": "Parts suitable for use solely or principally with the engines of heading 84.07 or 84.08."
  },
  {
    "HS4": "8410",
    "HS4 Short Name": "Hydraulic Turbines",
    "HS4 Description": "Hydraulic turbines, water wheels, and regulators therefor."
  },
  {
    "HS4": "8411",
    "HS4 Short Name": "Gas Turbines",
    "HS4 Description": "Turbo-jets, turbo-propellers and other gas turbines."
  },
  {
    "HS4": "8412",
    "HS4 Short Name": "Other Engines",
    "HS4 Description": "Other engines and motors."
  },
  {
    "HS4": "8413",
    "HS4 Short Name": "Liquid Pumps",
    "HS4 Description": "Pumps for liquids, whether or not fitted with a measuring device; liquid elevators."
  },
  {
    "HS4": "8414",
    "HS4 Short Name": "Air Pumps",
    "HS4 Description": "Air or vacuum pumps, air or other gas compressors and fans; ventilating or recycling hoods incorporating a fan, whether or not fitted with filters."
  },
  {
    "HS4": "8415",
    "HS4 Short Name": "Air Conditioners",
    "HS4 Description": "Air conditioning machines, comprising a motor-driven fan and elements for changing the temperature and humidity, including those machines in which the humidity cannot be separately regulated."
  },
  {
    "HS4": "8416",
    "HS4 Short Name": "Liquid Fuel Furnaces",
    "HS4 Description": "Furnace burners for liquid fuel, for pulverised solid fuel or for gas; mechanical stokers, including their mechanical grates, mechanical ash dischargers and similar appliances."
  },
  {
    "HS4": "8417",
    "HS4 Short Name": "Industrial Furnaces",
    "HS4 Description": "Industrial or laboratory furnaces and ovens, including incinerators, non-electric."
  },
  {
    "HS4": "8418",
    "HS4 Short Name": "Refrigerators",
    "HS4 Description": "Refrigerators, freezers and other refrigerating or freezing equipment, electric or other; heat pumps other than air conditioning machines of heading 84.15."
  },
  {
    "HS4": "8419",
    "HS4 Short Name": "Other Heating Machinery",
    "HS4 Description": "Machinery, plant or laboratory equipment, whether or not electrically heated (excluding furnaces, ovens and other equipment of heading 85.14), for the treatment of materials by a process involving a change of temperature such as heating, cooking, roasting"
  },
  {
    "HS4": "8420",
    "HS4 Short Name": "Rolling Machines",
    "HS4 Description": "Calendering or other rolling machines, other than for metals or glass, and cylinders therefor."
  },
  {
    "HS4": "8421",
    "HS4 Short Name": "Centrifuges",
    "HS4 Description": "Centrifuges, including centrifugal dryers; filtering or purifying machinery and apparatus, for liquids or gases."
  },
  {
    "HS4": "8422",
    "HS4 Short Name": "Washing and Bottling Machines",
    "HS4 Description": "Dish washing machines; machinery for cleaning or drying bottles or other containers; machinery for filling, closing, sealing or labelling bottles, cans, boxes, bags or other containers; machinery for capsuling bottles, jars, tubes and similar containers;"
  },
  {
    "HS4": "8423",
    "HS4 Short Name": "Scales",
    "HS4 Description": "Weighing machinery (excluding balances of a sensitivity of 5 cg or better), including weight operated counting or checking machines; weighing machine weights of all kinds."
  },
  {
    "HS4": "8424",
    "HS4 Short Name": "Liquid Dispersing Machines",
    "HS4 Description": "Mechanical appliances (whether or not hand-operated) for projecting, dispersing or spraying liquids or powders; fire extinguishers, whether or not charged; spray guns and similar appliances; steam or sand blasting machines and similar jet projecting machi"
  },
  {
    "HS4": "8425",
    "HS4 Short Name": "Pulley Systems",
    "HS4 Description": "Pulley tackle and hoists other than skip hoists; winches and capstans; jacks."
  },
  {
    "HS4": "8426",
    "HS4 Short Name": "Cranes",
    "HS4 Description": "Ships' derricks; cranes, including cable cranes; mobile lifting frames, straddle carriers and works trucks fitted with a crane."
  },
  {
    "HS4": "8427",
    "HS4 Short Name": "Fork-Lifts",
    "HS4 Description": "Fork-lift trucks; other works trucks fitted with lifting or handling equipment."
  },
  {
    "HS4": "8428",
    "HS4 Short Name": "Lifting Machinery",
    "HS4 Description": "Other lifting, handling, loading or unloading machinery (for example, lifts, escalators, conveyors, teleferics)."
  },
  {
    "HS4": "8429",
    "HS4 Short Name": "Large Construction Vehicles",
    "HS4 Description": "Self-propelled bulldozers, angledozers, graders, levellers, scrapers, mechanical shovels, excavators, shovel loaders, tamping machines and road rollers."
  },
  {
    "HS4": "8430",
    "HS4 Short Name": "Other Construction Vehicles",
    "HS4 Description": "Other moving, grading, levelling, scraping, excavating, tamping, compacting, extracting or boring machinery, for earth, minerals or ores; pile-drivers and pile-extractors; snow-ploughs and snowblowers."
  },
  {
    "HS4": "8431",
    "HS4 Short Name": "Excavation Machinery",
    "HS4 Description": "Parts suitable for use solely or principally with the machinery of headings 84.25 to 84.30."
  },
  {
    "HS4": "8432",
    "HS4 Short Name": "Soil Preparation Machinery",
    "HS4 Description": "Agricultural, horticultural or forestry machinery for soil preparation or cultivation; lawn or sports-ground rollers."
  },
  {
    "HS4": "8433",
    "HS4 Short Name": "Harvesting Machinery",
    "HS4 Description": "Harvesting or threshing machinery, including straw or fodder balers; grass or hay mowers; machines for cleaning, sorting or grading eggs, fruit or other agricultural produce, other than machinery of heading 84.37."
  },
  {
    "HS4": "8434",
    "HS4 Short Name": "Dairy Machinery",
    "HS4 Description": "Milking machines and dairy machinery."
  },
  {
    "HS4": "8435",
    "HS4 Short Name": "Fruit Pressing Machinery",
    "HS4 Description": "Presses, crushers and similar machinery used in the manufacture of wine, cider, fruit juices or similar beverages."
  },
  {
    "HS4": "8436",
    "HS4 Short Name": "Other Agricultural Machinery",
    "HS4 Description": "Other agricultural, horticultural, forestry, poultry-keeping or bee-keeping machinery, including germination plant fitted with mechanical or thermal equipment; poultry incubators and brooders."
  },
  {
    "HS4": "8437",
    "HS4 Short Name": "Mill Machinery",
    "HS4 Description": "Machines for cleaning, sorting or grading seed, grain or dried leguminous vegetables; machinery used in the milling industry or for the working of cereals or dried leguminous vegetables, other than farm-type machinery."
  },
  {
    "HS4": "8438",
    "HS4 Short Name": "Industrial Food Preperation Machinery",
    "HS4 Description": "Machinery, not specified or included elsewhere in this Chapter, for the industrial preparation or manufacture of food or drink, other than machinery for the extraction or preparation of animal or fixed vegetable fats or oils."
  },
  {
    "HS4": "8439",
    "HS4 Short Name": "Papermaking Machines",
    "HS4 Description": "Machinery for making pulp of fibrous cellulosic material or for making or finishing paper or paperboard."
  },
  {
    "HS4": "8440",
    "HS4 Short Name": "Book-binding Machines",
    "HS4 Description": "Book-binding machinery, including book-sewing machines."
  },
  {
    "HS4": "8441",
    "HS4 Short Name": "Other Paper Machinery",
    "HS4 Description": "Other machinery for making up paper pulp, paper or paperboard, including cutting machines of all kinds."
  },
  {
    "HS4": "8442",
    "HS4 Short Name": "Print Production Machinery",
    "HS4 Description": "Machinery, apparatus and equipment (other than the machinetools of headings 84.56 to 84.65) for preparing or making plates, cylinders or other printing components; plates, cylinders and other printing components; plates, cylinders and lithographic stone"
  },
  {
    "HS4": "8443",
    "HS4 Short Name": "Industrial Printers",
    "HS4 Description": "Printing machinery used for printing by means of plates, cylinders and other printing components of heading 84.42; other printers, copying machines and facsimile machines, whether or not combined; parts and accessories thereof."
  },
  {
    "HS4": "8444",
    "HS4 Short Name": "Artificial Textile Machinery",
    "HS4 Description": "Machines for extruding, drawing, texturing or cutting manmade textile materials."
  },
  {
    "HS4": "8445",
    "HS4 Short Name": "Textile Fiber Machinery",
    "HS4 Description": "Machines for preparing textile fibres; spinning, doubling or twisting machines and other machinery for producing textile yarns; textile reeling or winding (including weft-winding) machines and machines for preparing textile yarns for use on the machines o"
  },
  {
    "HS4": "8446",
    "HS4 Short Name": "Looms",
    "HS4 Description": "Weaving machines (looms)."
  },
  {
    "HS4": "8447",
    "HS4 Short Name": "Knitting Machines",
    "HS4 Description": "Knitting machines, stitch-bonding machines and machines for making gimped yarn, tulle, lace, embroidery, trimmings, braid or net and machines for tufting."
  },
  {
    "HS4": "8448",
    "HS4 Short Name": "Knitting Machine Accessories",
    "HS4 Description": "Auxiliary machinery for use with machines of heading 84.44, 84.45, 84.46 or 84.47 (for example, dobbies, Jacquards, automatic stop motions, shuttle changing mechanisms); parts and accessories suitable for use solely or principally with the machines of thi"
  },
  {
    "HS4": "8449",
    "HS4 Short Name": "Felt Machinery",
    "HS4 Description": "Machinery for the manufacture or finishing of felt or nonwovens in the piece or in shapes, including machinery for making felt hats; blocks for making hats."
  },
  {
    "HS4": "8450",
    "HS4 Short Name": "Household Washing Machines",
    "HS4 Description": "Household or laundry-type washing machines, including machines which both wash and dry."
  },
  {
    "HS4": "8451",
    "HS4 Short Name": "Textile Processing Machines",
    "HS4 Description": "Machinery (other than machines of heading 84.50) for washing, cleaning, wringing, drying, ironing, pressing (including fusing presses), bleaching, dyeing, dressing, finishing, coating or impregnating textile yarns, fabrics or made up textile articles and"
  },
  {
    "HS4": "8452",
    "HS4 Short Name": "Sewing Machines",
    "HS4 Description": "Sewing machines, other than book-sewing machines of heading 84.40; furniture, bases and covers specially designed for sewing machines; sewing machine needles."
  },
  {
    "HS4": "8453",
    "HS4 Short Name": "Leather Machinery",
    "HS4 Description": "Machinery for preparing, tanning or working hides, skins or leather or for making or repairing footwear or other articles of hides, skins or leather, other than sewing machines."
  },
  {
    "HS4": "8454",
    "HS4 Short Name": "Casting Machines",
    "HS4 Description": "Converters, ladles, ingot moulds and casting machines, of a kind used in metallurgy or in metal foundries."
  },
  {
    "HS4": "8455",
    "HS4 Short Name": "Metal-Rolling Mills",
    "HS4 Description": "Metal-rolling mills and rolls therefor."
  },
  {
    "HS4": "8456",
    "HS4 Short Name": "Non-Mechanical Removal Machinery",
    "HS4 Description": "Machine-tools for working any material by removal of material, by laser or other light or photon beam, ultrasonic, electrodischarge, electro-chemical, electron beam, ionic-beam or plasma arc processes; water-jet cutting machines."
  },
  {
    "HS4": "8457",
    "HS4 Short Name": "Metalworking Transfer Machines",
    "HS4 Description": "Machining centres, unit construction machines (single station) and multi-station transfer machines, for working metal."
  },
  {
    "HS4": "8458",
    "HS4 Short Name": "Metal Lathes",
    "HS4 Description": "Lathes (including turning centres) for removing metal."
  },
  {
    "HS4": "8459",
    "HS4 Short Name": "Drilling Machines",
    "HS4 Description": "Machine-tools (including way-type unit head machines) for drilling, boring, milling, threading or tapping by removing metal, other than lathes (including turning centres) of heading 84.58."
  },
  {
    "HS4": "8460",
    "HS4 Short Name": "Metal Finishing Machines",
    "HS4 Description": "Machine-tools for deburring, sharpening, grinding, honing, lapping, polishing or otherwise finishing metal or cermets by means of grinding stones, abrasives or polishing products, other than gear cutting, gear grinding or gear finishing machines of headin"
  },
  {
    "HS4": "8461",
    "HS4 Short Name": "Metalworking Machines",
    "HS4 Description": "Machine-tools for planing, shaping, slotting, broaching, gear cutting, gear grinding or gear finishing, sawing, cutting-off and other machine-tools working by removing metal or cermets, not elsewhere specified or included."
  },
  {
    "HS4": "8462",
    "HS4 Short Name": "Forging Machines",
    "HS4 Description": "Machine-tools (including presses) for working metal by forging, hammering or die-stamping; machine-tools (including presses) for working metal by bending, folding, straightening, flattening, shearing, punching or notching; presses for working metal or met"
  },
  {
    "HS4": "8463",
    "HS4 Short Name": "Other Non-Metal Removal Machinery",
    "HS4 Description": "Other machine-tools for working metal or cermets, without removing material."
  },
  {
    "HS4": "8464",
    "HS4 Short Name": "Stone Working Machines",
    "HS4 Description": "Machine-tools for working stone, ceramics, concrete, asbestoscement or like mineral materials or for cold working glass."
  },
  {
    "HS4": "8465",
    "HS4 Short Name": "Woodworking machines",
    "HS4 Description": "Machine-tools (including machines for nailing, stapling, glueing or otherwise assembling) for working wood, cork, bone, hard rubber, hard plastics or similar hard materials."
  },
  {
    "HS4": "8466",
    "HS4 Short Name": "Metalworking Machine Parts",
    "HS4 Description": "Parts and accessories suitable for use solely or principally with the machines of headings 84.56 to 84.65, including work or tool holders, self-opening dieheads, dividing heads and other special attachments for machine-tools; tool holders for any type of"
  },
  {
    "HS4": "8467",
    "HS4 Short Name": "Motor-working Tools",
    "HS4 Description": "Tools for working in the hand, pneumatic, hydraulic or with self-contained electric or non-electric motor."
  },
  {
    "HS4": "8468",
    "HS4 Short Name": "Soldering and Welding Machinery",
    "HS4 Description": "Machinery and apparatus for soldering, brazing or welding, whether or not capable of cutting, other than those of heading 85.15; gas-operated surface tempering machines and appliances."
  },
  {
    "HS4": "8469",
    "HS4 Short Name": "Typewriters",
    "HS4 Description": "Typewriters other than printers of heading 84.43; wordprocessing machines."
  },
  {
    "HS4": "8470",
    "HS4 Short Name": "Calculators",
    "HS4 Description": "Calculating machines and pocket-size data recording, reproducing and displaying machines with calculating functions; accounting machines, postage-franking machines, ticket-issuing machines and similar machines, incorporating a calculating device; cash reg"
  },
  {
    "HS4": "8471",
    "HS4 Short Name": "Computers",
    "HS4 Description": "Automatic data processing machines and units thereof; magnetic or optical readers, machines for transcribing data onto data media in coded form and machines for processing such data, not elsewhere specified or included."
  },
  {
    "HS4": "8472",
    "HS4 Short Name": "Other Office Machines",
    "HS4 Description": "Other office machines (for example, hectograph or stencil duplicating machines, addressing machines, automatic banknote dispensers, coin-sorting machines, coin-counting or wrapping machines, pencil-sharpening machines, perforating or stapling machines)."
  },
  {
    "HS4": "8473",
    "HS4 Short Name": "Office Machine Parts",
    "HS4 Description": "Parts and accessories (other than covers, carrying cases and the like) suitable for use solely or principally with machines of headings 84.69 to 84.72."
  },
  {
    "HS4": "8474",
    "HS4 Short Name": "Stone Processing Machines",
    "HS4 Description": "Machinery for sorting, screening, separating, washing, crushing, grinding, mixing or kneading earth, stone, ores or other mineral substances, in solid (including powder or paste) form; machinery for agglomerating, shaping or moulding solid mineral fuels,"
  },
  {
    "HS4": "8475",
    "HS4 Short Name": "Glass Working Machines",
    "HS4 Description": "Machines for assembling electric or electronic lamps, tubes or valves or flashbulbs, in glass envelopes; machines for manufacturing or hot working glass or glassware."
  },
  {
    "HS4": "8476",
    "HS4 Short Name": "Vending Machines",
    "HS4 Description": "Automatic goods-vending machines (for example, postage stamp, cigarette, food or beverage machines), including moneychanging machines."
  },
  {
    "HS4": "8477",
    "HS4 Short Name": "Rubberworking Machinery",
    "HS4 Description": "Machinery for working rubber or plastics or for the manufacture of products from these materials, not specified or included elsewhere in this Chapter."
  },
  {
    "HS4": "8478",
    "HS4 Short Name": "Tobacco Processing Machines",
    "HS4 Description": "Machinery for preparing or making up tobacco, not specified or included elsewhere in this Chapter."
  },
  {
    "HS4": "8479",
    "HS4 Short Name": "Machinery Having Individual Functions",
    "HS4 Description": "Machines and mechanical appliances having individual functions, not specified or included elsewhere in this Chapter."
  },
  {
    "HS4": "8480",
    "HS4 Short Name": "Metal Molds",
    "HS4 Description": "Moulding boxes for metal foundry; mould bases; moulding patterns; moulds for metal (other than ingot moulds), metal carbides, glass, mineral materials, rubber or plastics."
  },
  {
    "HS4": "8481",
    "HS4 Short Name": "Valves",
    "HS4 Description": "Taps, cocks, valves and similar appliances for pipes, boiler shells, tanks, vats or the like, including pressure-reducing valves and thermostatically controlled valves."
  },
  {
    "HS4": "8482",
    "HS4 Short Name": "Ball Bearings",
    "HS4 Description": "Ball or roller bearings."
  },
  {
    "HS4": "8483",
    "HS4 Short Name": "Transmissions",
    "HS4 Description": "Transmission shafts (including cam shafts and crank shafts) and cranks; bearing housings and plain shaft bearings; gears and gearing; ball or roller screws; gear boxes and other speed changers, including torque converters; flywheels and pulleys, including"
  },
  {
    "HS4": "8484",
    "HS4 Short Name": "Gaskets",
    "HS4 Description": "Gaskets and similar joints of metal sheeting combined with other material or of two or more layers of metal; sets or assortments of gaskets and similar joints, dissimilar in composition, put up in pouches, envelopes or similar packings; mechanical seals."
  },
  {
    "HS4": "8485",
    "HS4 Short Name": "Boat Propellers",
    "HS4 Description": "(-2006) Machinery parts not specified or included elsewhere in this chapter (excl. parts containing electrical connectors, insulators, coils, contacts or other electrical features)"
  },
  {
    "HS4": "8486",
    "HS4 Short Name": "Machines for the manufacture of semiconductors and integrated circuits",
    "HS4 Description": "Machines and apparatus of a kind used solely or principally for the manufacture of semiconductor boules or wafers, semiconductor devices, electronic integrated circuits or flat panel displays; machines and apparatus specified in Note 9 (C) to this Chapter"
  },
  {
    "HS4": "8487",
    "HS4 Short Name": "Machinery parts, not containing other electrical features",
    "HS4 Description": "Machinery parts, not containing electrical connectors, insulators, coils, contacts or other electrical features, not specified or included elsewhere in this Chapter."
  },
  {
    "HS4": "8501",
    "HS4 Short Name": "Electric Motors",
    "HS4 Description": "Electric motors and generators (excluding generating sets)."
  },
  {
    "HS4": "8502",
    "HS4 Short Name": "Electric Generating Sets",
    "HS4 Description": "Electric generating sets and rotary converters."
  },
  {
    "HS4": "8503",
    "HS4 Short Name": "Electric Motor Parts",
    "HS4 Description": "Parts suitable for use solely or principally with the machines of heading 85.01 or 85.02."
  },
  {
    "HS4": "8504",
    "HS4 Short Name": "Electrical Transformers",
    "HS4 Description": "Electrical transformers, static converters (for example, rectifiers) and inductors."
  },
  {
    "HS4": "8505",
    "HS4 Short Name": "Electromagnets",
    "HS4 Description": "Electro-magnets; permanent magnets and articles intended to become permanent magnets after magnetisation; electromagnetic or permanent magnet chucks, clamps and similar holding devices; electro-magnetic couplings, clutches and brakes; electro-magnetic l"
  },
  {
    "HS4": "8506",
    "HS4 Short Name": "Batteries",
    "HS4 Description": "Primary cells and primary batteries."
  },
  {
    "HS4": "8507",
    "HS4 Short Name": "Electric Batteries",
    "HS4 Description": "Electric accumulators, including separators therefor, whether or not rectangular (including square)."
  },
  {
    "HS4": "8508",
    "HS4 Short Name": "Vacuum Cleaners",
    "HS4 Description": "Vacuum cleaners."
  },
  {
    "HS4": "8509",
    "HS4 Short Name": "Other Domestic Electric Housewares",
    "HS4 Description": "Electro-mechanical domestic appliances, with self-contained electric motor, other than vacuum cleaners of heading 85.08."
  },
  {
    "HS4": "8510",
    "HS4 Short Name": "Hair Trimmers",
    "HS4 Description": "Shavers, hair clippers and hair-removing appliances, with selfcontained electric motor."
  },
  {
    "HS4": "8511",
    "HS4 Short Name": "Electrical Ignitions",
    "HS4 Description": "Electrical ignition or starting equipment of a kind used for spark-ignition or compression-ignition internal combustion engines (for example, ignition magnetos, magneto-dynamos, ignition coils, sparking plugs and glow plugs, starter motors); generators (f"
  },
  {
    "HS4": "8512",
    "HS4 Short Name": "Electrical Lighting and Signalling Equipment",
    "HS4 Description": "Electrical lighting or signalling equipment (excluding articles of heading 85.39), windscreen wipers, defrosters and demisters, of a kind used for cycles or motor vehicles."
  },
  {
    "HS4": "8513",
    "HS4 Short Name": "Portable Lighting",
    "HS4 Description": "Portable electric lamps designed to function by their own source of energy (for example, dry batteries, accumulators, magnetos), other than lighting equipment of heading 85.12."
  },
  {
    "HS4": "8514",
    "HS4 Short Name": "Electric Furnaces",
    "HS4 Description": "Industrial or laboratory electric furnaces and ovens (including those functioning by induction or dielectric loss); other industrial or laboratory equipment for the heat treatment of materials by induction or dielectric loss."
  },
  {
    "HS4": "8515",
    "HS4 Short Name": "Electric Soldering Equipment",
    "HS4 Description": "Electric (including electrically heated gas), laser or other light or photon beam, ultrasonic, electron beam, magnetic pulse or plasma arc soldering, brazing or welding machines and apparatus, whether or not capable of cutting; electric machines and appar"
  },
  {
    "HS4": "8516",
    "HS4 Short Name": "Electric Heaters",
    "HS4 Description": "Electric instantaneous or storage water heaters and immersion heaters; electric space heating apparatus and soil heating apparatus; electro-thermic hair-dressing apparatus (for example, hair dryers, hair curlers, curling tong heaters) and hand dryers; ele"
  },
  {
    "HS4": "8517",
    "HS4 Short Name": "Telephones",
    "HS4 Description": "Telephone sets, including telephones for cellular networks or for other wireless networks; other apparatus for the transmission or reception of voice, images or other data, including apparatus for communication in a wired or wireless network (such as a lo"
  },
  {
    "HS4": "8518",
    "HS4 Short Name": "Microphones and Headphones",
    "HS4 Description": "Microphones and stands therefor; loudspeakers, whether or not mounted in their enclosures; headphones and earphones, whether or not combined with a microphone, and sets consisting of a microphone and one or more loudspeakers; audiofrequency electric amp"
  },
  {
    "HS4": "8519",
    "HS4 Short Name": "Sound Recording Equipment",
    "HS4 Description": "Sound recording or reproducing apparatus."
  },
  {
    "HS4": "8520",
    "HS4 Short Name": "Dictation Machines",
    "HS4 Description": "(-2006) Magnetic tape recorders and other sound recording apparatus whether or not incorporating a sound-reproducing device"
  },
  {
    "HS4": "8521",
    "HS4 Short Name": "Video Recording Equipment",
    "HS4 Description": "Video recording or reproducing apparatus, whether or not incorporating a video tuner."
  },
  {
    "HS4": "8522",
    "HS4 Short Name": "Audio and Video Recording Accessories",
    "HS4 Description": "Parts and accessories suitable for use solely or principally with the apparatus of headings 85.19 or 85.21."
  },
  {
    "HS4": "8523",
    "HS4 Short Name": "Blank Audio Media",
    "HS4 Description": "Discs, tapes, solid-state non-volatile storage devices, 'smart cards' and other media for the recording of sound or of other phenomena, whether or not recorded, including matrices and masters for the production of discs, but excluding products of Chapter"
  },
  {
    "HS4": "8524",
    "HS4 Short Name": "Sound Recordings",
    "HS4 Description": "(-2006) Records, tapes and other recorded media for sound or other similarly recorded phenomena, incl. matrices and masters for the production of records (excl. products of chapter 37)"
  },
  {
    "HS4": "8525",
    "HS4 Short Name": "Broadcasting Equipment",
    "HS4 Description": "Transmission apparatus for radio-broadcasting or television, whether or not incorporating reception apparatus or sound recording or reproducing apparatus; television cameras, digital cameras and video camera recorders."
  },
  {
    "HS4": "8526",
    "HS4 Short Name": "Navigation Equipment",
    "HS4 Description": "Radar apparatus, radio navigational aid apparatus and radio remote control apparatus."
  },
  {
    "HS4": "8527",
    "HS4 Short Name": "Radio Receivers",
    "HS4 Description": "Reception apparatus for radio-broadcasting, whether or not combined, in the same housing, with sound recording or reproducing apparatus or a clock."
  },
  {
    "HS4": "8528",
    "HS4 Short Name": "Video Displays",
    "HS4 Description": "Monitors and projectors, not incorporating television reception apparatus; reception apparatus for television, whether or not incorporating radio-broadcast receivers or sound or video recording or reproducing apparatus."
  },
  {
    "HS4": "8529",
    "HS4 Short Name": "Broadcasting Accessories",
    "HS4 Description": "Parts suitable for use solely or principally with the apparatus of headings 85.25 to 85.28."
  },
  {
    "HS4": "8530",
    "HS4 Short Name": "Traffic Signals",
    "HS4 Description": "Electrical signalling, safety or traffic control equipment for railways, tramways, roads, inland waterways, parking facilities, port installations or airfields (other than those of heading 86.08)."
  },
  {
    "HS4": "8531",
    "HS4 Short Name": "Audio Alarms",
    "HS4 Description": "Electric sound or visual signalling apparatus (for example, bells, sirens, indicator panels, burglar or fire alarms), other than those of heading 85.12 or 85.30."
  },
  {
    "HS4": "8532",
    "HS4 Short Name": "Electrical Capacitors",
    "HS4 Description": "Electrical capacitors, fixed, variable or adjustable (pre-set)."
  },
  {
    "HS4": "8533",
    "HS4 Short Name": "Electrical Resistors",
    "HS4 Description": "Electrical resistors (including rheostats and potentiometers), other than heating resistors."
  },
  {
    "HS4": "8534",
    "HS4 Short Name": "Printed Circuit Boards",
    "HS4 Description": "Printed circuits."
  },
  {
    "HS4": "8535",
    "HS4 Short Name": "High-voltage Protection Equipment",
    "HS4 Description": "Electrical apparatus for switching or protecting electrical circuits, or for making connections to or in electrical circuits (for example, switches, fuses, lightning arresters, voltage limiters, surge suppressors, plugs and other connectors, junction boxe"
  },
  {
    "HS4": "8536",
    "HS4 Short Name": "Low-voltage Protection Equipment",
    "HS4 Description": "Electrical apparatus for switching or protecting electrical circuits, or for making connections to or in electrical circuits (for example, switches, relays, fuses, surge suppressors, plugs, sockets, lamp-holders and other connectors, junction boxes), for"
  },
  {
    "HS4": "8537",
    "HS4 Short Name": "Electrical Control Boards",
    "HS4 Description": "Boards, panels, consoles, desks, cabinets and other bases, equipped with two or more apparatus of heading 85.35 or 85.36, for electric control or the distribution of electricity, including those incorporating instruments or apparatus of Chapter 90, and nu"
  },
  {
    "HS4": "8538",
    "HS4 Short Name": "Electrical Power Accessories",
    "HS4 Description": "Parts suitable for use solely or principally with the apparatus of heading 85.35, 85.36 or 85.37."
  },
  {
    "HS4": "8539",
    "HS4 Short Name": "Electric Filament",
    "HS4 Description": "Electric filament or discharge lamps, including sealed beam lamp units and ultra-violet or infra-red lamps; arc-lamps."
  },
  {
    "HS4": "8540",
    "HS4 Short Name": "Cathode Tubes",
    "HS4 Description": "Thermionic, cold cathode or photo-cathode valves and tubes (for example, vacuum or vapour or gas filled valves and tubes, mercury arc rectifying valves and tubes, cathode-ray tubes, television camera tubes)."
  },
  {
    "HS4": "8541",
    "HS4 Short Name": "Semiconductor Devices",
    "HS4 Description": "Diodes, transistors and similar semiconductor devices; photosensitive semiconductor devices, including photovoltaic cells whether or not assembled in modules or made up into panels; light emitting diodes; mounted piezo-electric crystals."
  },
  {
    "HS4": "8542",
    "HS4 Short Name": "Integrated Circuits",
    "HS4 Description": "Electronic integrated circuits."
  },
  {
    "HS4": "8543",
    "HS4 Short Name": "Other Electrical Machinery",
    "HS4 Description": "Electrical machines and apparatus, having individual functions, not specified or included elsewhere in this Chapter."
  },
  {
    "HS4": "8544",
    "HS4 Short Name": "Insulated Wire",
    "HS4 Description": "Insulated (including enamelled or anodised) wire, cable (including co-axial cable) and other insulated electric conductors, whether or not fitted with connectors; optical fibre cables, made up of individually sheathed fibres, whether or not assembled with"
  },
  {
    "HS4": "8545",
    "HS4 Short Name": "Carbon-based Electronics",
    "HS4 Description": "Carbon electrodes, carbon brushes, lamp carbons, battery carbons and other articles of graphite or other carbon, with or without metal, of a kind used for electrical purposes."
  },
  {
    "HS4": "8546",
    "HS4 Short Name": "Electrical Insulators",
    "HS4 Description": "Electrical insulators of any material."
  },
  {
    "HS4": "8547",
    "HS4 Short Name": "Metal Insulating Fittings",
    "HS4 Description": "Insulating fittings for electrical machines, appliances or equipment, being fittings wholly of insulating material apart from any minor components of metal (for example, threaded sockets) incorporated during moulding solely for purposes of assembly, other"
  },
  {
    "HS4": "8548",
    "HS4 Short Name": "Electrical Parts",
    "HS4 Description": "Waste and scrap of primary cells, primary batteries and electric accumulators; spent primary cells, spent primary batteries and spent electric accumulators; electrical parts of machinery or apparatus, not specified or included elsewhere in this Chapter."
  },
  {
    "HS4": "8549",
    "HS4 Short Name": "Electrical and electronic waste and scrap",
    "HS4 Description": "Electrical and electronic waste and scrap"
  },
  {
    "HS4": "8601",
    "HS4 Short Name": "Electric Locomotives",
    "HS4 Description": "Rail locomotives powered from an external source of electricity or by electric accumulators."
  },
  {
    "HS4": "8602",
    "HS4 Short Name": "Other Locomotives",
    "HS4 Description": "Other rail locomotives; locomotive tenders."
  },
  {
    "HS4": "8603",
    "HS4 Short Name": "Self-Propelled Rail Transport",
    "HS4 Description": "Self-propelled railway or tramway coaches, vans and trucks, other than those of heading 86.04."
  },
  {
    "HS4": "8604",
    "HS4 Short Name": "Railway Maintenance Vehicles",
    "HS4 Description": "Railway or tramway maintenance or service vehicles, whether or not self-propelled (for example, workshops, cranes, ballast tampers, trackliners, testing coaches and track inspection vehicles)."
  },
  {
    "HS4": "8605",
    "HS4 Short Name": "Railway Passenger Cars",
    "HS4 Description": "Railway or tramway passenger coaches, not self-propelled; luggage vans, post office coaches and other special purpose railway or tramway coaches, not self-propelled (excluding those of heading 86.04)."
  },
  {
    "HS4": "8606",
    "HS4 Short Name": "Railway Freight Cars",
    "HS4 Description": "Railway or tramway goods vans and wagons, not self-propelled."
  },
  {
    "HS4": "8607",
    "HS4 Short Name": "Locomotive Parts",
    "HS4 Description": "Parts of railway or tramway locomotives or rolling-stock."
  },
  {
    "HS4": "8608",
    "HS4 Short Name": "Railway Track Fixtures",
    "HS4 Description": "Railway or tramway track fixtures and fittings; mechanical (including electro-mechanical) signalling, safety or traffic control equipment for railways, tramways, roads, inland waterways, parking facilities, port installations or airfields; parts of the fo"
  },
  {
    "HS4": "8609",
    "HS4 Short Name": "Railway Cargo Containers",
    "HS4 Description": "Containers (including containers for the transport of fluids) specially designed and equipped for carriage by one or more modes of transport."
  },
  {
    "HS4": "8701",
    "HS4 Short Name": "Tractors",
    "HS4 Description": "Tractors (other than tractors of heading 87.09)."
  },
  {
    "HS4": "8702",
    "HS4 Short Name": "Buses",
    "HS4 Description": "Motor vehicles for the transport of ten or more persons, including the driver."
  },
  {
    "HS4": "8703",
    "HS4 Short Name": "Cars",
    "HS4 Description": "Motor cars and other motor vehicles principally designed for the transport of persons (other than those of heading 87.02), including station wagons and racing cars."
  },
  {
    "HS4": "8704",
    "HS4 Short Name": "Delivery Trucks",
    "HS4 Description": "Motor vehicles for the transport of goods."
  },
  {
    "HS4": "8705",
    "HS4 Short Name": "Specialized Vehicles",
    "HS4 Description": "Special purpose motor vehicles, other than those principally designed for the transport of persons or goods (for example, breakdown lorries, crane lorries, fire fighting vehicles, concretemixer lorries, road sweeper lorries, spraying lorries, mobile wor"
  },
  {
    "HS4": "8706",
    "HS4 Short Name": "Vehicle Chassis",
    "HS4 Description": "Chassis fitted with engines, for the motor vehicles of headings 87.01 to 87.05."
  },
  {
    "HS4": "8707",
    "HS4 Short Name": "Vehicle Bodies",
    "HS4 Description": "Bodies (including cabs), for the motor vehicles of headings 87.01 to 87.05."
  },
  {
    "HS4": "8708",
    "HS4 Short Name": "Vehicle Parts",
    "HS4 Description": "Parts and accessories of the motor vehicles of headings 87.01 to 87.05."
  },
  {
    "HS4": "8709",
    "HS4 Short Name": "Work Trucks",
    "HS4 Description": "Works trucks, self-propelled, not fitted with lifting or handling equipment, of the type used in factories, warehouses, dock areas or airports for short distance transport of goods; tractors of the type used on railway station platforms; parts of the fore"
  },
  {
    "HS4": "8710",
    "HS4 Short Name": "Armored vehicles",
    "HS4 Description": "Tanks and other armoured fighting vehicles, motorised, whether or not fitted with weapons, and parts of such vehicles."
  },
  {
    "HS4": "8711",
    "HS4 Short Name": "Motorcycles",
    "HS4 Description": "Motorcycles (including mopeds) and cycles fitted with an auxiliary motor, with or without side-cars; side-cars."
  },
  {
    "HS4": "8712",
    "HS4 Short Name": "Bicycles",
    "HS4 Description": "Bicycles and other cycles (including delivery tricycles), not motorised."
  },
  {
    "HS4": "8713",
    "HS4 Short Name": "Wheelchairs",
    "HS4 Description": "Carriages for disabled persons, whether or not motorised or otherwise mechanically propelled."
  },
  {
    "HS4": "8714",
    "HS4 Short Name": "Bi-Wheel Vehicle Parts",
    "HS4 Description": "Parts and accessories of vehicles of headings 87.11 to 87.13."
  },
  {
    "HS4": "8715",
    "HS4 Short Name": "Baby Carriages",
    "HS4 Description": "Baby carriages and parts thereof."
  },
  {
    "HS4": "8716",
    "HS4 Short Name": "Trailers",
    "HS4 Description": "Trailers and semi-trailers; other vehicles, not mechanically propelled; parts thereof."
  },
  {
    "HS4": "8801",
    "HS4 Short Name": "Non-powered Aircraft",
    "HS4 Description": "Balloons and dirigibles; gliders, hang gliders and other nonpowered aircraft."
  },
  {
    "HS4": "8802",
    "HS4 Short Name": "Planes, Helicopters, and/or Spacecraft",
    "HS4 Description": "Other aircraft (for example, helicopters, aeroplanes); spacecraft (including satellites) and suborbital and spacecraft launch vehicles."
  },
  {
    "HS4": "8803",
    "HS4 Short Name": "Aircraft Parts",
    "HS4 Description": "Parts of goods of heading 88.01 or 88.02."
  },
  {
    "HS4": "8804",
    "HS4 Short Name": "Parachutes",
    "HS4 Description": "Parachutes (including dirigible parachutes and paragliders) and rotochutes; parts thereof and accessories thereto."
  },
  {
    "HS4": "8805",
    "HS4 Short Name": "Aircraft Launch Gear",
    "HS4 Description": "Aircraft launching gear; deck-arrestor or similar gear; ground flying trainers; parts of the foregoing articles."
  },
  {
    "HS4": "8806",
    "HS4 Short Name": "Unmanned aircraft",
    "HS4 Description": "Unmanned aircraft"
  },
  {
    "HS4": "8807",
    "HS4 Short Name": "Parts of aircraft",
    "HS4 Description": "Parts of aircraft and spacecraft of heading 8801, 8802 or 8806, n.e.s."
  },
  {
    "HS4": "8901",
    "HS4 Short Name": "Passenger and Cargo Ships",
    "HS4 Description": "Cruise ships, excursion boats, ferry-boats, cargo ships, barges and similar vessels for the transport of persons or goods."
  },
  {
    "HS4": "8902",
    "HS4 Short Name": "Fishing Ships",
    "HS4 Description": "Fishing vessels; factory ships and other vessels for processing or preserving fishery products."
  },
  {
    "HS4": "8903",
    "HS4 Short Name": "Recreational Boats",
    "HS4 Description": "Yachts and other vessels for pleasure or sports; rowing boats and canoes."
  },
  {
    "HS4": "8904",
    "HS4 Short Name": "Tug Boats",
    "HS4 Description": "Tugs and pusher craft."
  },
  {
    "HS4": "8905",
    "HS4 Short Name": "Special Purpose Ships",
    "HS4 Description": "Light-vessels, fire-floats, dredgers, floating cranes and other vessels the navigability of which is subsidiary to their main function; floating docks; floating or submersible drilling or production platforms."
  },
  {
    "HS4": "8906",
    "HS4 Short Name": "Other Sea Vessels",
    "HS4 Description": "Other vessels, including warships and lifeboats other than rowing boats."
  },
  {
    "HS4": "8907",
    "HS4 Short Name": "Other Floating Structures",
    "HS4 Description": "Other floating structures (for example, rafts, tanks, cofferdams, landing-stages, buoys and beacons)."
  },
  {
    "HS4": "8908",
    "HS4 Short Name": "Scrap Vessels",
    "HS4 Description": "Vessels and other floating structures for breaking up."
  },
  {
    "HS4": "9001",
    "HS4 Short Name": "Optical Fibers",
    "HS4 Description": "Optical fibres and optical fibre bundles; optical fibre cables other than those of heading 85.44; sheets and plates of polarising material; lenses (including contact lenses), prisms, mirrors and other optical elements, of any material, unmounted, other th"
  },
  {
    "HS4": "9002",
    "HS4 Short Name": "Mirrors and Lenses",
    "HS4 Description": "Lenses, prisms, mirrors and other optical elements, of any material, mounted, being parts of or fittings for instruments or apparatus, other than such elements of glass not optically worked."
  },
  {
    "HS4": "9003",
    "HS4 Short Name": "Eyewear Frames",
    "HS4 Description": "Frames and mountings for spectacles, goggles or the like, and parts thereof."
  },
  {
    "HS4": "9004",
    "HS4 Short Name": "Eyewear",
    "HS4 Description": "Spectacles, goggles and the like, corrective, protective or other."
  },
  {
    "HS4": "9005",
    "HS4 Short Name": "Binoculars and Telescopes",
    "HS4 Description": "Binoculars, monoculars, other optical telescopes, and mountings therefor; other astronomical instruments and mountings therefor, but not including instruments for radio-astronomy."
  },
  {
    "HS4": "9006",
    "HS4 Short Name": "Cameras",
    "HS4 Description": "Photographic (other than cinematographic) cameras; photographic flashlight apparatus and flashbulbs other than discharge lamps of heading 85.39."
  },
  {
    "HS4": "9007",
    "HS4 Short Name": "Video Cameras",
    "HS4 Description": "Cinematographic cameras and projectors, whether or not incorporating sound recording or reproducing apparatus."
  },
  {
    "HS4": "9008",
    "HS4 Short Name": "Image Projectors",
    "HS4 Description": "Image projectors, other than cinematographic; photographic (other than cinematographic) enlargers and reducers."
  },
  {
    "HS4": "9009",
    "HS4 Short Name": "Photocopiers",
    "HS4 Description": "(-2006) Photocopying apparatus incorporating an optical system or of the contact type and thermo-copying apparatus"
  },
  {
    "HS4": "9010",
    "HS4 Short Name": "Photo Lab Equipment",
    "HS4 Description": "Apparatus and equipment for photographic (including cinematographic) laboratories, not specified or included elsewhere in this Chapter; negatoscopes; projection screens."
  },
  {
    "HS4": "9011",
    "HS4 Short Name": "Microscopes",
    "HS4 Description": "Compound optical microscopes, including those for photomicrography, cinephotomicrography or microprojection."
  },
  {
    "HS4": "9012",
    "HS4 Short Name": "Non-optical Microscopes",
    "HS4 Description": "Microscopes other than optical microscopes; diffraction apparatus."
  },
  {
    "HS4": "9013",
    "HS4 Short Name": "LCDs",
    "HS4 Description": "Liquid crystal devices not constituting articles provided for more specifically in other headings; lasers, other than laser diodes; other optical appliances and instruments, not specified or included elsewhere in this Chapter."
  },
  {
    "HS4": "9014",
    "HS4 Short Name": "Compasses",
    "HS4 Description": "Direction finding compasses; other navigational instruments and appliances."
  },
  {
    "HS4": "9015",
    "HS4 Short Name": "Surveying Equipment",
    "HS4 Description": "Surveying (including photogrammetrical surveying), hydrographic, oceanographic, hydrological, meteorological or geophysical instruments and appliances, excluding compasses; rangefinders."
  },
  {
    "HS4": "9016",
    "HS4 Short Name": "Balances",
    "HS4 Description": "Balances of a sensitivity of 5 cg or better, with or without weights."
  },
  {
    "HS4": "9017",
    "HS4 Short Name": "Drafting Tools",
    "HS4 Description": "Drawing, marking-out or mathematical calculating instruments (for example, drafting machines, pantographs, protractors, drawing sets, slide rules, disc calculators); instruments for measuring length, for use in the hand (for example, measuring rods and ta"
  },
  {
    "HS4": "9018",
    "HS4 Short Name": "Medical Instruments",
    "HS4 Description": "Instruments and appliances used in medical, surgical, dental or veterinary sciences, including scintigraphic apparatus, other electro-medical apparatus and sight-testing instruments."
  },
  {
    "HS4": "9019",
    "HS4 Short Name": "Therapeutic Appliances",
    "HS4 Description": "Mechano-therapy appliances; massage apparatus; psychological aptitude-testing apparatus; ozone therapy, oxygen therapy, aerosol therapy, artificial respiration or other therapeutic respiration apparatus."
  },
  {
    "HS4": "9020",
    "HS4 Short Name": "Breathing Appliances",
    "HS4 Description": "Other breathing appliances and gas masks, excluding protective masks having neither mechanical parts nor replaceable filters."
  },
  {
    "HS4": "9021",
    "HS4 Short Name": "Orthopedic Appliances",
    "HS4 Description": "Orthopaedic appliances, including crutches, surgical belts and trusses; splints and other fracture appliances; artificial parts of the body; hearing aids and other appliances which are worn or carried, or implanted in the body, to compensate for a defect"
  },
  {
    "HS4": "9022",
    "HS4 Short Name": "X-Ray Equipment",
    "HS4 Description": "Apparatus based on the use of X-rays or of alpha, beta or gamma radiations, whether or not for medical, surgical, dental or veterinary uses, including radiography or radiotherapy apparatus, X-ray tubes and other X-ray generators, high tension generators,"
  },
  {
    "HS4": "9023",
    "HS4 Short Name": "Instructional Models",
    "HS4 Description": "Instruments, apparatus and models, designed for demonstrational purposes (for example, in education or exhibitions), unsuitable for other uses."
  },
  {
    "HS4": "9024",
    "HS4 Short Name": "Tensile Testing Machines",
    "HS4 Description": "Machines and appliances for testing the hardness, strength, compressibility, elasticity or other mechanical properties of materials (for example, metals, wood, textiles, paper, plastics)."
  },
  {
    "HS4": "9025",
    "HS4 Short Name": "Hydrometers",
    "HS4 Description": "Hydrometers and similar floating instruments, thermometers, pyrometers, barometers, hygrometers and psychrometers, recording or not, and any combination of these instruments."
  },
  {
    "HS4": "9026",
    "HS4 Short Name": "Gas and Liquid Flow Measuring Instruments",
    "HS4 Description": "Instruments and apparatus for measuring or checking the flow, level, pressure or other variables of liquids or gases (for example, flow meters, level gauges, manometers, heat meters), excluding instruments and apparatus of heading 90.14, 90.15, 90.28 or 9"
  },
  {
    "HS4": "9027",
    "HS4 Short Name": "Chemical Analysis Instruments",
    "HS4 Description": "Instruments and apparatus for physical or chemical analysis (for example, polarimeters, refractometers, spectrometers, gas or smoke analysis apparatus); instruments and apparatus for measuring or checking viscosity, porosity, expansion, surface tension or"
  },
  {
    "HS4": "9028",
    "HS4 Short Name": "Utility Meters",
    "HS4 Description": "Gas, liquid or electricity supply or production meters, including calibrating meters therefor."
  },
  {
    "HS4": "9029",
    "HS4 Short Name": "Revolution Counters",
    "HS4 Description": "Revolution counters, production counters, taximeters, mileometers, pedometers and the like; speed indicators and tachometers, other than those of heading 90.14 or 90.15; stroboscopes."
  },
  {
    "HS4": "9030",
    "HS4 Short Name": "Oscilloscopes",
    "HS4 Description": "Oscilloscopes, spectrum analysers and other instruments and apparatus for measuring or checking electrical quantities, excluding meters of heading 90.28; instruments and apparatus for measuring or detecting alpha, beta, gamma, X-ray, cosmic or other ionis"
  },
  {
    "HS4": "9031",
    "HS4 Short Name": "Other Measuring Instruments",
    "HS4 Description": "Measuring or checking instruments, appliances and machines, not specified or included elsewhere in this Chapter; profile projectors."
  },
  {
    "HS4": "9032",
    "HS4 Short Name": "Thermostats",
    "HS4 Description": "Automatic regulating or controlling instruments and apparatus."
  },
  {
    "HS4": "9033",
    "HS4 Short Name": "Opto-Electric Instrument Parts",
    "HS4 Description": "Parts and accessories (not specified or included elsewhere in this Chapter) for machines, appliances, instruments or apparatus of Chapter 90."
  },
  {
    "HS4": "9101",
    "HS4 Short Name": "Precious Metal Watches",
    "HS4 Description": "Wrist-watches, pocket-watches and other watches, including stop-watches, with case of precious metal or of metal clad with precious metal."
  },
  {
    "HS4": "9102",
    "HS4 Short Name": "Base Metal Watches",
    "HS4 Description": "Wrist-watches, pocket-watches and other watches, including stop-watches, other than those of heading 91.01."
  },
  {
    "HS4": "9103",
    "HS4 Short Name": "Clocks with Watch Movements",
    "HS4 Description": "Clocks with watch movements, excluding clocks of heading 91.04."
  },
  {
    "HS4": "9104",
    "HS4 Short Name": "Dashboard Clocks",
    "HS4 Description": "Instrument panel clocks and clocks of a similar type for vehicles, aircraft, spacecraft or vessels."
  },
  {
    "HS4": "9105",
    "HS4 Short Name": "Other Clocks",
    "HS4 Description": "Other clocks."
  },
  {
    "HS4": "9106",
    "HS4 Short Name": "Time Recording Instruments",
    "HS4 Description": "Time of day recording apparatus and apparatus for measuring, recording or otherwise indicating intervals of time, with clock or watch movement or with synchronous motor (for example, timeregisters, time-recorders)."
  },
  {
    "HS4": "9107",
    "HS4 Short Name": "Time Switches",
    "HS4 Description": "Time switches with clock or watch movement or with synchronous motor."
  },
  {
    "HS4": "9108",
    "HS4 Short Name": "Watch Movements",
    "HS4 Description": "Watch movements, complete and assembled."
  },
  {
    "HS4": "9109",
    "HS4 Short Name": "Clock Movements",
    "HS4 Description": "Clock movements, complete and assembled."
  },
  {
    "HS4": "9110",
    "HS4 Short Name": "Incomplete Movement Sets",
    "HS4 Description": "Complete watch or clock movements, unassembled or partly assembled (movement sets); incomplete watch or clock movements, assembled; rough watch or clock movements."
  },
  {
    "HS4": "9111",
    "HS4 Short Name": "Watch Cases and Parts",
    "HS4 Description": "Watch cases and parts thereof."
  },
  {
    "HS4": "9112",
    "HS4 Short Name": "Clock Cases and Parts",
    "HS4 Description": "Clock cases and cases of a similar type for other goods of this Chapter, and parts thereof."
  },
  {
    "HS4": "9113",
    "HS4 Short Name": "Watch Straps",
    "HS4 Description": "Watch straps, watch bands and watch bracelets, and parts thereof."
  },
  {
    "HS4": "9114",
    "HS4 Short Name": "Other Clocks and Watches",
    "HS4 Description": "Other clock or watch parts."
  },
  {
    "HS4": "9201",
    "HS4 Short Name": "Pianos",
    "HS4 Description": "Pianos, including automatic pianos; harpsichords and other keyboard stringed instruments."
  },
  {
    "HS4": "9202",
    "HS4 Short Name": "String Instruments",
    "HS4 Description": "Other string musical instruments (for example, guitars, violins, harps)."
  },
  {
    "HS4": "9203",
    "HS4 Short Name": "Pipe Organs",
    "HS4 Description": "(-2006) Keyboard pipe organs; harmoniums and similar keyboard instruments with free metal reeds (excl. string musical instruments)"
  },
  {
    "HS4": "9204",
    "HS4 Short Name": "Accordions",
    "HS4 Description": "(-2006) Accordions and similar instruments; mouth organs"
  },
  {
    "HS4": "9205",
    "HS4 Short Name": "Wind Instruments",
    "HS4 Description": "Wind musical instruments (for example, keyboard pipe organs, accordions, clarinets, trumpets, bagpipes), other than fairground organs and mechanical street organs."
  },
  {
    "HS4": "9206",
    "HS4 Short Name": "Percussion",
    "HS4 Description": "Percussion musical instruments (for example, drums, xylophones, cymbals, castanets, maracas)."
  },
  {
    "HS4": "9207",
    "HS4 Short Name": "Electric Musical Instruments",
    "HS4 Description": "Musical instruments, the sound of which is produced, or must be amplified, electrically (for example, organs, guitars, accordions)."
  },
  {
    "HS4": "9208",
    "HS4 Short Name": "Other Musical Instruments",
    "HS4 Description": "Musical boxes, fairground organs, mechanical street organs, mechanical singing birds, musical saws and other musical instruments not falling within any other heading of this Chapter; decoy calls of all kinds; whistles, call horns and other mouthblown so"
  },
  {
    "HS4": "9209",
    "HS4 Short Name": "Musical Instrument Parts",
    "HS4 Description": "Parts (for example, mechanisms for musical boxes) and accessories (for example, cards, discs and rolls for mechanical instruments) of musical instruments; metronomes, tuning forks and pitch pipes of all kinds."
  },
  {
    "HS4": "9301",
    "HS4 Short Name": "Military Weapons",
    "HS4 Description": "Military weapons, other than revolvers, pistols and the arms of heading 93.07."
  },
  {
    "HS4": "9302",
    "HS4 Short Name": "Handguns",
    "HS4 Description": "Revolvers and pistols, other than those of heading 93.03 or 93.04."
  },
  {
    "HS4": "9303",
    "HS4 Short Name": "Other Firearms",
    "HS4 Description": "Other firearms and similar devices which operate by the firing of an explosive charge (for example, sporting shotguns and rifles, muzzle-loading firearms, Very pistols and other devices designed to project only signal flares, pistols and revolvers for fir"
  },
  {
    "HS4": "9304",
    "HS4 Short Name": "Spring, Air, and Gas Guns",
    "HS4 Description": "Other arms (for example, spring, air or gas guns and pistols, truncheons), excluding those of heading 93.07."
  },
  {
    "HS4": "9305",
    "HS4 Short Name": "Weapons Parts and Accessories",
    "HS4 Description": "Parts and accessories of articles of headings 93.01 to 93.04."
  },
  {
    "HS4": "9306",
    "HS4 Short Name": "Explosive Ammunition",
    "HS4 Description": "Bombs, grenades, torpedoes, mines, missiles and similar munitions of war and parts thereof; cartridges and other ammunition and projectiles and parts thereof, including shot and cartridge wads."
  },
  {
    "HS4": "9307",
    "HS4 Short Name": "Bladed Weapons and Accessories",
    "HS4 Description": "Swords, cutlasses, bayonets, lances and similar arms and parts thereof and scabbards and sheaths therefor."
  },
  {
    "HS4": "9401",
    "HS4 Short Name": "Seats",
    "HS4 Description": "Seats (other than those of heading 94.02), whether or not convertible into beds, and parts thereof."
  },
  {
    "HS4": "9402",
    "HS4 Short Name": "Medical Furniture",
    "HS4 Description": "Medical, surgical, dental or veterinary furniture (for example, operating tables, examination tables, hospital beds with mechanical fittings, dentists' chairs); barbers' chairs and similar chairs, having rotating as well as both reclining and elevating mo"
  },
  {
    "HS4": "9403",
    "HS4 Short Name": "Other Furniture",
    "HS4 Description": "Other furniture and parts thereof."
  },
  {
    "HS4": "9404",
    "HS4 Short Name": "Mattresses",
    "HS4 Description": "Mattress supports; articles of bedding and similar furnishing (for example, mattresses, quilts, eiderdowns, cushions, pouffes and pillows) fitted with springs or stuffed or internally fitted with any material or of cellular rubber or plastics, whether or"
  },
  {
    "HS4": "9405",
    "HS4 Short Name": "Light Fixtures",
    "HS4 Description": "Lamps and lighting fittings including searchlights and spotlights and parts thereof, not elsewhere specified or included; illuminated signs, illuminated name-plates and the like, having a permanently fixed light source, and parts thereof not elsewhere spe"
  },
  {
    "HS4": "9406",
    "HS4 Short Name": "Prefabricated Buildings",
    "HS4 Description": "Prefabricated buildings."
  },
  {
    "HS4": "9501",
    "HS4 Short Name": "Wheeled Toys",
    "HS4 Description": "(-2006) Wheeled toys designed to be ridden by children, e.g. tricycles, scooters, pedal cars (excl. normal bicycles with ball bearings); dolls'' carriages"
  },
  {
    "HS4": "9502",
    "HS4 Short Name": "Dolls",
    "HS4 Description": "(-2006) Dolls representing only human beings"
  },
  {
    "HS4": "9503",
    "HS4 Short Name": "Models and Stuffed Animals",
    "HS4 Description": "Tricycles, scooters, pedal cars and similar wheeled toys; dolls' carriages; dolls; other toys; reduced-size ('scale') models and similar recreational models, working or not; puzzles of all kinds."
  },
  {
    "HS4": "9504",
    "HS4 Short Name": "Video and Card Games",
    "HS4 Description": "Video game consoles and machines, articles for funfair, table or parlour games, including pintables, billiards, special tables for casino games and automatic bowling alley equipment."
  },
  {
    "HS4": "9505",
    "HS4 Short Name": "Party Decorations",
    "HS4 Description": "Festive, carnival or other entertainment articles, including conjuring tricks and novelty jokes."
  },
  {
    "HS4": "9506",
    "HS4 Short Name": "Sports Equipment",
    "HS4 Description": "Articles and equipment for general physical exercise, gymnastics, athletics, other sports (including table-tennis) or outdoor games, not specified or included elsewhere in this Chapter; swimming pools and paddling pools."
  },
  {
    "HS4": "9507",
    "HS4 Short Name": "Fishing and Hunting Equipment",
    "HS4 Description": "Fishing rods, fish-hooks and other line fishing tackle; fish landing nets, butterfly nets and similar nets; decoy “birds” (other than those of heading 92.08 or 97.05) and similar hunting or shooting requisites."
  },
  {
    "HS4": "9508",
    "HS4 Short Name": "Fairground Amusements",
    "HS4 Description": "Roundabouts, swings, shooting galleries and other fairground amusements; travelling circuses and travelling menageries; travelling theatres."
  },
  {
    "HS4": "9601",
    "HS4 Short Name": "Worked Ivory and Bone",
    "HS4 Description": "Worked ivory, bone, tortoise-shell, horn, antlers, coral, motherof-pearl and other animal carving material, and articles of these materials (including articles obtained by moulding)."
  },
  {
    "HS4": "9602",
    "HS4 Short Name": "Vegetable and Mineral Carvings",
    "HS4 Description": "Worked vegetable or mineral carving material and articles of these materials; moulded or carved articles of wax, of stearin, of natural gums or natural resins or of modelling pastes, and other moulded or carved articles, not elsewhere specified or include"
  },
  {
    "HS4": "9603",
    "HS4 Short Name": "Brooms",
    "HS4 Description": "Brooms, brushes (including brushes constituting parts of machines, appliances or vehicles), hand-operated mechanical floor sweepers, not motorised, mops and feather dusters; prepared knots and tufts for broom or brush making; paint pads and rollers; squee"
  },
  {
    "HS4": "9604",
    "HS4 Short Name": "Hand Sifters",
    "HS4 Description": "Hand sieves and hand riddles."
  },
  {
    "HS4": "9605",
    "HS4 Short Name": "Travel Kits",
    "HS4 Description": "Travel sets for personal toilet, sewing or shoe or clothes cleaning."
  },
  {
    "HS4": "9606",
    "HS4 Short Name": "Buttons",
    "HS4 Description": "Buttons, press-fasteners, snap-fasteners and press-studs, button moulds and other parts of these articles; button blanks."
  },
  {
    "HS4": "9607",
    "HS4 Short Name": "Zippers",
    "HS4 Description": "Slide fasteners and parts thereof."
  },
  {
    "HS4": "9608",
    "HS4 Short Name": "Pens",
    "HS4 Description": "Ball point pens; felt tipped and other porous-tipped pens and markers; fountain pens, stylograph pens and other pens; duplicating stylos; propelling or sliding pencils; pen-holders, pencil-holders and similar holders; parts (including caps and clips) of t"
  },
  {
    "HS4": "9609",
    "HS4 Short Name": "Pencils and Crayons",
    "HS4 Description": "Pencils (other than pencils of heading 96.08), crayons, pencil leads, pastels, drawing charcoals, writing or drawing chalks and tailors' chalks."
  },
  {
    "HS4": "9610",
    "HS4 Short Name": "Chalkboards",
    "HS4 Description": "Slates and boards, with writing or drawing surfaces, whether or not framed."
  },
  {
    "HS4": "9611",
    "HS4 Short Name": "Rubber Stamps",
    "HS4 Description": "Date, sealing or numbering stamps, and the like (including devices for printing or embossing labels), designed for operating in the hand; hand-operated composing sticks and hand printing sets incorporating such composing sticks."
  },
  {
    "HS4": "9612",
    "HS4 Short Name": "Ink Ribbons",
    "HS4 Description": "Typewriter or similar ribbons, inked or otherwise prepared for giving impressions, whether or not on spools or in cartridges; ink-pads, whether or not inked, with or without boxes."
  },
  {
    "HS4": "9613",
    "HS4 Short Name": "Lighters",
    "HS4 Description": "Cigarette lighters and other lighters, whether or not mechanical or electrical, and parts thereof other than flints and wicks."
  },
  {
    "HS4": "9614",
    "HS4 Short Name": "Smoking Pipes",
    "HS4 Description": "Smoking pipes (including pipe bowls) and cigar or cigarette holders, and parts thereof."
  },
  {
    "HS4": "9615",
    "HS4 Short Name": "Combs",
    "HS4 Description": "Combs, hair-slides and the like; hairpins, curling pins, curling grips, hair-curlers and the like, other than those of heading 85.16, and parts thereof."
  },
  {
    "HS4": "9616",
    "HS4 Short Name": "Scent Sprays",
    "HS4 Description": "Scent sprays and similar toilet sprays, and mounts and heads therefor; powder-puffs and pads for the application of cosmetics or toilet preparations."
  },
  {
    "HS4": "9617",
    "HS4 Short Name": "Vacuum Flask",
    "HS4 Description": "Vacuum flasks and other vacuum vessels, complete with cases; parts thereof other than glass inners."
  },
  {
    "HS4": "9618",
    "HS4 Short Name": "Mannequins",
    "HS4 Description": "Tailors' dummies and other lay figures; automata and other animated displays used for shop window dressing."
  },
  {
    "HS4": "9619",
    "HS4 Short Name": "Infant sanitary products",
    "HS4 Description": "Sanitary towels (pads) and tampons, napkins and napkin liners for babies and similar articles, of any material."
  },
  {
    "HS4": "9620",
    "HS4 Short Name": "Tripods and similar",
    "HS4 Description": "Monopods, bipods, tripods and similar articles"
  },
  {
    "HS4": "9701",
    "HS4 Short Name": "Paintings",
    "HS4 Description": "Paintings, drawings and pastels, executed entirely by hand, other than drawings of heading 49.06 and other than handpainted or hand-decorated manufactured articles; collages and similar decorative plaques."
  },
  {
    "HS4": "9702",
    "HS4 Short Name": "Prints",
    "HS4 Description": "Original engravings, prints and lithographs."
  },
  {
    "HS4": "9703",
    "HS4 Short Name": "Sculptures",
    "HS4 Description": "Original sculptures and statuary, in any material."
  },
  {
    "HS4": "9704",
    "HS4 Short Name": "Revenue Stamps",
    "HS4 Description": "Postage or revenue stamps, stamp-postmarks, first-day covers, postal stationery (stamped paper), and the like, used or unused, other than those of heading 49.07."
  },
  {
    "HS4": "9705",
    "HS4 Short Name": "Collector's Items",
    "HS4 Description": "Collections and collectors' pieces of zoological, botanical, mineralogical, anatomical, historical, archaeological, palaeontological, ethnographic or numismatic interest."
  },
  {
    "HS4": "9706",
    "HS4 Short Name": "Antiques",
    "HS4 Description": "Antiques of an age exceeding one hundred years."
  },
  {
    "HS4": "9801",
    "HS4 Short Name": "Goods exported for exhibition or competition and intended to be returned to Canada.",
    "HS4 Description": "Goods exported for exhibition or competition and intended to be returned to Canada, or goods shipped after exhibition in Canada."
  },
  {
    "HS4": "9802",
    "HS4 Short Name": "Repairs",
    "HS4 Description": "Repairs"
  },
  {
    "HS4": "9803",
    "HS4 Short Name": "Unimproved containers, bags or similar articles",
    "HS4 Description": "Containers, bags or similar articles used in shuttle service, without having been advanced in value or improved in condition by any process of manufacture or other means"
  },
  {
    "HS4": "9804",
    "HS4 Short Name": "Medals, trophies, etc, which have been awarded to foreign persons/organizations",
    "HS4 Description": "Medals, trophies, etc, which have been awarded to foreign persons/organizations"
  },
  {
    "HS4": "9805",
    "HS4 Short Name": "Goods exported to a member of the Canadian Forces or to an employee",
    "HS4 Description": "Goods exported to a member of the Canadian Forces or to an employee of the Canadian government stationed abroad for his personal or household use, and goods exported to members of Foreign Armed Forces returning to their countries"
  },
  {
    "HS4": "9806",
    "HS4 Short Name": "Settlers’/migrants’ personal and household effects",
    "HS4 Description": "Settlers’/migrants’ personal and household effects valued at $2,000 CDN or more and all goods valued at $2,000 CDN or more acquired by all categories of travellers including non-resident workers."
  },
  {
    "HS4": "9807",
    "HS4 Short Name": "Private donations and gifts",
    "HS4 Description": "Private donations and gifts"
  },
  {
    "HS4": "9808",
    "HS4 Short Name": "Items of personal or official use of the Canadian government representatives stationed abroad",
    "HS4 Description": "Articles for the personal or official use of the Canadian government representatives stationed abroad, of foreign diplomatic representatives returning home after posting in Canada, and articles for the personal use of their families, suites or servants"
  },
  {
    "HS4": "9809",
    "HS4 Short Name": "Weapons exported to Canadian government foreign bases",
    "HS4 Description": "Arms, military stores and munitions of war exported by the Canadian government to its foreign bases and similar goods owned by NATO countries and being returned after use in Canada"
  },
  {
    "HS4": "9810",
    "HS4 Short Name": "Contractors’ equipment and tools re-exported",
    "HS4 Description": "Contractors’ equipment and tools to be returned to Canada after completion of contract and similar foreign contractors’ equipment re-exported after use in Canada"
  },
  {
    "HS4": "9811",
    "HS4 Short Name": "U.S. special transactions",
    "HS4 Description": "U.S. special transactions, trade (includes merchandise of Nos. 9811.00.01 to 9811.00.58 inclusive)"
  },
  {
    "HS4": "9812",
    "HS4 Short Name": "Commercial samples,",
    "HS4 Description": "Commercial samples, excluding those of No. 98.01"
  },
  {
    "HS4": "9817",
    "HS4 Short Name": "Imports Duty Free",
    "HS4 Description": "Imports Duty Free Under Spec Classif Prov Nesoi"
  },
  {
    "HS4": "9818",
    "HS4 Short Name": "Equipment",
    "HS4 Description": "Equip/pts Incl Boats Purchsd Fr O Repair Pts, Etc."
  },
  {
    "HS4": "9901",
    "HS4 Short Name": "Unclassifiable exports",
    "HS4 Description": "Unclassifiable exports"
  },
  {
    "HS4": "9902",
    "HS4 Short Name": "Groceries",
    "HS4 Description": "Groceries"
  },
  {
    "HS4": "9903",
    "HS4 Short Name": "Duty free shop exports",
    "HS4 Description": "Duty free shop exports"
  },
  {
    "HS4": "9904",
    "HS4 Short Name": "Re-exports to the U.S.",
    "HS4 Description": "Goods of US origin, not advanced in value, returning to the United States"
  },
  {
    "HS4": "9999",
    "HS4 Short Name": "Salvage",
    "HS4 Description": "Salvage (dutiable Mdse F Vssl Sunk 2yr U.S. Watrs)"
  }
]
);


 }

  // Process raw nodes data
  private processNodes(rawNodes: RawNode[]): Node[] {

    let nodes = rawNodes.map(obj => {
      const newObj = Object.fromEntries(
        Object.entries(obj).map(([key, value]) => {
          const newKey = key === 'product_code' ? 'id' : key;
          return [newKey, value];
        })
      );
      return newObj as any;
    });

    nodes = nodes.map(obj => ({
      ...obj,
      id: String(obj.id).padStart(4, '0'),
      x: obj.x * 100,
      y: obj.y * 100
    }));

    nodes.forEach((node: Node) => {
      node.category = this.findCategory(node);
      node.state = 0;
    });

    nodes.forEach(function(part, index, nodes) {
      nodes[index]['y'] = (nodes[index].y ) * - 7 ;
      nodes[index]['x'] = (nodes[index].x ) * 9 ;
    });


    return nodes;
  }

  // Process raw links data
  private processLinks(rawLinks: any[]): Link[] {
    
    let links = rawLinks.map(obj => ({
      source: String(obj.source).padStart(4, '0'),
      target: String(obj.target).padStart(4, '0')
    }));

    let links2 = links.map(function(d) {
      let state = 0;
      return {...d, state};
    });

    return links2;
  }

  // Mock fetchData function - replace with your actual API call
  async fetchData(region: keyof typeof this.apiMap): Promise<any[]> {
    // Replace this with your actual data fetching logic
    let response = await fetch(this.apiMap[region]);
    const data = await response.json();

    const thresholdDate = new Date("2021-01-01T00:00:00");

    const recent = data.filter((item: { Date: string | number | Date; }) => {
    const itemDate = new Date(item.Date);
    return itemDate > thresholdDate;
    });

    return recent;
  }


  // Calculate total sum
  calcTotalSum(data: GroupedData[]): number {
    return this.unifiedDataService.calculateTotalSum(data as any[]);
  }

  // Find category function - implement your actual logic
  private findCategory(node: Node): any {
    // Implement your actual findCategory logic here
    return node.cluster_name;
  }

  // Public methods
  getProcessedNodes(): Observable<Node[]> {
    return of(this.processNodes(this.rawNodes));
  }

  getProcessedLinks(): Observable<Link[]> {
    return of(this.processLinks(this.rawLinks));
  }

  getGroupedData(region: keyof typeof this.unifiedDataService['apiMap']): Observable<GroupedData[]> {
    return this.unifiedDataService.getProductSpaceData(region).pipe(
      map(result => result.groupedData)
    );
  }

  getAllData(region: keyof typeof this.unifiedDataService['apiMap']): Observable<{
    nodes: Node[], 
    links: Link[], 
    grouped: GroupedData[], 
    totalSum: number
  }> {
    return forkJoin({
      nodes: this.getProcessedNodes(),
      links: this.getProcessedLinks(),
      productSpaceData: this.unifiedDataService.getProductSpaceData(region)
    }).pipe(
      map(result => ({
        nodes: result.nodes,
        links: result.links,
        grouped: result.productSpaceData.groupedData,
        totalSum: result.productSpaceData.totalSum
      }))
    );
  }

  // Helper methods to find data by id
  findNodeById(nodes: Node[], id: string): Node | undefined {
    return nodes.find(node => node.id === id);
  }

  createDefault<T>(defaults: T): () => T {
    return () => ({ ...defaults });
  }





  findGroupedDataByProduct(grouped: GroupedData[], productId: string): GroupedData | undefined {



    const returnValue = this.unifiedDataService.findDataByProduct(grouped as any[], productId) as GroupedData | undefined;


    if (returnValue) {
      return returnValue
    } else {

      const descriptionFromHS = this.unifiedDataService.getHSDescriptions().find(desc => desc.HS4 === productId);

      const defaultData: GroupedData = {
        product: Number(productId),
        description: descriptionFromHS ? descriptionFromHS["HS4 Short Name"] : "Unknown Product",
        Value: 0,
        Date: "9999",
        prio: 0
      };
      return defaultData;  
      
    }
  }

  // Methods to update data if needed
  setHSDescriptions(descriptions: HSDescription[]): void {
    this.unifiedDataService.setHSDescriptions(descriptions);
  }
}