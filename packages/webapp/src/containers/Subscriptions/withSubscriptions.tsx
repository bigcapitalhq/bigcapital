// @ts-nocheck
import { connect } from 'react-redux';
import {
  isSubscriptionsInactiveFactory,
  isSubscriptionsActiveFactory,
} from '@/store/subscription/subscription.selectors';

export default (mapState) => {
  const isSubscriptionsInactive = isSubscriptionsInactiveFactory();
  const isSubscriptionsActive = isSubscriptionsActiveFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      isSubscriptionsInactive: isSubscriptionsInactive(state, props),
      isSubscriptionsActive: isSubscriptionsActive(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
