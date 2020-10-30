<?php

use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /user/disable Ban email
 * @apiVersion 4.8.0
 *
 * @apiName Disable User
 *
 * @apiGroup User
 *
 * @apiDescription This path takes an user id and disabled access for it
 *
 * @apiPermission staff1
 *
 * @apiParam {String} userId Id of the user to disable
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_USER
 * @apiUse ALREADY_DISABLED
 *
 * @apiSuccess {Object} data Empty object
 *
 */
class DisableUserController extends Controller
{
    const PATH = '/disable';
    const METHOD = 'POST';

    public function validations()
    {
        return [
            'permission' => 'company_admin',
            'requestData' => [
                'userId' => [
                    'validation' => DataValidator::dataStoreId('user'),
                    'error' => ERRORS::INVALID_USER
                ]
            ]
        ];
    }

    public function handler()
    {
        $loggedUser = Controller::getLoggedUser();
        $user = User::getDataStore(Controller::request('userId'));

        if (!Controller::isStaffLogged() && ($loggedUser->company->id !== $user->company->id)) {
            throw new RequestException(ERRORS::NO_PERMISSION);
        }

        if ($user->disabled) {
            throw new RequestException(ERRORS::ALREADY_DISABLED);
        }

        $user->disabled = 1;
        $user->store();

        Response::respondSuccess();
    }
}
