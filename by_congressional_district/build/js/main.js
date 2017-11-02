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
    
    var maxwidth = "900px";

    var select_wrap = wrap.append("div").style("max-width",maxwidth).style("margin","0px auto");
    var select = select_wrap.append("div").style("float","right");
    select_wrap.append("div").style("width","100%").style("height","2px").style("clear","both");

    var img_wrap = wrap.append("div").style("width","100%").style("border","0px solid #aaaaaa").style("max-width",maxwidth)
                                      .style("border-width","0px 0px").style("margin","1rem auto").style("clear","both");

    var img = img_wrap.append("img").style("width","100%").style("height","auto");

    function load_image(state){
      var file_name = (state.text+" Figure.jpg").replace(/\s/g, "_");

      console.log(file_name);

      img.attr("alt", state.text).attr("src", dir.url("maps", file_name));

    }

    load_image({text:"Alabama"});

    select_menu(select.node()).states("DC").callback(load_image).prompt("Select a state");
  }


} //close main()


document.addEventListener("DOMContentLoaded", main);
