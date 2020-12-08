<?php

/**
 * @api {post} /system/get-admin-settings
 * @apiVersion 4.8.0
 *
 * @apiName Get admin settings
 *
 * @apiGroup System
 *
 * @apiDescription This path returns the admin (system admin) settings, only accessible with the installation key (for editing a current installation).
 *
 * @apiPermission installer
 *
 *
 * @apiSuccess {Object} data array
 *
 */
class GetAdminSettingsController extends Controller
{
    const PATH = '/get-admin-settings';
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
        $admin = Staff::findOne(' super_user = 1 ');

        Response::respondSuccess([
            'name' => $admin->name,
            'email' => $admin->email
        ]);
    }
}
