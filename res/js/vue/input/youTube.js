Vue.component('you-tube', {
    props: {
        marker: Number,
    },
    data: function() {
        return {
            items: [],
        }
    },
    template:
        '<div class="videoLoader">' +
        '   <div class="playersWrapper">' +
        '       <div v-for="(item, index) in items" class="itemWrapper">' +
        '           <div class="controls">' +
        '               <img src="/site/res/img/vue/fileUploader/remove.svg" @click="removeItem(index)" alt="Удалить">' +
        '           </div>' +
        '           <iframe width="256" height="144"' +
        '               :src="\'https://www.youtube.com/embed/\'+item">' +
        '           </iframe>' +
        '       </div>' +
        '   </div>' +
        '   <div class="videoInput">' +
        '       <div @click="upload()" class="loadbtn">Добавить YouTube-видео</div>' +
        '   </div>' +
        '</div>',
    created() {
        this.load()
    },
    methods: {
        load() {
            let root = this;
            let formData = new FormData();
            formData.set('data', JSON.stringify(
                {
                    cmd:'site_controller_videoUploader:getVideosByArray',
                    markerID: root.marker
                }
            ));
            axios({
                method: 'post',
                url: '/mod/pub/json.php',
                data: formData,
                config: { headers: {'Content-Type': 'multipart/form-data'}}
            }).then(function (response) {
                root.items = response.data.data;
            })
        },
        removeItem(video) {
            let root = this;
            let formData = new FormData();
            formData.set('data', JSON.stringify(
                {
                    cmd:'site_controller_videoUploader:deleteVideo',
                    videoID: video
                }
            ));
            axios({
                method: 'post',
                url: '/mod/pub/json.php',
                data: formData,
                config: { headers: {'Content-Type': 'multipart/form-data'}}
            }).then(function (response) {
                console.log(response);
                root.load()
            })
        },
        upload() {
            let input = prompt("Введите ссылку на видео:", "");
            if (input == "" || !input) {
                return;
            }
            let root = this;
            let formData = new FormData();
            formData.set('data', JSON.stringify(
                {
                    cmd:'site_controller_videoUploader:addVideo',
                    markerID: root.marker,
                    youtubeID:input
                }
            ));
            axios({
                method: 'post',
                url: '/mod/pub/json.php',
                data: formData,
                config: { headers: {'Content-Type': 'multipart/form-data'}}
            }).then(function (response) {
                root.load()
            })
        }
    }
});