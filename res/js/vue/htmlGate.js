Vue.component('html-gate', {
    props: ['data', 'value'],
    data: function () {
        return {
            item: {}
        }
    },
    template:
        '<div v-if="false"/>',
    created() {
        let text = this.b64DecodeUnicode(this.data);
        this.$emit('input', JSON.parse(text))
    },
    methods: {
        b64DecodeUnicode(str) {
            // Going backwards: from bytestream, to percent-encoding, to original string.
            return decodeURIComponent(atob(str).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        },
    }
});