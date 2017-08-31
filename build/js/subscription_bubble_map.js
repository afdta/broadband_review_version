//to do: transfer geojson to data folder in project

//import metro_select from "../../../js-modules/metro-select.js";
import mapd from "../../../js-modules/maps/mapd.js";

export default function subscription_bubble_map(container){

	var wrap = d3.select(container);
	//var select = wrap.append("div");
	var map_wrap = wrap.append("div").style("padding","10px").append("div")
                       .style("min-height","400px")
                       .style("max-width","1600px")
                       .style("margin","0px auto")
                       ;

	var map = mapd(map_wrap.node());
	//var alldata;

	d3.json("./data/metro_adoption.json", function(error, data){
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

		metro_layer.aes.fill("pcat_10x1_5").quantile(['#a50f15','#ef3b2c','#9ecae1','#6baed6','#084594']);

		map.draw();

	})

}