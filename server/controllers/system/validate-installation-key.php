<?php

use Respect\Validation\Validator as DataValidator;

DataValidator::with('CustomValidations', true);

/**
 * @api {post} /system/validate-key
 * @apiVersion 4.8.0
 *
 * @apiName Validate installation key
 *
 * @apiGroup System
 *
 * @apiDescription This path validates the installation key, a security key to prevent unauthorized modifications.
 *
 * @apiPermission any
 *
 *
 * @apiSuccess {Object} data Empty object
 *
 */
class ValidateInstallationKeyController extends Controller
{
    const PATH = '/validate-key';
    const METHOD = 'POST';

    public function validations()
    {
        return [
            'permission' => 'any',
            'requestData' => [
                'key' => [
                    'validation' => DataValidator::equals(INSTALLATION_KEY),
                    'error' => ERRORS::INVALID_KEY
                ]
            ]
        ];
    }

    public function handler()
    {
        Session::getInstance()->setInstallerLogged(true);
        Response::respondSuccess();
    }
}
