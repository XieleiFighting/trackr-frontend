define(['baseTestSetup'], function(baseTestSetup) {
    'use strict';
    describe('trackr.administration.employees.displayController', function () {
        var EditController, scope;
        baseTestSetup();
        beforeEach(inject(function($rootScope, $controller) {
            scope = $rootScope.$new();
            EditController = $controller('trackr.administration.employees.displayController', {
                $scope: scope,
                $stateParams: {
                    id: 0
                }
            });
        }));

        beforeEach(inject(function($httpBackend) {
            $httpBackend.flush();
        }));

        it('must have an employee in scope', function() {
            expect(scope.employee).toBeDefined();
        });

        it('must have the federal states in scope', function() {
            expect(scope.states).toBeDefined();
        });
    });
});