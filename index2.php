<?php
	$file = 'dynamic_data_structure.json';

	class Json {
		protected $id;
		protected $json_obj;
		static protected $count = 0;
		
		// Increments JSON object counter and stores a new object.
		// $item must be valid JSON.
		public function __construct($item) {
			$this->id = ++Json::$count;
			$this->json_obj = json_decode($item);
		}
		
		public function __toString() {
			return $this->toString();
		}
		
		public function __get($name) {
			return $this->name;
		}

		public function length() {
			return count($this->json_obj);
		}
		
		public function properties() {
			if(is_array($this->json_obj))
				return array_keys($this->json_obj);
			else 
				return array_keys(get_object_vars($this->json_obj));
		}
		
		public function property($name) {
			if(is_array($this->json_obj))
				return $this->json_obj[$name];
			else
				return $this->json_obj->$name;
		}
		
		public function size() {
			return count((array)$this->json_obj);	
		}
		
		// Returns an HTML string representing all objects.
		public function toString() {
			$reserved = ['a' => 'title', 'b' => 'identifier'];
			$string  = '';
			$props = $this->properties();
			
			if(is_array($this->json_obj)) {
				if(array_key_exists('title', $this->json_obj)) 
					$string .= "<li class='list-group-item active'>".$this->property('title')."</li>";
				
				if(array_key_exists('identifier', $this->json_obj))
					$string .= "<li class='list-group-item list-group-item-info'>".$this->property('identifier')."</li>";
			} else {
				if(property_exists($this->json_obj, 'title'))
					$string .= "<li class='list-group-item active'>".$this->property('title')."</li>";
				
				if(property_exists($this->json_obj, 'identifier') && !is_array($this->property('identifier'))) 
                                    $string .= "<li class='list-group-item list-group-item-info'>".$this->property('identifier')."</li>";
			}
			
			for($x = 0; $x < $this->size(); $x++) {
				$name = $props[$x];

				if($name !== 'title' && $name !== 'identifier') {
					$string .= $this->printItem($name, $this->property($name));
				}
			}
			
			return $string;
		}
		
		// Returns an HTML string representing one object.
		private function printItem($key, $object) {
			$badge = $sub_items = $data_toggle = $id = $id_string = $content = '';
			$type = strtolower(gettype($object));

                        try {
                            // Creates string portion for sub-items.
                            if(is_array($object) || is_object($object)) {
                                    $new_obj = new Json(json_encode($object));				
                                    $id = $new_obj->id;
                                    $id_string = "id='item-$id'";
                                    $badge = "<span class='badge'>".count((array)$object)."</span>";
                                    $data_toggle = "data-toggle='collapse' data-target='#item-$id > ul'";
                                    //var_dump($new_obj);
                                    $sub_items = "<ul class='collapse'>$new_obj</ul>";
                            } else {
                                    if($type == 'boolean')
                                            $object = $object ? 'true' : 'false';

                                    $content = "<div class='col-xs-5 content' data-toggle='tooltip' title='".htmlspecialchars($object)."'>".htmlspecialchars($object)."</div>";
                            }
                        } catch(Exception $e) {
                            var_dump($e);
                        }
	
			return "
				<li class='list-group-item' $id_string>
					<button class='btn' type='button' $data_toggle>
                                                <div class='col-xs-5 key' data-toggle='tooltip' title='$key'>$key</div>
						<span class='type $type badge' $data_toggle>$type</span>
						$content
						$badge
					</button>
					$sub_items
				</li>
			";
		}
	}

	$string = file_get_contents($file);
	$json = new Json($string);	
?>

<html>
<head>
	<script src='//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js'></script>
	<script src='bootstrap.min.js'></script>
	<!--<script src='custom.js'></script>-->
	<link rel='stylesheet' type='text/css' href='bootstrap.min.css'></link>
	<link rel='stylesheet' type='text/css' href='custom.css'></link>
</head>
<body>
	<div class='col-xs-10 col-xs-offset-1'>
		<ul class='list-group'>
			<?= $json->toString() ?>
		</ul>
	</div>
</body>
</html>