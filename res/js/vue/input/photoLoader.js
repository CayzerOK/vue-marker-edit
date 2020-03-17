let photoLoader = Vue.component('photoLoader', {
    props: {
        marker: Number,
        limit: Boolean
    },

    data: function () {
        return {
            edit: null,
            items: [],
            process: {
                errors: '',
                files: null,
                uploading:0,
                uploaded:0
            }
        }
    },

    template:
        '<div class="photoLoader">' +
        '   <div class="imgWrapper">' +
        '       <div v-for="(item, index) in items" :key="item.id" class="preview">' +
        '           <img class="prevImg" :src="item.img" alt="Ваше фото">' +
        '           <div class="imgText">{{item.desc}}</div>' +
        '           <controls v-if="edit===null" v-on:imgEditDesc="editDesc" v-on:imgMove="moveImage" v-on:loadImages="loadImages" :index="index" :max="items.length-1" :id="item.id"/>' +
        '           <div v-if="edit===index" class="imgTextWrapper">' +
        '               <textarea :id="index" class="imgTextarea"  placeholder="Описание фото..." v-model="item.desc"/>'+
        '           </div> '+
        '       </div>' +
        '   </div>' +
        '   <div v-if="!(limit && items.length>0)" class="inputWrapper">' +
        '       <label class="loadbtn" v-if="process.uploading<1" for="newPhoto">Загрузить фото</label>' +
        '       <div class="loadbtn" style="cursor: unset" v-if="process.uploading>0">Загружено {{process.uploaded}} из {{process.uploading}}</div>' +
        '       <input @change="onChange" ref="files" type="file" accept="image/*" class="photoInput" id="newPhoto" name="newPhoto" v-bind:multiple="!limit">' +
        '   </div>' +
        '</div>',

    methods: {
        onChange (code) {
            console.log(this.$refs.files.files);
            this.process.files = this.$refs.files.files;
            this.process.uploading = this.process.files.length;
            for (let index = 0; index < this.process.uploading; index++) {
                this.upload(index);
            }
        },

        editDesc (id) {
            if(this.edit != null) {
                this.doneEdit();
            }
            this.edit = id;
        },

        doneEdit() {
            this.items[this.edit].desc = this.items[this.edit].desc.replace(/<\/?[^>]+>/ig, " ");
            let formData = new FormData();
            let data = {
                cmd:'site_controller_uploader:saveDescr',
                imgID: this.items[this.edit].id,
                descr: this.items[this.edit].desc
            };
            formData.append('data', JSON.stringify(data));
            axios({
                method: 'post',
                url: '/mod/pub/json.php',
                data: formData,
                config: { headers: {'Content-Type': 'multipart/form-data'}}
            }).then(function (response) {
            });
            this.edit = null
        },

        moveImage(event) {
            this.edit = null;
            let target = Object.assign({}, this.items[event[0]]);
            this.items[event[0]] = Object.assign({}, this.items[event[1]]);
            this.items[event[1]] = Object.assign({}, target);
            this.items = this.items.sort();

            let sort = [];
            this.items.forEach(function (item, index) {
                sort[index] = item.id
            });

            let root = this;
            let formData = new FormData();
            let data = {
                cmd:'site_controller_uploader:saveSort',
                markerID: this.marker,
                sort: sort
            };
            formData.append('data', JSON.stringify(data));
            axios({
                method: 'post',
                url: '/mod/pub/json.php',
                data: formData,
                config: { headers: {'Content-Type': 'multipart/form-data'}}
            }).then(function (response) {
                console.log(response);
            })
        },
        loadImages() {
            let root = this;
            let formData = new FormData();
            let data = {
                cmd:'site_controller_uploader:getImageList',
                sessionID: this.marker
            };
            formData.append('data', JSON.stringify(data));
            axios({
                method: 'post',
                url: '/mod/pub/json.php',
                data: formData,
                config: { headers: {'Content-Type': 'multipart/form-data'}}
            }).then(function (response) {
                try {
                    response = JSON.parse(response.data.data);
                    root.items = response;
                } catch (e) {
                    console.log(e)
                }
            })
        },
        upload(index) {
            let process = this.process;
            let loadImages = this.loadImages;
            let formData = new FormData();
            formData.append('file', process.files[index]);
            formData.append('markerID', this.marker);
            axios({
                method: 'post',
                url: '/site_controller_uploader/uploadPost/',
                data: formData,
                config: { headers: {'Content-Type': 'multipart/form-data'}}
            }).then(function (response) {
                console.log(response);
                process.uploaded++;
                if(response.data.length>0) {
                    process.errors += `Файл ${process.files[index].name}:\n ${response.data}\n\n`
                }
                if(process.uploaded>=process.uploading) {
                    if (process.errors.length>0) {
                        alert(process.errors)
                    }
                    loadImages();
                    process.uploading = 0;
                    process.uploaded = 0;
                    process.errors = '';
                }
            })
        }
    },
    created: function() {
        this.loadImages();
        let root = this;
        window.addEventListener('click', function(e){
            if (root.edit==null || e.target.id && e.target.id == root.edit) {

            } else {
                root.doneEdit();
            }
        });
    },

    components: {
        controls: {
            props: {
                id:String,
                index:Number,
                max:Number
            },
            template:
                '<div class="controls">' +
                '   <img :id="index" src="/site/res/img/vue/fileUploader/edit.svg" @click="onEdit" alt="Редактировать">' +
                '   <img :id="index" v-if="index>=1" src="/site/res/img/vue/fileUploader/back.svg" @click="onPrev" alt="Переместить">' +
                '   <img :id="index" v-if="index>=1" src="/site/res/img/vue/fileUploader/pickup.svg" @click="onMain" alt="Сделать главной">' +
                '   <img :id="index" v-if="index<max" src="/site/res/img/vue/fileUploader/next.svg" @click="onNext" alt="Переместить">' +
                '   <img :id="index" src="/site/res/img/vue/fileUploader/remove.svg" @click="onDelete" alt="Удалить">' +
                '</div>',
            methods: {
                onEdit() {
                    this.$emit('imgEditDesc', this.index)
                },
                onNext() {
                    this.$emit('imgMove', [this.index, this.index+1])
                },
                onPrev() {
                    this.$emit('imgMove', [this.index, this.index-1])
                },
                onMain() {
                    this.$emit('imgMove', [this.index, 0])
                },
                onDelete () {
                    if (confirm("Удалить фото?")) {
                        let root = this;
                        let formData = new FormData();
                        let data = {
                            cmd:'site_controller_uploader:deleteImage',
                            imgID: root.id
                        };
                        formData.append('data', JSON.stringify(data));
                        axios({
                            method: 'post',
                            url: '/mod/pub/json.php',
                            data: formData,
                            config: { headers: {'Content-Type': 'multipart/form-data'}}
                        }).then(function (response) {
                            if (response.data.data) {
                                root.$emit('loadImages')
                            }
                        })
                    }
                },
            }
        },
    },
});