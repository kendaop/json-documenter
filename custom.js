$(document).ready(function() {
	$('.list-group-item').click(function() {
		$(this).find('ul').each(function() {
			$(this).toggleClass('hidden');
		});
	});	
});
