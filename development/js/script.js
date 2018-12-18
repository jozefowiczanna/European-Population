const btnGetData = document.querySelector(".btn-get-data");
const selectFirstYear = document.querySelector("#select-first-year");
const selectSecondYear = document.querySelector("#select-second-year");
const thFirstYear = document.querySelector(".th-first-year");
const thSecondYear = document.querySelector(".th-second-year");
const map = document.querySelector(".map-svg-cnt");
const mapScroll = document.querySelector(".map-scroll");
const tableBody = document.querySelector(".table-body");
const countriesElements = document.querySelectorAll(".country");
const categories = document.querySelectorAll(".table th");
const icons = document.querySelectorAll(".table i");
const smallBtnGroup = document.querySelector(".btn-small-years");
const legendColorGroup = document.querySelector(".legend-color-group");
const zoomIcons = document.querySelector(".zoom");
const zoomPlus = zoomIcons.children[0];
const zoomMinus = zoomIcons.children[1];

const style = window.getComputedStyle(mapScroll);
const width = style.getPropertyValue("width");
console.log(width);

const countriesList = ["al", "at", "by", "be", "ba", "bg", "hr", "cz", "dk", "ee", "mk", "fi", "fr", "de", "gr", "hu", "is", "ie", "it", "lv", "lt", "mt", "md", "me", "no", "pl", "pt", "ro", "ru", "rs", "sk", "si", "es", "se", "ch", "nl", "tr", "ua", "gb"];
countriesList.sort();
let countriesTable;
let countriesData = {
	date : {}
}
let firstYear = 2016;
let secondYear = 2017;

const tooltip = document.querySelector(".map-tooltip");
const tooltipContent = tooltip.querySelector(".tooltip-content");
const closeIcon = tooltip.querySelector(".close-icon");
const darkBg = document.querySelector(".dark-bg")

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

function applyDataset(){
	for (const el of countriesTable){
		const current = document.querySelector(`[data-country="${el[0]}"]`);
		current.dataset.country = el[0];
		current.dataset.population1 = el[1];
		current.dataset.population2 = el[2];
		current.dataset.difference = el[3];
	}
}





function colorMap(year){
	for (const el of countriesTable){
		const current = document.querySelector(`[data-country="${el[0]}"]`);
		if (year === firstYear){
			var population = current.dataset.population1;
		} else {
			var population = current.dataset.population2;
		}
		current.classList.remove("fill-color1");
		current.classList.remove("fill-color2");
		current.classList.remove("fill-color3");
		current.classList.remove("fill-color4");
		current.classList.remove("fill-color5");
		current.classList.remove("fill-color-red1");
		current.classList.remove("fill-color-red2");
		current.classList.remove("fill-color-red3");
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

function colorMapDifference(){ // differnce - shades of green and red
	for (const el of countriesTable){
		const current = document.querySelector(`[data-country="${el[0]}"]`);
		diff = parseInt(current.dataset.difference);
		current.classList.remove("fill-color1");
		current.classList.remove("fill-color2");
		current.classList.remove("fill-color3");
		current.classList.remove("fill-color4");
		current.classList.remove("fill-color5");
		current.classList.remove("fill-color-red1");
		current.classList.remove("fill-color-red2");
		current.classList.remove("fill-color-red3");
		if(diff > 200000){
			current.classList.add("fill-color5");
		}else if (diff >= 100000 && diff <= 200000) {
			current.classList.add("fill-color4");
		}else if (diff >= 0 && diff <= 100000) {
			current.classList.add("fill-color3");
		}else if (diff >= -100000 && diff <= 0) {
			current.classList.add("fill-color-red1");
		}else if (diff >= -200000 && diff <= -100000){
			current.classList.add("fill-color-red2");
		}else if (diff < -200000){
			current.classList.add("fill-color-red3");
		}
	}
}

function showLegend(){
	// apply different legend when compare button is active
	let template;
	if (smallBtnGroup.children[2].classList.contains("btn-on")){
		legendColorGroup.classList.remove("flex");
		template = `
		<div class="legend-col">
			<div class="legend-item">
				<div class="color-box color-red3"></div>
				<div>less than -200,000.</div>
			</div>
			<div class="legend-item">
				<div class="color-box color-red2"></div>
				<div>-200,000 to -100,000</div>
			</div>
			<div class="legend-item">
				<div class="color-box color-red1"></div>
				<div>-100,000 to 0</div>
			</div>
		</div>
		<div class="legend-col">
			<div class="legend-item">
				<div class="color-box color3"></div>
				<div>0 to 100,000</div>
			</div>
			<div class="legend-item">
				<div class="color-box color4"></div>
				<div>100,000 to 200,000</div>
			</div>
			<div class="legend-item">
				<div class="color-box color5"></div>
				<div>over 200,000</div>
			</div>
		</div>
		`;
	} else {
		legendColorGroup.classList.add("flex");
		template = `
		<div class="legend-col">
			<div class="legend-item">
				<div class="color-box color1"></div>
				<div>0-5 mln</div>
			</div>
			<div class="legend-item">
				<div class="color-box color2"></div>
				<div>5-10 mln</div>
			</div>
			<div class="legend-item">
				<div class="color-box color3"></div>
				<div>10-30 mln</div>
			</div>
		</div>
		<div class="legend-col">
			<div class="legend-item">
				<div class="color-box color4"></div>
				<div>30-60 mln</div>
			</div>
			<div class="legend-item">
				<div class="color-box color5"></div>
				<div>over 60 mln</div>
			</div>
		</div>
		`;
	}
	legendColorGroup.innerHTML = template;
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
			const population1 = numberWithSpaces(this.dataset.population1);
			const population2 = numberWithSpaces(this.dataset.population2);
			let difference = numberWithSpaces(this.dataset.difference);
			if (difference !== "NO DATA"){
				if(difference[0] !== "-"){
					difference = "+" + difference;
					textColor = "green-nr";
				} else {
					textColor = "red-nr";
				}
			}
			tooltip.style.display = "";
			tooltipContent.innerHTML =
			`
			<h3>${this.dataset.country}</h3>
			<div>Population (${firstYear}):
				${population1}
			</div>
			<div>Population (${secondYear}):
				${population2}
			</div>
			<div>Difference:
				<span class="${textColor}">${difference}</span>
			</div>
			`;


			const winWidth = window.outerWidth;
			if (winWidth < 600){
				tooltip.classList.add("fixed");
			} else {
				const tooltipStyle = window.getComputedStyle(tooltip);
				const tooltipWidth = parseInt(tooltipStyle.getPropertyValue("width"));
				if((e.pageX + 300) > winWidth){
					tooltip.style.left = e.pageX - tooltipWidth - 15 + "px";
				}else{
					tooltip.style.left = e.pageX + 15 + "px";
				}
				tooltip.style.top = e.pageY + 15 + "px";
				tooltip.style.display = "";
				closeIcon.style.display = "none";
			}
		})

		// el.addEventListener("mouseout", function(){
		// 	this.style.fill = orgFill;
		// 	tooltip.innerHTML = "";
		// 	tooltip.style.display = "none";
		// })
	}
}
console.log(closeIcon);

