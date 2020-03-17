<?
tmp::vue(true);
tmp::js("https://api-maps.yandex.ru/2.1/?lang=ru_RU&amp;apikey=36fab89a-2783-4691-a3a9-dafce967ecd4");
tmp::vuecomp('input/photoLoader');
tmp::vuecomp('input/vue-datepicker-local');
tmp::vuecomp('input/tagSelector');
tmp::vuecomp('input/articleTagController');
tmp::vuecomp('input/youTube');
tmp::vuecomp('input/switch');
tmp::vuecomp('input/mapPicker');
tmp::vuecomp('input/markerTitle');
tmp::vuecomp('/htmlGate');
tmp::vuecomp('input/emojiBox');
tmp::vuecomp('input/textInput');

tmp::add("center", "content");
tmp::exec("/site/demopage/layout");