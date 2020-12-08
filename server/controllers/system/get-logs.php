<?php

use Respect\Validation\Validator as DataValidator;

DataValidator::with('CustomValidations', true);

/**
 * @api {post} /system/get-logs Get logs
 * @apiVersion 4.8.0
 *
 * @apiName Get logs
 *
 * @apiGroup System
 *
 * @apiDescription This path retrieves all the logs.
 *
 * @apiPermission staff1
 *
 * @apiParam {Number} page The page of logs.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_PAGE
 *
 * @apiSuccess {[Log](#api-Data_Structures-ObjectLog)[]} data Array of last logs
 *
 */
class GetLogsController extends Controller
{
    const PATH = '/get-logs';
    const METHOD = 'POST';

    public function validations()
    {
        return [
            'permission' => 'staff_3',
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

        if ($dateRange) {
            $logList = Log::find(' WHERE date >= ? and date <= ? ORDER BY id desc LIMIT ? OFFSET ?', [
                $dateRange[0],
                $dateRange[1],
                10,
                10 * ($page - 1)
            ]);
        } else {
            $logList = Log::find('ORDER BY id desc LIMIT ? OFFSET ?', [10, 10 * ($page - 1)]);
        }

        Response::respondSuccess($logList->toArray());
    }
}