closeIcon.addEventListener("click", function(){
	console.log("test");
	tooltip.style.display = "none";
})

// ---------------------------- btnGetData click

btnGetData.addEventListener("click", function(){
	if(selectFirstYear.value === selectSecondYear.value){
		alert("Select two different years!");
	}else{
		resetButtons(smallBtnGroup.children[1]);
		showLegend();
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
		// change small buttons values
		smallBtnGroup.children[0].innerHTML = firstYear;
		smallBtnGroup.children[1].innerHTML = secondYear;
		btnGetData.disabled = "disabled";
	}
	getAllData();
})

// ------------ fetch url

function getData(resolve, reject, year){
	if (!countriesData.date.hasOwnProperty(year)){ // don't download the same data twice
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
			applyDataset();
			colorMap(secondYear);
			fillTooltip();
			btnGetData.removeAttribute("disabled");
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

// -------------------------- small buttons event


function resetButtons(target){
	const buttons = smallBtnGroup.querySelectorAll("button");
	for (b of buttons){
		b.classList.add("btn-off");
		b.classList.add("btn-outline-dark");
		b.classList.remove("btn-on");
		b.classList.remove("btn-dark");
	}
	target.classList.remove("btn-off");
	target.classList.remove("btn-outline-dark");
	target.classList.add("btn-on");
	target.classList.add("btn-dark");
	return buttons;
}

smallBtnGroup.addEventListener("click", function(e){
	const year =  parseInt(e.target.innerHTML);
	const target = e.target;
	const buttons = resetButtons(target);
	if(e.target === buttons[2]){
		colorMapDifference();
	} else {
		colorMap(year);
	}
	showLegend();
})

const sizes = ["zoom-val0", "zoom-val1", "zoom-val2", "zoom-val3", "zoom-val4"];

zoomPlus.addEventListener("click", function(e){
	for (let i = 0; i < sizes.length - 1; i++) {
		if(map.classList.contains(sizes[i])){
			console.log(sizes[i], "plus");
			map.classList.remove(sizes[i]);
			map.classList.add(sizes[i+1]);
			break;
		}
	}
})

zoomMinus.addEventListener("click", function(e){
	for (let i = sizes.length - 1; i >= 1; i--) {
		console.log(sizes[i]);
		if(map.classList.contains(sizes[i])){
			console.log(sizes[i], "minus");
			map.classList.remove(sizes[i]);
			map.classList.add(sizes[i-1]);
			break;
		}
	}
})

window.addEventListener("resize", function(){
	console.log("test");
	darkBg.style.display = "none";
	tooltip.innerHTML = "";
	tooltip.style.display = "none";
})
