<?php

use RedBeanPHP\Facade as RedBean;
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /system/init-database Init database
 * @apiVersion 4.8.0
 *
 * @apiName Init database
 *
 * @apiGroup System
 *
 * @apiDescription This path sets the database settings. It can only be used once during installation.
 *
 * @apiPermission any
 *
 * @apiParam {String} dbHost Location of the database server.
 * @apiParam {String} dbPort Port of the database server.
 * @apiParam {String} dbName Name of the database. If not given, the system will try to create one.
 * @apiParam {String} dbUser User of the database server.
 * @apiParam {String} dbPassword Password of the database server.
 *
 * @apiUse DATABASE_CONNECTION
 * @apiUse DATABASE_CREATION
 * @apiUse INVALID_FILE
 *
 * @apiSuccess {Object} data Array with isInstalled flag (indicates if the DB is already populated)
 *
 */
class InitDatabaseController extends Controller
{
    const PATH = '/init-database';
    const METHOD = 'POST';

    public function validations()
    {
        return [
            'permission' => 'installer',
            'requestData' => [
                'dbHost' => [
                    'validation' => DataValidator::notBlank(),
                    'error' => ERRORS::INVALID_HOST
                ],
                'dbName' => [
                    'validation' => DataValidator::notBlank(),
                    'error' => ERRORS::INVALID_NAME
                ]
            ]
        ];
    }

    public function handler()
    {
        $dbHost = Controller::request('dbHost');
        $dbPort = Controller::request('dbPort') ?: 3306;
        $dbName = Controller::request('dbName');
        $dbUser = Controller::request('dbUser');
        $dbPass = Controller::request('dbPassword');
        if (!$dbPass) {
            $dbPass = defined('MYSQL_PASSWORD') ? MYSQL_PASSWORD : '';
        }

        RedBean::removeToolBoxByKey("default");
        RedBean::setup("mysql:host=$dbHost;port=$dbPort", $dbUser, $dbPass);
        RedBean::addDatabase($dbName, "mysql:host=$dbHost;port=$dbPort;dbname=$dbName", $dbUser, $dbPass);
        RedBean::selectDatabase($dbName);

        if (!RedBean::testConnection()) {
            throw new RequestException(ERRORS::DATABASE_CONNECTION);
        }

        $configFile = fopen('config.php', 'w+') or die(ERRORS::INVALID_CONFIG_FILE);
        $content = '<?php' . PHP_EOL;
        $content .= 'define(\'MYSQL_HOST\', \'' . $dbHost . '\');' . PHP_EOL;
        $content .= 'define(\'MYSQL_PORT\', \'' . $dbPort . '\');' . PHP_EOL;
        $content .= 'define(\'MYSQL_USER\', \'' . $dbUser . '\');' . PHP_EOL;
        $content .= 'define(\'MYSQL_PASSWORD\', \'' . $dbPass . '\');' . PHP_EOL;
        $content .= 'define(\'MYSQL_DATABASE\', \'' . $dbName . '\');' . PHP_EOL;

        fwrite($configFile, $content);
        fclose($configFile);

        if (function_exists('opcache_invalidate')) {
            opcache_invalidate('config.php');
        }

        Response::respondSuccess(InstallationDoneController::isInstallationDone());
    }
}
