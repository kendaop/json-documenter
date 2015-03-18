var documenter = (function() {
    item = 1;
    
    return {   
        appendItem: function(key, val, group) {
            var active = (key == 'title') ? true : false;
            var type = (val === null) ? 'null' : typeof val;
            var size = (type == 'object') ? Object.keys(val).length : 0;
            var value = (size ? null : val);

            // Build <li> tag.
            var buttonDiv1  = active ? null : $('<div>').addClass('col-xs-5 key').attr('data-toggle', 'tooltip').attr('title', key).text(key);
            var buttonSpan1 = active ? null : $('<span>').addClass('badge type ' + type).text(type);
            var buttonDiv2  = $('<div>').addClass('col-xs-5 content');
            buttonDiv2 = value !== null ? buttonDiv2.attr('data-toggle', 'tooltip').attr('title', val).text(val) : buttonDiv2;
            var buttonSpan2 = size ? $('<span>').addClass('badge').text(size) : null;
            var button = $('<button>').addClass('btn').attr('type', 'button')
                .append(buttonDiv1)
                .append(buttonSpan1)
                .append(buttonDiv2)
                .append(buttonSpan2);
            button = size ? button.attr('data-target', '#item-' + group + '-' + item).attr('data-toggle', 'collapse') : button;
            var subItems = (type == 'object') ? documenter.appendSubItems(val, group) : null;
            var li = $('<li>').addClass('list-group-item' + (active ? ' active' : '')).append(button).append(subItems);

            return li;
        },
        
        appendSubItems: function(data, group) {
            var ul = $('<ul>').addClass('list-group' + (item === 1 ? '' : ' collapse')).attr('id', 'item-' + group + '-' + item++);

            $.each(data, function(key, value) {
                if(key == 'title')
                    ul.prepend(documenter.appendItem(key, value, group));
                else
                    ul.append(documenter.appendItem(key, value, group));
            });

            return ul;
        },
        
        count: function(val) {
            if(typeof val !== 'undefined') {
                count += val;
                return count;
            } else
                return count;
        },
        
        create: function(file, group) {
        	if(cache.has(file)) {
        		console.log('(documenter.js) Pulling JSON file from cache...');
                json = documenter.appendSubItems(cache.pull(file), group);
                json = group > 1 ? json.addClass('hidden') : json;
                
                json.appendTo('#json-items');
                item = 1;
        	} else {
	    		$.getJSON('json/' + file, function(data) {
	                json = documenter.appendSubItems(data, group);
	                json = group > 1 ? json.addClass('hidden') : json;
	                
	                json.appendTo('#json-items');
	                item = 1;
	            });
        	}
        },
        
        updateURI: function() {
            uri = 'json/' + $('#selected-json').val();
        }
    };
    
})();