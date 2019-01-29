import { Component, NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import * as Chartist from 'chartist';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '../dashboard.service';
import { NotifyService } from '../../../shared/notify.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
    selector: 'app-home-admin',
    templateUrl: './home-admin.component.html',
    styleUrls: ['./home-admin.component.sass']
})
export class HomeAdminComponent implements OnInit {

    public timelineData: any;
    registerUsersStatus: boolean;
    public userRole = 'guest';

    constructor(
        private route: ActivatedRoute,
        private dashboard: DashboardService,
        private notify: NotifyService,
        private authService: AuthService
    ) {
        this.timelineData = {
            usersCount: 0, activeUsersCount: 0, appsCount: 0, reportsCount: 0, solvedReportsCount: 0
        };
    }

    ngOnInit() {
        this.getTimelineData();
        this.buildActivity();
        this.userRole = this.authService.user.role.toString();
        console.log( 'Home admin: ', this.authService.user );
    }

    registerUsersStatusEvent() {
        this.registerUsersStatus = !this.registerUsersStatus;
    }

    public getTimelineData(){
        return this.dashboard.getTimelineData().subscribe(res => {
            this.timelineData = res;
          }, error => {
            this.notify.error(error);
          });
    }

    public buildActivity(){
        var chartData = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            series: [
                { data: [5, 2, 3, 2, 0, 1], name: "Applications" },
                { data: [3, 8, 2, 6, 3, 2], name: "Reports" },
                { data: [8, 6, 4, 6, 4, 8], name: "Users" }
            ]
        };
        
        var options = { height: 350, showArea: true, chartPadding: { right: 40 }, fullWidth: true };
        var chartColors = [ "#28a745", "#5bc0de", "#007bff" ];
        var chart = new Chartist.Line('.ct-chart', chartData, options);
        var drawn = false;

        chart.on('draw', function(data){
            if( data.type === "line" ){
                data.element._node.setAttribute('style','stroke: '+ chartColors[ data.seriesIndex ] +'; stroke-width: 2px');
            } else if( data.type === "area" ){
                data.element._node.setAttribute('style','fill: ' + chartColors[ data.seriesIndex ]);
            } else if( data.type === "point" ){
                data.element._node.setAttribute('style','stroke: '+ chartColors[ data.seriesIndex ] +'; stroke-width: 10px');
            }
        });

        chart.on('draw', function(data){

            
            if( drawn ){
                return null;
            }

            if( data.seriesIndex === chartData.series.length-1 ){
                if( data.index === chartData.series[data.seriesIndex].data.length-1 ){
                    drawn = true;
                }
            }

            if(data.type === 'line' || data.type === 'area') {
                data.element.animate({
                    d: {
                        begin: 300 * (data.index+1), dur: 1250,
                        from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                        to: data.path.clone().stringify(),
                        easing: Chartist.Svg.Easing.easeOutExpo
                    }
                });
            }
        });

    }

}
