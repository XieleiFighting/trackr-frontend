define(['baseTestSetup'], function(baseTestSetup) {
    'use strict';
    describe('reportr.controllers.revenue', function() {
        var RevenueController, scope;

        baseTestSetup();
        beforeEach(inject(function($rootScope, $controller) {
            scope = $rootScope.$new();
            RevenueController = $controller('reportr.controllers.revenue', {
                $scope: scope
            });
        }));

        beforeEach(inject(function($httpBackend) {
            // Flush initial load of invoices
            $httpBackend.expectGET(/^api\/invoices\/search\/findByCreationDateBetween\?end=\d+&projection=withDebitor&start=\d+/);
            $httpBackend.flush();
        }));

        it('generate pie chart data', function() {
            var invoicesArray = [ ['project1', 400], ['project2', 500] ];
            var pieData = RevenueController.generatePieData(invoicesArray);
            expect(pieData[0].label).toEqual('project1');
            expect(pieData[0].value).toEqual('400.00');
            expect(pieData[1].label).toEqual('project2');
            expect(pieData[1].value).toEqual('500.00');
        });

        it('when a date is selected loadInvoices must be triggered', function() {
            spyOn(RevenueController, 'loadInvoices');
            scope.dateSelected(new Date(), new Date());
            expect(RevenueController.loadInvoices).toHaveBeenCalled();
        });
    });
});