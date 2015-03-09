<?php
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
		
		public function toString() {
			$string  = '';
			$props = $this->properties();
			
			if(is_array($this->json_obj)) {
				if(array_key_exists('title', $this->json_obj)) 
					$string = "<li class='list-group-item active'>".$this->property('title')."</li>";
			} else {
				if(property_exists($this->json_obj, 'title'))
					$string = "<li class='list-group-item active'>".$this->property('title')."</li>";
			}
			
			for($x = 0; $x < $this->size(); $x++) {
				$name = $props[$x];
				
				if($name !== 'title') {
					$string .= $this->printItem($name, $this->property($name));
				}
			}
			
			return $string;
		}
		
		private function printItem($name, $object) {
			$badge = $sub_items = $data_toggle = $id = $id_string = '';
			$type = strtolower(gettype($object));

			if(is_array($object) || is_object($object)) {
				$new_obj = new Json(json_encode($object));				
				$id = $new_obj->id;
				$id_string = "id='item-$id'";
				$badge = "<span class='badge'>".count((array)$object)."</span>";
				$data_toggle = "data-toggle='collapse' data-target='#item-$id ul'";
				$sub_items = "<ul class='collapse'>$new_obj</ul>";
			}
	
			return "
				<li class='list-group-item' $id_string>
					<button class='btn' type='button' $data_toggle> 
						<div class='col-xs-8 key'>$name</div>
						<span class='type $type badge' $data_toggle>$type</span>
						$badge
					</button>
					$sub_items
				</li>
			";
		}
	}

	$file = 'test.json';
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
	<div class='col-xs-4'>
		<ul class='list-group'>
			<?= $json->toString() ?>
		</ul>
	</div>
</body>
</html>