const svg = document.querySelector("#desk-svg");
const desk = document.querySelector(".desk-wrapper");
const time = document.querySelector(".time");
function centerClipSVG(){
	const svgStyle = window.getComputedStyle(svg);
	const svgWidth = parseInt(svgStyle.getPropertyValue("width"));
	const margin = parseInt((window.innerWidth - svgWidth)/2);
	console.log(margin);
	if(margin<0){
		desk.style.marginLeft = margin + "px";
	}else{
		desk.style.marginLeft = "-10px";
	}
	console.log(parseInt(svgWidth));
	console.log(window.innerWidth);

}

centerClipSVG()
window.addEventListener("resize", centerClipSVG);

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    h = checkTime(h)
    m = checkTime(m);
    document.querySelector(".time").innerHTML =
    h + ":" + m;
    var t = setTimeout(startTime, 1000);
}
function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}
document.addEventListener("load", startTime());
