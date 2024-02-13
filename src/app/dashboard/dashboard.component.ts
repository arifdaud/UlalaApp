import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
am4core.useTheme(am4themes_animated);
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  tableUsersData!: any[];
  constructor(private http: HttpClient,private authService: AuthService,private router: Router) {}
  
  signOut(): void {
    // once click button, redirect to sign in
    this.authService.signOut();
    this.router.navigate(['/signin']);
  }
  ngOnInit() {
    if (this.authService.isAuthenticated()) {
    const token = this.authService.getBearerToken();
    this.http.get('http://test-demo.aemenersol.com/api/dashboard', { headers: { Authorization: `Bearer ${token}` } }).subscribe(
      (response: any) => {
        const pieChartdata = response.chartDonut; 
        this.createPieChart(pieChartdata);
        const barChartdata = response.chartBar; 
        this.createProgresBarChart(barChartdata);
        const tableUsersData = response.tableUsers;
        this.tableUsersData = tableUsersData;        
      },
      (error) => {
        console.error('Dashboard Error:', error);
      });
      
  } else {
    // Redirect to sign-in if not authenticated or token is not valid
    this.router.navigate(['/signin']);
  }
  }
  //piechart implementation
  createPieChart(data: any[]) {
    // Create chart instance
    let chart = am4core.create("chartDonut", am4charts.PieChart);
    // Add data
    chart.data = data;
    // Set inner radius
    chart.innerRadius = am4core.percent(50);
    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "value";
    pieSeries.dataFields.category = "name";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    // This creates initial animation
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;
    // color tone=grey
    pieSeries.slices.template.fill = am4core.color("#999");
  }
  //chartbar implementation
  createProgresBarChart(data: any[]) {
    let chart = am4core.create("chartbar", am4charts.XYChart);
    // Add data
    chart.data = data;
    // Add and configure X and Y axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "name"; 
    categoryAxis.renderer.grid.template.location = 0;
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // Add and configure Series
    let barSeries = chart.series.push(new am4charts.ColumnSeries());
    barSeries.dataFields.valueY = "value";
    barSeries.dataFields.categoryX = "name";
    barSeries.columns.template.stroke = am4core.color("#fff");
     // color tone=grey
    barSeries.columns.template.fill = am4core.color("#999")
    // This creates initial animation
    barSeries.hiddenState.properties.opacity = 1;
  }
}