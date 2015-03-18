var printer = (function() {
    
    return {
        create: function(file, id) { 
        	if(cache.has(file)) {
        		console.log('(printer.js) Pulling JSON file from cache...');
        		
                // Build DOM object.
                var pre = $('<pre>').addClass('prettyprint linenums' + (id > 1 ? ' hidden' : '')).attr('id', 'printer-' + id);
                $('#printer-container').append(pre);
                $('#printer-' + id).html(cache.pull(file));
                $('#printer-' + id).removeClass('prettyprinted');
                prettyPrint();
                
                pushData(file, response);
        	} else {
	            // Insert content.
	        	var response;
	            var ajax = new XMLHttpRequest();
	    
	            ajax.overrideMimeType("application/json");
	            ajax.open('GET', 'json/' + file, true);
	            ajax.onreadystatechange = function() {
	                if (ajax.readyState == 4 && ajax.status == "200")
	            	 {
	                	response = ajax.responseText.replace(/</g, "&lt;");
	                    // Build DOM object.
	                    var pre = $('<pre>').addClass('prettyprint linenums' + (id > 1 ? ' hidden' : '')).attr('id', 'printer-' + id);
	                    $('#printer-container').append(pre);
	                    $('#printer-' + id).html(response);
	                    $('#printer-' + id).removeClass('prettyprinted');
	                    prettyPrint();
	                    
	                    cache.push(file, response);
	                }
	            };
	            ajax.send(null);
        	}
        }
    };
})();