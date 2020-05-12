import { HashRouter, Route, Redirect } from 'react-router-dom';
import Loader from '../containers/loader';
import AccountList from '../containers/accounts/list';
import AccountCreateModal from '../containers/accounts/create';
import AccountMaintenanceModal from '../containers/accounts/maintenance';
import AccountSubleaseTokenModal from '../containers/accounts/sublease';
import RBACPoliciesEditModal from '../containers/rbac_policies/edit';
import ValidationRulesEditModal from '../containers/validation_rules/edit';
import RepositoryList from '../containers/repositories/list';
import ImageList from '../containers/images/list';

export default (props) => {
  const { projectId, canEdit, isAdmin, dockerInfo } = props;
  const rootProps = { projectID: projectId, canEdit, isAdmin, dockerInfo };

  return (
    <Loader>
      <HashRouter>
        <div>
          {/* entry point */}
          <Route exact path="/" render={() => <Redirect to="/accounts" />} />

          {/* account list */}
          <Route path="/accounts" render={(props) => <AccountList {...rootProps} />} />
          {/* modal dialogs that are reached from /accounts */}
          {isAdmin && <Route exact path="/accounts/new" render={(props) => <AccountCreateModal {...props} {...rootProps} /> } />}
          <Route exact path="/accounts/:account/access_policies" render={(props) => <RBACPoliciesEditModal {...props} {...rootProps} />} />
          <Route exact path="/accounts/:account/sublease" render={(props) => <AccountSubleaseTokenModal {...props} {...rootProps} />} />
          <Route exact path="/accounts/:account/toggle_maintenance" render={(props) => <AccountMaintenanceModal {...props} {...rootProps} />} />
          <Route exact path="/accounts/:account/validation_rules" render={(props) => <ValidationRulesEditModal {...props} {...rootProps} />} />

          {/* repository list within account */}
          <Route path="/account/:account" render={(props) => <RepositoryList {...props} {...rootProps} />} />

          {/* manifest list within repository */}
          <Route path="/repo/:account/:repo+" render={(props) => <ImageList {...props} {...rootProps} />} />
        </div>
      </HashRouter>
    </Loader>
  );
};
