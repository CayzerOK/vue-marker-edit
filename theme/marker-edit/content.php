<?php
$type = $marker->data("type");
$id = $marker->data("id");
$idb64 = base64_encode(json_encode($id));
$text = base64_encode($marker->data("text"));
$title =  base64_encode($marker->data("title"));
$coords = base64_encode(json_encode($marker->coords()));
#comps = '';
switch ($type) {
    case "1":
        $date = base64_encode($marker->data("date"));
        $comps = "
            <div class='bigTitle'>Отчёт о рыбалке:</div>
            <div class='miniTitle'>Дата рыбалки:</div>
            <vue-datepicker-local v-model='item.date'></vue-datepicker-local>
            <tag-selector v-model='item.tags' :marker='$id' tagname='Пойманая рыба:' type='fish' target='site_controller_marker:getTags'></tag-selector>
            <tag-selector v-model='item.tags' :marker='$id' tagname='Снасти и способы ловли:' type='wayOfFishing' target='site_controller_marker:getTags'></tag-selector>
            <tag-selector v-model='item.tags' :marker='$id' tagname='Приманки и прикормки:' type='bait' target='site_controller_marker:getTags'></tag-selector>
            <map-picker v-model='item.coords' default='$coords' title='Место рыбалки:' :marker='$id'></map-picker>
            <div class='miniTitle'>Заголовок:</div>
            <marker-title :limit='50' v-model='item.title' default='$title'></marker-title>
            <div class='miniTitle'>Текст:</div>
            <text-input v-model='item.text' min='160' default='$text'></text-input>
            <div class='miniTitle'>Медиа:</div>
            <photo-loader :marker='$id'></photo-loader>
            <you-tube :marker='$id'></you-tube>
        ";
        break;
    case "2":
        $comps = "
            <div class='bigTitle'>Рыболовный трофей:</div>
            <div class='miniTitle'>Дата рыбалки:</div>
            <vue-datepicker-local v-model='item.date'></vue-datepicker-local>
            <map-picker v-model='item.coords' default='$coords' title='Место рыбалки:' :marker='$id'></map-picker>
            <tag-selector v-model='item.tags' :marker='$id' tagname='Пойманая рыба:' type='fish' target='site_controller_marker:getTags'></tag-selector>
            <div class='miniTitle'>Заголовок:</div>
            <marker-title :limit='50' v-model='item.title' default='$title'></marker-title>
            <div class='miniTitle'>Описание:</div>
            <text-input v-model='item.text' min='160' default='$text'></text-input>
            <div class='miniTitle'>Медиа:</div>
            <photo-loader :limit='true' :marker='$id'></photo-loader>
        ";
        break;
    case "3":
        $addText = base64_encode($marker->data('additionalText'));
        $recipeType = $marker->data('recipeType');

        $comps = "
            <div class='bigTitle'>Рецепт:</div>
            <div class='miniTitle' style='width: 100%; text-align: center'>Тип рецепта:</div>
            <switch-toggle v-model='item.recipeType' first='Блюдо из рыбы' second='Прикормка' :default='$recipeType'></switch-toggle>
            <tag-selector v-model='item.tags' :marker='$id' :tagname='item.recipeType ? \"Подходит для:\" : \"Используемая рыба:\"' type='fish' target='site_controller_marker:getTags'></tag-selector>
            <div class='miniTitle'>Заголовок:</div>
            <marker-title :limit='50' v-model='item.title' default='$title'></marker-title>
            <div class='miniTitle'>Ингредиенты:</div>
            <text-input v-model='item.additionalText' default='$addText'></text-input>
            <div class='miniTitle'>Описание приготовления:</div>
            <text-input min='160' v-model='item.text' default='$text'></text-input>
            <div class='miniTitle'>Медиа:</div>
            <photo-loader :marker='$id'></photo-loader>
            <you-tube :marker='$id'></you-tube>
        ";
        break;
    case "4":
        $comps = "
            <div class='bigTitle'>Статья:</div>
            <article-controller :marker='$id' v-model='item'></article-controller>
            <div class='miniTitle'>Заголовок:</div>
            <marker-title :limit='50' v-model='item.title' default='$title'></marker-title>
            <div class='miniTitle'>Текст:</div>
            <text-input v-model='item.text' min='160' default='$text'></text-input>
            <div class='miniTitle'>Медиа:</div>
            <photo-loader :marker='$id'></photo-loader>
            <you-tube :marker='$id'></you-tube>
        ";
        break;
    case "5":
        $addtionalOne = $marker->data("addtionalOne");
        if (!$addtionalOne) {
            $addtionalOne = 1;
        }
        $comps = "
            <div class='bigTitle'>Снасть:</div>
            <div class='miniTitle' style='width: 100%; text-align: center'>Тип снасти:</div>
            <switch-toggle v-model='item.addtionalOne' first='Самодельная' second='Фирменная' :default='$addtionalOne'></switch-toggle>
            <tag-selector v-if='item.addtionalOne' v-model='item.tags' :marker='$id' tagname='Фирма-производитель:' type='vendor' target='site_controller_marker:getTags'></tag-selector>
            <div class='miniTitle'>Название снасти:</div>
            <marker-title :limit='50' v-model='item.title' default='$title'></marker-title>
            <div class='miniTitle'>Ваши впечатления:</div>
            <text-input v-model='item.text' default='$text'></text-input>
            <div class='miniTitle'>Медиа:</div>
            <photo-loader :limit='true' :marker='$id'></photo-loader>
        ";
        break;
    case "8":
        $comps = "
            <div class='bigTitle'>Творчество:</div>
            <tag-selector :switch='true' v-model='item.tags' :marker='$id' tagname='Форма искусства:' type='artCategory' target='site_controller_marker:getTags'></tag-selector>
            <div class='miniTitle'>Название:</div>
            <marker-title :limit='50' v-model='item.title' default='$title'></marker-title>
            <div class='miniTitle'>Описание:</div>
            <text-input v-model='item.text' default='$text'></text-input>
            <div class='miniTitle'>Медиа:</div>
            <photo-loader :limit='true' :marker='$id'></photo-loader>
            <you-tube :marker='$id'></you-tube>
        ";
        break;
}
$comps .= "
            <html-gate v-model='marker' data='$idb64'></html-gate>
            <div v-if='loading' class='loading'>
                <div class='spinner'>
                    <div class='bounce1'></div>
                    <div class='bounce2'></div>
                    <div class='bounce3'></div>
                </div> 
            </div>
            <div v-else class='mainControl'>
                <div @click='save(0)' class='uploadBTN'><img class='mainBtnIcon' src='/site/res/img/vue/save.svg'> Сохранить в черновик</div>
                <div @click='save(1)' class='uploadBTN'><img class='mainBtnIcon' src='/site/res/img/vue/paper-plane.svg'> Опубликовать</div>
            </div>";
echo "
<div id='markeredit'>
    <div class='componentWrapper'>
     $comps
    </div>
</div>";