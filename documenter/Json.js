var count = 0;
var url;

updateURL = function() {
    url = 'json/' + $('#selected-json').val();
};

//$('#json-selector').change(function() {
documenter_update = function() {
    $('#json-items').empty();
    count = 0;
    updateURL();
    json = new Json(url, count);
};

function Json(url) {    
	
    $.getJSON(url, function(data) {
    	appendSubItems(data, true).appendTo('#json-items');    	
    });
    
    appendItem = function(key, val) {
		var active = (key == 'title') ? true : false;
		var type = (val === null) ? 'null' : typeof val;
		var size = (type == 'object') ? Object.keys(val).length : 0;
		var value = (size ? null : val);
		
		// Build <li> tag.
		var buttonDiv1  = $('<div>').addClass('col-xs-5 key').attr('data-toggle', 'tooltip').attr('title', key).text(key);
		var buttonSpan1 = $('<span>').addClass('badge type ' + type).text(type);
		var buttonDiv2  = $('<div>').addClass('col-xs-5 content');
		buttonDiv2 = value !== null ? buttonDiv2.attr('data-toggle', 'tooltip').attr('title', val).text(val) : buttonDiv2;
		var buttonSpan2 = size ? $('<span>').addClass('badge').text(size) : null;
		var button = $('<button>').addClass('btn').attr('type', 'button').attr('data-toggle', 'collapse').attr('data-target', '#test')
			.append(buttonDiv1)
			.append(buttonSpan1)
			.append(buttonDiv2)
			.append(buttonSpan2);
		button = size ? button.attr('data-target', '#item-' + (count + 1)) : button;
		var subItems = (type == 'object') ? appendSubItems(val) : null;
		var li = $('<li>').addClass('list-group-item' + (active ? ' active' : '')).append(button).append(subItems);
		
		return li;
    };
    
    appendSubItems = function(data, first) {
    	var ul = $('<ul>').addClass('list-group' + (first ? '' : ' collapse')).attr('id', 'item-' + ++count);
    	
    	$.each(data, function(key, value) {
    		if(key == 'title')
    			ul.prepend(appendItem(key, value));
    		else
    			ul.append(appendItem(key, value));
    	});
    	
    	return ul;
    };
}

updateURL();
json = new Json(url, count);