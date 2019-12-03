# Vue IP CIDR
A IP/CIDRNetmask input component built for Vue 2.x

![Demo](https://media.giphy.com/media/l49JMe9WDPzJTamwE/giphy.gif)

[Demo](https://peteringram0.github.io/vue-ip/)

### Install
````javascript
$ yarn add vue-ip-cidr
````


### Usage
```javascript
import VueIpCidr from 'VueIpCidr';

new Vue({
    components: {
        VueIpCidr
    },
    data() {
        return {
            ip: '127.0.0.1', // or null
            netmask: '32', // or null
        };
    },
    methods: {
        
        /**
        * Will be called on changes to IP address or netmask 
        */
        change(ip, netmask, valid) {
            console.log(ip, netmask, valid);
        }
        
    },
    template: '<vue-ip :ip="ip" :netmask="netmask" :on-change="change" theme="material"></vue-ip>'
})
```


### Supports
* Pasting (with IP or with IP and CIDR Netmask)
* IP Validation
* Optional material design theme
* Optional Netmask
* No sub dependencies

### Props
| Prop        	| Type     	| Options                             	              |
|-------------	|----------	|---------------------------------------------------- |
| on-change   	| function 	| Will be called when changes                         |
| ip          	| string   	| null or ip address '127.0.0.1'      	              |
| netmask      	| string   	| null or '32'                      	              |
| placeholder 	| boolean   | will show a dummy ip address within the placeholder |
| theme       	| string   	| 'material' (material design themed) 	              |


### License
[MIT](http://opensource.org/licenses/MIT)

#### Inspired by
[Peter Ingram](https://github.com/peteringram0/vue-ip)
