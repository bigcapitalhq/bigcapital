import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import { ApplicationState } from '@/store/reducers';
import {
  getResourceColumns,
  getResourceMetadata,
  getResourceFieldsFactory,
  getResourceDataFactory,
} from '@/store/resources/resources.selectors';

interface OwnProps {
  resourceName: string;
}

export interface WithResourceDetailsProps {
  resourceData: ReturnType<ReturnType<typeof getResourceDataFactory>>;
  resourceFields: ReturnType<ReturnType<typeof getResourceFieldsFactory>>;
  resourceColumns: ReturnType<typeof getResourceColumns>;
  resourceMetadata: ReturnType<typeof getResourceMetadata>;
}

export const withResourceDetails = <Props extends OwnProps>(
  mapState?: MapState<WithResourceDetailsProps, Props>,
) => {
  const getResourceFields = getResourceFieldsFactory();
  const getResourceData = getResourceDataFactory();

  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const { resourceName } = props;

    const mapped: WithResourceDetailsProps = {
      resourceData: getResourceData(state, props),
      resourceFields: getResourceFields(state, props),
      resourceColumns: getResourceColumns(state, resourceName),
      resourceMetadata: getResourceMetadata(state, resourceName),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
