//to do: transfer geojson to data folder in project

import metro_select from "../../../js-modules/metro-select.js";
import mapd from "../../../js-modules/maps/mapd.js";

export default function tract_maps(container){

	var wrap = d3.select(container);
	var select = wrap.append("div");
	var map_wrap = wrap.append("div").style("padding","10px").append("div")
					   .style("width","100%")
                       .style("min-height","400px")
                       .style("height","85vh")
                       ;

	var cache = {};
	function get_and_map(cbsa){
		if(cache.hasOwnProperty(cbsa)){
			map_tract(cache[cbsa]);
		}
		else{
			var uri = "../js-modules/maps/build/data/geo/tract/2014/final/"+cbsa+".json";
			//console.log(uri);
			d3.json(uri, function(error, topo){
				if (error) throw error;

				var geoj = topojson.feature(topo, topo.objects.tracts);
				geoj.bbox = topojson.bbox(topo);

				cache[cbsa] = geoj; //cache it

				map_tract(geoj);		
			});
		}
	}

	var map = mapd(map_wrap.node());
	var alldata;

	function map_tract(geoj){
		map.clear();
		var tract_layer = map.layer().geo(geoj);

		if(!!alldata){
			tract_layer.data(alldata, "tract").aes.set();
			var cols = ['#ffffff','#d7301f','#ef6548','#7fcdbb','#1d91c0','#0c2c84'];
			var cols = ['#efefef','#cb181d','#ef3b2c','#9ecae1','#6baed6','#084594'];
			var cat_scale = tract_layer.aes.fillcat("pcat_10x1").levels(["0","1","2","3","4","5"], cols);
			//console.log(cat_scale);
		}

		var projection = tract_layer.get_albers();

		map.projection(projection, tract_layer);

		map.draw();
	};	

	d3.csv("./data/tract_data.csv", function(error, data){
		//map.data(data, "tract");
		alldata = data;

		metro_select().setup(select.node()).onchange(function(cbsa){
			//console.log(this);
			get_and_map(cbsa.CBSA_Code);
		});

		get_and_map("10420");
	})

}