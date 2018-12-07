const btnYear = document.querySelector(".btn-year");
const selectFirstYear = document.querySelector("#select-first-year");
const selectSecondYear = document.querySelector("#select-second-year");
const thFirstYear = document.querySelector(".th-first-year");
const thSecondYear = document.querySelector(".th-second-year");
const map = document.querySelector(".map");
const tableBody = document.querySelector(".table-body");
const countriesElements = document.querySelectorAll(".country");
const populationYear = document.querySelector(".population-year");
const countriesList = ["al", "at", "by", "be", "ba", "bg", "hr", "cz", "dk", "ee", "mk", "fi", "fr", "de", "gr", "hu", "is", "ie", "it", "lv", "lt", "mt", "md", "me", "no", "pl", "pt", "ro", "ru", "rs", "sk", "si", "es", "se", "ch", "nl", "tr", "ua", "gb"];
countriesList.sort();
let countriesTable;
let countriesData = {
	date : {}
}
let firstYear = 2016;
let secondYear = 2017;

const tooltip = document.createElement("div");
tooltip.classList.add("map-tooltip");
document.body.appendChild(tooltip);

function numberWithSpaces(nr) { // 5000000 -> 5 000 000 (non-breaking space)
    return nr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "&nbsp");
}

function sortPopulation(tab){
	const newTab = tab.sort(function(a, b) {
    return b.total_population.population - a.total_population.population;
	});
	return tab;
}

function addYearsToForm(){
	let template =
	`<option value="2017">2017</option>
	`;
	for (var i = 2016; i > 1959; i--) {
		template +=
		`<option value="${i}">${i}</option>
		`;
	}
	selectFirstYear.innerHTML = template;
	selectSecondYear.innerHTML = template;
	selectFirstYear.children[1].selected = "selected";
}
addYearsToForm()

function colorMap(){
	for(const c of countriesData.date[secondYear]){
		current = document.querySelector(`[data-country="${c.country.value}"]`);
		var population = (c.value === "undefined" || c.value === null) ? "no data available" : c.value;
		current.dataset.population = population;
		current.dataset.year = c.date;
		current.classList.remove("fill-color1");
		current.classList.remove("fill-color2");
		current.classList.remove("fill-color3");
		current.classList.remove("fill-color4");
		current.classList.remove("fill-color5");
		if(population > 60000000){
			current.classList.add("fill-color5");
		}else if(population>30000000){
			current.classList.add("fill-color4");
		}else if(population>10000000){
			current.classList.add("fill-color3");
		}else if(population>5000000){
			current.classList.add("fill-color2");
		}else if(population>0){
			current.classList.add("fill-color1");
		}
	}
}

function fillTable(data){

	countriesTable = [];
	tableBody.innerHTML = "";
	tableContent = "";
	thFirstYear.innerHTML = firstYear;
	thSecondYear.innerHTML = secondYear;

	for (var i = 0; i < countriesData.date[secondYear].length; i++) {
		const country = countriesData.date[firstYear][i]["country"]["value"];
		const year1 = countriesData.date[firstYear][i];
		const year2 = countriesData.date[secondYear][i];
		// przygotowanie tablicy, ktora posluzy do biezacego sortowania danych w tabeli
		countriesTable.push([country, year1.value, year2.value, year2.value - year1.value])
		population1 = (!year1.value) ? "NO DATA" : numberWithSpaces(year1.value);
		population2 = (!year2.value) ? "NO DATA" : numberWithSpaces(year2.value);
		let comparison;
		let textColor = "black-nr";
		if((population1 !== "NO DATA") && (population2 !== "NO DATA")){
			comparison = numberWithSpaces(year2.value - year1.value);
			if(comparison[0] !== "-"){
				comparison = "+" + comparison;
				textColor = "green-nr";
			} else {
				textColor = "red-nr";
			}
		}else{
			comparison = "NO DATA";
		}
		const tableRow =
		`<tr>
			<td>${country}</td>
			<td class="text-right">${population1}</td>
			<td class="text-right">${population2}</td>
			<td class="text-right ${textColor}">${comparison}</td>
		</tr>
		`;
		tableContent += tableRow;
	}
	tableBody.innerHTML = tableContent;
}

function fillTooltip(){
	for(el of countriesElements){
		let orgFill = el.style.fill;
		el.addEventListener("mousemove", function(e){
			// this.style.fill = "#676767";
			const population = numberWithSpaces(this.dataset.population);
			tooltip.innerHTML =
			`
			<h3>${this.dataset.country}</h3>
			<div>Population (${secondYear}):
				${population}
			</div>
			`;

			const winWidth = window.outerWidth;
			const tooltipStyle = window.getComputedStyle(tooltip);
			const tooltipWidth = parseInt(tooltipStyle.getPropertyValue("width"));
			if((e.pageX + 300) > winWidth){
				tooltip.style.left = e.pageX - tooltipWidth - 15 + "px";
			}else{
				tooltip.style.left = e.pageX + 15 + "px";
			}
			tooltip.style.top = e.pageY + 15 + "px";
			tooltip.style.display = "";
		})

		el.addEventListener("mouseout", function(){
			this.style.fill = orgFill;
			tooltip.innerHTML = "";
			tooltip.style.display = "none";
		})
	}
}

btnYear.addEventListener("click", function(){
	if(selectFirstYear.value === selectSecondYear.value){
		alert
	}
	btnYear.disabled = "disabled";
	// chronologiczne uporządkowanie danych
	if(parseInt(selectFirstYear.value, 10) < parseInt(selectFirstYear.value, 10)){
		firstYear = parseInt(selectFirstYear.value, 10);
		secondYear = parseInt(selectSecondYear.value, 10);
	}else{
		firstYear = parseInt(selectSecondYear.value, 10);
		secondYear = parseInt(selectFirstYear.value, 10);
	}

	getAllData();
})

// ------------ fetch url

function getData(resolve, reject, year){

	// dane dotyczące konkretnego roku zaciągane są tylko raz
	if (!countriesData.date.hasOwnProperty(year)){
		const countries = countriesList.join(";");
		const url = "https://api.worldbank.org/v2/countries/"+countries+"/indicators/SP.POP.TOTL?date="+year+"&format=json";
		fetch(url)
			.then(resp => resp.json())
			.then(resp => {
				countriesData.date[year] = resp[1];
				resolve(resp);

			})
			.catch(function(err){
				console.log(err);
				reject(err);
			})
	} else {
		console.log("jest");
		resolve(countriesData.date[year]);
	}
}

// ------------- set both promises, then run promise all

function getAllData(){

	promise1 = new Promise(function(resolve, reject){
		getData(resolve, reject, firstYear);
	});
	promise2 = new Promise(function(resolve, reject){
		getData(resolve, reject, secondYear);
	});
	Promise.all([promise1, promise2])
		.then(resp => {
			dataReady = true;
			fillTable(secondYear);
			colorMap();
			fillTooltip();
			btnYear.removeAttribute("disabled");
		}).catch(err => console.log(err))

}

getAllData();
