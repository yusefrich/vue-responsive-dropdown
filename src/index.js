import LearnVueButton from './components/LearnVueButton.vue';
import Vue2ResponsiveDropdown from './components/Vue2ResponsiveDropdown.vue';
import VueResponsiveDropdown from './components/VueResponsiveDropdown.vue';

export default {
    install: (app, options) => {
        app.component('LearnVueButton', LearnVueButton);
        app.component('Vue2ResponsiveDropdown', Vue2ResponsiveDropdown);
        app.component('VueResponsiveDropdown', VueResponsiveDropdown);
    }
};