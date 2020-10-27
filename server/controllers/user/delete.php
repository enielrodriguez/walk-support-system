<?php

use Respect\Validation\Validator as DataValidator;
use RedBeanPHP\Facade as RedBean;

/**
 * @api {post} /user/delete Delete user
 * @apiVersion 4.8.0
 *
 * @apiName Delete user
 *
 * @apiGroup User
 *
 * @apiDescription This path receives an user id and deletes the user.
 *
 * @apiPermission staff1
 *
 * @apiParam {Number} userId The id of the user to delete.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_USER
 *
 * @apiSuccess {Object} data Empty object
 *
 */

DataValidator::with('CustomValidations', true);

class DeleteUserController extends Controller
{
    const PATH = '/delete';
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

        if (Controller::isCompanyAdminLogged() && $loggedUser->company->id !== $user->company->id) {
            throw new ValidationException(ERRORS::NO_PERMISSION);
        }

        Log::createLog('DELETE_USER', $user->name);
        RedBean::exec('DELETE FROM log WHERE author_user_id = ?', [$user->id]);

        foreach ($user->sharedTicketList as $ticket) {
            $ticket->delete();
        }

        $user->delete();

        Response::respondSuccess();
    }
}
