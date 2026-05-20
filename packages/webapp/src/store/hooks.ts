import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState } from './reducers';
import type { AppDispatch } from './create-store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
