import { Component, OnInit } from '@angular/core';
import { CountriesService } from '../countries.service';
import { Router } from '@angular/router'
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(public cs: CountriesService, private router: Router) { }

  ngOnInit(): void {
    console.log(this.cs.currentCountry);
    this.cs.getCurrentBorders();
  }

  onClickRegionCountry(value: string){
    this.cs.getCoutriesByRegion(value)
    this.cs.searchCountry()
    this.router.navigate(['/home']);
  }

}
