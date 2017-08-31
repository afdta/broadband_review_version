//to do: transfer geojson to data folder in project

//import metro_select from "../../../js-modules/metro-select.js";
import mapd from "../../../js-modules/maps/mapd.js";

export default function access_bubble_map(container){

	var wrap = d3.select(container);
	//var select = wrap.append("div");
	var map_wrap = wrap.append("div").style("padding","10px").append("div")
                       .style("min-height","400px")
                       .style("max-width","1600px")
                       .style("margin","0px auto")
                       ;

	var map = mapd(map_wrap.node());

	var menu_wrap = map.menu();
	var buttons = menu_wrap.append("div").classed("buttons", true).style("float","right");
	//var alldata;

	d3.json("./data/metro_access.json", function(error, data){
		//map.data(data, "tract");
		//alldata = data;

		if(error){
			return null;
		}

		var stategeo = map.geo("state");
		var metros = map.geo("metro").filter(function(d){return d.t100==1});

		var us_layer = map.layer().geo(map.geo("us")).attr("filter","url(#feBlur2)");
		var state_layer = map.layer().geo(stategeo).attr("fill","#ffffff");
		
		map.projection(d3.geoAlbersUsa()).zoomable(false); //set albers composite projection as map proj

		var metro_layer = map.layer().geo(metros).data(data, "cbsa");
		var filler = metro_layer.aes.fill("shwo").quantize(['#a50f15','#ef3b2c','#9ecae1','#6baed6','#084594']).flip();
		var radius = metro_layer.aes.r("numwo");
			radius.radii(4, 40);

		//handle redrawing axes in free layer
		var show_scatter = true; //what to do
		var scatter_is_shown = true; //what is there
		var initial_draw = true; //one-time use

		var x_scale = d3.scaleLinear().domain(d3.extent(data, function(d){return d.shwo}));
		var y_scale = d3.scaleLinear().domain(d3.extent(data, function(d){return d.density}));
		

		//scatter plot layers
		var free_layer = map.layer_free(draw_free).hide(); //hold axes

		function draw_free(){
			var dims = this.dimensions;
			var svg = this.svg;
			var proj = map.projection();

			if(dims.width < 480){
				radius.radii(2,20);
			}
			else{
				radius.radii(4,40);
			}

			x_scale.range([50, dims.width-50]);
			y_scale.range([dims.height-50, 50]);

			var u = svg.selectAll("circle").data(metros, function(d){return d.geo_id});
			u.exit().remove();
			var dots = u.enter().append("circle").merge(u).attr("r", function(d){
				return radius.map(metro_layer.lookup(d.geo_id));
			}).attr("fill", function(d){
				return filler.map(metro_layer.lookup(d.geo_id));
			}).attr("stroke","#ffffff");

			//only animate on init and when changing views
			var animate = !initial_draw && show_scatter != scatter_is_shown;

			if(show_scatter){
				us_layer.hide();
				state_layer.hide(animate ? 1000 : 0);
				free_layer.show();
				metro_layer.hide();

				if(animate){
					dots.interrupt()
						.attr("cx", function(d,i){return proj([d.lon,d.lat])[0]})
						.attr("cy", function(d,i){return proj([d.lon,d.lat])[1]})
						.transition().duration(3000).attr("cx", function(d,i){
							return x_scale(metro_layer.lookup(d.geo_id).shwo);
						}).attr("cy", function(d,i){
							return y_scale(metro_layer.lookup(d.geo_id).density);
						});
				}
				else{
					dots.interrupt().attr("cx", function(d,i){
						return x_scale(metro_layer.lookup(d.geo_id).shwo);
					}).attr("cy", function(d,i){
						return y_scale(metro_layer.lookup(d.geo_id).density);
					});					
				}

				scatter_is_shown = true;
			}
			else{
				//show map				
				if(animate){
					state_layer.show(2000);
					dots.interrupt()
						.attr("cx", function(d,i){
							return x_scale(metro_layer.lookup(d.geo_id).shwo);
						}).attr("cy", function(d,i){
							return y_scale(metro_layer.lookup(d.geo_id).density);
						})
						.transition().duration(3000)
						.attr("cx", function(d,i){return proj([d.lon,d.lat])[0]})
						.attr("cy", function(d,i){return proj([d.lon,d.lat])[1]})
						.on("end",function(d,i){
							if(i==99){
								us_layer.show(400);
								free_layer.hide(200);
								metro_layer.show();
							}
						});
				}
				else{
					state_layer.show();
					dots.interrupt()
						.attr("cx", function(d,i){return proj([d.lon,d.lat])[0]})
						.attr("cy", function(d,i){return proj([d.lon,d.lat])[1]})

						us_layer.show();
						free_layer.hide();
						metro_layer.show();
				}

				scatter_is_shown = false;
			}

			initial_draw = false;			
		}

		//initialize map
		map.draw();

		function draw_scatter(){
			show_scatter = true;
			map.zoomable(false);
			map.zoom(0); //zoom out, recenter, -- this also calls draw
		}

		function draw_map(){
			show_scatter = false;
			map.zoomable();
			map.draw();
		}


		var toggle = buttons.append("p").text("Show map");

		toggle.on("mousedown", function(){
			show_scatter = !show_scatter;
			if(show_scatter){
				draw_scatter();
				toggle.text("Show map");
			}
			else{
				draw_map();
				toggle.text("Show plot")
			}
		})



	
	});

}