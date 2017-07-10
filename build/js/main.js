import dir from "../../../js-modules/rackspace.js";


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
    //run app...
  }


} //close main()


document.addEventListener("DOMContentLoaded", main);
