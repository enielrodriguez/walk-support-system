<?php

use Respect\Validation\Validator as DataValidator;

DataValidator::with('CustomValidations', true);

/**
 * @api {post} /staff/last-events Get last events
 * @apiVersion 4.8.0
 *
 * @apiName Get last events
 *
 * @apiGroup Staff
 *
 * @apiDescription This path retrieves the last events.
 *
 * @apiPermission staff1
 *
 * @apiParam {Number} page The page number.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_PAGE
 *
 * @apiSuccess {[TicketEvent](#api-Data_Structures-ObjectTicketevent)[]} data Array of last events
 *
 */
class LastEventsStaffController extends Controller
{
    const PATH = '/last-events';
    const METHOD = 'POST';

    public function validations()
    {
        return [
            'permission' => 'staff_1',
            'requestData' => [
                'page' => [
                    'validation' => DataValidator::numeric(),
                    'error' => ERRORS::INVALID_PAGE
                ],
                'dateRange' => [
                    'validation' => DataValidator::oneOf(DataValidator::validDateRange(), DataValidator::nullType()),
                    'error' => ERRORS::INVALID_DATE_RANGE_FILTER
                ]
            ]
        ];
    }

    public function handler()
    {
        $page = Controller::request('page');
        $dateRange = json_decode(Controller::request('dateRange'));

        $staff = Controller::getLoggedUser();

        if (Ticketevent::count() && !$staff->sharedTicketList->isEmpty()) {

            $query = ' (';
            foreach ($staff->sharedTicketList as $ticket) {
                $query .= 'ticket_id =' . $ticket->id . ' OR ';
            }
            $query = substr($query, 0, -3);

            if ($dateRange) {
                $query .= 'and date >= ? and date <= ? ';
                $params = [$dateRange[0], $dateRange[1], 10, 10 * ($page - 1)];
            } else {
                $params = [10, 10 * ($page - 1)];
            }

            $query .= ') ';
            $query .= 'ORDER BY id desc LIMIT ? OFFSET ?';

            $eventList = Ticketevent::find($query, $params);
            Response::respondSuccess($eventList->toArray());
        } else {
            Response::respondSuccess([]);
        }
    }
}
