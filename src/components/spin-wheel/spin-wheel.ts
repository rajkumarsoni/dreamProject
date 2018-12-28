import { Component, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
	selector: 'spin-wheel',
	templateUrl: 'spin-wheel.html'
})
export class SpinWheelComponent {

	@ViewChild('chart')
	private chartContainer: ElementRef;

	constructor() { }

	ngAfterViewInit() {
		this.loadWheel();
	}

	loadWheel() {
		let randomNumbers: any,
		nums:number = 0,
		padding = { top: 20, right: 40, bottom: 0, left: 0 },
			w = 200 - padding.left - padding.right,
			h = 200 - padding.top - padding.bottom,
			r = Math.min(w, h) / 2,
			rotation = 0,
			oldrotation = 0,
			picked = 100000,
			oldpick = [],
			color = d3.scale.category20();//category20c()
		randomNumbers = getRandomNumbers();

		//http://osric.com/bingo-card-generator/?title=HTML+and+CSS+BINGO!&words=padding%2Cfont-family%2Ccolor%2Cfont-weight%2Cfont-size%2Cbackground-color%2Cnesting%2Cbottom%2Csans-serif%2Cperiod%2Cpound+sign%2C%EF%B9%A4body%EF%B9%A5%2C%EF%B9%A4ul%EF%B9%A5%2C%EF%B9%A4h1%EF%B9%A5%2Cmargin%2C%3C++%3E%2C{+}%2C%EF%B9%A4p%EF%B9%A5%2C%EF%B9%A4!DOCTYPE+html%EF%B9%A5%2C%EF%B9%A4head%EF%B9%A5%2Ccolon%2C%EF%B9%A4style%EF%B9%A5%2C.html%2CHTML%2CCSS%2CJavaScript%2Cborder&freespace=true&freespaceValue=Web+Design+Master&freespaceRandom=false&width=5&height=5&number=35#results
		// let data = [
		// 	{ "label": "10", "value": 1, "question": 10 }, // padding
		// 	{ "label": "20", "value": 1, "question": 20 }, //font-family
		// 	{ "label": "30", "value": 1, "question": 100 }, //color
		// 	{ "label": "40", "value": 1, "question": 340 }, //font-weight
		// 	{ "label": "FERRARI", "value": 1, "question": 24 }, //font-size
		// 	{ "label": "APARTMENT", "value": 1, "question": 55 }, //background-color
		// 	{ "label": "IPAD PRO", "value": 1, "question": 87 }, //nesting
		// 	{ "label": "LAND", "value": 1, "question": 66 }, //bottom
		// 	{ "label": "MOTOROLLA", "value": 1, "question": 98 }, //sans-serif
		// 	{ "label": "BMW", "value": 1, "question": 78 } //period
		// ];
		let chart = this.chartContainer.nativeElement;
		let svg = d3.select(chart)
			.append("svg")
			.data([randomNumbers])
			.attr("width", w + padding.left + padding.right)
			.attr("height", h + padding.top + padding.bottom);
		let container = svg.append("g")
			.attr("class", "chartholder")
			.attr("transform", "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")");
		let vis = container
			.append("g");

		let pie = d3.layout.pie().sort(null).value(function (d) { return 1; });
		// declare an arc generator function
		let arc = d3.svg.arc().outerRadius(r);
		// select paths, use arc generator to draw
		let arcs = vis.selectAll("g.slice")
			.data(pie)
			.enter()
			.append("g")
			.attr("class", "slice");

		arcs.append("path")
			.attr("fill", function (d, i) { return color(i); })
			.attr("d", function (d) { return arc(d); });
		// add the text
		arcs.append("text").attr("transform", function (d) {
			d.innerRadius = 0;
			d.outerRadius = r;
			d.angle = (d.startAngle + d.endAngle) / 2;
			return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius - 10) + ")";
		})
			.attr("text-anchor", "end")
			.text(function (d, i) {
				return randomNumbers[i];
			});
		container.on("click", spin);
		function spin(d) {

			container.on("click", null);
			//all slices have been seen, all done

			if (oldpick.length == randomNumbers.length) {
				container.on("click", null);
				return;
			}
			let ps = 360 / randomNumbers.length,
				pieslice = Math.round(1440 / randomNumbers.length),
				rng = Math.floor((Math.random() * 1440) + 360);

			rotation = (Math.round(rng / ps) * ps);

			picked = Math.round(randomNumbers.length - (rotation % 360) / ps);
			picked = picked >= randomNumbers.length ? (picked % randomNumbers.length) : picked;
			if (oldpick.indexOf(picked) !== -1) {
				d3.select(this).call(spin);
				return;
			} else {
				oldpick.push(picked);
			}
			rotation += 90 - Math.round(ps / 2);

			nums = nums + randomNumbers[picked];
			vis.transition()
				.duration(3000)
				.attrTween("transform", rotTween)
				.each("end", function () {
					//mark question as seen
					d3.select(".slice:nth-child(" + (picked + 1) + ") path");
					//.//attr("fill", "#111");
					//populate question
					d3.select("#question h6")
						//.text(data[picked].question);
						.text(nums);
					oldrotation = rotation;

					container.on("click", spin);
				});
		}
		//make arrow
		svg.append("g")
			.attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h / 2) + padding.top) + ")")
			.append("path")
			.attr("d", "M-" + (r * .15) + ",0L0," + (r * .05) + "L0,-" + (r * .05) + "Z")
			.style({ "fill": "black" });
		//draw spin circle
		container.append("circle")
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", 20)
			.style({ "fill": "white", "cursor": "pointer" });
		//spin text
		container.append("text")
			.attr("x", 0)
			.attr("y", 2)
			.attr("text-anchor", "middle")
			.text("SPIN")
			.style({ "font-weight": "bold", "font-size": "10px" });


		function rotTween(to) {
			let i = d3.interpolate(oldrotation % 360, rotation);
			return function (t) {
				return "rotate(" + i(t) + ")";
			};
		}


		function getRandomNumbers() {
			let array = new Uint8Array(10);
			let scale = d3.scale.linear().range([0, 100]).domain([0, 100]);
			if (window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function") {
				window.crypto.getRandomValues(array);
			} else {
				//no support for crypto, get crappy random numbers
				for (let i = 0; i < 10; i++) {
					array[i] = Math.floor(Math.random() * 100) + 1;
				}
			}
			return array;
		}
	}

}
