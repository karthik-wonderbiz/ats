// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private appRoutingModule: AppRoutingModule) {}

  ngOnInit(): void {
    this.appRoutingModule.loadUserRoutes();
  }
}
