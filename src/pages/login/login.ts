import { Component, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { User } from '../../providers';
import { MainPage } from '../';
import * as d3 from 'd3';

@IonicPage()
@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})
export class LoginPage {
	@ViewChild('chart')
	private chartC: ElementRef;
	// The account fields for the login form.
	// If you're using the username field with or without email, make
	// sure to add it to the type
	account: { email: string, password: string } = {
		email: 'test@example.com',
		password: 'test'
	};

	// Our translated text strings
	private loginErrorString: string;

	constructor(public navCtrl: NavController,
		public user: User,
		public toastCtrl: ToastController,
		public translateService: TranslateService) {

		this.translateService.get('LOGIN_ERROR').subscribe((value) => {
			this.loginErrorString = value;
		})

	}
	ionViewDidLoad() {
		this.loadWheel();
	}

	// Attempt to login in through our User service
	doLogin() {
		this.user.login(this.account).subscribe((resp) => {
			this.navCtrl.push(MainPage);
		}, (err) => {
			this.navCtrl.push(MainPage);
			// Unable to log in
			let toast = this.toastCtrl.create({
				message: this.loginErrorString,
				duration: 3000,
				position: 'top'
			});
			toast.present();
		});
	}
	loadWheel() {
    console.log("f");
    let nums = 0;
		let padding = { top: 20, right: 40, bottom: 0, left: 0 },
			w = 350 - padding.left - padding.right,
			h = 350 - padding.top - padding.bottom,
			r = Math.min(w, h) / 2,
			rotation = 0,
			oldrotation = 0,
			picked = 100000,
			oldpick = [],
			color = d3.scale.category20();//category20c()
		//randomNumbers = getRandomNumbers();
		//http://osric.com/bingo-card-generator/?title=HTML+and+CSS+BINGO!&words=padding%2Cfont-family%2Ccolor%2Cfont-weight%2Cfont-size%2Cbackground-color%2Cnesting%2Cbottom%2Csans-serif%2Cperiod%2Cpound+sign%2C%EF%B9%A4body%EF%B9%A5%2C%EF%B9%A4ul%EF%B9%A5%2C%EF%B9%A4h1%EF%B9%A5%2Cmargin%2C%3C++%3E%2C{+}%2C%EF%B9%A4p%EF%B9%A5%2C%EF%B9%A4!DOCTYPE+html%EF%B9%A5%2C%EF%B9%A4head%EF%B9%A5%2Ccolon%2C%EF%B9%A4style%EF%B9%A5%2C.html%2CHTML%2CCSS%2CJavaScript%2Cborder&freespace=true&freespaceValue=Web+Design+Master&freespaceRandom=false&width=5&height=5&number=35#results
		let data = [
			{ "label": "Dell LAPTOP", "value": 1, "question": 10 }, // padding
			{ "label": "IMAC PRO", "value": 1, "question": 20 }, //font-family
			{ "label": "SUZUKI", "value": 1, "question": 100 }, //color
			{ "label": "HONDA", "value": 1, "question": 340 }, //font-weight
			{ "label": "FERRARI", "value": 1, "question": 24 }, //font-size
			{ "label": "APARTMENT", "value": 1, "question": 55 }, //background-color
			{ "label": "IPAD PRO", "value": 1, "question": 87 }, //nesting
			{ "label": "LAND", "value": 1, "question": 66 }, //bottom
			{ "label": "MOTOROLLA", "value": 1, "question": 98 }, //sans-serif
			{ "label": "BMW", "value": 1, "question": 78 } //period
		];
		let c = this.chartC.nativeElement;
		let svg = d3.select(c)
			.append("svg")
			.data([data])
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
				return data[i].label;
			});
		container.on("click", spin);
		function spin(d) {

			container.on("click", null);
			//all slices have been seen, all done
			console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
			if (oldpick.length == data.length) {
				console.log("done");
				container.on("click", null);
				return;
			}
			let ps = 360 / data.length,
				pieslice = Math.round(1440 / data.length),
				rng = Math.floor((Math.random() * 1440) + 360);

			rotation = (Math.round(rng / ps) * ps);

			picked = Math.round(data.length - (rotation % 360) / ps);
			picked = picked >= data.length ? (picked % data.length) : picked;
			if (oldpick.indexOf(picked) !== -1) {
				d3.select(this).call(spin);
				return;
			} else {
				oldpick.push(picked);
			}
      rotation += 90 - Math.round(ps / 2);

       nums = nums + data[picked].question;
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
			.attr("r", 60)
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
			let array = new Uint16Array(1000);
			let scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);
			if (window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function") {
				window.crypto.getRandomValues(array);
				console.log("works");
			} else {
				//no support for crypto, get crappy random numbers
				for (let i = 0; i < 1000; i++) {
					array[i] = Math.floor(Math.random() * 100000) + 1;
				}
			}
			return array;
		}
	}
}
