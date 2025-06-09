// product-space-chart.service.ts

import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, of } from 'rxjs';
import { Link, Node, GroupedData, HSDescription, RawNode } from './product-space-chart.models';

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

  private hsDescriptions: HSDescription[] = [
    { HS4: "8518", "HS4 Short Name": "Electronic Equipment" },
    { HS4: "8535", "HS4 Short Name": "Electrical Machinery" },
    // Add your actual HS descriptions here
  ];

 
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



 constructor() { }

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

  // Process grouped data
  private async processGroupedData(region: keyof typeof this.apiMap): Promise<GroupedData[]> {
    const values = await this.fetchData(region);
    const thresholdDate = new Date("2021-01-01T00:00:00");
    
    const recent = values.filter(item => {
      const itemDate = new Date(item.Date);
      return itemDate > thresholdDate;
    });

    const processedRecent = recent.map((d: any) => {
      let description = this.hsDescriptions.filter((x) => {
        return x['HS4'] == d.product;
      })[0]?.['HS4 Short Name'] || 'Unknown';
      
      d['description'] = description;
      return d;
    });

    const grouped = Object.values(processedRecent).map((d: any) => {
      d['prio'] = 0;
      return d;
    });

    return grouped;
  }

  // Calculate total sum
  calcTotalSum(data: GroupedData[]): number {
    return data.reduce((accumulator, currentObject) => {
      if (typeof currentObject.Value === "number") {
        return accumulator + currentObject.Value;
      } else {
        console.log('Invalid or missing Value:', currentObject.Value);
        return accumulator;
      }
    }, 0);
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

  getGroupedData(region: keyof typeof this.apiMap): Observable<GroupedData[]> {
    return new Observable(observer => {
      this.processGroupedData(region).then(data => {
        observer.next(data);
        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });
  }

  getAllData(region: keyof typeof this.apiMap): Observable<{nodes: Node[], links: Link[], grouped: GroupedData[], totalSum: number}> {
    return forkJoin({
      nodes: this.getProcessedNodes(),
      links: this.getProcessedLinks(),
      grouped: this.getGroupedData(region)
    }).pipe(
      map(result => ({
        ...result,
        totalSum: this.calcTotalSum(result.grouped)
      }))
    );
  }

  // Helper methods to find data by id
  findNodeById(nodes: Node[], id: string): Node | undefined {
    return nodes.find(node => node.id === id);
  }

  findGroupedDataByProduct(grouped: GroupedData[], productId: string): GroupedData | undefined {

    const found = grouped.find(item => (item.product).toString() === productId);

    return found
  }

  // Methods to update data if needed
  setHSDescriptions(descriptions: HSDescription[]): void {
    this.hsDescriptions = descriptions;
  }
}