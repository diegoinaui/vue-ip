<template lang="pug">
    span.vue-ip(:class="{'show-netmask' : netmaskCopy !== false, 'material-theme': theme === 'material', 'active': active, 'valid': valid}")
        .label
            slot
        .segment(v-for="(segment, index) in ipCopy")
            input(type="number", v-model="ipCopy[index]", :placeholder="placeholderPos(index)", maxlength="3", @paste="paste($event)", @keydown="ipKeydown($event, index)", @focus="ipFocus(index)", @blur="blur", ref="ipSegment")
        input(type="number", v-show="netmaskCopy !== false", v-model="netmaskCopy", :placeholder="((placeholder) ? '32' : '')", maxlength="2", @paste="paste($event)", @focus="netmaskFocus", @keydown="netmaskKeydown", @blur="blur", ref="netmaskSegment").netmask
</template>

<style lang="stylus" scoped>
    $ip-material-valid := #409EFF
    $ip-material-in-valid := #f25d59

    $ip-material-color := #e0e0e0
    $ip-material-color-mute := rgba(250,250,250,0.6);
    $ip-material-fontSize := inherit

    $ip-transition-speed := .15s

    .vue-ip
        position relative
        display inline-block
        text-align left

        &.material-theme
            transition all $ip-transition-speed ease-in-out
            border-bottom 1px solid $ip-material-color-mute
            padding 6px

            .label
                display block
                transition all $ip-transition-speed ease-in-out
                position absolute
                width 100%
                font-size .6rem
                top -20px
                color $ip-material-color-mute

            .segment
                &:after
                    color $ip-material-color

            &.active
                &.valid
                    &.material-theme
                        border-bottom-color $ip-material-valid

                        .segment
                            &:after
                                color $ip-material-valid

                        .label
                            color $ip-material-valid

                &:not(.valid)
                    &.material-theme
                        border-bottom-color $ip-material-in-valid

                        .segment
                            &:after
                                color $ip-material-in-valid

                        .label
                            color $ip-material-in-valid

            input
                background transparent
                font-size $ip-material-fontSize
                color $ip-material-color

                // Hide spinner on MOZ
                -moz-appearance: textfield

                &::-webkit-outer-spin-button, &::-webkit-inner-spin-button
                    -webkit-appearance none
                // Hide spinner on chrome

                &::placeholder
                    color rgba($ip-material-color, .3)

        .label
            display none

        &.show-netmask
            .segment
                &:last-of-type
                    &:after
                        content '/'

        .segment
            display inline-block

            &:not(:last-of-type)
                &:after
                    content '.'
                    display inline-block

        input
            text-align center
            width 40px
            outline none
            border none

            &.netmask
                width 60px

</style>

