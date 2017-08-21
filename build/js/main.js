import dir from "../../../js-modules/rackspace.js";
import tract_maps from "./tract_maps"


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

    var tract_map_wrap = wrap.append("div");

    tract_maps(tract_map_wrap.node());

  }


} //close main()


document.addEventListener("DOMContentLoaded", main);
