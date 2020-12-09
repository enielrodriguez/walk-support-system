<?php

use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /user/edit-custom-fields Edit custom field values
 * @apiVersion 4.8.0
 *
 * @apiName Edit custom field values
 *
 * @apiGroup User
 *
 * @apiDescription This path is for editing the custom fields of a user.
 *
 * @apiPermission user
 *
 * @apiParam {Number} userId Optional. The user id whose custom fields are to be changed. This option is for staffs and company admins to manage other users.
 * @apiParam {String} customfield_<field name> Custom field values for this user.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_CUSTOM_FIELD_OPTION
 *
 * @apiSuccess {Object} data Empty object
 *
 */
class EditCustomFieldsController extends Controller
{
    const PATH = '/edit-custom-fields';
    const METHOD = 'POST';

    private $user;

    public function validations()
    {
        return [
            'permission' => 'user',
            'requestData' => []
        ];
    }

    public function handler()
    {
        $userId = Controller::request('userId');

        if (!$userId) {
            $this->user = Controller::getLoggedUser();
        } else if (Controller::isStaffLogged() || Controller::isCompanyAdminLogged()) {
            $this->setupForSomeUser($userId);
        } else {
            throw new RequestException(ERRORS::NO_PERMISSION);
        }

        $this->user->setProperties([
            'xownCustomfieldvalueList' => self::getCustomFieldValues()
        ]);

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
