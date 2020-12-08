<?php

/**
 * @api {post} /system/get-email-settings
 * @apiVersion 4.8.0
 *
 * @apiName Get Email settings
 *
 * @apiGroup System
 *
 * @apiDescription This path returns the Email settings, only accessible with the installation key (for editing a current installation).
 *
 * @apiPermission installer
 *
 *
 * @apiSuccess {Object} data array
 *
 */
class GetEmailSettingsController extends Controller
{
    const PATH = '/get-email-settings';
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
        $emailSettings = Setting::find(' (name LIKE "smtp%" AND name != "smtp-pass") OR name = "server-email" ');
        $emailSettingsArray = [];
        foreach ($emailSettings as $smtpEntry) {
            $name = $smtpEntry->name;
            $value = $smtpEntry->value;
            $emailSettingsArray[$name] = $value;
        }

        Response::respondSuccess($emailSettingsArray);
    }
}
