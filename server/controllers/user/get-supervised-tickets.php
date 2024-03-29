<?php

use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /user/get-supervised-tickets Get supervised tickets
 * @apiVersion 4.8.0
 *
 * @apiName Get supervised tickets
 *
 * @apiGroup User
 *
 * @apiDescription This path retrieves own and user supervisated tickets.
 *
 * @apiPermission user
 *
 * @apiParam {id[]} supervisedUsers arrays of users Ids.
 * @apiParam {boolean} showOwnTickets boolean to show or not current logged user tickets.
 * @apiParam {Number} page The number of the page of the tickets.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_SUPERVISED_USERS
 *
 * @apiSuccess {Object} data Information about a tickets and quantity of pages.
 * @apiSuccess {[Ticket](#api-Data_Structures-ObjectTicket)[]} data.tickets Array of tickets assigned to the staff of the current page.
 * @apiSuccess {Number} data.page Number of current page.
 * @apiSuccess {Number} data.pages Quantity of pages.
 *
 */
class GetSupervisedTicketController extends Controller
{
    const PATH = '/get-supervised-tickets';
    const METHOD = 'POST';

    public function validations()
    {
        return [
            'permission' => 'user',
            'requestData' => [
                'supervisedUsers' => [
                    'validation' => DataValidator::oneOf(DataValidator::validUsersId(), DataValidator::nullType()),
                    'error' => ERRORS:: INVALID_SUPERVISED_USERS
                ],
                'page' => [
                    'validation' => DataValidator::oneOf(DataValidator::numeric()->positive(), DataValidator::nullType()),
                    'error' => ERRORS::INVALID_PAGE
                ]
            ]
        ];
    }

    private $authors;
    private $page;
    private $showOwnTickets;
    private $requestedUserIDsList;

    public function handler()
    {
        if (Controller::isStaffLogged()) throw new RequestException(ERRORS::NO_PERMISSION);

        $this->page = Controller::request('page') ? Controller::request('page') : 1;
        $this->showOwnTickets = (bool)Controller::request('showOwnTickets');
        $this->requestedUserIDsList = Controller::request('supervisedUsers') ? json_decode(Controller::request('supervisedUsers')) : [];
        $this->authors = $this->createAuthorsArray();

        if (!$this->canUserHandleSupervisedUsers()) {
            throw new Exception(ERRORS::INVALID_SUPERVISED_USERS);
        }

        $searchController = new SearchController();
        Controller::setDataRequester(function ($key) {
            switch ($key) {
                case 'authors':
                    return json_encode($this->authors);
                case 'page' :
                    return $this->page * 1;
                case 'supervisor':
                    return 1;
            }

            return null;
        });

        if (empty($this->authors)) {
            Response::respondSuccess([]);
        } else {
            $searchController->handler();
        }
    }

    public function canUserHandleSupervisedUsers()
    {

        if (!empty($this->requestedUserIDsList) && !Controller::isCompanyAdminLogged()) {
            return false;
        }

        $user = Controller::getLoggedUser();
        $supervisedUsers = User::getSupervisedUsers($user);

        if (!empty($this->requestedUserIDsList)) {
            foreach ($this->requestedUserIDsList as $reqUserId) {
                if (!$supervisedUsers->includesId($reqUserId) && $reqUserId != $user->id) {
                    return false;
                }
            }
        }
        return true;
    }

    public function createAuthorsArray()
    {
        $user = Controller::getLoggedUser();

        $authors = [];

        if (!empty($this->requestedUserIDsList)) {
            foreach (array_unique($this->requestedUserIDsList) as $reqUserId) {
                $authors[] = ['id' => $reqUserId, 'isStaff' => 0];
            }
        }

        if ($this->showOwnTickets && !in_array($user->id, $this->requestedUserIDsList, false)) {
            $authors[] = ['id' => $user->id * 1, 'isStaff' => 0];
        }
        return $authors;
    }
}
