## 为什么在ios中click有一个300ms的延迟（附解决方法）

重点：**因为移动端需要判断用户是想要双击还是单击.**

ios在点击后会分别触发touchstart,touchend,click，而在touchend之后会有一个200-400ms的延迟用于确认是否为双击。



利用fastclick库可以解决这个问题

在脚手架中使用:

```js
var attachFastClick = require('fastclick');
attachFastClick(document.body);
```

OR

```js
<script type='application/javascript' src='/path/to/fastclick.js'></script>
if ('addEventListener' in document) {
	document.addEventListener('DOMContentLoaded', function() {
		FastClick.attach(document.body);
	}, false);
}
```

原理：fastclick会在touchend结束后立刻发送一个click的原生事件，并且取消掉300ms之后的click事件触发的元素默认事件

