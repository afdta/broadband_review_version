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
	var borderCache = {};
	function get_and_map(cbsa){
		if(geoCache.hasOwnProperty(cbsa)){
			map_tract(geoCache[cbsa], topoCache[cbsa], borderCache[cbsa]);
		}
		else{
			var uri = "./data/tract_json/"+cbsa+".json";

			d3.json(uri, function(error, topo){
				if (error) throw error;

				var geoj = topojson.feature(topo, topo.objects.tracts);
				geoj.bbox = topojson.bbox(topo);

				var border = topojson.mesh(topo, topo.objects.tracts, function(a,b){
					return a===b;
				});

				var border_fc = {
					"type": "FeatureCollection",
					"features": [
						{
							"type": "Feature",
							"geometry": border,
							"properties": {
								"geo_id":"border"
							}
						}	
					]
				}

				geoCache[cbsa] = geoj; //cache it
				topoCache[cbsa] = topo;
				borderCache[cbsa] = border_fc;

				map_tract(geoj, topo, border_fc);		
			});
		}
	}

	var map = mapd(map_wrap.node());

	var menu_wrap = map.menu().style("margin-bottom","1em");
	

	var menu_inner = menu_wrap.append("div").style("max-width","1200px")
							  .style("border-bottom", "1px dotted #999999")
							  .style("margin","0px auto 0em auto")
							  .style("padding","0em 2em 1em 2em")
							  ;

	var select = menu_inner.append("div");

		menu_inner.append("p").text("SHOW NEIGHBORHOODS WITH:")
							  .style("margin","1.5em 0em 0em 0em")
							  .style("font-size","0.85em")
							  .style("color", "#555555")
							  .style("padding", "0px 0px 6px 6px")
							  .style("line-height","1em")
							  ;

	var filter_wrap = menu_inner.append("div").classed("c-fix",true).style("padding","0px 0px 0em 0px").classed("buttons",true);

	var alldata;

	function map_tract(geoj, topo, border){
		map.clear();

		var border_layer = map.layer().geo(border).attr("filter", "url(#feBlur)").attr("fill","#ffffff");
		var tract_layer = map.layer().geo(geoj).attr("stroke","#ffffff").attr("stroke-width","0.5px");

		//var lake_layer = map.layer().geo(map.geo("lakes")).attr("fill","#ff0000");
		
		if(!!alldata){

			tract_layer.data(alldata, "tr");

			var cols = ['#a50f15','#a50f15','#ef3b2c','#9ecae1','#6baed6','#084594'];
			tract_layer.aes.fillcat("su").levels(["0","1","2","3","4","5"], cols);


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

		map.legend.swatch([{color:'#a50f15', value:"0-20%"},
						   {color:'#ef3b2c', value:"20-40%"},
						   {color:'#9ecae1', value:"40-60%"},
						   {color:'#6baed6', value:"60-80%"},
						   {color:'#084594', value:"80-100%"}], 
						   function(v){return v},
						   "Neighborhood broadband subscription rates",
						   "left"
						   )
		map.legend.wrap.style("max-width","1200px").style("margin","0px auto");

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
	var filter_selections = {av:false, pov:false, ki:false, ba:false};
	function build_filters(layer){
		var filters_update = filter_wrap.selectAll("p.filter").data(["av","pov","ki","ba"]);
		filters_update.exit().remove();
		var filters_enter = filters_update.enter().append("p").classed("filter",true);
		var filters = filters_enter.merge(filters_update);
			filters.style("float","left")
				   .text(function(d){
						var text = {av:"No availability at 25 Mbps", pov:"A 20%+ poverty rate", ki:"Above U.S. average share of children", ba:"Above U.S. average BA attainment"};
						return text[d];
					});

			//.style("margin","5px 10px 5px 0px").style("padding","0px 10px").style("cursor","pointer")
			//		.style("border","1px solid #aaaaaa")
			//		.style("border-radius","5px");

		filters.on("mousedown",function(d){

			d3.select(this).classed("selected", filter_selections[d] = !filter_selections[d]);

			//passing these tests means showing the geo (e.g. no availability, high poverty, high edu)
			var av_test = function(d){return !filter_selections.av || (filter_selections.av && d.av == "N")}
			var pov_test = function(d){return !filter_selections.pov || (filter_selections.pov && d.pov >= 0.2)}
			var ki_test = function(d){return !filter_selections.ki || (filter_selections.ki && d.ki > 0.2328)}
			var ba_test = function(d){return !filter_selections.ba || (filter_selections.ba && d.ba > 0.2977)}

			var composite_filter = function(d){
				var show = av_test(d) && pov_test(d) && ki_test(d) && ba_test(d);
				return show ? "1" : "0.05";
			}

			layer.style("opacity",function(d){
				return composite_filter(d);
			});

			layer.draw();
		});
	}




}