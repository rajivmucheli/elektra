import * as constants from '../constants';
import { pluginAjaxHelper } from 'ajax_helper';
import { confirm } from 'lib/dialogs';
import { addNotice as showNotice, addError as showError } from 'lib/flashes';
import { ErrorsList } from 'lib/elektra-form/components/errors_list';

const ajaxHelper = pluginAjaxHelper('identity')

//################### OBJECTS #########################
const requestProjectRoleAssignments= (projectId) => (
  {
    type: constants.REQUEST_PROJECT_ROLE_ASSIGNMENTS,
    requestedAt: Date.now(),
    projectId
  }
);

const requestProjectRoleAssignmentsFailure= (projectId) => (
  {
    type: constants.REQUEST_PROJECT_ROLE_ASSIGNMENTS_FAILURE,
    projectId
  }
);

const receiveProjectRoleAssignments= (projectId, roles) => (
  {
    type: constants.RECEIVE_PROJECT_ROLE_ASSIGNMENTS,
    receivedAt: Date.now(),
    projectId,
    roles
  }
);

const receiveProjectMemberRoleAssignments= (projectId, memberType, memberId, roles) => (
  {
    type: constants.RECEIVE_PROJECT_MEMBER_ROLE_ASSIGNMENTS,
    projectId,
    memberType,
    memberId,
    roles
  }
);

const fetchProjectRoleAssignments = (projectId) =>
  (dispatch,getState) => {
    const projectRoleAssignments = getState()['role_assignments']['project_role_assignments']
    if (projectRoleAssignments && projectRoleAssignments[projectId] &&
        projectRoleAssignments[projectId].isFetching) return
    dispatch(requestProjectRoleAssignments(projectId));
    ajaxHelper.get(`/projects/${projectId}/role_assignments`).then( (response) => {
      dispatch(receiveProjectRoleAssignments(projectId, response.data.roles));
    })
    .catch( (error) => {
      dispatch(requestProjectRoleAssignmentsFailure());
      showError(`Could not load project role assignments (${error.message})`)
    });
  }
;

const updateProjectMemberRoleAssignments = (projectId, memberType, memberId, roles) =>
  (dispatch) => {
    const data = {roles}
    data[`${memberType}_id`] = memberId

    return new Promise((handleSuccess,handleErrors) =>
      ajaxHelper.put(`/projects/${projectId}/role_assignments`, data
      ).then((response) => {
        if(response.data.errors) handleErrors(response.data.errors)
        else {
          dispatch(receiveProjectMemberRoleAssignments(
            projectId, memberType, memberId, response.data.roles)
          )
          handleSuccess()
        }
      }).catch( error => handleErrors(error.message))
    )
  }

export {
  fetchProjectRoleAssignments,
  updateProjectMemberRoleAssignments
}