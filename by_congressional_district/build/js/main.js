import dir from "../../../../js-modules/rackspace.js";
import degradation from "../../../../js-modules/degradation.js";
import select_menu from "../../../../js-modules/select-menu.js";


//main function
function main(){


  //local
  dir.local("./");
  dir.add("maps", "assets/state_maps");
  //dir.add("dirAlias", "path/to/dir");


  //production data
  //dir.add("dirAlias", "rackspace-slug/path/to/dir");
  //dir.add("dirAlias", "rackspace-slug/path/to/dir");
  var compat = degradation(document.getElementById("metro-interactive"));


  //browser degradation
  if(compat.browser()){
    var wrap = d3.select("#broadband-by-congressional-district");
    var select = wrap.append("div");

    var img_wrap = wrap.append("div").style("width","100%").style("border","1px solid #aaaaaa").style("max-width","1200px")
                                      .style("border-width","1px 0px").style("margin","1rem auto");

    var img = img_wrap.append("img").style("width","100%").style("height","auto");

    function load_image(state){
      console.log(state);

      img.attr("alt", state.text).attr("src", dir.url("maps", state.text+" Figure.jpg"));

    }

    select_menu(select.node()).states(load_image).prompt("Select a state");
  }


} //close main()


document.addEventListener("DOMContentLoaded", main);
