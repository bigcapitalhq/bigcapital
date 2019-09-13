import Vue from 'vue';
import SvgIcon from '@/components/SvgIcon';

// register globally
Vue.component('svg-icon', SvgIcon)

const req = require.context('../../static/icons', false, /\.svg$/);
const requireAll = requireContext => requireContext.keys().map(requireContext);
requireAll(req);
