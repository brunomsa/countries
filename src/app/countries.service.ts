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

  select: Object[] = [];
  languages: Languages[] = []
  currentlang: Languages = {
    code: '',
    name: ''
  }
  currentBorders: any[] = []
  currentCountry: Countries = {
    name: "Brazil",
    capital: "Brasília",
    region: "Americas",
    subregion: "South America",
    population: 206135893,
    flag: "https://restcountries.eu/data/bra.svg",
    languages: ["Português"],
    borders: ["ARG", "BOL", "COL", "GUF", "GUY", "PRY", "PER", "SUR", "URY", "VEN"]
  }

  getOptions(value:string){
    var option
    return this.http.get<any[]>(`${urlBase}/all?fields=${value}`).subscribe(res => {
      for(let i = 0; i < res.length; i++){
        console.log(res[i])
        if(String(Object.values(res[i])).length > 0){
          if(value == "languages"){
            //Get nativeName of languages array
            for(let lang of res[i].languages){
              this.select.push(lang.nativeName)
              this.currentlang = {
                code:lang.iso639_1,
                name:lang.nativeName}
              this.languages.push(this.currentlang)
            }
          //Order Array of String
          this.select.sort()
          }
          else if(value == "callingCodes"){
            option = Number(Object.values(res[i]))
            this.select.push(option);
            //Order Array of String
            this.select.sort((a,b) => a < b ? -1 : a > b ? 1 : 0);
          }
          else{
            option = String(Object.values(res[i]))
            this.select.push(option);
            //Order Array of String
            this.select.sort()
          }
        }
      }
      //Remove Duplicates
      this.select = [...new Set(this.select)]
      this.languages = this.languages.filter((lang, index, self) => index === self.findIndex((l) => (l.code === lang.code && l.name === lang.name)))
      //console.log(this.select)
    })
  }
  
  getCountryByFilter(urlFilter:string, value:string){
    return this.http.get<Object[]>(`${urlFilter}/${value}`)
  }

  getCountryByCode(name: string){
    return this.http.get<Object[]>(`${urlBase}/alpha/${name}`)
  }

  getCurrentBorders(){
    var country_border =  this.currentCountry.borders
    this.currentBorders = []
    for(let i = 0; i < country_border.length; i++){
      this.getCountryByCode(country_border[i].toLowerCase()).subscribe(res => {
        this.currentBorders.push(res)
      })
    }
    console.log(this.currentBorders)
  }

  onClickCountry(country: Countries){
    this.currentCountry = {
      name: country.name,
      capital: country.capital,
      region: country.region,
      subregion: country.subregion,
      population: country.population,
      flag: country.flag,
      languages: this.formatLanguagesCountry(country.languages),
      borders: country.borders,
    }
    this.getCurrentBorders();
    this.router.navigate(['/about'])
  }

  formatLanguagesCountry(languages:any[]):string[]{
    var arrayLang = []
    for(let i = 0; i < languages.length; i++){
      arrayLang.push(" "+languages[i].nativeName)
    } 
    return arrayLang
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
}
