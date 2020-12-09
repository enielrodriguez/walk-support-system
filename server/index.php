<?php
@include 'config.php';
require_once 'vendor/autoload.php';

date_default_timezone_set('UTC');

// REDBEAN CONFIGURATION
use RedBeanPHP\Facade as RedBean;

if (defined('MYSQL_HOST') && defined('MYSQL_DATABASE') && defined('MYSQL_USER') && defined('MYSQL_PASSWORD')) {
    if (!defined('MYSQL_PORT')) define('MYSQL_PORT', '3306');
    RedBean::setup('mysql:host=' . MYSQL_HOST . ';port=' . MYSQL_PORT . ';dbname=' . MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD);
    RedBean::setAutoResolve(true);
    // TODO: Implement freeze
    // RedBean::freeze();
}

if (is_readable('../installation-key.txt')) {
    $lines = file('../installation-key.txt');
    define('INSTALLATION_KEY', trim($lines[3]));
} else {
    define('INSTALLATION_KEY', md5(rand()));
}

// SLIM FRAMEWORK
\Slim\Slim::registerAutoLoader();
$app = new \Slim\Slim();

// LOAD CONTROLLERS
foreach (glob('controllers/*.php') as $controller) {
    include_once $controller;
}

Controller::init();
$app->run();
