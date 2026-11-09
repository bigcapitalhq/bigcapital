import type { ApplicationState } from '@/store/reducers';

export type MapState<MappedProps, OwnProps = unknown, Mapped = MappedProps> = (
  mapped: MappedProps,
  state: ApplicationState,
  ownProps: OwnProps,
) => Mapped;
