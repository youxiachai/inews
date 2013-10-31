<?php

use Pagon\App;

define('APP_DIR', __DIR__);
define('BASE_DIR', dirname(__DIR__));

require dirname(__DIR__) . '/vendor/autoload.php';

$app = new App(
    array(
        'views'    => APP_DIR . '/views',
        'autoload' => APP_DIR . '/src'
    ) + include(BASE_DIR . '/config/default.php')
);

/**
 * Config
 */
// Load env from file
if (is_file(BASE_DIR . '/config/env')) {
    $app->mode(trim(file_get_contents(BASE_DIR . '/config/env')));
}

// Load config by enviroment
if (!is_file($conf_file = BASE_DIR . '/config/' . $app->mode() . '.php')) {
    echo "No config found! Plz add config/" . $app->mode() . ".php file";
    exit;
} else {
    $app->append(include($conf_file));
}

$app->add('Booster');
$app->assisting();

// Add pretty exception
if ($app->debug) {
    $app->add('PrettyException');
} else {
    error_reporting(E_ALL & ~E_NOTICE);
}

$app->protect('loadOrm', function () {
    global $app;
    $config = $app->database;
    ORM::configure(buildDsn($config));
    ORM::configure('username', $config['username']);
    ORM::configure('password', $config['password']);
    Model::$auto_prefix_models = '\\Model\\';
});

$app->share('pdo', function ($app) {
    $config = $app->database;
    return new PDO(buildDsn($config), $config['username'], $config['password'], $config['options']);
});

GlobalEvents::register($app);

return $app;


/**
 * build Dsn string
 *
 * @param array $config
 * @return string
 */
function buildDsn(array $config)
{
    return sprintf('%s:host=%s;port=%s;dbname=%s', $config['type'], $config['host'], $config['port'], $config['dbname']);
}
