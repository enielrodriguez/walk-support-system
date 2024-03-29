<?php

use RedBeanPHP\Facade as RedBean;

abstract class Controller
{
    private static $dataRequester;

    /**
     * Instance-related stuff
     */
    abstract public function handler();

    abstract public function validations();

    public function getHandler()
    {
        return function () {
            try {
                if (RedBean::testConnection() && !Setting::isTableEmpty()) {
                    Session::getInstance()->setSessionPrefix(Setting::getSetting('session-prefix')->getValue());
                }
                $this->validate();
                $this->handler();
            } catch (\Exception $exception) {
                Response::respondError($exception->getMessage(), $exception);
                return;
            }
        };
    }

    public function validate()
    {
        $validator = new Validator();

        $validator->validate($this->validations());
    }

    public static function init()
    {
        self::$dataRequester = function ($key) {
            $app = self::getAppInstance();

            if (Controller::getAppInstance()->request()->isGet()) {
                $value = $app->request()->get($key);
            } else {
                $value = $app->request()->post($key);
            }

            return $value;
        };
    }

    public static function setDataRequester($dataRequester)
    {
        self::$dataRequester = $dataRequester;
    }

    public static function request($key, $secure = false)
    {
        $result = call_user_func(self::$dataRequester, $key);

        if ($key === 'email' || $key === 'newEmail') {
            return strtolower($result);
        }

        if ($secure) {
            $config = HTMLPurifier_Config::createDefault();
            $purifier = new HTMLPurifier($config);
            return $purifier->purify($result);
        }

        return $result;
    }

    public static function getLoggedUser()
    {
        $session = Session::getInstance();

        if ($session->isStaffLogged()) {
            return Staff::getUser($session->getUserId());
        }

        $user = User::getUser($session->getUserId());
        if ($session->getTicketNumber()) {
            $user->ticketNumber = $session->getTicketNumber();
        }

        return $user;
    }

    public static function isUserLogged()
    {
        $session = Session::getInstance();

        return $session->checkAuthentication(array(
            'userId' => Controller::request('csrf_userid'),
            'token' => Controller::request('csrf_token')
        ));
    }

    public static function isCompanyAdminLogged()
    {
        if (Controller::isUserLogged()) {
            $user = Controller::getLoggedUser();
            return !$user->isNull() && $user->company && $user->company->admin ? $user->company->admin->id === $user->id : false;
        }
        return false;
    }

    public static function isStaffLogged($level = 1)
    {
        return Controller::isUserLogged() && (Controller::getLoggedUser()->level >= $level);
    }

    public static function getAppInstance()
    {
        return \Slim\Slim::getInstance();
    }

    public function uploadImages($forceUpload = false)
    {
        $allowAttachments = Setting::getSetting('allow-attachments')->getValue();
        $totalImages = Controller::request('images') * 1;

        if (!$allowAttachments && !$forceUpload) return [];
        if (!$totalImages) return [];

        $maxSize = Setting::getSetting('max-size')->getValue();

        $fileUploader = FileUploader::getInstance();
        $fileUploader->setMaxSize($maxSize);

        $allImagesValidSize = true;

        for ($i = 0; $i < $totalImages; $i++) {
            $allImagesValidSize = $allImagesValidSize && $fileUploader->isSizeValid($_FILES["image_$i"]);
        }

        if (!$allImagesValidSize) throw new RequestException(ERRORS::INVALID_FILE);

        $imagePaths = [];
        $url = Setting::getSetting('url')->getValue();
        for ($i = 0; $i < $totalImages; $i++) {
            $fileUploader->upload("image_$i");
            $imagePaths[] = $url . '/api/system/download?file=' . $fileUploader->getFileName();
        }

        return $imagePaths;
    }

    public function uploadFile($forceUpload = false)
    {
        $allowAttachments = Setting::getSetting('allow-attachments')->getValue();

        if (!$allowAttachments && !$forceUpload) return '';
        if (!isset($_FILES['file'])) return '';

        $maxSize = Setting::getSetting('max-size')->getValue();

        $fileUploader = FileUploader::getInstance();
        $fileUploader->setMaxSize($maxSize);

        if ($fileUploader->upload('file')) {
            return $fileUploader;
        }

        throw new RequestException(ERRORS::INVALID_FILE);
    }

    public function replaceWithImagePaths($imagePaths, $content)
    {
        if (!is_array($imagePaths)) return $content;
        return str_replace(array_map(function ($index) {
            return "IMAGE_PATH_$index";
        }, array_keys($imagePaths)), $imagePaths, $content);
    }

    public static function isLoginMandatory()
    {
        return Setting::getSetting('mandatory-login')->getValue();
    }

    public static function getCustomFieldValues()
    {
        $customFields = Customfield::getAll();
        $customFieldValues = new DataStoreList();
        foreach ($customFields as $customField) {
            $value = Controller::request('customfield_' . str_replace(' ', '_', $customField->name));
            if ($value !== null) {
                $customFieldValue = new Customfieldvalue();
                $customFieldValue->setProperties([
                    'customfield' => $customField,
                ]);

                if ($customField->type === 'select') {
                    $ok = false;
                    foreach ($customField->ownCustomfieldoptionList as $option) {
                        if ($option->name === $value) {
                            $customFieldValue->setProperties([
                                'customfieldoption' => $option,
                                'value' => $option->name,
                            ]);
                            $ok = true;
                        }
                    }
                    if (!$ok)
                        throw new RequestException(ERRORS::INVALID_CUSTOM_FIELD_OPTION);
                } else {
                    $customFieldValue->setProperties([
                        'value' => $value,
                    ]);
                }

                $customFieldValues->add($customFieldValue);
            }
        }
        return $customFieldValues;
    }
}
