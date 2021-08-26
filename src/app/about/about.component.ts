import { Component, OnInit } from '@angular/core';
import { CountriesService } from '../countries.service';
import { Router } from '@angular/router';
import { Countries } from '../countries.service'; 

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(public cs: CountriesService, private router: Router) { }

  ngOnInit(): void {
    //console.log(this.cs.currentCountry);
    this.getCurrentBorders();
  }

  getCurrentBorders(){
    var country_border =  this.cs.currentCountry.borders;
    this.cs.currentBorders = [];
    for(let i = 0; i < country_border.length; i++){
      this.cs.getCountryByCode(country_border[i].toLowerCase()).subscribe(res => {
        if(this.cs.currentBorders.indexOf(res) < 0)
          this.cs.currentBorders.push(res);
      });
    }
  }

  onClickRegionCountry(value: string){
    this.cs.getCoutriesByRegion(value);
    this.cs.searchCountry();
    this.router.navigate(['/home']);
  }

  onClickBorderCountry(country: Countries){
    this.cs.onClickCountry(country);
    this.getCurrentBorders();
  }

}
