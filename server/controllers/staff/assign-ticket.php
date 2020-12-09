<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /staff/assign-ticket Assign ticket
 * @apiVersion 4.8.0
 *
 * @apiName Assign ticket
 *
 * @apiGroup Staff
 *
 * @apiDescription This path assigns a ticket to a staff member.
 *
 * @apiPermission staff1
 *
 * @apiParam {Number} ticketNumber The number of the ticket to assign.
 * @apiParam {Number} staffId The id of the staff.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_TICKET
 * @apiUse TICKET_ALREADY_ASSIGNED
 * @apiUse INVALID_DEPARTMENT
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class AssignStaffController extends Controller {
    const PATH = '/assign-ticket';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_1',
            'requestData' => [
                'ticketNumber' => [
                    'validation' => DataValidator::validTicketNumber(),
                    'error' => ERRORS::INVALID_TICKET
                ]
            ]
        ];
    }

    public function handler() {
        $ticketNumber = Controller::request('ticketNumber');
        $staffId = Controller::request('staffId');
        $ticket = Ticket::getByTicketNumber($ticketNumber);
        $user = Controller::getLoggedUser();

        if($staffId) {
            $staffToAssign = Staff::getDataStore($staffId, 'id');

            if($staffToAssign->isNull()) {
                throw new RequestException(ERRORS::INVALID_STAFF);
            }

            if(!$staffToAssign->sharedDepartmentList->includesId($ticket->department->id)) {
                throw new RequestException(ERRORS::INVALID_DEPARTMENT);
            }
        } else {
            $staffToAssign = Controller::getLoggedUser();
        }

        if($ticket->owner) {
            throw new RequestException(ERRORS::TICKET_ALREADY_ASSIGNED);
        }

        if(!$user->canManageTicket($ticket)) {
            throw new RequestException(ERRORS::NO_PERMISSION);
        }

        $staffToAssign->sharedTicketList->add($ticket);
        $ticket->owner = $staffToAssign;
        $ticket->unread = !$ticket->isAuthor($staffToAssign);
        $event = Ticketevent::getEvent(Ticketevent::ASSIGN);
        $event->setProperties(array(
            'authorStaff' => Controller::getLoggedUser(),
            'date' => Date::getCurrentDate(),
            'content' => $staffToAssign->name,
        ));
        $ticket->addEvent($event);

        $ticket->store();
        $staffToAssign->store();

        Response::respondSuccess();

    }

}
