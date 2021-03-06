import dir from "../../../js-modules/rackspace.js";
import tract_maps from "./tract_maps.js"
import subscription_bubble_map from "./subscription_bubble_map.js";
import access_bubble_map from "./access_bubble_map.js";
import interventions from './interventions.js';
import add_hand_icons from './add_hand_icons.js';

//main function
function main(){


  //local
  //dir.local("./");
  //dir.add("graphics", "assets/graphics");
  //dir.add("topo", "assets/tract_geo");
  //dir.add("data", "assets/cbsa_data");
  //dir.add("metdata", "assets/summary_data");
  //dir.add("citytopo", "assets/city_geo");

  //production data
  dir.add("graphics", "broadband-distress/assets/graphics");
  dir.add("topo", "broadband-distress/assets/tract_geo");
  dir.add("data", "broadband-distress/assets/cbsa_data");
  dir.add("metdata", "broadband-distress/assets/summary_data");
  dir.add("citytopo", "broadband-distress/assets/city_geo");

  //browser degradation
  if(!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ||
    !Array.prototype.filter || !Array.prototype.map){
      document.getElementById("metro-interactive").innerHTML = '<p style="font-style:italic;text-align:center;margin:30px 0px 30px 0px;">This interactive feature requires a modern browser such as Chrome, Firefox, IE9+, or Safari.</p>'; 
      return null;
  }
  else{
    var wrap = d3.select("#metro-interactive");

    //build svg filters
    var defs = wrap.append("div").style("height","2px").append("svg").append("defs");
    var filter = defs.append("filter").attr("id","feBlur").attr("width","150%").attr("height","150%");
    filter.append("feOffset").attr("result","offsetout").attr("in","SourceGraphic").attr("dx","6").attr("dy","6");
    filter.append("feColorMatrix").attr("result","matrixout").attr("in","offsetout").attr("type","matrix").attr("values","0.25 0 0 0 0 0 0.25 0 0 0 0 0 0.25 0 0 0 0 0 1 0");
    filter.append("feGaussianBlur").attr("result","blurout").attr("in","matrixout").attr("stdDeviation","6");
    filter.append("feBlend").attr("in","SourceGraphic").attr("in2","blurout").attr("mode","normal");

    var filter2 = defs.append("filter").attr("id","feBlur2").attr("width","150%").attr("height","150%");
    filter2.append("feOffset").attr("result","offsetout").attr("in","SourceGraphic").attr("dx","2").attr("dy","2");
    filter2.append("feColorMatrix").attr("result","matrixout").attr("in","offsetout").attr("type","matrix").attr("values","0.25 0 0 0 0 0 0.25 0 0 0 0 0 0.25 0 0 0 0 0 0.5 0");
    filter2.append("feGaussianBlur").attr("result","blurout").attr("in","matrixout").attr("stdDeviation","5");
    filter2.append("feBlend").attr("in","SourceGraphic").attr("in2","blurout").attr("mode","normal");      

    var access_map_wrap = d3.select("#access-map");
    access_bubble_map(access_map_wrap.node());

    var subscription_map_wrap = d3.select("#subscription-map");
    subscription_bubble_map(subscription_map_wrap.node());

    var tract_map_wrap = d3.select("#tract-map").style("max-width","1600px").style("margin","0px auto");
    tract_maps(tract_map_wrap.node());

    var inter = interventions();

    var inter_federal = d3.select("#federal_policy");
    var inter_local = d3.select("#local_policy");
    
    inter.grid(inter_federal.node());
    inter.grid(inter_local.node(), true);

    //add in images
    var chicago = d3.select("#tract-map-example").style("position","relative")
                                                 .append("a")
                                                 .attr("href","#tract-map")
                                                 .classed("jump-link",true)
                                                 ;

    chicago.append("div").style("position","relative")
                         .classed("makesans",true)
                         .style("padding","0em 1em 0.5em 1em")
                         .style("border-bottom","1px dotted #aaaaaa")
                         .style("top","0em")
                         .style("z-index","1")
                         .style("background-color","rgba(255,255,255,0.9)")
                         .append("p")
                         .style("margin","0em 0em 0.25em 0em")
                         .style("font-style","italic")
                         .html('Census tracts in the Chicago metropolitan area, shaded by broadband subscription rates; <b class="red-text">red</b> indicates low rates of broadband subscription while <b class="blue-text">blue</b> indicates high subscription neighborhoods. <b>View a map of broadband subscription rates <span class="hand-icon" style="white-space:nowrap">in your metropolitan area. </span></b>');


    chicago.append("img").attr("src", dir.url("graphics", "Chicago.png"))
                         .style("max-width","500px")
                         .style("margin","-3em auto 0px auto")
                         .style("display","block")
                         .style("position","relative")
                         .style("z-index","0")
                         ;


    chicago.append("p").html('').style("position","absolute")
                        .style("top","20%").style("left","64%")


  
    add_hand_icons(chicago.node());

    //availability by speed tier
    var availability_graphic1 = d3.select("#availability-by-speed-tier").style("margin-bottom","2em")
    availability_graphic1.append("p").html("<b>Seven percent of Americans lack access to 25 Mbps broadband</b>").style("font-size","1.15em");
    availability_graphic1.append("img").attr("src", dir.url("graphics","share_without_access.svg"));

    var availability_graphic2 = d3.select("#rural-availability")
    availability_graphic2.append("p").html("<b>One in four rural residents does not have access to 25 Mbps broadband</b>").style("font-size","1.15em");
    availability_graphic2.append("img").attr("src", dir.url("graphics","share_without_access_by_geo.svg"));

    var subscription_graphic = d3.select("#subscription-chart")
    subscription_graphic.append("p").html("<b>Less than one-fifth of Americans live in a high subscription neighborhood where at least 80 percent of residents have a broadband subscription</b>").style("font-size","1.15em").style("margin-bottom","20px");
    subscription_graphic.append("img").attr("src", dir.url("graphics","subscription_levels.svg"));  

    var pricing_graphic = d3.select("#pricing-by-country");
    pricing_graphic.append("p").html('<b>Average price of fixed broadband plans per Mbps of download speed, <span style="white-space:nowrap">2014 (US$)</span></b>').style("font-size","1.15em").style("margin-bottom","15px");
    pricing_graphic.append("img").attr("src", dir.url("graphics","price_by_country.svg")); 

    var correlation_graphic = d3.select("#correlations-chart");
    //correlation_graphic.append("p").html('<b></b>').style("font-size","1.15em").style("margin-bottom","15px");
    correlation_graphic.append("img").attr("src", dir.url("graphics","correlations.svg")); 
  }

} //close main()


document.addEventListener("DOMContentLoaded", main);
