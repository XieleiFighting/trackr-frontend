define(['baseTestSetup'], function(baseTestSetup) {
    'use strict';
    describe('reportr.controllers.project-hours', function() {
        var ProjectHoursController, scope;

        baseTestSetup();
        beforeEach(inject(function($rootScope, $controller) {
            scope = $rootScope.$new();
            ProjectHoursController = $controller('reportr.controllers.project-hours', {
                $scope: scope
            });
        }));

        beforeEach(inject(function($httpBackend) {
            // Flush initial load of work times and billable times
            $httpBackend.expectGET(/^api\/billableTimes\/search\/findByDateBetween\?end=\d+&projection=withProject&start=\d+/);
            $httpBackend.expectGET(/^api\/workTimes\/search\/findByDateBetween\?end=\d+&projection=withProject&start=\d+/);
            $httpBackend.flush();
        }));

        it('generate bar chart data', function() {
            var hoursArray = [ ['project1', 100, 90], ['project2', 200, 180] ];
            var barData = ProjectHoursController.calculateChartData(hoursArray);

            expect(barData.labels[0]).toEqual('project1');
            expect(barData.datasets[0].data).toEqual([90, 180]);
            expect(barData.labels[1]).toEqual('project2');
            expect(barData.datasets[1].data).toEqual([100, 200]);
        });

        it('project identifier', function() {
            var obj = { project: { name: 'project', identifier: 'identifier' }};
            var result = ProjectHoursController.projectIdentifier(obj);
            expect(result).toEqual('project (identifier)');
        });

        it('find billable time exists', function() {
            var billableTimeArray = [ ['project', 10]];
            var number = ProjectHoursController.findBillableTime(billableTimeArray, 'project');
            expect(number).toEqual(10);
        });

        it('find billable time does not exists', function() {
            var billableTimeArray = [ ['project', 10]];
            var number = ProjectHoursController.findBillableTime(billableTimeArray, 'doesntexist');
            expect(number).toEqual(0);
        });

        it('when a date is selected loadAllTimes must be triggered', function() {
            spyOn(ProjectHoursController, 'loadAllTimes');
            scope.dateSelected(new Date(), new Date());
            expect(ProjectHoursController.loadAllTimes).toHaveBeenCalled();
        });
    });
});