const btnYear = document.querySelector(".btn-year");
const selectYear = document.querySelector("#select-year");
const map = document.querySelector(".map");
const tableBody = document.querySelector(".table-body");
const countriesElements = document.querySelectorAll(".country");
const countriesList = ["al", "at", "by", "be", "ba", "bg", "hr", "cz", "dk", "ee", "mk", "fi", "fr", "de", "gr", "hu", "is", "ie", "it", "lv", "lt", "mt", "md", "me", "no", "pl", "pt", "ro", "ru", "rs", "sk", "si", "es", "se", "ch", "nl", "tr", "ua", "gb"];
countriesList.sort();
let countriesData = [];
let year = 2017;
const colors = { // names matching sass variables
	"green-dark": "#4ba136",
	"green-medium": "#55C738",
	"green-light": "#70E236",
	"green-bright": "#B4EB47",
	"yellow": "#E8D930"
}

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
	selectYear.innerHTML = template;
}
addYearsToForm()

function assignData(){
	for(const c of countriesData){
		current = document.querySelector(`[data-country="${c.country.value}"]`);
		var population = (c.value === "undefined" || c.value === null) ? "no data available" : c.value;
		current.dataset.population = population;
		current.dataset.year = c.date;
		if(population > 60000000){
			current.style.fill = colors["green-dark"];
		}else if(population>30000000){
			current.style.fill = colors["green-medium"];
		}else if(population>10000000){
			current.style.fill = colors["green-light"];
		}else if(population>5000000){
			current.style.fill = colors["green-bright"];
		}else if(population>0){
			current.style.fill = colors["yellow"];
		}
	}
}

function getData(year){
	countriesData = [];
	const countries = countriesList.join(";");
	const url = "https://api.worldbank.org/v2/countries/"+countries+"/indicators/SP.POP.TOTL?date="+year+"&format=json";

	fetch(url)
		.then(resp => resp.json())
		.then(resp => {
			countriesData = resp[1];
			fillTable(year);
			assignData();
			fillTooltip();
			btnYear.removeAttribute("disabled");
		})
		.catch(function(err){
			console.log(err);
		})
}

function fillTable(data){
	tableBody.innerHTML = "";
	tableContent = "";
	for(c of countriesData){
		if(!c.value){
			var population = "NO DATA";
		} else {
			var population = numberWithSpaces(c.value);
		}
		const tableRow =
		`<tr>
			<td>${c.country.value}</th>
			<td class="text-right">${population}</td>
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
			<div>Population (${year}):
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
	btnYear.disabled = "disabled";
	year = selectYear.value;
	getData(year);
})

getData(year);
