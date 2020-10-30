<?php

use Respect\Validation\Validator as DataValidator;
use RedBeanPHP\Facade as RedBean;

/**
 * @api {post} /user/edit-supervised-list Edit user list
 * @apiVersion 4.8.0
 *
 * @apiName Edit user list
 *
 * @apiGroup User
 *
 * @apiDescription This path edits the user list of a user.
 *
 * @apiPermission staff1
 *
 * @apiParam {Number[]} userIdList The ids of the users.
 * @apiParam {Number} userId Id of the supervisor user.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_LIST
 * @apiUse INVALID_USER
 * @apiUse SUPERVISOR_CAN_NOT_SUPERVISE_HIMSELF
 *
 * @apiSuccess {Object} data Empty object
 *
 */
class EditSupervisedListController extends Controller
{
    const PATH = '/edit-supervised-list';
    const METHOD = 'POST';

    public function validations()
    {
        return [
            'permission' => 'staff_1',
            'requestData' => [
                'userIdList' => [
                    'validation' => DataValidator::validUsersId(),
                    'error' => ERRORS::INVALID_LIST
                ],
                'userId' => [
                    'validation' => DataValidator::dataStoreId('user'),
                    'error' => ERRORS::INVALID_USER
                ]
            ]
        ];
    }

    public function handler()
    {
        $desiredUserIdList = $this->getUserIdListCleared();
        $superUser = User::getDataStore(Controller::request('userId'));

        if (!$superUser->supervisedrelation) {
            $superUser->supervisedrelation = new Supervisedrelation();
        }

        $actualSupervisedUsers = $superUser->supervisedrelation->sharedUserList->toArray();

        foreach ($actualSupervisedUsers as $user) {
            if (!in_array($user['id'], $desiredUserIdList, false)) {
                $this->deleteUser($user['id']);
            }
        }

        $superUser->supervisedrelation->sharedUserList->clear();
        foreach ($desiredUserIdList as $userId) {
            $user = User::getDataStore($userId);

            if ($user->company->id !== $superUser->company->id) {
                $oldCompanyAdmin = $user->company->admin;
                if($oldCompanyAdmin){
                    $oldCompanyAdmin->supervisedrelation->sharedUserList->remove($user);
                    $oldCompanyAdmin->supervisedrelation->store();
                }

                $user->company = $superUser->company;
                $user->store();
            }

            $superUser->supervisedrelation->sharedUserList->add($user);

        }

        $superUser->supervisedrelation->store();
        $superUser->store();

        Response::respondSuccess();
    }

    public function getUserIdListCleared()
    {
        $clearedList = array_unique(json_decode(Controller::request('userIdList')));
        $superUser = User::getDataStore(Controller::request('userId'));

        foreach ($clearedList as $item) {
            if ($item == $superUser->id) {
                throw new Exception(ERRORS::SUPERVISOR_CAN_NOT_SUPERVISE_HIMSELF);
            }
        }

        return $clearedList;
    }

    private function deleteUser($userId)
    {
        $user = User::getUser($userId);

        Log::createLog('DELETE_USER', $user->name);
        RedBean::exec('DELETE FROM log WHERE author_user_id = ?', [$user->id]);

        foreach ($user->sharedTicketList as $ticket) {
            $ticket->delete();
        }

        $user->delete();
    }

}
