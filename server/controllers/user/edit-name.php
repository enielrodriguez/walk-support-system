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
 * @apiParam {Number} userId Optional. The user id whose name is to be changed. This option is for staffs and company admins to manage other users.
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

    private $user;

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
        $userId = Controller::request('userId');

        if (!$userId) {
            $this->user = Controller::getLoggedUser();
        } else if (Controller::isStaffLogged() || Controller::isCompanyAdminLogged()) {
            $this->setupForSomeUser($userId);
        } else {
            throw new RequestException(ERRORS::NO_PERMISSION);
        }

        $this->user->name = $newName;
        $this->user->store();

        Response::respondSuccess();
    }

    private function setupForSomeUser($userId)
    {
        $this->user = User::getUser($userId);

        if ($this->user->isNull()) {
            throw new RequestException(ERRORS::INVALID_USER);
        }

        $loggedUser = Controller::getLoggedUser();
        if (Controller::isCompanyAdminLogged() && ($this->user->company->id !== $loggedUser->company->id)) {
            throw new RequestException(ERRORS::NO_PERMISSION);
        }
    }

}
