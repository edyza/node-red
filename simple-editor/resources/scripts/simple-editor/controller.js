var ngApp;

(function () {
    ngApp.controller('SimpleEditorController', function ($scope, $element, $mdUtil, $mdSidenav, $mdDialog, $mdMedia) {
        SimpleEditorController = {};

        SimpleEditorController.workflows = {
            parts: {
                sources: [
                    {
                        name: 'CO² level',
                        icon: {text: 'CO²'},
                        id: 0,
                        payload: '',
                        logic: function (input, callback) {
                            callback(input);
                        },
                        input: [],
                        output: []
                    },
                    {
                        name: 'Light level',
                        icon: {icon: 'weather-sunny'},
                        id: 1,
                        payload: '',
                        logic: function (input, callback) {
                            callback(input);
                        },
                        input: [],
                        output: []
                    },
                    {
                        name: 'Soil moisture',
                        icon: {icon: 'water'},
                        id: 2,
                        payload: '',
                        logic: function (input, callback) {
                            callback(input);
                        },
                        input: [],
                        output: []
                    },
                    {
                        name: 'Fire alarm',
                        icon: {icon: 'fire'},
                        id: 8,
                        payload: '',
                        logic: function (input, callback) {
                            callback(input);
                        },
                        input: [],
                        output: []
                    },
                    {
                        name: 'New node',
                        icon: {icon: 'access-point'},
                        id: 10,
                        payload: '',
                        logic: function (input, callback) {
                            callback(input);
                        },
                        input: [],
                        output: []
                    },
                    {
                        name: 'Temperature',
                        icon: {icon: 'temperature-fahrenheit'},
                        id: 11,
                        payload: '',
                        logic: function (input, callback) {
                            callback(input);
                        },
                        input: [],
                        output: []
                    }
                ],
                logics: [
                    {
                        name: 'Comparison',
                        icon: {icon: 'equal'},
                        id: 3,
                        payload: '',
                        logic: function (input, callback) {
                            callback(input);
                        },
                        input: [],
                        output: []
                    },
                    {
                        name: 'JSONify',
                        icon: {icon: 'code-braces'},
                        id: 4,
                        payload: '',
                        logic: function (input, callback) {
                            callback(input);
                        },
                        input: [],
                        output: []
                    }
                ],
                endpoints: [
                    {
                        name: 'Amazon S3',
                        icon: {icon: 'amazon'},
                        id: 5,
                        payload: '',
                        logic: function (input, callback) {
                            callback(input);
                        },
                        input: [],
                        output: []
                    },
                    {
                        name: 'HelioSpektra Growlights',
                        icon: {icon: 'led-on'},
                        id: 6,
                        payload: '',
                        logic: function (input, callback) {
                            callback(input);
                        },
                        input: [],
                        output: []
                    },
                    {
                        name: 'Air Conditioning',
                        icon: {icon: 'air-conditioner'},
                        id: 7,
                        payload: '',
                        logic: function (input, callback) {
                            callback(input);
                        },
                        input: [],
                        output: []
                    },
                    {
                        name: 'SMS',
                        icon: {icon: 'message-text'},
                        id: 9,
                        payload: '',
                        logic: function (input, callback) {
                            callback(input);
                        },
                        input: [],
                        output: []
                    }
                ]
            },
            built: [
                {
                    name: 'New device found',
                    icon: {icon: 'access-point'},
                    id: 0,
                    type: 'workflow',
                    enabled: false,
                    source: 10,
                    logic: 4,
                    endpoint: 9
                },
                {
                    name: 'Actuate A/C',
                    icon: {icon: 'fan'},
                    id: 2,
                    type: 'workflow',
                    enabled: false,
                    source: 11,
                    logic: 3,
                    endpoint: 7
                },
                {
                    name: 'Export data',
                    icon: {icon: 'cloud-upload'},
                    id: 3,
                    type: 'workflow',
                    enabled: true,
                    source: 2,
                    logic: 4,
                    endpoint: 5
                },
                {
                    name: 'Actuate lights',
                    icon: {icon: 'led-on'},
                    id: 4,
                    type: 'workflow',
                    enabled: true,
                    source: 1,
                    logic: 3,
                    endpoint: 6
                },
                {
                    name: 'Amazon AWS',
                    icon: {icon: 'amazon'},
                    id: 5,
                    type: 'credentials',
                    data: {
                        accessKeyID: {
                            key: 'Access Key ID',
                            value: 'AKIAIOSFODNN7EXAMPLE'
                        },
                        secretAccessKey: {
                            key: 'Secret Access Key',
                            value: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
                        }
                    }
                }
            ],
            building: {

            },
            editing: 0,
            add: function (ev) {
                var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

                function DialogController ($scope, $mdDialog) {
                    $scope.workflows = SimpleEditorController.workflows;

                    $scope.assign = function (type, id) {
                        if (!$scope.workflows.building) {
                            $scope.workflows.building = {};
                        }
                        $scope.workflows.building[type] = id;
                    }

                    $scope.hide = function() {
                        $mdDialog.hide();
                    };
                    $scope.cancel = function() {
                        $mdDialog.cancel();
                    };
                    $scope.add = function(wf) {
                        $scope.workflows.building = undefined;
                        $mdDialog.hide(wf);
                    };
                }

                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'resources/parts/simple-editor/dialog-add-workflow.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: false,
                    fullscreen: useFullScreen
                }).then(function(wf) {
                    SimpleEditorController.workflows.built.push(wf);
                    SimpleEditorController.workflows.editing = SimpleEditorController.workflows.built.length - 1;
                });
                $scope.$watch(function() {
                        return $mdMedia('xs') || $mdMedia('sm');
                    }, function(wantsFullScreen) {
                        $scope.customFullscreen = (wantsFullScreen === true);
                    }
                );
            },
            saveCredentials: function (ev, credentials) {
                var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

                function DialogController ($scope, $mdDialog) {
                    $scope.credentials = credentials;
                    $scope.workflows = SimpleEditorController.workflows;

                    $scope.assign = function (type, id) {
                        if (!$scope.workflows.building) {
                            $scope.workflows.building = {};
                        }
                        $scope.workflows.building[type] = id;
                    }

                    $scope.hide = function() {
                        $mdDialog.hide();
                    };
                    $scope.cancel = function() {
                        $mdDialog.cancel();
                    };
                    $scope.add = function(wf) {
                        $scope.workflows.building = undefined;
                        $mdDialog.hide(wf);
                    };
                }

                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'resources/parts/simple-editor/dialog-credentials.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: false,
                    fullscreen: useFullScreen
                }).then(function(creds) {
                    // SimpleEditorController.workflows.built.push(creds);
                    // SimpleEditorController.workflows.editing = SimpleEditorController.workflows.built.length - 1;
                });
                $scope.$watch(function() {
                        return $mdMedia('xs') || $mdMedia('sm');
                    }, function(wantsFullScreen) {
                        $scope.customFullscreen = (wantsFullScreen === true);
                    }
                );
            }
        };

        SimpleEditorController.toggleNavDrawer = $mdUtil.debounce(function () {
            $mdSidenav('left').toggle();
        }, 200);

        if (!window.chrome) {
            $scope.toggleNavDrawer();
        }

        SimpleEditorController.lockSideNav = function () {
            return $mdMedia('gt-md');
        };

        return SimpleEditorController;
    });

    // ngApp.directive('workflowIcon', function () {
    //     return {
    //         restrict: 'E',
    //         scope: {rep: '=rep'},
    //         template: function (elem, attr) {
    //             return '<md-icon ng-if="rep.icon" md-svg-icon="{{rep.icon}}"></md-icon>' +
    //                 '<div ng-if="rep.text" style="width: 100%; height: 100%;">{{rep.text}}</div>' +
    //                 '<md-icon ng-if="!rep.icon && !req.text" md-svg-icon="{{rep}}"></md-icon>';
    //         }
    //     };
    // });

    ngApp.directive('workflowIcon', function ($compile) {
        return {
            restrict: 'E',
            scope: {rep: '=rep'},
            link: function (scope, element, attrs) {
                var html;
                if (scope.rep.icon) {
                    html = '<md-icon md-svg-icon="{{rep.icon}}"></md-icon>';
                } else if (scope.rep.text) {
                    html = '<md-icon><div style="width: 100%; height: 100%;">{{rep.text}}</div></md-icon>';
                } else {
                    html = '<md-icon md-svg-icon="{{rep}}"></md-icon>';
                }

                var e = $compile(html)(scope);
                element.replaceWith(e);
            }
        };
    });
})();
