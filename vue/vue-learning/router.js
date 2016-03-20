
var Hello = Vue.extend({
    template: "<p>hello is me</p>"
});
var World = Vue.extend({
    template: "<h3>this my world</h3>"
});
var router = new VueRouter();
var App = Vue.extend({});
router.map({
    "/hello": {
        component: Hello
    },
    "/world": {
        component: World
    }
});
router.start(App, "#app");
