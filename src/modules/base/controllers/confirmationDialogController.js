define([], function() {
    'use strict';
    return ['$scope', 'translationCode', '$uibModalInstance', function($scope, translationCode, $modalInstance) {
        $scope.translationCode = translationCode;

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };

        $scope.ok = function() {
            $modalInstance.close();
        };
    }];
});