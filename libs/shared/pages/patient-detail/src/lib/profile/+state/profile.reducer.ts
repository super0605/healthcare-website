import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as ProfileActions from './profile.actions';
import { ProfileEntity } from './profile.models';

export const PROFILE_FEATURE_KEY = 'Profile';

export interface State extends EntityState<ProfileEntity> {
  selectedId?: string | number; // which Profile record has been selected
  loaded: boolean; // has the Profile Profile been loaded
  error?: string | null; // last none error (if any)
  patient?: any;
}

export interface ProfilePartialState {
  readonly [PROFILE_FEATURE_KEY]: State;
}

export const ProfileAdapter: EntityAdapter<ProfileEntity> = createEntityAdapter<
  ProfileEntity
>();

export const initialState: State = ProfileAdapter.getInitialState({
  // set initial required properties
  loaded: false
});

const profileReducer = createReducer(
  initialState,

  on(ProfileActions.getCurrentPatientSuccess, (state, { Patient }) => ({
    ...state,
    patient: Patient
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return profileReducer(state, action);
}
