//to do: transfer geojson to data folder in project

import metro_select from "../../../js-modules/metro-select.js";
import mapd from "../../../js-modules/maps/mapd.js";

export default function tract_maps(container){

	var wrap = d3.select(container);
	

	var map_wrap = wrap.append("div").style("padding","0px")
					   .style("border","0px solid #aaaaaa")
					   .style("border-radius","5px")
					   .style("background-color","transparent")
					   .append("div");

	var geoCache = {};
	var topoCache = {};
	function get_and_map(cbsa){
		if(geoCache.hasOwnProperty(cbsa)){
			map_tract(geoCache[cbsa], topoCache[cbsa]);
		}
		else{
			var uri = "./data/tract_json/"+cbsa+".json";

			d3.json(uri, function(error, topo){
				if (error) throw error;

				var geoj = topojson.feature(topo, topo.objects.tracts);
				geoj.bbox = topojson.bbox(topo);

				geoCache[cbsa] = geoj; //cache it
				topoCache[cbsa] = topo;

				map_tract(geoj, topo);		
			});
		}
	}

	var map = mapd(map_wrap.node());

	var menu_wrap = map.menu();
	var select = menu_wrap.append("div");
	var filter_wrap = menu_wrap.append("div").classed("c-fix",true).style("padding","5px 0px 2em 0px");

	var alldata;

	function map_tract(geoj, topo){
		map.clear();

		var tract_layer = map.layer().geo(geoj);

		if(!!alldata){

			tract_layer.data(alldata, "tr");

			var cols = ['#a50f15','#a50f15','#ef3b2c','#9ecae1','#6baed6','#084594'];
			var cat_scale = tract_layer.aes.fillcat("su").levels(["0","1","2","3","4","5"], cols);

			build_filters(tract_layer);

			//temp
			//	geoj.features.forEach(function(d){
			//		var id = d.properties.geo_id;
			//		d.properties.place_fips = tract_layer.lookup(id).pl;
			//	});

			//add mesh layer
			try{
				var mesh = topojson.mesh(topo, topo.objects.tracts, function(a,b){
						var a_place = tract_layer.lookup(a.properties.geo_id).pl;
						var b_place = tract_layer.lookup(b.properties.geo_id).pl;

						var keep = false;

						if((!!a_place || !!b_place) && (a_place !== b_place)){
							var keep = true; 
						}
						else if(!!a_place && a===b){
							var keep = true;
						}

						return keep;

					});

			}
			catch(e){
				var mesh = null;
			}
			finally{
				if(mesh != null){
					var mesh_fc = {
						"type": "FeatureCollection",
						"bbox": geoj.bbox,
						"features": [
							{
								"type": "Feature",
								"geometry": mesh,
								"properties": {
									"geo_id":"primary_cities"
								}
							}	
						]
					}

					//add two mesh layers
					var mesh_layer0 = map.layer().geo(mesh_fc).attr("stroke","#FFD101")
															 .attr("fill","transparent")
															 .attr("stroke-width","3.5")
															 .style("pointer-events","none")
															 ;
					var mesh_layer1 = map.layer().geo(mesh_fc).attr("stroke","#695600")
										 .attr("fill","transparent")
										 .attr("stroke-width","1.5")
										 .attr("stroke-dasharray","4,2")
										 .style("pointer-events","none")
										 ;
				}
			}

		}

		//tract_layer.attr("stroke","orange").attr("stroke-width","3px");

		var projection = tract_layer.get_albers();

		map.projection(projection);

		map.draw();
	};	

	d3.json("./data/tract_data.json", function(error, data){
		//map.data(data, "tract");
		alldata = data;

		metro_select().setup(select.node()).onchange(function(cbsa){
			//console.log(this);
			get_and_map(cbsa.CBSA_Code);
		});

		get_and_map("10420");
	})

	//build filters
	function build_filters(layer){
		var filters_update = filter_wrap.selectAll("div.filter").data(["av","pov","ki","ba"]);
		filters_update.exit().remove();
		var filters_enter = filters_update.enter().append("div").classed("filter",true);
			filters_enter.append("p").text(function(d){
				var text = {av:"Availability at 25 Mbps", pov:"20%+ poverty rate", ki:"23%+ under 18", ba:"28%+ BA attainment"};
				return text[d];
			})
		var filters = filters_enter.merge(filters_update);
			filters.style("float","left").style("margin","5px 10px 5px 0px").style("padding","0px 10px").style("cursor","pointer")
					.style("border","1px solid #aaaaaa")
					.style("border-radius","5px");

		filters.on("mousedown",function(d){
			if(d=="av"){
				layer.style("opacity",function(d){
					return d.av=="N" ? "0.05" : "1";
				});
			}

			if(d=="pov"){
				layer.style("opacity",function(d){
					return d.pov < 0.2 ? "0.05" : "1";
				});
			}

			if(d=="ki"){
				layer.style("opacity",function(d){
					return d.ki < 0.23 ? "0.05" : "1";
				});
			}

			if(d=="ba"){
				layer.style("opacity",function(d){
					return d.ba < 0.28 ? "0.05" : "1";
				});
			}

			layer.draw();
		});
	}




}