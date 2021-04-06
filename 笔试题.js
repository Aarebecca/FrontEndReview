//========================================================================
// 使用 ES5 实现类的继承

// 实现 Animal 类，具备 `sleep` 方法

// 实现 Person 类继承自 Animal, 具备 `sayHello` 方法

class Animal {
  constructor() {
    // 构造函数
  }
  sleep() {
    console.log("Sleep Zzz~")
  }
}

class Person extends Animal {
  constructor(PersonName, PersonAge) {
    super()  // 调用父类构造函数
    this.name = PersonName
    this.age = PersonAge
  }
  sayHello() {
    console.log(`Hello, I'm ${this.name}, I'm ${this.age} ages old.`)
  }
}


var person = new Person('John', 18);

// test
person.sleep();     // 输出 'Sleep Zzz~ '
person.sayHello();  // 输出 "Hello, I'm John, I'm 18 ages old."
person instanceof Animal;
person instanceof Person;
//========================================================================



//========================================================================
// 编写一个简单的事件监听处理器
// 1. 具备 on 方法绑定事件
// 2. 具备 off 方法解绑事件


function EventEmitter() {
  this.events = {
    // 事件名：[事件方法,...]
  };
  let _this = this;

  return {
    /**
    * 绑定事件
    * 
    * @param {String} e 事件名
    * @param {Function} fn 事件响应方法
    */
    on: (e, fn) => {
      if (e in this.events) {// 事件已存在
        if (-1 === this.events.e.indexOf(fn)) { // 事件方法不存在
          this.events[e].push(fn);
        }
      } else {
        this.events[e] = [fn];
      }
    },

    /**
    * 移除事件
    * 
    * @param {String} e 事件名
    * @param {Function} fn 事件响应方法
    */
    off: (e, fn) => {
      if (e in this.events) {  // 事件存在
        let indexOfe = this.events[e].indexOf(fn);
        if (-1 !== indexOfe) { // 事件方法存在
          this.events[e].splice(indexOfe, 1);  // 事件队列中移除方法
          if (this.events[e].length < 1) { // 事件事件队列为空
            delete this.events.e;
          }
        }
      }
    },

    /**
    * 触发事件
    * 
    * @param {String} e 事件名
    * @param {Args} 参数列表
    */
    emit: function(e){
      if (e in _this.events) {  // 事件存在
        _this.events[e].forEach((fn) => {  // 调用事件绑定的所有方法
          // 将参数重新传递，使用arguments获取全部参数列表
          fn.apply(null, Array.prototype.slice.call(arguments, 1));
        })
      }
    }
  }
}


// test
var emitter = EventEmitter();

emitter.on('foo', function (e) {
  console.log('foo event: ', e);
});

emitter.on('*', function (e, type) {
  console.log('some event: ', e, type);
});

function onBar(e) {
  console.log('bar event: ', e);
}

emitter.on('bar', onBar);

emitter.emit('foo', { name: 'John' });
emitter.emit('bar', { name: 'John' });
emitter.emit('*', { name: 'John' }, "type");
emitter.emit('*', { name: 'John' });

emitter.off('bar', onBar);
emitter.emit('foo', { name: 'John' });
emitter.emit('bar', { name: 'John' });
//========================================================================



//========================================================================
// 绘制图形
//在一个 html canvas 画布上绘制一百个圆，点击其中的一个圆，将其绘制在最上面（原先的绘制不保留），并设置不同的颜色，要求：
//• 能够点击选中圆
//• 将选中的圆绘制在最上面（用阴影描边来凸显），其他的圆的绘制顺序不变
//========================================================================






