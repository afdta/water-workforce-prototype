(function () {
'use strict';

//directory

var dir = {
	rackspace: 'https://c24215cec6c97b637db6-9c0895f07c3474f6636f95b6bf3db172.ssl.cf1.rackcdn.com/interactives/2018',
	ts: (new RegExp("^/|/$", "g")),
	ds: (new RegExp("/{2,}", "g")),
	folders: {}
};

dir.local = function(root_directory){
	if(arguments.length > 0){
		dir.rackspace = root_directory.replace(this.ts, "");
	}
	else{
		dir.rackspace = ".";
	}
	return this;
};

dir.add = function(name, relative_path){
	if(arguments.length==1){
		dir.folders[name] = name.replace(this.ts, "");
	}
	else if(arguments.length > 1){
		dir.folders[name] = relative_path.replace(this.ts, "");
	}
	return this;
};

dir.url = function(name, file_name){
	if(arguments.length==0){
		var path = dir.rackspace;
	}
	else if(arguments.length==1){
		var path = dir.rackspace + "/" + name;
	}
	else{
		var path = dir.rackspace + "/" + dir.folders[name] + "/" + file_name;
	}

	return path;
};

function degradation(root){
	
	if(arguments.length==0){
		root = document.body;
	}

	var d = {};

	var browser_compat_alert = function(){
		root.innerHTML = '<p style="margin:0em;text-align:center;line-height:2em;padding:2em;">This interactive feature requires a modern browser<br />such as Chrome, Firefox, IE10+, or Safari.</p>';
	};

	//browser compatibility check
	d.browser = function(root_el){
		if(arguments.length){
			root = root_el;
		}

		if(!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") || 
			!Array.prototype.filter || !Array.prototype.map || !Array.prototype.forEach || !Array.prototype.indexOf){
			browser_compat_alert();
			return false;
		}
		else{
			return true;
		}
	};

	d.alert = function(container){
		if(arguments.length){
			container.innerHTML = '<p style="margin:0em;text-align:center;line-height:2em;padding:2em;">An error has occurred.<br />Please refresh the page.</p>';
		}
		else{
			root.innerHTML = '<p style="margin:0em;text-align:center;line-height:2em;padding:2em;">An error has occurred.<br />Please refresh the page.</p>';
		}

		return d;
	};

	return d;
}

//main function
function main(){


  //local
  dir.local("./");
  //dir.add("dirAlias", "path/to/dir");
  //dir.add("dirAlias", "path/to/dir");


  //production data
  //dir.add("dirAlias", "rackspace-slug/path/to/dir");
  //dir.add("dirAlias", "rackspace-slug/path/to/dir");
  var compat = degradation(document.getElementById("metro-interactive"));


  //browser degradation
  if(compat.browser()){
    //run app...
  }


} //close main()


document.addEventListener("DOMContentLoaded", main);

}());
