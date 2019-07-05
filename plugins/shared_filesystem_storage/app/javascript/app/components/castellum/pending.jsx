import { DataTable } from 'lib/components/datatable';
import { columns, CastellumOperation } from './operation';

export default class CastellumPendingOps extends React.Component {
  componentDidMount() {
    this.props.loadOpsOnce(this.props.projectID);
  }

  render() {
    const { errorMessage, isFetching, data } = this.props.operations;
    if (isFetching || data == null) {
      return <p><span className='spinner' /> Loading...</p>;
    }
    if (errorMessage) {
      return <p className='alert alert-danger'>Cannot load operations: {errorMessage}</p>;
    }

    const operations = data.pending_operations || [];
    return (
      <DataTable columns={columns} pageSize={8}>
        {operations.map(operation =>
          <CastellumOperation key={operation.asset_id} operation={operation} />
        )}
      </DataTable>
    );
  }
}
