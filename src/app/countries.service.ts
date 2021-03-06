import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'

export interface Languages {
  code: string,
  name: string
}

export interface Countries {
  name: string,
  capital: string,
  region: string,
  subregion: string,
  population: number,
  flag: string,
  languages: string[],
  borders: string[],
}

const urlBase = "https://restcountries.eu/rest/v2"

@Injectable({
  providedIn: 'root'
})

export class CountriesService {

  constructor(private http: HttpClient, private router: Router) { } 

  filterSelected: string = '';
  currentOption: string = '';
  currentFilter: string = '';
  urlFilter:string = '';
  select: Object[] = [];
  selectResponse: any[] = [];
  languages: Languages[] = [];
  currentlang: Languages = {
    code: '',
    name: ''
  };
  currentBorders: any[] = [];
  currentCountry: Countries = {
    name: "Brazil",
    capital: "Brasília",
    region: "Americas",
    subregion: "South America",
    population: 206135893,
    flag: "https://restcountries.eu/data/bra.svg",
    languages: ["Português"],
    borders: ["ARG", "BOL", "COL", "GUF", "GUY", "PRY", "PER", "SUR", "URY", "VEN"]
  };
  flagsDefault: string[] = ["bra", "ecu", "col", "chl", "ita", "fra", "grc", "isl", "jpn", "kor", "tur", "chn", "dza", "egy", "gha", "civ"]
  

  getOptions(value:string){
    var option;
    return this.http.get<any[]>(`${urlBase}/all?fields=${value}`).subscribe(res => {
      for(let i = 0; i < res.length; i++){
        //console.log(res[i])
        if(String(Object.values(res[i])).length > 0){
          if(value == "languages"){
            //Get nativeName of languages array
            for(let lang of res[i].languages){
              if(this.select.indexOf(lang.nativeName) < 0)
                this.select.push(lang.nativeName);
              this.currentlang = {
                code:lang.iso639_1,
                name:lang.nativeName};
              if(this.languages.indexOf(this.currentlang) < 0)  
                this.languages.push(this.currentlang);
            }
          //Order Array of String
          this.select.sort();
          }
          else if(value == "callingCodes"){
            option = Number(Object.values(res[i]));
            if(this.select.indexOf(option) < 0)
              this.select.push(option);
            //Order Array of String
            this.select.sort((a,b) => a < b ? -1 : a > b ? 1 : 0);
          }
          else{
            option = String(Object.values(res[i]));
            if(this.select.indexOf(option) < 0)
              this.select.push(option);
            //Order Array of String
            this.select.sort();
          }
        }
      }
    });
  }
  
  getCountryByFilter(urlFilter:string, value:string){
    return this.http.get<Object[]>(`${urlFilter}/${value}`);
  }

  getCountryByCode(name: string){
    return this.http.get(`${urlBase}/alpha/${name}`);
  }

  getCoutriesByRegion(value: string){
    this.filterSelected = 'Região';
    this.currentFilter = 'region';
    this.currentOption = value;
    this.select = []
    this.getOptions('region');
    //console.log(this.select);
  }

  getCurrentBorders(){
    var country_border =  this.currentCountry.borders;
    this.currentBorders = [];
    for(let i = 0; i < country_border.length; i++){
      this.getCountryByCode(country_border[i].toLowerCase()).subscribe(res => {
        if(this.currentBorders.indexOf(res) < 0)
          this.currentBorders.push(res);
      });
    }
  }

  searchCountry(){
    this.displayLoading();
    this.urlFilter = this.formatSearchUrl(this.currentFilter);
    //Format GET with code of nativeName
    setTimeout(()=>{
      if(this.currentFilter == "languages"){
        var code_lang = '';
        for(let i = 0; i < this.languages.length; i++){
          if(this.languages[i].name == this.currentOption)
            code_lang = this.languages[i].code;
        }
        return this.getCountryByFilter(this.urlFilter,code_lang).subscribe(res => {
          this.selectResponse = res
          this.hideLoading();
        });
      }
      else
        return this.getCountryByFilter(this.urlFilter,this.currentOption).subscribe(res => {
          this.selectResponse = res
          this.hideLoading();
        });
    },500)
  }

  onClickCountry(country: Countries | any){
    this.currentCountry = {
      name: country.name,
      capital: country.capital,
      region: country.region,
      subregion: country.subregion,
      population: country.population,
      flag: country.flag,
      languages: this.formatLanguagesCountry(country.languages),
      borders: country.borders,
    };
    this.router.navigate(['/about']);
  }

  onClickBorderCountry(country: Countries){
    this.onClickCountry(country);
    this.getCurrentBorders();
  }

  onClickDefaulCountry(code: string){
    this.getCountryByCode(code).subscribe(res => this.onClickCountry(res))
  }

  displayLoading(){
    let box_spinner = document.getElementById("bg-spinner")
    let spinner = document.getElementById("spinnerLoading")

    spinner?.classList.add("display")
    box_spinner?.classList.add("display")

    //Remove loading after 10s
    setTimeout(() =>{
      spinner?.classList.remove("display")
      box_spinner?.classList.remove("display")
    },10000)
  }

  hideLoading(){
    let box_spinner = document.getElementById("bg-spinner")
    let spinner = document.getElementById("spinnerLoading")

    spinner?.classList.remove("display")
    box_spinner?.classList.remove("display")
  }

  formatLanguagesCountry(languages:any[]):string[]{
    var arrayLang = [];
    for(let i = 0; i < languages.length; i++){
      arrayLang.push(" "+languages[i].nativeName);
    } 
    return arrayLang;
  }

  formatValueSelect(option:string){
    switch (option) {
      case "Região":
        return "region";
      case "Capital":
        return "capital";
      case "Língua":
        return "languages";
      case "País":
        return "name";
      case "Código de Ligação":
        return "callingCodes";
      default:
        return "";
    }
  }

  formatSearchUrl(option:string){
    switch (option) {
      case "region":
        return `${urlBase}/region`;
      case "capital":
        return `${urlBase}/capital`;
      case "languages":
        return `${urlBase}/lang`;
      case "name":
        return `${urlBase}/name`;
      case "callingCodes":
        return `${urlBase}/callingcode`;
      default:
        return "";
    }
  }  

  resetVariables(){
    this.select = [];
    this.selectResponse = [];
    this.urlFilter = '';
  }
}
