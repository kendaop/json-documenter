$(document).ready(function() {
    ////
    // Make changes to the drop-down list here!
    // JSON file is the key, resultant schema file is the value.
    ////
    var json_files = {
        'test.json' : 'updated_schema.json',
        'dynamic_data_structure.json' : 'dds_schema.json'
    };
    
    // Populate drop-down list of files. New files should be added to the array, above.
    for(var file in json_files) {
        var a = $('<a>').attr('href', '#').text(file);
        $('<option>').text(file).appendTo('#json-selector');
    }
    
    // Load tab content.
    $('.content-container .raw-json').load('printer/printer.html');
    $('.content-container .pretty-json').load('documenter/documenter.html');
    $('.content-container .pretty-schema').load('schema-documenter/documenter.html');
      
    // Populate json file indicators when selected from drop-down.
    $('#json-selector').change(function(event) {
        $('#selected-json').val($(this).val());
        $('#selected-schema').val(json_files[$(this).val()]);
        window.location.hash = 'json/' + $('#selected-schema').val();
    });
    $('#json-selector').change();
    
    // Show/hide tab content via the 'active' class.
    $('.nav-tabs li').click(function() {
        $('.nav-tabs li, .content-container > div').each(function() {
            $(this).removeClass('active');
        });
        
        var selector = '.content-container .'.concat($(this).attr('class'));

        $(this).addClass('active');
        $(selector).addClass('active');
    });
    
    $(window).on('hashchange', function () {
        if($('.raw-json').hasClass('active')) {
            printer_update();
            documenter_update();
            schema_update();
        } else if($('.pretty-json').hasClass('active')) {
            documenter_update();
            printer_update();
            schema_update();
        } else {
            schema_update();
            printer_update();
            documenter_update();
        }
    });
});
