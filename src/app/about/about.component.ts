import { Component, OnInit } from '@angular/core';
import { CountriesService } from '../countries.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(public cs: CountriesService) { }

  ngOnInit(): void {
    console.log(this.cs.currentCountry)
    this.cs.getCurrentBorders();
  }

}
