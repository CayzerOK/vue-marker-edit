Vue.component('marker-title', {
    props: ['value', "default", 'limit'],
    data: function () {
        return {
            text: "",
            placeholder: "Заголовок вашего поста..."
        }
    },
    template:
        '<div class="titleWrapper">' +
        '   <span class="titleError" v-if="limit<text.length">Слишком длинный</span>' +
        '   <input class="titleInput" type="text" :input="$emit(\'input\', text)" :id="\'textarea_\'+this._uid" v-model="text" :placeholder="placeholder"/>' +
        '</div>',
    mounted() {
        this.text = this.b64DecodeUnicode(this.default);
        this.$emit('input', this.text)
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