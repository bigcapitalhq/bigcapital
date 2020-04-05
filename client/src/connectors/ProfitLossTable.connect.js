import {connect} from 'react-redux';

export const mapStateToProps = (state, props) => {
  const sheetIndex = props.profitLossSheetIndex;
  
  return {
    profitLossTableRows: props.getProfitLossTableRows(sheetIndex),
    profitLossColumns: props.getProfitLossColumns(sheetIndex),
    profitLossQuery: props.getProfitLossQuery(sheetIndex),
  };
};

export const mapDispatchToProps = (dispatch) => ({
  
});

export default connect(mapStateToProps, mapDispatchToProps);