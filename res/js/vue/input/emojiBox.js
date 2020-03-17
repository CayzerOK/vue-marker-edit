let emojiBox = Vue.component('emojiBox', {
    data: function () {
        return {
            items: {
                0: {img:"<img src='https://gdekluet.ru//site/files/site_smile/3c/21/ulibaetsya.gif' class='sm' title='Улыбается'>"}
            },
            showEmoji: false,
            emoID: 0,
            hideTimer: null
        }
    },
    template:
        '<div @mouseover="stopHiding" @mouseleave="startHiding">' +
        '   <div @click="toggleEmoji" class="emoji btn" v-html="items[emoID].img"></div>' +
        '   <div v-if="showEmoji" class="emojibox">' +
        '       <div @click="pasteEmoji(item.bbcode)" class="emojiItem" v-for="item in items" v-html="item.img"></div>' +
        '   </div>'+
        '</div>',

    methods: {
        pasteEmoji(code) {
            this.showEmoji = false;
            this.$emit('pasteEmoji', code)
        },
        toggleEmoji () {
            this.showEmoji = !this.showEmoji;
        },
        stopHiding() {
            clearTimeout(this.hideTimer)
        },
        startHiding () {
            this.hideTimer = setTimeout(() => this.hideBox(), 1000);
        },
        hideBox() {
            this.showEmoji = false;
            this.emoID = Math.round(Math.random() * (this.items.length-1));
        }
    },
    created () {
        let formData = new FormData();
        formData.set('data', JSON.stringify(
            { cmd:'site_controller_marker:getEmotes',}
        ));

        axios({
            method: 'post',
            url: '/mod/pub/json.php',
            data: formData,
            config: { headers: {'Content-Type': 'multipart/form-data' }}
        }).then( response => {
                this.items = JSON.parse(response.data.data);
            }
        )
    }
});