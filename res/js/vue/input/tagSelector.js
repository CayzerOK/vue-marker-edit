Vue.component('tag-selector', {
    props: {
        switch: Boolean,
        type: String,
        target: String,
        tagname: String,
        marker: Number,
        value: Object
    },
    data: function() {
        return {
            show: false,
            items: [{id:0, item: "Загрузка...", selected: true}],
            search: ""
        }
    },
    computed: {
        selectedItems: function () {
            return this.items.filter(function (item) {
                return item.selected;
            });
        },
        filtred: function () {
            let root = this;
            return this.items.filter(function (item) {
                return (item.selected || item.item.includes(root.search))
            });
        }
    },
    template:
        `<div class="tagSelector">   
            <div  class="tagTitle">{{tagname}}
                <div v-if="show" class="tagSearchWrap">
                    <img class="searchICO" src='/site/res/img/vue/search.svg'>
                     <input v-model="search" class="tagSearch" type="text">
                </div>
            </div>   
            <div @click="toggle()" v-if="!show" class="tagList">       
                <div class="tag selected" v-for="item in selectedItems">{{item.item}}</div>      
                <div class="tag unselected" v-if="selectedItems.length<1">Выбрать...</div>   
            </div>    
            <div v-if="show" class="tagList">
                <div @click="toggle()" v-if="show" class="closeBTN">ОК</div>
                <div :class="{ selected: item.selected, unselected: !item.selected }" class="tag" @click="select(item.id)" v-for="item in filtred">{{item.item}}</div>   
            </div>
        </div>`,
    created() {
        let root = this;

        let formData = new FormData();
        formData.set('data', JSON.stringify(
            {
                cmd: root.target,
                type: root.type,
                markerID: root.marker
            }
        ));
        axios({
            method: 'post',
            url: '/mod/pub/json.php',
            data: formData,
            config: { headers: {'Content-Type': 'multipart/form-data'}}
        }).then(function (response) {
            response = JSON.parse(response.data.data);
            root.items = response;
            root.value[root.type] = root.selectedItems;
            root.$emit('input', root.value)
        })
    },
    methods: {
        toggle() {
            this.show = !this.show
        },
        select(item) {
            let itemIndex = this.items.findIndex((obj => obj.id === item));
            if (this.switch) {
                for (item in this.items) {
                    this.items[item].selected = false
                }
            }
            this.items[itemIndex].selected = !this.items[itemIndex].selected;
            this.value[this.type] = this.selectedItems;
            this.$emit('input', this.value)
        },
    }
});