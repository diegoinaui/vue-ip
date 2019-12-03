import Vue from 'vue';
import VueIpCidr from './src/VueIpCidr.vue';

new Vue({
    el: '#app',
    components: {
        VueIpCidr
    },
    data() {
        return {
            ip: '',
            netmask: false,
            valid: null,
            theme: 'material'
        };
    },
    beforeMount() {

        // Random IP Address on load
        // this.changeIp()

    },
    methods: {

        /**
         * Generate random number
         */
        random(min = 1, max = 270) {
            return Math.floor(Math.random() * max) + min;
        },

        /**
         * Triggers on change
         */
        ipChange(ip, netmask, valid) {
            this.ip = ip;
            this.netmask = netmask;
            this.valid = valid;
        },

        /**
         * Trigger a random ip and port change
         */
        changeIp(netmask) {
            this.ip = this.random() + '.' + this.random() + '.' + this.random() + '.' + this.random();

            if(netmask)
                this.netmask = '' + this.random(1, 32);
            else
                this.netmask = false;
        },

        /**
         * Switch on an off material design
         */
        materialSwitch() {

            if(!this.theme)
                this.theme = 'material';
            else
                this.theme = false;

        },

        /**
         * Reset everything
         */
        reset() {

            this.ip = '';
            this.netmask = false;
            this.valid = null;
            this.theme = 'material'

        }

    }
});
