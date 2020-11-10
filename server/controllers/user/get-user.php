<?php

use Respect\Validation\Validator as DataValidator;

DataValidator::with('CustomValidations', true);

/**
 * @api {post} /user/get-user Get user information
 * @apiVersion 4.8.0
 *
 * @apiName Get user information
 *
 * @apiGroup User
 *
 * @apiDescription This path retrieves information about a specific user.
 *
 * @apiPermission staff1
 *
 * @apiParam {String} userId The id of the user to find information of.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_USER
 *
 * @apiSuccess {Object} data Information about an user
 * @apiSuccess {String} data.name Name of the user
 * @apiSuccess {String} data.email Email of the user
 * @apiSuccess {Number} data.signupDate Date of signup of the user
 * @apiSuccess {[Ticket](#api-Data_Structures-ObjectTicket)[]} data.tickets Array of tickets of the user
 * @apiSuccess {Boolean} data.verified Indicates if the user is verified
 *
 */
class GetUserByIdController extends Controller
{
    const PATH = '/get-user';
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

        $user = User::getDataStore(Controller::request('userId'));
        $loggedUser = Controller::getLoggedUser();

        if (!Controller::isStaffLogged() && $loggedUser->company->id !== $user->company->id) {
            throw new RequestException(ERRORS::NO_PERMISSION);
        }

        $response = [
            'name' => $user->name,
            'email' => $user->email,
            'signupDate' => $user->signupDate,
            'verified' => !$user->verificationToken,
            'disabled' => !!$user->disabled,
            'customfields' => $user->xownCustomfieldvalueList->toArray()
        ];

        $tickets = new DataStoreList();

        if (Controller::isStaffLogged()) {
            $staff = Controller::getLoggedUser();
            $isCompanyAdmin = User::isCompanyAdmin($user);
            $response['company'] = $user->company->toArray(true);
            $response['isCompanyAdmin'] = $isCompanyAdmin;
            $response['userList'] = User::getSupervisedUsers($user)->toArray();

            // Add only the tickets sent to the departments to which the staff belongs.
            foreach ($user->sharedTicketList as $ticket) {
                if ($staff->sharedDepartmentList->includesId($ticket->department->id)) {
                    $tickets->add($ticket);
                }
            }

        } // Is company_admin, a regular user who manages a company, he can see all the tickets of his users
        else {
            $tickets = $user->sharedTicketList;
        }

        $response['tickets'] = $tickets->toArray(true);

        Response::respondSuccess($response);
    }
}
