<?php

use Respect\Validation\Validator as DataValidator;
use RedBeanPHP\Facade as RedBean;

DataValidator::with('CustomValidations', true);

/**
 * @api {post} /system/delete-logs Delete logs
 * @apiVersion 4.8.0
 *
 * @apiName Delete logs
 *
 * @apiGroup Staff
 *
 * @apiDescription This path deletes the selected logs (by date range) and returns the last logs.
 *
 * @apiPermission staff3
 *
 * @apiParam {Array} dateRange
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_DATE_RANGE_FILTER
 *
 * @apiSuccess {[Log](#api-Data_Structures-ObjectLog)[]} data Array of last logs
 *
 */
class DeleteLogsController extends Controller
{
    const PATH = '/delete-logs';
    const METHOD = 'POST';

    public function validations()
    {
        return [
            'permission' => 'staff_3',
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
        $dateRange = json_decode(Controller::request('dateRange'));
        $startDate = $dateRange[0];
        $endDate = $dateRange[1];

        RedBean::exec("DELETE FROM log WHERE date >= $startDate and date <= $endDate");

        $logList = Log::find('ORDER BY id desc LIMIT 10');

        Response::respondSuccess($logList->toArray());
    }
}
