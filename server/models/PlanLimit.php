<?php

/**
 * @api {OBJECT} PlanLimit PlanLimit
 * @apiVersion 4.8.0
 * @apiGroup Data Structures
 */
class PlanLimit extends DataStore
{
    const TABLE = 'planlimit';

    public static function getProps()
    {
        return [
            'users',
            'companies',
            'staff',
            'departments'
        ];
    }

    public function toArray()
    {
        return [
            'users' => (int)$this->users,
            'companies' => (int)$this->companies,
            'staff' => (int)$this->staff,
            'departments' => (int)$this->departments
        ];
    }
}
