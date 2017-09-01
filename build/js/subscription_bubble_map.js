//to do: transfer geojson to data folder in project

//import metro_select from "../../../js-modules/metro-select.js";
import mapd from "../../../js-modules/maps/mapd.js";
import dir from "../../../js-modules/rackspace.js";

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

	var menu = menu_wrap.append("div").classed("c-fix buttons",true);

	var defaul = "low";
	var titles = {low:"Low subscription (0-40%)", mod:"Moderate subscription (40-80%)", high:"High subscription (80-100%)", rank:"Composite ranking"}
	var buttons = menu.selectAll("p").data(["low","mod","high","rank"]).enter().append("p")
						.style("float","left")
						.text(function(d){return titles[d]})
						.classed("selected", function(d){return d==defaul})
						.style("visibility", "hidden")
						;	

	d3.json(dir.url("data", "metro_adoption.json"), function(error, data){
		//map.data(data, "tract");
		//alldata = data;

		if(error){
			return null;
		}

		var stategeo = map.geo("state");
		var metros = map.geo("metro").filter(function(d){return d.t100==1});

		var us_layer = map.layer().geo(map.geo("us")).attr("filter","url(#feBlur2)");
		var state_layer = map.layer().geo(stategeo).attr("fill", "#ffffff");
		
		var projection = d3.geoAlbersUsa();
		map.projection(projection);

		var metro_layer = map.layer().geo(metros).data(data, "cbsa");

		metro_layer.aes.fill(defaul).quantile(['#a50f15','#ef3b2c','#9ecae1','#6baed6','#084594']);

		map.draw();

		
		buttons.style("visibility","visible").on("mousedown", function(d,i){
			buttons.classed("selected",function(dd,ii){
				return i==ii;
			});

			metro_layer.aes.fill(d).quantile(['#a50f15','#ef3b2c','#9ecae1','#6baed6','#084594']);

			map.draw();
		});



	})

}