Vue.component('switch-toggle', {
    props: {
        name: String,
        first: String,
        second: String,
        default: Number,
        value: Boolean,
    },
    data: function() {
        return {
            item: false
        }
    },
    created() {
      this.item = (this.default === 2);
        this.$emit('input', this.item)
    },
    methods:{
        on() {
            this.item = true;
            this.$emit('input', this.item)
        },
        off() {
            this.item = false;
            this.$emit('input', this.item)
        },
        toggle() {
            this.item = !this.item;
            this.$emit('input', this.item)
        }
    },
    template:
        `<div class="switchWrapper">
            <div @click="off" :class="{ active: !item }" class="switchItem left">{{first}}</div>
            <div class="onoffswitch">
                <input @change="toggle" :checked="item"  type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch">
                <label class="onoffswitch-label" for="myonoffswitch">
                    <span class="onoffswitch-inner"></span>
                    <span class="onoffswitch-switch"></span>
                </label>
            </div>
            <div @click="on" :class="{ active: item }" class="switchItem right">{{second}}</div>
        </div>`,
});