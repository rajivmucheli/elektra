import * as constants from '../../constants';

//########################## SHARES ##############################
const initialSharesState = {
  items: [],
  receivedAt: null,
  updatedAt: null,
  isFetching: false,
  hasNext: true,
  currentPage: 0
};

const requestShares=(state,{requestedAt})=>
  Object.assign({},state,{isFetching: true, requestedAt});

const requestSharesFailure=function(state,...rest){
  const obj = rest[0];
  return Object.assign({},state,{isFetching: false});
};

const receiveShares=(state,{shares,receivedAt})=>
  Object.assign({},state,{
    isFetching: false,
    items: (state.items.slice() || []).concat(shares),
    hasNext: shares.length>0,
    currentPage: (state.currentPage + 1),
    receivedAt
  })
;

const requestShare= function(state,{shareId,requestedAt}) {
  const index = state.items.findIndex((item) => item.id==shareId);
  if (index<0) { return state; }

  const newState = Object.assign(state);
  newState.items[index].isFetching = true;
  newState.items[index].requestedAt = requestedAt;
  return newState;
};

const requestShareFailure=function(state,{shareId}){
  const index = state.items.findIndex((item) => item.id==shareId);
  if (index<0) { return state; }

  const newState = Object.assign(state);
  newState.items[index].isFetching = false;
  return newState;
};

const receiveShare= function(state,{share}) {
  const index = state.items.findIndex((item) => item.id==share.id);
  const items = state.items.slice();
  // update or add
  if (index>=0) { items[index]=share; } else { items.unshift(share); }
  return Object.assign({},state,{items});
};

const requestDeleteShare= function(state,{shareId}) {
  const index = state.items.findIndex((item) => item.id==shareId);
  if (index<0) { return state; }

  const items = state.items.slice();
  items[index].isDeleting = true;
  return Object.assign({},state,{items});
};

const deleteShareFailure= function(state,{shareId}) {
  const index = state.items.findIndex((item) => item.id==shareId);
  if (index<0) { return state; }

  const items = state.items.slice();
  items[index].isDeleting = false;
  return Object.assign({},state,{items});
};

const deleteShareSuccess= function(state,{shareId}) {
  const index = state.items.findIndex((item) => item.id==shareId);
  if (index<0) { return state; }
  const items = state.items.slice();
  items.splice(index,1);
  return Object.assign({},state,{items});
};

const filterShares= (state,{term}) => {
  const items = state.items.slice();
  const regex = new RegExp(term.trim(), "i")

  for(let i of items) {
    if (`${i.name} ${i.id} ${i.share_proto} ${i.status}`.search(regex)>=0)
      i.isHidden=false
    else i.isHidden=true
  }
  return Object.assign({},state,{items});
}

const receiveShareExportLocations= function(state,{shareId,export_locations}){
  const index = state.items.findIndex((item) => item.id==shareId);
  if (index<0) { return state; }
  const items = state.items.slice();
  let item = Object.assign({},items[index])
  item.export_locations = export_locations;
  items[index] = item
  return Object.assign({},state,{items});
};

// shares reducer
export const shares = function(state, action) {
  if (state == null) { state = initialSharesState; }
  switch (action.type) {
    case constants.FILTER_SHARES: return filterShares(state,action);
    case constants.RECEIVE_SHARES: return receiveShares(state,action);
    case constants.REQUEST_SHARES: return requestShares(state,action);
    case constants.REQUEST_SHARES_FAILURE: return requestSharesFailure(state,action);
    case constants.REQUEST_SHARE: return requestShare(state,action);
    case constants.REQUEST_SHARE_FAILURE: return requestShareFailure(state,action);
    case constants.RECEIVE_SHARE: return receiveShare(state,action);
    case constants.REQUEST_DELETE_SHARE: return requestDeleteShare(state,action);
    case constants.DELETE_SHARE_FAILURE: return deleteShareFailure(state,action);
    case constants.DELETE_SHARE_SUCCESS: return deleteShareSuccess(state,action);
    case constants.REQUEST_SHARE_EXPORT_LOCATIONS: return state;
    case constants.RECEIVE_SHARE_EXPORT_LOCATIONS: return receiveShareExportLocations(state,action);

    default: return state;
  }
};