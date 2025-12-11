import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppStore } from './store';

type AppDispatch = AppStore["dispatch"]
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;