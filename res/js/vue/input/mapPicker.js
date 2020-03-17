let mapComp = Vue.component('map-picker', {
    props: {
        marker: Number,
        title: String,
        value: Array,
        default: String
    },
    data: function() {
        return {
            show: false,
            pickerMap: null,
            markerObj : null
        }
    },
    template:
        '<div class="mapPicker">' +
        '   <div class="mapTitle">' +
        '       <span>{{title}}</span>' +
        '   </div>' +
        '   <div v-if="value.length>1" class="coords">' +
        '       <span @click="show = true">{{value[0]}}, {{value[1]}}</span>' +
        '   <div @click="clear()" class="clearBTN">✖</div>' +
        '   </div>' +
        '   <div @click="show = true" class="coords" v-else>Выбрать...</div>' +
        '   <div v-show="show" class="mapWrapper">' +
        '       <div id="pickerMap"></div>' +
        '       <div class="saveWrapper">' +
        '           <div @click="show = false" class="savebtn">Сохранить</div>' +
        '       </div>' +
        '   </div> ' +
        '</div>',
    created() {
        this.$emit('input', []);
        if (this.default) {
            let coords = this.b64DecodeUnicode(this.default);
            coords = JSON.parse(coords);
            if (coords.y) {
                this.$emit('input', [coords.y, coords.x]);
            }
        }
        ymaps.ready(this.initMap);
    },
    methods: {
        b64DecodeUnicode(str) {
            return decodeURIComponent(atob(str).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        },
        initMap() {
            let root = this;
            root.pickerMap = new ymaps.Map("pickerMap", {
                center: [62, 95],
                zoom: 3,
                controls: ['zoomControl', 'searchControl']
            });

            root.pickerMap.events.add('click', function (e) {
                let coords = e.get('coords');
                root.$emit('input', coords);
                if (root.markerObj) {
                    root.markerObj.geometry.setCoordinates(coords);
                }
                else {
                    root.markerObj = root.createPlacemark(coords);
                    root.pickerMap.geoObjects.add(root.markerObj);
                }
            });
        },

        clear() {
            this.$emit('input', []);
            this.pickerMap.geoObjects.removeAll();
            this.markerObj = null
        },

        createPlacemark(coords) {
            return new ymaps.Placemark(coords, {
                iconCaption: 'Это было тут!'
            }, {
                preset: 'islands#redIconWithCaption',
            });
        },
    }
});



