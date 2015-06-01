define(['baseTestSetup', 'fixtures', 'confirmationServiceMock'], function(baseTestSetup, fixtures, ConfirmationServiceMock) {
    'use strict';
    describe('trackr.employee.controllers.expenseReport-edit', function() {
        var EditController, scope;
        baseTestSetup();
        beforeEach(inject(function($rootScope, $controller) {
            scope = $rootScope.$new();
            EditController = $controller('trackr.employee.controllers.expenseReport-edit', {
                $scope: scope,
                expenseTypes: fixtures['api/travelExpenses/types'],
                $stateParams: { id: 0 },
                'base.services.confirmation-dialog': ConfirmationServiceMock
            });
        }));

        beforeEach(inject(function($httpBackend) {
            $httpBackend.flush();
        }));

        it('must calculate the total cost of the report on load', function() {
            expect(scope.totalCost).toBeDefined();
        });

        it('editable must return true if status is PENDING', function() {
            expect(scope.editable({status: 'PENDING'})).toBe(true);
        });

        it('editable must return true if status is REJECTED', function() {
            expect(scope.editable({status: 'REJECTED'})).toBe(true);
        });

        it('editable must return false if status is APPROVED', function() {
            expect(scope.editable({status: 'APPROVED'})).toBe(false);
        });

        it('editable must return false if status is SUBMITTED', function() {
            expect(scope.editable({status: 'SUBMITTED'})).toBe(false);
        });

        it('must call a DELETE when an expense is removed and update the expenses and totalCost', inject(function($httpBackend) {
            var expensesBefore = scope.report.expenses.length;
            var totalCostBefore = scope.totalCost;
            scope.removeExpense(scope.report.expenses[0]);
            $httpBackend.expectDELETE('api/travelExpenses/' + scope.report.expenses[0].id);
            $httpBackend.flush();
            expect(scope.report.expenses.length).toBe(expensesBefore - 1);
            expect(scope.totalCost).toBeLessThan(totalCostBefore);
        }));

        it('must call submit on the server when submitting', inject(function($httpBackend) {
            scope.submitReport(scope.report);
            $httpBackend.expectPUT('api/travelExpenseReports/' + scope.report.id + '/submit');
            $httpBackend.flush();
        }));
    });
});