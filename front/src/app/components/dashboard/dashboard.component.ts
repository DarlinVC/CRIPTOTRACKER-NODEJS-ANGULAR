import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { OnInit, OnChanges } from '@angular/core';

// services
import { SocketService } from 'src/app/services/socket.service';

// librarys
import { ChartComponent } from '@swimlane/ngx-charts';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  @ViewChild('chart', { static: true }) chart!: ChartComponent;

  // data of chart
  multi: any[];
  // data of right content
  amounts: Array<any> = [];
  // arrays of porcentage data
  pctHourBtc: Array<any> = [];
  pct24hBtc: Array<any> = [];
  pct7DayBtc: Array<any> = [];

  /* "false" refers to decreasing, for example: "-1.43" 
      and "true" to increasing, example: "1.43".
  */
  statusBtc1h: boolean = false;
  statusBtc24h: boolean = false;
  statusBtc7d: boolean = false;

  // options of chart
  view: any = [];
  legend: boolean = false;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = false;
  showXAxisLabel: boolean = false;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Population';
  timeline: boolean = true;
  autoSize: boolean = true;

  colorScheme: any = {
    domain: ['#D4AF37'],
  };
  constructor(private socket: SocketService) {
    this.multi = [
      {
        name: 'BTC',
        series: [],
      },
    ];
  }

  ngOnInit(): void {
    /**
     * Run the update chart dimensions function for the first
     *  time, so that the size is updated according to the device.
     */
    setTimeout(() => {
      this.updateChartDimensions();
    }, 3000);

    /**
     * gets the data, which is sent from the server socket.
     */
    this.socket.getBTC().subscribe(({ data }) => {
      const [BTC] = data;
      if (BTC.prices != undefined) {
        const pricesBTC = this.parseDate(BTC.prices);

        // adding BTC prices to multi.
        const [currentBTC, currentETH] = this.multi;
        // zero position is a btc. 
        this.multi[0].series = currentBTC.series.concat(pricesBTC);
        this.multi      = [...this.multi];

        // data of right content
        this.amounts    = BTC.prices.reverse();
        this.pctHourBtc = BTC.percentageHour;
        this.pct24hBtc  = BTC.percentage24h;
        this.pct7DayBtc = BTC.percentageHour;

        /* verification if the bitcoin in the last "hour, 24h, 7d" is going down
         or going up, to change the variable statusBtc */

        // hour
        if (BTC.percentageHour[2] < 0) {
          this.statusBtc1h = false;
        } else {
          this.statusBtc1h = true;
        }
        // 24h
        if (BTC.percentage24h[2] < 0) {
          this.statusBtc24h = false;
        } else {
          this.statusBtc24h = true;
        }
        // 7d
        if (BTC.percentage7Day[2] < 0) {
          this.statusBtc7d = false;
        } else {
          this.statusBtc7d = true;
        }
      }
    });
  }

  /**
   * 
   * @param dataRaw array of data.
   * @param time time in milliseconds
   * @returns returns a date taking the given milliseconds through the array.
   */
  parseDate(dataRaw: Array<any>): Array<any> {
    const result = dataRaw.map(([time, value], index) => {
      return {
        name: moment(time, 'x').toDate(),
        value,
      };
    });

    return result;
  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
  // detects when the size of the web is being changed to execute the update Chart Dimensions function.
  @HostListener('window:resize')
  onResize() {
    this.updateChartDimensions();
  }
  /**
   * updates the dimension of the chart to keep up with the container.
   */
  async updateChartDimensions() {
    const containerWidth = this.chartContainer.nativeElement.offsetWidth;
    const containerHeight = this.chartContainer.nativeElement.offsetHeight;

    this.chart.view = [containerWidth, containerHeight];
  }
}
