<?php

use Respect\Validation\Validator as DataValidator;

DataValidator::with('CustomValidations', true);

/**
 * @api {post} /staff/delete-events Delete events
 * @apiVersion 4.8.0
 *
 * @apiName Delete events
 *
 * @apiGroup Staff
 *
 * @apiDescription This path deletes the selected events (by date range) and returns the last events.
 *
 * @apiPermission staff1
 *
 * @apiParam {Array} dateRange
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_DATE_RANGE_FILTER
 *
 * @apiSuccess {[TicketEvent](#api-Data_Structures-ObjectTicketevent)[]} data Array of last events
 *
 */
class DeleteEventsStaffController extends Controller
{
    const PATH = '/delete-events';
    const METHOD = 'POST';

    public function validations()
    {
        return [
            'permission' => 'staff_1',
            'requestData' => [
                'dateRange' => [
                    'validation' => DataValidator::validDateRange(),
                    'error' => ERRORS::INVALID_DATE_RANGE_FILTER
                ]
            ]
        ];
    }

    public function handler()
    {
        $staff = Controller::getLoggedUser();

        if (Ticketevent::count() && !$staff->sharedTicketList->isEmpty()) {
            $dateRange = json_decode(Controller::request('dateRange'));
            $params = [$dateRange[0], $dateRange[1]];

            $query = ' (';
            foreach ($staff->sharedTicketList as $ticket) {
                $query .= 'ticket_id =' . $ticket->id . ' OR ';
            }
            $query = substr($query, 0, -3);
            $query .= 'and date >= ? and date <= ? ';
            $query .= ') ';

            $eventList = Ticketevent::find($query, $params);

            foreach ($eventList as $event) {
                $event->delete();
            }

            Response::respondSuccess($this->getLastEvents($staff));
        } else {
            Response::respondSuccess([]);
        }
    }

    private function getLastEvents($staff)
    {
        if (Ticketevent::count() && !$staff->sharedTicketList->isEmpty()) {

            $query = ' (';
            foreach ($staff->sharedTicketList as $ticket) {
                $query .= 'ticket_id =' . $ticket->id . ' OR ';
            }
            $query = substr($query, 0, -3);

            $query .= ') ';
            $query .= 'ORDER BY id desc LIMIT 10';

            $eventList = Ticketevent::find($query);

            return $eventList->toArray();
        }

        return [];
    }
}
