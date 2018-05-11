import select_menu from '../../../js-modules/select-menu.js';
import format from '../../../js-modules/formats.js';

import data from './data.js';

export default function interactive(){

	var water_shares = [];
	var water_totals = [];

	for(var o in data.summary){
		if(data.summary.hasOwnProperty(o)){
			water_shares.push(data.summary[o].empw/data.summary[o].empt);
			water_totals.push(data.summary[o].empw);
		}
	}

	console.log(water_shares)
	console.log(water_totals)

	var share_ranker = format.ranker(water_shares);
	var total_ranker = format.ranker(water_totals);

	//one-time setup
	var wrap = d3.select("#water-workforce-interactive")
		.classed("c-fix","true")
		.style("padding","2rem")
		.style("max-width","1500px")
		.style("margin","0px auto");

	var selwrap = wrap.append("div").style("float","right");

	var current_metro = "10420";

	select_menu(selwrap.node()).metros().prompt("Select a metro area").callback(function(d){
		//d: {value: code, text: name}
		current_metro = d.value;
		draw();
	});

	wrap.append("p").text("The water workforce in")
					.style("padding","2rem 0px 0px 0px")
					.style("margin","0rem")
					.style("clear","both");

	var title = wrap.append("p").style("font-size","2rem")
								.style("line-height","1.4em")
								.style("font-weight","bold")
								.style("margin","0rem")
								.style("padding","0px 0px 7px 0px")
								.style("border-bottom","1px solid #aaaaaa")
								;

	/*var panels = wrap.append("div").classed("c-fix panel-wrap", true);

	var emp = panels.append("div").append("div").classed("as-table",true);

	var emp_row1 = emp.append("div");
	emp_row1.append("div").append("p").classed("all-caps-prompt",true)
		.text("Jobs in water sector, 2016")
		;
	emp_row1.append("div").append("p").classed("all-caps-prompt",true)
		.text("Water sector share of all jobs, 2016")
		;

	var emp_row2 = emp.append("div");
	emp_row2.append("div").append("p").style("font-size","1.5rem").style("font-weight","bold")
		.text("xx,xxx")
		;
	emp_row2.append("div").append("p").style("font-size","1.5rem").style("font-weight","bold")
		.text("x%")
		;
	*/

	var panels = wrap.append("div").classed("c-fix panel-wrap", true);

	var data_points = panels.append("div");

	var emp = data_points.append("div").style("margin-top","1rem")
			.style("padding","1rem").style("background","#e0e0e0").style("border-radius","7px");
	emp.append("p").classed("all-caps-prompt",true).text("Jobs in water sector, 2016");
	var W = emp.append("p").style("font-size","1.5rem").style("font-weight","bold").text("xx,xxx");
	var Wrnk = emp.append("p").text("xth out of 100 largest metro areas");

	var share = data_points.append("div").style("margin-top","2rem")
			.style("padding","1rem").style("background","#e0e0e0").style("border-radius","7px");
	share.append("p").classed("all-caps-prompt",true).text("Water sector share of all jobs, 2016");
	var SH = share.append("p").style("font-size","1.5rem").style("font-weight","bold").text("x%");
	var SHrnk = share.append("p").text("xth out of 100 largest metro areas");

	var wages = panels.append("div");
	wages.append("p").classed("all-caps-prompt",true)
		.text("Hourly wage distribution of water workforce versus all occupations, 2016")
		.style("margin","1rem 0rem");
	var svg = wages.append("svg").attr("width","100%").attr("height","450px");

	//range is % width of bars
	var wage_scale = d3.scaleLinear().domain([0,80]).range([0,85]);

	var table_wrap = panels.append("div").style("width","100%").style("max-width","1200px");

	table_wrap.append("p").text("[Table of top X water occupations. This shows top 25; cut to 10?]")


	var table = table_wrap.append("table").style("width","100%");

	var thead = table.append("thead");
	thead.append("tr").selectAll("th").data(["Occupation", "Jobs in water workforce", "Share of all water workforce jobs"]).enter().append("th").text(function(d){return d});

	var tbody = table.append("tbody");

	//draw and redraw
	function draw(){
		var metcode = current_metro;

		var S = data.summary[metcode];

		console.log(data);

		//summary data points
		title.text(data.summary[metcode].title);

		W.text(format.num0(S.empw));
		Wrnk.text("Rank: " + total_ranker(S.empw) + "/100");

		SH.text(format.sh1(S.empw/S.empt));
		SHrnk.text("Rank: " + share_ranker(S.empw/S.empt) + "/100");

		//wage distribution
		var h = 300;
		var w = wages.node().getBounding
		var gpad = 35;
		var texth = 25;
		var barh = Math.floor((h - (4*gpad) - texth)/10);
		var gheight = 2*barh;
		svg.attr("height", (h+gpad)+"px");

		var groups = svg.selectAll("g").data([[S.w10, S.t10],
											  [S.w25, S.t25],
											  [S.w50, S.t50],
											  [S.w75, S.t75],
											  [S.w90, S.t90]]);

		groups.exit().remove();
		var bars = groups.enter().append("g").merge(groups)
			.attr("transform", function(d,i){
				return "translate(0," + (i*(gheight+gpad) + texth) + ")";
			})
			.selectAll("rect")
			.data(function(d){
				console.log(groups);
				return d;
			})
			;

		bars.exit().remove();
		bars.enter().append("rect").merge(bars)
			.attr("height", barh)
			.attr("x","0").attr("y", function(d,i){return i*barh})
			.attr("fill", function(d,i){return i==0 ? "#0099ff" : "#cccccc"})
			.transition()
			.attr("width",function(d){return (25 + wage_scale(d)+"%" )})
			;

		var labels = svg.selectAll("text.percentile-label").data([
			"10th percentile", "25th percentile", "Median", "75th percentile", "90th percentile"
			]);

		labels.exit().remove();
		labels.enter().append("text").classed("percentile-label",true).text(function(d){return d})
			.attr("x","0").attr("y",function(d,i){
				return (i*(gheight+gpad)+texth);
			})
			.attr("dy",-4);

		//table
		var trows = tbody.selectAll("tr").data(data.detail.metros[metcode]);

		trows.exit().remove();
		
		var tcells = trows.enter().append("tr").merge(trows).selectAll("td").data(function(d,i){
			return [(i+1)+". "+data.detail.lookup[d.occ], format.num0(d.emp), format.sh1(d.emp/S.empw)];
		});

		tcells.exit().remove();
		tcells.enter().append("td").merge(tcells).text(function(d){return d});

	}

	//akron first after repaint
	setTimeout(function(){
		draw();

		var timer;
		window.addEventListener("resize", function(){;
			clearTimeout(timer);
			timer = setTimeout(draw)
		});

	}, 100)
}

