import { Component, OnInit } from '@angular/core';
import { CountriesService } from '../countries.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  constructor(public cs: CountriesService) { }

  filter_selected: string = '';
  currentOption: string = '';
  currentFilter: string = ''; 
  urlFilter:string = '';
  select_response: any[] = []

  ngOnInit(){
    this.resetVariables();
  }

  getSelectOptions(){
    this.resetVariables()
    this.currentFilter= this.cs.formatValueSelect(this.filter_selected) 
    return this.cs.getOptions(this.currentFilter)
  }
  
  searchCountry(){
    this.urlFilter = this.cs.formatSearchUrl(this.currentFilter)
    //Format GET with code of nativeName
    if(this.currentFilter == "languages"){
      var code_lang = ''
      for(let i = 0; i < this.cs.languages.length; i++){
        if(this.cs.languages[i].name == this.currentOption){
          code_lang = this.cs.languages[i].code
        }
      }
      return this.cs.getCountryByFilter(this.urlFilter,code_lang).subscribe(res => {
        this.select_response = res        
        //this.showFlags()
      })
    }
    else{
      return this.cs.getCountryByFilter(this.urlFilter,this.currentOption).subscribe(res => {
        this.select_response = res
        //this.showFlags()
      })
    }
  }

  resetVariables(){
    this.cs.select = []
    this.currentOption = ''
    this.select_response = []
    this.urlFilter = ''
  }
}
