import dir from "../../../js-modules/rackspace.js";
import tract_maps from "./tract_maps.js"
import subscription_bubble_map from "./subscription_bubble_map.js";
import access_bubble_map from "./access_bubble_map.js";
import interventions from './interventions.js';
import add_hand_icons from './add_hand_icons.js';

//main function
function main(){


  //local
  dir.local("./");
  dir.add("data", "data");

  //production data
  //dir.add("dirAlias", "rackspace-slug/path/to/dir");
  //dir.add("dirAlias", "rackspace-slug/path/to/dir");


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
    access_map_wrap.append("p").text("User to toggle between scatter plot of pop density vs access and this map which shows SHARE OF POP IN NEIGHBORHOODS WITH 25 MBPS ACCESS");
    access_bubble_map(access_map_wrap.node());

    var subscription_map_wrap = d3.select("#subscription-map");
    subscription_map_wrap.append("p").text("User to toggle between subscription rates. Right now: Share of metro pop that lives in a HIGH subscription neighborhood.");
    subscription_bubble_map(subscription_map_wrap.node());

    var tract_map_wrap = d3.select("#tract-map").style("max-width","1600px");
    tract_maps(tract_map_wrap.node());

    var inter = interventions();

    var inter_federal = d3.select("#federal_policy");
    var inter_local = d3.select("#local_policy");
    
    inter.grid(inter_federal.node());
    inter.grid(inter_local.node(), true);

    //add in images
    var chicago = d3.select("#tract-map-example").style("position","relative").append("a").attr("href","#tract-map").classed("jump-link",true);
    chicago.append("img").attr("src", dir.url("data", "Chicago.png"));
    chicago.append("div").style("position","relative")
                         .classed("makesans",true)
                         .style("padding","0em 0em 0em 0em")
                         .style("border-top","1px dotted #0d73d6")
                         //.style("bottom","0px")
                         //.style("right","0%")
                         //.style("width","90%")
                         .style("top","-150px")
                         .append("div")
                         .style("padding","1em 0em 1em 1em")
                         .style("background-color","rgba(255,255,255,0.8)")
                         .append("p")
                         .style("margin","0em")
                         .html('Census tracts in the Chicago metropolitan area, shaded by broadband subscription rates; <b class="red-text">red</b> indicates low rates of broadband subscription while <b class="blue-text">blue</b> indicates high subscription neighborhoods. Detailed interactive maps are available below.');

    chicago.append("p").html('<span class="hand-icon"></span> <span style="white-space:nowrap">Jump to maps</span>').style("position","absolute")
                        .style("top","20%").style("left","64%")


  
    add_hand_icons(chicago.node());

    //availability by speed tier
    var availability_graphic1 = d3.select("#availability-by-speed-tier").style("margin-bottom","2em")
    availability_graphic1.append("p").html("<b>Seven percent of Americans lack access to 25 Mbps broadband</b>").style("font-size","1.15em");
    availability_graphic1.append("img").attr("src", dir.url("data","share_without_access.svg"));

    var availability_graphic2 = d3.select("#rural-availability")
    availability_graphic2.append("p").html("<b>One in four rural residents does not have access to 25 Mbps broadband</b>").style("font-size","1.15em");
    availability_graphic2.append("img").attr("src", dir.url("data","share_without_access_by_geo.svg"));

    var subscription_graphic = d3.select("#subscription-chart")
    subscription_graphic.append("p").html("<b>Less than one-fifth of Americans live in a high subscription neighborhood where at least 80 percent of residents have a broadband subscription</b>").style("font-size","1.15em").style("margin-bottom","20px");
    subscription_graphic.append("img").attr("src", dir.url("data","subscription_levels.svg"));  

    var pricing_graphic = d3.select("#pricing-by-country");
    pricing_graphic.append("p").html('<b>Average price of fixed broadband plans per Mbps of download speed, <span style="white-space:nowrap">2014 (US$)</span></b>').style("font-size","1.15em").style("margin-bottom","15px");
    pricing_graphic.append("img").attr("src", dir.url("data","price_by_country.svg")); 
  }


} //close main()


document.addEventListener("DOMContentLoaded", main);
