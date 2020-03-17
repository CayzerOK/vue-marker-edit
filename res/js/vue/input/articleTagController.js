Vue.component('article-controller', {
    props: {
        value: Object,
        marker: Number
    },
    data: function () {
        return {
            item: {},
            state:{
                showDatepicker: false,
                showFishTag: false,
                showBaitTag: false,
                showMapPicker: false,
                showWayOfFishing: false
            }
        }
    },
    methods: {
        setState(value) {
            this.value.tags = this.item;
            let state = {
                showDatepicker: false,
                showFishTag: false,
                showBaitTag: false,
                showMapPicker: false,
                showWayOfFishing: false
            };

            this.item.articleType.filter(function (item) { //костыль из-за очень странного поведения обсервера
                switch (item.id) {
                    case '1': {
                        state.showMapPicker = true;
                        break;
                    }
                    case '10': {
                        state.showMapPicker = true;
                        break;
                    }
                    case '9': {
                        state.showBaitTag = true;
                        break;
                    }
                    case '7': {
                        state.showFishTag = true;
                        break;
                    }
                    case '8': {
                        state.showWayOfFishing = true;
                        break;
                    }
                }
                return true;
            });

            this.state = state;
        }
    },
    template:
        `<div class='articleController'>
            <tag-selector @input="setState" :value='item' :marker='marker' tagname='Тип статьи:' type='articleType' target='site_controller_marker:getTags'></tag-selector>
            <tag-selector v-if='state.showFishTag' v-model="value.tags" :marker='marker' tagname='Упоминаемая рыба:' type='fish' target='site_controller_marker:getTags'></tag-selector>
            <tag-selector v-if='state.showBaitTag' v-model="value.tags" :marker='marker' tagname='Упоминаемые приманки и прикормки:' type='bait' target='site_controller_marker:getTags'></tag-selector>
            <tag-selector v-if='state.showWayOfFishing' v-model="value.tags" :marker='marker' tagname='Упоминаемые способы и снасти:' type='wayOfFishing' target='site_controller_marker:getTags'></tag-selector>
            <map-picker v-if='state.showMapPicker' v-model='value.coords' title='Упоминаемое место:' :marker='marker'></map-picker>
        </div>`
});