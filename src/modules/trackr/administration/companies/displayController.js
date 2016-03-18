define(['lodash'], function(_) {
    'use strict';
    return ['$stateParams', '$scope', 'Restangular', '$state', 'base.services.confirmation-dialog', 'shared.services.create-or-update-modal',
        function($stateParams, $scope, Restangular, $state, confirmationDialogService, createOrUpdateModalService) {
            var controller = this;

            /**
             * Opens a modal dialog to save a new contact person. Pushes the new contact person into the array after it has been saved.
             */
            $scope.createNewContactPerson = function(company) {
                var $modalInstance = createOrUpdateModalService
                    .showModal('trackr.administration.controllers.companies.contactPersons.new-or-edit',
                    'src/modules/trackr/administration/companies/contactPersons/newOrEdit.tpl.html',
                    'CONTACTPERSON.CREATE_NEW', { companyHref: company._links.self.href});
                $modalInstance.result.then(function(contactPerson) {
                    company.contactPersons.push(contactPerson);
                });
            };

            /**
             * Opens a modal to edit the contact person and replaces the contact person in the array with the edited version on success.
             * @param contactPerson The contact person to edit.
             * @param company The company the contact person belongs to.
             */
            $scope.editContactPerson = function(contactPerson, company) {
                var $modalInstance = createOrUpdateModalService
                    .showModal('trackr.administration.controllers.companies.contactPersons.new-or-edit',
                    'src/modules/trackr/administration/companies/contactPersons/newOrEdit.tpl.html',
                    'ACTIONS.EDIT', { contactPerson: contactPerson});
                $modalInstance.result.then(function(contactPerson) {
                    var index = _.findIndex($scope.company.contactPersons, {id: contactPerson.id});
                    company.contactPersons[index] = contactPerson;
                });
            };

            /**
             * Delete a contact person from this company by issuing a DELETE to the API
             * @param contactPerson The contact person to delete
             */
            $scope.removeContactPerson = function(contactPerson) {
                function deleteContactPerson() {
                    /*
                     We cant use the contactPerson object directly because it is tied to the company.
                     Restangular would execute DELETE '/api/companies/0/contactPersons/0' which is not what we want
                     */
                    Restangular.one('contactPersons', contactPerson.id).remove().then(function() {
                        _.remove($scope.company.contactPersons, {id: contactPerson.id});
                    });
                }

                confirmationDialogService.openConfirmationDialog('ACTIONS.REALLY_DELETE').result.then(deleteContactPerson);
            };

            /**
             * Opens a modal dialog to edit the company. Changes the state when the company id has been changed.
             */
            $scope.showEditForm = function() {
                var modalInstance = createOrUpdateModalService
                    .showModal('trackr.administration.controllers.companies.edit', 'src/modules/trackr/administration/companies/newOrEdit.tpl.html', 'ACTIONS.EDIT', $scope.company);
                modalInstance.result.then(function(company) {
                    var oldCompanyId = $scope.company.companyId;
                    $scope.company = company;
                    if (oldCompanyId !== company.companyId) {
                        controller.companyIdChanged();
                    }
                });
            };

            /**
             * Callback for when the companyId has been changed since it is part of the URL. Calls the parent controller (the list controller) to update
             * the company id in it as well so the link works correct. Reloads the state with the new companyId.
             */
            controller.companyIdChanged = function() {
                //Change the company id in the list in the parent controller
                var companyInList = _.find($scope.$parent.companies, {id: $scope.company.id});
                companyInList.companyId = $scope.company.companyId;
                //reload so the url is correct
                $state.go('app.trackr.administration.companies.edit', {id: $scope.company.companyId});
            };

            /*
             Initialization of $scope objects
             */
            Restangular.oneUrl('companies', 'api/companies/search/findByCompanyId').get({
                companyId: $stateParams.id,
                projection: 'withAddressAndContactPersons'
            }).then(function(company) {
                $scope.company = company;
            });
        }];
});