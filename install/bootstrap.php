<?php

use Pagon\App;

define('BASE_DIR', dirname(__DIR__));
define('APP_DIR', BASE_DIR . '/app');

require BASE_DIR . '/vendor/autoload.php';

$app = new App(array(
    'views'    => __DIR__ . '/views',
    'autoload' => APP_DIR . '/src'
));

return $app;