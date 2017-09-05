//to do: transfer geojson to data folder in project
//to do: issue with state layer sometimes not showing

//import metro_select from "../../../js-modules/metro-select.js";
import mapd from "../../../js-modules/maps/mapd.js";
import dir from "../../../js-modules/rackspace.js";
import format from "../../../js-modules/formats.js";

export default function access_bubble_map(container){

	var wrap = d3.select(container);

	var map_wrap = wrap.append("div").style("padding","10px").append("div")
                       .style("min-height","400px")
                       .style("min-width", "450px")
                       .style("max-width","1600px")
                       .style("margin","0px auto")
                       ;

	var map = mapd(map_wrap.node());

	var menu_wrap = map.menu().style("float","right").style("margin-left","2em");
	
	var title = map.title().append("p").style("font-weight","bold")
									.style("font-size","1.15em")
									.style("text-align","center")
									.style("margin","0em auto 1em auto")
									.style("border-bottom", "1px dotted #999999")
									.style("max-width","1600px")
									;
	var buttons = menu_wrap.append("div").classed("buttons", true);

	d3.json(dir.url("metdata", "metro_access.json"), function(error, data){

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
		var state_layer = map.layer().geo(stategeo).attr("fill","#ffffff");
		
		map.projection(d3.geoAlbersUsa()).zoomable(false); //set albers composite projection as map proj

		var metro_layer = map.layer().geo(metros).data(data, "cbsa").tooltips(function(d){
			return "<p><b>"+metro_lookup[d.cbsa] + 
			       "</b><br />Share of pop. without access: " + format.sh1(d.shwo) +
			       "<br />Total pop. without access: " + format.num0(d.numwo) + "</p>"
			       ;
		});
		var tooltips = metro_layer.tooltips();

		var filler = metro_layer.aes.fill("shwo").quantize(['#a50f15','#ef3b2c','#aaaaaa','#6baed6','#084594']).flip();

		var radius = metro_layer.aes.r("numwo");
			radius.radii(4, 40);	

		function draw_legend(){
			map.legend.bubble(radius.ticks(), d3.format("-,.0f"), "Total pop. without access");
			map.legend.swatch(filler.ticks(), function(v){
				var pct = d3.format(",.1%");
				var num1 = d3.format(",.1f");
				return num1(v[0]*100) + "–" + pct(v[1]);
			}, "Share of pop. without access");
		}

		draw_legend();

		//handle redrawing axes in free layer
		var show_scatter = true; //what to do
		var scatter_is_shown = true; //what is there
		var initial_draw = true; //one-time use

		var x_scale = d3.scaleLinear().domain(d3.extent(data, function(d){return d.shwo}));
		var y_scale = d3.scaleLinear().domain([0, d3.max(data, function(d){return d.density}) ] );
		

		//scatter plot layers
		var free_layer = map.layer_free(draw_free).hide(); //hold axes
		var small_scale = false;

		function draw_free(){
			var dims = this.dimensions;
			var svg = d3.select(this.svg);
			var anno_group = this.anno_group;
			var proj = map.projection();

			var redraw_legend = false
			if(dims.width < 560){
				radius.radii(2,20);
				if(!small_scale){draw_legend()}
				small_scale = true;
			}
			else{
				radius.radii(4,40);
				if(small_scale){draw_legend()}
				small_scale = false;
			}

			x_scale.range([100, dims.width-40]);
			y_scale.range([dims.height-100, 15]);

			//axes
			svg.selectAll("g.axisGroup").remove();
			var x_axis_g = svg.append("g").classed("axisGroup",true).attr("transform","translate(0,"+(dims.height-90)+")");
				x_axis_g.append("text").text("Share of pop. without access").attr("x",dims.width-40).attr("y","50").attr("text-anchor","end");
			var y_axis_g = svg.append("g").classed("axisGroup",true).attr("transform","translate(90,0)");
				y_axis_g.append("text").text("Population per square mile").attr("transform","rotate(-90)").attr("x","-10").attr("y","-68");

			var x_axis = d3.axisBottom(x_scale).tickFormat(d3.format(",.0%")).ticks(6);
			x_axis(x_axis_g);

			var y_axis = d3.axisLeft(y_scale).ticks(6);
			y_axis(y_axis_g);

			var u = svg.selectAll("circle").data(metros, function(d){return d.geo_id});
			u.exit().remove();
			var dots = u.enter().append("circle").merge(u).attr("r", function(d){
				return radius.map(metro_layer.lookup(d.geo_id));
			}).attr("fill", function(d){
				return filler.map(metro_layer.lookup(d.geo_id));
			}).attr("stroke","#ffffff");

			//applying tooltips to arbitrary selection reterns a function to clear annotations
			var off = tooltips.apply(dots, anno_group, function(d){return metro_layer.lookup(d.geo_id)});

			//only animate on init and when changing views
			var animate = !initial_draw && show_scatter != scatter_is_shown;

			if(show_scatter){
				us_layer.hide();
				state_layer.hide(animate ? 1000 : 0);
				free_layer.show();
				metro_layer.hide();
				
				tooltips.off();
				off(); //clear from free layer

				if(animate){
					dots.interrupt()
						.attr("cx", function(d,i){return proj([d.lon,d.lat])[0]})
						.attr("cy", function(d,i){return proj([d.lon,d.lat])[1]})
						.transition().duration(3000).attr("cx", function(d,i){
							return x_scale(metro_layer.lookup(d.geo_id).shwo);
						}).attr("cy", function(d,i){
							return y_scale(metro_layer.lookup(d.geo_id).density);
						}).on("end", function(d,i){
							if(i==99){
								tooltips.on();
							}
						});
				}
				else{
					dots.interrupt().attr("cx", function(d,i){
						return x_scale(metro_layer.lookup(d.geo_id).shwo);
					}).attr("cy", function(d,i){
						return y_scale(metro_layer.lookup(d.geo_id).density);
					});	
					tooltips.on();				
				}
				title.html("Population density versus the share of metro area residents without access to 25 Mbps broadband");
				scatter_is_shown = true;
			}
			else{
				tooltips.off();
				off(); //clear anno from free layer
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
								free_layer.hide();
								metro_layer.show();
								tooltips.on();
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
						tooltips.on();
				}
				title.html("Share of metro area residents without access to 25 Mbps broadband");
				scatter_is_shown = false;
			}

			initial_draw = false;
		}

		map.draw();

		//initialize map in next event loop to enable layout
		setTimeout(function(){
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
		},0)
	
	});

}