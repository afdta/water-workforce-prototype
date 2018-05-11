import dir from "../../../js-modules/rackspace.js";
import degradation from "../../../js-modules/degradation.js";

import interactive from "./interactive.js";


//main function
function main(){


  //local
  dir.local("./");
  dir.add("img", "build/images/unsplash/");
  //dir.add("dirAlias", "path/to/dir");


  //production data
  //dir.add("dirAlias", "rackspace-slug/path/to/dir");
  //dir.add("dirAlias", "rackspace-slug/path/to/dir");
  var compat = degradation(document.getElementById("metro-interactive"));


  //browser degradation
  if(compat.browser()){


    var images = [
                  "igor-ovsyannykov-255640-unsplash.jpg",
                  "kyle-glenn-628068-unsplash.jpg", 
                  "lionello-delpiccolo-151750-unsplash.jpg",
                  "samuel-scrimshaw-166751-unsplash.jpg"
                  ]

    var banners = d3.selectAll(".section-title-mpp.image-backed");

    banners.style("background-image", function(d,i){
      return 'url("' + dir.url("img", images[(i%4)]) + '")';
    });

    interactive();
  }


} //close main()


document.addEventListener("DOMContentLoaded", main);
