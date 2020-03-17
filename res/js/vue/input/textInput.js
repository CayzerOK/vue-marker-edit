let textInput = Vue.component('text-input', {
    props: ['value', 'default', 'min', 'max'],
    data: function () {
        return {
            text: '',
            placeholder: 'Текст вашего поста...'
        }
    },
    template:
        '<div class="textWrapper">' +
        '   <div class="control">' +
        '       <div @click="onBold" class="btn"><b>Ж</b></div>' +
        '       <div @click="onItalic" class="btn"><i>К</i></div>' +
        '       <div @click="onLink" class="btn">Ссылка</div>' +
        '       <emojiBox v-on:pasteEmoji="pasteEmoji"/>' +
        '   </div>   ' +
        '   <textarea wrap="hard" :input="$emit(\'input\', text)" :id="\'textarea_\'+this._uid" v-model="text" :placeholder="placeholder"/>' +
        '   <div class="textInfo">' +
        '       <p>Символов: {{text.length}}</p>' +
        '       <p class="error" v-show="min>text.length">Недостаточно {{min-text.length}} символов.</p>' +
        '       <p class="error" v-show="max<text.length">Более {{max}} символов.</p>' +
        '   </div>' +
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
        pasteEmoji(event) {
            let selection = this.getInputSelection();
            this.text = selection.startText+event+selection.endText;
            selection.element.focus();
            Vue.nextTick(function () {
                selection.element.selectionEnd = selection.endPosition+event.length
            })
        },
        onBold() {
            let selection = this.getInputSelection();
            this.text = selection.startText+'<b>'+selection.middleText+'</b>'+selection.endText;
            selection.element.focus();
            Vue.nextTick(function () {
                selection.element.selectionEnd = selection.endPosition+7
            })
        },
        onItalic() {
            let selection = this.getInputSelection();
            this.text = selection.startText+'<i>'+selection.middleText+'</i>'+selection.endText;
            selection.element.focus();
            Vue.nextTick(function () {
                selection.element.selectionEnd = selection.endPosition+7
            })
        },
        onLink() {
            let link = prompt("Введите ссылку");
            if (!link) {
                return;
            }
            if (!this.validURL(link)) {
                alert('Некорректная ссылка!');
                return;
            }
            let selection = this.getInputSelection();
            this.text = selection.startText+'<a href="'+link+'">'+selection.middleText+'</a>'+selection.endText;
            selection.element.focus();
            Vue.nextTick(function () {
                selection.element.selectionEnd = selection.endPosition+15+link.length
            })
        },
        getInputSelection() {
            let text = document.getElementById("textarea_"+this._uid);
            let startPosition = text.selectionStart;
            let endPosition = text.selectionEnd;
            return {
                element: text,
                startText: this.text.slice(0, startPosition),
                middleText: this.text.slice(startPosition, endPosition),
                endText: this.text.slice(endPosition, this.text.length),
                endPosition: endPosition
            };
        },
        validURL(str) {
            var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
            return !!pattern.test(str);
        }
    }
});