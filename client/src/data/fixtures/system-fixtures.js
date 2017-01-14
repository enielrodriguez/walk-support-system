module.exports = [
    {
        path: '/system/get-settings',
        time: 1000,
        response: function (params) {
            if(params && params.allSettings) {
                return {
                    status: 'success',
                    data: {
                        'language': 'en',
                        'reCaptchaKey': '6LfM5CYTAAAAAGLz6ctpf-hchX2_l0Ge-Bn-n8wS',
                        'reCaptchaPrivate': 'LALA',
                        'url': 'http://www.opensupports.com/support',
                        'title': 'Very Cool',
                        'layout': 'Boxed',
                        'time-zone': 3,
                        'no-reply-email': 'shitr@post.com',
                        'smtp-host': 'localhost',
                        'smtp-port': '7070',
                        'smtp-user': 'Wesa',
                        'maintenance-mode': false,
                        'allow-attachments': true,
                        'max-size': 500,
                        'departments': [
                            {id: 1, name: 'Sales Support', owners: 2},
                            {id: 2, name: 'Technical Issues', owners: 5},
                            {id: 3, name: 'System and Administration', owners: 0}
                        ],
                        'allowedLanguages': ['en', 'es', 'de', 'fr', 'pt', 'jp', 'ru', 'cn', 'in', 'tr'],
                        'supportedLanguages': ['en', 'es', 'de']
                    }
                };

            } else {
                return {
                    status: 'success',
                    data: {
                        'language': 'en',
                        'reCaptchaKey': '6LfM5CYTAAAAAGLz6ctpf-hchX2_l0Ge-Bn-n8wS',
                        'maintenance-mode': false,
                        'departments': [
                            {id: 1, name: 'Sales Support', owners: 2},
                            {id: 2, name: 'Technical Issues', owners: 5},
                            {id: 3, name: 'System and Administration', owners: 0}
                        ],
                        'allowedLanguages': ['en', 'es', 'de', 'fr', 'pt', 'jp', 'ru', 'cn', 'in', 'tr'],
                        'supportedLanguages': ['en', 'es', 'de']
                    }
                };
            }
        }
    },
    {
        path: '/system/edit-settings',
        time: 50,
        response: function() {
            return {
                status: 'success',
                data: {}
            }
        }
    },
    {
        path: '/system/add-department',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/system/edit-department',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/system/delete-department',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/system/edit-mail-template',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/system/recover-mail-template',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: {}
            };
        }
    },
    {
        path: '/system/get-mail-templates',
        time: 100,
        response: function () {
            return {
                status: 'success',
                data: [
                    {
                        type: 'USER_SINGUP',
                        language: 'en',
                        subject: 'Signup {{to}} - OpenSupports',
                        body : 'This is the user signup content {{name}}'
                    },
                    {
                        type: 'USER_SINGUP',
                        language: 'es',
                        subject: 'Registrado {{to}} - OpenSupports',
                        body : 'Este es el contenido de signup {{name}}'
                    },
                    {
                        type: 'USER_SINGUP',
                        language: 'de',
                        subject: 'Anmelden {{to}} - OpenSupports',
                        body : 'Dies ist der User Signup Content {{name}}'
                    },
                    {
                        type: 'USER_EDIT_PASSWORD',
                        language: 'en',
                        subject: 'Password changed {{to}} - OpenSupports',
                        body : 'Password has been edited {{name}}'
                    },
                    {
                        type: 'USER_EDIT_PASSWORD',
                        language: 'es',
                        subject: 'Password cambiado {{to}} - OpenSupports',
                        body : 'El password ha sido editado {{name}}'
                    },
                    {
                        type: 'USER_EDIT_PASSWORD',
                        language: 'de',
                        subject: 'Passwort geändert {{to}} - OpenSupports',
                        body : 'Passwort wurde bearbeitet {{name}}'
                    }
                ]
            };
        }
    },
    {
        path: '/system/get-stats',
        time: 200,
        response: function(_data) {
            let ID = {
                'WEEK': 7,
                'MONTH': 30,
                'QUARTER': 90,
                'YEAR': 365
            };

            let k = ID[_data.period];
            let DATA = [];

            for (let i = 0; i < k; i++) {
                DATA.push({
                    date: '201701' + (i + 10) % 100,
                    type: 'COMMENT',
                    general: 1,
                    value: (4 + i + Math.floor(Math.random() * 2)).toString()
                });
                DATA.push({
                    date: '201701' + (i + 10) % 100,
                    type: 'SIGNUP',
                    general: 1,
                    value: (9 + i + Math.floor(Math.random() * (i / 15))).toString()
                });
                DATA.push({
                    date: '201701' + (i + 10) % 100,
                    type: 'CLOSE',
                    general: 1,
                    value: (8 + i + Math.floor(Math.random() * i)).toString()
                });
                DATA.push({
                    date: '201701' + (i + 10) % 100,
                    type: 'CREATE_TICKET',
                    general: 1,
                    value: (10 + Math.floor(Math.random() * 4)).toString()
                });
            }

            console.log('DATA:');
            console.log(DATA);
            console.log(k);

            return {
                status: "success",
                data: DATA
                /*data: [
                    {
                        "date": "20170112",
                        "type": "COMMENT",
                        "general": "1",
                        "value": "8"
                    },
                    {
                        "date": "20170112",
                        "type": "SIGNUP",
                        "general": "1",
                        "value": "1"
                    },
                    {
                        "date": "20170112",
                        "type": "CLOSE",
                        "general": "1",
                        "value": "5"
                    },
                    {
                        "date": "20170112",
                        "type": "CREATE_TICKET",
                        "general": "1",
                        "value": "2"
                    },
                    {
                        "date": "20170111",
                        "type": "COMMENT",
                        "general": "1",
                        "value": "3"
                    },
                    {
                        "date": "20170111",
                        "type": "SIGNUP",
                        "general": "1",
                        "value": "8"
                    },
                    {
                        "date": "20170111",
                        "type": "CLOSE",
                        "general": "1",
                        "value": "10"
                    },
                    {
                        "date": "20170111",
                        "type": "CREATE_TICKET",
                        "general": "1",
                        "value": "3"
                    },
                    {
                        "date": "20170110",
                        "type": "COMMENT",
                        "general": "1",
                        "value": "3"
                    },
                    {
                        "date": "20170110",
                        "type": "SIGNUP",
                        "general": "1",
                        "value": "6"
                    },
                    {
                        "date": "20170110",
                        "type": "CLOSE",
                        "general": "1",
                        "value": "2"
                    },
                    {
                        "date": "20170110",
                        "type": "CREATE_TICKET",
                        "general": "1",
                        "value": "1"
                    },
                    {
                        "date": "20170109",
                        "type": "COMMENT",
                        "general": "1",
                        "value": "0"
                    },
                    {
                        "date": "20170109",
                        "type": "SIGNUP",
                        "general": "1",
                        "value": "7"
                    },
                    {
                        "date": "20170109",
                        "type": "CLOSE",
                        "general": "1",
                        "value": "4"
                    },
                    {
                        "date": "20170109",
                        "type": "CREATE_TICKET",
                        "general": "1",
                        "value": "9"
                    },
                    {
                        "date": "20170108",
                        "type": "COMMENT",
                        "general": "1",
                        "value": "8"
                    },
                    {
                        "date": "20170108",
                        "type": "SIGNUP",
                        "general": "1",
                        "value": "4"
                    },
                    {
                        "date": "20170108",
                        "type": "CLOSE",
                        "general": "1",
                        "value": "5"
                    },
                    {
                        "date": "20170108",
                        "type": "CREATE_TICKET",
                        "general": "1",
                        "value": "6"
                    },
                    {
                        "date": "20170107",
                        "type": "COMMENT",
                        "general": "1",
                        "value": "4"
                    },
                    {
                        "date": "20170107",
                        "type": "SIGNUP",
                        "general": "1",
                        "value": "1"
                    },
                    {
                        "date": "20170107",
                        "type": "CLOSE",
                        "general": "1",
                        "value": "0"
                    },
                    {
                        "date": "20170107",
                        "type": "CREATE_TICKET",
                        "general": "1",
                        "value": "2"
                    },
                    {
                        "date": "20170106",
                        "type": "COMMENT",
                        "general": "1",
                        "value": "7"
                    },
                    {
                        "date": "20170106",
                        "type": "SIGNUP",
                        "general": "1",
                        "value": "4"
                    },
                    {
                        "date": "20170106",
                        "type": "CLOSE",
                        "general": "1",
                        "value": "5"
                    },
                    {
                        "date": "20170106",
                        "type": "CREATE_TICKET",
                        "general": "1",
                        "value": "5"
                    }
                ]*/
            };
        }
    },
    {
        path: '/system/get-logs',
        time: 300,
        response: function() {
            return {
                "status": "success",
                "data": [
                    {
                        "type": "EDIT_SETTINGS",
                        "to": null,
                        "author": {
                            "name": "Emilia Clarke",
                            "id": "1",
                            "staff": true
                        }
                    },
                    {
                        "type": "SIGNUP",
                        "to": null,
                        "author": {
                            "name": "Steve Jobs",
                            "id": "1",
                            "staff": false
                        }
                    },
                    {
                        "type": "SIGNUP",
                        "to": null,
                        "author": {
                            "name": "steve jobs",
                            "id": "2",
                            "staff": false
                        }
                    },
                    {
                        "type": "SIGNUP",
                        "to": null,
                        "author": {
                            "name": "steve jobs",
                            "id": "3",
                            "staff": false
                        }
                    },
                    {
                        "type": "SIGNUP",
                        "to": null,
                        "author": {
                            "name": "Creator",
                            "id": "5",
                            "staff": false
                        }
                    },
                    {
                        "type": "CREATE_TICKET",
                        "to": "739228",
                        "author": {
                            "name": "Creator",
                            "id": "5",
                            "staff": false
                        }
                    },
                    {
                        "type": "CREATE_TICKET",
                        "to": "915839",
                        "author": {
                            "name": "Creator",
                            "id": "5",
                            "staff": false
                        }
                    },
                    {
                        "type": "CREATE_TICKET",
                        "to": "192450",
                        "author": {
                            "name": "Creator",
                            "id": "5",
                            "staff": false
                        }
                    },
                    {
                        "type": "CREATE_TICKET",
                        "to": "369061",
                        "author": {
                            "name": "Creator",
                            "id": "5",
                            "staff": false
                        }
                    },
                    {
                        "type": "SIGNUP",
                        "to": null,
                        "author": {
                            "name": "Commenter",
                            "id": "6",
                            "staff": false
                        }
                    }
                ]
            };
        }
    }
];
