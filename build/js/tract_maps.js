//to do: transfer geojson to data folder in project

import metro_select from "../../../js-modules/metro-select.js";
import mapd from "../../../js-modules/maps/mapd.js";
import dir from "../../../js-modules/rackspace.js";
import format from "../../../js-modules/formats.js";

export default function tract_maps(container){

	var wrap = d3.select(container);
	

	var map_wrap = wrap.append("div").style("padding","0px")
					   .style("border","0px solid #aaaaaa")
					   .style("border-radius","5px")
					   .style("background-color","transparent")
					   .append("div");

	var geoCache = {}; //tract geo
	var dataCache = {}; //tract data 
	var cityCache = {}; //primary city geo

	//var topoCache = {};	//raw topo, used to create geoCache data
	var borderCache = {}; //derived from topo (if geo available, so is border)

	function get_and_map(cbsa){
		if(geoCache.hasOwnProperty(cbsa) && dataCache.hasOwnProperty(cbsa) && cityCache.hasOwnProperty(cbsa)){
			map_tract(dataCache[cbsa], geoCache[cbsa], cityCache[cbsa], borderCache[cbsa], cbsa);
		}
		else{
			//once these are loaded, you can map it
			var data_loaded = false;
			var topo_loaded = false;
			var city_loaded = false;

			//get topo
			d3.json(dir.url("topo", cbsa+".json"), function(error, topo){
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
				//topoCache[cbsa] = topo;
				borderCache[cbsa] = border_fc;

				topo_loaded = true;

				if(data_loaded && city_loaded){
					map_tract(dataCache[cbsa], geoj, cityCache[cbsa], border_fc, cbsa);
				}		
			});

			//get data
			d3.json(dir.url("data", cbsa+".json"), function(error, dat){
				if (error) throw error;

				dataCache[cbsa] = dat;

				data_loaded = true;

				if(topo_loaded && city_loaded){
					map_tract(dat, geoCache[cbsa], cityCache[cbsa], borderCache[cbsa], cbsa);
				}

			});

			//load up city topo file
			d3.json(dir.url("citytopo", cbsa+".json"), function(error, data){
				if (error) throw error;
				
				var citygeo = topojson.feature(data, data.objects.geos);

				cityCache[cbsa] = citygeo;

				city_loaded = true;

				if(topo_loaded && data_loaded){
					map_tract(dataCache[cbsa], geoCache[cbsa], citygeo, borderCache[cbsa], cbsa);
				}
			});
		}
	}

	//create map object and menu areas
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
							  .classed("no-select",true)
							  ;
	var filter_wrap = menu_inner.append("div").classed("c-fix",true).style("padding","0px 0px 0em 0px").classed("buttons",true);


	//do the mapping after all data has been loaded
	function map_tract(tract_data, geoj, citygeo, border, cbsa){
		map.clear();

		var border_layer = map.layer().geo(border).attr("filter", "url(#feBlur)").attr("fill","#ffffff");
		var tract_layer = map.layer().geo(geoj).attr("stroke","#ffffff").attr("stroke-width","0.5px");

		var ttips = tract_layer.tooltips(function(d){
			var pop = "<b>Neighborhood population</b>: " + format.num0(d.pop);
			var availability = "<b>Availability at 25 Mbps</b>: " + (d.av=="N" ? "No" : "Yes");
			var poverty = "<b>Poverty rate</b>: " + (d.pov==null ? "N/A" : format.sh1(d.pov));
			var ba = "<b>BA attainment rate</b>: " + (d.ba==null ? "N/A" : format.sh1(d.ba));
			var kids = "<b>Under 18 share of pop.</b>: " + (d.ki==null ? "N/A" : format.sh1(d.ki));
			return "<p>" + pop + "<br/>" + availability + "<br />" + poverty + "<br />" + ba + "<br />" + kids + "<br />Census tract ID: " + d.tr + "</p>";
		});

		tract_layer.data(tract_data, "tr");

		var cols = ['#a50f15','#a50f15','#ef3b2c','#9ecae1','#6baed6','#084594'];
		tract_layer.aes.fillcat("su").levels(["0","1","2","3","4","5"], cols);


		build_filters(tract_layer);


		//add city boundaries
		try{
			//add two primary city layers
			var mesh_layer0 = map.layer().geo(citygeo).attr("stroke","#FFD101")
													 .attr("fill","none")
													 .attr("stroke-width","3.5")
													 .style("pointer-events","none")
													 ;
			var mesh_layer1 = map.layer().geo(citygeo).attr("stroke","#695600")
								 .attr("fill","none")
								 .attr("stroke-width","1.5")
								 .attr("stroke-dasharray","4,2")
								 .style("pointer-events","none")
								 ;

		}
		catch(e){
			//no-op
		}


		var projection = tract_layer.get_albers();
		
		//if(cbsa == "46520"){
		//	var honolulu = tract_layer.geo()[0];
		//	var honolulu_feat = honolulu.data.features;
		//	var new_feat = []; 
		//	honolulu_feat.forEach(function(d){
		//		if(d.properties.geo_id!="15003981200"){
		//			new_feat.push(d);
		//		}
		//	});
		//	honolulu.data.features = new_feat;
		//}

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

		map.legend.add("primary-city", function(wrap){
			var svg = wrap.append("svg").style("width","150px").style("height","80px");
			svg.append("path").attr("d", "M0,45 l40,0").attr("stroke-width","6").attr("stroke", "#FFD101");
			svg.append("path").attr("d", "M0,45 l40,0").attr("stroke-width","1.5").attr("stroke", "#695600").attr("stroke-dasharray","4,2");
			svg.append("text").text("City boundary").attr("x",45).attr("y",50);

		});

		map.draw();

	};	



	//set up and kick it off
	metro_select().setup(select.node()).onchange(function(cbsa){
			get_and_map(cbsa.CBSA_Code);
		});
	
	get_and_map("10420");


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
					})
				   .classed("selected",false);

			//reset
			filter_selections = {av:false, pov:false, ki:false, ba:false};


		filters.on("mousedown",function(d){

			d3.select(this).classed("selected", filter_selections[d] = !filter_selections[d]);

			//passing these tests means showing the geo (e.g. no availability, high poverty, high edu)
			var av_test = function(d){return !filter_selections.av || (filter_selections.av && d.av == "N")}
			var pov_test = function(d){return !filter_selections.pov || (filter_selections.pov && d.pov >= 0.2)}
			var ki_test = function(d){return !filter_selections.ki || (filter_selections.ki && d.ki > 0.2328)}
			var ba_test = function(d){return !filter_selections.ba || (filter_selections.ba && d.ba > 0.2977)}

			var composite_filter = function(d){
				try{
					var show = av_test(d) && pov_test(d) && ki_test(d) && ba_test(d);
				}
				catch(e){
					var show = false;
				}
				
				return show ? "1" : "0.05";
			}

			layer.style("opacity",function(d){
				return composite_filter(d);
			});

			layer.draw();
		});
	}




}