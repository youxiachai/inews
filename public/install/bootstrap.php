<?php

use Pagon\App;

define('APP_DIR', dirname(dirname(__DIR__)));

require APP_DIR . '/vendor/autoload.php';

$app = new App(array(
    'views'    => __DIR__ . '/views',
    'autoload' => APP_DIR . '/src'
));

return $app;