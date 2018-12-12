const btnYear = document.querySelector(".btn-year");
const selectFirstYear = document.querySelector("#select-first-year");
const selectSecondYear = document.querySelector("#select-second-year");
const thFirstYear = document.querySelector(".th-first-year");
const thSecondYear = document.querySelector(".th-second-year");
const map = document.querySelector(".map");
const tableBody = document.querySelector(".table-body");
const countriesElements = document.querySelectorAll(".country");
const populationYear = document.querySelector(".population-year");
const categories = document.querySelectorAll(".table-population th");
const icons = document.querySelectorAll(".table-population i");

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

// --------------------- fill table

function fillTable(countries){
	tableBody.innerHTML = "";
	tableContent = "";
	thFirstYear.innerHTML = firstYear;
	thSecondYear.innerHTML = secondYear;

	for(cnt of countries){
		// color last column to emphasize that this is a comparison of values
		// "NO DATA" = black, plus = green, minus = red
		let textColor = "black-nr";
		const country = cnt[0];
		const population1 = numberWithSpaces(cnt[1]);
		const population2 = numberWithSpaces(cnt[2]);
		let difference = numberWithSpaces(cnt[3]);
		if (difference !== "NO DATA"){
			if(difference[0] !== "-"){
				difference = "+" + difference;
				textColor = "green-nr";
			} else {
				textColor = "red-nr";
			}
		}
		const tableRow =
		`<tr>
			<td>${country}</td>
			<td class="text-right">${population1}</td>
			<td class="text-right">${population2}</td>
			<td class="text-right ${textColor}">${difference}</td>
		</tr>
		`;
		tableContent += tableRow;
	}
	tableBody.innerHTML = tableContent;
}



// ------------------ set table

function setTableData(){
	countriesTable = [];
	for (var i = 0; i < countriesData.date[secondYear].length; i++) {
		const country = countriesData.date[firstYear][i]["country"]["value"];
		let year1 = (countriesData.date[firstYear][i].value) ? (countriesData.date[firstYear][i].value) : "NO DATA";
		let year2 = (countriesData.date[secondYear][i].value) ? (countriesData.date[secondYear][i].value) : "NO DATA";
		// przygotowanie tablicy, ktora posluzy do biezacego sortowania danych w tabeli
		const difference = (year1 === "NO DATA" || year2 === "NO DATA") ? "NO DATA" : (year2 - year1);
		countriesTable.push([country, year1, year2, difference]);

		fillTable(countriesTable);
	}
}

// ---------------------------- fill tooltip

//

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

// ---------------------------- btnYear click

btnYear.addEventListener("click", function(){
	populationYear.innerHTML = selectSecondYear.value;
	if(selectFirstYear.value === selectSecondYear.value){
		alert("Select two different years!");
	}else{
		// reset icon in table
		for (var i = 0; i < icons.length; i++) {
			icons[i].classList.remove("visible");
			icons[i].classList.remove("descending");
		}
		icons[0].classList.add("visible");
		// chronologiczne uporządkowanie danych
		if(parseInt(selectFirstYear.value, 10) < parseInt(selectSecondYear.value, 10)){
			firstYear = parseInt(selectFirstYear.value, 10);
			secondYear = parseInt(selectSecondYear.value, 10);
		}else{
			firstYear = parseInt(selectSecondYear.value, 10);
			secondYear = parseInt(selectFirstYear.value, 10);
		}
		btnYear.disabled = "disabled";
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
			setTableData();
			colorMap();
			fillTooltip();
			btnYear.removeAttribute("disabled");
		}).catch(err => console.log(err))

}

getAllData();

function sortTableData(categoryNr, isDescending){
	const sortDir = isDescending ? "descending" : "ascending";
	// countriesTable domyslnie jest posortowana rosnaco wg krajow (kategoria 0)
	const newTab = countriesTable.slice();
	if(categoryNr === 0){
		if(isDescending) newTab.reverse();
	} else {
		newTab.sort(function(a, b){
			if (!isDescending){
				return a[categoryNr] - b[categoryNr];
			} else {
				return b[categoryNr] - a[categoryNr];
			}
		})
	}

	fillTable(newTab);
};

// --------------------- sort table EVENTS

for (let i = 0; i < categories.length; i++) {
	categories[i].addEventListener("click", function(e){
		let isDescending = false;
		let categoryNr;
		const icon = this.children[1];
		console.dir(icon);
		for (var i = 0; i < icons.length; i++) {
			if (icon !== icons[i]){
				icons[i].classList.remove("visible");
				icons[i].classList.remove("descending");
			} else {
				categoryNr = i;
			}
		}
		if (icon.classList.contains("visible")){

			isDescending = icon.classList.toggle("descending");
			sortTableData(categoryNr, isDescending);
		} else {
			icon.classList.add("visible");
			// domyslnie strzalka w gore
			icon.classList.remove("descending");
			sortTableData(categoryNr, isDescending);
		}
			// DODAĆ: funkcja odwracająca bieżące sortowanie

			for (var i = 0; i < categories.length; i++) {
				if(categories[i].children[1] !== icon){
					categories[i].children[1].classList.remove("visible");
				}
			}

	})
}

// for(cat of categories){
// 	cat.addEventListener("click", function(){
//
// 		const icon = this.children[1];
// 		if(icon.classList.contains("visible")){
// 			// icon.classList.add("descending");
// 		}else{
// 			for(i=0; i<categories.length; i++){
// 				el.children[1].classList.remove("visible");
// 			}
// 			icon.classList.add("visible");
// 		}
// 	})
// }
