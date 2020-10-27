<?php

use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /user/edit-name Edit name
 * @apiVersion 4.8.0
 *
 * @apiName Edit name
 *
 * @apiGroup User
 *
 * @apiDescription This path changes the name of an user.
 *
 * @apiPermission user
 *
 * @apiParam {String} newName The new name that the user wants to change.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_NAME
 *
 * @apiSuccess {Object} data Empty object
 *
 */
class EditName extends Controller
{
    const PATH = '/edit-name';
    const METHOD = 'POST';

    public function validations()
    {
        return [
            'permission' => 'user',
            'requestData' => [
                'newName' => [
                    'validation' => DataValidator::notBlank()->length(2, 55),
                    'error' => ERRORS::INVALID_NAME
                ]
            ]
        ];
    }

    public function handler()
    {
        $newName = Controller::request('newName');
        $user = Controller::getLoggedUser();

        $user->name = $newName;
        $user->store();
        
        Response::respondSuccess();
    }
}
