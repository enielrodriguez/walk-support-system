<?php

use RedBeanPHP\Facade as RedBean;

/**
 * @api {OBJECT} Company Company
 * @apiVersion 4.8.0
 * @apiGroup Data Structures
 * @apiParam {String} nit NIT of the company.
 * @apiParam {String} business_name Name of the company.
 * @apiParam {String} phone Phone of the company.
 * @apiParam {String} contact_name Name of the person to contact in the company.
 */
class Company extends DataStore
{
    const TABLE = 'company';

    public static function getProps()
    {
        return [
            'nit',
            'business_name',
            'phone',
            'contact_name'
        ];
    }

    public function toArray($minimized = false)
    {
        if ($minimized) {
            return [
                'business_name' => $this->business_name
            ];
        }

        return [
            'id' => $this->id,
            'nit' => $this->nit,
            'business_name' => $this->business_name,
            'phone' => $this->phone,
            'contact_name' => $this->contact_name
        ];
    }
}
