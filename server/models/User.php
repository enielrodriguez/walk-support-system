<?php

use RedBeanPHP\Facade as RedBean;

/**
 * @api {OBJECT} User User
 * @apiVersion 4.8.0
 * @apiGroup Data Structures
 * @apiParam {String} email The email of the user.
 * @apiParam {Number} id The id of the user.
 * @apiParam {String} name The name of the user.
 * @apiParam {Boolean} verified Indicates if the user has verified the email.
 * @apiParam {Boolean} notRegistered Indicates if the user had logged at least one time.
 * @apiParam {Object} company Company to which the user belongs.
 * @apiParam {Boolean} is_company_admin Determines if a user is a company administrator.
 * @apiParam {[CustomField](#api-Data_Structures-ObjectCustomfield)[]} customfields Indicates the values for custom fields.
 */
class User extends DataStore
{
    const TABLE = 'user';
    public $ticketNumber = null;

    public static function authenticate($userEmail, $userPassword)
    {
        $user = self::getUser($userEmail, 'email');

        return ($user && Hashing::verifyPassword($userPassword, $user->password) && !$user->notRegistered) ? $user : new NullDataStore();
    }

    public static function getProps()
    {
        return [
            'email',
            'password',
            'name',
            'signupDate',
            'tickets',
            'sharedTicketList',
            'verificationToken',
            'disabled',
            'xownCustomfieldvalueList',
            'notRegistered',
            'sharedUserList',
            'company'
        ];
    }

    public static function getUser($value, $property = 'id')
    {
        return parent::getDataStore($value, $property);
    }

    public static function isCompanyAdmin($user): bool
    {
        return $user->company->admin && $user->id === $user->company->admin->id;
    }

    public static function getSupervisedUsers($user)
    {
        return self::isCompanyAdmin($user) ?
            User::find(' company_id = :companyId AND id != :userId ', [
                ':companyId' => $user->company->id,
                ':userId' => $user->id
            ])
            : new DataStoreList();
    }

    public function canManageTicket(Ticket $ticket)
    {
        $ticketNumberInstanceValidation = true;
        $ticketOfSupervisedUser = false;

        if ($this->ticketNumber) {
            $ticketNumberInstanceValidation = $this->ticketNumber == $ticket->ticketNumber;
        }

        $userList = self::getSupervisedUsers($this);

        foreach ($userList as $usr) {
            if ($ticket->isAuthor($usr)) $ticketOfSupervisedUser = true;
        }

        return (($ticket->isAuthor($this) || $ticketOfSupervisedUser) && $ticketNumberInstanceValidation);
    }

    public function toArray($minimal = false)
    {
        if ($minimal) {
            return [
                'id' => $this->id,
                'name' => $this->name,
                'email' => $this->email,
                'isStaff' => 0,
                'company' => $this->company->toArray(true)
            ];
        }

        return [
            'email' => $this->email,
            'id' => $this->id,
            'name' => $this->name,
            'verified' => !$this->verificationToken,
            'disabled' => $this->disabled,
            'customfields' => $this->xownCustomfieldvalueList->toArray(),
            'notRegistered' => $this->notRegistered,
            'tickets' => $this->tickets,
            'company' => $this->company->toArray(true)
        ];
    }
}
