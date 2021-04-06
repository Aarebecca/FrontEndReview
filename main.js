
//========================================================================
// 绘制图形
//在一个 html canvas 画布上绘制一百个圆，点击其中的一个圆，将其绘制在最上面（原先的绘制不保留），并设置不同的颜色，要求：
//• 能够点击选中圆
//• 将选中的圆绘制在最上面（用阴影描边来凸显），其他的圆的绘制顺序不变
//========================================================================

/*
 * 2021/03/12
 * created by Yang Tao
 */


var conf = {
    width: 1000,  // 画布宽度
    height: 1000,  // 画布高度
    maxCircleRadius: 100,  // 圆的最大半径
    maxCircleNums: 100,  // 绘制的圆的数量
    shadowBlur: 10,  // 阴影程度
    shadowOffsetX: 5,  // 水平阴影偏移
    shadowOffsetY: 5,  // 垂直阴影偏移
    borderShadowColor: "black",  // 阴影描边颜色
}

window.onload = function () {
    cvs = new Circles(document.getElementsByTagName("body")[0], conf);
    cvs.drawCircles("randomInit");
}

/**
 * @class Circles
 */
class Circles {
    constructor(container, config) {
        this.config = config;
        let el = document.createElement("canvas")
        // 设置属性
        el.setAttribute("id", "cvs");
        el.setAttribute("width", config.width);
        el.setAttribute("height", config.height);
        container.appendChild(el);
        this.ctx = el.getContext("2d");
        // 圆的轨迹，越靠后的越在上层
        this.circles = [];
        // 绑定事件
        // 点击区域所在的圆重新绘制成
        el.addEventListener("click", event => {
            // 获取点击中心坐标
            let x = event.pageX - el.getBoundingClientRect().left;
            let y = event.pageY - el.getBoundingClientRect().top;
            // 选中的圆的索引
            let clickedCircle = [];
            this.circles.forEach((c, i) => {  // 判断点击到的圆
                if (this.ctx.isPointInPath(c.path, x, y)) {
                    clickedCircle.push(i);
                }
            })
            if (clickedCircle.length > 0) {  // 有圆被点击到
                // 被点击的最上面的圆置顶
                this.circles.push(...this.circles.splice(clickedCircle.pop(), 1));
                this.drawCircles("rerender");
            }
        })
    }

    /**
     * 画布中绘制一个圆
     *
     * @param {Object} attr 圆的属性
     * @param {Boolean} hasBorderShadow 是否显示阴影
     * @memberof Circles
     */
    drawCircle(attr, hasBorderShadow = false) {
        let _ctx = this.ctx
        let _config = this.config
        // 保存状态
        _ctx.save()
        // 新建路径
        let arc = new Path2D();
        // 绘制圆型
        arc.moveTo(attr.cx, attr.cy)
        arc.arc(attr.cx, attr.cy, attr.r, 0, Math.PI * 2, true);
        if (hasBorderShadow) {  // 设置阴影
            _ctx.shadowColor = _config.borderShadowColor;
            _ctx.shadowOffsetX = _config.shadowOffsetX
            _ctx.shadowOffsetY = _config.shadowOffsetY
            _ctx.shadowBlur = _config.shadowBlur;
        }
        // 颜色填充
        _ctx.fillStyle = attr.fillColor;
        _ctx.fill(arc);
        // 恢复状态
        _ctx.restore()
        // 保存路径
        if (!attr.hasOwnProperty("path")) {
            attr.path = arc;
            this.circles.push(attr);
        }
    }

    /**
     * 画布中绘制多个圆
     *
     * @param {mode} 绘图模式 
     *  rerender: 重新绘制
     *  randomInit: 随机初始化绘制
     * @memberof Circles
     */
    drawCircles(mode) {
        if (mode === "rerender") {  // 根据this.circles重新绘制
            // 擦除画布
            this.ctx.clearRect(0, 0, this.config.width, this.config.height);
            this.circles.forEach((v, i) => {
                if (this.config.maxCircleNums - 1 === i) {  // 最上层的颜色
                    // 设置带阴影
                    this.drawCircle(v, true);
                } else {
                    this.drawCircle(v);
                }
            })
        } else if (mode === "randomInit") {  // 进行随机初始化绘制
            for (let i = 0; i < this.config.maxCircleNums; i++) {
                this.drawCircle.call(this, this.createCircleAttr(mode));
            }
        }
    }

    /**
     * 生成圆的属性
     * 这里默认使用随机方法生成
     * 
     * @param {string} [method="default"]
     * @memberof Circles
     */
    createCircleAttr(method) {
        switch (method) {
            case "randomInit":
                let _config = this.config
                let getRadomInt = (upper, lower = 0) => {
                    return Math.random() * (upper - lower + 1) + lower;
                }
                let radius = getRadomInt(this.config.maxCircleRadius);
                return {
                    r: radius,
                    cx: getRadomInt(radius + _config.shadowOffsetX, _config.width - radius - _config.shadowOffsetX),
                    cy: getRadomInt(radius + _config.shadowOffsetY, _config.height - radius - _config.shadowOffsetY),
                    fillColor: `rgb(${getRadomInt(255)}, ${getRadomInt(255)}, ${getRadomInt(255)})`
                }
            default: break;
        }
    }
}


