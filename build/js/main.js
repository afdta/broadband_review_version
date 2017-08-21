import dir from "../../../js-modules/rackspace.js";
import tract_maps from "./tract_maps.js"
import subscription_bubble_map from "./subscription_bubble_map.js";
import access_bubble_map from "./access_bubble_map.js";

//main function
function main(){


  //local
  dir.local("./");
  //dir.add("dirAlias", "path/to/dir");
  //dir.add("dirAlias", "path/to/dir");


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

    var access_map_wrap = wrap.append("div");
    access_map_wrap.append("h3").text("Broadband access metro bubble map");
    access_map_wrap.append("p").text("User to toggle between scatter plot of pop density vs access and this map which shows SHARE OF POP IN NEIGHBORHOODS WITH 25 MBPS ACCESS");
    access_bubble_map(access_map_wrap.node());

    /*var subscription_map_wrap = wrap.append("div");
    subscription_map_wrap.append("h3").text("Subscription metro bubble map");
    subscription_map_wrap.append("p").text("User to toggle between subscription rates. Right now: Share of metro pop that lives in a HIGH subscription neighborhood.");
    subscription_bubble_map(subscription_map_wrap.node());

    var tract_map_wrap = wrap.append("div");
    tract_map_wrap.append("h3").text("Subscription tract map");
    tract_maps(tract_map_wrap.node());*/

  }


} //close main()


document.addEventListener("DOMContentLoaded", main);
