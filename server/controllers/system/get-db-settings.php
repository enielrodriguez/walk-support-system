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
            'dbHost' => MYSQL_HOST,
            'dbPort' => MYSQL_PORT,
            'dbUser' => MYSQL_USER,
            'dbName' => MYSQL_DATABASE
        ];

        Response::respondSuccess($data);
    }
}
