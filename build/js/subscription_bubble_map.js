//to do: transfer geojson to data folder in project

//import metro_select from "../../../js-modules/metro-select.js";
import mapd from "../../../js-modules/maps/mapd.js";
import dir from "../../../js-modules/rackspace.js";
import format from "../../../js-modules/formats.js";

export default function subscription_bubble_map(container){

	var wrap = d3.select(container);
	
	var lede = wrap.append("div").style("max-width","1200px").style("margin","0px auto").style("padding","0em 2em");
		lede.append("p").html('Map the share of each metro area\'s population living in low, moderate, or high subscription neighborhoods. Or select "composite ranking" to view rankings based on combined performance on broadband availability and adoption. (See the full report for more details on how these rankings were calulated.)')
			.style("max-width","800px")
			;

	var map_wrap = wrap.append("div").style("padding","10px").append("div")
                       .style("min-height","400px")
                       .style("max-width","1600px")
                       .style("margin","0px auto")
                       ;

	var map = mapd(map_wrap.node());

	var menu_wrap = map.menu().style("text-align","left").append("div")
											.style("max-width","1200px")
											.style("padding","0em 2em 1em 2em")
											.classed("c-fix",true)
											.style("margin","0em auto 2em auto")
											.style("border-bottom", "1px dotted #999999")
											;

		menu_wrap.append("p").text("SELECT ONE TO MAP")
						  .style("margin","0em 0em 0em 0em")
						  .style("font-size","0.85em")
						  .style("color", "#555555")
						  .style("padding", "0px 0px 6px 6px")
						  .style("line-height","1em")
						  ;

	map.legend.wrap.style("max-width","1200px").style("margin","0px auto");

	var menu = menu_wrap.append("div").classed("c-fix buttons",true);

	var defaul = "low";
	var titles = {low:"Low subscription (0-40%)", mod:"Moderate subscription (40-80%)", high:"High subscription (80-100%)", rank:"Composite ranking"}
	var buttons = menu.selectAll("p").data(["low","mod","high","rank"]).enter().append("p")
						.style("float","left")
						.text(function(d){return titles[d]})
						.classed("selected", function(d){return d==defaul})
						.style("visibility", "hidden")
						;	

	d3.json(dir.url("metdata", "metro_adoption.json"), function(error, data){

		if(error){
			return null;
		}

		var stategeo = map.geo("state");
		var metros = map.geo("metro").filter(function(d){return d.t100==1});
		var metro_lookup = {};
		metros.forEach(function(d,i){
			metro_lookup[d.geo_id] = d.geo_name;
		});

		var us_layer = map.layer().geo(map.geo("us")).attr("filter","url(#feBlur2)");
		var state_layer = map.layer().geo(stategeo).attr("fill", "#ffffff");
		
		var projection = d3.geoAlbersUsa();
		map.projection(projection);

		var metro_layer = map.layer().geo(metros).data(data, "cbsa").attr("stroke","#999999");

		var indicator = "low";
		var metro_layer = map.layer().geo(metros).data(data, "cbsa").tooltips(function(d){
			if(indicator == "low"){
				var line = "<br />Share of pop. in low subscription neighborhoods: " + format.sh1(d.low);
			}
			else if(indicator == "mod"){
				var line = "<br />Share of pop. in moderate subscription neighborhoods: " + format.sh1(d.mod);
			}
			else if(indicator == "high"){
				var line = "<br />Share of pop. in high subscription neighborhoods: " + format.sh1(d.high);
			}
			else if(indicator == "rank"){
				var line = "<br />Composite rank (out of 100): " + format.rank(d.rank);
			}

			return "<p><b>"+metro_lookup[d.cbsa] + "</b>" + line + "</p>";

		});		

		//fill color function
		var filler = metro_layer.aes.fill(defaul).quantize() //(['#a50f15','#ef3b2c','#9ecae1','#6baed6','#084594']);
		
		//format legend
		var pct = d3.format(",.1%");
		var ranger = function(v){
			return pct(v[0]) + "–" + pct(v[1]);
		}
		var ranker = function(v){
			return Math.ceil(v[0]) + "–" + Math.floor(v[1]);
		}

		function draw_legend(title, format){
			map.legend.swatch(filler.ticks(), format, title);
		}

		draw_legend("Share of pop. in low subscription neighborhoods", ranger);


		map.draw();

		
		buttons.style("visibility","visible").on("mousedown", function(d,i){
			buttons.classed("selected",function(dd,ii){
				return i==ii;
			});

			if(d=="rank"){
				filler = metro_layer.aes.fill(d).quantize(['#a50f15','#ef3b2c','#999999','#6baed6','#084594']).flip();
			}
			else{
				filler = metro_layer.aes.fill(d).quantize();
			}

			if(d=="low"){
				var title = "Share of pop. in low subscription neighborhoods";
			}
			else if(d=="mod"){
				var title = "Share of pop. in moderate subscription neighborhoods";
			}
			else if(d=="high"){
				var title = "Share of pop. in high subscription neighborhoods";
			}
			else if(d=="rank"){
				var title = "Composite ranking (1 = best performance)";
			}

			indicator = d;
			metro_layer.tooltips().hide();

			draw_legend(title, d=="rank" ? ranker : ranger);

			map.draw();
		});



	})

}