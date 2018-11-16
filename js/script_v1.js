// input - walidacja format XXXX,
// info: dane z 01.01.XXXX

/*
input:
walidacja format XXXX,
min wartośc (od jakiego roku dane)
max wartosc (getYear)
(dodatkowo: najbardziej aktualne dane sa z dnia wczorajszego, dlatego jesli akurat jest 01.01.XXXX, to trzeba zmienic date na 21.12.ROKPOPRZEDNI)
info: dane z 01.01.XXXX
*/

const btnYear = document.querySelector(".btn-year");
const selectYear = document.querySelector("#select-year");
const countriesElements = document.querySelectorAll(".country");
const countriesList = [...countriesElements].map(el => el.dataset.country);
countriesList.sort()
console.log(countriesList);
let countriesData = [];
let promises = []



let c = ["Germany", "Poland"];

for (var i = 0; i < countriesList.length; i++) {
	promises[i] = new Promise(function(resolve, reject) {
		let country = countriesList[i];
		let obj = {
			country : country
		}
		let url = "http://api.population.io:80/1.0/population/"+encodeURI(country)+"/2018-01-01/";
				fetch(url)
					.then(resp => resp.json())
					.then(resp => {
						obj.total_population = resp.total_population;
						countriesData.push(obj)
						resolve(resp)
					})
					.catch(function(err){
						obj.total_population = "BRAK DANYCH";
						countriesData.push(obj)
						reject("BŁĄD")
					})
	    });
}

function showPopulation(list){
	for(c of list){
		console.log(`${c.country}, liczba ludności: ${c.total_population.population}`);
	}
}

Promise.all(promises)
	.then(resp => {
		console.log(countriesData);
		console.log(countriesData.find(function(el){
			return (el.country == "Finland")
		}));
		showPopulation(countriesData);
	}).catch(err => console.log(err))
