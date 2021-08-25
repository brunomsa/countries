import { Component, OnInit } from '@angular/core';
import { CountriesService } from '../countries.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  constructor(public cs: CountriesService) { }


  ngOnInit(){
    //this.cs.resetVariables();
  }

  getSelectOptions(){
    this.cs.resetVariables();
    this.cs.currentFilter= this.cs.formatValueSelect(this.cs.filter_selected);
    var option;
    return this.cs.getOptions(this.cs.currentFilter)
  }
}
