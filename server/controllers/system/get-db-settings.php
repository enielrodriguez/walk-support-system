<?php

/**
 * @api {post} /system/get-db-settings
 * @apiVersion 4.8.0
 *
 * @apiName Get DB settings
 *
 * @apiGroup System
 *
 * @apiDescription This path returns the DB settings, only accessible with the installation key (for editing a current installation).
 *
 * @apiPermission installer
 *
 *
 * @apiSuccess {Object} data array
 *
 */
class GetDBSettingsController extends Controller
{
    const PATH = '/get-db-settings';
    const METHOD = 'POST';

    public function validations()
    {
        return [
            'permission' => 'installer',
            'requestData' => []
        ];
    }

    public function handler()
    {
        $data = [
            'dbHost' => defined('MYSQL_HOST') ? MYSQL_HOST : '',
            'dbPort' => defined('MYSQL_PORT') && MYSQL_PORT !== '3306'? MYSQL_PORT : '',
            'dbUser' => defined('MYSQL_USER') ? MYSQL_USER : '',
            'dbName' => defined('MYSQL_DATABASE') ? MYSQL_DATABASE : ''
        ];

        Response::respondSuccess($data);
    }
}
