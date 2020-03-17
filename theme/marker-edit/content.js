$(function(){
    var app = new Vue({
        el: '#markeredit',
        data: {
            loading:false,
            marker: 0,
            item: {
                date: new Date(),
                title: '',
                text: '',
                tags: {}
            },
        },
        methods: {
            serializeTags(tagArray) {
                let result = "";
                let pad = "00000";
                for (let tag in tagArray) {
                    let str = "" + tagArray[tag].id;
                    result +=" "+pad.substring(0, pad.length - str.length) + str
                }
                return result
            },
            save(pub, auto = false) {
                if (!auto) {
                    this.loading = true;
                }
                let root = this;
                let formData = new FormData();

                let data = {
                    cmd:'site_controller_editMarker:savePost',
                    title: root.item.title,
                    text: root.item.text,
                    markerID: root.marker,
                    publish: pub,
                };

                if (root.item.recipeType != null) {
                    let recipeType;
                    if (root.item.recipeType) {
                        recipeType = 2;
                    } else {
                        recipeType = 1;
                    }
                    data['recipeType'] = recipeType;
                }

                if (root.item.addtionalOne != null) {
                    let addtionalOne;
                    if (root.item.addtionalOne) {
                        addtionalOne = 2;
                    } else {
                        addtionalOne = 1;
                        root.item.tags['vendor'] = null
                    }
                    data['addtionalOne'] = addtionalOne;
                }

                if (root.item.additionalText!=null) {
                    data['additionalText'] =  root.item.additionalText;
                }
                if (root.item.coords!=null) {
                    data['coords'] =  root.item.coords[1]+','+root.item.coords[0];
                }
                if (root.item.date!=null) {
                    data['date'] =  root.item.date.getFullYear()+"-"+root.item.date.getMonth()+"-"+root.item.date.getDay()+" 00:00:00";
                }

                for (let group in root.item.tags) {
                    data[group] = root.serializeTags(root.item.tags[group]);
                }


                formData.set('data', JSON.stringify(data));


                axios({
                    method: 'post',
                    url: '/mod/pub/json.php',
                    data: formData,
                    config: { headers: {'Content-Type': 'multipart/form-data'}}
                }).then(function (response) {
                    console.log(response);
                    root.loading = false;
                    if (response.data.data.done) {
                        window.location.href = "/user/addpublication/#draftblock";
                    } else {
                        alert(response.data.data)
                    }
                })
            }
        }
    })
});