var cache = (function() {
	//////
	// Make changes to the JSON file selector here!
	//////
	var filenames = {
	    'test.json' : 'updated_schema.json',
	    'dynamic_data_structure.json' : 'dds_schema.json'	
	};
	
	var filenames_array = $.map(filenames, function(val, key) {
	    return [key, val];
	});
	
	var file_data = {};
	
	return {
		push: function(name, data) {
			file_data[name] = data;
		},
		
		pull: function(key) {
			return file_data[key];
		},
		
		has: function(key) {
			return key in file_data;
		},
		
		size: function() {
			return filenames_array.length / 2;
		},
		
		files: function(name) {
			if(typeof name === 'undefined') 
				return filenames;
			else
				return filenames[name];
		},
		
		files_array: function(index) {
			if(typeof name === 'undefined')
				return filenames_array;
			else
				return filenames_array[index];
		}
	};
})();

$(document).ajaxStop(function() {
    $('.inactive-box').hide();
});

$(document).ajaxSuccess(function() {
    progress.increase();
});

// Load tab content.
$('.content-container .raw-json').load('printer/printer.html', function() {
    for(x = 0; x < cache.size(); x++) {
        printer.create(cache.files_array(x * 2), x + 1);
    }
});
$('.content-container .pretty-json').load('documenter/documenter.html', function() {
    for(x = 0; x < cache.size(); x++) {
        documenter.create(cache.files_array(x * 2), x + 1);
    }
});
$('.content-container .pretty-schema').load('schema/schema.html', function() {
     $('#json-selector').change();
});

var progress = (function() {
    var chunks = cache.size() * 2 + 1;
    var progress = 0;
    
    return {
        increase: function() {
            progress += (100 / chunks);
            $('.progress-bar').css('width', progress + "%");
            return progress;
        }
    };
})();

////    ////    ////    ////

$(document).ready(function($) {
	var drop_pop = false;
	
    // Populate drop-down list of files. New files should be added to the array, above.
	populate_dropdown = function() {
		if(drop_pop)
			return;
		else {
			drop_pop = true;
		    var option = 1;
		    for(var file in cache.files()) {
		        $('<option>').attr('id', 'option-' + option++).text(file).appendTo('#json-selector');
		    }
		};
	};
      
    // Functionality when a new file is selected
    $('#json-selector').change(function(event) {
        populate_dropdown();
        
    	// Adjust file indicators.
        $('#selected-json').val($(this).val());
        $('#selected-schema').val(cache.files($(this).val()));
        
        var option = $('#json-selector option:selected').attr('id');
        
        // Hide JSON and Printer items.
        $('#json-items > ul, #printer-container > pre').addClass('hidden');
        
        // Show correct JSON and Printer items.
        $('#json-items > #item-' + option.replace("option-", "") + '-1').removeClass('hidden');
        $('#printer-container > #printer-' + option.replace("option-", "")).removeClass('hidden');
        
        schema.create();
    });
    
    // Show/hide tab content via the 'active' class.
    $('.nav-tabs li').click(function() {
        $('.nav-tabs li, .content-container > div').each(function() {
            $(this).removeClass('active');
        });
        
        var selector = '.content-container .'.concat($(this).attr('class'));

        $(this).addClass('active');
        $(selector).addClass('active');
    });
});