<script>
    export default {
        props: {
            onChange: Function,
            ip: {
                required: true,
                type: String
            },
            netmask: {
                type: [String, Number, Boolean],
                default: false
            },
            placeholder: {
                type: [Boolean],
                default: false
            },
            theme: {
                type: [String, Boolean],
                default: false
            }
        },
        data() {
            return {
                ipCopy: ['', '', '', ''],
                netmaskCopy: null,
                valid: false,
                active: false
            }
        },
        beforeMount() {

            // Copy the values over
            this.copyValue(this.ip, this.netmask);

        },
        watch: {

            /**
             * Watch the IP prop for changes and update internally
             */
            ip(newIp) {
                this.copyValue(newIp, this.netmask);
            },

            /**
             * Watch the netmask for changes and update internally
             */
            netmask(newNetmask) {
                this.copyValue(this.ip, newNetmask);
            }

        },
        methods: {

            /**
             * Placeholder with dummy IP
             */
            placeholderPos(segment) {

                // No placeholder
                if (!this.placeholder)
                    return '';

                // Dummy IP placeholder
                switch (segment) {
                    case 0:
                        return '192';
                    case 1:
                        return '168';
                    case 2:
                        return '0';
                    case 3:
                        return '1';
                }

            },

            /**
             * On focus clear the current box
             */
            ipFocus(index) {

                this.active = true;

                // Clear it
                this.ipCopy[index] = '';

                // Update the change
                this.changed();

            },

            /**
             * Clear both inputs
             */
            clearAll() {
                this.ipCopy = ['', '', '', ''];
                this.netmaskCopy = null;
                this.valid = false;
            },

            /**
             * Clicked off the IP or netmask
             */
            blur() {

                this.active = false;

            },

            /**
             * Focus on the netmask
             */
            netmaskFocus() {

                this.active = true;

                // Clear it
                this.netmaskCopy = null;

                // Update the change
                this.changed();

            },

            /**
             * Paste in an IP (with or without a netmask)
             */
            paste(event) {

                // Focus on first el
                this.$refs.ipSegment[0].focus();

                // Get clipboard text
                let pasteText = event.clipboardData.getData('text/plain');

                // Check if we have a netmask or not
                let netmaskPos = pasteText.indexOf('/');

                // If we have netmasks turned off, remove the netmask and only update the IP value
                if (this.netmask === false) {

                    console.warn('A IP address with a netmask has been entered but this module has no netmask attribute. Please enable it update the netmask.');

                    this.clearAll();

                    let ipAndNetmask = pasteText.split("/");
                    this.copyValue(ipAndNetmask[0], false);

                    // Blur off input
                    this.$refs.ipSegment[0].blur();

                    return;
                }

                // Based on if we have a netmask or not
                switch (netmaskPos) {
                    case -1:
                        this.copyValue(pasteText, null);
                        this.changed();

                        // Blur off input
                        this.$refs.ipSegment[0].blur();

                        break;
                    default:
                        let ipAndNetmask = pasteText.split("/");
                        this.copyValue(ipAndNetmask[0], ipAndNetmask[1]);
                        this.changed();

                        // Blur off input
                        this.$refs.ipSegment[0].blur();

                        break
                }

            },

            /**
             * Netmask keydown event
             */
            netmaskKeydown() {

                let keyCode = event.keyCode || event.which;

                // Return or left on keypad
                if (keyCode === 8 || keyCode === 37) {

                    // If there is nothing within the selected input go back to the last IP segment
                    if (this.netmaskCopy && this.netmaskCopy.length === 0 && this.netmaskCopy !== undefined)
                        this.$refs.ipSegment[3].focus();

                }

                setTimeout(this.changed);

            },

            /**
             * Run on keydown
             */
            ipKeydown(event, index) {

                let keyCode = event.keyCode || event.which;

                // Return or left on keypad
                if (keyCode === 8 || keyCode === 37) {

                    // If there is nothing within the selected input go the the one before it
                    if (this.ipCopy[index].length === 0 && this.ipCopy[index - 1] !== undefined)
                        this.$refs.ipSegment[index - 1].focus();

                }

                // Semi-colon (jump to netmask number)
                else if (keyCode === 186)
                    this.$refs.netmaskSegment.focus();

                setTimeout(() => {

                    // If its a 0 then always move to the next segment, if not work out if we need to move first
                    if (this.ipCopy[index] === '0')
                        this.moveToNextIpSegment(index, false);
                    else
                        this.moveToNextIpSegment(index);

                    // Update the change
                    this.changed();

                });
            },

            /**
             * Work out if we need to move to the next IP segment or not
             */
            moveToNextIpSegment(index, ifOverThree = true) {

                /**
                 * If there is 3 characters check if there is another segment, if there is focus on it.
                 */
                if (ifOverThree) {

                    if (this.ipCopy[index].length >= 3 && this.ipCopy[index + 1] !== undefined)
                        this.$refs.ipSegment[index + 1].focus();
                    else if (this.ipCopy[index].length >= 3 && this.ipCopy[index + 1] === undefined)
                        this.$refs.netmaskSegment.focus();

                } else if (!ifOverThree) {

                    if (this.ipCopy[index + 1] !== undefined)
                        this.$refs.ipSegment[index + 1].focus();
                    else if (this.ipCopy[index + 1] === undefined)
                        this.$refs.netmaskSegment.focus();

                }

            },

            /**
             * Update the controller with changed IP and netmask addresses
             */
            changed(ip = this.ipCopy, netmask = this.netmaskCopy) {
                let ipLocal = this.arrayToIp(ip);
                let netmaskLocal = parseInt(netmask);
                this.onChange(ipLocal, validateNetmask(netmaskLocal), this.validateIP(ip));
            },

            /**
             * Copy prop into local copy
             */
            copyValue(ip, netmask) {

                if (ip)
                    this.ipToArray(ip);

                if (parseInt(netmask) > 32)
                    netmask= 32;

                if (parseInt(netmask) < 0)
                    netmask= 0;

                // Update the netmask as long as its a number
                this.netmaskCopy = netmask;

                // Update if its valid locally
                this.valid = this.validateIP(this.ipCopy);

                // Report right back with if its valid or not
                this.changed();

            },

            /**
             * Convert the IP address string to an array of values
             */
            ipToArray(ip) {

                let segments = [];
                ip.split('.').map(segment => {
                    if (isNaN(segment) || segment < 0 || segment > 255)
                        segment = 255;
                    segments.push(segment);
                });

                // If something is not valid clear it all
                if (segments.length !== 4) {
                    console.error('Not valid, so clearing ip', segments);
                    this.clearAll();
                } else
                    this.ipCopy = segments;

            },

            /**
             * Convert the array of IP segments back to a string
             */
            arrayToIp(ipArray) {
                return ipArray.join(".");
            },

            /**
             * validates the IP address
             *
             * @returns Boolean
             */
            validateIP(ip) {
                let ipCheck = this.arrayToIp(ip);
                return (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipCheck))
            },

            /**
             * validates the Netmask address
             *
             * @returns Boolean
             */
            validateNetmask(netmask) {
                return netmask >= 0 && netmask <= 32;
            },
        }
    }
</script>
