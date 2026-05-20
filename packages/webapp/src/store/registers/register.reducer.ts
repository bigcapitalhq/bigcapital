// @ts-nocheck
import { createReducer } from '@reduxjs/toolkit';
import { REGISTER_SET } from '@/store/types';;

const initialState = {
  registers: {},
};

export default createReducer(initialState, {
  [REGISTER_SET]: (state, action) => {
    const _registers = {};

    action.registers.forEach((register) => {
      _registers[register.id] = register;
    });
    state.registers = {
      ...state.registers,
      ..._registers,
    };
  },
});
