const btnYear = document.querySelector(".btn-year");
const selectYear = document.querySelector("#select-year");
const map = document.querySelector(".map");
const tableBody = document.querySelector(".table-body");
const countriesElements = document.querySelectorAll(".country");
const countriesList = [...countriesElements].map(el => el.dataset.country);
countriesList.sort();
let countriesData = [];
const promises = [];
let dataReady = false;
let year = 2018;

// ============================================ functions

function numberWithSpaces(nr) { // 5000000 -> 5 000 000 (non-breaking space)
    return nr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "&nbsp");
}

function sortPopulation(tab){
	const newTab = tab.sort(function(a, b) {
    return b.total_population.population - a.total_population.population;
	});
	return newTab;
}

function assignData(data){
	for(const c of data){
		current = document.querySelector(`[data-country="${c.country}"]`);
		current.dataset.population = c.total_population.population;
		let population = current.dataset.population;

		//kolorowanie mapy w zależności od liczby mieszkańców
		if(population > 60000000){
			current.style.fill = "hsla(108, 50%, 42%, 1)";
		}else if(population>30000000){
			current.style.fill = "hsla(108, 56%, 50%, 1)";
		}else if(population>10000000){
			current.style.fill = "hsla(100, 65%, 55%, 1)";
		}else if(population>5000000){
			current.style.fill = "hsla(80, 80%, 60%, 1)";
		}else if(population>0){
			current.style.fill = "hsla(55, 80%, 55%, 1)"
		}
	}
}

function getData(year){
	countriesData = [];
	for (let i = 0; i < countriesList.length; i++) {
		promises[i] = new Promise(function(resolve, reject) {
			let country = countriesList[i];
			let obj = {
				country : country
			}
			let url = "http://api.population.io:80/1.0/population/"+encodeURI(country)+"/"+year+"-01-01/";
					fetch(url, {mode: "no-cors"})
						.then(resp => resp.json())
						.then(resp => {
							if(!resp.total_population){
								obj.total_population = {
									date: "ERROR",
									population: "ERROR"
								}
							}else{
								obj.total_population = resp.total_population;
							}
							countriesData.push(obj);
							resolve(resp);
						})
						.catch(function(err){
							obj.total_population = {
								date: "ERROR",
								population: "ERROR"
							}
							countriesData.push(obj)
							reject("ERROR")
							console.log(err);
						})
		    });
	}

	Promise.all(promises)
		.then(resp => {
			dataReady = true;
			assignData(countriesData);
			const countriesSorted = sortPopulation(countriesData);
			fillTable(countriesSorted);
			addTooltip();
		}).catch(err => console.log(err));
		btnYear.removeAttribute("disabled")
}

// --------------- wypełnianie tabelki danymi

function fillTable(data){
	tableBody.innerHTML = "";
	tableContent = "";
	for(c of data){
		const population = numberWithSpaces(c.total_population.population);
		const tableRow =
		`<tr>
			<td>${c.country}</th>
			<td class="text-right">${population}</td>
		</tr>
		`;
		tableContent += tableRow;
	}
	tableBody.innerHTML = tableContent;
}



// tooltip hover
function addTooltip(){
	// dodanie tooltip do strony
	const tooltip = document.createElement("div");
	tooltip.classList.add("map-tooltip");
	document.body.appendChild(tooltip);

	for(el of countriesElements){
		let orgFill = el.style.fill;
		el.addEventListener("mousemove", function(e){
			this.style.fill = "#676767";
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
	getData(selectYear.value)
})

getData(year);
