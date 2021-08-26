import { Component, OnInit } from '@angular/core';
import { CountriesService } from '../countries.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {

  constructor(public cs: CountriesService) { }

  getCurrentSelectOptions(){
    this.cs.resetVariables();
    this.cs.currentOption = '';
    this.cs.currentFilter= this.cs.formatValueSelect(this.cs.filterSelected);
    return this.cs.getOptions(this.cs.currentFilter);
  }
}
